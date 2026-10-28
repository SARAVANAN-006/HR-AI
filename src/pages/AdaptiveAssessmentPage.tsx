import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LEARNING_API_BASE } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ragService, type KnowledgeUnit } from '../lib/ragService';
import { mysqlService } from '../lib/mysqlService';
import {
  generateQuizFromKnowledgeUnits,
  generateCurriculumQuiz,
  evaluateQuizSubmissionLocally,
  type QuizQuestion,
  type DiagnosticReport
} from '../lib/assessmentGenerator';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  Filter,
  BookOpen,
  Share2,
  Copy,
  Check,
  Layers,
  X,
  FileCheck2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AdaptiveAssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const activeUserId = user?.username || 'candidate';

  // Assessment Source State: 'KNOWLEDGE_BASE' | 'CURRICULUM'
  const [sourceMode, setSourceMode] = useState<'KNOWLEDGE_BASE' | 'CURRICULUM'>('KNOWLEDGE_BASE');
  const [knowledgeUnits, setKnowledgeUnits] = useState<KnowledgeUnit[]>([]);
  const [selectedDocumentFilter, setSelectedDocumentFilter] = useState<string>('ALL');

  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  // Sharing State
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [sharedBanner, setSharedBanner] = useState<string | null>(null);

  const API_BASE = LEARNING_API_BASE;

  useEffect(() => {
    fetchTopics();
    loadKnowledgeUnits();
    initializeAssessmentState();
  }, []);

  const loadKnowledgeUnits = () => {
    const units = ragService.getKnowledgeUnits();
    setKnowledgeUnits(units);
    if (units.length === 0) {
      setSourceMode('CURRICULUM');
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${API_BASE}/knowledge/topics`, { timeout: 2500 });
      if (res.data?.topics) {
        setTopics(res.data.topics);
      }
    } catch {
      // Fallback topics
      setTopics([
        { id: 'distributed-systems', name: 'Distributed Systems & Consensus' },
        { id: 'databases', name: 'Database Internals & Storage Engines' },
        { id: 'algorithms', name: 'Algorithms & Dynamic Programming' },
        { id: 'operating-systems', name: 'Operating Systems & Virtual Memory' },
        { id: 'networking', name: 'Computer Networking & Transport Protocols' }
      ]);
    }
  };

  // Inspect URL query params for shareId or restore active state on page refresh
  const initializeAssessmentState = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const shareId = searchParams.get('shareId');
      if (shareId) {
        // 1. Try local storage first
        const saved = localStorage.getItem(`kodexis_shared_test_${shareId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            setQuestions(parsed.questions);
            setQuizStarted(true);
            setReport(parsed.report || null);
            setCurrentAnswers(parsed.answers || {});
            setSharedBanner(`Shared Assessment Loaded: "${parsed.title || 'Peer Assessment'}" • Created from ${parsed.sourceMode === 'KNOWLEDGE_BASE' ? 'Uploaded Knowledge Base' : 'Curriculum Standards'}`);
            return;
          }
        }

        // 2. Fetch directly from backend server (ensures share link works on any device/incognito)
        try {
          const res = await axios.get(`/api/assessment/share/${encodeURIComponent(shareId)}`, { timeout: 3500 });
          if (res.data && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
            const pkg = res.data;
            setQuestions(pkg.questions);
            setQuizStarted(true);
            setReport(pkg.report || null);
            setCurrentAnswers(pkg.answers || {});
            setSharedBanner(`Shared Assessment Loaded: "${pkg.title || 'Peer Assessment'}" • Created from ${pkg.sourceMode === 'KNOWLEDGE_BASE' ? 'Uploaded Knowledge Base' : 'Curriculum Standards'}`);
            localStorage.setItem(`kodexis_shared_test_${shareId}`, JSON.stringify(pkg));
            return;
          }
        } catch (apiErr) {
          console.warn('Backend shared assessment fetch notice:', apiErr);
        }
      }

      // If not viewing a shareable link, restore active quiz state so refresh keeps exact same content
      const activeStateStr = localStorage.getItem('kodexis_active_assessment_state');
      if (activeStateStr) {
        const activeState = JSON.parse(activeStateStr);
        if (Array.isArray(activeState.questions) && activeState.questions.length > 0) {
          setQuestions(activeState.questions);
          setCurrentAnswers(activeState.currentAnswers || {});
          setQuizStarted(Boolean(activeState.quizStarted));
          setReport(activeState.report || null);
          if (activeState.sourceMode) setSourceMode(activeState.sourceMode);
          if (activeState.selectedTopic) setSelectedTopic(activeState.selectedTopic);
          if (activeState.selectedDifficulty) setSelectedDifficulty(activeState.selectedDifficulty);
        }
      }
    } catch (e) {
      console.warn('Error loading assessment state on refresh:', e);
    }
  };

  const handleResetScope = () => {
    setQuestions([]);
    setCurrentAnswers({});
    setQuizStarted(false);
    setReport(null);
    setSharedBanner(null);
    localStorage.removeItem('kodexis_active_assessment_state');
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('shareId');
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  const uniqueDocuments = Array.from(new Set(knowledgeUnits.map(u => u.documentName).filter(Boolean)));

  const handleStartQuiz = async () => {
    try {
      setIsSubmitting(true);
      setReport(null);
      setCurrentAnswers({});
      setSharedBanner(null);

      let generatedQuestions: QuizQuestion[] = [];

      if (sourceMode === 'KNOWLEDGE_BASE') {
        let targetUnits = knowledgeUnits;
        if (selectedDocumentFilter !== 'ALL') {
          targetUnits = knowledgeUnits.filter(u => u.documentName === selectedDocumentFilter);
        }
        generatedQuestions = generateQuizFromKnowledgeUnits(targetUnits, questionCount, selectedDifficulty, selectedFormat);
      } else {
        try {
          const params = new URLSearchParams({
            userId: activeUserId,
            count: String(questionCount)
          });
          if (selectedTopic !== 'ALL') params.append('topicId', selectedTopic);
          if (selectedDifficulty !== 'ALL') params.append('difficulty', selectedDifficulty);
          if (selectedFormat !== 'ALL') params.append('format', selectedFormat);

          const res = await axios.get(`${API_BASE}/assessment/generate?${params.toString()}`, { timeout: 2500 });
          if (res.data && res.data.length > 0) {
            generatedQuestions = res.data;
          }
        } catch {
          // Backend offline - use local curriculum generator
        }

        if (generatedQuestions.length === 0) {
          generatedQuestions = generateCurriculumQuiz(selectedTopic, questionCount, selectedDifficulty, selectedFormat);
        }
      }

      setQuestions(generatedQuestions);
      setQuizStarted(true);

      // Persist active state so refresh retains exact same content
      localStorage.setItem('kodexis_active_assessment_state', JSON.stringify({
        questions: generatedQuestions,
        currentAnswers: {},
        quizStarted: true,
        report: null,
        selectedTopic,
        selectedDifficulty,
        selectedFormat,
        sourceMode
      }));

      // Store activity in MySQL & candidate_logs
      mysqlService.recordCandidateLog(
        activeUserId,
        'INFO',
        'ASSESSMENT_STARTED',
        `Generated adaptive assessment with ${generatedQuestions.length} questions on ${sourceMode === 'KNOWLEDGE_BASE' ? 'Knowledge Base' : selectedTopic}.`,
        { questionCount: generatedQuestions.length, topic: selectedTopic, difficulty: selectedDifficulty }
      ).catch(() => {});

    } catch (err) {
      console.error("Quiz generation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOption = (questionId: string, optionVal: string) => {
    setCurrentAnswers(prev => {
      const updated = { ...prev, [questionId]: optionVal };
      try {
        const existing = JSON.parse(localStorage.getItem('kodexis_active_assessment_state') || '{}');
        localStorage.setItem('kodexis_active_assessment_state', JSON.stringify({
          ...existing,
          currentAnswers: updated
        }));
      } catch {}
      return updated;
    });
  };

  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);
      let gradingReport: DiagnosticReport;

      // Try server grading if available
      try {
        const payload = {
          userId: activeUserId,
          answers: questions.map(q => ({
            questionId: q.id,
            userResponse: currentAnswers[q.id] || ''
          }))
        };
        const res = await axios.post(`${API_BASE}/assessment/submit`, payload, { timeout: 2500 });
        if (res.data) {
          gradingReport = res.data;
        } else {
          gradingReport = evaluateQuizSubmissionLocally(questions, currentAnswers, activeUserId);
        }
      } catch {
        gradingReport = evaluateQuizSubmissionLocally(questions, currentAnswers, activeUserId);
      }

      setReport(gradingReport);

      // Persist active state including the diagnostic report so refresh retains exact same content
      try {
        const existing = JSON.parse(localStorage.getItem('kodexis_active_assessment_state') || '{}');
        localStorage.setItem('kodexis_active_assessment_state', JSON.stringify({
          ...existing,
          report: gradingReport,
          quizStarted: true
        }));
      } catch {}

      // Record live telemetry into MySQL
      mysqlService.recordCandidateLog(
        activeUserId,
        'INFO',
        'ADAPTIVE_ASSESSMENT_COMPLETED',
        `Scored ${gradingReport.overallAccuracy}% (${gradingReport.correctCount}/${gradingReport.totalQuestions}) on ${sourceMode === 'KNOWLEDGE_BASE' ? 'Knowledge Base Exam' : 'Curriculum Exam'}`,
        {
          sourceMode,
          totalQuestions: gradingReport.totalQuestions,
          correctCount: gradingReport.correctCount,
          accuracy: gradingReport.overallAccuracy,
          weakTopics: gradingReport.weakTopics
        }
      ).catch(() => {});

      // Record skill evaluation telemetry
      const primeTopic = questions[0]?.topicName || 'Computer Science';
      mysqlService.recordSkillEvaluation({
        username: activeUserId,
        topic: primeTopic,
        proficiencyScore: gradingReport.overallAccuracy,
        proficiencyLevel: gradingReport.masteryTier,
        problemsAttempted: gradingReport.totalQuestions,
        problemsPassed: gradingReport.correctCount,
        accuracyPercentage: gradingReport.overallAccuracy,
        identifiedStrengths: gradingReport.strongTopics.join(', '),
        identifiedWeaknesses: gradingReport.weakTopics.join(', '),
        aiBehaviorNotes: `Adaptive Assessment evaluated via ${sourceMode === 'KNOWLEDGE_BASE' ? 'Uploaded Knowledge Units' : 'Curriculum Standards'}.`
      }).catch(() => {});

    } catch (err) {
      console.error("Quiz submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Share Dialog
  const handleOpenShare = async () => {
    const shareId = 'kdx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const title = sourceMode === 'KNOWLEDGE_BASE'
      ? `Knowledge Base Exam (${selectedDocumentFilter === 'ALL' ? 'Uploaded Notes' : selectedDocumentFilter})`
      : `Curriculum Assessment (${selectedTopic})`;

    const sharePackage = {
      shareId,
      title,
      sourceMode,
      documentName: selectedDocumentFilter,
      topicName: selectedTopic,
      questions,
      answers: currentAnswers,
      report,
      createdAt: new Date().toISOString(),
      creator: activeUserId
    };

    localStorage.setItem(`kodexis_shared_test_${shareId}`, JSON.stringify(sharePackage));

    try {
      await axios.post('/api/assessment/share', sharePackage, { timeout: 3500 });
    } catch (e) {
      console.warn('Backend shared test registration notice:', e);
    }

    mysqlService.recordCandidateLog(
      activeUserId,
      'INFO',
      'ASSESSMENT_SHARED',
      `Shared test "${title}" with ${questions.length} questions.`,
      { shareId, questionCount: questions.length }
    ).catch(() => {});

    const fullUrl = `${window.location.origin}/share/${shareId}`;
    setShareUrl(fullUrl);
    setIsCopied(false);
    setIsShareModalOpen(true);
  };

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      
      {/* SHARED BANNER ALERT */}
      {sharedBanner && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <Share2 size={16} className="text-cyan-400 shrink-0" />
            <span>{sharedBanner}</span>
          </div>
          <button
            onClick={() => setSharedBanner(null)}
            className="p-1 hover:text-white transition"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/5 via-transparent to-brand-violet/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-cyan uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Adaptive Mock Exams & Knowledge Base Test Synthesizer</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight font-mono">
            Adaptive Diagnostic Assessment Lab
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Create tailored tests synthesized directly from your <strong>uploaded textbooks, lecture slides, and notes</strong>, or curriculum standards. Share test links with peers with instant cross-model verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {quizStarted && (
            <button
              onClick={handleOpenShare}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/20 transition shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              title="Share this assessment with peers"
            >
              <Share2 size={14} />
              <span>SHARE TEST</span>
            </button>
          )}

          {quizStarted && !report && (
            <button
              onClick={handleResetScope}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-mono text-xs hover:bg-zinc-700 transition border border-border"
            >
              <RotateCcw size={14} />
              <span>RESET SCOPE</span>
            </button>
          )}
        </div>
      </div>

      {!quizStarted ? (
        /* QUIZ SCOPE CONFIGURATION PANEL */
        <div className="max-w-3xl mx-auto glass-panel p-6 md:p-8 rounded-2xl border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center space-x-3">
              <Filter size={20} className="text-brand-cyan" />
              <div>
                <h2 className="text-lg font-bold font-mono text-zinc-100">CONFIGURE ASSESSMENT SCOPE</h2>
                <p className="text-xs text-zinc-400">Choose knowledge source, question format, and difficulty target.</p>
              </div>
            </div>

            {/* Knowledge Units Badge */}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
              <BookOpen size={11} />
              <span>{knowledgeUnits.length} Notes Ingested</span>
            </span>
          </div>

          {/* ASSESSMENT SOURCE TOGGLE (Requirement: Create test with knowledge base uploaded) */}
          <div className="space-y-2 font-mono">
            <label className="text-xs font-bold text-zinc-300 block">Assessment Question Source</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSourceMode('KNOWLEDGE_BASE')}
                className={`p-4 rounded-xl border text-left transition relative ${
                  sourceMode === 'KNOWLEDGE_BASE'
                    ? 'bg-cyan-500/15 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500'
                    : 'bg-zinc-900/50 border-border hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <FileCheck2 size={15} /> Uploaded Knowledge Base
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    {knowledgeUnits.length} Units
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Synthesize exam questions directly from your uploaded PDFs, lecture slides, and notes with citation tracking.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSourceMode('CURRICULUM')}
                className={`p-4 rounded-xl border text-left transition relative ${
                  sourceMode === 'CURRICULUM'
                    ? 'bg-purple-500/15 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500'
                    : 'bg-zinc-900/50 border-border hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Layers size={15} /> Curriculum Standards
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    5 Domains
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Standard university and technical interview benchmark curriculum (Distributed Systems, DBMS, DSA, OS, Networking).
                </p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Document Filter (if Knowledge Base is active) */}
            {sourceMode === 'KNOWLEDGE_BASE' ? (
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold">Target Uploaded Document</label>
                <select
                  value={selectedDocumentFilter}
                  onChange={(e) => setSelectedDocumentFilter(e.target.value)}
                  className="w-full p-3 rounded-xl bg-background border border-border text-zinc-200"
                >
                  <option value="ALL">All Uploaded Material ({knowledgeUnits.length} notes)</option>
                  {uniqueDocuments.map((docName, idx) => (
                    <option key={idx} value={docName}>{docName}</option>
                  ))}
                </select>
              </div>
            ) : (
              /* Topic Select */
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold">Curriculum Scope / Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-3 rounded-xl bg-background border border-border text-zinc-200"
                >
                  <option value="ALL">All Ingested Topics (Comprehensive)</option>
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Question Format */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-bold">Question Format Modality</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-border text-zinc-200"
              >
                <option value="ALL">Mixed (MCQ & Short Answer)</option>
                <option value="MCQ">Multiple Choice Questions (MCQ)</option>
                <option value="SHORT_ANSWER">Short Answer (Concept Recall)</option>
                <option value="NUMERICAL">Numerical Problems</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-bold">Difficulty Target</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-border text-zinc-200"
              >
                <option value="ALL">Adaptive (Dynamic Calibration)</option>
                <option value="EASY">Foundational / Easy</option>
                <option value="MEDIUM">Intermediate Core</option>
                <option value="HARD">Advanced / Hard</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-bold">Assessment Volume</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full p-3 rounded-xl bg-background border border-border text-zinc-200"
              >
                <option value={3}>3 Questions (Speed Diagnostic)</option>
                <option value={5}>5 Questions (Standard Calibration)</option>
                <option value={8}>8 Questions (In-depth Evaluation)</option>
                <option value={10}>10 Questions (Comprehensive Exam)</option>
              </select>
            </div>
          </div>

          {/* Action Launcher */}
          <div className="pt-2">
            <button
              onClick={handleStartQuiz}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-brand-cyan hover:bg-brand-cyan/90 text-zinc-950 font-mono text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-brand-cyan/20"
            >
              {isSubmitting ? (
                <span>SYNTHESIZING QUESTIONS...</span>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>
                    {sourceMode === 'KNOWLEDGE_BASE'
                      ? `CREATE TEST FROM UPLOADED NOTES (${questionCount} QUESTIONS)`
                      : `GENERATE CURRICULUM TEST (${questionCount} QUESTIONS)`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : !report ? (
        /* ACTIVE TEST RUNNER */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Active Test HUD */}
          <div className="glass-panel p-4 rounded-xl border border-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-brand-cyan">
                {sourceMode === 'KNOWLEDGE_BASE' ? 'KNOWLEDGE BASE EXAM' : 'CURRICULUM EXAM'}
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-300">
                {Object.keys(currentAnswers).length} of {questions.length} Answered
              </span>
            </div>

            <button
              onClick={handleOpenShare}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition text-[11px] font-bold"
            >
              <Share2 size={13} />
              <span>Share Test</span>
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="glass-panel p-6 rounded-2xl border border-border space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-bold">
                      Q{idx + 1}
                    </span>
                    <span className="text-zinc-400 font-bold">{q.topicName}</span>
                    <span className="text-zinc-500">• {q.difficulty}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 truncate max-w-xs" title={q.sourceLocation}>
                    Source: {q.sourceLocation}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-semibold text-zinc-100 leading-relaxed font-sans">
                  {q.questionText}
                </h3>

                {/* Question Type: MCQ Options */}
                {q.type === 'MCQ' && q.options && (
                  <div className="space-y-2 font-sans text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = currentAnswers[q.id] === opt;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`w-full text-left p-3.5 rounded-xl border transition flex items-start space-x-3 ${
                            isSelected
                              ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.15)] font-medium'
                              : 'bg-background-panel border-border/80 text-zinc-300 hover:bg-zinc-900/60'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono font-bold ${
                            isSelected ? 'border-brand-cyan bg-brand-cyan text-zinc-950' : 'border-zinc-600 text-zinc-400'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Question Type: Short Answer */}
                {q.type === 'SHORT_ANSWER' && (
                  <div className="space-y-1.5 font-mono">
                    <input
                      type="text"
                      placeholder="Type your concise conceptual answer here..."
                      value={currentAnswers[q.id] || ''}
                      onChange={(e) => handleSelectOption(q.id, e.target.value)}
                      className="w-full p-3 rounded-xl bg-background border border-border text-zinc-100 text-xs focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                )}

                {/* Question Type: Numerical */}
                {q.type === 'NUMERICAL' && (
                  <div className="flex items-center space-x-2 font-mono">
                    <input
                      type="number"
                      placeholder="Enter computed value..."
                      value={currentAnswers[q.id] || ''}
                      onChange={(e) => handleSelectOption(q.id, e.target.value)}
                      className="w-64 p-3 rounded-xl bg-background border border-border text-zinc-100 text-xs focus:outline-none focus:border-brand-cyan"
                    />
                    {q.numericalUnit && (
                      <span className="text-xs text-zinc-400">{q.numericalUnit}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Test Submission Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || Object.keys(currentAnswers).length === 0}
              className="w-full py-4 rounded-xl bg-brand-violet hover:bg-brand-violet/90 disabled:opacity-50 text-white font-mono text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-brand-violet/20"
            >
              {isSubmitting ? (
                <span>EVALUATING RESPONSES...</span>
              ) : (
                <>
                  <Award size={15} />
                  <span>SUBMIT ASSESSMENT FOR DIAGNOSTIC GRADING</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* DIAGNOSTIC REPORT (Requirement 3b & 3c) */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Executive Mastery Score Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-brand-cyan/30 bg-gradient-to-r from-brand-cyan/10 via-transparent to-brand-violet/10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-brand-cyan uppercase tracking-wider block mb-1">
                  DIAGNOSTIC ASSESSMENT DOSSIER
                </span>
                <h2 className="text-xl md:text-2xl font-bold font-mono text-zinc-100">
                  Performance Evaluation: {report.masteryTier} TIER
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Evaluated {report.totalQuestions} questions with {report.correctCount} correct ({report.overallAccuracy}% overall accuracy).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenShare}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/20 transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  <Share2 size={14} />
                  <span>Share Results</span>
                </button>

                <div className="w-20 h-20 rounded-2xl bg-zinc-950/80 border border-brand-cyan/40 flex flex-col items-center justify-center font-mono">
                  <span className="text-2xl font-black text-brand-cyan">{report.overallAccuracy}%</span>
                  <span className="text-[9px] text-zinc-400 uppercase">Accuracy</span>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Strong Topics
                </span>
                <ul className="space-y-1 text-zinc-300">
                  {report.strongTopics.map((top, idx) => (
                    <li key={idx}>• {top}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-amber-500/30 space-y-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Recommended Remediation Areas
                </span>
                <ul className="space-y-1 text-zinc-300">
                  {report.weakTopics.map((top, idx) => (
                    <li key={idx}>• {top}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* MISCONCEPTIONS DETECTED */}
          {report.identifiedMisconceptions.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-sm font-bold">
                <AlertTriangle size={18} />
                <span>CONCEPTUAL MISCONCEPTIONS DETECTED</span>
              </div>
              <div className="space-y-3">
                {report.identifiedMisconceptions.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-400 font-mono">
                      <span className="text-amber-400 font-bold">{m.misconceptionName} ({m.conceptName})</span>
                      <span className="text-[11px] text-zinc-500">{m.referenceCitation}</span>
                    </div>
                    <p className="text-zinc-300 font-sans leading-relaxed">{m.explanation}</p>
                    <div className="p-2.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-mono text-[11px]">
                      <strong>Targeted Remediation:</strong> {m.remediationRecommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION-BY-QUESTION CITED FEEDBACK */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-zinc-300">QUESTION-BY-QUESTION CITED FEEDBACK</h3>
            {report.questionResults.map((r, i) => (
              <div key={i} className={`p-5 rounded-2xl border text-xs font-mono space-y-3 ${
                r.correct ? 'bg-background-panel border-emerald-500/30' : 'bg-background-panel border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center space-x-1.5">
                    {r.correct ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 size={16} />
                        <span>Question {i + 1}: CORRECT</span>
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center space-x-1">
                        <XCircle size={16} />
                        <span>Question {i + 1}: INCORRECT</span>
                      </span>
                    )}
                  </span>
                  <span className="text-zinc-500">Source: {r.sourceLocation}</span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300 font-sans leading-relaxed prose prose-invert max-w-none text-xs">
                  <ReactMarkdown>{r.citedFeedback}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
            <button
              onClick={handleResetScope}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-800 text-zinc-200 font-mono text-xs font-bold hover:bg-zinc-700 transition"
            >
              CONFIGURE NEW EXAM
            </button>
            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-cyan text-zinc-950 font-mono text-xs font-bold hover:bg-brand-cyan/90 transition shadow-lg shadow-brand-cyan/15"
            >
              TAKE RETEST (FRESH QUESTIONS)
            </button>
          </div>
        </div>
      )}

      {/* SHARE ASSESSMENT MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fade-in font-sans">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Share2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-zinc-100">SHARE THIS ASSESSMENT</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">Anyone with this link can take this exact test</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded text-zinc-500 hover:text-zinc-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-300 font-bold block">Shareable Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 p-2.5 rounded-xl bg-zinc-900 border border-border text-zinc-200 text-xs font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="px-4 py-2.5 rounded-xl bg-brand-cyan text-zinc-950 font-mono text-xs font-bold hover:bg-brand-cyan/90 transition flex items-center gap-1.5 shrink-0"
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-border text-xs text-zinc-400 space-y-1 font-mono">
              <p>• Contains {questions.length} verified questions</p>
              <p>• Source: {sourceMode === 'KNOWLEDGE_BASE' ? 'Grounded Uploaded Knowledge Base' : 'Curriculum Standards'}</p>
              <p>• Diagnostic feedback and score included</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
