package com.kodexis.core.controller;

import com.kodexis.core.model.*;
import com.kodexis.core.repository.AssessmentRepository;
import com.kodexis.core.repository.InterviewMessageRepository;
import com.kodexis.core.repository.InterviewSessionRepository;
import com.kodexis.core.repository.UserRepository;
import com.kodexis.core.sandbox.ExecutionService;
import com.kodexis.core.service.InterviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final InterviewSessionRepository sessionRepository;
    private final InterviewMessageRepository messageRepository;
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;

    public InterviewController(InterviewService interviewService,
                               InterviewSessionRepository sessionRepository,
                               InterviewMessageRepository messageRepository,
                               AssessmentRepository assessmentRepository,
                               UserRepository userRepository) {
        this.interviewService = interviewService;
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
    }

    public static class StartRequest {
        public Enums.Difficulty difficulty;
        public Enums.Language language;
        public Integer durationMinutes;
        public String interviewMode;
    }

    public static class MessageRequest {
        public String content;
    }

    public static class CodeRequest {
        public String code;
        public Enums.Language language;
    }

    @PostMapping
    public ResponseEntity<?> startSession(@RequestBody StartRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> optUser = userRepository.findByUsername(username);
        if (optUser.isPresent()) {
            InterviewSession session = interviewService.startSession(
                    optUser.get(),
                    request.difficulty != null ? request.difficulty : Enums.Difficulty.MEDIUM,
                    request.language != null ? request.language : Enums.Language.JAVA,
                    request.durationMinutes != null ? request.durationMinutes : 45,
                    request.interviewMode != null ? request.interviewMode : "Full Simulation"
            );
            return ResponseEntity.ok(session);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSession(@PathVariable Long id) {
        Optional<InterviewSession> optSession = sessionRepository.findById(id);
        if (optSession.isPresent()) {
            return ResponseEntity.ok(optSession.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Interview session not found"));
        }
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long id) {
        List<InterviewMessage> history = messageRepository.findBySessionIdOrderByTimestampAsc(id);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/{id}/message")
    public ResponseEntity<?> postMessage(@PathVariable Long id, @RequestBody MessageRequest request) {
        try {
            InterviewMessage aiResponse = interviewService.postMessage(id, "CANDIDATE", request.content);
            return ResponseEntity.ok(aiResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<?> runCode(@PathVariable Long id, @RequestBody CodeRequest request) {
        try {
            ExecutionService.ExecutionOutcome outcome = interviewService.runCode(id, request.code, request.language);
            return ResponseEntity.ok(outcome);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitCode(@PathVariable Long id, @RequestBody CodeRequest request) {
        try {
            Assessment assessment = interviewService.submitAndEvaluate(id, request.code, request.language);
            return ResponseEntity.ok(assessment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/assessment")
    public ResponseEntity<?> getAssessment(@PathVariable Long id) {
        Optional<Assessment> optAssessment = assessmentRepository.findBySessionId(id);
        if (optAssessment.isPresent()) {
            return ResponseEntity.ok(optAssessment.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Assessment report not found for this session"));
        }
    }
}
