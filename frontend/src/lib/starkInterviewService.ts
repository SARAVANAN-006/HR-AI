export interface CSCategory {
  id: string;
  name: string;
  shortCode: string;
  tagline: string;
  description: string;
  icon: string;
  topics: string[];
  sampleQuestions: {
    junior: string;
    mid: string;
    senior: string;
  };
}

export const CS_CATEGORIES: CSCategory[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    shortCode: 'DSA',
    tagline: 'Complexity, Trees, Graphs, DP & Hash Tables',
    description: 'Algorithmic efficiency, time/space complexity, asymptotic analysis, dynamic programming, and data layout.',
    icon: 'Binary',
    topics: ['Arrays & Strings', 'Hash Maps & Sets', 'Trees & Binary Search Trees', 'Graph Traversals (BFS/DFS)', 'Dynamic Programming', 'Heaps & Priority Queues', 'Sorting & Binary Search'],
    sampleQuestions: {
      junior: 'Explain the internal mechanics of a Hash Map. How does it handle hash collisions, and what is the amortized vs worst-case time complexity?',
      mid: 'How would you detect a cycle in a directed graph versus an undirected graph? Explain Topological Sort and Kahn algorithm.',
      senior: 'Walk me through how consistent hashing works in distributed caching (e.g., Memcached or Cassandra). How do virtual nodes prevent hot-spotting during node churn?'
    }
  },
  {
    id: 'os',
    name: 'Operating Systems',
    shortCode: 'OS',
    tagline: 'Kernels, Concurrency, Paging & Scheduling',
    description: 'Process management, multi-threading, synchronization primitives, virtual memory, paging, and deadlocks.',
    icon: 'Cpu',
    topics: ['Processes vs Threads', 'CPU Scheduling Algorithms', 'Virtual Memory & Paging', 'Deadlock Coffman Conditions', 'Semaphores & Mutexes', 'Inter-Process Communication (IPC)', 'System Calls & Context Switching'],
    sampleQuestions: {
      junior: 'What is the fundamental architectural difference between a Process and a Thread? How do context switches differ between them?',
      mid: 'Explain what happens at the hardware and kernel levels during a Page Fault, from TLB lookup to disk page swap.',
      senior: 'Explain the four Coffman conditions required for a Deadlock. How does modern kernel design prevent priority inversion, and what is the role of priority inheritance?'
    }
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    shortCode: 'CN',
    tagline: 'TCP/IP, OSI Model, HTTP/3, Routing & Sockets',
    description: 'Network protocol stacks, TCP 3-way handshakes, socket programming, DNS resolution, and congestion control.',
    icon: 'Network',
    topics: ['OSI 7 Layers vs TCP/IP', 'TCP 3-Way Handshake & 4-Way Teardown', 'HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)', 'DNS Resolution Flow', 'TCP Congestion Control (Cubic/BBR)', 'UDP vs TCP Trade-offs', 'WebSockets & Sockets'],
    sampleQuestions: {
      junior: 'Walk me through the exact network flow when a user types "https://google.com" into a browser and hits Enter.',
      mid: 'Compare HTTP/2 multiplexing with HTTP/3 over QUIC. How does QUIC eliminate TCP head-of-line blocking over packet loss?',
      senior: 'Explain TCP sliding window protocol and how TCP congestion control algorithms like TCP BBR and CUBIC manage bandwidth and bufferbloat.'
    }
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    shortCode: 'DBMS',
    tagline: 'ACID, B-Trees, SQL vs NoSQL, Indexing & Sharding',
    description: 'Relational query engines, storage engines, indexing strategies, transaction isolation levels, and sharding.',
    icon: 'Database',
    topics: ['ACID Properties & Transactions', 'B-Tree vs B+Tree vs LSM Trees', 'Indexing (Clustered vs Non-Clustered)', 'Transaction Isolation Levels & Anomalies', 'Normalization (1NF to BCNF)', 'Sharding & Replication Strategies', 'SQL vs NoSQL CAP Considerations'],
    sampleQuestions: {
      junior: 'What are the ACID properties in database management? Can you provide a concrete example of why Atomicity and Isolation are critical?',
      mid: 'Why do relational databases utilize B+ Trees instead of Binary Search Trees for disk-based indexing? Explain leaf node linked lists.',
      senior: 'Explain the difference between Read Committed, Repeatable Read, and Serializable isolation levels. What concurrency anomalies (Dirty Read, Non-Repeatable Read, Phantom Read, Write Skew) does each solve?'
    }
  },
  {
    id: 'system_design',
    name: 'System Design & Architecture',
    shortCode: 'SYS',
    tagline: 'Scalability, Load Balancing, Caching & Microservices',
    description: 'High-availability distributed architectures, caching layers, message queues, and trade-offs under scale.',
    icon: 'LayoutGrid',
    topics: ['Horizontal vs Vertical Scaling', 'Load Balancing Algorithms (L4 vs L7)', 'Caching Strategies (Write-Through, Write-Back)', 'CAP Theorem & PACELC', 'Message Queues (Kafka vs RabbitMQ)', 'Database Sharding & Read Replicas', 'Rate Limiting (Token Bucket, Leaky Bucket)'],
    sampleQuestions: {
      junior: 'What is the CAP Theorem, and why is it impossible for a distributed system to simultaneously guarantee Consistency, Availability, and Partition Tolerance?',
      mid: 'How would you design a distributed URL Shortener (like Bitly) handling 100 million writes per day and 1 billion reads per day?',
      senior: 'Design a distributed rate limiter that scales across multiple data centers handling 500,000 requests per second. How do you resolve race conditions and synchronization latency?'
    }
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    shortCode: 'AI',
    tagline: 'Search Algorithms, Heuristics, Knowledge Rep & Agents',
    description: 'State space search, A* heuristic algorithms, game playing (Minimax/Alpha-Beta), constraint satisfaction, and intelligent agents.',
    icon: 'BrainCircuit',
    topics: ['State Space Search & Heuristics', 'A* Search & Admissibility Criteria', 'Minimax Algorithm & Alpha-Beta Pruning', 'Constraint Satisfaction Problems (CSP)', 'Knowledge Representation & Ontologies', 'Reinforcement Learning Basics (MDP)', 'Autonomous Agent Loops (Sense-Plan-Act)'],
    sampleQuestions: {
      junior: 'Explain how the A* search algorithm works. What makes a heuristic function "admissible", and what happens if a heuristic overestimates the true cost?',
      mid: 'Describe the Minimax algorithm and how Alpha-Beta pruning optimizes the search tree without sacrificing decision optimality.',
      senior: 'How does Markov Decision Process (MDP) model decision making under uncertainty? Explain the Bellman optimality equation and the difference between Value Iteration and Policy Iteration.'
    }
  },
  {
    id: 'ml',
    name: 'Machine Learning & Deep Learning',
    shortCode: 'ML',
    tagline: 'Supervised/Unsupervised, Neural Nets & Transformers',
    description: 'Statistical learning, gradient descent, bias-variance tradeoff, regularization, and deep neural network architectures.',
    icon: 'Sparkles',
    topics: ['Supervised vs Unsupervised Learning', 'Bias-Variance Tradeoff & Overfitting', 'Gradient Descent (SGD, Adam)', 'Regularization (L1 Lasso, L2 Ridge, Dropout)', 'Convolutional & Recurrent Networks (CNN/RNN)', 'Transformer Architecture & Self-Attention', 'Evaluation Metrics (Precision, Recall, ROC-AUC, F1)'],
    sampleQuestions: {
      junior: 'Explain the bias-variance tradeoff in machine learning. How do techniques like L1 and L2 regularization prevent overfitting?',
      mid: 'How does the Scaled Dot-Product Attention mechanism operate in Transformer architectures? What is the mathematical formulation of Q, K, and V matrices?',
      senior: 'Explain vanishing and exploding gradients in deep neural networks. How do residual skip connections (ResNet) and Layer Normalization mathematically prevent gradient degradation?'
    }
  },
  {
    id: 'oop',
    name: 'OOP & Software Engineering',
    shortCode: 'OOP',
    tagline: 'SOLID Principles, Design Patterns & Clean Architecture',
    description: 'Object-oriented paradigms, inheritance vs composition, design patterns (Creational, Structural, Behavioral), and clean code.',
    icon: 'Layers',
    topics: ['Encapsulation, Abstraction, Inheritance, Polymorphism', 'SOLID Principles with Code Examples', 'Design Patterns (Factory, Singleton, Observer, Strategy)', 'Composition over Inheritance', 'Clean Code & Refactoring', 'Dependency Injection & Inversion of Control', 'Design for Testability'],
    sampleQuestions: {
      junior: 'Explain the five SOLID principles with a clear real-world code example for the Open-Closed Principle and Dependency Inversion.',
      mid: 'What is the Strategy Design Pattern? How does it differ from the State Pattern, and how does it promote loose coupling over multiple conditional switch blocks?',
      senior: 'Contrast Dependency Injection (DI) with Service Locator pattern. How does Inversion of Control (IoC) architecture enhance modularity and memory safety in large enterprise codebases?'
    }
  },
  {
    id: 'cloud_web',
    name: 'Web Technologies & Cloud DevOps',
    shortCode: 'CLOUD',
    tagline: 'REST, WebSockets, Containers, K8s & Serverless',
    description: 'Modern full-stack web standards, stateless architecture, containerization with Docker, orchestration, and CI/CD pipelines.',
    icon: 'Cloud',
    topics: ['RESTful Architecture & Idempotency', 'WebSockets vs Server-Sent Events (SSE)', 'Docker Containers vs Virtual Machines', 'Kubernetes Architecture (Pods, Deployments, Services)', 'Serverless Architecture & Cold Starts', 'CI/CD Pipelines & Zero-Downtime Deployments', 'Microservices vs Monoliths'],
    sampleQuestions: {
      junior: 'What makes an HTTP method "idempotent"? Contrast PUT vs POST vs PATCH in REST API design.',
      mid: 'How do Docker containers isolate processes using Linux namespaces and cgroups? How does this differ from hypervisor-based Virtual Machines?',
      senior: 'Explain Kubernetes pod scheduling, self-healing, and service routing via kube-proxy. How do rolling updates achieve zero-downtime deployments under high traffic?'
    }
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Cryptography',
    shortCode: 'SEC',
    tagline: 'Encryption, OWASP Top 10, Auth & Zero-Trust',
    description: 'Asymmetric and symmetric encryption, hashing algorithms, authentication protocols (OAuth/JWT), and web application security.',
    icon: 'Shield',
    topics: ['Symmetric vs Asymmetric Encryption (AES vs RSA)', 'Cryptographic Hashing & Salt (SHA-256, bcrypt)', 'OWASP Top 10 (SQL Injection, XSS, CSRF)', 'JWT Architecture & Token Security', 'OAuth 2.0 & OIDC Flow', 'HTTPS / TLS Handshake & Public Key Infrastructure', 'Zero-Trust Architecture Principles'],
    sampleQuestions: {
      junior: 'Explain Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF). How do modern frameworks and SameSite cookie attributes mitigate them?',
      mid: 'Walk me through the TLS 1.3 cryptographic handshake. How does Diffie-Hellman ephemeral key exchange guarantee Forward Secrecy?',
      senior: 'How does an authentication system securely store candidate passwords? Explain the mathematical differences between fast hash algorithms (like MD5/SHA) and memory-hard Key Derivation Functions like Argon2 or bcrypt.'
    }
  }
];

export interface StarkQuestion {
  id: string;
  phase: 'intro' | 'intro_followup' | 'category_deep' | 'category_probe' | 'wrapup';
  categoryId?: string;
  categoryName?: string;
  questionText: string;
  hints: string[];
  expectedKeywords: string[];
  depthLevel: 'icebreaker' | 'foundational' | 'deep' | 'architectural';
}

export interface StarkInterviewSession {
  sessionId: string;
  candidateName: string;
  targetRole: string;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'staff';
  selectedCategories: string[];
  totalQuestions: number;
  currentQuestionIndex: number;
  questions: StarkQuestion[];
  transcripts: {
    questionId: string;
    questionText: string;
    category?: string;
    phase: string;
    userAnswerText: string;
    score: number;
    feedback: string;
    durationSeconds: number;
    timestamp: string;
  }[];
  startedAt: string;
  completedAt?: string;
  finalEvaluation?: StarkEvaluation;
}

export interface StarkEvaluation {
  overallScore: number;
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'LEAN_HIRE' | 'NEEDS_PRACTICE';
  technicalProficiencyScore: number;
  communicationScore: number;
  conceptualDepthScore: number;
  problemSolvingScore: number;
  categoryScores: Record<string, number>;
  keyStrengths: string[];
  areasForImprovement: string[];
  detailedDebrief: string;
}

/**
 * Generate a dynamic conversational interview plan for Stark
 */
export function generateStarkInterviewPlan(
  candidateName: string,
  selectedCategoryIds: string[],
  experienceLevel: 'junior' | 'mid' | 'senior' | 'staff',
  questionCount: number = 6
): StarkQuestion[] {
  const plan: StarkQuestion[] = [];

  // Phase 1: Icebreaker / Self-Introduction (Always First!)
  plan.push({
    id: 'stark-intro-1',
    phase: 'intro',
    questionText: `Greetings ${candidateName}! I am Stark, your lead technical interviewer for today's session. Before we dive into deep technical topics, I'd like to get to know you. Could you please introduce yourself, share your technical background, and walk me through a complex project or engineering accomplishment you've tackled recently?`,
    hints: ['Mention your programming stack', 'Highlight an impactful project', 'Explain technical challenges faced'],
    expectedKeywords: ['experience', 'project', 'developed', 'built', 'architecture', 'stack', 'technologies', 'challenges'],
    depthLevel: 'icebreaker'
  });

  // Phase 2: Follow-up Question based on technical background
  plan.push({
    id: 'stark-intro-followup',
    phase: 'intro_followup',
    questionText: `Thank you for sharing that background. In that project or in your general engineering experience, what was the most difficult technical bottleneck or architectural trade-off you encountered, and how did you systematically diagnose and resolve it?`,
    hints: ['Focus on metrics and root cause analysis', 'Explain trade-offs considered', 'Show systematic debugging'],
    expectedKeywords: ['trade-off', 'performance', 'latency', 'debugging', 'database', 'optimization', 'resolution', 'scale'],
    depthLevel: 'foundational'
  });

  // Categories to draw questions from
  const activeCategories = CS_CATEGORIES.filter(c => selectedCategoryIds.includes(c.id));
  const pool = activeCategories.length > 0 ? activeCategories : CS_CATEGORIES.slice(0, 3);

  // Remaining slots for deep questions
  const remainingSlots = Math.max(2, questionCount - 2);

  for (let i = 0; i < remainingSlots; i++) {
    const category = pool[i % pool.length];
    const isProbe = i % 2 === 1;

    let questionText = '';
    const diffKey = experienceLevel === 'junior' ? 'junior' : (experienceLevel === 'staff' || experienceLevel === 'senior' ? 'senior' : 'mid');

    if (i === 0) {
      questionText = `Now let's transition into your chosen domain of ${category.name}. ${category.sampleQuestions[diffKey]}`;
    } else if (isProbe) {
      // Probing deep question
      const sample = category.sampleQuestions[diffKey];
      questionText = `Focusing on ${category.name} in a high-concurrency production setting: ${sample} How would your approach change if data volume increased by two orders of magnitude?`;
    } else {
      questionText = `Let's examine another core topic in ${category.name}: ${category.sampleQuestions[diffKey]}`;
    }

    plan.push({
      id: `stark-${category.id}-${i}`,
      phase: isProbe ? 'category_probe' : 'category_deep',
      categoryId: category.id,
      categoryName: category.name,
      questionText,
      hints: category.topics.slice(0, 3),
      expectedKeywords: category.topics.flatMap(t => t.toLowerCase().split(/[\s,&()]+/)).filter(k => k.length > 3),
      depthLevel: experienceLevel === 'senior' || experienceLevel === 'staff' ? 'architectural' : 'deep'
    });
  }

  return plan;
}

/**
 * Intelligent Answer Evaluation using multi-factor heuristics
 */
export function evaluateCandidateSpeechAnswer(
  question: StarkQuestion,
  answerText: string
): { score: number; feedback: string } {
  const clean = (answerText || '').trim();
  const wordCount = clean ? clean.split(/\s+/).length : 0;

  if (wordCount < 10) {
    return {
      score: 42,
      feedback: 'The answer was too brief. Stark expected a structured explanation detailing mechanisms, reasoning, and technical depth.'
    };
  }

  // Keyword Matching
  const lower = clean.toLowerCase();
  let matchedKeywords = 0;
  for (const kw of question.expectedKeywords) {
    if (lower.includes(kw.toLowerCase())) {
      matchedKeywords++;
    }
  }

  // Base score from explanation length & articulation
  let baseScore = Math.min(65, 45 + Math.floor(wordCount / 3));

  // Keyword relevance bonus
  const relevanceBonus = Math.min(25, matchedKeywords * 4);

  // Depth markers
  let depthBonus = 0;
  const depthTerms = ['trade-off', 'complexity', 'latency', 'concurrency', 'memory', 'cpu', 'scalability', 'failure', 'cache', 'index', 'lock', 'packet', 'optim'];
  for (const term of depthTerms) {
    if (lower.includes(term)) {
      depthBonus += 2;
    }
  }
  depthBonus = Math.min(15, depthBonus);

  const rawScore = Math.min(98, Math.max(50, baseScore + relevanceBonus + depthBonus));

  let feedback = '';
  if (rawScore >= 88) {
    feedback = `Exceptional explanation! Clear articulation of core principles with strong trade-off analysis and domain vocabulary.`;
  } else if (rawScore >= 75) {
    feedback = `Solid technical foundation. Covered key concepts cleanly; could delve further into failure recovery and edge-case behaviors.`;
  } else if (rawScore >= 60) {
    feedback = `Good conceptual awareness. Stark recommends adding concrete architecture examples and discussing algorithmic trade-offs.`;
  } else {
    feedback = `Answer touched on basics but lacked granular architectural depth. Review foundational mechanisms and implementation details.`;
  }

  return {
    score: rawScore,
    feedback
  };
}

/**
 * Generate Comprehensive Final Evaluation Report
 */
export function generateFinalStarkReport(session: StarkInterviewSession): StarkEvaluation {
  const transcripts = session.transcripts;
  if (!transcripts || transcripts.length === 0) {
    return {
      overallScore: 75,
      recommendation: 'LEAN_HIRE',
      technicalProficiencyScore: 78,
      communicationScore: 75,
      conceptualDepthScore: 72,
      problemSolvingScore: 76,
      categoryScores: {},
      keyStrengths: ['Demonstrated enthusiasm and baseline computer science foundations'],
      areasForImprovement: ['Practice structured technical articulation with the STAR framework'],
      detailedDebrief: 'Candidate demonstrated basic technical aptitude across questions.'
    };
  }

  const avgScore = Math.round(transcripts.reduce((sum, t) => sum + t.score, 0) / transcripts.length);
  const commScore = Math.min(98, Math.round(avgScore * 0.95 + (transcripts.some(t => t.userAnswerText.length > 200) ? 8 : 2)));
  const depthScore = Math.min(98, Math.max(50, Math.round(avgScore * 1.02)));
  const probScore = Math.min(98, Math.max(50, Math.round((avgScore + depthScore) / 2)));

  const categoryScores: Record<string, number> = {};
  for (const t of transcripts) {
    const cat = t.category || 'General CS';
    if (!categoryScores[cat]) {
      categoryScores[cat] = t.score;
    } else {
      categoryScores[cat] = Math.round((categoryScores[cat] + t.score) / 2);
    }
  }

  let recommendation: 'STRONG_HIRE' | 'HIRE' | 'LEAN_HIRE' | 'NEEDS_PRACTICE' = 'LEAN_HIRE';
  if (avgScore >= 88) recommendation = 'STRONG_HIRE';
  else if (avgScore >= 78) recommendation = 'HIRE';
  else if (avgScore >= 65) recommendation = 'LEAN_HIRE';
  else recommendation = 'NEEDS_PRACTICE';

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (commScore >= 80) strengths.push('Clear and structured verbal communication with natural pacing.');
  else improvements.push('Work on verbal conciseness and structuring answers with headline-first summaries.');

  if (depthScore >= 80) strengths.push('Demonstrated deep architectural insight into underlying hardware and protocols.');
  else improvements.push('Deepen understanding of low-level kernel and memory management trade-offs.');

  if (avgScore >= 75) strengths.push('Comfortable navigating complex follow-up probes under live interview pressure.');
  else improvements.push('Practice handling unexpected technical curveballs with structured problem decomposition.');

  strengths.push('Comprehensive coverage of engineering fundamentals and project context.');
  improvements.push('Incorporate quantifiable metrics (e.g. latency reduction %, throughput QPS) when discussing projects.');

  return {
    overallScore: avgScore,
    recommendation,
    technicalProficiencyScore: avgScore,
    communicationScore: commScore,
    conceptualDepthScore: depthScore,
    problemSolvingScore: probScore,
    categoryScores,
    keyStrengths: strengths,
    areasForImprovement: improvements,
    detailedDebrief: `Stark AI Interview Autopsy: Candidate demonstrated solid grasp of core computer science topics across ${session.selectedCategories.length} selected areas. Maintained steady composure on camera and articulated key principles with commendable clarity.`
  };
}
