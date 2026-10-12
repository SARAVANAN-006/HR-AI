import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LEARNING_API_BASE } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ragService } from '../lib/ragService';
import {
  RotateCw,
  Headphones,
  Calendar,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileDown,
  Download,
  Copy,
  Check,
  Printer,
  FileText,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

interface Flashcard {
  id: string;
  topicName: string;
  conceptName: string;
  frontPrompt: string;
  backExplanation: string;
  keyFormulaOrCode: string;
  sourceCitation: string;
  intervalDays: number;
}

interface AudioBrief {
  id: string;
  topicName: string;
  title: string;
  durationFormatted: string;
  transcript: string;
  sourceCitation: string;
}

interface SlideSummary {
  topicName: string;
  title: string;
  sourceCitation: string;
  keyBulletPoints: string[];
  diagramCaption?: string;
  visualDataUrl?: string;
}

interface StudySchedule {
  examName: string;
  daysRemainingUntilExam: number;
  currentOverallMastery: number;
  projectedExamDayRetention: number;
  dailyPlans: Array<{
    dayNumber: number;
    dateString: string;
    focusTopic: string;
    focusTopicCategory: string;
    currentMastery: number;
    estimatedMinutes: number;
    recommendedFormat: string;
    highYieldConcepts: string[];
  }>;
  retentionCurve: Array<{
    day: number;
    baselineRetentionWithoutReview: number;
    optimizedRetentionWithSpacedReview: number;
  }>;
}

// Built-in High-Yield Quick Revision Master Sheets
const QUICK_REVISION_SHEETS: Record<string, {
  title: string;
  category: string;
  summary: string;
  coreFormulas: string[];
  complexityTable: Array<{ operation: string; time: string; space: string; notes: string }>;
  edgeCasesAndTraps: string[];
  codeTemplate: string;
  markdownDoc: string;
}> = {
  'distributed-systems': {
    title: 'Distributed Consensus & Fault Tolerance (Paxos, Raft, 2PC)',
    category: 'Distributed Systems',
    summary: 'Distributed consensus algorithms guarantee safe state machine replication across unreliable networks where node crashes and packet drops occur.',
    coreFormulas: [
      'Quorum Requirement: Q = floor(N / 2) + 1 (tolerates f = floor((N - 1) / 2) crash faults)',
      'CAP Theorem Invariant: Under network partition (P), Consistency (C) and Availability (A) are mutually exclusive.',
      'PACELC Theorem: If Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C).'
    ],
    complexityTable: [
      { operation: 'Raft Normal Replication', time: '1 RTT', space: 'O(log entries)', notes: 'Leader broadcasts to majority quorum' },
      { operation: 'Raft Leader Election', time: '1-2 RTT', space: 'O(1)', notes: 'Randomized election timer (150-300ms)' },
      { operation: 'Two-Phase Commit (2PC)', time: '2 RTT', space: 'O(cohorts)', notes: 'Blocking if coordinator fails after PREPARE' }
    ],
    edgeCasesAndTraps: [
      'Split-Brain Risk: Never run clusters with even node counts without tie-breaker arbiter.',
      'Network Asymmetry: Server A can ping B, but B cannot ping A (handled via pre-vote phase in Raft).',
      'Coordinator Crash in 2PC: Cohorts that voted YES are blocked holding locks until coordinator recovers.'
    ],
    codeTemplate: `# Raft Leader Heartbeat & Quorum Check (Python Conceptual)
def append_entries_quorum(term, leader_id, entries):
    acks = 1  # Self vote
    for peer in cluster.peers:
        if peer.send_append_entries(term, leader_id, entries):
            acks += 1
            if acks > len(cluster.peers) // 2:
                commit_index = max(commit_index, entries[-1].index)
                return True
    return False`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Distributed Consensus & Fault Tolerance (Paxos, Raft, 2PC)
**Category:** Distributed Systems  
**Audience:** High-Frequency Interview & Exam Revision

---

### 1. Executive Summary & Mental Model
Distributed consensus algorithms guarantee that a decentralized cluster of machines agrees upon an ordered sequence of state machine transitions, even when networks partition or leader nodes crash.

### 2. Fundamental Mathematical Formulas & Theorems
- **Quorum Requirement:** $Q = \\lfloor N / 2 \\rfloor + 1$ (tolerates $f = \\lfloor (N - 1) / 2 \\rfloor$ crash faults).
- **CAP Theorem:** In the presence of a network partition ($P$), a distributed system must sacrifice either Availability ($A$) or Consistency ($C$).
- **PACELC Theorem:** If Partition ($P$) choose ($A$ or $C$); Else ($E$) choose Latency ($L$) or Consistency ($C$).

### 3. Algorithmic Complexity Bounds
| Operation | Time Latency | Space Complexity | Notes |
| :--- | :--- | :--- | :--- |
| Normal Log Commit | 1 RTT | $O(\\text{entries})$ | Quorum commit |
| Leader Election | 1-2 RTT | $O(1)$ | Randomized timeouts |
| Two-Phase Commit | 2 RTT | $O(N)$ | Blocking on coordinator failure |

### 4. Edge Cases & Interview Traps
1. **Split-Vote Prevention:** Randomize heartbeat/election timeouts between 150ms and 300ms to break symmetry.
2. **2PC Blocking Problem:** Unlike Paxos/Raft, 2PC is not consensus—it is an atomic commit protocol where any single failure halts the entire transaction.
3. **Log Compaction:** Always apply snapshotting before memory exhaustion occurs.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'databases': {
    title: 'Database Internals: MVCC, B+ Trees & Write-Ahead Logging',
    category: 'Database Systems',
    summary: 'Relational storage engines combine append-only write-ahead logging (WAL) for durability with multi-version concurrency control (MVCC) for non-blocking snapshot isolation.',
    coreFormulas: [
      'B+ Tree Height Bound: h <= ceil(log_B(N / 2)) where B is branching factor (fan-out)',
      'Snapshot Visibility: Row visible if xmin < Txn_ID and (xmax is NULL or xmax > Txn_ID)',
      'WAL Invariant: Log record must flush to non-volatile disk before dirty page write to data file'
    ],
    complexityTable: [
      { operation: 'B+ Tree Point Lookup', time: 'O(log_B N)', space: 'O(1)', notes: 'Typically 3-4 I/O operations for millions of rows' },
      { operation: 'B+ Tree Range Scan', time: 'O(log_B N + K)', space: 'O(K)', notes: 'Traverse sequential leaf node linked list' },
      { operation: 'LSM-Tree Write', time: 'O(1)', space: 'O(RAM MemTable)', notes: 'Appends to MemTable and disk WAL' }
    ],
    edgeCasesAndTraps: [
      'Write Skew in Snapshot Isolation: Two transactions read disjoint rows and update each other’s constraints.',
      'Phantom Reads: Range queries returning newly inserted rows (remediated via Serializable SSI or predicate locking).',
      'Table Bloat from Dead Tuples: In PostgreSQL, high update rates require aggressive autovacuum tuning to prevent index bloat.'
    ],
    codeTemplate: `-- PostgreSQL Transaction Snapshot Visibility Check
SELECT txid_current(), txid_current_snapshot();
-- Tuple header contains xmin (creating txn) and xmax (deleting/updating txn)
-- VACUUM FULL reclaims dead tuple storage space on disk`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Database Internals (MVCC, B+ Trees & WAL)
**Category:** Database Systems  
**Audience:** High-Frequency Interview & Exam Revision

---

### 1. Executive Summary
Modern relational DBMS (PostgreSQL, MySQL InnoDB) optimize read and write concurrency using Multi-Version Concurrency Control (MVCC) and B+ Tree indexing, backed by Write-Ahead Logging (WAL) for ACID guarantees.

### 2. Core Architectural Invariants
- **Write-Ahead Logging (WAL):** A data block cannot be written to disk before the log record describing the update is safely flushed to non-volatile storage.
- **Snapshot Isolation Rule:** Readers never block writers, and writers never block readers.
- **B+ Tree Leaf Nodes:** All keys reside in leaf nodes, linked sequentially for $O(K)$ range query performance.

### 3. Complexity Trade-Offs
| Engine / Structure | Read Point | Range Scan | Write Throughput |
| :--- | :--- | :--- | :--- |
| **B+ Tree (InnoDB)** | $O(\\log_B N)$ | $O(\\log_B N + K)$ | Moderate (Random Disk I/O) |
| **LSM Tree (RocksDB)** | $O(\\log N)$ (Bloom filters) | $O(\\log N + K)$ | High (Sequential Append) |

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'dynamic-programming': {
    title: 'Dynamic Programming: Memoization, Tabulation & State Space',
    category: 'Algorithms & DSA',
    summary: 'Dynamic programming optimizes exponential recursive search spaces down to polynomial time by recognizing optimal substructure and caching overlapping subproblems.',
    coreFormulas: [
      'Time Complexity = (Number of Distinct States) * (Work per State Transition)',
      'Space Complexity = (Number of Distinct States) or O(1) with rolling array reduction',
      'Bellman Equation: DP(state) = min/max { DP(substate) + cost }'
    ],
    complexityTable: [
      { operation: '0/1 Knapsack', time: 'O(N * W)', space: 'O(W)', notes: 'Pseudo-polynomial; 1D rolling array optimization' },
      { operation: 'Longest Common Subsequence (LCS)', time: 'O(M * N)', space: 'O(min(M, N))', notes: 'Keep only two previous rows' },
      { operation: 'Coin Change (Min Coins)', time: 'O(N * Amount)', space: 'O(Amount)', notes: 'Unbounded knapsack transition' }
    ],
    edgeCasesAndTraps: [
      'Base Case Invariants: Ensure DP[0] or boundary states are explicitly initialized before looping.',
      'Reverse Iteration in 1D Knapsack: In 0/1 knapsack with 1D array, iterate capacity backwards from W to w[i] to prevent using the same item twice.',
      'Integer Overflow: Use 64-bit integers when counting paths (e.g., unique paths in large grids).'
    ],
    codeTemplate: `# 0/1 Knapsack Space-Optimized Template (Python)
def knapsack_01(weights, values, W):
    dp = [0] * (W + 1)
    for w, v in zip(weights, values):
        for cap in range(W, w - 1, -1):  # REVERSE loop prevents duplicate inclusion
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    return dp[W]`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Dynamic Programming Patterns & Complexity
**Category:** Algorithms & Data Structures  
**Audience:** High-Frequency Interview & Exam Revision

---

### 1. Fundamental Mental Model
Dynamic Programming is simply **recursion without repetition**.
1. **Optimal Substructure:** Optimal solution to problem contains optimal solutions to subproblems.
2. **Overlapping Subproblems:** The same subproblems are solved multiple times.

### 2. Time & Space Complexity Framework
$$\\text{Total Time} = (\\text{Number of Unique Subproblem States}) \\times (\\text{Time per State Transition})$$

### 3. Essential Patterns & Invariants
- **Top-Down (Memoization):** Start from target state, recurse downwards, cache in hash map or array.
- **Bottom-Up (Tabulation):** Start from base cases (0 or 1), iterate forward.
- **Rolling Space Optimization:** If state $i$ only depends on state $i - 1$, drop the 2D matrix to two 1D rows.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'operating-systems': {
    title: 'Operating Systems: Virtual Memory, Paging & Kernel Mechanics',
    category: 'Operating Systems',
    summary: 'Virtual memory separates the logical address space from physical RAM via hardware MMU address translation, multi-level page tables, and demand-paging swap backing stores.',
    coreFormulas: [
      'Number of Pages = Virtual Address Space / Page Size (e.g. 2^32 / 2^12 = 2^20 pages)',
      'Effective Memory Access Time: EMAT = (TLB Hit Rate * TLB Time) + ((1 - Hit Rate) * (TLB Time + Memory Time))',
      'Thrashing Condition: Sum of working set sizes across active processes exceeds available physical RAM.'
    ],
    complexityTable: [
      { operation: 'TLB Hit Translation', time: '1 cycle (Hardware)', space: 'O(TLB entries)', notes: 'Direct fast hardware cache lookup' },
      { operation: '4-Level Page Walk (x86-64)', time: '4 RAM lookups', space: 'O(Pages)', notes: 'PML4 -> PDPT -> PD -> PT -> Frame' },
      { operation: 'Page Fault Service', time: '~5-10 ms (Disk I/O)', space: 'O(1 frame)', notes: 'Traps to kernel, reads swap, updates PTE' }
    ],
    edgeCasesAndTraps: [
      'TLB Invalidation on Context Switch: Switching CR3 register flushes user TLB entries unless ASID (Address Space ID) is supported.',
      'Internal vs External Fragmentation: Paging eliminates external fragmentation but incurs internal fragmentation on the final page.',
      'Copy-On-Write (COW) on fork(): Parent and child share read-only pages until one writes, triggering a page fault that clones the frame.'
    ],
    codeTemplate: `// Virtual Address Decomposition
uint64_t vpn = (virtual_address >> 12) & 0x1FFFFFFFFFFFF; // Page number
uint64_t offset = virtual_address & 0xFFF;                // 4 KB offset
uint64_t pfn = page_table_lookup(vpn);
uint64_t physical_address = (pfn << 12) | offset;`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Operating Systems (Virtual Memory & Paging)
**Category:** Operating Systems  
**Audience:** High-Frequency Interview & Exam Revision

---

### 1. Executive Summary
Virtual memory decouples the programmer's view of memory from physical RAM. The Memory Management Unit (MMU) translates Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN).

### 2. Core Equations
- **Virtual Page Count:** $\\frac{\\text{Address Space Size}}{\\text{Page Size}} = \\frac{2^{32}}{2^{12}} = 2^{20} = 1,048,576\\text{ pages}$
- **Effective Memory Access Time (EMAT):**  
  $\\text{EMAT} = h \\times t_{\\text{TLB}} + (1 - h) \\times (t_{\\text{TLB}} + t_{\\text{RAM}})$

### 3. Essential Memory Concepts
- **Translation Lookaside Buffer (TLB):** Fast associative cache for address translation.
- **Multi-Level Page Tables:** Saves memory by allocating lower-level tables only for active address regions.
- **Copy-On-Write:** \`fork()\` duplicates page tables with read-only flags instead of cloning gigabytes of physical RAM.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  }
};

export const RevisionStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'QUICK_NOTES' | 'FLASHCARDS' | 'AUDIO_BRIEFS' | 'SLIDE_SUMMARIES' | 'STUDY_SCHEDULE'>('QUICK_NOTES');
  
  // Quick Revision Notes State (Requirement 3)
  const [selectedTopicKey, setSelectedTopicKey] = useState<string>('distributed-systems');
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [knowledgeUnitsCount, setKnowledgeUnitsCount] = useState<number>(0);

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [audioBriefs, setAudioBriefs] = useState<AudioBrief[]>([]);
  const [activeAudioIdx, setActiveAudioIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [slideSummaries, setSlideSummaries] = useState<SlideSummary[]>([]);
  const [schedule, setSchedule] = useState<StudySchedule | null>(null);

  const [examDays] = useState(14);
  const [examName] = useState('Distributed Systems & Algorithms Final Assessment');
  const { user } = useAuth();
  const activeUserId = user?.username || 'candidate';

  const API_BASE = LEARNING_API_BASE;

  useEffect(() => {
    fetchRevisionData();
    const units = ragService.getKnowledgeUnits();
    setKnowledgeUnitsCount(units.length);
  }, [activeUserId]);

  const fetchRevisionData = async () => {
    try {
      const [revRes, schedRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/revision/material?userId=${encodeURIComponent(activeUserId)}`, { timeout: 2500 }),
        axios.get(`${API_BASE}/revision/schedule?userId=${encodeURIComponent(activeUserId)}&days=${examDays}&examName=${encodeURIComponent(examName)}`, { timeout: 2500 })
      ]);

      if (revRes.status === 'fulfilled' && revRes.value.data) {
        setFlashcards(revRes.value.data.flashcards || []);
        setAudioBriefs(revRes.value.data.audioBriefs || []);
        setSlideSummaries(revRes.value.data.slideSummaries || []);
      }
      if (schedRes.status === 'fulfilled' && schedRes.value.data) {
        setSchedule(schedRes.value.data);
      }
    } catch {
      // Use built-in materials
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % (flashcards.length || 1));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + (flashcards.length || 1)) % (flashcards.length || 1));
  };

  const handlePlayAudio = (brief: AudioBrief) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(brief.transcript);
      utterance.rate = 1.05;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const activeCard = flashcards[currentCardIdx];
  const currentSheet = QUICK_REVISION_SHEETS[selectedTopicKey] || QUICK_REVISION_SHEETS['distributed-systems'];

  // Download Quick Revision Notes as Markdown (.md)
  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([currentSheet.markdownDoc], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Kodexis_Revision_Notes_${selectedTopicKey}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download Quick Revision Notes as Text (.txt)
  const handleDownloadText = () => {
    const textContent = `${currentSheet.title}\nCategory: ${currentSheet.category}\n\nSUMMARY:\n${currentSheet.summary}\n\nCORE FORMULAS:\n${currentSheet.coreFormulas.join('\n')}\n\nEDGE CASES & TRAPS:\n${currentSheet.edgeCasesAndTraps.join('\n')}\n\nCODE TEMPLATE:\n${currentSheet.codeTemplate}`;
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Kodexis_Revision_Notes_${selectedTopicKey}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Copy Markdown to Clipboard
  const handleCopyMarkdown = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentSheet.markdownDoc);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2200);
    }
  };

  // Print Formatted Revision Sheet
  const handlePrintNotes = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* HEADER BANNER */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/5 via-transparent to-brand-violet/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-cyan uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Targeted Revision Studio & Downloadable Revision Notes</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight font-mono">
            Targeted Revision Studio & Spaced Mastery
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Generate and download <strong>high-yield Quick Revision Notes (.md, .txt)</strong>, spaced-repetition flashcards, and audio briefs calibrated to your weakest concepts{knowledgeUnitsCount > 0 ? ` and ${knowledgeUnitsCount} uploaded knowledge base units` : ''}.
          </p>
        </div>

        {/* REVISION MODALITY SELECTOR */}
        <div className="flex flex-wrap items-center gap-1.5 bg-background-panel border border-border p-1.5 rounded-xl shrink-0 font-mono">
          <button
            onClick={() => setActiveTab('QUICK_NOTES')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'QUICK_NOTES'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileDown size={14} />
            <span>Quick Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('FLASHCARDS')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'FLASHCARDS'
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <RotateCw size={14} />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIO_BRIEFS')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'AUDIO_BRIEFS'
                ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Headphones size={14} />
            <span>Audio Briefs</span>
          </button>

          <button
            onClick={() => setActiveTab('SLIDE_SUMMARIES')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'SLIDE_SUMMARIES'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers size={14} />
            <span>Slide Summaries</span>
          </button>

          <button
            onClick={() => setActiveTab('STUDY_SCHEDULE')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'STUDY_SCHEDULE'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar size={14} />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* TAB 1: QUICK REVISION NOTES GENERATOR & DOWNLOADER (Requirement 3) */}
      {activeTab === 'QUICK_NOTES' && (
        <div className="space-y-6">
          {/* Topic Selector & Action Controls */}
          <div className="glass-panel p-5 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs text-zinc-400 font-bold uppercase shrink-0">Select Revision Domain:</span>
              <select
                value={selectedTopicKey}
                onChange={(e) => setSelectedTopicKey(e.target.value)}
                className="p-2.5 rounded-xl bg-zinc-900 border border-border text-cyan-300 text-xs font-bold focus:outline-none focus:border-cyan-500"
              >
                <option value="distributed-systems">Distributed Systems (Paxos, Raft, 2PC, Quorums)</option>
                <option value="databases">Database Internals (MVCC, B+ Trees, WAL, ACID)</option>
                <option value="dynamic-programming">Dynamic Programming (Patterns, Memoization, State Space)</option>
                <option value="operating-systems">Operating Systems (Virtual Memory, Paging, TLB, COW)</option>
              </select>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadMarkdown}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                title="Download formatted Markdown notes file"
              >
                <Download size={13} />
                <span>Download Notes (.md)</span>
              </button>

              <button
                onClick={handleDownloadText}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-border font-mono text-xs font-bold transition flex items-center gap-1.5"
                title="Download plain text notes file"
              >
                <FileText size={13} />
                <span>Text (.txt)</span>
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-border font-mono text-xs transition flex items-center gap-1.5"
                title="Copy Markdown content to clipboard"
              >
                {copiedNotice ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedNotice ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrintNotes}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-border transition"
                title="Print or Save as PDF"
              >
                <Printer size={14} />
              </button>
            </div>
          </div>

          {/* Rendered Revision Sheet */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-cyan-500/25 bg-background-panel space-y-6">
            {/* Sheet Header */}
            <div className="border-b border-border/70 pb-4 flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  KODEXIS HIGH-YIELD REVISION SHEET • {currentSheet.category}
                </span>
                <h2 className="text-xl md:text-2xl font-bold font-mono text-zinc-100">
                  {currentSheet.title}
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                  {currentSheet.summary}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shrink-0">
                Ready for Download
              </span>
            </div>

            {/* Core Formulas & Theoretical Invariants */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={14} /> Core Invariants & Mathematical Formulas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                {currentSheet.coreFormulas.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-zinc-950/70 border border-cyan-500/20 text-zinc-300 leading-relaxed">
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithmic Complexity Bounds Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                Complexity Trade-offs & Bounds
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] border-b border-border">
                    <tr>
                      <th className="p-3">Operation / Protocol</th>
                      <th className="p-3">Time / Latency</th>
                      <th className="p-3">Space Overhead</th>
                      <th className="p-3">Engineering Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-zinc-300 bg-zinc-950/40">
                    {currentSheet.complexityTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/40 transition">
                        <td className="p-3 font-bold text-zinc-200">{row.operation}</td>
                        <td className="p-3 text-cyan-300">{row.time}</td>
                        <td className="p-3 text-purple-300">{row.space}</td>
                        <td className="p-3 text-zinc-400 font-sans text-[11px]">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edge Cases & Common Bugs */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Edge Cases, Failure Modes & Interview Traps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
                {currentSheet.edgeCasesAndTraps.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/30 text-zinc-300 leading-relaxed">
                    <span className="font-bold text-amber-400 block mb-1 font-mono">Trap #{idx + 1}</span>
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Canonical Code Template */}
            <div className="space-y-3 font-mono">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Canonical Code Snippet / Protocol Pattern
              </h3>
              <div className="p-4 rounded-xl bg-zinc-950 border border-border text-xs text-cyan-300 overflow-x-auto">
                <pre>{currentSheet.codeTemplate}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLASHCARDS STUDIO */}
      {activeTab === 'FLASHCARDS' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>WEAK TOPIC REVISION DECK</span>
            <span>CARD {flashcards.length > 0 ? currentCardIdx + 1 : 0} OF {flashcards.length}</span>
          </div>

          {flashcards.length > 0 && activeCard ? (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full min-h-[300px] p-8 rounded-2xl border border-brand-cyan/30 bg-background-panel cursor-pointer select-none transition-all flex flex-col justify-between shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className="text-brand-cyan font-bold">{activeCard.topicName}</span>
                  <span className="text-zinc-500">Interval: {activeCard.intervalDays}d</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-100 mb-2">
                  {isFlipped ? activeCard.conceptName : activeCard.frontPrompt}
                </h3>
                {isFlipped && (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                      {activeCard.backExplanation}
                    </p>
                    {activeCard.keyFormulaOrCode && (
                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-cyan">
                        <code>{activeCard.keyFormulaOrCode}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-6 border-t border-border/50">
                <span>{isFlipped ? 'CLICK TO FLIP TO FRONT' : 'CLICK TO REVEAL EXPLANATION'}</span>
                <span className="text-[11px] truncate max-w-xs">{activeCard.sourceCitation}</span>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-border text-center space-y-3 font-mono">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
              <p className="text-sm text-zinc-300">All flashcard reviews up to date for today!</p>
              <button
                onClick={() => setActiveTab('QUICK_NOTES')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-zinc-950 font-bold text-xs"
              >
                Explore Quick Revision Sheets
              </button>
            </div>
          )}

          {flashcards.length > 0 && (
            <div className="flex justify-between items-center font-mono">
              <button
                onClick={handlePrevCard}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs flex items-center space-x-1 hover:bg-zinc-700"
              >
                <ChevronLeft size={16} />
                <span>PREVIOUS</span>
              </button>
              <button
                onClick={handleNextCard}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs flex items-center space-x-1 hover:bg-zinc-700"
              >
                <span>NEXT</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. AUDIO BRIEFS */}
      {activeTab === 'AUDIO_BRIEFS' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-3">
            {audioBriefs.map((brief, idx) => {
              const isSelected = activeAudioIdx === idx;
              return (
                <div
                  key={brief.id || idx}
                  className={`p-4 rounded-xl border transition ${
                    isSelected ? 'bg-brand-violet/15 border-brand-violet' : 'bg-background-panel border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-brand-violet font-bold uppercase">{brief.topicName}</span>
                      <h4 className="text-sm font-bold text-zinc-200">{brief.title}</h4>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{brief.durationFormatted} • {brief.sourceCitation}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveAudioIdx(idx);
                        handlePlayAudio(brief);
                      }}
                      className="p-3 rounded-full bg-brand-violet/20 text-brand-violet hover:bg-brand-violet hover:text-white transition"
                    >
                      <Headphones size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SLIDE SUMMARIES */}
      {activeTab === 'SLIDE_SUMMARIES' && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {slideSummaries.map((slide, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-border space-y-3">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{slide.topicName}</span>
              <h4 className="text-sm font-bold text-zinc-200">{slide.title}</h4>
              <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                {slide.keyBulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-brand-cyan">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
              <span className="text-[10px] text-zinc-500 font-mono block pt-2">{slide.sourceCitation}</span>
            </div>
          ))}
        </div>
      )}

      {/* 5. STUDY SCHEDULE & FORGETTING CURVE */}
      {activeTab === 'STUDY_SCHEDULE' && schedule && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
            <h3 className="text-sm font-mono font-bold text-zinc-200">OPTIMIZED RETENTION TRAJECTORY (EBBINGHAUS SPACING)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={schedule.retentionCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#71717a" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="optimizedRetentionWithSpacedReview" name="With Spaced Review" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="baselineRetentionWithoutReview" name="Without Review" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
