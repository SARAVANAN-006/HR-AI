# KODEXIS — Member 3: Multi-Factor Coding Proficiency Assessment Framework

### AI Technical Interview Intelligence & Coding Assessment Sandbox

> **Don't just write code. Prove how you think.**

KODEXIS is an AI-powered technical interview simulation and coding assessment sandbox. Member 3 delivers a comprehensive **Multi-Factor Coding Proficiency Assessment Framework** built with **Spring Boot, AI APIs, PostgreSQL/H2, and Recharts/Chart.js**.

---

## 1. Member 3 Core Feature Set

1. **Code Correctness Evaluation**:
   - Compiles and runs candidate solutions against hidden and public test suites via Piston Docker Sandbox.
   - Calculates exact test case pass rate percentages (e.g. 18/18 passed) and detects execution errors/exceptions.

2. **Time & Space Complexity Estimation**:
   - Automated asymptotic analysis of time complexity (e.g. $O(N)$, $O(N \log N)$, $O(N^2)$) and space complexity (e.g. $O(1)$, $O(N)$).
   - Generates dedicated efficiency scores based on optimal vs brute-force algorithm selection.

3. **Code Quality & Modularity Analysis**:
   - Computes cyclomatic complexity index, function line counts, single responsibility compliance, and overall modularity metrics.

4. **Static Code Analysis (Naming, Readability, Modularity)**:
   - Evaluates variable naming conventions (camelCase, descriptive naming vs single-character or magic constants).
   - AST / pattern inspection for static code smells (`UnresolvedSymbol`, `UnusedVariable`, `UnbalancedBrackets`, etc.).

5. **AI-Generated Feedback & Improvement Suggestions**:
   - Powered by NVIDIA NIM / Mistral AI APIs with deterministic fallback.
   - Generates executive autopsy summaries, key strengths ("What Went Well"), developmental points ("Areas to Improve"), scorecard feedback, refactored clean code snippets, and targeted practice recommendations.

6. **Performance Dashboard with Reports & Analytics**:
   - Interactive React dashboard (`/assessment-dashboard`, `/report`) with Recharts visual components:
     - Multi-factor radar breakdown charts
     - Interview progress trajectory line charts
     - Programming language proficiency distribution charts

7. **Progress Tracking Across Interviews**:
   - Tracks candidates' evolving performance across sequential mock interviews.
   - Updates candidate Technical DNA and cumulative readiness score percentage.

---

## 2. Technology Stack & Directory Structure

- **Backend**: Java 21, Spring Boot 3.3.2, Spring Security + JWT, JPA, Hibernate, PostgreSQL / H2 Database.
- **AI Integrations**: NVIDIA NIM API (Llama 3.1 70B / Nemotron) / Mistral AI API.
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Recharts.

```
/backend          --> Spring Boot server source (Controllers, Services, Models, Repositories)
/src              --> React TypeScript frontend source (Components, Pages, Contexts)
.env              --> NVIDIA / AI API key configuration
```

---

## 3. Configuration & API Credentials

Create a `.env` file in the root directory with your AI API keys:
```ini
NVIDIA_API_KEY=your_key_here
NVIDIA_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
NVIDIA_MODEL=nvidia/llama-3.1-nemotron-70b-instruct
```
*Note: If no API key is provided, the backend automatically triggers context-aware offline fallback responses.*

---

## 4. Run & Deployment Guide

### Prerequisites
- **Java SE Development Kit (JDK) 21** or higher.
- **Node.js** v18+ and **npm** v10+.

### Step 1: Run Backend Server
```bash
cd backend
./mvnw clean package -DskipTests
./mvnw spring-boot:run
```
The Spring Boot server binds to `http://localhost:8080`.
- **H2 Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/kodexisdb`, User: `sa`, Pass: `password`).

### Step 2: Run React Frontend
```bash
npm install
npm run dev
```
The React client runs at `http://localhost:5173`.

---

## 5. Seed Data Details
Pre-seeded evaluation credentials:
- **Candidate Username**: `vicky` | **Password**: `password` (Candidate: Vigneshwaran S P)
- **Admin Username**: `admin` | **Password**: `admin123`

---

## 6. REST API Design Summary

### Authentication
- `POST /api/auth/register` : Candidate registration.
- `POST /api/auth/login` : Return JWT token.
- `GET /api/auth/me` : Current user session.

### Assessment & Interview Engine
- `POST /api/interviews` : Start adaptive interview session.
- `POST /api/interviews/{id}/run` : Execute IDE code via sandbox runner.
- `POST /api/interviews/{id}/submit` : Run full multi-factor assessment engine.
- `GET /api/progress/dashboard` : Fetch candidate analytics and performance trajectory.

