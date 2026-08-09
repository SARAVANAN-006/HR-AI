import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Brain, ShieldAlert, ArrowRight, Play, Code2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mockAiMessage, setMockAiMessage] = useState('');
  const [typedTitle, setTypedTitle] = useState('');
  const fullMessage = "Let's check the complexity here. You used a double nested loop which makes this O(N^2). Can you optimize this to linear time using a Hash Map?";
  const titleText = "ENCODE YOUR TECHNICAL DNA";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setMockAiMessage((prev) => prev + fullMessage.charAt(index));
      index++;
      if (index >= fullMessage.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedTitle((prev) => prev + titleText.charAt(index));
      index++;
      if (index >= titleText.length) {
        clearInterval(interval);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans matrix-grid relative overflow-hidden">
      <div className="absolute inset-0 radial-highlight pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center">
              <Code2 size={16} className="text-brand-cyan" />
            </div>
            <div>
              <span className="text-md font-mono font-bold tracking-widest text-zinc-100 uppercase">KODEXIS</span>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 rounded border border-brand-cyan/40 bg-brand-cyan/10 hover:bg-brand-cyan/25 text-brand-cyan font-mono text-xs transition duration-200 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
        {/* Decorative HUD Elements */}
        <div className="absolute top-12 left-8 text-left font-mono text-[9px] text-zinc-500/40 select-none pointer-events-none hidden lg:block space-y-1">
          <p className="font-bold text-zinc-400/50">SYSTEM STATUS: NOMINAL</p>
          <p>LATENCY: 12MS (LOC_SBX)</p>
          <p>ACTIVE_NODE: DE_MD_09</p>
        </div>
        <div className="absolute top-12 right-8 text-right font-mono text-[9px] text-zinc-500/40 select-none pointer-events-none hidden lg:block space-y-1">
          <p className="font-bold text-zinc-400/50">SANDBOX VER: 2.0.4-KDX</p>
          <p>GRID_REF: 829.40 / 129.80</p>
          <p>TELEMETRY: DUP_ON</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-brand-cyan/35 bg-brand-cyan/5 text-brand-cyan text-xs font-mono mb-4 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            <Sparkles size={12} />
            <span>KODEXIS ASSESSMENT LABORATORY</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white leading-none select-none font-mono">
            DON'T JUST <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.45)' }}>COMPILE.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-zinc-100 to-brand-violet neon-text-cyan font-extrabold italic uppercase pl-2">
              {typedTitle}
              <span className="animate-pulse text-brand-cyan font-normal">|</span>
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
            Enter the KODEXIS assessment laboratory. Run algorithm drafts in a secure local sandbox under real-time AI interviewer observations, generating multi-factor telemetry reports on your engineering depth.
          </p>

          {/* Animated ECG Heartbeat Oscilloscope */}
          <div className="w-full max-w-lg mx-auto h-16 flex items-center justify-center my-6 opacity-35 pointer-events-none select-none relative">
            <svg viewBox="0 0 400 100" className="w-full h-full text-brand-cyan" fill="none">
              <defs>
                <linearGradient id="ecg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 0 50 Q 20 50 40 50 Q 50 50 55 45 T 60 55 T 65 50 L 95 50 L 105 10 L 115 90 L 125 50 L 155 50 Q 160 40 165 60 T 170 50 L 220 50 Q 230 50 235 45 T 240 55 T 245 50 L 275 50 L 285 10 L 295 90 L 305 50 L 335 50 Q 340 40 345 60 T 350 50 L 400 50"
                stroke="url(#ecg-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-ecg"
                filter="url(#glow)"
              />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded bg-brand-cyan text-background font-bold font-mono text-sm hover:bg-brand-cyan/95 transition duration-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] transform hover:scale-[1.02]"
            >
              <span>Start AI Interview</span>
              <Play size={15} fill="currentColor" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded border border-brand-violet/30 bg-brand-violet/5 text-brand-violet font-mono text-sm hover:border-brand-violet transition duration-300 transform hover:scale-[1.02]"
            >
              <span>Explore Assessment Engine</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>

        {/* HERO MOCK LAB SCREEN */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 glass-panel animate-glow-cyan rounded-lg overflow-hidden text-left relative shadow-2xl"
        >
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-cyan shadow-glow-cyan" />
          
          {/* Header Bar */}
          <div className="bg-background/40 border-b border-border/40 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 text-xs font-mono text-zinc-500">SESSION ID: KDX-827-MISTRAL</span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-[10px] text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
              <span>SIMULATED FEED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[350px]">
            {/* AI Room Mock */}
            <div className="lg:col-span-4 p-5 flex flex-col justify-between relative overflow-hidden bg-zinc-950/20">
              <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-brand-violet to-transparent" />
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">AI INTERVIEWER</span>
                <div className="p-3.5 rounded-2xl rounded-tl-none border border-brand-violet/25 bg-brand-violet/5 space-y-2 shadow-[0_0_15px_rgba(139,92,246,0.03)]">
                  <div className="flex items-center space-x-2">
                    <Brain className="text-brand-violet" size={14} />
                    <span className="text-xs font-mono text-brand-violet font-bold">KODEXIS AI</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{mockAiMessage}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border/40">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>SPEECH WAVEFORM</span>
                  <span className="text-brand-violet font-bold">ACTIVE</span>
                </div>
                <div className="flex items-end justify-between h-8 mt-2 px-2 space-x-0.5">
                  {[20, 60, 40, 80, 50, 30, 70, 90, 40, 60, 30, 50, 80, 40, 20].map((h, i) => (
                    <div
                      key={i}
                      className="bg-brand-violet/70 w-full rounded-t transition hover:bg-brand-violet"
                      style={{ height: `${h}%`, boxShadow: '0 0 8px #8b5cf6' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coding Mock */}
            <div className="lg:col-span-5 p-5 bg-background/25 flex flex-col justify-between relative overflow-hidden border-y lg:border-y-0 lg:border-x border-border/40">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">CODING SANDBOX</span>
                  <span className="text-xs font-mono text-zinc-400">solution.py</span>
                </div>
                <pre className="font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto select-text">
                  <code>
{`def twoSum(nums, target):
    # Optimizing algorithm...
    seen = {}
    for i, val in enumerate(nums):
        diff = target - val
        if diff in seen:
            return [seen[diff], i]
        seen[val] = i`}
                  </code>
                </pre>
              </div>
              <div className="p-3.5 bg-zinc-950/80 rounded border border-border/40 border-l-brand-emerald shadow-[0_0_15px_rgba(16,185,129,0.02)]">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>EXECUTION CONSOLE</span>
                  <span className="text-brand-emerald font-bold">SUCCESS</span>
                </div>
                <p className="text-xs font-mono text-brand-emerald mt-1 font-semibold">✓ Test Case 1: Expected: [0, 1] | Actual: [0, 1]</p>
              </div>
            </div>

            {/* Signals Mock */}
            <div className="lg:col-span-3 p-5 flex flex-col justify-between relative overflow-hidden bg-zinc-950/20">
              <div className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-brand-cyan to-transparent" />
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">LIVE TELEMETRY</span>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-400">Time Complexity</span>
                      <span className="text-brand-cyan font-bold">O(N)</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-cyan w-[90%]" style={{ boxShadow: '0 0 8px #22d3ee' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-400">Edge Cases</span>
                      <span className="text-yellow-500 font-bold">Observed</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[70%]" style={{ boxShadow: '0 0 8px #f59e0b' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-400">Debugging Loop</span>
                      <span className="text-brand-emerald font-bold">Clean</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-emerald w-[95%]" style={{ boxShadow: '0 0 8px #10b981' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-border/40 bg-zinc-950/50 rounded flex items-center justify-between shadow-[0_0_12px_rgba(34,211,238,0.02)]">
                <div>
                  <p className="text-[8px] font-mono text-zinc-500 uppercase">EVALUATION DNA</p>
                  <span className="text-xs font-mono font-bold neon-text-cyan">82 Readiness Score</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan pulse-dot"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* WHY KODEXIS */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border/40">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-mono text-brand-violet uppercase tracking-widest block">THE KODEXIS METHOD</span>
          <h3 className="text-3xl md:text-5xl font-bold font-mono text-white">Correctness ≠ Interview Readiness</h3>
          <p className="max-w-xl mx-auto text-xs md:text-sm text-zinc-400 font-sans leading-relaxed">
            Passing test cases is only 30% of an assessment. The engineering logic, complexity awareness, edge-case checking, and communication determine true technical fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 glass-panel glass-panel-hover rounded space-y-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-cyan" />
            <div className="w-10 h-10 rounded bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
              <Brain className="text-brand-cyan" size={20} />
            </div>
            <h4 className="text-md font-mono font-semibold text-zinc-200">Algorithmic Complexity</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              We extract Big-O time and space complexities statically and via AI review, benchmarking candidates against the optimal implementation.
            </p>
          </div>
          <div className="p-6 glass-panel glass-panel-hover rounded space-y-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-violet" />
            <div className="w-10 h-10 rounded bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center">
              <ShieldAlert className="text-brand-violet" size={20} />
            </div>
            <h4 className="text-md font-mono font-semibold text-zinc-200">Defensive Edge Cases</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              We test if code handles blank collections, null values, single element sequences, duplicate bounds, and overflow limits.
            </p>
          </div>
          <div className="p-6 glass-panel glass-panel-hover rounded space-y-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-emerald" />
            <div className="w-10 h-10 rounded bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center">
              <Terminal className="text-brand-emerald" size={20} />
            </div>
            <h4 className="text-md font-mono font-semibold text-zinc-200">Debugging Resilience</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              We map code telemetry events, tracking compiler errors, failed submissions, time to resolve, and recovery loops.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 border-t border-border/40">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-mono text-brand-cyan uppercase tracking-widest text-center block">JOURNEY TIMELINE</span>
          <h3 className="text-3xl md:text-5xl font-bold font-mono text-white">The Assessment Loop</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {[
            { num: "01", title: "Configure", desc: "Select DSA difficulty, duration, and runtime language options." },
            { num: "02", title: "AI Interview", desc: "The AI interviewer initiates conversational scope checks." },
            { num: "03", title: "IDE Sandbox", desc: "Write, dry-run, and debug code under real sandbox telemetry." },
            { num: "04", title: "Autopsy Report", desc: "Get detailed, 9-factor scores, Big-O reviews, and practice recommendations." }
          ].map((step, idx) => (
            <div key={idx} className="p-5 glass-panel glass-panel-hover rounded space-y-3 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-cyan to-transparent" />
              <span className="text-3xl font-black font-mono text-zinc-800 tracking-widest block neon-text-cyan">{step.num}</span>
              <h4 className="text-sm font-bold text-zinc-200">{step.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border/40 bg-zinc-950/40 py-24 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <h3 className="text-3xl md:text-6xl font-mono font-bold text-white tracking-tight">
            Ready to prove how you think?
          </h3>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Create a profile, load the coding laboratory, and evaluate your programming abilities under real AI-interview constraints.
          </p>
          <div>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 px-8 py-4 bg-brand-cyan text-background font-bold font-mono text-sm rounded mx-auto hover:bg-brand-cyan/95 transition duration-200 shadow-[0_0_25px_rgba(34,211,238,0.3)] transform hover:scale-[1.02]"
            >
              <span>Enter the KODEXIS Interview Lab</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-background py-8 text-center text-xs font-mono text-zinc-600">
        <p>© 2026 KODEXIS. AI Technical Interview Sandbox. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
