package com.kodexis.core.controller;

import com.kodexis.core.model.CandidateLog;
import com.kodexis.core.model.User;
import com.kodexis.core.repository.CandidateLogRepository;
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
    private final UserRepository userRepository;

    public CandidateLogController(CandidateLogRepository logRepository, UserRepository userRepository) {
        this.logRepository = logRepository;
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
        String candidateName = autopsyReq.getOrDefault("candidateName", username).toString();
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

    @GetMapping("/health")
    public ResponseEntity<?> checkHealth() {
        long count = logRepository.count();
        return ResponseEntity.ok(Map.of(
            "database", "MySQL",
            "table", "candidate_logs",
            "totalLogsRecorded", count,
            "status", "CONNECTED"
        ));
    }
}
