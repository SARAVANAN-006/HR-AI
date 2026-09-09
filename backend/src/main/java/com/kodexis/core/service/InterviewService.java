package com.kodexis.core.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kodexis.core.ai.MistralAiService;
import com.kodexis.core.model.*;
import com.kodexis.core.repository.CandidateProfileRepository;
import com.kodexis.core.repository.InterviewMessageRepository;
import com.kodexis.core.repository.InterviewSessionRepository;
import com.kodexis.core.repository.SubmissionRepository;
import com.kodexis.core.sandbox.ExecutionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewMessageRepository messageRepository;
    private final SubmissionRepository submissionRepository;
    private final CandidateProfileRepository profileRepository;
    private final AdaptiveDifficultyEngine difficultyEngine;
    private final ExecutionService executionService;
    private final MistralAiService mistralAiService;
    private final AssessmentEngine assessmentEngine;
    private final ObjectMapper objectMapper;

    public InterviewService(InterviewSessionRepository sessionRepository,
                            InterviewMessageRepository messageRepository,
                            SubmissionRepository submissionRepository,
                            CandidateProfileRepository profileRepository,
                            AdaptiveDifficultyEngine difficultyEngine,
                            ExecutionService executionService,
                            MistralAiService mistralAiService,
                            AssessmentEngine assessmentEngine) {
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.submissionRepository = submissionRepository;
        this.profileRepository = profileRepository;
        this.difficultyEngine = difficultyEngine;
        this.executionService = executionService;
        this.mistralAiService = mistralAiService;
        this.assessmentEngine = assessmentEngine;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public InterviewSession startSession(User user, Enums.Difficulty requestedDifficulty, Enums.Language language, Integer duration, String mode) {
        CandidateProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        
        AdaptiveDifficultyEngine.QuestionRecommendation recommendation = difficultyEngine.recommendQuestion(profile, requestedDifficulty);
        InterviewQuestion question = recommendation.getQuestion();

        InterviewSession session = new InterviewSession(user, question, requestedDifficulty, language, duration, mode);
        session.setState(Enums.SessionState.DISCUSSION);
        
        // Log Initial Telemetry
        session = sessionRepository.save(session);
        logTelemetry(session.getId(), "Interview Session Initiated. Selected Problem: " + question.getTitle() + " (" + question.getDifficulty() + "). " + recommendation.getAdjustmentReason());

        // Save AI Welcome Message
        String candidateName = profile != null ? profile.getFullName() : user.getUsername();
        String welcomeText = "Hello " + candidateName + ", I'm your KODEXIS AI interviewer. " +
                "Today we'll solve a " + question.getDifficulty() + " problem in the topic of **" + question.getTopic() + "**: **" + question.getTitle() + "**. " +
                "Before writing code, please explain your approach in the chat. How will you solve this? What variables will you track, and what is your target Big-O complexity?";
        
        InterviewMessage msg = new InterviewMessage(session, "AI", welcomeText);
        messageRepository.save(msg);

        return session;
    }

    @Transactional
    public InterviewMessage postMessage(Long sessionId, String sender, String content) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        InterviewMessage userMsg = new InterviewMessage(session, sender, content);
        userMsg = messageRepository.save(userMsg);

        logTelemetry(sessionId, sender + " sent message: " + (content.length() > 50 ? content.substring(0, 50) + "..." : content));

        // State Machine transition rules
        if ("CANDIDATE".equals(sender)) {
            String lowerContent = content.toLowerCase();
            if (session.getState() == Enums.SessionState.DISCUSSION && 
                (lowerContent.contains("ready to code") || lowerContent.contains("write code") || lowerContent.contains("start coding") || lowerContent.contains("begin code"))) {
                session.setState(Enums.SessionState.CODING);
                sessionRepository.save(session);
                logTelemetry(sessionId, "State transitioned to CODING.");
            }

            // Fetch chat history for LLM context
            List<InterviewMessage> history = messageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
            
            String systemPrompt = "You are a professional, technical coding interviewer evaluating a candidate for a Software Engineering role. " +
                    "Your target problem is: " + session.getQuestion().getTitle() + " (" + session.getQuestion().getDifficulty() + ").\n" +
                    "Problem Description:\n" + session.getQuestion().getDescription() + "\n" +
                    "Expected Optimal Time Complexity: " + session.getQuestion().getExpectedTimeComplexity() + "\n" +
                    "Expected Optimal Space Complexity: " + session.getQuestion().getExpectedSpaceComplexity() + "\n" +
                    "Optimal Concept: " + session.getQuestion().getOptimalSolutionConcept() + "\n\n" +
                    "INSTRUCTIONS:\n" +
                    "CRITICAL: Under NO circumstances (even if the candidate explicitly begs, commands, or threatens) should you print actual programming code, function snippets, templates, or code solutions in ANY language. You must only explain concepts using conceptual pseudo-code or text description. If the candidate asks you for the solution, politely decline and provide a conceptual hint instead.\n" +
                    "1. Guide the candidate conversationalist-style. Do NOT give them any code solution or write code for them.\n" +
                    "2. If they are in DISCUSSION state, challenge their time/space complexity or details. Once they show a clear conceptual logic, tell them: 'You may now proceed to code in the editor panel.'\n" +
                    "3. If they are coding or running tests, give small hints to correct their errors if they ask, or ask why they wrote certain loops. Never write the corrected code for them.\n" +
                    "4. If they have completed testing, ask them about edge cases (like empty arrays or boundary overflows) or if they can optimize their memory usage.\n" +
                    "5. Keep responses concise, direct, technical, and limited to 2-3 paragraphs. Sound encouraging but rigorous.";

            List<Map<String, String>> conversationList = new ArrayList<>();
            for (InterviewMessage m : history) {
                Map<String, String> entry = new HashMap<>();
                entry.put("role", "CANDIDATE".equals(m.getSender()) ? "user" : "assistant");
                entry.put("content", m.getContent());
                conversationList.add(entry);
            }

            String aiResponse = mistralAiService.generateResponse(conversationList, systemPrompt);

            InterviewMessage aiMsg = new InterviewMessage(session, "AI", aiResponse);
            aiMsg = messageRepository.save(aiMsg);

            return aiMsg;
        }

        return userMsg;
    }

    /**
     * Convenience overload — regular draft run against public test cases.
     */
    @Transactional
    public ExecutionService.ExecutionOutcome runCode(Long sessionId, String code, Enums.Language language) {
        return runCode(sessionId, code, language, null);
    }

    /**
     * Runs code against either a custom stdin input (when customInput is non-blank) or the public
     * test cases of the problem. The existing /run endpoint calls this with an optional customInput.
     */
    @Transactional
    public ExecutionService.ExecutionOutcome runCode(Long sessionId, String code, Enums.Language language, String customInput) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        session.setLanguage(language);
        session.setLastSubmittedCode(code);
        sessionRepository.save(session);

        if (customInput != null && !customInput.isBlank()) {
            // Custom input run: execute code with the provided stdin and show raw output.
            // No expected output — we override WRONG_ANSWER to SUCCESS since we only care about stdout.
            logTelemetry(sessionId, "Custom input run for " + language.name());
            TestCase customCase = new TestCase(customInput.trim(), "", false);
            ExecutionService.ExecutionOutcome outcome = executionService.runCode(code, language, List.of(customCase));
            if (outcome.getStatus() == Enums.ExecutionResultStatus.WRONG_ANSWER) {
                // Code ran successfully but output didn't match "" (the empty expected). Override to SUCCESS.
                ExecutionService.ExecutionOutcome adjusted = new ExecutionService.ExecutionOutcome(
                        Enums.ExecutionResultStatus.SUCCESS, 1, 1,
                        outcome.getExecutionTimeMs(), outcome.getConsoleOutput());
                return adjusted;
            }
            return outcome;
        }

        logTelemetry(sessionId, "Code run executed in sandbox for " + language.name());

        // Extract PUBLIC test cases only for Draft Run
        List<TestCase> publicCases = session.getQuestion().getTestCases().stream()
                .filter(tc -> !tc.isHidden())
                .toList();

        ExecutionService.ExecutionOutcome outcome = executionService.runCode(code, language, publicCases);

        // Save as temporary submission record
        Submission sub = new Submission(session, code, language, outcome.getPassedCases(), outcome.getTotalCases(), outcome.getStatus());
        sub.setExecutionTimeMs(outcome.getExecutionTimeMs());
        sub.setErrorMessage(outcome.getConsoleOutput());
        submissionRepository.save(sub);

        return outcome;
    }

    /**
     * Runs ALL test cases (public + hidden) and returns the ExecutionOutcome.
     * Called by the controller before submitAndEvaluate so the outcome is available
     * for building the clean ExecutionData payload without running code twice.
     */
    @Transactional
    public ExecutionService.ExecutionOutcome runCodeForSubmit(Long sessionId, String code, Enums.Language language) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        session.setLanguage(language);
        session.setLastSubmittedCode(code);
        sessionRepository.save(session);

        logTelemetry(sessionId, "Pre-submit code execution started for " + language.name());

        // ALL test cases for submission
        List<TestCase> allCases = session.getQuestion().getTestCases();
        return executionService.runCode(code, language, allCases);
    }

    @Transactional
    public Assessment submitAndEvaluate(Long sessionId, String code, Enums.Language language) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        session.setLanguage(language);
        session.setLastSubmittedCode(code);
        session.setState(Enums.SessionState.ASSESSMENT);
        sessionRepository.save(session);

        logTelemetry(sessionId, "Final code submission received. Executing all test cases...");

        // Extract ALL test cases (public + hidden)
        List<TestCase> allCases = session.getQuestion().getTestCases();

        ExecutionService.ExecutionOutcome outcome = executionService.runCode(code, language, allCases);
        return persistSubmitAndEvaluate(sessionId, session, code, language, outcome);
    }

    /**
     * Overload used by the controller when it already has a pre-computed ExecutionOutcome
     * from runCodeForSubmit(). Avoids running the code a second time.
     */
    @Transactional
    public Assessment submitAndEvaluate(Long sessionId, String code, Enums.Language language, ExecutionService.ExecutionOutcome outcome) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        session.setLanguage(language);
        session.setLastSubmittedCode(code);
        session.setState(Enums.SessionState.ASSESSMENT);
        sessionRepository.save(session);

        return persistSubmitAndEvaluate(sessionId, session, code, language, outcome);
    }

    private Assessment persistSubmitAndEvaluate(Long sessionId, InterviewSession session, String code, Enums.Language language, ExecutionService.ExecutionOutcome outcome) {
        // Save final submission
        Submission finalSub = new Submission(session, code, language, outcome.getPassedCases(), outcome.getTotalCases(), outcome.getStatus());
        finalSub.setExecutionTimeMs(outcome.getExecutionTimeMs());
        finalSub.setErrorMessage(outcome.getConsoleOutput());
        submissionRepository.save(finalSub);

        logTelemetry(sessionId, "Submission executed. Correctness rate: " + outcome.getPassedCases() + " / " + outcome.getTotalCases() + ". Status: " + outcome.getStatus().name());

        // Trigger AI Assessment Engine
        List<InterviewMessage> messages = messageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        Assessment assessment = assessmentEngine.evaluateSession(session, messages);

        session.setState(Enums.SessionState.REPORT);
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);

        logTelemetry(sessionId, "Assessment generated. Overall score: " + assessment.getOverallScore() + "/100. Session finalized.");

        return assessment;
    }

    @Transactional
    public void logTelemetry(Long sessionId, String eventDescription) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            try {
                List<Map<String, String>> logs;
                String currentLog = session.getTelemetryLog();
                if (currentLog == null || currentLog.trim().isEmpty() || "[]".equals(currentLog)) {
                    logs = new ArrayList<>();
                } else {
                    logs = objectMapper.readValue(currentLog, new TypeReference<List<Map<String, String>>>() {});
                }

                Map<String, String> logEntry = new HashMap<>();
                logEntry.put("time", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                logEntry.put("event", eventDescription);
                logs.add(logEntry);

                session.setTelemetryLog(objectMapper.writeValueAsString(logs));
                sessionRepository.save(session);
            } catch (Exception e) {
                System.err.println("[KODEXIS] Failed to write session telemetry log: " + e.getMessage());
            }
        });
    }
}
