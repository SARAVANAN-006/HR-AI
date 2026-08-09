import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { Brain, Play, Send, Activity, Award, Clock, Code2, Maximize2, Minimize2, FileCode } from 'lucide-react';
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
                <span>solution.{language === 'JAVA' ? 'java' : language === 'PYTHON' ? 'py' : language === 'JAVASCRIPT' ? 'js' : language === 'CPP' ? 'cpp' : 'c'}</span>
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
            
            {/* LEFT SUB-PANEL: Problem Description */}
            {isDescriptionOpen && (
              <div className="w-full md:w-[380px] border-b md:border-b-0 md:border-r border-border bg-background-panel p-5 overflow-y-auto flex flex-col shrink-0">
                <h3 className="text-xs font-bold text-zinc-200 tracking-wide mb-3 flex items-center gap-1.5 border-b border-zinc-900 pb-2 font-mono uppercase">
                  <FileCode size={13} className="text-brand-cyan" />
                  <span>Problem Description</span>
                </h3>
                <div className="text-xs text-zinc-300 leading-relaxed space-y-4 whitespace-pre-wrap font-sans select-text">
                  {session.question.description}
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
