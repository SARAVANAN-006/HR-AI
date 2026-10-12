import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Bot,
  ArrowRight,
  Minimize2
} from 'lucide-react';

interface GuideMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: Array<{
    label: string;
    path: string;
  }>;
}

const QUICK_PROMPTS = [
  { label: '🎯 How do I practice coding?', query: 'How do I practice coding questions?' },
  { label: '🎙️ What is Elsa AI Interview?', query: 'Tell me about Elsa AI real-time interview.' },
  { label: '📚 How does Socratic Tutor work?', query: 'How does Socratic AI Tutor work?' },
  { label: '⚡ What is Full Simulation?', query: 'What is Full Simulation mode and does it lock the editor?' },
  { label: '📊 Where are my skill scores?', query: 'Where do I see my live skill scores and telemetry?' },
];

export const KodexisGuideBot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<GuideMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Welcome to **KODEXIS**! I am your Platform Guide. I can walk you through our **Interview Lab**, **Elsa AI Tech Lead Interview**, **Multimodal Socratic Tutor**, and **Candidate Skill Telemetry**.\n\nClick any topic below or ask me anything to get started!",
      timestamp: 'Just now',
      actionButtons: [
        { label: 'Sign In to Kodexis', path: '/login' },
        { label: 'Learn More', path: '/login' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const generateBotReply = (userQuery: string): GuideMessage => {
    const q = userQuery.toLowerCase().trim();

    if (q.includes('practice') || q.includes('code') || q.includes('coding') || q.includes('question')) {
      return {
        id: 'reply-' + Date.now(),
        sender: 'bot',
        text: "**Interview Lab & Coding Arena**:\n\n• Choose from **20+ algorithmic challenges** across Arrays, Dynamic Programming, Graphs, Trees, and System Design.\n• Features a real-time Monaco Code Editor (Python, Java, C++, JS), automated test case execution, and randomized problem generation.\n• Each submission triggers multi-factor evaluation of time/space complexity, modularity, and proctoring compliance.",
        timestamp: 'Just now',
        actionButtons: [
          { label: 'Start Coding Practice', path: '/login' }
        ]
      };
    }

    if (q.includes('elsa') || q.includes('voice') || q.includes('audio') || q.includes('camera') || q.includes('stark')) {
      return {
        id: 'reply-' + Date.now(),
        sender: 'bot',
        text: "**Elsa AI Tech Lead Interview**:\n\n• Experience a real conversational technical interview powered by continuous speech recognition, camera framing, and neural TTS.\n• Elsa dynamically adapts follow-up questions across 10 CS disciplines (OS, Networking, DBMS, DSA, AI/ML, System Design).\n• When you finish or quit, Elsa provides an immediate **Rubric Formula Autopsy** with your transparent score breakdown and hiring recommendation.",
        timestamp: 'Just now',
        actionButtons: [
          { label: 'Launch Elsa AI Interview', path: '/login' }
        ]
      };
    }

    if (q.includes('socratic') || q.includes('tutor') || q.includes('pdf') || q.includes('notes') || q.includes('knowledge') || q.includes('rag')) {
      return {
        id: 'reply-' + Date.now(),
        sender: 'bot',
        text: "**Unified Multimodal Knowledge & Socratic AI Hub**:\n\n• Upload your course PDFs, lecture slides, and notes (parsed page-by-page with `pdfjs-dist`).\n• Socratic AI retrieves relevant excerpts with exact document citations and guides you through deep concepts without spoiling the answers.\n• You can query any unit, ask probing questions, or delete notes anytime with one click.",
        timestamp: 'Just now',
        actionButtons: [
          { label: 'Open Socratic AI Tutor', path: '/login' }
        ]
      };
    }

    if (q.includes('simulation') || q.includes('lock') || q.includes('editor')) {
      return {
        id: 'reply-' + Date.now(),
        sender: 'bot',
        text: "**Full Simulation Mode**:\n\n• In Full Simulation sandbox, the **code editor is ALWAYS open and never locked**!\n• You can immediately type, run tests, and debug your solution without mandatory chat gates.\n• If you ever enter AI Interview mode, you can also click **'Unlock Editor Directly'** anytime to bypass discussion.",
        timestamp: 'Just now',
        actionButtons: [
          { label: 'Launch Sandbox', path: '/login' }
        ]
      };
    }

    if (q.includes('score') || q.includes('skill') || q.includes('chart') || q.includes('telemetry') || q.includes('dashboard') || q.includes('sql')) {
      return {
        id: 'reply-' + Date.now(),
        sender: 'bot',
        text: "**Candidate Skill Telemetry & Custom Visuals**:\n\n• Every interview, test run, and behavior is dynamically stored in dedicated MySQL telemetry tables (`candidate_skill_telemetry`).\n• View transparent scores based on code correctness, efficiency, and coding style.\n• Personalize your dashboard visuals with your preferred chart type: **Bar Chart**, **Histogram**, **Pie Chart**, or **Radar Chart**!",
        timestamp: 'Just now',
        actionButtons: [
          { label: 'View Analytics Dashboard', path: '/login' }
        ]
      };
    }

    return {
      id: 'reply-' + Date.now(),
      sender: 'bot',
      text: "I can help guide you through KODEXIS!\n\n• **Interview Lab**: Coding Sandbox with random challenges and Piston runtime.\n• **Elsa AI Interview**: Live audio-video conversational technical interview.\n• **Socratic AI Tutor**: RAG-grounded learning from your uploaded course notes.\n• **Candidate Dashboard**: Real-time skill proficiency tracking and SQL telemetry.",
      timestamp: 'Just now',
      actionButtons: [
        { label: 'Sign In to Kodexis', path: '/login' }
      ]
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: GuideMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const botReply = generateBotReply(text);
      setMessages(prev => [...prev, botReply]);
    }, 350);
  };

  return (
    <aside aria-label="Kodexis Guide Assistant" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-zinc-950 font-mono text-xs font-bold shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
          title="Open Kodexis Platform Guide"
        >
          <div className="relative">
            <Bot size={18} className="text-zinc-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold tracking-wide">Platform Guide Bot</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-black/20 text-zinc-950 font-bold uppercase">
            Ask AI
          </span>
        </button>
      )}

      {/* EXPANDED GUIDE CHAT MODAL */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl border border-cyan-500/40 bg-zinc-950/95 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden animate-fade-in text-zinc-100">
          {/* HEADER */}
          <div className="px-4 py-3.5 border-b border-border/80 bg-zinc-900/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-zinc-100 flex items-center gap-1.5">
                  <span>KODEXIS GUIDE BOT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] font-mono text-zinc-400">
                  Interactive Platform Navigator
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
              title="Close guide bot"
            >
              <Minimize2 size={15} />
            </button>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-500 text-zinc-950 font-medium rounded-tr-none'
                      : 'bg-zinc-900/90 border border-border/80 text-zinc-200 rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">
                    {m.text}
                  </div>

                  {m.actionButtons && m.actionButtons.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {m.actionButtons.map((btn, idx) => (
                        <button
                          key={idx}
                          onClick={() => navigate(btn.path)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1 transition"
                        >
                          <span>{btn.label}</span>
                          <ArrowRight size={11} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTION CHIPS */}
          <div className="px-3 py-2 border-t border-border/50 bg-zinc-950/40 overflow-x-auto flex gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.query)}
                className="shrink-0 px-2.5 py-1 rounded-full border border-border hover:border-cyan-500/40 bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-300 text-[10px] font-mono transition"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* CHAT INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border/80 bg-zinc-900/90 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask how any feature works..."
              className="flex-1 bg-zinc-950 border border-border/80 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/60"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-zinc-950 font-bold transition shrink-0"
              title="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
