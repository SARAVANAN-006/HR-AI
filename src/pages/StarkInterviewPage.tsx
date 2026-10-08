import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CS_CATEGORIES,
  generateStarkInterviewPlan,
  evaluateCandidateSpeechAnswer,
  generateFinalStarkReport,
  type StarkInterviewSession,
  type StarkEvaluation
} from '../lib/starkInterviewService';
import { StarkCoreAvatar } from '../components/stark/StarkCoreAvatar';
import { StarkDiagnostics } from '../components/stark/StarkDiagnostics';
import { recordStreakActivity } from '../lib/streakService';
import { useAuth } from '../context/AuthContext';
import {
  Binary,
  Cpu,
  Network,
  Database,
  LayoutGrid,
  BrainCircuit,
  Sparkles,
  Layers,
  Cloud,
  Shield,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Flame,
  Award,
  Activity,
  FileText,
  Clock,
  Radio,
  Send,
  HelpCircle,
  BarChart3
} from 'lucide-react';

export const StarkInterviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Workflow Stages: 'setup' | 'diagnostics' | 'interview' | 'report'
  const [stage, setStage] = useState<'setup' | 'diagnostics' | 'interview' | 'report'>('setup');

  // Configuration State
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([
    'dsa',
    'os',
    'cn',
    'system_design'
  ]);
  const [experienceLevel, setExperienceLevel] = useState<'junior' | 'mid' | 'senior' | 'staff'>('mid');
  const [questionCount, setQuestionCount] = useState<number>(6);

  // Active Media Stream
  const [activeMediaStream, setActiveMediaStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Interview Engine State
  const [session, setSession] = useState<StarkInterviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isStarkSpeaking, setIsStarkSpeaking] = useState<boolean>(false);
  const [isStarkThinking, setIsStarkThinking] = useState<boolean>(false);
  const [isCandidateListening, setIsCandidateListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [isMutedTts, setIsMutedTts] = useState<boolean>(false);
  const [questionTimer, setQuestionTimer] = useState<number>(0);
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);

  // Evaluation Report
  const [finalReport, setFinalReport] = useState<StarkEvaluation | null>(null);

  // Refs for Web Speech & Web Audio
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Icon Mapping Helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Binary': return <Binary size={18} className="text-cyan-400" />;
      case 'Cpu': return <Cpu size={18} className="text-purple-400" />;
      case 'Network': return <Network size={18} className="text-emerald-400" />;
      case 'Database': return <Database size={18} className="text-amber-400" />;
      case 'LayoutGrid': return <LayoutGrid size={18} className="text-blue-400" />;
      case 'BrainCircuit': return <BrainCircuit size={18} className="text-fuchsia-400" />;
      case 'Sparkles': return <Sparkles size={18} className="text-yellow-400" />;
      case 'Layers': return <Layers size={18} className="text-rose-400" />;
      case 'Cloud': return <Cloud size={18} className="text-sky-400" />;
      case 'Shield': return <Shield size={18} className="text-red-400" />;
      default: return <BrainCircuit size={18} className="text-cyan-400" />;
    }
  };

  // Toggle Category Selection
  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((c) => c !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Select All or Core
  const selectAllCategories = () => {
    setSelectedCategoryIds(CS_CATEGORIES.map((c) => c.id));
  };

  const selectCoreCategories = () => {
    setSelectedCategoryIds(['dsa', 'os', 'cn', 'dbms']);
  };

  // ----------------------------------------------------
  // DIAGNOSTICS & MEDIA STREAM ATTACHMENT
  // ----------------------------------------------------
  const handleDiagnosticsComplete = (stream: MediaStream | null) => {
    setActiveMediaStream(stream);
    setStage('interview');
    initializeInterview();
  };

  // Attach video stream to candidate video element
  useEffect(() => {
    if (stage === 'interview' && videoRef.current && activeMediaStream) {
      videoRef.current.srcObject = activeMediaStream;
    }
  }, [stage, activeMediaStream, isCameraOn]);

  // Audio VU Meter for candidate microphone
  useEffect(() => {
    if (stage !== 'interview' || !activeMediaStream || isMicMuted) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(activeMediaStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setMicAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      animFrameRef.current = requestAnimationFrame(updateLevel);
    } catch (e) {
      console.warn('Live mic analyser failed:', e);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stage, activeMediaStream, isMicMuted]);

  // ----------------------------------------------------
  // TTS (TEXT TO SPEECH) - STARK SPEAKS FIRST
  // ----------------------------------------------------
  const speakStarkQuestion = (text: string) => {
    if (isMutedTts || !('speechSynthesis' in window)) {
      setIsStarkSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text of markdown asterisks or code symbols for smooth TTS
    const clean = text.replace(/[*_#`>[\]]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);

    utterance.rate = 1.0;
    utterance.pitch = 0.95; // Authoritative Stark tone

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('David') ||
          v.name.includes('Male') ||
          v.name.includes('Google UK English Male') ||
          v.name.includes('Natural'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsStarkSpeaking(true);
    };

    utterance.onend = () => {
      setIsStarkSpeaking(false);
      // Automatically prompt candidate to start speaking if not already listening
      startCandidateSpeechRecognition();
    };

    utterance.onerror = () => {
      setIsStarkSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // ----------------------------------------------------
  // STT (SPEECH TO TEXT) - RECOGNIZE CANDIDATE ANSWERS
  // ----------------------------------------------------
  const startCandidateSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setSpeechTranscript((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn('STT recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsCandidateListening(false);
        }
      };

      recognition.onend = () => {
        // If user is supposed to be listening, cleanly restart
        if (isCandidateListening) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsCandidateListening(true);
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
      setIsCandidateListening(false);
    }
  };

  const stopCandidateSpeechRecognition = () => {
    setIsCandidateListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  // ----------------------------------------------------
  // INITIALIZE INTERVIEW FLOW
  // ----------------------------------------------------
  const initializeInterview = () => {
    const candidateName = user?.fullName || 'Candidate';
    const plan = generateStarkInterviewPlan(
      candidateName,
      selectedCategoryIds,
      experienceLevel,
      questionCount
    );

    const newSession: StarkInterviewSession = {
      sessionId: 'stark-' + Date.now(),
      candidateName,
      targetRole: user?.targetRole || 'Software Engineer',
      experienceLevel,
      selectedCategories: selectedCategoryIds,
      totalQuestions: plan.length,
      currentQuestionIndex: 0,
      questions: plan,
      transcripts: [],
      startedAt: new Date().toISOString()
    };

    setSession(newSession);
    setCurrentIndex(0);
    setSpeechTranscript('');
    setInterimTranscript('');
    setQuestionTimer(0);

    // Speak Question 1 (Introduction) with TTS
    setTimeout(() => {
      speakStarkQuestion(plan[0].questionText);
    }, 600);
  };

  // Timer loop for question duration
  useEffect(() => {
    if (stage === 'interview' && !isStarkThinking) {
      timerIntervalRef.current = setInterval(() => {
        setQuestionTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [stage, isStarkThinking]);

  // ----------------------------------------------------
  // SUBMIT CANDIDATE ANSWER & PROCEED
  // ----------------------------------------------------
  const handleSubmitAnswer = async () => {
    if (!session) return;

    stopCandidateSpeechRecognition();
    window.speechSynthesis?.cancel();
    setIsStarkSpeaking(false);
    setIsStarkThinking(true);

    const currentQ = session.questions[currentIndex];
    const fullAnswer = (speechTranscript + ' ' + interimTranscript).trim();

    // Evaluate answer
    const evalResult = evaluateCandidateSpeechAnswer(currentQ, fullAnswer);

    const transcriptItem = {
      questionId: currentQ.id,
      questionText: currentQ.questionText,
      category: currentQ.categoryName || 'General Engineering',
      phase: currentQ.phase,
      userAnswerText: fullAnswer || '(No audible speech registered)',
      score: evalResult.score,
      feedback: evalResult.feedback,
      durationSeconds: questionTimer,
      timestamp: new Date().toISOString()
    };

    const updatedTranscripts = [...session.transcripts, transcriptItem];

    // Check if more questions remain
    const nextIndex = currentIndex + 1;
    if (nextIndex < session.questions.length) {
      const updatedSession: StarkInterviewSession = {
        ...session,
        currentQuestionIndex: nextIndex,
        transcripts: updatedTranscripts
      };

      setSession(updatedSession);
      setCurrentIndex(nextIndex);
      setSpeechTranscript('');
      setInterimTranscript('');
      setQuestionTimer(0);
      setIsStarkThinking(false);

      // Stark speaks next question
      setTimeout(() => {
        speakStarkQuestion(session.questions[nextIndex].questionText);
      }, 500);
    } else {
      // Completed all questions! Build final evaluation report
      const completedSession: StarkInterviewSession = {
        ...session,
        completedAt: new Date().toISOString(),
        transcripts: updatedTranscripts
      };

      const report = generateFinalStarkReport(completedSession);
      completedSession.finalEvaluation = report;

      setSession(completedSession);
      setFinalReport(report);
      setIsStarkThinking(false);
      setStage('report');

      // Record streak maintenance activity!
      recordStreakActivity();

      // Play concluding Stark remark
      setTimeout(() => {
        if ('speechSynthesis' in window && !isMutedTts) {
          const closing = new SpeechSynthesisUtterance(
            `Interview concluded. Outstanding effort! Your multi-factor performance autopsy is ready. You achieved an overall evaluation score of ${report.overallScore} out of 100.`
          );
          window.speechSynthesis.speak(closing);
        }
      }, 600);
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (!activeMediaStream) return;
    const videoTracks = activeMediaStream.getVideoTracks();
    if (videoTracks.length > 0) {
      const nextState = !videoTracks[0].enabled;
      videoTracks[0].enabled = nextState;
      setIsCameraOn(nextState);
    }
  };

  // Toggle Mic Mute
  const toggleMic = () => {
    if (!activeMediaStream) return;
    const audioTracks = activeMediaStream.getAudioTracks();
    if (audioTracks.length > 0) {
      const nextState = !audioTracks[0].enabled;
      audioTracks[0].enabled = nextState;
      setIsMicMuted(!nextState);
      if (!nextState) {
        stopCandidateSpeechRecognition();
      }
    }
  };

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (activeMediaStream) {
        activeMediaStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [activeMediaStream]);

  // ====================================================
  // STAGE 1: TOPIC CATEGORIES & SETUP
  // ====================================================
  if (stage === 'setup') {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
        {/* Hero Header */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/20 via-background to-purple-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-mono text-[11px] font-bold tracking-widest uppercase">
              <Radio size={12} className="animate-pulse" />
              <span>STARK REAL TECHNICAL INTERVIEW ENGINE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-mono text-zinc-100 tracking-tight">
              Meet Stark, Your AI Tech Lead
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Experience a high-stakes, true-to-life technical interview with live camera feed, natural speech synthesis, and real-time voice speech recognition. Stark first asks you to introduce yourself, follows up on your project experience, and then navigates into deep technical dilemmas across your selected CS disciplines.
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center z-10">
            <StarkCoreAvatar isSpeaking={false} isListening={false} isThinking={false} size="md" />
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Experience Level */}
          <div className="border border-border bg-background-panel p-4 rounded-xl space-y-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Interview Seniority Level
            </label>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              {(['junior', 'mid', 'senior', 'staff'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-1.5 px-2 rounded-lg border text-center uppercase font-bold transition ${
                    experienceLevel === lvl
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400'
                      : 'border-border bg-background text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Question Depth Volume */}
          <div className="border border-border bg-background-panel p-4 rounded-xl space-y-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Interview Length & Depth
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[
                { count: 4, label: 'Express (4 Qs)' },
                { count: 6, label: 'Standard (6 Qs)' },
                { count: 8, label: 'Intensive (8 Qs)' }
              ].map((opt) => (
                <button
                  key={opt.count}
                  onClick={() => setQuestionCount(opt.count)}
                  className={`py-1.5 px-2 rounded-lg border text-center font-bold transition ${
                    questionCount === opt.count
                      ? 'bg-purple-500/15 border-purple-500 text-purple-400'
                      : 'border-border bg-background text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Select Actions */}
          <div className="border border-border bg-background-panel p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="text-left font-mono">
              <p className="text-xs font-bold text-zinc-200">
                {selectedCategoryIds.length} of 10 Selected
              </p>
              <p className="text-[10px] text-zinc-500">
                {selectedCategoryIds.length === 10 ? 'Full Spectrum CS' : 'Custom Specialization'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={selectCoreCategories}
                className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-zinc-300 font-mono text-[10px] hover:bg-zinc-800 transition"
              >
                Core 4
              </button>
              <button
                onClick={selectAllCategories}
                className="px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold hover:bg-cyan-500/20 transition"
              >
                Select All
              </button>
            </div>
          </div>
        </div>

        {/* 10 CS Categories Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Binary size={16} className="text-cyan-400" />
              <span>Choose Interview Topics (10 Core Computer Science Domains)</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              Select all domains you wish Stark to explore
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CS_CATEGORIES.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.12)] scale-[1.01]'
                      : 'bg-background-panel border-border hover:border-zinc-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2.5">
                        <div className={`p-2 rounded-lg border ${
                          isSelected ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-background border-border'
                        }`}>
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                            {cat.shortCode}
                          </span>
                          <h4 className="text-sm font-bold text-zinc-100 leading-snug">{cat.name}</h4>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        isSelected ? 'bg-cyan-500 border-cyan-400 text-zinc-950 font-bold' : 'border-zinc-700 bg-background'
                      }`}>
                        {isSelected && <CheckCircle2 size={13} className="text-zinc-950" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-1">
                    {cat.topics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-zinc-400"
                      >
                        {topic}
                      </span>
                    ))}
                    {cat.topics.length > 3 && (
                      <span className="text-[9px] font-mono text-zinc-500">
                        +{cat.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Launch Diagnostics CTA */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left font-mono">
            <h4 className="text-sm font-bold text-zinc-100">Ready to begin your session?</h4>
            <p className="text-xs text-zinc-400">
              Next step: Verify your camera framing, sound level meter, and audio output before entering.
            </p>
          </div>

          <button
            onClick={() => setStage('diagnostics')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2 group"
          >
            <span>Proceed to Hardware Verification</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // STAGE 2: DIAGNOSTICS & HARDWARE CHECK
  // ====================================================
  if (stage === 'diagnostics') {
    return (
      <div className="p-6 md:p-8">
        <StarkDiagnostics
          onComplete={handleDiagnosticsComplete}
          onCancel={() => setStage('setup')}
        />
      </div>
    );
  }

  // ====================================================
  // STAGE 3: LIVE STARK INTERVIEW CHAMBER
  // ====================================================
  if (stage === 'interview' && session) {
    const currentQ = session.questions[currentIndex];

    return (
      <div className="min-h-[calc(100vh-60px)] p-4 md:p-6 flex flex-col font-sans select-none">
        {/* Top HUD Telemetry Bar */}
        <header className="border border-border bg-background-panel rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
              <Radio size={16} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-mono font-bold text-zinc-100">STARK INTERVIEW CHAMBER</h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 uppercase">
                  {currentQ.phase === 'intro'
                    ? 'PHASE 1: CANDIDATE INTRODUCTION'
                    : currentQ.phase === 'intro_followup'
                    ? 'PHASE 2: PROJECT DEBRIEF'
                    : `PHASE 3: ${currentQ.categoryName || 'CS DEEP DIVE'}`}
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-400">
                Candidate: <strong className="text-zinc-200">{session.candidateName}</strong> • Target: {session.targetRole} ({session.experienceLevel})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            {/* Stopwatch */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-zinc-300">
              <Clock size={13} className="text-cyan-400" />
              <span>{formatTime(questionTimer)}</span>
            </div>

            {/* Question Progress Dots */}
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-border bg-background">
              <span className="text-[10px] text-zinc-400 mr-1.5">
                Q {currentIndex + 1}/{session.totalQuestions}
              </span>
              {session.questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition ${
                    i === currentIndex
                      ? 'bg-cyan-400 ring-2 ring-cyan-400/40'
                      : i < currentIndex
                      ? 'bg-emerald-400'
                      : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>

            {/* TTS Mute Button */}
            <button
              onClick={() => {
                if (isStarkSpeaking) window.speechSynthesis.cancel();
                setIsMutedTts(!isMutedTts);
              }}
              title={isMutedTts ? 'Unmute Stark Voice' : 'Mute Stark Voice'}
              className={`p-2 rounded-lg border transition ${
                isMutedTts
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-background border-border text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isMutedTts ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </header>

        {/* Main Dual Viewport Split: Stark AI (Left) & Candidate Studio (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: STARK AI INTERVIEWER STATION (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Holographic Arc Reactor Display */}
            <div className="border border-cyan-500/30 bg-background-panel rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] shadow-[inset_0_0_30px_rgba(6,182,212,0.06)]">
              {/* Background Ambient Mesh */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

              <StarkCoreAvatar
                isSpeaking={isStarkSpeaking}
                isListening={isCandidateListening}
                isThinking={isStarkThinking}
                audioLevel={micAudioLevel}
                size="lg"
              />

              {/* Reactive Voice Waves when Stark Speaks */}
              {isStarkSpeaking && (
                <div className="mt-4 flex items-center space-x-1 h-6">
                  {[12, 24, 18, 32, 28, 40, 30, 22, 16, 26, 36, 18, 24, 10].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-cyan-400 rounded-full animate-pulse"
                      style={{
                        height: `${h * 0.7}px`,
                        animationDelay: `${idx * 0.08}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Replay TTS Question Button */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <button
                  onClick={() => speakStarkQuestion(currentQ.questionText)}
                  disabled={isStarkSpeaking}
                  className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] flex items-center gap-1.5 transition"
                  title="Repeat Question via TTS"
                >
                  <RotateCcw size={11} />
                  <span>Repeat Question</span>
                </button>
              </div>
            </div>

            {/* Stark's Question Prompter Box */}
            <div className="border border-border bg-background-panel rounded-2xl p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Radio size={12} className="animate-pulse" />
                    <span>STARK'S QUESTION</span>
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    {currentQ.depthLevel.toUpperCase()} LEVEL
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/15 text-sm md:text-base font-medium text-zinc-100 leading-relaxed">
                  {currentQ.questionText}
                </div>
              </div>

              {/* Guided Topics / Hints */}
              {currentQ.hints && currentQ.hints.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-[11px] font-mono text-zinc-400">
                  <HelpCircle size={13} className="text-cyan-400 shrink-0" />
                  <span className="text-zinc-500">Key Focus Areas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentQ.hints.map((hint, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-background border border-border text-zinc-300 text-[10px]">
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: CANDIDATE STUDIO (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Live Camera Preview Stream */}
            <div className="relative aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-cyan-500/40 shadow-xl flex items-center justify-center">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-500 font-mono text-xs space-y-2">
                  <CameraOff size={32} />
                  <span>CAMERA TRANSMISSION PAUSED</span>
                </div>
              )}

              {/* Tech Reticles Overlay */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              {/* Top-left Candidate Status Pill */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10 font-mono text-[9px] text-zinc-200 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                <span>{session.candidateName.toUpperCase()} • ON AIR</span>
              </div>

              {/* Bottom Camera / Mic Controls */}
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <button
                  onClick={toggleCamera}
                  className={`p-2 rounded-xl backdrop-blur-md border text-xs transition ${
                    isCameraOn
                      ? 'bg-zinc-900/80 border-white/20 text-zinc-200 hover:bg-zinc-800'
                      : 'bg-red-500/30 border-red-500/50 text-red-300'
                  }`}
                  title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {isCameraOn ? <Camera size={14} /> : <CameraOff size={14} />}
                </button>

                <button
                  onClick={toggleMic}
                  className={`p-2 rounded-xl backdrop-blur-md border text-xs transition ${
                    !isMicMuted
                      ? 'bg-zinc-900/80 border-white/20 text-zinc-200 hover:bg-zinc-800'
                      : 'bg-red-500/30 border-red-500/50 text-red-300'
                  }`}
                  title={!isMicMuted ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {!isMicMuted ? <Mic size={14} /> : <MicOff size={14} />}
                </button>
              </div>

              {/* Live VU Meter Bar on video */}
              <div className="absolute bottom-3 left-3 w-32 h-2 rounded-full bg-black/60 backdrop-blur-sm overflow-hidden border border-white/10">
                <div
                  className="h-full bg-emerald-400 transition-all duration-75"
                  style={{ width: `${micAudioLevel}%` }}
                />
              </div>
            </div>

            {/* Live Speech Recognition & Transcript Box */}
            <div className="border border-border bg-background-panel rounded-2xl p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <Mic size={15} className={isCandidateListening ? 'text-amber-400 animate-pulse' : 'text-zinc-500'} />
                    <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase">
                      Live Candidate Speech Input
                    </h4>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isCandidateListening
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}>
                    {isCandidateListening ? 'LISTENING (SPEAK NOW)' : 'MIC ON STANDBY'}
                  </span>
                </div>

                {/* Editable Transcript Field */}
                <textarea
                  value={speechTranscript + (interimTranscript ? ` ${interimTranscript}` : '')}
                  onChange={(e) => setSpeechTranscript(e.target.value)}
                  placeholder="Your spoken words will appear here in real-time. You may also edit or type additional technical explanations..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-background border border-border text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
                />

                <p className="text-[10px] font-mono text-zinc-500 mt-1">
                  Tip: Speak clearly at natural pacing. You can polish your transcription text before submitting to Stark.
                </p>
              </div>

              {/* Speech Controls & Submit Button */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCandidateListening) {
                        stopCandidateSpeechRecognition();
                      } else {
                        startCandidateSpeechRecognition();
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition ${
                      isCandidateListening
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                    }`}
                  >
                    {isCandidateListening ? <MicOff size={14} /> : <Mic size={14} />}
                    <span>{isCandidateListening ? 'Pause Listening' : 'Start Listening'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSpeechTranscript('');
                      setInterimTranscript('');
                    }}
                    className="py-2 px-3 rounded-xl border border-border bg-background hover:bg-zinc-800 text-zinc-400 text-xs font-mono transition"
                  >
                    Clear Text
                  </button>
                </div>

                {/* Submit to Stark Button */}
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isStarkThinking}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>
                    {isStarkThinking
                      ? 'Stark is Evaluating Your Answer...'
                      : currentIndex + 1 < session.totalQuestions
                      ? 'Submit Answer & Next Question'
                      : 'Submit Final Answer & Finish Interview'}
                  </span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

  // ====================================================
  // STAGE 4: FINAL EVALUATION & PERFORMANCE AUTOPSY
  // ====================================================
  if (stage === 'report' && finalReport && session) {
    const getRecBadge = (rec: string) => {
      switch (rec) {
        case 'STRONG_HIRE':
          return 'bg-emerald-500/15 border-emerald-500 text-emerald-400';
        case 'HIRE':
          return 'bg-cyan-500/15 border-cyan-500 text-cyan-400';
        case 'LEAN_HIRE':
          return 'bg-amber-500/15 border-amber-500 text-amber-400';
        default:
          return 'bg-rose-500/15 border-rose-500 text-rose-400';
      }
    };

    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 font-sans">
        {/* Header Banner */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-background to-purple-950/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Award size={14} />
              <span>STARK AI CANDIDATE AUTOPSY & DOSSIER</span>
            </div>
            <h1 className="text-3xl font-extrabold font-mono text-zinc-100 tracking-tight">
              Technical Interview Evaluation
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl">
              Candidate: <strong className="text-zinc-200">{session.candidateName}</strong> • Completed {session.transcripts.length} in-depth technical questions across selected computer science categories.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center font-mono">
              <span className="text-5xl font-black text-cyan-400 tracking-tight">
                {finalReport.overallScore}
              </span>
              <span className="text-xs text-zinc-500 block">/ 100 SCORE</span>
            </div>

            <div className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider text-center ${getRecBadge(finalReport.recommendation)}`}>
              {finalReport.recommendation.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Multi-Factor Scores Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Technical Proficiency', score: finalReport.technicalProficiencyScore, icon: Binary, color: 'text-cyan-400' },
            { label: 'Communication Clarity', score: finalReport.communicationScore, icon: Volume2, color: 'text-purple-400' },
            { label: 'Conceptual Depth', score: finalReport.conceptualDepthScore, icon: BrainCircuit, color: 'text-emerald-400' },
            { label: 'Problem Solving & Trade-offs', score: finalReport.problemSolvingScore, icon: Activity, color: 'text-amber-400' }
          ].map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="border border-border bg-background-panel rounded-xl p-4 space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase">{metric.label}</span>
                  <Icon size={14} className={metric.color} />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold text-zinc-100">{metric.score}</span>
                  <span className="text-[10px] text-zinc-500">/100</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Breakdown & Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Category Scores */}
          <div className="md:col-span-5 border border-border bg-background-panel rounded-2xl p-6 space-y-4 font-mono">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={15} className="text-cyan-400" />
              <span>Category Mastery Breakdown</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(finalReport.categoryScores).map(([cat, score]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">{cat}</span>
                    <span className="text-cyan-400 font-bold">{score}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Improvement Insights */}
          <div className="md:col-span-7 border border-border bg-background-panel rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
              Stark's Strategic Feedback
            </h3>

            <div className="space-y-2">
              <h4 className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
                Demonstrated Strengths:
              </h4>
              <ul className="space-y-1 text-xs text-zinc-300">
                {finalReport.keyStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <h4 className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                High-Impact Growth Areas:
              </h4>
              <ul className="space-y-1 text-xs text-zinc-300">
                {finalReport.areasForImprovement.map((area, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">!</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Question Transcripts Autopsy */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <FileText size={15} className="text-cyan-400" />
            <span>Verbal Transcript & Evaluation Logs</span>
          </h3>

          <div className="space-y-4">
            {session.transcripts.map((item, idx) => (
              <div
                key={idx}
                className="border border-border bg-background-panel rounded-2xl p-5 space-y-3 font-mono"
              >
                <div className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                  <span className="font-bold text-cyan-400">
                    Question {idx + 1}: {item.category} ({item.phase.replace('_', ' ')})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                    Score: <strong className="text-cyan-400">{item.score}/100</strong> • {item.durationSeconds}s
                  </span>
                </div>

                <div className="text-xs text-zinc-200 bg-background/50 p-3 rounded-xl border border-border/60">
                  <strong className="text-zinc-400 block mb-1">STARK:</strong>
                  {item.questionText}
                </div>

                <div className="text-xs text-zinc-300 bg-cyan-950/10 p-3 rounded-xl border border-cyan-500/20">
                  <strong className="text-cyan-400 block mb-1">CANDIDATE ANSWER (SPEECH RECOGNITION):</strong>
                  {item.userAnswerText}
                </div>

                <div className="text-[11px] text-zinc-400 bg-background p-2.5 rounded-lg border border-border">
                  <strong className="text-zinc-300">Stark Feedback: </strong>
                  {item.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-mono text-xs text-amber-400">
            <Flame size={16} />
            <span>Daily Practice Streak updated! Activity recorded to your developer profile.</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                setStage('setup');
                setSession(null);
                setFinalReport(null);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-zinc-800 text-zinc-300 font-mono text-xs transition"
            >
              Start New Interview
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>Back to Dashboard</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StarkInterviewPage;
