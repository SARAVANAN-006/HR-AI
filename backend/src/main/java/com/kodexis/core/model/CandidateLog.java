package com.kodexis.core.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_logs", indexes = {
    @Index(name = "idx_candidate_logs_username", columnList = "username"),
    @Index(name = "idx_candidate_logs_timestamp", columnList = "timestamp")
})
public class CandidateLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String action;

    @Column
    private String page;

    @Column(name = "log_type", nullable = false)
    private String logType; // INFO, WARN, ERROR, AUDIT, INTERVIEW_AUTOPSY, BEHAVIOR

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(columnDefinition = "LONGTEXT")
    private String payload;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public CandidateLog() {
        this.timestamp = LocalDateTime.now();
    }

    public CandidateLog(String username, String action, String page, String logType, String details, String payload) {
        this();
        this.username = username;
        this.action = action;
        this.page = page;
        this.logType = logType;
        this.details = details;
        this.payload = payload;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPage() { return page; }
    public void setPage(String page) { this.page = page; }

    public String getLogType() { return logType; }
    public void setLogType(String logType) { this.logType = logType; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
