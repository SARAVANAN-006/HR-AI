package com.kodexis.core.controller;

import com.kodexis.core.model.*;
import com.kodexis.core.repository.AssessmentRepository;
import com.kodexis.core.repository.CandidateProfileRepository;
import com.kodexis.core.repository.InterviewSessionRepository;
import com.kodexis.core.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final InterviewSessionRepository sessionRepository;
    private final AssessmentRepository assessmentRepository;

    public ProgressController(UserRepository userRepository,
                              CandidateProfileRepository profileRepository,
                              InterviewSessionRepository sessionRepository,
                              AssessmentRepository assessmentRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.sessionRepository = sessionRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = null;
        if (username != null && !username.equalsIgnoreCase("anonymousUser")) {
            user = userRepository.findByUsername(username).orElse(null);
        }
        if (user == null) {
            Map<String, Object> data = new HashMap<>();
            data.put("fullName", "Candidate");
            data.put("targetRole", "Software Engineer");
            data.put("targetCompanies", "Top Tech Companies");
            data.put("experienceLevel", "ENTRY");
            data.put("preferredLanguage", "PYTHON");
            data.put("readinessScore", 0);
            Map<String, String> skillMap = new LinkedHashMap<>();
            skillMap.put("Arrays", "DEVELOPING");
            skillMap.put("Strings", "DEVELOPING");
            skillMap.put("Hashing", "DEVELOPING");
            skillMap.put("Linked Lists", "DEVELOPING");
            skillMap.put("Stacks & Queues", "DEVELOPING");
            skillMap.put("Trees", "DEVELOPING");
            skillMap.put("Graphs", "DEVELOPING");
            skillMap.put("Recursion", "DEVELOPING");
            skillMap.put("Dynamic Programming", "DEVELOPING");
            skillMap.put("Greedy Algorithms", "DEVELOPING");
            skillMap.put("Backtracking", "DEVELOPING");
            skillMap.put("Sorting & Searching", "DEVELOPING");
            skillMap.put("System Design", "DEVELOPING");
            data.put("skills", skillMap);
            data.put("history", Collections.emptyList());
            data.put("weaknesses", Collections.emptyList());
            return ResponseEntity.ok(data);
        }
        final User finalUser = user;
        return profileRepository.findByUser(finalUser)
                .map(profile -> {
                    List<InterviewSession> sessions = sessionRepository.findByUserIdOrderByStartedAtDesc(finalUser.getId());
                            
                            // Map summaries of past sessions
                            List<Map<String, Object>> historyList = new ArrayList<>();
                            int lowEdgeCount = 0;
                            int lowDebugCount = 0;
                            int lowComplexityCount = 0;
                            int assessmentsAnalyzed = 0;

                            for (InterviewSession s : sessions) {
                                if (s.getState() == Enums.SessionState.REPORT) {
                                    Optional<Assessment> optA = assessmentRepository.findBySessionId(s.getId());
                                    if (optA.isPresent()) {
                                        Assessment a = optA.get();
                                        assessmentsAnalyzed++;
                                        Map<String, Object> sMap = new HashMap<>();
                                        sMap.put("sessionId", s.getId());
                                        sMap.put("topic", s.getQuestion().getTopic());
                                        sMap.put("title", s.getQuestion().getTitle());
                                        sMap.put("difficulty", s.getDifficulty().name());
                                        sMap.put("language", s.getLanguage().name());
                                        sMap.put("score", a.getOverallScore());
                                        sMap.put("date", s.getStartedAt().toString());
                                        historyList.add(sMap);

                                        // Count factors for weakness detection
                                        if (a.getEdgeCasesScore() < 70) lowEdgeCount++;
                                        if (a.getDebuggingScore() < 70) lowDebugCount++;
                                        if (a.getEfficiencyScore() < 70) lowComplexityCount++;
                                    }
                                }
                            }

                            // Dynamic Weakness Loop Detection (Section 43)
                            List<Map<String, String>> weaknessAlerts = new ArrayList<>();
                            if (assessmentsAnalyzed > 0) {
                                if (lowEdgeCount >= 2 || (assessmentsAnalyzed == 1 && lowEdgeCount == 1)) {
                                    Map<String, String> alert = new HashMap<>();
                                    alert.put("topic", "Edge Case Handling");
                                    alert.put("status", "Critical Weakness");
                                    alert.put("description", "Edge-case analysis has appeared as a weakness across " + lowEdgeCount + " sessions. Practice defining boundaries (empty, duplicate, single-item inputs) before writing code.");
                                    weaknessAlerts.add(alert);
                                }
                                if (lowDebugCount >= 2 || (assessmentsAnalyzed == 1 && lowDebugCount == 1)) {
                                    Map<String, String> alert = new HashMap<>();
                                    alert.put("topic", "Debugging Strategy");
                                    alert.put("status", "Developing Alert");
                                    alert.put("description", "Debugging execution errors took multiple attempts and extended durations. Focus on compiling modular blocks and running dry-runs.");
                                    weaknessAlerts.add(alert);
                                }
                                if (lowComplexityCount >= 2 || (assessmentsAnalyzed == 1 && lowComplexityCount == 1)) {
                                    Map<String, String> alert = new HashMap<>();
                                    alert.put("topic", "Complexity Awareness");
                                    alert.put("status", "Attention Required");
                                    alert.put("description", "Algorithmic time complexity fell short of target optimal bounds. Ensure you analyze the Big-O trade-offs of sorting and nested loops.");
                                    weaknessAlerts.add(alert);
                                }
                            }

                            // Build final response DTO
                            Map<String, Object> data = new HashMap<>();
                            data.put("fullName", profile.getFullName());
                            data.put("targetRole", profile.getTargetRole());
                            data.put("targetCompanies", profile.getTargetCompanies());
                            data.put("experienceLevel", profile.getExperienceLevel() != null ? profile.getExperienceLevel().name() : null);
                            data.put("preferredLanguage", profile.getPreferredLanguage() != null ? profile.getPreferredLanguage().name() : null);
                            data.put("readinessScore", profile.getReadinessScore());

                            // Skill Matrix DTO mapping
                            Map<String, String> skillMap = new LinkedHashMap<>();
                            skillMap.put("Arrays", profile.getArraysProficiency().name());
                            skillMap.put("Strings", profile.getStringsProficiency().name());
                            skillMap.put("Hashing", profile.getHashingProficiency().name());
                            skillMap.put("Linked Lists", profile.getLinkedListsProficiency().name());
                            skillMap.put("Stacks & Queues", profile.getStacksQueuesProficiency().name());
                            skillMap.put("Trees", profile.getTreesProficiency().name());
                            skillMap.put("Graphs", profile.getGraphsProficiency().name());
                            skillMap.put("Recursion", profile.getRecursionProficiency().name());
                            skillMap.put("Dynamic Programming", profile.getDynamicProgrammingProficiency().name());
                            skillMap.put("Greedy Algorithms", profile.getGreedyProficiency().name());
                            skillMap.put("Backtracking", profile.getBacktrackingProficiency().name());
                            skillMap.put("Sorting & Searching", profile.getSortingSearchingProficiency().name());
                            skillMap.put("System Design", profile.getSystemDesignProficiency().name());
                            data.put("skills", skillMap);

                            data.put("history", historyList);
                            data.put("weaknesses", weaknessAlerts);

                            return ResponseEntity.ok(data);
                        })
                        .orElseGet(() -> {
                            Map<String, Object> fallback = new HashMap<>();
                            fallback.put("fullName", finalUser.getUsername());
                            fallback.put("targetRole", "Software Engineer");
                            fallback.put("targetCompanies", "Top Tech Companies");
                            fallback.put("experienceLevel", "ENTRY");
                            fallback.put("preferredLanguage", "PYTHON");
                            fallback.put("readinessScore", 0);
                            Map<String, String> skillMap = new LinkedHashMap<>();
                            skillMap.put("Arrays", "DEVELOPING");
                            skillMap.put("Strings", "DEVELOPING");
                            skillMap.put("Hashing", "DEVELOPING");
                            skillMap.put("Linked Lists", "DEVELOPING");
                            skillMap.put("Stacks & Queues", "DEVELOPING");
                            skillMap.put("Trees", "DEVELOPING");
                            skillMap.put("Graphs", "DEVELOPING");
                            skillMap.put("Recursion", "DEVELOPING");
                            skillMap.put("Dynamic Programming", "DEVELOPING");
                            skillMap.put("Greedy Algorithms", "DEVELOPING");
                            skillMap.put("Backtracking", "DEVELOPING");
                            skillMap.put("Sorting & Searching", "DEVELOPING");
                            skillMap.put("System Design", "DEVELOPING");
                            fallback.put("skills", skillMap);
                            fallback.put("history", Collections.emptyList());
                            fallback.put("weaknesses", Collections.emptyList());
                            return ResponseEntity.ok(fallback);
                        });
    }
}
