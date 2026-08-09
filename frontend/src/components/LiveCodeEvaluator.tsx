import React, { useState } from 'react';
import { Play, Sparkles, Terminal } from 'lucide-react';

interface LiveCodeEvaluatorProps {
  onEvaluateComplete: (evaluation: any, code: string) => void;
}

const LiveCodeEvaluator: React.FC<LiveCodeEvaluatorProps> = ({ onEvaluateComplete }) => {
  const [code, setCode] = useState<string>(
`// Paste any draft code here for immediate feedback...
public int[] solveTwoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`
  );
  const [evaluating, setEvaluating] = useState(false);

  const handleEvaluate = () => {
    setEvaluating(true);
    setTimeout(() => {
      const mockResult = {
        cyclomaticComplexity: 2,
        detectedCodeSmells: [],
        summaryVerdict: "Clean code structure. Successfully compiled local AST representation. No variables are left unused.",
        keyStrengths: ["Optimal memory allocation.", "Linear traversal complexity."],
        areaForImprovement: ["Consider null-checks on inputs."],
        factorScores: [
          { factorName: "Code Correctness", score: 100.0, weight: "30%", status: "Excellent", observation: "Dry run passed successfully." },
          { factorName: "Time Efficiency", score: 95.0, weight: "20%", status: "Excellent", observation: "Optimal lookup runtime." },
          { factorName: "Space Efficiency", score: 90.0, weight: "15%", status: "Excellent", observation: "Auxiliary hash footprint." },
          { factorName: "Readability Score", score: 90.0, weight: "15%", status: "Excellent", observation: "Proper spacing." },
          { factorName: "Naming Conventions", score: 95.0, weight: "10%", status: "Excellent", observation: "camelCase formatting." },
          { factorName: "Code Modularity", score: 90.0, weight: "10%", status: "Excellent", observation: "Single traversal method." }
        ]
      };
      onEvaluateComplete(mockResult, code);
      setEvaluating(false);
    }, 1500);
  };

  return (
    <div className="border border-border bg-background-panel rounded p-6 font-mono space-y-4 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-cyan animate-pulse" />
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <Terminal size={14} className="text-brand-cyan" />
          <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono">Live Code Evaluator</h3>
        </div>
        <span className="text-[9px] text-zinc-500 uppercase">LOCAL COMPILER SANDBOX</span>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-48 bg-zinc-950/80 border border-border/40 rounded p-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-brand-cyan/60 resize-none leading-relaxed select-text"
      />

      <button
        onClick={handleEvaluate}
        disabled={evaluating}
        className="w-full flex items-center justify-center space-x-2 py-2.5 rounded bg-brand-cyan text-background font-bold text-xs hover:bg-brand-cyan/95 transition duration-200 disabled:opacity-50"
      >
        {evaluating ? (
          <>
            <Sparkles size={12} className="animate-spin" />
            <span>RUNNING AST TELEMETRY STATIC CHECK...</span>
          </>
        ) : (
          <>
            <Play size={12} fill="currentColor" />
            <span>EVALUATE DRAFT CODE</span>
          </>
        )}
      </button>
    </div>
  );
};

export default LiveCodeEvaluator;
