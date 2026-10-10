-- ==========================================================
-- KODEXIS HR-AI RELATIONAL SCHEMA FOR MYSQL 8.0+
-- Dedicated Relational & Telemetry Storage Engine
-- ==========================================================

CREATE DATABASE IF NOT EXISTS kodexisdb 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE kodexisdb;

-- ----------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_CANDIDATE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. CANDIDATE PROFILES TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    target_role VARCHAR(150),
    target_companies VARCHAR(255),
    experience_level VARCHAR(50) DEFAULT 'MEDIUM',
    preferred_language VARCHAR(50) DEFAULT 'PYTHON',
    readiness_score INT DEFAULT 0,
    is_onboarded BOOLEAN DEFAULT FALSE,
    arrays_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    strings_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    hashing_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    linked_lists_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    stacks_queues_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    trees_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    graphs_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    recursion_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    dynamic_programming_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    greedy_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    backtracking_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    sorting_searching_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    system_design_proficiency VARCHAR(50) DEFAULT 'DEVELOPING',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. INTERVIEW QUESTIONS (PROBLEM BANK)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    expected_time_complexity VARCHAR(50),
    expected_space_complexity VARCHAR(50),
    optimal_solution_concept TEXT,
    java_template LONGTEXT,
    python_template LONGTEXT,
    javascript_template LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questions_topic (topic),
    INDEX idx_questions_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. TEST CASES
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS test_cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    input_data LONGTEXT NOT NULL,
    expected_output LONGTEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_testcase_question FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. INTERVIEW SESSIONS (RUNTIME TELEMETRY)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT,
    state VARCHAR(50) NOT NULL DEFAULT 'WAITING',
    language VARCHAR(50) NOT NULL DEFAULT 'PYTHON',
    difficulty VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    duration_minutes INT DEFAULT 45,
    interview_mode VARCHAR(100) DEFAULT 'Full Simulation',
    candidate_alias VARCHAR(150) DEFAULT 'Candidate',
    target_role VARCHAR(150) DEFAULT 'Software Engineer',
    candidate_mood VARCHAR(100) DEFAULT 'Feeling Confident',
    interviewer_persona VARCHAR(100) DEFAULT 'Rigorous Tech Lead',
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    last_submitted_code LONGTEXT,
    telemetry_log LONGTEXT,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_question FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE SET NULL,
    INDEX idx_sessions_user (user_id),
    INDEX idx_sessions_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. CODE SUBMISSIONS & VERIFICATIONS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    submitted_code LONGTEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    passed_test_cases INT NOT NULL DEFAULT 0,
    total_test_cases INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    execution_time_ms BIGINT,
    memory_used_kb BIGINT,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sub_session FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. ASSESSMENTS & DETAILED TECHNICAL AUTOPSIES
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL UNIQUE,
    overall_score INT NOT NULL,
    correctness_score INT NOT NULL,
    problem_solving_score INT NOT NULL,
    efficiency_score INT NOT NULL,
    code_quality_score INT NOT NULL,
    debugging_score INT NOT NULL,
    edge_cases_score INT NOT NULL,
    communication_score INT NOT NULL,
    detected_time_complexity VARCHAR(50),
    detected_space_complexity VARCHAR(50),
    autopsy_summary TEXT,
    what_went_well TEXT,
    areas_to_improve TEXT,
    interviewer_feedback TEXT,
    suggested_practice TEXT,
    CONSTRAINT fk_assessment_session FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 8. INTERVIEW DIALOGUE MESSAGES
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    sender VARCHAR(50) NOT NULL, -- 'AI' or 'CANDIDATE'
    content LONGTEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_session FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    INDEX idx_messages_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 9. CANDIDATE BEHAVIOR & AUDIT LOGS (REAL-TIME AUTOPSY STREAM)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidate_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    page VARCHAR(100),
    log_type VARCHAR(50) NOT NULL DEFAULT 'BEHAVIOR', -- INFO, WARN, ERROR, AUDIT, INTERVIEW_AUTOPSY, BEHAVIOR
    details TEXT,
    payload LONGTEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_candidate_logs_username (username),
    INDEX idx_candidate_logs_type (log_type),
    INDEX idx_candidate_logs_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
