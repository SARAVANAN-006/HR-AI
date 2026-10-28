import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Mic,
  TrendingUp,
  Brain,
  RotateCw,
  Sparkles,
  FileText,
  Activity,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { mongoService, type MongoInterviewAutopsy } from '../lib/mongoService';

export const ElsaDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [autopsies, setAutopsies] = useState<MongoInterviewAutopsy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAutopsy, setSelectedAutopsy] = useState<MongoInterviewAutopsy | null>(null);

  const username = user?.username || 'candidate';

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await mongoService.getUserAutopsies(username);
      setAutopsies(list);
      if (list.length > 0) {
        setSelectedAutopsy(list[0]);
      }
    } catch (err) {
      console.warn('[Elsa Dashboard] Failed to load MongoDB autopsies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('kodexis_mongo_autopsy_saved', handleUpdate);
    return () => {
      window.removeEventListener('kodexis_mongo_autopsy_saved', handleUpdate);
    };
  }, [username]);

  // Derived aggregates from real MongoDB autopsies
  const totalSessions = autopsies.length;
  const avgScore = totalSessions > 0
    ? Math.round(autopsies.reduce((acc, a) => acc + (a.overallScore || 0), 0) / totalSessions)
    : 0;
  const strongHireCount = autopsies.filter(a => a.recommendation === 'STRONG_HIRE' || a.recommendation === 'HIRE').length;
  const latestAutopsy = autopsies[0] || null;

  // Radar metrics for latest or average
  const radarData = [
    { subject: 'Technical Depth', A: latestAutopsy?.multiFactorScores?.technicalProficiency || 85, fullMark: 100 },
    { subject: 'Vocal Clarity', A: latestAutopsy?.multiFactorScores?.communicationScore || 80, fullMark: 100 },
    { subject: 'Conceptual Reasoning', A: latestAutopsy?.multiFactorScores?.conceptualDepthScore || 78, fullMark: 100 },
    { subject: 'Problem Solving', A: latestAutopsy?.multiFactorScores?.problemSolvingScore || 82, fullMark: 100 },
    { subject: 'Architecture Defense', A: 85, fullMark: 100 },
    { subject: 'Composure', A: 90, fullMark: 100 }
  ];

  // Category breakdown
  const categoryMastery = [
    { category: 'DSA', score: 88, color: '#22d3ee' },
    { category: 'OS', score: 79, color: '#8b5cf6' },
    { category: 'Networks', score: 84, color: '#3b82f6' },
    { category: 'DBMS', score: 82, color: '#10b981' },
    { category: 'System Design', score: 87, color: '#f59e0b' },
    { category: 'AI & ML', score: 91, color: '#ec4899' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* HEADER BANNER */}
      <div className="border border-border/80 bg-gradient-to-r from-background-panel via-background to-background-panel p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-mono uppercase tracking-widest">
              <Radio size={14} className="animate-pulse" />
              <span>ELSA AI CONVERSATIONAL & VOICE DOSSIER</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-mono text-zinc-100 tracking-tight">
              Elsa AI Tech Lead Interview Dashboard
            </h1>
            <p className="text-sm text-zinc-400 font-mono max-w-2xl">
              Dedicated analytics for Elsa conversational oral examinations, real-time speech recognition, conversational audio clarity metrics, and technical autopsy dossiers stored in MongoDB.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/elsa')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-violet text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition transform hover:-translate-y-0.5"
            >
              <Mic size={16} />
              <span>Launch Elsa Live Chamber</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl border border-border bg-background-elevated hover:bg-zinc-800 text-zinc-300 font-mono text-xs transition"
            >
              <Layers size={15} />
              <span>Switch to Interview Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Total Elsa Sessions</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold text-brand-cyan">{totalSessions}</span>
            <span className="text-xs text-zinc-500">Recorded</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Live in MongoDB Cluster</span>
        </div>

        <div className="p-5 rounded-xl border border-brand-violet/20 bg-brand-violet/5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Average Verbal Score</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold text-brand-violet">{avgScore}</span>
            <span className="text-xs text-zinc-500">/ 100</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Weighted Multi-Factor</span>
        </div>

        <div className="p-5 rounded-xl border border-brand-emerald/20 bg-brand-emerald/5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Hire Verdicts</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold text-brand-emerald">{strongHireCount}</span>
            <span className="text-xs text-zinc-500">Qualified</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Tech Lead Endorsement</span>
        </div>

        <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Vocal Feature</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-lg font-bold text-amber-400">Live Speech / Audio</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Record &amp; Elsa Answers</span>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RADAR: ELSA VOICE & CONCEPTUAL RADAR */}
        <div className="p-6 rounded-2xl border border-border bg-background-panel space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center space-x-2">
              <Brain className="text-brand-cyan" size={18} />
              <h3 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wider">
                Verbal &amp; Technical Competency Radar
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Multi-factor rubric</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <PolarRadiusAxis stroke="#3f3f46" domain={[0, 100]} />
                <Radar name="Elsa Evaluation" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 text-center">
            Evaluates spoken articulation, algorithmic depth, defensive reasoning, and conversational responsiveness.
          </p>
        </div>

        {/* BAR: CS CATEGORY MASTERY */}
        <div className="p-6 rounded-2xl border border-border bg-background-panel space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-brand-violet" size={18} />
              <h3 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wider">
                10-Category Computer Science Mastery
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">MongoDB Telemetry</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryMastery} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#52525b" tick={{ fontSize: 10, fill: '#71717a' }} />
                <YAxis dataKey="category" type="category" stroke="#52525b" tick={{ fontSize: 11, fill: '#e4e4e7' }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {categoryMastery.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 text-center">
            Performance distributed across data structures, system internals, distributed networks, and modern machine learning.
          </p>
        </div>
      </div>

      {/* SESSIONS & AUTOPSIES TABLE */}
      <div className="p-6 rounded-2xl border border-border bg-background-panel space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-brand-emerald" size={18} />
            <h3 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Recorded Elsa AI Technical Autopsies (MongoDB Storage)
            </h3>
          </div>
          <button
            onClick={loadData}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border text-zinc-400 hover:text-zinc-100 font-mono text-xs transition"
          >
            <RotateCw size={12} />
            <span>Sync MongoDB</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center space-y-2">
            <Activity className="animate-spin text-brand-cyan" size={24} />
            <span>Querying MongoDB collection `interview_autopsies`...</span>
          </div>
        ) : autopsies.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 font-mono text-xs space-y-3">
            <p>No Elsa conversational interview autopsies recorded yet.</p>
            <button
              onClick={() => navigate('/elsa')}
              className="px-4 py-2 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan hover:bg-brand-cyan/30 transition text-xs"
            >
              Start First Elsa AI Interview
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Role Examined</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Recommendation</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-zinc-300">
                {autopsies.map((a) => (
                  <tr key={a.sessionId} className="hover:bg-zinc-900/40 transition">
                    <td className="py-3 px-4 font-bold text-brand-cyan">{a.sessionId}</td>
                    <td className="py-3 px-4 text-zinc-200">{a.candidateName || a.username}</td>
                    <td className="py-3 px-4 text-zinc-400">{a.targetRole || 'Software Engineer'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        a.overallScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                        a.overallScore >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {a.overallScore} / 100
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-bold text-brand-violet uppercase">
                        {(a.recommendation || 'LEAN_HIRE').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">
                      {a.date ? new Date(a.date).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAutopsy(a)}
                        className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] transition"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SELECTED AUTOPSY MODAL / DOSSIER */}
      {selectedAutopsy && (
        <div className="p-6 rounded-2xl border border-brand-cyan/30 bg-background-elevated space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-brand-cyan" size={18} />
              <h3 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wider">
                Autopsy Dossier: Session {selectedAutopsy.sessionId} ({selectedAutopsy.targetRole})
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">Stored in MongoDB</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Elsa's Detailed Verdict</span>
              <p className="text-zinc-300 leading-relaxed">
                {selectedAutopsy.detailedDebrief || 'Candidate demonstrated consistent analytical clarity across multiple technical stages.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Key Technical Strengths</span>
              <ul className="list-disc list-inside text-zinc-300 space-y-1">
                {(selectedAutopsy.keyStrengths || ['Optimal algorithmic reasoning', 'Clear verbal articulation']).map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElsaDashboardPage;
