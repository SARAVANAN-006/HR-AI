package com.kodexis.core.repository;

import com.kodexis.core.model.CandidateLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateLogRepository extends JpaRepository<CandidateLog, Long> {
    List<CandidateLog> findByUsernameOrderByTimestampDesc(String username);
    List<CandidateLog> findByUsernameAndLogTypeOrderByTimestampDesc(String username, String logType);
    List<CandidateLog> findByUserIdOrderByTimestampDesc(Long userId);
}
