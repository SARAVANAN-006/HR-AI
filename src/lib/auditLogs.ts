import axios from 'axios';
import { mysqlService } from './mysqlService';
import { mongoService } from './mongoService';

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
    number: number;
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

// In-memory memory store synchronized with SQLite / Postgres / MongoDB (NO localStorage)
let memoryAuditUsers: CandidateUsageLog[] = [];
let memoryActivities: CandidateActivity[] = [];

// Initialize by fetching permanently persisted logs directly from SQLite / Postgres / MongoDB backend
export const fetchAuditUsersFromDatabase = async (): Promise<CandidateUsageLog[]> => {
  try {
    const res = await axios.get('/api/logs/all', { timeout: 3500 });
    const { logs, users } = res.data || { logs: [], users: [] };

    const serverLogs: any[] = Array.isArray(logs) ? logs : [];
    const serverUsers: any[] = Array.isArray(users) ? users : [];

    const activities: CandidateActivity[] = serverLogs.map((l: any, i: number) => {
      let p: any = {};
      try { p = typeof l.payload === 'string' ? JSON.parse(l.payload) : (l.payload || {}); } catch {}
      return {
        id: String(l.id || `act-${i}`),
        timestamp: l.timestamp ? new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live',
        actionType: (l.action === 'SESSION_COMPLETED' ? 'SUBMIT' : l.action === 'RUN_CODE' ? 'RUN_CODE' : 'SOLVE') as any,
        description: l.details || l.action || 'Activity recorded',
        questionTitle: p.questionTitle || p.title || 'Coding Assessment',
        difficulty: p.difficulty || 'MEDIUM',
        status: (l.logType === 'WARN' ? 'WARNING' : 'PASSED') as any,
        metrics: p.metrics
      };
    });
    memoryActivities = activities;

    memoryAuditUsers = serverUsers.map((u: any, idx: number) => {
      const userActs = activities.filter(a => a.id.includes(u.username) || idx === 0);
      const readiness = typeof u.readinessScore === 'number' ? u.readinessScore : 0;

      return {
        id: `user-${u.username || idx}`,
        userId: String(idx + 1),
        username: u.username || 'candidate',
        fullName: u.fullName || (u.username ? u.username.charAt(0).toUpperCase() + u.username.slice(1) : 'Candidate'),
        targetRole: u.targetRole || 'Software Engineer',
        level: {
          number: readiness >= 90 ? 4 : readiness >= 75 ? 3 : readiness > 0 ? 2 : 1,
          title: readiness >= 90 ? 'Level 4: Senior Problem Solver' : readiness >= 75 ? 'Level 3: Mid-Level Developer' : readiness > 0 ? 'Level 2: Junior Developer' : 'Level 1: New Candidate',
          badgeColor: readiness >= 90 ? 'text-brand-violet bg-brand-violet/10 border-brand-violet/30' : 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30',
          xp: readiness * 15,
          readinessScore: readiness
        },
        regularity: {
          tier: userActs.length > 5 ? 'Daily Active' : userActs.length > 0 ? 'Frequent' : 'Newcomer',
          sessionsCount: userActs.length,
          streakDays: userActs.length > 0 ? 1 : 0,
          lastActive: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Active',
          hoursPracticed: Math.round(userActs.length * 0.5 * 10) / 10
        },
        skills: [
          { domain: 'Algorithms & Data Structures', proficiency: readiness >= 85 ? 'STRONG' : readiness > 0 ? 'INTERMEDIATE' : 'DEVELOPING' },
          { domain: u.preferredLanguage || 'Java / Python', proficiency: readiness > 0 ? 'STRONG' : 'DEVELOPING' }
        ],
        recentActivities: userActs
      };
    });

    return memoryAuditUsers;
  } catch (err) {
    console.warn('Failed to fetch audit users from server database:', err);
    return memoryAuditUsers;
  }
};

// Initial background load
fetchAuditUsersFromDatabase().catch(() => {});

export const getAuditUsers = (): CandidateUsageLog[] => {
  return memoryAuditUsers;
};

export const logUserActivity = (activity: Omit<CandidateActivity, 'id' | 'timestamp'>, username?: string): void => {
  try {
    const newActivity: CandidateActivity = {
      ...activity,
      id: `act-live-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    memoryActivities.unshift(newActivity);
    const uname = username || 'candidate';

    // Persist live activity directly to backend database (SQLite + Postgres + MongoDB)
    axios.post('/api/logs/record', {
      username: uname,
      action: activity.actionType,
      page: '/interview',
      logType: activity.status === 'WARNING' ? 'WARN' : 'AUDIT',
      details: activity.description,
      payload: {
        questionTitle: activity.questionTitle,
        difficulty: activity.difficulty,
        metrics: activity.metrics,
        timestamp: new Date().toISOString()
      }
    }).catch(() => {});

    mysqlService.recordCandidateLog(
      uname,
      activity.status === 'WARNING' ? 'WARN' : 'AUDIT',
      activity.actionType,
      activity.description,
      {
        questionTitle: activity.questionTitle,
        difficulty: activity.difficulty,
        metrics: activity.metrics,
        timestamp: new Date().toISOString()
      }
    ).catch(() => {});

    mongoService.recordCandidateLog(
      activity.status === 'WARNING' ? 'WARN' : 'AUDIT',
      activity.actionType,
      activity.description,
      {
        questionTitle: activity.questionTitle,
        difficulty: activity.difficulty,
        metrics: activity.metrics,
        timestamp: new Date().toISOString()
      },
      uname
    ).catch(() => {});
  } catch (e) {
    console.error('Failed to log user activity:', e);
  }
};
