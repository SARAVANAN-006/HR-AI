const http = require('http');

const PORT = 8080;

// In-memory Database Store
const database = {
  users: [
    {
      username: 'vicky',
      password: 'password123',
      fullName: 'Vigneshwaran S P',
      role: 'ROLE_CANDIDATE',
      targetRole: 'Software Engineer',
      targetCompanies: 'NVIDIA, Google, Meta',
      experienceLevel: 'MEDIUM',
      preferredLanguage: 'PYTHON',
      readinessScore: 96,
      isOnboarded: true
    }
  ],
  sessions: {
    '101': {
      id: 101,
      question: {
        title: 'Two Sum - Hash Map Lookup',
        topic: 'Arrays / Hashing',
        expectedTimeComplexity: 'O(n)',
        expectedSpaceComplexity: 'O(n)'
      },
      language: 'JAVA',
      difficulty: 'EASY',
      state: 'DISCUSSION',
      startedAt: '2026-08-09T13:00:00',
      completedAt: '2026-08-09T13:25:00',
      lastSubmittedCode: `public class TwoSum {\n    public int[] solveTwoSum(int[] nums, int target) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
      telemetryLog: JSON.stringify([
        { time: '2026-08-09 13:05:00', event: 'Session initiated' },
        { time: '2026-08-09 13:10:00', event: 'Draft code compiled' },
        { time: '2026-08-09 13:20:00', event: 'All 18 test cases passed' },
        { time: '2026-08-09 13:25:00', event: 'Multi-Factor Assessment Engine completed' }
      ])
    }
  },
  assessments: {
    '101': {
      overallScore: 96,
      correctnessScore: 100,
      problemSolvingScore: 95,
      efficiencyScore: 95,
      codeQualityScore: 92,
      debuggingScore: 90,
      edgeCasesScore: 95,
      communicationScore: 88,
      detectedTimeComplexity: 'O(n)',
      detectedSpaceComplexity: 'O(n)',
      autopsySummary: 'Exceptional solution! The algorithm achieves optimal O(N) time complexity using a HashMap lookup strategy, passing 100% of functional test cases with high readability.',
      whatWentWell: 'Used HashMap to achieve single-pass O(N) time efficiency. Proper camelCase naming and modular structure.',
      areasToImprove: 'Consider pre-sizing initial map capacity when input array length is known.',
      interviewerFeedback: 'Outstanding performance. Bypassed brute-force nested loops and wrote clean modular code.',
      suggestedPractice: 'Sliding Window, Two Pointers, HashMap Load Factor'
    }
  }
};

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const url = req.url;
  const method = req.method;

  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    let parsedBody = {};
    try { if (body) parsedBody = JSON.parse(body); } catch (e) {}

    console.log(`[KODEXIS Backend] ${method} ${url}`);

    // --- AUTH ROUTES ---
    if (url === '/api/auth/login' && method === 'POST') {
      const user = database.users[0];
      return sendJson(res, 200, {
        token: 'kodexis_jwt_session_token_9982',
        ...user
      });
    }

    if (url === '/api/auth/register' && method === 'POST') {
      const newUser = {
        username: parsedBody.username || 'vicky',
        role: 'ROLE_CANDIDATE',
        fullName: parsedBody.fullName || 'Vigneshwaran S P',
        targetRole: 'Software Engineer',
        targetCompanies: 'NVIDIA, Google, Meta',
        experienceLevel: 'MEDIUM',
        preferredLanguage: 'PYTHON',
        readinessScore: 88,
        isOnboarded: true
      };
      return sendJson(res, 200, {
        token: 'kodexis_jwt_session_token_9982',
        ...newUser
      });
    }

    if (url === '/api/auth/me' && method === 'GET') {
      return sendJson(res, 200, database.users[0]);
    }

    if (url === '/api/auth/onboard' && method === 'POST') {
      Object.assign(database.users[0], parsedBody, { isOnboarded: true });
      return sendJson(res, 200, { message: 'Onboarding completed successfully' });
    }

    // --- PROGRESS & DASHBOARD ROUTES (Member 3) ---
    if (url === '/api/progress/dashboard' && method === 'GET') {
      return sendJson(res, 200, {
        fullName: database.users[0].fullName,
        targetRole: database.users[0].targetRole,
        targetCompanies: database.users[0].targetCompanies,
        experienceLevel: database.users[0].experienceLevel,
        preferredLanguage: database.users[0].preferredLanguage,
        readinessScore: database.users[0].readinessScore,
        skills: {
          'Arrays': 'EXPERT',
          'Strings': 'STRONG',
          'Hashing': 'EXPERT',
          'Linked Lists': 'INTERMEDIATE',
          'Stacks & Queues': 'STRONG',
          'Trees': 'DEVELOPING',
          'Graphs': 'WEAK',
          'Recursion': 'INTERMEDIATE',
          'Dynamic Programming': 'DEVELOPING',
          'Greedy Algorithms': 'INTERMEDIATE',
          'Backtracking': 'DEVELOPING',
          'Sorting & Searching': 'STRONG',
          'System Design': 'STRONG'
        },
        history: [
          {
            sessionId: 101,
            topic: 'Arrays / Hashing',
            title: 'Two Sum - Hash Map Lookup',
            difficulty: 'EASY',
            language: 'JAVA',
            score: 96,
            date: '2026-08-09T13:25:00'
          }
        ],
        weaknesses: [
          {
            topic: 'Graph Algorithms (BFS/DFS)',
            status: 'Critical Weakness',
            description: 'Traversals on directional graph cycles need additional practice.'
          },
          {
            topic: 'Edge Case Validation',
            status: 'Attention Required',
            description: 'Practice checking empty/boundary inputs prior to submission.'
          }
        ]
      });
    }

    // --- INTERVIEW SESSION ROUTES ---
    if (url.startsWith('/api/interviews/') && method === 'GET') {
      const parts = url.split('/');
      const id = parts[3];
      const sub = parts[4];

      if (sub === 'assessment') {
        const assessment = database.assessments[id] || database.assessments['101'];
        return sendJson(res, 200, assessment);
      }

      const session = database.sessions[id] || database.sessions['101'];
      return sendJson(res, 200, session);
    }

    if (url.includes('/message') && method === 'POST') {
      const userMsg = parsedBody.content || '';
      return sendJson(res, 200, {
        id: Date.now(),
        sender: 'AI_INTERVIEWER',
        content: `Excellent explanation. You mentioned using a HashMap for lookups. Please proceed to write the implementation in the code editor panel on the right.`,
        timestamp: new Date().toISOString()
      });
    }

    if (url.includes('/run') && method === 'POST') {
      return sendJson(res, 200, {
        status: 'SUCCESS',
        passedCases: 18,
        totalCases: 18,
        executionTimeMs: 14,
        memoryUsedKb: 3420,
        consoleOutput: 'Test Case 1: [2, 7, 11, 15], target = 9 -> Output: [0, 1] (PASSED)\nTest Case 2: [3, 2, 4], target = 6 -> Output: [1, 2] (PASSED)\nTest Case 3: [3, 3], target = 6 -> Output: [0, 1] (PASSED)\nAll 18 functional & hidden edge cases passed.',
        details: [
          { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', actualOutput: '[0, 1]', status: 'PASSED', executionTimeMs: 2 },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', actualOutput: '[1, 2]', status: 'PASSED', executionTimeMs: 1 }
        ]
      });
    }

    // Default Fallback
    return sendJson(res, 200, { message: 'KODEXIS HR-AI Backend Active' });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 KODEXIS HR-AI BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`   Health Check API: http://localhost:${PORT}/api/auth/me`);
  console.log(`   Assessment Dashboard: http://localhost:${PORT}/api/progress/dashboard`);
  console.log(`=======================================================`);
});
