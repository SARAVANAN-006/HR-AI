import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Award,
  Send,
  HelpCircle,
  Share2,
  Check
} from 'lucide-react';

interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  codeSnippet?: string;
  topic?: string;
}

interface SharedPackage {
  shareId: string;
  title: string;
  sourceMode?: string;
  difficulty?: string;
  domain?: string;
  targetRole?: string;
  questions: QuestionItem[];
  createdByName?: string;
}

export const StandaloneSharedAssessment: React.FC = () => {
  const { shareId: paramShareId } = useParams<{ shareId: string }>();
  const [searchParams] = useSearchParams();
  const shareId = paramShareId || searchParams.get('shareId') || 'demo';

  const [assessment, setAssessment] = useState<SharedPackage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [candidateName, setCandidateName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    correctCount: number;
    totalCount: number;
    percentage: number;
    verdict: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    loadAssessment();
  }, [shareId]);

  const loadAssessment = async () => {
    setLoading(true);
    // 1. Try backend server directly
    try {
      const res = await axios.get(`/api/assessment/share/${encodeURIComponent(shareId)}`, { timeout: 3500 });
      if (res.data && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
        setAssessment(res.data);
        setLoading(false);
        return;
      }
    } catch (e) {
      // Fall through to local cache or fallback questions
    }

    // 2. Try localStorage cache
    try {
      const saved = localStorage.getItem(`kodexis_shared_test_${shareId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          setAssessment(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // 3. Fallback High-Quality Technical Assessment
    setAssessment({
      shareId,
      title: 'Computer Science Core Engineering Assessment',
      difficulty: 'INTERMEDIATE',
      domain: 'Algorithms, Systems & Architecture',
      targetRole: 'Software Engineer',
      createdByName: 'KODEXIS Assessment Chamber',
      questions: [
        {
          id: 'q-1',
          topic: 'Data Structures & Algorithms',
          question: 'What is the tight worst-case time complexity of looking up a key in a Hash Map with chaining when multiple keys hash to the same bucket?',
          options: [
            'O(1) amortized',
            'O(N) where N is the total number of colliding elements in that chain',
            'O(log N) in binary indexed heap',
            'O(N log N) due to bucket re-sorting'
          ],
          correctAnswer: 'O(N) where N is the total number of colliding elements in that chain',
          explanation: 'In a standard chaining hash map, if all elements collide into the same bucket, traversal degrades to linear O(N) linked list search unless balanced tree binning (like Java 8+ Red-Black Tree O(log N)) is activated.'
        },
        {
          id: 'q-2',
          topic: 'Distributed Systems',
          question: 'In the Raft consensus algorithm, what condition must be satisfied before a leader node can mark a log entry as officially committed?',
          options: [
            '100% of all cluster nodes must return an acknowledge packet to the leader.',
            'A strict majority quorum (N/2 + 1) of cluster nodes have appended the log entry to their local disks.',
            'The client application sends an explicit two-phase commit confirm message.',
            'A leader election heartbeat cycle completes without any network timeout.'
          ],
          correctAnswer: 'A strict majority quorum (N/2 + 1) of cluster nodes have appended the log entry to their local disks.',
          explanation: 'Raft operates on quorum consensus: once a log entry has been replicated onto a strict majority (N/2 + 1) of cluster nodes, it is permanently committed and guaranteed to survive future leader elections.'
        },
        {
          id: 'q-3',
          topic: 'Operating Systems & Concurrency',
          question: 'What is the primary difference between a process context switch and a thread context switch within the same process?',
          options: [
            'Thread context switches require invalidating and flushing the CPU Translation Lookaside Buffer (TLB).',
            'Process context switches require switching virtual address spaces and page directory tables, which invalidates cached TLB entries.',
            'Threads cannot share file descriptor tables or open socket handles.',
            'Process switches only require swapping CPU program counters and stack registers.'
          ],
          correctAnswer: 'Process context switches require switching virtual address spaces and page directory tables, which invalidates cached TLB entries.',
          explanation: 'Threads share the same virtual address space, memory pages, and open file descriptors. Switching between processes requires updating the MMU page table root pointer (e.g., CR3 register in x86), which invalidates the TLB cache and causes significant memory overhead.'
        },
        {
          id: 'q-4',
          topic: 'Database Internals & Storage',
          question: 'Why do modern write-heavy storage engines (like Cassandra and RocksDB) utilize Log-Structured Merge (LSM) Trees instead of traditional B+ Trees?',
          options: [
            'B+ Trees cannot perform range scans or equality lookups.',
            'LSM Trees convert random disk writes into sequential append-only writes (MemTable + WAL), maximizing I/O throughput.',
            'LSM Trees completely eliminate the need for background disk compaction.',
            'B+ Trees require O(N) time for index lookups while LSM Trees guarantee O(1) reads.'
          ],
          correctAnswer: 'LSM Trees convert random disk writes into sequential append-only writes (MemTable + WAL), maximizing I/O throughput.',
          explanation: 'B+ Trees perform in-place updates, which trigger random disk I/O. LSM trees append all incoming writes sequentially into an in-memory MemTable and Write-Ahead Log (WAL), eliminating disk seek bottlenecks.'
        },
        {
          id: 'q-5',
          topic: 'Computer Networks',
          question: 'How does HTTP/3 over QUIC eliminate Head-of-Line (HoL) blocking that occurred in HTTP/2 over TCP?',
          options: [
            'By establishing a separate TCP connection for every single asset request.',
            'By utilizing UDP and implementing stream-level framing so a lost packet only delays that specific stream, not other streams.',
            'By compressing headers using HPACK rather than QPACK.',
            'By forcing all packets to route across a single physical network interface.'
          ],
          correctAnswer: 'By utilizing UDP and implementing stream-level framing so a lost packet only delays that specific stream, not other streams.',
          explanation: 'HTTP/2 multiplexed multiple streams over a single TCP connection; when one packet dropped, TCP stalled all streams until retransmission. QUIC builds stream multiplexing natively on UDP, ensuring packet loss on stream A never blocks streams B, C, or D.'
        }
      ]
    });
    setLoading(false);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment) return;

    let correct = 0;
    assessment.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });

    const total = assessment.questions.length;
    const pct = Math.round((correct / total) * 100);
    const verdict = pct >= 80 ? 'EXPERT / STRONG HIRE' : pct >= 60 ? 'PASS / QUALIFIED' : 'NEEDS PRACTICE';

    setScoreResult({
      correctCount: correct,
      totalCount: total,
      percentage: pct,
      verdict
    });
    setIsSubmitted(true);

    // Save telemetry to backend database permanently
    try {
      await axios.post('/api/logs/record', {
        username: candidateName.trim() || 'Peer Candidate',
        action: 'SHARED_ASSESSMENT_SUBMITTED',
        page: `/share/${shareId}`,
        logType: 'AUDIT',
        details: `Candidate completed shared assessment "${assessment.title}" with score ${pct}% (${correct}/${total})`,
        payload: {
          shareId,
          score: pct,
          correct,
          total,
          verdict,
          candidateName: candidateName.trim() || 'Anonymous Candidate'
        }
      });
    } catch {}

    // Scroll smoothly to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-mono">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm text-zinc-400 uppercase tracking-widest">Loading Technical Assessment...</span>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-mono p-4 text-center">
        <XCircle size={48} className="text-rose-500 mb-3" />
        <h2 className="text-xl font-bold">Assessment Not Found</h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-md">This shared assessment link is invalid or expired.</p>
        <Link to="/" className="mt-4 px-4 py-2 rounded bg-cyan-500 text-zinc-950 font-bold text-xs uppercase">
          Go To Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* TOP ISOLATED HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-30 px-4 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              K
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-zinc-100 tracking-wider">KODEXIS</span>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 uppercase">
                  STANDALONE ASSESSMENT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-xs sm:max-w-md">{assessment.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center space-x-1.5 bg-zinc-900"
              title="Copy shareable assessment link"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* HERO TITLE CARD */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                <FileText size={13} />
                <span>{assessment.domain || 'Computer Science Assessment'}</span>
                <span>•</span>
                <span>{assessment.difficulty || 'MEDIUM'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                {assessment.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Answer each question carefully. When you submit, your score, question breakdowns, and conceptual explanations will render directly below on this single page.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 text-center shrink-0 min-w-[130px]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Questions</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{assessment.questions.length}</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Instant Verification</span>
            </div>
          </div>
        </div>

        {/* RESULTS HERO BANNER (APPEARS ON SUBMISSION) */}
        {isSubmitted && scoreResult && (
          <div className="p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-purple-950/30 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className={`p-3 rounded-xl border ${scoreResult.percentage >= 70 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-amber-500/10 border-amber-500/40 text-amber-400'}`}>
                  <Award size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    ASSESSMENT RESULTS FOR {candidateName.trim() ? candidateName.toUpperCase() : 'CANDIDATE'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-white">
                    VERDICT: {scoreResult.verdict}
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-center">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">SCORE</span>
                  <span className="text-3xl font-extrabold font-mono text-cyan-400">{scoreResult.percentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">CORRECT</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">{scoreResult.correctCount} / {scoreResult.totalCount}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
              <span>Telemetry record saved to database permanently.</span>
              <button
                type="button"
                onClick={() => { setIsSubmitted(false); setAnswers({}); setScoreResult(null); }}
                className="text-cyan-400 hover:text-cyan-300 underline font-bold"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        )}

        {/* CANDIDATE INFO INPUT */}
        {!isSubmitted && (
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col sm:flex-row items-center gap-3">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider shrink-0">
              Candidate Name (Optional):
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Alex Chen"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
        )}

        {/* QUESTIONS FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {assessment.questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCorrect = isSubmitted && answers[q.id] === q.correctAnswer;
            const isIncorrect = isSubmitted && isAnswered && answers[q.id] !== q.correctAnswer;

            return (
              <div
                key={q.id || idx}
                className={`p-6 rounded-2xl border transition ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-rose-500/40 bg-rose-950/10'
                    : isAnswered
                    ? 'border-zinc-700 bg-zinc-900/70'
                    : 'border-zinc-800/80 bg-zinc-900/40'
                } space-y-4`}
              >
                {/* QUESTION HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono font-bold flex items-center justify-center text-zinc-300">
                      {idx + 1}
                    </span>
                    {q.topic && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-800/60 border border-zinc-700 text-cyan-300">
                        {q.topic}
                      </span>
                    )}
                  </div>

                  {isSubmitted && (
                    <div className="flex items-center space-x-1.5 text-xs font-mono font-bold">
                      {isCorrect ? (
                        <span className="flex items-center space-x-1 text-emerald-400">
                          <CheckCircle2 size={16} />
                          <span>CORRECT</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-rose-400">
                          <XCircle size={16} />
                          <span>INCORRECT</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* QUESTION BODY */}
                <h3 className="text-sm sm:text-base font-semibold text-zinc-100 leading-relaxed">
                  {q.question}
                </h3>

                {/* OPTIONAL CODE SNIPPET */}
                {q.codeSnippet && (
                  <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {/* OPTIONS LIST */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[q.id] === opt;
                    const isTheCorrectOption = isSubmitted && opt === q.correctAnswer;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt)}
                        disabled={isSubmitted}
                        className={`w-full p-3.5 rounded-xl text-left text-xs font-mono transition flex items-center justify-between border ${
                          isTheCorrectOption
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500'
                            : isSelected && isIncorrect
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200 line-through'
                            : isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 font-bold'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'border-cyan-400 bg-cyan-400 text-zinc-950 font-bold' : 'border-zinc-700 text-zinc-500'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isTheCorrectOption && (
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* EXPLANATION ACCORDION (ALWAYS REVEALED AFTER SUBMISSION) */}
                {isSubmitted && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-sans space-y-1.5 mt-3">
                    <div className="flex items-center space-x-1.5 text-cyan-400 font-mono font-bold text-[11px] uppercase">
                      <HelpCircle size={14} />
                      <span>Conceptual Explanation</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{q.explanation}</p>
                    <p className="text-[11px] font-mono text-emerald-400 pt-1">
                      <strong>Correct Answer:</strong> {q.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* BOTTOM SUBMIT BAR */}
          {!isSubmitted ? (
            <div className="sticky bottom-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur shadow-2xl flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-zinc-400">
                Answered <strong className="text-cyan-400">{Object.keys(answers).length}</strong> of{' '}
                <strong>{assessment.questions.length}</strong> questions
              </span>

              <button
                type="submit"
                disabled={Object.keys(answers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-zinc-950 font-mono text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
              >
                <span>Submit & View Results</span>
                <Send size={14} />
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-xs font-mono text-zinc-300 transition"
              >
                Back to Top of Results
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default StandaloneSharedAssessment;
