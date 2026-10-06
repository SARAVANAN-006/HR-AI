export interface CandidateActivity {
  id: string;
  timestamp: string;
  actionType: 'SOLVE' | 'TAB_SWITCH' | 'LOGIC_GATE' | 'FULLSCREEN' | 'RUN_CODE' | 'SUBMIT';
  description: string;
  questionTitle: string;
  difficulty: string;
  status: 'PASSED' | 'FAILED' | 'WARNING' | 'INFO';
  metrics?: {
    runtimeMs?: number;
    tabSwitches?: number;
    testCasesPassed?: string;
    logicVerdict?: string;
  };
}

export interface CandidateUsageLog {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  targetRole: string;
  level: {
    number: number; // 1 to 5
    title: string;
    badgeColor: string;
    xp: number;
    readinessScore: number;
  };
  regularity: {
    tier: 'Daily Active' | 'Frequent' | 'Weekly' | 'Occasional' | 'Newcomer';
    sessionsCount: number;
    streakDays: number;
    lastActive: string;
    hoursPracticed: number;
  };
  skills: {
    domain: string;
    proficiency: 'EXPERT' | 'STRONG' | 'INTERMEDIATE' | 'DEVELOPING' | 'WEAK';
  }[];
  recentActivities: CandidateActivity[];
}

export const SEED_USERS_LOGS: CandidateUsageLog[] = [
  {
    id: 'user-vicky',
    userId: '1',
    username: 'vicky',
    fullName: 'Vigneshwaran S P',
    targetRole: 'Senior Software Engineer (NVIDIA / Google)',
    level: {
      number: 4,
      title: 'Level 4: Senior Problem Solver',
      badgeColor: 'text-brand-violet bg-brand-violet/10 border-brand-violet/30',
      xp: 1420,
      readinessScore: 94
    },
    regularity: {
      tier: 'Daily Active',
      sessionsCount: 18,
      streakDays: 6,
      lastActive: '10 mins ago',
      hoursPracticed: 24.5
    },
    skills: [
      { domain: 'Arrays / Hashing', proficiency: 'EXPERT' },
      { domain: 'Two Pointers', proficiency: 'STRONG' },
      { domain: 'Dynamic Programming', proficiency: 'INTERMEDIATE' },
      { domain: 'Trees & Graphs', proficiency: 'STRONG' },
      { domain: 'System Architecture', proficiency: 'STRONG' }
    ],
    recentActivities: [
      {
        id: 'act-vicky-1',
        timestamp: '10 mins ago',
        actionType: 'SOLVE',
        description: 'Successfully solved and verified solution with optimal runtime.',
        questionTitle: 'Longest Subarray With Target Sum',
        difficulty: 'MEDIUM',
        status: 'PASSED',
        metrics: { runtimeMs: 12, tabSwitches: 0, testCasesPassed: '5/5 Passed' }
      },
      {
        id: 'act-vicky-2',
        timestamp: '15 mins ago',
        actionType: 'LOGIC_GATE',
        description: 'Defended algorithmic approach: Hash Map prefix sum with target runtime O(N).',
        questionTitle: 'Longest Subarray With Target Sum',
        difficulty: 'MEDIUM',
        status: 'PASSED',
        metrics: { logicVerdict: 'Approved (Optimal O(N))' }
      },
      {
        id: 'act-vicky-3',
        timestamp: '16 mins ago',
        actionType: 'FULLSCREEN',
        description: 'Candidate enabled Full-screen proctoring mode on coding start prompt.',
        questionTitle: 'Longest Subarray With Target Sum',
        difficulty: 'MEDIUM',
        status: 'INFO'
      },
      {
        id: 'act-vicky-4',
        timestamp: 'Yesterday',
        actionType: 'SUBMIT',
        description: 'Completed Two Sum interview with high code quality rating.',
        questionTitle: 'Two Sum',
        difficulty: 'EASY',
        status: 'PASSED',
        metrics: { runtimeMs: 8, tabSwitches: 0, testCasesPassed: '8/8 Passed' }
      }
    ]
  },
  {
    id: 'user-alex',
    userId: '2',
    username: 'achen',
    fullName: 'Alex Chen',
    targetRole: 'Staff Infrastructure Engineer (Meta / Stripe)',
    level: {
      number: 5,
      title: 'Level 5: Staff Systems Architect',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      xp: 2350,
      readinessScore: 98
    },
    regularity: {
      tier: 'Daily Active',
      sessionsCount: 34,
      streakDays: 14,
      lastActive: '2 hours ago',
      hoursPracticed: 48.0
    },
    skills: [
      { domain: 'Heaps & Priority Queues', proficiency: 'EXPERT' },
      { domain: 'Concurrency & Locking', proficiency: 'EXPERT' },
      { domain: 'Graph Traversals', proficiency: 'EXPERT' },
      { domain: 'Dynamic Programming', proficiency: 'STRONG' }
    ],
    recentActivities: [
      {
        id: 'act-alex-1',
        timestamp: '2 hours ago',
        actionType: 'SOLVE',
        description: 'Completed Merge K Sorted Lists with custom comparator and Min-Heap.',
        questionTitle: 'Merge K Sorted Lists',
        difficulty: 'HARD',
        status: 'PASSED',
        metrics: { runtimeMs: 14, tabSwitches: 0, testCasesPassed: '10/10 Passed' }
      },
      {
        id: 'act-alex-2',
        timestamp: '2 hours ago',
        actionType: 'LOGIC_GATE',
        description: 'Approved logic using Min-Heap priority queue achieving O(N log K) time.',
        questionTitle: 'Merge K Sorted Lists',
        difficulty: 'HARD',
        status: 'PASSED',
        metrics: { logicVerdict: 'Approved' }
      }
    ]
  },
  {
    id: 'user-sarah',
    userId: '3',
    username: 'sjenkins',
    fullName: 'Sarah Jenkins',
    targetRole: 'Full Stack Engineer (Amazon)',
    level: {
      number: 3,
      title: 'Level 3: Mid-Level Developer',
      badgeColor: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30',
      xp: 890,
      readinessScore: 78
    },
    regularity: {
      tier: 'Frequent',
      sessionsCount: 11,
      streakDays: 4,
      lastActive: '5 hours ago',
      hoursPracticed: 16.2
    },
    skills: [
      { domain: 'Arrays / Hashing', proficiency: 'STRONG' },
      { domain: 'Linked Lists', proficiency: 'STRONG' },
      { domain: 'Stacks / Queues', proficiency: 'INTERMEDIATE' },
      { domain: 'Trees', proficiency: 'DEVELOPING' }
    ],
    recentActivities: [
      {
        id: 'act-sarah-1',
        timestamp: '5 hours ago',
        actionType: 'TAB_SWITCH',
        description: 'Proctoring alert: 1 browser tab switch detected during sandbox execution.',
        questionTitle: 'LRU Cache Design',
        difficulty: 'MEDIUM',
        status: 'WARNING',
        metrics: { tabSwitches: 1 }
      },
      {
        id: 'act-sarah-2',
        timestamp: '5 hours ago',
        actionType: 'RUN_CODE',
        description: 'Executed sandbox test suite: 6 of 8 public test cases passed.',
        questionTitle: 'LRU Cache Design',
        difficulty: 'MEDIUM',
        status: 'FAILED',
        metrics: { testCasesPassed: '6/8 Passed' }
      }
    ]
  },
  {
    id: 'user-dev',
    userId: '4',
    username: 'dpatel',
    fullName: 'Dev Patel',
    targetRole: 'Junior Backend Developer (Fintech)',
    level: {
      number: 2,
      title: 'Level 2: Junior Developer',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      xp: 520,
      readinessScore: 64
    },
    regularity: {
      tier: 'Occasional',
      sessionsCount: 5,
      streakDays: 1,
      lastActive: 'Yesterday',
      hoursPracticed: 7.5
    },
    skills: [
      { domain: 'Arrays / Hashing', proficiency: 'INTERMEDIATE' },
      { domain: 'Stacks / Queues', proficiency: 'STRONG' },
      { domain: 'Recursion', proficiency: 'DEVELOPING' },
      { domain: 'Graphs', proficiency: 'WEAK' }
    ],
    recentActivities: [
      {
        id: 'act-dev-1',
        timestamp: 'Yesterday',
        actionType: 'SOLVE',
        description: 'Solved Valid Parentheses with Stack data structure.',
        questionTitle: 'Valid Parentheses',
        difficulty: 'EASY',
        status: 'PASSED',
        metrics: { runtimeMs: 9, tabSwitches: 0, testCasesPassed: '6/6 Passed' }
      },
      {
        id: 'act-dev-2',
        timestamp: 'Yesterday',
        actionType: 'LOGIC_GATE',
        description: 'Flagged: Proposed nested scan before optimizing to LIFO stack.',
        questionTitle: 'Valid Parentheses',
        difficulty: 'EASY',
        status: 'WARNING',
        metrics: { logicVerdict: 'Revised & Approved' }
      }
    ]
  },
  {
    id: 'user-priya',
    userId: '5',
    username: 'pnair',
    fullName: 'Priya Nair',
    targetRole: 'Graduate SWE Candidate',
    level: {
      number: 1,
      title: 'Level 1: Novice / Apprentice',
      badgeColor: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/30',
      xp: 210,
      readinessScore: 46
    },
    regularity: {
      tier: 'Newcomer',
      sessionsCount: 2,
      streakDays: 0,
      lastActive: '3 days ago',
      hoursPracticed: 2.1
    },
    skills: [
      { domain: 'Arrays', proficiency: 'DEVELOPING' },
      { domain: 'Strings', proficiency: 'DEVELOPING' },
      { domain: 'Trees', proficiency: 'WEAK' },
      { domain: 'Dynamic Programming', proficiency: 'WEAK' }
    ],
    recentActivities: [
      {
        id: 'act-priya-1',
        timestamp: '3 days ago',
        actionType: 'TAB_SWITCH',
        description: 'Proctoring alert: 3 browser tab switches recorded during simulation.',
        questionTitle: 'Binary Search',
        difficulty: 'EASY',
        status: 'WARNING',
        metrics: { tabSwitches: 3 }
      },
      {
        id: 'act-priya-2',
        timestamp: '3 days ago',
        actionType: 'RUN_CODE',
        description: 'Compile error: Off-by-one boundary index in binary search loop.',
        questionTitle: 'Binary Search',
        difficulty: 'EASY',
        status: 'FAILED'
      }
    ]
  }
];

export const getAuditUsers = (): CandidateUsageLog[] => {
  try {
    const rawCustomLogs = localStorage.getItem('kodexis_user_custom_logs');
    const customActivities: CandidateActivity[] = rawCustomLogs ? JSON.parse(rawCustomLogs) : [];

    // Clone seed
    const users: CandidateUsageLog[] = JSON.parse(JSON.stringify(SEED_USERS_LOGS));

    if (customActivities.length > 0) {
      // Prepend live custom activities to the active candidate (vicky)
      const vicky = users.find(u => u.username === 'vicky');
      if (vicky) {
        vicky.recentActivities = [...customActivities, ...vicky.recentActivities];
        vicky.regularity.lastActive = 'Just now';
      }
    }

    return users;
  } catch (e) {
    return SEED_USERS_LOGS;
  }
};

export const logUserActivity = (activity: Omit<CandidateActivity, 'id' | 'timestamp'>): void => {
  try {
    const raw = localStorage.getItem('kodexis_user_custom_logs');
    const existing: CandidateActivity[] = raw ? JSON.parse(raw) : [];

    const newActivity: CandidateActivity = {
      ...activity,
      id: `act-live-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newActivity, ...existing].slice(0, 50); // keep recent 50
    localStorage.setItem('kodexis_user_custom_logs', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to log user activity:', e);
  }
};
