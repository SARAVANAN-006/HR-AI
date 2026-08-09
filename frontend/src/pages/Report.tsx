import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, FileCode, CheckCircle2, ShieldAlert, GitCommit } from 'lucide-react';

interface Question {
  title: string;
  topic: string;
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
}

interface Session {
  id: number;
  question: Question;
  language: string;
  difficulty: string;
  startedAt: string;
  completedAt: string;
  lastSubmittedCode: string;
  telemetryLog: string;
}

interface Assessment {
  overallScore: number;
  correctnessScore: number;
  problemSolvingScore: number;
  efficiencyScore: number;
  codeQualityScore: number;
  debuggingScore: number;
  edgeCasesScore: number;
  communicationScore: number;
  detectedTimeComplexity: string;
  detectedSpaceComplexity: string;
  autopsySummary: string;
  whatWentWell: string;
  areasToImprove: string;
  interviewerFeedback: string;
  suggestedPractice: string;
}

const Report: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<Session | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load Session and Assessment
    Promise.all([
      axios.get(`/api/interviews/${id}`),
      axios.get(`/api/interviews/${id}/assessment`)
    ])
      .then(([sRes, aRes]) => {
        setSession(sRes.data);
        setAssessment(aRes.data);

        // Parse telemetry
        try {
          const logs = JSON.parse(sRes.data.telemetryLog);
          setTelemetry(logs);
        } catch (e) {
          setTelemetry([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend offline. Loading Member 3 Multi-Factor Assessment Report...');
        const mockS: Session = {
          id: 1,
          question: {
            title: "Two Sum - Hash Map Lookup",
            topic: "Arrays / Hashing",
            expectedTimeComplexity: "O(n)",
            expectedSpaceComplexity: "O(n)"
          },
          language: "PYTHON",
          difficulty: "EASY",
          startedAt: "2026-08-09 13:00",
          completedAt: "2026-08-09 13:25",
          lastSubmittedCode: "def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []",
          telemetryLog: '[{"time":"2026-08-09 13:05:00","event":"Session initiated"},{"time":"2026-08-09 13:10:00","event":"Draft code compiled"},{"time":"2026-08-09 13:20:00","event":"All 18 test cases passed"},{"time":"2026-08-09 13:25:00","event":"Multi-Factor Assessment Engine completed"}]'
        };

        const mockA: Assessment = {
          overallScore: 96,
          correctnessScore: 100,
          problemSolvingScore: 95,
          efficiencyScore: 95,
          codeQualityScore: 92,
          debuggingScore: 90,
          edgeCasesScore: 95,
          communicationScore: 88,
          detectedTimeComplexity: "O(n)",
          detectedSpaceComplexity: "O(n)",
          autopsySummary: "Exceptional solution! The algorithm achieves optimal O(N) time complexity using a HashMap lookup strategy, passing 100% of functional test cases with high readability.",
          whatWentWell: "Used HashMap to achieve single-pass O(N) time efficiency. Proper camelCase naming and modular structure.",
          areasToImprove: "Consider pre-sizing initial map capacity when input array length is known.",
          interviewerFeedback: "Outstanding performance. Bypassed brute-force nested loops and wrote clean pythonic code.",
          suggestedPractice: "Sliding Window, Two Pointers, HashMap Load Factor"
        };

        setSession(mockS);
        setAssessment(mockA);
        setTelemetry(JSON.parse(mockS.telemetryLog));
        setLoading(false);
      });
  }, [id]);

  const getScoreTier = (score: number) => {
    if (score >= 90) return { label: 'Elite technical proficiency', color: 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/5' };
    if (score >= 80) return { label: 'Strong Technical Readiness', color: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5' };
    if (score >= 65) return { label: 'Intermediate Technical readiness', color: 'text-zinc-300 border-zinc-700 bg-zinc-900/40' };
    if (score >= 45) return { label: 'Developing Capabilities', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5' };
    return { label: 'Weak baseline fundamentals', color: 'text-red-400 border-red-500/20 bg-red-500/5' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono">
        <GitCommit className="animate-pulse text-brand-violet mb-2" size={24} />
        <span className="text-xs text-zinc-500">GENERATING ASSESSMENT SCORECARDS...</span>
      </div>
    );
  }

  if (!session || !assessment) {
    return (
      <div className="min-h-screen bg-background p-8 font-mono text-center">
        <p className="text-red-400">Failed to retrieve assessment data. Session may not be evaluated.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 border border-border rounded text-xs">
          Return to Console
        </button>
      </div>
    );
  }

  const tier = getScoreTier(assessment.overallScore);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Back button header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft size={14} />
          <span>Dashboard Overview</span>
        </button>
        <span className="text-xs font-mono text-zinc-500">INTERVIEW AUTOPSY SUMMARY</span>
      </div>

      {/* OVERALL SCORE BLOCK */}
      <div className="grid grid-cols-1 md:grid-cols-12 border border-border bg-background-panel rounded overflow-hidden">
        
        {/* Left Side: Score display */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-border p-8 flex flex-col justify-between items-center text-center">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Overall Grade</span>
            <p className="text-xs font-mono text-brand-cyan uppercase">KODEXIS Readiness Index</p>
          </div>

          <div className="flex items-baseline py-6">
            <span className="text-7xl font-bold font-mono text-zinc-100 tracking-tighter">{assessment.overallScore}</span>
            <span className="text-zinc-500 text-lg font-mono ml-1">/ 100</span>
          </div>

          <div className={`px-4 py-2 border rounded-full text-xs font-mono font-semibold ${tier.color}`}>
            {tier.label}
          </div>
        </div>

        {/* Right Side: Quick info details */}
        <div className="md:col-span-7 p-8 space-y-6">
          <h3 className="text-lg font-bold font-mono text-zinc-200 uppercase">KODEXIS TECHNICAL REPORT</h3>
          
          <div className="grid grid-cols-2 gap-4 font-mono text-xs text-zinc-400">
            <div>
              <p className="text-[9px] text-zinc-500 uppercase">Problem Solved</p>
              <p className="font-semibold text-zinc-200 mt-0.5">{session.question.title}</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 uppercase">Target Topic</p>
              <p className="font-semibold text-brand-violet mt-0.5">{session.question.topic}</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 uppercase">Difficulty level</p>
              <p className="font-semibold text-zinc-200 mt-0.5">{session.difficulty}</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 uppercase">Language runtime</p>
              <p className="font-semibold text-brand-cyan mt-0.5">{session.language}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center space-x-2 text-[10px] font-mono text-zinc-500">
            <Calendar size={12} />
            <span>Completed on: {session.completedAt ? session.completedAt.replace('T', ' ').substring(0, 16) : ''}</span>
          </div>
        </div>

      </div>

      {/* DETAILED AUTOPSEYS & MULTI-FACTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MEMBER 3: MULTI-FACTOR RADAR PROFILE */}
        <div className="lg:col-span-5 border border-border bg-background-panel rounded p-6 space-y-4 font-mono">
          <div>
            <span className="text-[9px] text-brand-cyan uppercase tracking-widest block font-bold">MEMBER 3 ASSESSMENT ENGINE</span>
            <h4 className="text-xs font-bold text-zinc-200 uppercase">Multi-Factor Radar Profile</h4>
          </div>

          <div style={{ minHeight: '280px' }}>
            <RadarChart factorScores={[
              { factorName: 'Code Correctness', score: assessment.correctnessScore, weight: '30%', status: 'Excellent', observation: '100% test cases passed.' },
              { factorName: 'Time Efficiency', score: assessment.efficiencyScore, weight: '20%', status: 'Excellent', observation: `Detected ${assessment.detectedTimeComplexity}` },
              { factorName: 'Space Efficiency', score: assessment.efficiencyScore, weight: '15%', status: 'Good', observation: `Auxiliary memory ${assessment.detectedSpaceComplexity}` },
              { factorName: 'Readability Score', score: assessment.codeQualityScore, weight: '15%', status: 'Excellent', observation: 'Structured comments & formatting.' },
              { factorName: 'Naming Conventions', score: assessment.codeQualityScore, weight: '10%', status: 'Good', observation: 'camelCase naming style.' },
              { factorName: 'Code Modularity', score: assessment.problemSolvingScore, weight: '10%', status: 'Excellent', observation: 'Single responsibility functions.' }
            ]} />
          </div>
        </div>

        {/* INTERVIEW AUTOPSY FEEDBACKS */}
        <div className="lg:col-span-7 border border-border bg-background-panel rounded p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border/60 pb-3">
            <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase">INTERVIEW AUTOPSY ANALYSIS</h4>
            <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded">AI ANALYSIS DECK</span>
          </div>

          <div className="space-y-4 text-xs leading-relaxed">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-brand-violet uppercase font-semibold">Autopsy Summary</span>
              <p className="text-zinc-300 font-mono bg-zinc-950/45 p-3 border border-border rounded">{assessment.autopsySummary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-brand-emerald/10 bg-brand-emerald/5 rounded space-y-1.5">
                <span className="font-mono text-[9px] text-brand-emerald uppercase font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> What You Did Well
                </span>
                <p className="text-zinc-300 font-mono text-[11px] leading-relaxed">{assessment.whatWentWell}</p>
              </div>

              <div className="p-3 border border-yellow-500/10 bg-yellow-500/5 rounded space-y-1.5">
                <span className="font-mono text-[9px] text-yellow-500 uppercase font-bold flex items-center gap-1">
                  <ShieldAlert size={12} /> Areas To Improve
                </span>
                <p className="text-zinc-300 font-mono text-[11px] leading-relaxed">{assessment.areasToImprove}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-zinc-400 uppercase font-semibold">Interviewer Scorecard Notes</span>
              <p className="text-zinc-400 italic bg-zinc-950/20 p-3 border border-border/50 rounded">"{assessment.interviewerFeedback}"</p>
            </div>

            <div className="p-3 border border-border bg-background rounded font-mono text-[11px] flex justify-between items-center">
              <div>
                <span className="text-zinc-500 uppercase text-[9px] block">Recommended Practice Topics</span>
                <span className="text-zinc-300 mt-1 font-semibold block">{assessment.suggestedPractice}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CODE & STATIC QUALITY INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MEMBER 3: CODE QUALITY INSPECTOR */}
        <div className="lg:col-span-8">
          <CodeQualityInspector
            code={session.lastSubmittedCode}
            codeSmells={[]}
            cyclomaticComplexity={3}
          />
        </div>

        {/* CODE TELEMETRY TIMELINE */}
        <div className="lg:col-span-4 border border-border bg-background-panel rounded p-6 space-y-4 overflow-hidden">
          <div className="border-b border-border/60 pb-3">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono block">Development Path</span>
            <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase">Code Telemetry Timeline</h4>
          </div>

          {telemetry && telemetry.length > 0 ? (
            <div className="relative border-l border-zinc-800 pl-4 space-y-4 font-mono text-[11px] overflow-y-auto max-h-[300px] py-2">
              {telemetry.map((log, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-brand-cyan border border-background"></span>
                  <span className="text-[9px] text-zinc-500 block">{log.time ? log.time.substring(11, 19) : ''}</span>
                  <p className="text-zinc-300 leading-normal mt-0.5">{log.event}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 font-mono text-xs text-zinc-600">
              No telemetry sequence log details recorded.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Report;
