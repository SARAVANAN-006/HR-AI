import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Settings, BrainCircuit, User, Heart, ShieldAlert, VolumeX, Sparkles } from 'lucide-react';

const StartInterview: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string>('MEDIUM');
  const [language, setLanguage] = useState<string>('PYTHON');
  const [duration, setDuration] = useState<number>(45);
  const [mode, setMode] = useState<string>('Full Simulation');
  const [loading, setLoading] = useState<boolean>(false);

  // New Dossier & Persona States
  const [candidateAlias, setCandidateAlias] = useState<string>('Vicky');
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');
  const [candidateMood, setCandidateMood] = useState<string>('Feeling Confident');
  const [interviewerPersona, setInterviewerPersona] = useState<string>('Rigorous Tech Lead');

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/interviews', {
        difficulty,
        language,
        durationMinutes: duration,
        interviewMode: mode,
        candidateAlias,
        targetRole,
        candidateMood,
        interviewerPersona
      });
      const session = response.data;
      navigate(`/interview/${session.id}`);
    } catch (error) {
      console.warn('Backend offline, opening simulation...');
      navigate('/interview/1');
    } finally {
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

  const moods = [
    { name: 'Feeling Confident', emoji: '😎', style: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' },
    { name: 'A Bit Nervous', emoji: '😰', style: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-300' },
    { name: 'Zen Mode', emoji: '🧘', style: 'border-brand-cyan/20 bg-brand-cyan/5 text-brand-cyan' },
    { name: 'Ready to Cook', emoji: '🔥', style: 'border-brand-violet/20 bg-brand-violet/5 text-brand-violet' }
  ];

  const personas = [
    {
      name: 'Rigorous Tech Lead',
      tag: 'STRICT',
      desc: 'Focuses heavily on time/space efficiency, boundary constraints, and optimal structures.',
      icon: ShieldAlert,
      color: 'border-brand-violet hover:border-brand-violet/60 text-brand-violet bg-brand-violet/5',
      normalColor: 'border-border bg-background-panel text-zinc-400'
    },
    {
      name: 'Friendly Peer/Mentor',
      tag: 'HELPFUL',
      desc: 'Warm, highly encouraging, guides conceptually through errors and validates approach.',
      icon: Heart,
      color: 'border-emerald-500 hover:border-emerald-500/60 text-emerald-400 bg-emerald-500/5',
      normalColor: 'border-border bg-background-panel text-zinc-400'
    },
    {
      name: 'Chaotic Code Critic',
      tag: 'CHAOTIC',
      desc: 'Slightly sarcastic, playful, and questions assumptions. Challenges logic humorously.',
      icon: Sparkles,
      color: 'border-amber-500 hover:border-amber-500/60 text-amber-400 bg-amber-500/5',
      normalColor: 'border-border bg-background-panel text-zinc-400'
    },
    {
      name: 'Silent Auditor',
      tag: 'QUIET',
      desc: 'Formal, concise, speaks only when code is compiled or review is explicitly requested.',
      icon: VolumeX,
      color: 'border-brand-cyan hover:border-brand-cyan/60 text-brand-cyan bg-brand-cyan/5',
      normalColor: 'border-border bg-background-panel text-zinc-400'
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans select-none">
      
      {/* Header */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-wide">Enter the Interview Sandbox</h2>
          <p className="text-xs text-zinc-400 mt-1">Configure your personal dossier, select your challenge parameters, and assign your AI interviewer.</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono bg-zinc-950/40 border border-border px-3 py-1.5 rounded">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-zinc-500">SIMULATOR STATUS:</span>
          <span className="text-emerald-400 font-bold">READY TO DEPLOY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CANDIDATE CONFIG (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* DOSSIER PANEL */}
          <div className="border border-border bg-background-panel rounded p-6 space-y-5">
            <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
              <User size={16} className="text-brand-cyan" />
              <h3 className="text-sm font-mono font-bold text-zinc-200">1. CANDIDATE DOSSIER</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Candidate Alias</label>
                <div className="relative">
                  <input
                    type="text"
                    value={candidateAlias}
                    onChange={(e) => setCandidateAlias(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-brand-cyan transition"
                    placeholder="Enter alias name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Target Position</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-brand-cyan cursor-pointer"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="AI / ML Architect">AI / ML Architect</option>
                  <option value="Data Structures Specialist">Data Structures Specialist</option>
                </select>
              </div>
            </div>

            {/* MOOD / CONFIDENCE */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Current Confidence Mood</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {moods.map((m) => (
                  <button
                    type="button"
                    key={m.name}
                    onClick={() => setCandidateMood(m.name)}
                    className={`p-2.5 rounded border text-[10px] font-mono flex flex-col items-center justify-center gap-1 transition ${
                      candidateMood === m.name
                        ? `${m.style} border-current ring-1 ring-offset-0 ring-current font-bold`
                        : 'border-border bg-background text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-base">{m.emoji}</span>
                    <span>{m.name.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIMULATOR PARAMETERS PANEL */}
          <div className="border border-border bg-background-panel rounded p-6 space-y-5">
            <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
              <Settings size={16} className="text-brand-cyan" />
              <h3 className="text-sm font-mono font-bold text-zinc-200">2. SIMULATION CONSTANTS</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Evaluation Difficulty</label>
                  <span className={`text-[10px] font-mono font-bold ${getDifficultyColor(difficulty)}`}>{difficulty}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXPERT'].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-2 text-[10px] font-mono border rounded hover:border-zinc-700 transition ${
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
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Language Sandbox</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-brand-cyan cursor-pointer"
                  >
                    <option value="PYTHON">Python</option>
                    <option value="JAVA">Java</option>
                    <option value="JAVASCRIPT">JavaScript</option>
                    <option value="CPP">C++</option>
                    <option value="C">C</option>
                    <option value="CSHARP">C#</option>
                    <option value="GO">Go</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Stopwatch Allocation</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full bg-background border border-border/80 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-brand-cyan cursor-pointer"
                  >
                    <option value={15}>15 Min (Speed Run)</option>
                    <option value={30}>30 Min (Standard)</option>
                    <option value={45}>45 Min (Standard L3+)</option>
                    <option value={60}>60 Min (Extended check)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Interviewer Evaluation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'AI Interviewer', desc: 'Interactive chat reasoning check' },
                    { name: 'Full Simulation', desc: 'Monaco compiler + chat reviews' }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setMode(item.name)}
                      className={`p-3 border rounded text-left font-mono hover:border-zinc-700 transition ${
                        mode === item.name
                          ? 'bg-brand-violet/10 border-brand-violet text-zinc-100'
                          : 'border-border bg-background text-zinc-400'
                      }`}
                    >
                      <p className="text-[11px] font-bold">{item.name}</p>
                      <p className="text-[8px] text-zinc-500 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERSONA CARDS & LAUNCH (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
          
          <div className="border border-border bg-background-panel rounded p-6 space-y-4 flex-1">
            <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
              <BrainCircuit size={16} className="text-brand-violet" />
              <h3 className="text-sm font-mono font-bold text-zinc-200">3. SELECT AI INTERVIEWER</h3>
            </div>

            <p className="text-[11px] font-mono text-zinc-400 leading-relaxed mb-4">
              Choose your interviewer's behavioral persona. The model dynamically morphs its logic review strictness, response style, and feedback based on your selection.
            </p>

            <div className="space-y-3">
              {personas.map((p) => {
                const IconComponent = p.icon;
                const isSelected = interviewerPersona === p.name;
                return (
                  <button
                    type="button"
                    key={p.name}
                    onClick={() => setInterviewerPersona(p.name)}
                    className={`w-full p-4 border rounded text-left font-mono transition flex items-start space-x-3.5 ${
                      isSelected ? p.color : p.normalColor
                    } hover:bg-zinc-950/20`}
                  >
                    <div className={`p-2 rounded border mt-0.5 ${isSelected ? 'border-current bg-background' : 'border-border bg-background'}`}>
                      <IconComponent size={14} className={isSelected ? 'animate-pulse' : ''} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold tracking-wide">{p.name}</span>
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded border border-border uppercase ${
                          isSelected ? 'bg-background' : 'bg-background/20 text-zinc-500'
                        }`}>
                          {p.tag}
                        </span>
                      </div>
                      <p className="text-[9px] text-zinc-400 mt-1 leading-normal">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LAUNCH BUTTON */}
          <div className="border border-border bg-background-panel rounded p-6 space-y-4 shrink-0">
            <div className="bg-zinc-950/30 border border-border/40 p-3 rounded text-[10px] font-mono text-zinc-400 space-y-1">
              <div className="flex justify-between">
                <span>Dossier Alias:</span>
                <span className="text-brand-cyan font-bold uppercase">{candidateAlias}</span>
              </div>
              <div className="flex justify-between">
                <span>Interviewer Mode:</span>
                <span className="text-zinc-200">{mode}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Persona:</span>
                <span className="text-brand-violet font-bold">{interviewerPersona.toUpperCase()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              disabled={loading}
              className="w-full py-3.5 rounded bg-brand-cyan hover:bg-brand-cyan/90 text-background font-black font-mono text-xs uppercase transition flex items-center justify-center space-x-2 shadow-lg shadow-brand-cyan/10 hover:shadow-brand-cyan/20 animate-none hover:scale-[1.01]"
            >
              {loading ? (
                <span className="animate-pulse">LAUNCHING ASSESSMENT LABORATORY...</span>
              ) : (
                <>
                  <span>Deploy Simulator</span>
                  <Play size={12} fill="currentColor" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StartInterview;
