package com.kodexis.core.controller;

import com.kodexis.core.model.CandidateLog;
import com.kodexis.core.model.CandidateSkillTelemetry;
import com.kodexis.core.model.User;
import com.kodexis.core.repository.CandidateLogRepository;
import com.kodexis.core.repository.CandidateSkillTelemetryRepository;
import com.kodexis.core.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class CandidateLogController {

    private final CandidateLogRepository logRepository;
    private final CandidateSkillTelemetryRepository skillTelemetryRepository;
    private final UserRepository userRepository;

    public CandidateLogController(CandidateLogRepository logRepository,
                                  CandidateSkillTelemetryRepository skillTelemetryRepository,
                                  UserRepository userRepository) {
        this.logRepository = logRepository;
        this.skillTelemetryRepository = skillTelemetryRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/record")
    public ResponseEntity<?> recordLog(@RequestBody Map<String, Object> req) {
        String username = (String) req.get("username");
        if (username == null || username.isBlank()) {
            String authName = SecurityContextHolder.getContext().getAuthentication().getName();
            username = (authName != null && !authName.equalsIgnoreCase("anonymousUser")) ? authName : "candidate";
        }

        String action = req.getOrDefault("action", "USER_ACTION").toString();
        String page = req.getOrDefault("page", "dashboard").toString();
        String logType = req.getOrDefault("logType", "BEHAVIOR").toString();
        String details = req.getOrDefault("details", "").toString();
        String payload = req.containsKey("payload") ? req.get("payload").toString() : null;

        CandidateLog log = new CandidateLog(username, action, page, logType, details, payload);
        userRepository.findByUsername(username).ifPresent(u -> log.setUserId(u.getId()));

        CandidateLog saved = logRepository.save(log);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "logId", saved.getId(), "timestamp", saved.getTimestamp()));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserLogs(@PathVariable String username) {
        List<CandidateLog> logs = logRepository.findByUsernameOrderByTimestampDesc(username);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/autopsy")
    public ResponseEntity<?> recordAutopsy(@RequestBody Map<String, Object> autopsyReq) {
        String username = (String) autopsyReq.get("username");
        if (username == null || username.isBlank()) {
            String authName = SecurityContextHolder.getContext().getAuthentication().getName();
            username = (authName != null && !authName.equalsIgnoreCase("anonymousUser")) ? authName : "candidate";
        }

        String sessionId = autopsyReq.getOrDefault("sessionId", UUID.randomUUID().toString()).toString();
        String action = "INTERVIEW_AUTOPSY_COMPLETED";
        String details = "Session " + sessionId + " evaluated with score " + autopsyReq.getOrDefault("overallScore", "0");
        String payload = autopsyReq.toString();

        CandidateLog log = new CandidateLog(username, action, "/report", "INTERVIEW_AUTOPSY", details, payload);
        userRepository.findByUsername(username).ifPresent(u -> log.setUserId(u.getId()));

        CandidateLog saved = logRepository.save(log);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "autopsyLogId", saved.getId(), "timestamp", saved.getTimestamp()));
    }

    @GetMapping("/autopsy/{username}")
    public ResponseEntity<?> getUserAutopsies(@PathVariable String username) {
        List<CandidateLog> autopsyLogs = logRepository.findByUsernameAndLogTypeOrderByTimestampDesc(username, "INTERVIEW_AUTOPSY");
        List<Map<String, Object>> result = new ArrayList<>();
        for (CandidateLog l : autopsyLogs) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", l.getId());
            item.put("username", l.getUsername());
            item.put("timestamp", l.getTimestamp().toString());
            item.put("details", l.getDetails());
            item.put("payload", l.getPayload());
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }

    // --- DEDICATED SQL TABLE: candidate_skill_telemetry ---

    @GetMapping("/table/candidate_skill_telemetry")
    public ResponseEntity<?> getAllSkillTelemetry() {
        List<CandidateSkillTelemetry> list = skillTelemetryRepository.findAll();
        return ResponseEntity.ok(Map.of(
            "tableName", "candidate_skill_telemetry",
            "rowCount", list.size(),
            "status", "ACTIVE_RELATIONAL_PERSISTENCE",
            "data", list
        ));
    }

    @GetMapping("/table/candidate_skill_telemetry/{username}")
    public ResponseEntity<?> getUserSkillTelemetry(@PathVariable String username) {
        List<CandidateSkillTelemetry> list = skillTelemetryRepository.findByUsernameOrderByProficiencyScoreDesc(username);
        return ResponseEntity.ok(Map.of(
            "tableName", "candidate_skill_telemetry",
            "username", username,
            "rowCount", list.size(),
            "data", list
        ));
    }

    @PostMapping("/telemetry/evaluate")
    public ResponseEntity<?> updateSkillTelemetry(@RequestBody Map<String, Object> req) {
        String username = (String) req.get("username");
        if (username == null || username.isBlank()) {
            String authName = SecurityContextHolder.getContext().getAuthentication().getName();
            username = (authName != null && !authName.equalsIgnoreCase("anonymousUser")) ? authName : "candidate";
        }

        String topic = req.getOrDefault("topic", "Arrays / Hashing").toString();
        Integer score = req.containsKey("score") ? Integer.parseInt(req.get("score").toString()) : 75;
        String level = req.getOrDefault("proficiencyLevel", score >= 88 ? "EXPERT" : (score >= 74 ? "STRONG" : (score >= 58 ? "INTERMEDIATE" : (score >= 40 ? "DEVELOPING" : "NOVICE")))).toString();
        String strengths = req.getOrDefault("identifiedStrengths", "Accurate algorithm design").toString();
        String weaknesses = req.getOrDefault("identifiedWeaknesses", "Edge case coverage needed").toString();
        String behaviorNotes = req.getOrDefault("aiBehaviorNotes", "AI live performance evaluated via code compilation and tests").toString();
        String preference = req.getOrDefault("visualPreference", "BAR_CHART").toString();

        Optional<CandidateSkillTelemetry> existing = skillTelemetryRepository.findByUsernameAndTopic(username, topic);
        CandidateSkillTelemetry telemetry = existing.orElseGet(() -> new CandidateSkillTelemetry(username, topic, level, score));

        telemetry.setProficiencyScore(score);
        telemetry.setProficiencyLevel(level);
        telemetry.setProblemsAttempted(telemetry.getProblemsAttempted() + 1);
        if (score >= 60) {
            telemetry.setProblemsPassed(telemetry.getProblemsPassed() + 1);
        }
        telemetry.setAccuracyPercentage(telemetry.getProblemsAttempted() > 0 ? ((double) telemetry.getProblemsPassed() / telemetry.getProblemsAttempted()) * 100.0 : score);
        telemetry.setIdentifiedStrengths(strengths);
        telemetry.setIdentifiedWeaknesses(weaknesses);
        telemetry.setAiBehaviorNotes(behaviorNotes);
        telemetry.setVisualPreference(preference);
        telemetry.setLastUpdated(LocalDateTime.now());

        userRepository.findByUsername(username).ifPresent(u -> telemetry.setUserId(u.getId()));

        CandidateSkillTelemetry saved = skillTelemetryRepository.save(telemetry);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "telemetryId", saved.getId(), "topic", saved.getTopic(), "score", saved.getProficiencyScore()));
    }

    @PostMapping("/preferences")
    public ResponseEntity<?> saveVisualPreference(@RequestBody Map<String, Object> req) {
        String username = (String) req.get("username");
        if (username == null || username.isBlank()) {
            String authName = SecurityContextHolder.getContext().getAuthentication().getName();
            username = (authName != null && !authName.equalsIgnoreCase("anonymousUser")) ? authName : "candidate";
        }
        String preference = req.getOrDefault("visualPreference", "BAR_CHART").toString();

        List<CandidateSkillTelemetry> userSkills = skillTelemetryRepository.findByUsernameOrderByProficiencyScoreDesc(username);
        for (CandidateSkillTelemetry s : userSkills) {
            s.setVisualPreference(preference);
            s.setLastUpdated(LocalDateTime.now());
            skillTelemetryRepository.save(s);
        }

        return ResponseEntity.ok(Map.of("status", "SUCCESS", "username", username, "visualPreference", preference));
    }

    @GetMapping("/sql/schema")
    public ResponseEntity<?> getSqlSchema() {
        String ddl = """
            -- KODEXIS Dedicated SQL Relational Telemetry Table
            CREATE TABLE IF NOT EXISTS candidate_skill_telemetry (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT,
                username VARCHAR(255) NOT NULL,
                topic VARCHAR(255) NOT NULL,
                proficiency_level VARCHAR(50) NOT NULL,
                proficiency_score INT NOT NULL,
                problems_attempted INT NOT NULL DEFAULT 0,
                problems_passed INT NOT NULL DEFAULT 0,
                accuracy_percentage DOUBLE NOT NULL DEFAULT 0.0,
                avg_execution_time_ms DOUBLE DEFAULT 0.0,
                ai_behavior_score DOUBLE DEFAULT 75.0,
                identified_strengths TEXT,
                identified_weaknesses TEXT,
                ai_behavior_notes TEXT,
                visual_preference VARCHAR(50) DEFAULT 'BAR_CHART',
                last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_skill_telemetry_username (username),
                INDEX idx_skill_telemetry_topic (topic)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """;
        return ResponseEntity.ok(Map.of(
            "tableName", "candidate_skill_telemetry",
            "tableLink", "/api/logs/table/candidate_skill_telemetry",
            "schemaDdl", ddl
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<?> checkHealth() {
        long logCount = logRepository.count();
        long skillCount = skillTelemetryRepository.count();
        return ResponseEntity.ok(Map.of(
            "database", "MySQL",
            "tables", Map.of(
                "candidate_logs", logCount,
                "candidate_skill_telemetry", skillCount
            ),
            "status", "CONNECTED"
        ));
    }
}
