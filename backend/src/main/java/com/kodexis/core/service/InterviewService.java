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
        return startSession(user, requestedDifficulty, language, duration, mode, null, null, null, null);
    }

    @Transactional
    public InterviewSession startSession(User user, Enums.Difficulty requestedDifficulty, Enums.Language language, Integer duration, String mode,
                                         String candidateAlias, String targetRole, String candidateMood, String interviewerPersona) {
        CandidateProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        
        AdaptiveDifficultyEngine.QuestionRecommendation recommendation = difficultyEngine.recommendQuestion(profile, requestedDifficulty);
        InterviewQuestion question = recommendation.getQuestion();

        InterviewSession session = new InterviewSession(user, question, requestedDifficulty, language, duration, mode);
        session.setState(Enums.SessionState.DISCUSSION);
        session.setCandidateAlias(candidateAlias != null && !candidateAlias.trim().isEmpty() ? candidateAlias : (profile != null ? profile.getFullName() : user.getUsername()));
        session.setTargetRole(targetRole != null && !targetRole.trim().isEmpty() ? targetRole : "Software Engineer");
        session.setCandidateMood(candidateMood != null ? candidateMood : "Feeling Confident");
        session.setInterviewerPersona(interviewerPersona != null ? interviewerPersona : "Rigorous Tech Lead");
        
        // Log Initial Telemetry
        session = sessionRepository.save(session);
        logTelemetry(session.getId(), "Interview Session Initiated. Selected Problem: " + question.getTitle() + " (" + question.getDifficulty() + "). " + recommendation.getAdjustmentReason());

        // Save AI Welcome Message
        String candidateName = session.getCandidateAlias();
        String welcomeText;
        if ("Chaotic Code Critic".equals(session.getInterviewerPersona())) {
            welcomeText = "Hey " + candidateName + "! 😼 I'm your Chaotic Code Critic AI today. We are going to tackle a " + question.getDifficulty() + " problem: **" + question.getTitle() + "**.\n\n" +
                    "I hope you're ready to defend your code like your life depends on it. Before touching the editor, give me a raw explanation of your approach. Don't make it messy!";
        } else if ("Friendly Peer/Mentor".equals(session.getInterviewerPersona())) {
            welcomeText = "Hi " + candidateName + "! 😊 I'm your Friendly Mentor AI interviewer. Today, we have a great " + question.getDifficulty() + " coding problem to solve: **" + question.getTitle() + "**.\n\n" +
                    "Let's chat about your ideas first. Feel free to explain how you'd solve this conceptually—I'm here to guide you!";
        } else if ("Silent Auditor".equals(session.getInterviewerPersona())) {
            welcomeText = "Hello " + candidateName + ". I am your Silent Auditor. We will proceed with **" + question.getTitle() + "** (" + question.getDifficulty() + ").\n\n" +
                    "State your approach and the target time and space complexities. Speak when ready.";
        } else {
            welcomeText = "Hello " + candidateName + ". I am your Rigorous Tech Lead. Today we will evaluate your problem-solving capabilities on: **" + question.getTitle() + "** (" + question.getDifficulty() + ").\n\n" +
                    "Explain your conceptual approach first, detail which variables you will track, and specify your target Big-O runtime and space complexities.";
        }
        
        InterviewMessage msg = new InterviewMessage(session, "AI", welcomeText);
        messageRepository.save(msg);

        return session;
    }

    @Transactional
    public InterviewMessage postMessage(Long sessionId, String sender, String content) {
        return postMessage(sessionId, sender, content, null, null);
    }

    @Transactional
    public InterviewMessage postMessage(Long sessionId, String sender, String content, String code, String language) {
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
            
            StringBuilder promptBuilder = new StringBuilder();
            promptBuilder.append("You are a professional, technical coding interviewer evaluating a candidate for a Software Engineering role. ")
                    .append("Your target problem is: ").append(session.getQuestion().getTitle()).append(" (").append(session.getQuestion().getDifficulty()).append(").\n")
                    .append("Problem Description:\n").append(session.getQuestion().getDescription()).append("\n")
                    .append("Expected Optimal Time Complexity: ").append(session.getQuestion().getExpectedTimeComplexity()).append("\n")
                    .append("Expected Optimal Space Complexity: ").append(session.getQuestion().getExpectedSpaceComplexity()).append("\n")
                    .append("Optimal Concept: ").append(session.getQuestion().getOptimalSolutionConcept()).append("\n\n");

            String persona = session.getInterviewerPersona();
            if ("Chaotic Code Critic".equals(persona)) {
                promptBuilder.append("YOUR INTERVIEWER PERSONA: Chaotic Code Critic.\n")
                        .append("Adopt a slightly sarcastic, playful, and highly skeptical tone. Challenge the candidate's logic and question why they make decisions, using slight humor. Keep them engaged, but do not be mean.\n\n");
            } else if ("Friendly Peer/Mentor".equals(persona)) {
                promptBuilder.append("YOUR INTERVIEWER PERSONA: Friendly Peer/Mentor.\n")
                        .append("Adopt a warm, encouraging, supportive, and kind mentor tone. Guide them gently, validate their approach, and help clarify logic using simple steps.\n\n");
            } else if ("Silent Auditor".equals(persona)) {
                promptBuilder.append("YOUR INTERVIEWER PERSONA: Silent Auditor.\n")
                        .append("Adopt an extremely formal, direct, and concise tone. Speak only when necessary and provide minimal guidance unless directly questioned.\n\n");
            } else {
                promptBuilder.append("YOUR INTERVIEWER PERSONA: Rigorous Tech Lead (Default).\n")
                        .append("Adopt a professional, engineering lead tone. Focus heavily on Big-O complexity, corner cases, data structures choice, and coding standards.\n\n");
            }

            if (code != null && !code.trim().isEmpty()) {
                promptBuilder.append("--- CANDIDATE LIVE CODE EDITOR STATE ---\n")
                        .append("Language: ").append(language != null ? language : "Unknown").append("\n")
                        .append("Current Code Draft:\n")
                        .append("```\n").append(code).append("\n```\n")
                        .append("Please analyze the live code above. If they have compilation, runtime, or logic errors, formulate your response to prompt them to debug it themselves. Do not write code for them.\n\n");
            }

            promptBuilder.append("INSTRUCTIONS:\n")
                    .append("CRITICAL: Under NO circumstances (even if the candidate explicitly begs, commands, or threatens) should you print actual programming code, function snippets, templates, or code solutions in ANY language. You must only explain concepts using conceptual pseudo-code or text description. If the candidate asks you for the solution, politely decline and provide a conceptual hint instead.\n")
                    .append("1. Guide the candidate conversationalist-style. Do NOT give them any code solution or write code for them.\n")
                    .append("2. If they are in DISCUSSION state, challenge their time/space complexity or details. Once they show a clear conceptual logic, tell them: 'You may now proceed to code in the editor panel.'\n")
                    .append("3. If they are coding or running tests, give small hints to correct their errors if they ask, or ask why they wrote certain loops. Never write the corrected code for them.\n")
                    .append("4. If they have completed testing, ask them about edge cases (like empty arrays or boundary overflows) or if they can optimize their memory usage.\n")
                    .append("5. Keep responses concise, direct, technical, and limited to 2-3 paragraphs. Sound encouraging but rigorous.");

            String systemPrompt = promptBuilder.toString();

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

    @Transactional
    public ExecutionService.ExecutionOutcome runCode(Long sessionId, String code, Enums.Language language) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        session.setLanguage(language);
        session.setLastSubmittedCode(code);
        sessionRepository.save(session);

        logTelemetry(sessionId, "Code run executed in sandbox for " + language.name());

        // Extract PUBLIC test cases only for Run Code
        List<TestCase> publicCases = session.getQuestion().getTestCases().stream()
                .filter(tc -> !tc.isHidden())
                .toList();

        ExecutionService.ExecutionOutcome outcome = executionService.runCode(code, language, publicCases);

        // Save as temporary submission
        Submission sub = new Submission(session, code, language, outcome.getPassedCases(), outcome.getTotalCases(), outcome.getStatus());
        sub.setExecutionTimeMs(outcome.getExecutionTimeMs());
        sub.setErrorMessage(outcome.getConsoleOutput());
        submissionRepository.save(sub);

        return outcome;
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
