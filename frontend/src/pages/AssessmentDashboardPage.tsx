import React, { useState } from 'react';
import { 
  BarChart3, 
  Code, 
  History, 
  Network, 
  User, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  Terminal
} from 'lucide-react';
import RadarChart from '../components/RadarChart';
import ProgressChart from '../components/ProgressChart';
import LanguageBreakdownChart from '../components/LanguageBreakdownChart';
import CodeQualityInspector from '../components/CodeQualityInspector';
import AiFeedbackCard from '../components/AiFeedbackCard';
import LiveCodeEvaluator from '../components/LiveCodeEvaluator';
import SessionHistory from '../components/SessionHistory';
import IntegrationGuide from '../components/IntegrationGuide';

const sampleCodeJava = `public class TwoSum {
    public int[] solveTwoSum(int[] nums, int target) {
        // Linear scan using HashMap for O(N) lookup
        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        int x = 99; // Unused magic constant
        return new int[0];
    }
}`;

const mockAssessmentData = {
  assessmentId: "eval_904",
  sessionId: "sess_104",
  candidateId: "cand_001",
  problemTitle: "Two Sum - Hash Map Lookup",
  programmingLanguage: "Java",
  overallScore: 96.0,
  testCasesPassed: 18,
  totalTestCases: 18,
  timeComplexityEstimate: "O(N)",
  spaceComplexityEstimate: "O(N)",
  cyclomaticComplexity: 3,
  
  factorScores: [
    { factorName: "Code Correctness", score: 100.0, weight: "30%", status: "Excellent", observation: "18/18 test cases passed with zero execution exceptions." },
    { factorName: "Time Efficiency", score: 95.0, weight: "20%", status: "Excellent", observation: "Optimal O(N) hash table lookup avoids nested brute force loops." },
    { factorName: "Space Efficiency", score: 85.0, weight: "15%", status: "Good", observation: "O(N) auxiliary space footprint for storing element indices." },
    { factorName: "Readability Score", score: 94.0, weight: "15%", status: "Excellent", observation: "Clean comments and logical control flow decomposition." },
    { factorName: "Naming Conventions", score: 92.0, weight: "10%", status: "Excellent", observation: "Proper camelCase variables with descriptive names like 'complement'." },
    { factorName: "Code Modularity", score: 95.0, weight: "10%", status: "Excellent", observation: "Single responsibility function with focused return signature." }
  ],
  
  detectedCodeSmells: [
    { lineNumber: 11, severity: "INFO", smellType: "UnusedVariable", description: "Unused local variable 'x' declared.", recommendation: "Remove unused local variable declaration to maintain clean code." }
  ],
  
  summaryVerdict: "Exceptional solution! The algorithm achieves optimal O(N) time complexity using a HashMap lookup strategy, passing 100% of functional test cases with high readability.",
  keyStrengths: [
    "Used HashMap to achieve single-pass O(N) time efficiency instead of O(N^2) brute force.",
    "Well-structured variable names ('complement', 'target') enhancing code clarity.",
    "Comprehensive coverage of edge cases including duplicate values."
  ],
  areaForImprovement: [
    "Remove dead code (unused local variable 'x' on line 11).",
    "Consider pre-sizing HashMap initial capacity when array size is known."
  ],
  refactoredCodeSnippet: `public int[] solveTwoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>(nums.length);
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`,
  recommendedTopics: [
    "Sliding Window Technique for Array Subsegments",
    "HashMap Load Factor & Collision Handling",
    "Two-Pointer Approaches for Sorted Input Arrays"
  ]
};

const mockInterviewHistory = [
  { id: "sess_101", date: "2026-07-20", title: "Two Sum & Brute Force", language: "Java", score: 78.5, timeComp: "O(N^2)", testPass: "10/10" },
  { id: "sess_102", date: "2026-07-23", title: "LRU Cache Implementation", language: "Java", score: 84.0, timeComp: "O(1)", testPass: "12/12" },
  { id: "sess_103", date: "2026-07-27", title: "Binary Tree Level Order Traversal", language: "Python", score: 91.2, timeComp: "O(N)", testPass: "15/15" },
  { id: "sess_104", date: "2026-08-05", title: "Longest Palindromic Substring", language: "Java", score: 96.0, timeComp: "O(N^2)", testPass: "18/18" },
  { id: "sess_105", date: "2026-08-08", title: "Merge K Sorted Lists", language: "C++", score: 94.5, timeComp: "O(N log K)", testPass: "20/20" }
];

export default function AssessmentDashboardPage() {
  const [activeTab, setActiveTab] = useState<'evaluator' | 'analytics' | 'history' | 'integration'>('evaluator');
  const [currentAssessment, setCurrentAssessment] = useState<any>(mockAssessmentData);
  const [currentCode, setCurrentCode] = useState<string>(sampleCodeJava);
  const [history] = useState<any[]>(mockInterviewHistory);

  const handleEvaluationComplete = (newAssessment: any) => {
    setCurrentAssessment(newAssessment);
    if (newAssessment.refactoredCodeSnippet) {
      setCurrentCode(newAssessment.refactoredCodeSnippet);
    }
    setActiveTab('evaluator');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Application Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-brand-cyan/20 border border-brand-cyan text-brand-cyan">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-wide text-zinc-100 uppercase">
              Multi-Factor Coding Assessment Dashboard
            </h1>
            <p className="text-xs font-mono text-zinc-400">
              Member 3 Assessment Engine • Multi-Dimensional Technical Proficiency Analytics
            </p>
          </div>
        </div>

        <div className="border border-border bg-background-panel px-4 py-2 rounded-full flex items-center space-x-4">
          <div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Candidate</span>
            <span className="text-xs font-bold text-zinc-200">Vigneshwaran S P</span>
          </div>
          <div className="h-6 w-[1px] bg-zinc-800" />
          <div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Readiness</span>
            <span className="text-sm font-extrabold text-brand-cyan">96%</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-zinc-800 pb-2 overflow-x-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab('evaluator')}
          className={`px-4 py-2.5 rounded border transition flex items-center gap-2 ${
            activeTab === 'evaluator'
              ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
          }`}
        >
          <Code size={15} /> Live Evaluator & Code Analysis
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded border transition flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
          }`}
        >
          <BarChart3 size={15} /> Multi-Factor Analytics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded border transition flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
          }`}
        >
          <History size={15} /> Session History & PDF Exports
        </button>
        <button
          onClick={() => setActiveTab('integration')}
          className={`px-4 py-2.5 rounded border transition flex items-center gap-2 ${
            activeTab === 'integration'
              ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
          }`}
        >
          <Network size={15} /> API Integration Hub
        </button>
      </div>

      {/* Tab 1: Live Evaluator & Code Analysis */}
      {activeTab === 'evaluator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 border border-brand-cyan/30 bg-brand-cyan/5 rounded">
              <span className="text-[10px] text-zinc-400 uppercase">Overall Score</span>
              <p className="text-2xl font-bold text-brand-cyan mt-1">{currentAssessment.overallScore}%</p>
              <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Pass Rate 100%</span>
            </div>
            <div className="p-4 border border-brand-violet/30 bg-brand-violet/5 rounded">
              <span className="text-[10px] text-zinc-400 uppercase">Time Complexity</span>
              <p className="text-xl font-bold text-brand-violet mt-1">{currentAssessment.timeComplexityEstimate}</p>
              <span className="text-[9px] text-zinc-400 mt-1 block">Optimal Lookup</span>
            </div>
            <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded">
              <span className="text-[10px] text-zinc-400 uppercase">Space Complexity</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{currentAssessment.spaceComplexityEstimate}</p>
              <span className="text-[9px] text-zinc-400 mt-1 block">Auxiliary Hash Memory</span>
            </div>
            <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded">
              <span className="text-[10px] text-zinc-400 uppercase">Test Cases Passed</span>
              <p className="text-xl font-bold text-amber-400 mt-1">{currentAssessment.testCasesPassed} / {currentAssessment.totalTestCases}</p>
              <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Zero Exceptions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LiveCodeEvaluator onEvaluateComplete={handleEvaluationComplete} />
            <div className="border border-border bg-background-panel rounded p-6">
              <h3 className="text-sm font-mono font-bold text-brand-cyan mb-4 uppercase">
                Multi-Factor Assessment Breakdown Radar
              </h3>
              <RadarChart factorScores={currentAssessment.factorScores} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeQualityInspector
              code={currentCode}
              codeSmells={currentAssessment.detectedCodeSmells}
              cyclomaticComplexity={currentAssessment.cyclomaticComplexity}
            />
            <AiFeedbackCard assessment={currentAssessment} />
          </div>
        </div>
      )}

      {/* Tab 2: Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-border bg-background-panel rounded p-6">
              <h3 className="text-sm font-mono font-bold text-emerald-400 mb-2 uppercase">
                Interview Proficiency Score Trajectory
              </h3>
              <p className="text-xs text-zinc-400 mb-4 font-mono">Scores across sequential mock interview sessions.</p>
              <ProgressChart history={history} />
            </div>

            <div className="border border-border bg-background-panel rounded p-6">
              <h3 className="text-sm font-mono font-bold text-brand-cyan mb-2 uppercase">
                Programming Language Proficiency Breakdown
              </h3>
              <p className="text-xs text-zinc-400 mb-4 font-mono">Performance comparison across Java, Python, and C++.</p>
              <LanguageBreakdownChart />
            </div>
          </div>

          <div className="border border-border bg-background-panel rounded p-6 font-mono">
            <h3 className="text-sm font-bold text-zinc-200 uppercase mb-4">
              Multi-Factor Dimension Weights Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentAssessment.factorScores.map((factor: any, idx: number) => (
                <div key={idx} className="p-4 border border-border bg-background rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-zinc-200 text-xs">{factor.factorName}</span>
                    <span className="text-[10px] text-zinc-500">{factor.weight}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-extrabold text-brand-cyan">{factor.score}%</span>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      {factor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: History & Export */}
      {activeTab === 'history' && (
        <SessionHistory history={history} onSelectSession={() => setActiveTab('evaluator')} />
      )}

      {/* Tab 4: Integration Hub */}
      {activeTab === 'integration' && (
        <IntegrationGuide />
      )}
    </div>
  );
}
