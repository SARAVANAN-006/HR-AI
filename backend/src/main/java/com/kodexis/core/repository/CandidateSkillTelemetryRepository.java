package com.kodexis.core.repository;

import com.kodexis.core.model.CandidateSkillTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CandidateSkillTelemetryRepository extends JpaRepository<CandidateSkillTelemetry, Long> {
    List<CandidateSkillTelemetry> findByUsernameOrderByProficiencyScoreDesc(String username);
    Optional<CandidateSkillTelemetry> findByUsernameAndTopic(String username, String topic);
    List<CandidateSkillTelemetry> findByUserId(Long userId);
}
