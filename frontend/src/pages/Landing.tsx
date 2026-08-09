import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Brain, ShieldAlert, ArrowRight, Play, Code2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mockAiMessage, setMockAiMessage] = useState('');
  const fullMessage = "Let's check the complexity here. You used a double nested loop which makes this O(N^2). Can you optimize this to linear time using a Hash Map?";
  
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

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans grid-mesh relative overflow-hidden">
      <div className="absolute inset-0 radial-highlight pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
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
              className="px-4 py-1.5 rounded border border-brand-cyan/40 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan font-mono text-xs transition duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-mono mb-4">
            <Sparkles size={12} />
            <span>KODEXIS ASSESSMENT LABORATORY</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold font-mono tracking-tight text-white leading-tight">
            Don't just write code.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">
              Prove how you think.
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-zinc-400 text-sm md:text-base leading-relaxed">
            KODEXIS simulates real software engineering interviews and evaluates your correctness, complexity, reasoning, debugging, code quality, and communication using AI-powered assessment intelligence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded bg-brand-cyan text-background font-semibold font-mono text-sm hover:bg-brand-cyan/90 transition duration-200"
            >
              <span>Start AI Interview</span>
              <Play size={16} fill="currentColor" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded border border-border bg-zinc-900/30 text-zinc-300 font-mono text-sm hover:border-zinc-700 transition duration-200"
            >
              <span>Explore Assessment Engine</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>

        {/* HERO MOCK LAB SCREEN */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 border border-border bg-background-panel rounded-lg shadow-2xl shadow-brand-cyan/5 overflow-hidden text-left"
        >
          {/* Header Bar */}
          <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 text-xs font-mono text-zinc-500">SESSION ID: KDX-827-NVIDIA</span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-[10px] text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
              <span>SIMULATED FEED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[350px]">
            {/* AI Room Mock */}
            <div className="lg:col-span-4 p-4 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">AI INTERVIEWER</span>
                <div className="p-3 rounded border border-brand-violet/20 bg-brand-violet/5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="text-brand-violet" size={14} />
                    <span className="text-xs font-mono text-brand-violet font-semibold">KODEXIS AI</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono min-h-[48px]">{mockAiMessage}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>SPEECH WAVEFORM</span>
                  <span className="text-brand-violet">ACTIVE</span>
                </div>
                <div className="flex items-end justify-between h-8 mt-2 px-2 space-x-0.5">
                  {[20, 60, 40, 80, 50, 30, 70, 90, 40, 60, 30, 50, 80, 40, 20].map((h, i) => (
                    <div
                      key={i}
                      className="bg-brand-violet/60 w-full rounded-t transition"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coding Mock */}
            <div className="lg:col-span-5 p-4 border-b lg:border-b-0 lg:border-r border-border bg-background/50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">CODING SANDBOX</span>
                  <span className="text-xs font-mono text-zinc-400">solution.py</span>
                </div>
                <pre className="font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto">
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
              <div className="p-3 bg-zinc-950/80 rounded border border-border border-l-brand-emerald">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>EXECUTION CONSOLE</span>
                  <span className="text-brand-emerald">SUCCESS</span>
                </div>
                <p className="text-xs font-mono text-zinc-300 mt-1">✓ Test Case 1: Expected: [0, 1] | Actual: [0, 1]</p>
              </div>
            </div>

            {/* Signals Mock */}
            <div className="lg:col-span-3 p-4 bg-background-panel flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">LIVE TELEMETRY</span>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-400">Time Complexity</span>
                      <span className="text-brand-cyan">O(N)</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-cyan w-[90%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-400">Edge Cases</span>
                      <span className="text-yellow-500">Observed</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[70%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-400">Debugging Loop</span>
                      <span className="text-brand-emerald">Clean</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-emerald w-[95%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-border/80 bg-zinc-900/30 rounded">
                <p className="text-[9px] font-mono text-zinc-500 uppercase">EVALUATION DNA</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan"></div>
                  <span className="text-xs font-mono font-semibold">82 Readiness Score</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* WHY KODEXIS */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-mono text-brand-violet uppercase tracking-widest">THE KODEXIS METHOD</span>
          <h3 className="text-2xl md:text-4xl font-bold font-mono text-white">Correctness ≠ Interview Readiness</h3>
          <p className="max-w-xl mx-auto text-sm text-zinc-400">
            Passing test cases is only 30% of an assessment. The engineering logic, complexity awareness, edge-case checking, and communication determine true technical fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-border bg-background-panel rounded space-y-3">
            <div className="w-10 h-10 rounded bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
              <Brain className="text-brand-cyan" size={20} />
            </div>
            <h4 className="text-md font-mono font-semibold text-zinc-200">Algorithmic Complexity</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We extract Big-O time and space complexities statically and via AI review, benchmarking candidates against the optimal implementation.
            </p>
          </div>
          <div className="p-6 border border-border bg-background-panel rounded space-y-3">
            <div className="w-10 h-10 rounded bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center">
              <ShieldAlert className="text-brand-violet" size={20} />
            </div>
            <h4 className="text-md font-mono font-semibold text-zinc-200">Defensive Edge Cases</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We test if code handles blank collections, null values, single element sequences, duplicate bounds, and overflow limits.
            </p>
          </div>
          <div className="p-6 border border-border bg-background-panel rounded space-y-3">
            <div className="w-10 h-10 rounded bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center">
              <Terminal className="text-brand-emerald" size={20} />
            </div>
            <h4 className="text-md font-mono font-semibold text-zinc-200">Debugging Resilience</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We map code telemetry events, tracking compiler errors, failed submissions, time to resolve, and recovery loops.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-mono text-brand-cyan uppercase tracking-widest text-center">JOURNEY TIMELINE</span>
          <h3 className="text-2xl md:text-4xl font-bold font-mono text-white">The Assessment Loop</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {[
            { num: "01", title: "Configure", desc: "Select DSA difficulty, duration, and runtime language options." },
            { num: "02", title: "AI Interview", desc: "The AI interviewer initiates conversational scope checks." },
            { num: "03", title: "IDE Sandbox", desc: "Write, dry-run, and debug code under real sandbox telemetry." },
            { num: "04", title: "Autopsy Report", desc: "Get detailed, 9-factor scores, Big-O reviews, and practice recommendations." }
          ].map((step, idx) => (
            <div key={idx} className="p-5 border border-border bg-zinc-950/40 rounded space-y-3 relative">
              <span className="text-3xl font-bold text-zinc-700/60 block">{step.num}</span>
              <h4 className="text-sm font-bold text-zinc-200">{step.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border bg-zinc-950/20 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h3 className="text-3xl md:text-5xl font-mono font-bold text-white">
            Ready to prove how you think?
          </h3>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Create a profile, load the coding laboratory, and evaluate your programming abilities under real AI-interview constraints.
          </p>
          <div>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 px-8 py-3 bg-brand-cyan text-background font-bold font-mono text-sm rounded mx-auto hover:bg-brand-cyan/95 transition duration-200"
            >
              <span>Enter the KODEXIS Interview Lab</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background py-8 text-center text-xs font-mono text-zinc-600">
        <p>© 2026 KODEXIS. AI Technical Interview Sandbox. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
