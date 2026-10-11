package com.kodexis.core.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_skill_telemetry", indexes = {
    @Index(name = "idx_skill_telemetry_username", columnList = "username"),
    @Index(name = "idx_skill_telemetry_topic", columnList = "topic")
})
public class CandidateSkillTelemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String topic;

    @Column(name = "proficiency_level", nullable = false)
    private String proficiencyLevel; // EXPERT, STRONG, INTERMEDIATE, DEVELOPING, NOVICE

    @Column(name = "proficiency_score", nullable = false)
    private Integer proficiencyScore; // 0 - 100

    @Column(name = "problems_attempted", nullable = false)
    private Integer problemsAttempted = 0;

    @Column(name = "problems_passed", nullable = false)
    private Integer problemsPassed = 0;

    @Column(name = "accuracy_percentage", nullable = false)
    private Double accuracyPercentage = 0.0;

    @Column(name = "avg_execution_time_ms")
    private Double avgExecutionTimeMs = 0.0;

    @Column(name = "ai_behavior_score")
    private Double aiBehaviorScore = 75.0;

    @Column(name = "identified_strengths", columnDefinition = "TEXT")
    private String identifiedStrengths;

    @Column(name = "identified_weaknesses", columnDefinition = "TEXT")
    private String identifiedWeaknesses;

    @Column(name = "ai_behavior_notes", columnDefinition = "TEXT")
    private String aiBehaviorNotes;

    @Column(name = "visual_preference")
    private String visualPreference = "BAR_CHART"; // BAR_CHART, HISTOGRAM, PIE_CHART, RADAR

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    public CandidateSkillTelemetry() {
        this.lastUpdated = LocalDateTime.now();
    }

    public CandidateSkillTelemetry(String username, String topic, String proficiencyLevel, Integer proficiencyScore) {
        this();
        this.username = username;
        this.topic = topic;
        this.proficiencyLevel = proficiencyLevel;
        this.proficiencyScore = proficiencyScore;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public Integer getProficiencyScore() { return proficiencyScore; }
    public void setProficiencyScore(Integer proficiencyScore) { this.proficiencyScore = proficiencyScore; }

    public Integer getProblemsAttempted() { return problemsAttempted; }
    public void setProblemsAttempted(Integer problemsAttempted) { this.problemsAttempted = problemsAttempted; }

    public Integer getProblemsPassed() { return problemsPassed; }
    public void setProblemsPassed(Integer problemsPassed) { this.problemsPassed = problemsPassed; }

    public Double getAccuracyPercentage() { return accuracyPercentage; }
    public void setAccuracyPercentage(Double accuracyPercentage) { this.accuracyPercentage = accuracyPercentage; }

    public Double getAvgExecutionTimeMs() { return avgExecutionTimeMs; }
    public void setAvgExecutionTimeMs(Double avgExecutionTimeMs) { this.avgExecutionTimeMs = avgExecutionTimeMs; }

    public Double getAiBehaviorScore() { return aiBehaviorScore; }
    public void setAiBehaviorScore(Double aiBehaviorScore) { this.aiBehaviorScore = aiBehaviorScore; }

    public String getIdentifiedStrengths() { return identifiedStrengths; }
    public void setIdentifiedStrengths(String identifiedStrengths) { this.identifiedStrengths = identifiedStrengths; }

    public String getIdentifiedWeaknesses() { return identifiedWeaknesses; }
    public void setIdentifiedWeaknesses(String identifiedWeaknesses) { this.identifiedWeaknesses = identifiedWeaknesses; }

    public String getAiBehaviorNotes() { return aiBehaviorNotes; }
    public void setAiBehaviorNotes(String aiBehaviorNotes) { this.aiBehaviorNotes = aiBehaviorNotes; }

    public String getVisualPreference() { return visualPreference; }
    public void setVisualPreference(String visualPreference) { this.visualPreference = visualPreference; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
