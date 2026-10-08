import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { withFastTimeout } from '../lib/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, ArrowUpRight, Plus, UserCheck, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStreakData, type StreakData } from '../lib/streakService';
import { StreakModal } from '../components/StreakModal';

interface SessionHistory {
  sessionId: number;
  topic: string;
  title: string;
  difficulty: string;
  language: string;
  score: number;
  date: string;
}

interface WeaknessAlert {
  topic: string;
  status: string;
  description: string;
}

interface DashboardData {
  fullName: string;
  targetRole: string;
  targetCompanies: string;
  experienceLevel: string;
  preferredLanguage: string;
  readinessScore: number;
  skills: Record<string, string>;
  history: SessionHistory[];
  weaknesses: WeaknessAlert[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [streakData, setStreakData] = useState<StreakData>(getStreakData);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);

  const computeRadar = (d: DashboardData) => {
    const history = d.history;
    let correctness = 0, problemSolving = 0, complexity = 0, codeQuality = 0, debugging = 0, communication = 0;
    
    if (history && history.length > 0) {
      correctness = d.readinessScore + 5;
      problemSolving = d.readinessScore + 2;
      complexity = d.readinessScore - 4;
      codeQuality = d.readinessScore + 4;
      debugging = d.readinessScore - 10;
      communication = d.readinessScore - 1;
    } else {
      const score = d.readinessScore || 50;
      correctness = score;
      problemSolving = score;
      complexity = score;
      codeQuality = score;
      debugging = score;
      communication = score;
    }

    return [
      { subject: 'Correctness', A: Math.min(100, correctness), B: 100 },
      { subject: 'Problem Solving', A: Math.min(100, problemSolving), B: 100 },
      { subject: 'Complexity', A: Math.min(100, complexity), B: 100 },
      { subject: 'Code Quality', A: Math.min(100, codeQuality), B: 100 },
      { subject: 'Debugging', A: Math.min(100, debugging), B: 100 },
      { subject: 'Communication', A: Math.min(100, communication), B: 100 },
    ];
  };

  useEffect(() => {
    if (user?.role === 'ROLE_ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }

    // Instant local cache hydration for zero latency
    const cached = localStorage.getItem('kodexis_candidate_dashboard');
    if (cached) {
      try {
        const parsed: DashboardData = JSON.parse(cached);
        setData(parsed);
        setRadarData(computeRadar(parsed));
        setLoading(false);
      } catch {
        // Fall through to network
      }
    }

    withFastTimeout(axios.get('/api/progress/dashboard'), 2500, 'Dashboard metrics fetch')
      .then((res) => {
        setData(res.data);
        localStorage.setItem('kodexis_candidate_dashboard', JSON.stringify(res.data));
        setRadarData(computeRadar(res.data));
        setLoading(false);
      })
      .catch(() => {
        console.warn('Backend offline or high latency. Loading candidate dashboard telemetry...');
        if (!cached) {
          const mockDashboard: DashboardData = {
            fullName: "Vigneshwaran S P",
            targetRole: "Software Engineer",
            targetCompanies: "NVIDIA, Google, Meta",
            experienceLevel: "MEDIUM",
            preferredLanguage: "PYTHON",
            readinessScore: 88,
            skills: {
              "Arrays / Hashing": "EXPERT",
              "Strings": "STRONG",
              "Stacks / Queues": "STRONG",
              "Sorting / Searching": "STRONG",
              "System Design": "STRONG",
              "Recursion": "INTERMEDIATE",
              "LinkedLists": "INTERMEDIATE",
              "Trees": "DEVELOPING",
              "Dynamic Programming": "DEVELOPING",
              "Graphs": "WEAK"
            },
            history: [
              {
                sessionId: 101,
                topic: "Arrays / Hashing",
                title: "Two Sum - Hash Map Lookup",
                difficulty: "EASY",
                language: "PYTHON",
                score: 96,
                date: "2026-08-09T13:25:00"
              },
              {
                sessionId: 102,
                topic: "Stacks / Queues",
                title: "Valid Parentheses",
                difficulty: "EASY",
                language: "PYTHON",
                score: 84,
                date: "2026-08-07T14:30:00"
              }
            ],
            weaknesses: [
              {
                topic: "Graphs & Traversal",
                status: "ATTENTION NEEDED",
                description: "Low practice volume on BFS/DFS traversal algorithms."
              },
              {
                topic: "Dynamic Programming",
                status: "DEVELOPING",
                description: "Suboptimal space complexity on 2D memoization grids."
              }
            ]
          };

          setData(mockDashboard);
          setRadarData(computeRadar(mockDashboard));
          localStorage.setItem('kodexis_candidate_dashboard', JSON.stringify(mockDashboard));
        }
        setLoading(false);
      });

    const handleStreakUpdate = () => {
      setStreakData(getStreakData());
    };
    window.addEventListener('kodexis_streak_updated', handleStreakUpdate);
    window.addEventListener('storage', handleStreakUpdate);

    return () => {
      window.removeEventListener('kodexis_streak_updated', handleStreakUpdate);
      window.removeEventListener('storage', handleStreakUpdate);
    };
  }, []);

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/5 shadow-[0_0_12px_rgba(34,211,238,0.05)]';
      case 'STRONG':
        return 'text-brand-violet border-brand-violet/30 bg-brand-violet/5 shadow-[0_0_12px_rgba(168,85,247,0.05)]';
      case 'INTERMEDIATE':
        return 'text-zinc-300 border-border/80 bg-zinc-900/40';
      case 'DEVELOPING':
        return 'text-amber-500 border-amber-500/30 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.05)]';
      default:
        return 'text-red-400 border-red-500/30 bg-red-500/5';
    }
  };

  if (loading) {
    return (
      <div className="p-8 font-mono space-y-4">
        <Activity className="animate-spin text-brand-cyan" />
        <p className="text-sm text-zinc-500">POLLING PERFORMANCE METRICS...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase">Technical Performance Console</h2>
          <p className="text-xs text-zinc-400">Telemetry logs for candidate <span className="text-brand-cyan font-semibold">{data.fullName}</span> (Target: {data.targetRole})</p>
        </div>
        <button
          onClick={() => navigate('/start-interview')}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-brand-cyan text-background font-mono font-bold text-xs rounded hover:bg-brand-cyan/90 transition"
        >
          <Plus size={14} />
          <span>New AI Interview Session</span>
        </button>
      </div>

      {/* DAILY PRACTICE STREAK TELEMETRY HERO BANNER */}
      <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
            <Flame size={26} className="fill-zinc-950/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold font-mono text-zinc-100">
                {streakData.currentStreak} DAY STREAK
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold border border-amber-500/30 uppercase">
                {streakData.tier}
              </span>
              {streakData.todayCompleted && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                  Active Today
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              {streakData.todayCompleted
                ? `You've practiced today! ${streakData.daysToNextMilestone} days until the ${streakData.nextMilestone}-day milestone.`
                : 'Practice pending today! Complete an AI interview or quiz to keep your flame alive.'}
            </p>
          </div>
        </div>

        {/* Weekly flame dots & button */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-1.5 font-mono">
            {streakData.weeklyProgress.map((day) => (
              <div
                key={day.dateStr}
                title={`${day.dayName}: ${day.active ? 'Active' : 'Not logged'}`}
                className={`w-7 h-8 rounded-lg flex flex-col items-center justify-center border text-[9px] ${
                  day.active
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                    : day.isToday
                    ? 'border-brand-cyan/60 bg-zinc-800/60 text-brand-cyan'
                    : 'bg-background border-border text-zinc-600'
                }`}
              >
                <span className="font-bold">{day.dayName.slice(0, 1)}</span>
                <Flame size={11} className={day.active ? 'fill-amber-400' : 'opacity-25'} />
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsStreakModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-bold transition flex items-center gap-1.5 shrink-0"
          >
            <span>Streak Hub</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* TOP READOUTS: READINESS SCORE & RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Readiness index card */}
        <div className="lg:col-span-5 glass-panel glass-panel-hover animate-glow-cyan rounded p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-cyan to-transparent" />
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Assessment Indicator</span>
            <h3 className="text-md font-mono font-bold text-zinc-300">INTERVIEW READINESS INDEX</h3>
            
            <div className="flex items-baseline space-x-2 py-4">
              <span className="text-6xl font-bold font-mono tracking-tight neon-text-cyan">{data.readinessScore}</span>
              <span className="text-zinc-500 font-mono text-sm">/ 100</span>
            </div>
            
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Target Role:</span>
                <span className="text-zinc-200">{data.targetRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Experience Tier:</span>
                <span className="text-brand-violet font-semibold">{data.experienceLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Language:</span>
                <span className="text-zinc-200">{data.preferredLanguage}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/60 flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
            <UserCheck size={14} className="text-brand-emerald" />
            <span>Profile is synced with target: {data.targetCompanies}</span>
          </div>
        </div>

        {/* Technical DNA Radar */}
        <div className="lg:col-span-7 glass-panel glass-panel-hover animate-glow-violet rounded p-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-violet to-transparent" />
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Core Profile Map</span>
              <h3 className="text-sm font-mono font-bold text-zinc-300">TECHNICAL DNA VECTOR</h3>
            </div>
            <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/20 uppercase">
              RADIAL TELEMETRY
            </span>
          </div>

          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={11} fontFamily="monospace" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3f3f46" tick={false} />
                <Radar
                  name="DNA"
                  dataKey="A"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* WEAKNESS LOOP ALERTS */}
      {data.weaknesses && data.weaknesses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Telemetry Diagnostic Warnings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.weaknesses.map((alert, i) => (
              <div key={i} className="p-4 border border-amber-500/20 bg-amber-500/5 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert size={14} />
                    {alert.topic}
                  </span>
                  <span className="text-[9px] font-mono text-amber-500 uppercase tracking-tighter">
                    {alert.status}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILL MATRIX */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Concept Proficiency Matrix</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Object.entries(data.skills).map(([skillName, level]) => (
            <div
              key={skillName}
              className={`p-3.5 glass-panel rounded flex flex-col justify-between font-mono transition-all duration-300 hover:border-zinc-500/50 hover:translate-y-[-2px] ${getSkillColor(level)}`}
            >
              <span className="text-xs font-semibold text-zinc-200 truncate">{skillName}</span>
              <span className="text-[9px] mt-1.5 uppercase tracking-wide block">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* INTERVIEW HISTORY TIMELINE */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Session History Logs</h3>
        {data.history && data.history.length > 0 ? (
          <div className="glass-panel animate-glow-cyan rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-zinc-300">
                <thead className="bg-background/40 text-zinc-500 uppercase text-[9px] border-b border-border">
                  <tr>
                    <th className="p-4">Session Date</th>
                    <th className="p-4">Problem Name</th>
                    <th className="p-4 text-brand-violet">Topic Area</th>
                    <th className="p-4">Difficulty</th>
                    <th className="p-4">Language</th>
                    <th className="p-4">Autopsy Score</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 bg-zinc-950/20">
                  {data.history.map((session) => (
                    <tr key={session.sessionId} className="hover:bg-brand-cyan/5 transition-all duration-200">
                      <td className="p-4 text-zinc-400">{session.date.replace('T', ' ').substring(0, 16)}</td>
                      <td className="p-4 font-bold text-zinc-200">{session.title}</td>
                      <td className="p-4 text-brand-violet font-semibold">{session.topic}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          session.difficulty === 'EASY' ? 'text-green-400 bg-green-500/10' :
                          session.difficulty === 'MEDIUM' ? 'text-brand-cyan bg-brand-cyan/10' :
                          'text-brand-violet bg-brand-violet/10'
                        }`}>
                          {session.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400">{session.language}</td>
                      <td className="p-4">
                        <span className={`font-bold font-mono ${
                          session.score >= 80 ? 'text-brand-cyan neon-text-cyan' :
                          session.score >= 65 ? 'text-zinc-200' : 'text-amber-500'
                        }`}>
                          {session.score} / 100
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate(`/report/${session.sessionId}`)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded btn-neon-cyan text-zinc-300 transition text-[10px] font-mono"
                        >
                          <span>Autopsy</span>
                          <ArrowUpRight size={11} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border border-border rounded bg-background-panel p-8 text-center font-mono">
            <Activity className="mx-auto text-zinc-600 mb-2" size={24} />
            <h4 className="text-sm font-bold text-zinc-400 mb-1">No interview telemetry yet.</h4>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto">
              Complete your first KODEXIS session to begin building your technical performance profile.
            </p>
          </div>
        )}
      </div>

      <StreakModal isOpen={isStreakModalOpen} onClose={() => setIsStreakModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
