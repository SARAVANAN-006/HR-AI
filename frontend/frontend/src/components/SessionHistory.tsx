import React from 'react';
import { ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  date: string;
  title: string;
  language: string;
  score: number;
  timeComp: string;
  testPass: string;
}

interface SessionHistoryProps {
  history: HistoryItem[];
  onSelectSession: (session: HistoryItem) => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ history, onSelectSession }) => {
  return (
    <div className="border border-border bg-background-panel rounded p-6 font-mono space-y-4 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-cyan" />
      <div className="border-b border-border/40 pb-3 flex justify-between items-center">
        <h3 className="text-xs font-bold text-zinc-200 uppercase">Assessment Session Archive</h3>
        <span className="text-[10px] text-zinc-500">{history.length} Session records</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/30 text-zinc-500 text-[10px] uppercase">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Interview Challenge</th>
              <th className="py-2.5 px-3">Language</th>
              <th className="py-2.5 px-3 text-right">Readiness Index</th>
              <th className="py-2.5 px-3 text-center">Complexity</th>
              <th className="py-2.5 px-3 text-center">Test cases</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 text-zinc-300">
            {history.map((sess) => (
              <tr key={sess.id} className="hover:bg-brand-cyan/5 transition duration-150 group">
                <td className="py-3 px-3 text-zinc-500">{sess.date}</td>
                <td className="py-3 px-3 font-semibold text-zinc-100">{sess.title}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded border border-brand-violet/20 bg-brand-violet/5 text-brand-violet text-[10px] uppercase font-bold">
                    {sess.language}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-brand-cyan">{sess.score}%</td>
                <td className="py-3 px-3 text-center text-zinc-400">{sess.timeComp}</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">{sess.testPass}</td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onSelectSession(sess)}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan hover:text-background text-[10px] font-bold transition duration-200 uppercase"
                  >
                    <span>Load telemetry</span>
                    <ChevronRight size={10} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionHistory;
