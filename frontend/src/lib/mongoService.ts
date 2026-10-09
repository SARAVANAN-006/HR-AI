/**
 * KODEXIS MongoDB Service
 * Persistent Document Database Service for User Behaviors, Candidate Audit Logs, and Technical Autopsies.
 * Connects to MongoDB Atlas / REST endpoints with client-side MongoDB IndexedDB engine fallback.
 */

export interface MongoUserBehavior {
  _id?: string;
  userId: string;
  username: string;
  action: string; // e.g. 'INTERVIEW_STARTED', 'ANSWER_RECORDED', 'CAMERA_TOGGLED', etc.
  page: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface MongoCandidateLog {
  _id?: string;
  userId: string;
  username: string;
  timestamp: string;
  logType: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT' | 'INTERVIEW_AUTOPSY';
  action: string;
  details: string;
  payload?: Record<string, any>;
}

export interface FormulaBreakdown {
  formula: string;
  technicalProficiencyScore: number;
  technicalProficiencyPoints: number; // score * 0.35
  conceptualDepthScore: number;
  conceptualDepthPoints: number;       // score * 0.25
  problemSolvingScore: number;
  problemSolvingPoints: number;        // score * 0.25
  communicationScore: number;
  communicationPoints: number;         // score * 0.15
  calculatedTotal: number;
  rubricWeights: {
    technical: string;
    conceptual: string;
    problemSolving: string;
    communication: string;
  };
}

export interface MongoInterviewAutopsy {
  _id?: string;
  sessionId: string;
  userId: string;
  username: string;
  candidateName: string;
  targetRole: string;
  date: string;
  durationMinutes: number;
  overallScore: number;
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'LEAN_HIRE' | 'NEEDS_PRACTICE';
  formulaBreakdown: FormulaBreakdown;
  multiFactorScores: {
    technicalProficiency: number;
    communicationScore: number;
    conceptualDepthScore: number;
    problemSolvingScore: number;
  };
  categoryScores: Record<string, number>;
  keyStrengths: string[];
  areasForImprovement: string[];
  detailedDebrief: string;
  transcripts: Array<{
    questionId: string;
    questionText: string;
    category: string;
    phase: string;
    userAnswerText: string;
    score: number;
    feedback: string;
    durationSeconds: number;
    timestamp: string;
  }>;
  createdAt: string;
}

const DB_NAME = 'kodexis_mongodb';
const DB_VERSION = 1;
const STORE_BEHAVIORS = 'user_behaviors';
const STORE_LOGS = 'candidate_logs';
const STORE_AUTOPSIES = 'interview_autopsies';

/**
 * Open or initialize persistent MongoDB IndexedDB database
 */
function openMongoDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this runtime environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;

      if (!db.objectStoreNames.contains(STORE_BEHAVIORS)) {
        const behaviorStore = db.createObjectStore(STORE_BEHAVIORS, { keyPath: '_id' });
        behaviorStore.createIndex('username', 'username', { unique: false });
        behaviorStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_LOGS)) {
        const logStore = db.createObjectStore(STORE_LOGS, { keyPath: '_id' });
        logStore.createIndex('username', 'username', { unique: false });
        logStore.createIndex('logType', 'logType', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_AUTOPSIES)) {
        const autopsyStore = db.createObjectStore(STORE_AUTOPSIES, { keyPath: 'sessionId' });
        autopsyStore.createIndex('username', 'username', { unique: false });
        autopsyStore.createIndex('date', 'date', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function generateMongoObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return timestamp + random;
}

/**
 * Calculate transparent scoring breakdown based on weights
 */
export function computeScoreFormulaBreakdown(
  techScore: number,
  depthScore: number,
  probScore: number,
  commScore: number
): FormulaBreakdown {
  const t = Math.max(0, Math.min(100, Math.round(techScore)));
  const d = Math.max(0, Math.min(100, Math.round(depthScore)));
  const p = Math.max(0, Math.min(100, Math.round(probScore)));
  const c = Math.max(0, Math.min(100, Math.round(commScore)));

  const tPoints = Math.round(t * 0.35 * 10) / 10;
  const dPoints = Math.round(d * 0.25 * 10) / 10;
  const pPoints = Math.round(p * 0.25 * 10) / 10;
  const cPoints = Math.round(c * 0.15 * 10) / 10;

  const total = Math.min(100, Math.round(tPoints + dPoints + pPoints + cPoints));

  return {
    formula: `Final Score = (Technical Proficiency × 35%) + (Conceptual Depth × 25%) + (Problem Solving × 25%) + (Communication × 15%)`,
    technicalProficiencyScore: t,
    technicalProficiencyPoints: tPoints,
    conceptualDepthScore: d,
    conceptualDepthPoints: dPoints,
    problemSolvingScore: p,
    problemSolvingPoints: pPoints,
    communicationScore: c,
    communicationPoints: cPoints,
    calculatedTotal: total,
    rubricWeights: {
      technical: '35%',
      conceptual: '25%',
      problemSolving: '25%',
      communication: '15%'
    }
  };
}

class MongoService {
  private apiEndpoint =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MONGODB_API_URL) ||
    '/api/mongo';

  /**
   * Log User Behavior event to MongoDB
   */
  async logUserBehavior(
    action: string,
    page: string,
    metadata?: Record<string, any>,
    userOverride?: { username?: string; id?: string }
  ): Promise<void> {
    const username = userOverride?.username || this.getActiveUsername();
    const userId = userOverride?.id || 'user-' + username.toLowerCase();

    const doc: MongoUserBehavior = {
      _id: generateMongoObjectId(),
      userId,
      username: username.toLowerCase(),
      action,
      page,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    };

    // 1. Persist to MongoDB IndexedDB collection
    try {
      const db = await openMongoDatabase();
      const tx = db.transaction(STORE_BEHAVIORS, 'readwrite');
      tx.objectStore(STORE_BEHAVIORS).put(doc);
    } catch (e) {
      console.warn('[MongoDB Service] Local behavior write notice:', e);
    }

    // 2. Synchronize to remote MongoDB endpoint if accessible
    try {
      fetch(`${this.apiEndpoint}/behaviors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      }).catch(() => {});
    } catch {}
  }

  /**
   * Record candidate technical audit log to MongoDB
   */
  async recordCandidateLog(
    logType: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT' | 'INTERVIEW_AUTOPSY',
    action: string,
    details: string,
    payload?: Record<string, any>,
    usernameOverride?: string
  ): Promise<void> {
    const username = usernameOverride || this.getActiveUsername();
    const doc: MongoCandidateLog = {
      _id: generateMongoObjectId(),
      userId: 'user-' + username.toLowerCase(),
      username: username.toLowerCase(),
      timestamp: new Date().toISOString(),
      logType,
      action,
      details,
      payload: payload || {}
    };

    try {
      const db = await openMongoDatabase();
      const tx = db.transaction(STORE_LOGS, 'readwrite');
      tx.objectStore(STORE_LOGS).put(doc);
    } catch (e) {
      console.warn('[MongoDB Service] Local audit log write notice:', e);
    }

    try {
      fetch(`${this.apiEndpoint}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      }).catch(() => {});
    } catch {}
  }

  /**
   * Save complete Technical Autopsy dossier to MongoDB
   */
  async saveInterviewAutopsy(autopsy: MongoInterviewAutopsy): Promise<string> {
    const doc: MongoInterviewAutopsy = {
      ...autopsy,
      _id: autopsy._id || generateMongoObjectId(),
      createdAt: autopsy.createdAt || new Date().toISOString()
    };

    // 1. Persist to local MongoDB store
    try {
      const db = await openMongoDatabase();
      const tx = db.transaction(STORE_AUTOPSIES, 'readwrite');
      tx.objectStore(STORE_AUTOPSIES).put(doc);
    } catch (e) {
      console.warn('[MongoDB Service] Autopsy save notice:', e);
    }

    // 2. Automatically log behavior and audit events
    await this.logUserBehavior(
      'INTERVIEW_AUTOPSY_SAVED',
      '/elsa',
      {
        sessionId: doc.sessionId,
        score: doc.overallScore,
        recommendation: doc.recommendation
      },
      { username: doc.username, id: doc.userId }
    );

    await this.recordCandidateLog(
      'INTERVIEW_AUTOPSY',
      'AUTOPSY_DOSSIER_COMPILED',
      `Completed ${doc.durationMinutes}m interview with overall score ${doc.overallScore}/100 (${doc.recommendation}).`,
      { formula: doc.formulaBreakdown },
      doc.username
    );

    // 3. Post to remote MongoDB endpoint
    try {
      fetch(`${this.apiEndpoint}/autopsies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      }).catch(() => {});
    } catch {}

    // Dispatch event so Dashboard or telemetry updates instantly
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kodexis_mongo_autopsy_saved', { detail: doc }));
    }

    return doc.sessionId;
  }

  /**
   * Retrieve all Autopsies for a specific user from MongoDB
   */
  async getUserAutopsies(username?: string): Promise<MongoInterviewAutopsy[]> {
    const cleanUser = (username || this.getActiveUsername()).toLowerCase().trim();
    const results: MongoInterviewAutopsy[] = [];

    // 1. Check remote MongoDB API first
    try {
      const res = await fetch(`${this.apiEndpoint}/autopsies?username=${encodeURIComponent(cleanUser)}`);
      if (res.ok) {
        const remoteData = await res.json();
        if (Array.isArray(remoteData) && remoteData.length > 0) {
          return remoteData;
        }
      }
    } catch {}

    // 2. Query MongoDB IndexedDB
    try {
      const db = await openMongoDatabase();
      const tx = db.transaction(STORE_AUTOPSIES, 'readonly');
      const store = tx.objectStore(STORE_AUTOPSIES);
      const index = store.index('username');

      return new Promise((resolve) => {
        const request = index.getAll(cleanUser);
        request.onsuccess = () => {
          const list = (request.result || []) as MongoInterviewAutopsy[];
          list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          resolve(list);
        };
        request.onerror = () => resolve([]);
      });
    } catch {
      return results;
    }
  }

  /**
   * Retrieve user behaviors from MongoDB
   */
  async getUserBehaviors(username: string): Promise<MongoUserBehavior[]> {
    const cleanUser = (username || '').toLowerCase().trim();
    try {
      const db = await openMongoDatabase();
      const tx = db.transaction(STORE_BEHAVIORS, 'readonly');
      const store = tx.objectStore(STORE_BEHAVIORS);
      const index = store.index('username');

      return new Promise((resolve) => {
        const request = index.getAll(cleanUser);
        request.onsuccess = () => {
          const list = (request.result || []) as MongoUserBehavior[];
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          resolve(list);
        };
        request.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  /**
   * Helper to get active username from session
   */
  private getActiveUsername(): string {
    if (typeof localStorage === 'undefined') return 'candidate';
    try {
      const raw = localStorage.getItem('kodexis_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.username) return parsed.username;
      }
    } catch {}
    return 'candidate';
  }
}

export const mongoService = new MongoService();
