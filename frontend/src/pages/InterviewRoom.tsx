import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { Brain, Play, Send, Activity, Award, Clock, Code2, Maximize2, Minimize2, FileCode, GitCommit, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  javaTemplate: string;
  pythonTemplate: string;
  javascriptTemplate: string;
  cppTemplate: string;
  cTemplate: string;
  csharpTemplate: string;
  goTemplate: string;
  testCases: TestCase[];
}

interface Session {
  id: number;
  question: Question;
  state: string;
  language: string;
  difficulty: string;
  durationMinutes: number;
  interviewMode: string;
  startedAt: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface VisualizerStep {
  title: string;
  desc: string;
  array?: number[];
  activeIdx?: number;
  map?: Record<string, number>;
  sum?: number;
  maxLen?: number;
  inputStr?: string;
  charIdx?: number;
  stack?: string[];
  status: string;
}

interface ProblemVisualizerProps {
  questionTitle: string;
}

const ProblemVisualizer: React.FC<ProblemVisualizerProps> = ({ questionTitle }) => {
  const [step, setStep] = useState<number>(0);

  // Define steps for each problem
  const getProblemSteps = (): VisualizerStep[] => {
    if (questionTitle.toLowerCase().includes("two sum") || questionTitle.toLowerCase().includes("twosum")) {
      return [
        {
          title: "Setup & State Initialization",
          desc: "We initialize an empty Hash Map to track numbers we've seen and their indices. Target sum is 9.",
          array: [2, 7, 11, 15],
          activeIdx: -1,
          map: {},
          status: "Map is empty. Target = 9."
        },
        {
          title: "Step 1: Check Element '2'",
          desc: "Target - Element = 9 - 2 = 7. We check if 7 is in the Map. It is not. We store 2 with its index 0 in the Map.",
          array: [2, 7, 11, 15],
          activeIdx: 0,
          map: { "2": 0 },
          status: "Map now tracks: {2: 0}"
        },
        {
          title: "Step 2: Check Element '7'",
          desc: "Target - Element = 9 - 7 = 2. We check if 2 is in the Map. Yes, 2 exists at index 0! We found our pair.",
          array: [2, 7, 11, 15],
          activeIdx: 1,
          map: { "2": 0 },
          status: "Match Found! Return indices [0, 1]."
        }
      ];
    }

    if (questionTitle.toLowerCase().includes("longest") || questionTitle.toLowerCase().includes("subarray")) {
      return [
        {
          title: "Setup & Prefix Maps",
          desc: "We track the running cumulative sum. We seed the Map with sum 0 at index -1 to handle subarrays starting from index 0. Target sum k = 15.",
          array: [1, 2, 3, 7, 5],
          activeIdx: -1,
          sum: 0,
          map: { "0": -1 },
          maxLen: 0,
          status: "Cumulative Sum = 0"
        },
        {
          title: "Step 1: Process '1'",
          desc: "Cumulative sum is 1. We check if sum - k (1 - 15 = -14) is in the Map. No. We store sum 1 at index 0.",
          array: [1, 2, 3, 7, 5],
          activeIdx: 0,
          sum: 1,
          map: { "0": -1, "1": 0 },
          maxLen: 0,
          status: "Cumulative Sum = 1"
        },
        {
          title: "Step 2: Process '2'",
          desc: "Cumulative sum is 3. Diff (3 - 15 = -12) not in map. Store sum 3 at index 1.",
          array: [1, 2, 3, 7, 5],
          activeIdx: 1,
          sum: 3,
          map: { "0": -1, "1": 0, "3": 1 },
          maxLen: 0,
          status: "Cumulative Sum = 3"
        },
        {
          title: "Step 3: Process '3'",
          desc: "Cumulative sum is 6. Diff (6 - 15 = -9) not in map. Store sum 6 at index 2.",
          array: [1, 2, 3, 7, 5],
          activeIdx: 2,
          sum: 6,
          map: { "0": -1, "1": 0, "3": 1, "6": 2 },
          maxLen: 0,
          status: "Cumulative Sum = 6"
        },
        {
          title: "Step 4: Process '7'",
          desc: "Cumulative sum is 13. Diff (13 - 15 = -2) not in map. Store sum 13 at index 3.",
          array: [1, 2, 3, 7, 5],
          activeIdx: 3,
          sum: 13,
          map: { "0": -1, "1": 0, "3": 1, "6": 2, "13": 3 },
          maxLen: 0,
          status: "Cumulative Sum = 13"
        },
        {
          title: "Step 5: Process '5'",
          desc: "Cumulative sum is 18. Diff (18 - 15 = 3) is found in the Map at index 1! Subarray length = 5 - 1 = 4. Update Max Length.",
          array: [1, 2, 3, 7, 5],
          activeIdx: 4,
          sum: 18,
          map: { "0": -1, "1": 0, "3": 1, "6": 2, "13": 3 },
          maxLen: 4,
          status: "Subarray [2,3,7,5] sums to 15! Max length = 4."
        }
      ];
    }

    // Default to Valid Parentheses / Stack
    return [
      {
        title: "Setup Empty Stack",
        desc: "We initialize an empty stack to track unmatched opening brackets. String = '()[]{}'",
        inputStr: "()[]{}",
        charIdx: -1,
        stack: [],
        status: "Stack is empty."
      },
      {
        title: "Step 1: Parse '('",
        desc: "Opening bracket encountered. We push '(' onto the stack.",
        inputStr: "()[]{}",
        charIdx: 0,
        stack: ["("],
        status: "Stack: ['(']"
      },
      {
        title: "Step 2: Parse ')'",
        desc: "Closing bracket. We pop from stack: popped '(' matches ')'. Match valid.",
        inputStr: "()[]{}",
        charIdx: 1,
        stack: [],
        status: "Pop matched. Stack is empty."
      },
      {
        title: "Step 3: Parse '['",
        desc: "Opening bracket. Push '[' onto stack.",
        inputStr: "()[]{}",
        charIdx: 2,
        stack: ["["],
        status: "Stack: ['[']"
      },
      {
        title: "Step 4: Parse ']'",
        desc: "Closing bracket. Pop from stack: popped '[' matches ']'. Match valid.",
        inputStr: "()[]{}",
        charIdx: 3,
        stack: [],
        status: "Pop matched. Stack is empty."
      },
      {
        title: "Step 5: Parse '{'",
        desc: "Opening bracket. Push '{' onto stack.",
        inputStr: "()[]{}",
        charIdx: 4,
        stack: ["{"],
        status: "Stack: ['{']"
      },
      {
        title: "Step 6: Parse '}'",
        desc: "Closing bracket. Pop from stack: popped '{' matches '}'. Stack empty. String is valid.",
        inputStr: "()[]{}",
        charIdx: 5,
        stack: [],
        status: "Valid parenthesis parsing complete!"
      }
    ];
  };

  const steps = getProblemSteps();
  const currentStep = steps[Math.min(step, steps.length - 1)];

  return (
    <div className="space-y-6">
      
      {/* 1. Space Time Complexity Chart Visual */}
      <div className="border border-border bg-zinc-950/40 p-4 space-y-3 rounded">
        <h4 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5 font-mono">
          <Activity size={12} className="text-brand-violet" />
          <span>Space-Time Complexity Curve</span>
        </h4>
        
        {/* Glow Filters SVG */}
        <div className="relative h-32 border border-zinc-900 bg-black/60 rounded overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full px-2" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="glowCyan" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9"/>
              </linearGradient>
              <linearGradient id="glowViolet" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line x1="20" y1="10" x2="20" y2="90" stroke="#18181b" strokeWidth="1" />
            <line x1="20" y1="90" x2="190" y2="90" stroke="#18181b" strokeWidth="1" />
            
            {/* O(n^2) Quadratic Curve - Red/Violet */}
            <path d="M 20 90 Q 110 80 180 15" fill="none" stroke="url(#glowViolet)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="110" y="35" fill="#8b5cf6" className="text-[7px] font-mono opacity-80">Brute Force O(n²)</text>
            
            {/* O(n) Linear Curve - Cyan */}
            <line x1="20" y1="90" x2="180" y2="50" stroke="url(#glowCyan)" strokeWidth="2" />
            <text x="120" y="65" fill="#22d3ee" className="text-[7px] font-mono font-bold">Optimal O(n)</text>
            
            {/* Axis Titles */}
            <text x="5" y="55" fill="#52525b" className="text-[6px] font-mono" transform="rotate(-90 5 55)">Operations (N)</text>
            <text x="95" y="98" fill="#52525b" className="text-[6px] font-mono">Input Size (N)</text>
          </svg>
        </div>
        <p className="text-[9px] text-zinc-500 leading-relaxed font-sans select-none">
          Optimal time complexity reduces execution bounds linearly. Brute-force nested traversals scale quadratically, risking CPU throttles on large input sizes.
        </p>
      </div>

      {/* 2. Interactive Logic Flow Sandbox */}
      <div className="border border-border bg-zinc-950/40 p-4 space-y-4 rounded">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5 font-mono">
            <GitCommit size={12} className="text-brand-cyan" />
            <span>Logic Trace Visualizer</span>
          </h4>
          
          {/* Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setStep(prev => Math.max(0, prev - 1))}
              disabled={step === 0}
              className="p-1 border border-border rounded hover:bg-zinc-800 transition disabled:opacity-30"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-[9px] font-mono text-zinc-500">{step + 1}/{steps.length}</span>
            <button
              onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={step === steps.length - 1}
              className="p-1 border border-border rounded hover:bg-zinc-800 transition disabled:opacity-30"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Step details */}
        <div className="space-y-3 font-mono">
          <div className="p-2 border border-zinc-900 bg-black/30 rounded">
            <span className="text-[9px] text-brand-cyan uppercase block mb-0.5">Phase: {currentStep.title}</span>
            <p className="text-[10px] text-zinc-300 font-sans leading-relaxed">{currentStep.desc}</p>
          </div>

          {/* Visual representations */}
          <div className="space-y-3 pt-2">
            {/* Render Arrays if present */}
            {currentStep.array && (
              <div className="space-y-1">
                <span className="text-[8px] text-zinc-500 uppercase">Input Array:</span>
                <div className="flex space-x-1.5">
                  {currentStep.array.map((val: number, idx: number) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded border flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        currentStep.activeIdx === idx
                          ? 'border-brand-cyan bg-brand-cyan/20 text-brand-cyan scale-105 shadow-glow-cyan'
                          : 'border-border bg-zinc-900/50 text-zinc-400'
                      }`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Render Input String (for Valid Parentheses) */}
            {currentStep.inputStr && (
              <div className="space-y-1">
                <span className="text-[8px] text-zinc-500 uppercase">Input String:</span>
                <div className="flex space-x-1 text-sm font-bold tracking-widest pl-1">
                  {currentStep.inputStr.split("").map((char: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-1 rounded transition-all duration-300 ${
                        currentStep.charIdx !== undefined && currentStep.charIdx === idx
                          ? 'text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20'
                          : currentStep.charIdx !== undefined && idx < currentStep.charIdx
                          ? 'text-zinc-600 line-through'
                          : 'text-zinc-300'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Render Map (if present) */}
            {currentStep.map && (
              <div className="space-y-1">
                <span className="text-[8px] text-zinc-500 uppercase">Tracking Map:</span>
                <div className="p-2 border border-zinc-900 bg-zinc-900/30 rounded text-[9px] text-zinc-400 min-h-8 flex items-center">
                  {Object.keys(currentStep.map).length === 0 ? (
                    <span className="text-zinc-600 font-bold">{"{ } (empty)"}</span>
                  ) : (
                    <span>
                      {"{ "}
                      {Object.entries(currentStep.map).map(([key, val]: [string, number]) => (
                        <span key={key} className="text-brand-cyan font-bold">
                          {key}: <span className="text-zinc-300">{val}</span>,{" "}
                        </span>
                      ))}
                      {"}"}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Render Stack (if present) */}
            {currentStep.stack && (
              <div className="space-y-1">
                <span className="text-[8px] text-zinc-500 uppercase">Memory Stack:</span>
                <div className="flex flex-col-reverse w-24 border-b-2 border-x-2 border-zinc-800 bg-zinc-900/10 min-h-16 rounded-b">
                  {currentStep.stack.length === 0 ? (
                    <div className="text-[7px] text-zinc-600 text-center py-5 font-bold uppercase select-none">Empty Stack</div>
                  ) : (
                    currentStep.stack.map((char: string, idx: number) => (
                      <div
                        key={idx}
                        className="h-5 border-t border-zinc-800 bg-brand-cyan/5 text-brand-cyan flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-300"
                      >
                        {char}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Status updates */}
            <div className="p-2 bg-zinc-950 border border-zinc-900 rounded text-[9px] text-zinc-400 font-bold border-l-2 border-l-brand-cyan flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
              <span>{currentStep.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InterviewRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('PYTHON');
  
  // Sandbox Console States
  const [terminalOutput, setTerminalOutput] = useState<string>('Terminal initialized. Sandbox engine ready.');
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [consoleTab, setConsoleTab] = useState<'stdout' | 'testcases'>('stdout');
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState<number>(0);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(true);
  const [leftPanelTab, setLeftPanelTab] = useState<'description' | 'analysis'>('description');
  const [testResults, setTestResults] = useState<any[]>([]);

  // Telemetry signals states
  const [signals, setSignals] = useState({
    correctness: { value: 0, label: 'Pending' },
    complexity: { value: 0, label: 'Analyzing' },
    codeQuality: { value: 0, label: 'Pending' },
    edgeCases: { value: 0, label: 'Pending' },
    debugging: { value: 100, label: 'Clean' },
    communication: { value: 50, label: 'Observed' }
  });

  // UI state managers
  const [aiTyping, setAiTyping] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Time remaining stopwatch
  const [timeRemaining, setTimeRemaining] = useState<number>(2700); // 45m default

  useEffect(() => {
    // Fetch Session and Question Details
    axios.get(`/api/interviews/${id}`)
      .then((res) => {
        const sData = res.data as Session;
        setSession(sData);
        setLanguage(sData.language);
        setTimeRemaining(sData.durationMinutes * 60);

        // Load starting code template based on language
        let startingCode = '';
        if (sData.language === 'JAVA') startingCode = sData.question.javaTemplate;
        else if (sData.language === 'PYTHON') startingCode = sData.question.pythonTemplate;
        else if (sData.language === 'JAVASCRIPT') startingCode = sData.question.javascriptTemplate;
        else if (sData.language === 'CPP') startingCode = sData.question.cppTemplate;
        else if (sData.language === 'CSHARP') startingCode = sData.question.csharpTemplate;
        else if (sData.language === 'GO') startingCode = sData.question.goTemplate;
        else startingCode = sData.question.cTemplate;

        setCode(startingCode || '# Complete your code here');

        // Load Chat logs
        return axios.get(`/api/interviews/${id}/messages`);
      })
      .then((res) => {
        if (res) setMessages(res.data);
      })
      .catch((err) => {
        console.error('Failed to load interview room details:', err);
      });
  }, [id]);

  useEffect(() => {
    // Scroll Chat to bottom when new message arrives
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stopwatch effect
  useEffect(() => {
    if (timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'CANDIDATE', content: userText, timestamp: new Date().toISOString() }]);
    setAiTyping(true);

    // Dynamic signal updates based on communication length/terms
    setSignals(prev => ({
      ...prev,
      communication: { value: Math.min(100, prev.communication.value + 10), label: 'Observed' }
    }));

    try {
      const response = await axios.post(`/api/interviews/${id}/message`, { content: userText });
      setMessages((prev) => [...prev, response.data]);
      
      // Update session state locally if AI tells the candidate to code
      if (session && session.state === 'DISCUSSION') {
        const text = (response.data.content as string).toLowerCase();
        if (text.includes("proceed to code") || text.includes("start writing") || text.includes("editor panel")) {
          setSession(prev => prev ? { ...prev, state: 'CODING' } : null);
        }
      }
    } catch (error) {
      console.error('Failed to post message:', error);
    } finally {
      setAiTyping(false);
    }
  };

  const handleRunCode = async () => {
    setTerminalStatus('running');
    setTerminalOutput('Initializing sandbox runtime...\nConnecting to public execution containers...\nRunning solution...');
    setTestResults([]);

    try {
      const response = await axios.post(`/api/interviews/${id}/run`, { code, language });
      const outcome = response.data;
      
      // Print execution logs
      let logText = `Execution status: ${outcome.status}\nPassed cases: ${outcome.passedCases} / ${outcome.totalCases}\nTime elapsed: ${outcome.executionTimeMs}ms\n\n`;
      if (outcome.status === 'COMPILE_ERROR' || outcome.status === 'RUNTIME_ERROR') {
        setTerminalStatus('error');
        logText += `Error Details:\n${outcome.consoleOutput}`;
        
        // Deduct debugging score slightly on compiles/runtime failures
        setSignals(prev => ({
          ...prev,
          debugging: { value: Math.max(20, prev.debugging.value - 15), label: 'Attention Needed' }
        }));
      } else {
        setTerminalStatus(outcome.status === 'SUCCESS' ? 'success' : 'error');
        logText += `Sandbox standard output:\n${outcome.consoleOutput || 'Success (No output)'}`;
      }

      setTerminalOutput(logText);
      if (outcome.details) {
        setTestResults(outcome.details);
        setConsoleTab('testcases');
        setActiveTestCaseIdx(0);
      }

      // Update Live telemetry signals
      setSignals(prev => ({
        ...prev,
        correctness: { value: outcome.totalCases > 0 ? (outcome.passedCases * 100) / outcome.totalCases : 0, label: outcome.status },
        complexity: { value: 65, label: 'Observed O(N)' }
      }));

    } catch (error: any) {
      setTerminalStatus('error');
      setTerminalOutput('Sandbox API call failed. Verify network connectivity.\n' + (error.message || ''));
    }
  };

  const handleSubmitCode = async () => {
    if (!window.confirm("Submit solution and initialize multi-factor assessment? This terminates the session.")) return;
    setIsSubmitLoading(true);

    try {
      await axios.post(`/api/interviews/${id}/submit`, { code, language });
      // Redirect to Autopsy report card
      navigate(`/report/${id}`);
    } catch (error) {
      console.error('Failed to submit final code:', error);
      alert('Failed to evaluate submission. Please check connection.');
      setIsSubmitLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono">
        <Activity className="animate-spin text-brand-cyan mb-2" size={24} />
        <span className="text-xs text-zinc-500">BOOTING EVALUATION SANDBOX...</span>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col font-sans text-zinc-100 overflow-hidden relative">
      
      {/* DISTRACTION-FREE TOP PANEL */}
      <header className="h-14 border-b border-border bg-background-panel shrink-0 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-1 rounded">
            KDX-SESSION: #{session.id}
          </span>
          <span className="text-xs text-zinc-400 font-mono hidden md:inline">|</span>
          <span className="text-xs text-zinc-400 font-mono hidden md:inline truncate max-w-xs">
            Problem: {session.question.title}
          </span>
        </div>

        {/* Individual Sidebar Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className={`px-2.5 py-1 rounded border text-[10px] font-mono font-bold transition flex items-center gap-1.5 ${
              isLeftSidebarOpen
                ? 'bg-brand-violet/20 border-brand-violet text-brand-violet'
                : 'bg-zinc-800 border-border text-zinc-400 hover:text-zinc-300'
            }`}
            title="Toggle AI Chat Panel"
          >
            <Brain size={11} />
            <span>Chat: {isLeftSidebarOpen ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className={`px-2.5 py-1 rounded border text-[10px] font-mono font-bold transition flex items-center gap-1.5 ${
              isRightSidebarOpen
                ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                : 'bg-zinc-800 border-border text-zinc-400 hover:text-zinc-300'
            }`}
            title="Toggle Telemetry Signals Panel"
          >
            <Activity size={11} />
            <span>Signals: {isRightSidebarOpen ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className={`px-2.5 py-1 rounded border text-[10px] font-mono font-bold transition flex items-center gap-1.5 ${
              isDescriptionOpen
                ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan bg-zinc-900/50'
                : 'bg-zinc-800 border-border text-zinc-400 hover:text-zinc-300'
            }`}
            title="Toggle Problem Description"
          >
            <FileCode size={11} />
            <span>Description: {isDescriptionOpen ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Stopwatch */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 font-mono text-xs bg-zinc-900 border border-border px-3 py-1 rounded">
            <Clock size={14} className="text-brand-cyan" />
            <span className="text-zinc-300 font-bold">{formatTime(timeRemaining)}</span>
          </div>

          <button
            onClick={handleSubmitCode}
            disabled={isSubmitLoading}
            className="flex items-center space-x-1 px-4 py-1.5 bg-brand-violet hover:bg-brand-violet/90 rounded text-xs font-mono font-bold transition"
          >
            {isSubmitLoading ? (
              <span>EVALUATING...</span>
            ) : (
              <>
                <span>Submit & End</span>
                <Award size={14} />
              </>
            )}
          </button>
        </div>
      </header>

      {/* CORE TRIPLE GRID LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT PANEL: AI INTERVIEWER */}
        {isLeftSidebarOpen && (
          <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-border flex flex-col bg-background-panel shrink-0 overflow-hidden">
            <div className="p-4 border-b border-border bg-background flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="text-brand-violet" size={16} />
                <span className="text-xs font-mono font-bold text-zinc-200">KODEXIS AI INTERVIEWER</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">State: {session.state}</span>
            </div>

          {/* Voice waveforms simulation */}
          <div className="px-4 py-3 bg-zinc-950/20 border-b border-border/40 flex items-center justify-between text-[9px] font-mono text-zinc-500">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${aiTyping ? 'bg-brand-violet animate-ping' : 'bg-brand-violet/40'}`}></span>
              {aiTyping ? 'AI SPEECH GENERATING...' : 'AI RADAR WAVE'}
            </span>
            <div className="flex items-end space-x-0.5 h-4">
              {[4, 10, 8, 14, 6, 12, 10, 5, 8, 3].map((h, i) => (
                <div
                  key={i}
                  className={`w-0.5 rounded-t transition ${aiTyping ? 'bg-brand-violet animate-pulse' : 'bg-zinc-700'}`}
                  style={{ height: `${h * (aiTyping ? 1.2 : 0.4)}px` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Messages lists scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isAi = m.sender === 'AI';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${isAi ? 'self-start' : 'self-end ml-auto'}`}
                >
                  <span className={`text-[8px] font-mono mb-1 ${isAi ? 'text-brand-violet' : 'text-brand-cyan text-right'}`}>
                    {isAi ? 'KODEXIS AI' : 'CANDIDATE'}
                  </span>
                  <div className={`p-3 rounded border text-xs font-mono leading-relaxed ${
                    isAi
                      ? 'bg-brand-violet/5 border-brand-violet/20 text-zinc-200'
                      : 'bg-brand-cyan/5 border-brand-cyan/20 text-zinc-100'
                  }`}>
                    {isAi ? (
                      <div className="markdown-content">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              );
            })}
            {aiTyping && (
              <div className="flex flex-col max-w-[85%] self-start">
                <span className="text-[8px] font-mono text-brand-violet mb-1">KODEXIS AI</span>
                <div className="p-3 rounded border border-brand-violet/10 bg-brand-violet/5 text-xs text-zinc-500 font-mono animate-pulse">
                  Analyzing explanation parameters...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form message input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-background">
            <div className="relative">
              <input
                type="text"
                disabled={aiTyping}
                placeholder={session.state === 'DISCUSSION' ? "Explain your approach..." : "Ask for a hint or justify logic..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-background-panel border border-border rounded pl-4 pr-10 py-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-brand-violet"
              />
              <button
                type="submit"
                disabled={aiTyping || !chatInput.trim()}
                className="absolute right-2 top-2.5 p-1 text-zinc-500 hover:text-brand-violet transition disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
          </div>
        )}

        {/* CENTER PANEL: MONACO EDITOR SANDBOX */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* File Tabs header */}
          <div className="h-10 border-b border-border bg-background-panel flex items-center justify-between px-4 shrink-0 font-mono">
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1.5 border-r border-t border-l border-border bg-background text-xs font-semibold text-brand-cyan flex items-center gap-1.5">
                <Code2 size={12} />
                <span>solution.{language === 'JAVA' ? 'java' : language === 'PYTHON' ? 'py' : language === 'JAVASCRIPT' ? 'js' : language === 'CPP' ? 'cpp' : language === 'CSHARP' ? 'cs' : language === 'GO' ? 'go' : 'c'}</span>
              </div>
              
              {/* Language Switcher Dropdown */}
              <select
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value;
                  if (window.confirm(`Switching to ${newLang} will reset your current code draft. Proceed?`)) {
                    setLanguage(newLang);
                    let template = '';
                    if (newLang === 'JAVA') template = session.question.javaTemplate;
                    else if (newLang === 'PYTHON') template = session.question.pythonTemplate;
                    else if (newLang === 'JAVASCRIPT') template = session.question.javascriptTemplate;
                    else if (newLang === 'CPP') template = session.question.cppTemplate;
                    else if (newLang === 'CSHARP') template = session.question.csharpTemplate;
                    else if (newLang === 'GO') template = session.question.goTemplate;
                    else template = session.question.cTemplate;
                    setCode(template || '');
                  }
                }}
                className="bg-background-panel border border-border/80 rounded text-[10px] font-semibold text-zinc-400 px-2 py-0.5 outline-none focus:border-brand-cyan cursor-pointer uppercase transition hover:text-zinc-200"
              >
                <option value="PYTHON">Python</option>
                <option value="JAVA">Java</option>
                <option value="JAVASCRIPT">JavaScript</option>
                <option value="CPP">C++</option>
                <option value="CSHARP">C#</option>
                <option value="GO">Go</option>
              </select>
            </div>
            
            {/* Editor tools */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const anyOpen = isLeftSidebarOpen || isRightSidebarOpen;
                  setIsLeftSidebarOpen(!anyOpen);
                  setIsRightSidebarOpen(!anyOpen);
                }}
                className={`flex items-center space-x-1 px-3 py-1 rounded border text-[10px] font-bold transition ${
                  !(isLeftSidebarOpen || isRightSidebarOpen)
                    ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan bg-zinc-900'
                    : 'bg-zinc-800 border-border text-zinc-400 hover:text-zinc-300'
                }`}
              >
                {!(isLeftSidebarOpen || isRightSidebarOpen) ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
                <span>{!(isLeftSidebarOpen || isRightSidebarOpen) ? 'Normal View' : 'Focus Mode'}</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={terminalStatus === 'running'}
                className="flex items-center space-x-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700/80 rounded border border-border text-[10px] font-bold text-brand-cyan transition"
              >
                <Play size={10} fill="currentColor" />
                <span>Run Draft</span>
              </button>
            </div>
          </div>

          {/* HORIZONTAL SPLIT: DESCRIPTION (LEFT) & EDITOR/CONSOLE (RIGHT) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* LEFT SUB-PANEL: Problem Description & Analysis */}
            {isDescriptionOpen && (
              <div className="w-full md:w-[380px] border-b md:border-b-0 md:border-r border-border bg-background-panel flex flex-col shrink-0 overflow-hidden">
                {/* Tab Switcher */}
                <div className="h-10 border-b border-border bg-background flex items-center px-4 space-x-4 shrink-0 font-mono text-[10px]">
                  <button
                    onClick={() => setLeftPanelTab('description')}
                    className={`py-2 border-b-2 font-bold transition tracking-wider ${
                      leftPanelTab === 'description'
                        ? 'border-brand-cyan text-brand-cyan'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    DESCRIPTION
                  </button>
                  <button
                    onClick={() => setLeftPanelTab('analysis')}
                    className={`py-2 border-b-2 font-bold transition tracking-wider ${
                      leftPanelTab === 'analysis'
                        ? 'border-brand-violet text-brand-violet'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    VISUAL ANALYSIS
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-5 select-text">
                  {leftPanelTab === 'description' ? (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-zinc-200 tracking-wide mb-3 flex items-center gap-1.5 border-b border-zinc-900 pb-2 font-mono uppercase">
                        <FileCode size={13} className="text-brand-cyan" />
                        <span>Problem Description</span>
                      </h3>
                      <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {session.question.description}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-zinc-200 tracking-wide mb-3 flex items-center gap-1.5 border-b border-zinc-900 pb-2 font-mono uppercase">
                        <Activity size={13} className="text-brand-violet" />
                        <span>Visual Analysis</span>
                      </h3>
                      <ProblemVisualizer questionTitle={session.question.title} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RIGHT SUB-PANEL: Monaco Editor + Console */}
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Monaco Editor Container */}
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={language.toLowerCase() === 'cpp' ? 'cpp' : language.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono, Courier New, monospace',
                    lineNumbers: 'on',
                    tabSize: 4,
                    automaticLayout: true,
                    padding: { top: 10, bottom: 10 }
                  }}
                />
              </div>

              {/* CONSOLE / TERMINAL OUTPUT PANEL */}
              <div className="h-56 border-t border-border bg-zinc-950 flex flex-col shrink-0">
                {/* Terminal Header with Tabs */}
                <div className="h-9 bg-zinc-900 border-b border-border/80 flex items-center justify-between px-4 font-mono text-[10px] shrink-0">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setConsoleTab('stdout')}
                      className={`px-3 py-2 border-b-2 font-bold transition uppercase ${
                        consoleTab === 'stdout'
                          ? 'border-brand-cyan text-brand-cyan'
                          : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Stdout Console
                    </button>
                    <button
                      onClick={() => setConsoleTab('testcases')}
                      className={`px-3 py-2 border-b-2 font-bold transition uppercase ${
                        consoleTab === 'testcases'
                          ? 'border-brand-cyan text-brand-cyan'
                          : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Test Cases ({session.question.testCases ? session.question.testCases.filter(tc => !tc.isHidden).length : 0})
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-[9px] text-zinc-500 uppercase">
                    <span className={
                      terminalStatus === 'success' ? 'text-brand-emerald' :
                      terminalStatus === 'error' ? 'text-red-400 animate-pulse' :
                      terminalStatus === 'running' ? 'text-brand-cyan animate-pulse' : 'text-zinc-500'
                    }>
                      {terminalStatus}
                    </span>
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed text-zinc-400 select-text">
                  {consoleTab === 'stdout' ? (
                    <pre className={
                      terminalStatus === 'error' ? 'text-red-400/90' :
                      terminalStatus === 'success' ? 'text-zinc-200' : 'text-zinc-400'
                    }>{terminalOutput}</pre>
                  ) : (
                    <div className="space-y-4">
                      {/* Case selection tabs */}
                      <div className="flex space-x-2 border-b border-zinc-900 pb-2 shrink-0">
                        {(session.question.testCases ? session.question.testCases.filter(tc => !tc.isHidden) : []).map((_, idx) => {
                          const hasResult = testResults && testResults.length > idx;
                          const passed = hasResult ? testResults[idx].passed : false;
                          return (
                            <button
                              key={idx}
                              onClick={() => setActiveTestCaseIdx(idx)}
                              className={`px-3 py-1.5 border rounded text-[10px] transition flex items-center space-x-1.5 ${
                                activeTestCaseIdx === idx
                                  ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-bold'
                                  : 'border-border bg-background-panel text-zinc-400 hover:text-zinc-300'
                              }`}
                            >
                              {hasResult && (
                                <span className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-brand-emerald' : 'bg-red-400'}`}></span>
                              )}
                              <span>Case {idx + 1}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Case Display */}
                      {(() => {
                        const cases = session.question.testCases ? session.question.testCases.filter(tc => !tc.isHidden) : [];
                        if (cases.length === 0) return <p className="text-zinc-500">No public test cases seeded.</p>;
                        const currentCase = cases[activeTestCaseIdx] || cases[0];
                        const hasResult = testResults && testResults.length > activeTestCaseIdx;
                        const result = hasResult ? testResults[activeTestCaseIdx] : null;

                        return (
                          <div className="space-y-3 font-mono text-xs">
                            {result && (
                              <div className="mb-2">
                                <span className="text-[9px] text-zinc-500 uppercase block">Result Status</span>
                                <span className={`inline-block px-2.5 py-1 rounded font-bold text-[10px] uppercase border ${
                                  result.passed
                                    ? 'text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5'
                                    : 'text-red-400 border-red-500/20 bg-red-500/5'
                                }`}>
                                  {result.passed ? 'Accepted' : 'Wrong Answer'}
                                </span>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[9px] text-zinc-500 uppercase block">Test Case Input</span>
                                <pre className="p-2.5 bg-background border border-border rounded text-zinc-300 font-bold whitespace-pre-wrap">{currentCase.input}</pre>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] text-zinc-500 uppercase block">Expected Output</span>
                                <pre className="p-2.5 bg-background border border-border rounded text-brand-emerald font-semibold">{currentCase.expectedOutput}</pre>
                              </div>
                            </div>

                            {result && (
                              <div className="space-y-1 pt-2 border-t border-zinc-900/50">
                                <span className="text-[9px] text-zinc-500 uppercase block">Actual Console Output</span>
                                <pre className={`p-2.5 bg-background border border-border rounded ${
                                  result.passed ? 'text-zinc-200' : 'text-red-400 font-medium'
                                }`}>{result.actualOutput || 'No output'}</pre>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT PANEL: INTERVIEW SIGNAL PANEL */}
        {isRightSidebarOpen && (
          <div className="w-full lg:w-[260px] border-t lg:border-t-0 lg:border-l border-border bg-background-panel p-4 space-y-6 shrink-0 font-mono">
            <div className="border-b border-border pb-3">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">TELEMETRY SCANNER</span>
              <h3 className="text-xs font-bold text-zinc-200 uppercase">SESSION SIGNALS</h3>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Correctness', value: signals.correctness.value, label: signals.correctness.label, color: 'bg-brand-cyan' },
                { name: 'Complexity', value: signals.complexity.value, label: signals.complexity.label, color: 'bg-brand-violet' },
                { name: 'Code Quality', value: signals.codeQuality.value, label: signals.codeQuality.label, color: 'bg-brand-violet' },
                { name: 'Edge Cases', value: signals.edgeCases.value, label: signals.edgeCases.label, color: 'bg-yellow-500' },
                { name: 'Debugging', value: signals.debugging.value, label: signals.debugging.label, color: 'bg-brand-emerald' },
                { name: 'Communication', value: signals.communication.value, label: signals.communication.label, color: 'bg-brand-cyan' }
              ].map((sig) => (
                <div key={sig.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">{sig.name}</span>
                    <span className="text-zinc-500">{sig.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${sig.color} transition-all duration-300`} style={{ width: `${sig.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border border-border bg-zinc-950/30 rounded text-[9px] text-zinc-500 leading-relaxed space-y-1">
              <p className="uppercase font-bold text-zinc-400">INSTRUMENTATION NOTE:</p>
              <p>Signals are transient observations representing current session activities. They do not constitute final grades until the autopsy grading engine executes upon completion.</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default InterviewRoom;
