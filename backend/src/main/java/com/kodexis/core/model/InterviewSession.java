package com.kodexis.core.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id")
    private InterviewQuestion question;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Enums.SessionState state = Enums.SessionState.WAITING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Enums.Language language = Enums.Language.JAVA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Enums.Difficulty difficulty = Enums.Difficulty.MEDIUM;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 45;

    @Column(name = "interview_mode")
    private String interviewMode = "Full Simulation";

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "last_submitted_code", columnDefinition = "TEXT")
    private String lastSubmittedCode;

    // JSON or large text string detailing the event-timeline telemetry:
    // e.g. [{"time": "08:15:30", "event": "Problem opened"}, {"time": "08:19:10", "event": "First compile failed"}]
    @Column(name = "telemetry_log", columnDefinition = "TEXT")
    private String telemetryLog = "[]";

    public InterviewSession() {
        this.startedAt = LocalDateTime.now();
    }

    public InterviewSession(User user, InterviewQuestion question, Enums.Difficulty difficulty, Enums.Language language, Integer durationMinutes, String interviewMode) {
        this();
        this.user = user;
        this.question = question;
        this.difficulty = difficulty;
        this.language = language;
        this.durationMinutes = durationMinutes;
        this.interviewMode = interviewMode;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public InterviewQuestion getQuestion() { return question; }
    public void setQuestion(InterviewQuestion question) { this.question = question; }

    public Enums.SessionState getState() { return state; }
    public void setState(Enums.SessionState state) { this.state = state; }

    public Enums.Language getLanguage() { return language; }
    public void setLanguage(Enums.Language language) { this.language = language; }

    public Enums.Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Enums.Difficulty difficulty) { this.difficulty = difficulty; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getInterviewMode() { return interviewMode; }
    public void setInterviewMode(String interviewMode) { this.interviewMode = interviewMode; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getLastSubmittedCode() { return lastSubmittedCode; }
    public void setLastSubmittedCode(String lastSubmittedCode) { this.lastSubmittedCode = lastSubmittedCode; }

    public String getTelemetryLog() { return telemetryLog; }
    public void setTelemetryLog(String telemetryLog) { this.telemetryLog = telemetryLog; }
}
