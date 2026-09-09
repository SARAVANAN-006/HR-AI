<<<<<<< HEAD
# KODEXIS

### AI Technical Interview Intelligence & Coding Assessment Sandbox

> **Don't just write code. Prove how you think.**

KODEXIS is an AI-powered technical interview simulation and coding assessment sandbox. It integrates a Monaco-powered development IDE, an online Docker-sandboxed compiler API, live telemetry tracking, and a multi-factor assessment engine.

---

## 1. Core Feature Set
1. **Interactive AI Interviewer**: A conversational AI voice/waveform simulated agent powered by the **NVIDIA NIM API** that leads candidates through DSA scope evaluations, code refactor hints, and edge-case followups.
2. **Piston Sandboxed Execution**: Executes candidate solutions (Java, Python, C++, JavaScript, C) inside sandboxed runtimes securely on public EMKC servers, returning runtime time scopes, compilation bugs, and detailed test outputs.
3. **9-Factor Assessment Engine**: Computes comprehensive scores derived from:
   - *Code Correctness* (passed hidden/public cases)
   - *Problem Solving Approach*
   - *Complexity Optimization* (Big-O analysis)
   - *Code Quality* (naming, modularity, length)
   - *Edge-Case Handling* (null inputs, duplicate arrays)
   - *Debugging Resilience* (speed of compilation error resolution)
   - *Communication Logic* (conceptual explanations)
4. **Technical DNA Profile**: Evolving candidate proficiency radar chart mapping vectors across 13 major topics (Arrays, Trees, Hashing, Recursion, System Design, etc.).
5. **Interview Autopsy & Timeline**: Historical timeline log tracking developer event sequences (Problem Opened -> First Code -> Compiles -> Test runs -> Edits -> Submission -> Evaluation).

---

## 2. Technology Stack & Directory Structure
- **Backend**: Java 21, Spring Boot 3.3.2, Spring Security + JWT, JPA, Hibernate, H2 Database (with Postgres mode).
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Recharts, Framer Motion.

```
/backend          --> Spring Boot server source
/frontend         --> Vite React TypeScript source
.env              --> NVIDIA API secrets (git ignored)
.gitignore        --> Version control configurations
```

---

## 3. Configuration & API Credentials
Create a `.env` file in the root workspace directory with your NVIDIA NIM API Key.
```ini
NVIDIA_API_KEY=your_key_here
NVIDIA_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
NVIDIA_MODEL=nvidia/llama-3.1-nemotron-70b-instruct
```
*Note: If no API key is provided, the backend automatically triggers **Demo Mode** fallback using context-aware offline mock responses. This ensures 100% reliable functionality for presentations and local demonstrations.*

---

## 4. Run & Deployment Guide

### Prerequisites
- **Java SE Development Kit (JDK) 21** or higher.
- **Node.js** v18+ and **npm** v10+.

### Step 1: Run Backend Server
```bash
cd backend
# Build the Spring Boot application (using Maven wrapper if mvn path is not global)
./mvnw clean package -DskipTests
# Run the server
./mvnw spring-boot:run
```
The server will bind to `http://localhost:8080`.
- **H2 Database Console**: Accessible at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/kodexisdb`, Username: `sa`, Password: `password`).

### Step 2: Run React Frontend Client
```bash
cd frontend
npm install
npm run dev
```
The client will launch at `http://localhost:5173`.

---

## 5. Seed Data Details
The system pre-seeds realistic records for candidate evaluations on launch:
- **Candidate Username**: `vicky` | **Password**: `password`
- **Full Profile**: Vigneshwaran S P
- **Role Targets**: Software Engineer @ NVIDIA, Google, Meta
- **Seeded History**: 2 Completed mock interviews (Two Sum, Valid Parentheses) populate the Technical DNA and dashboard telemetry immediately.
- **Admin Username**: `admin` | **Password**: `admin123`

---

## 6. REST API Design Summary

### Authentication Services
- `POST /api/auth/register` : Create candidate record and profile mapping.
- `POST /api/auth/login` : Return JWT token.
- `POST /api/auth/onboard` : Update preferred language and company targets.
- `GET /api/auth/me` : Return current authenticated user.

### Interview Services
- `POST /api/interviews` : Start new interview (resolves adaptive questions).
- `GET /api/interviews/{id}` : Get session properties.
- `GET /api/interviews/{id}/messages` : Load chat history.
- `POST /api/interviews/{id}/message` : Post response to AI Interviewer.
- `POST /api/interviews/{id}/run` : Execute current IDE code on public test cases.
- `POST /api/interviews/{id}/submit` : Commit solution on all cases and execute Assessment Engine.

### Progress & Telemetry
- `GET /api/progress/dashboard` : Fetch dashboard metrics, matrices, and weakness loop diagnostic alerts.
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
>>>>>>> 9c5f859 (Initial commit)
