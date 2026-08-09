import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Settings, BrainCircuit } from 'lucide-react';

const StartInterview: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string>('MEDIUM');
  const [language, setLanguage] = useState<string>('PYTHON');
  const [duration, setDuration] = useState<number>(45);
  const [mode, setMode] = useState<string>('Full Simulation');
  const [loading, setLoading] = useState<boolean>(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/interviews', {
        difficulty,
        language,
        durationMinutes: duration,
        interviewMode: mode
      });
      const session = response.data;
      navigate(`/interview/${session.id}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Error launching session. Check server connections.');
      setLoading(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'BEGINNER': return 'text-zinc-400';
      case 'EASY': return 'text-green-400';
      case 'MEDIUM': return 'text-brand-cyan';
      case 'HARD': return 'text-brand-violet';
      default: return 'text-red-400';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase">Start Interview Session</h2>
        <p className="text-xs text-zinc-400">Configure parameters for entering the KODEXIS Technical Interview Sandbox.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* CONFIG OPTIONS */}
        <div className="md:col-span-7 border border-border bg-background-panel rounded p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
            <Settings size={16} className="text-brand-cyan" />
            <h3 className="text-sm font-mono font-bold text-zinc-200">CONFIGURATION PANEL</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Evaluation Difficulty</label>
                <span className={`text-xs font-mono font-bold ${getDifficultyColor(difficulty)}`}>{difficulty}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXPERT'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2 text-[10px] font-mono border rounded hover:border-zinc-500 transition ${
                      difficulty === d
                        ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan font-bold'
                        : 'border-border bg-background text-zinc-400'
                    }`}
                  >
                    {d.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Programming Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-brand-cyan"
                >
                  <option value="JAVA">Java</option>
                  <option value="PYTHON">Python</option>
                  <option value="JAVASCRIPT">JavaScript</option>
                  <option value="CPP">C++</option>
                  <option value="C">C</option>
                  <option value="CSHARP">C#</option>
                  <option value="GO">Go</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Duration Allocation</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-brand-cyan"
                >
                  <option value={15}>15 Min (Speed Check)</option>
                  <option value={30}>30 Min (Standard)</option>
                  <option value={45}>45 Min (Standard L3+)</option>
                  <option value={60}>60 Min (Rigor Check)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Interviewer Feedback Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'AI Interviewer', desc: 'Chat reasoning check' },
                  { name: 'Full Simulation', desc: 'Code + Chat follow-up' }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setMode(item.name)}
                    className={`p-3 border rounded text-left font-mono hover:border-zinc-500 transition ${
                      mode === item.name
                        ? 'bg-brand-violet/10 border-brand-violet text-zinc-100'
                        : 'border-border bg-background text-zinc-400'
                    }`}
                  >
                    <p className="text-xs font-bold">{item.name}</p>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS READOUT */}
        <div className="md:col-span-5 border border-border bg-background-panel rounded p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
              <BrainCircuit size={16} className="text-brand-violet" />
              <h3 className="text-sm font-mono font-bold text-zinc-200">ASSESSMENT METRICS</h3>
            </div>
            
            <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">
              Your technical assessment is derived from nine weighted metrics computed dynamically inside the sandbox telemetry.
            </p>

            <div className="space-y-2 font-mono text-[10px]">
              {[
                { name: 'Code Correctness', weight: '30%', desc: 'Passed test cases (hidden & public)' },
                { name: 'Problem Solving Approach', weight: '20%', desc: 'Optimal model formulation' },
                { name: 'Complexity Optimization', weight: '15%', desc: 'Time & auxiliary space Big-O comparison' },
                { name: 'Defensive Edge Cases', weight: '10%', desc: 'Checks on null, empty, boundary inputs' },
                { name: 'Debugging Resilience', weight: '10%', desc: 'Compile crash recovery speed' },
                { name: 'Communication Quality', weight: '5%', desc: 'Concept clarity explanations' }
              ].map((metric) => (
                <div key={metric.name} className="p-2 border border-border bg-background/40 rounded flex justify-between items-center">
                  <div>
                    <p className="font-bold text-zinc-300">{metric.name}</p>
                    <p className="text-[8px] text-zinc-500">{metric.desc}</p>
                  </div>
                  <span className="text-brand-cyan font-bold">{metric.weight}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full mt-6 py-3 rounded bg-brand-cyan text-background font-bold font-mono text-xs uppercase hover:bg-brand-cyan/95 transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>LAUNCHING SIMULATOR...</span>
            ) : (
              <>
                <span>Enter Laboratory</span>
                <Play size={12} fill="currentColor" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default StartInterview;
