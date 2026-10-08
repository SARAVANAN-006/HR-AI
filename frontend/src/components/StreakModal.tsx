import React, { useState, useEffect } from 'react';
import { X, Flame, Shield, Award, Clock, Sparkles, Calendar } from 'lucide-react';
import { getStreakData, recordStreakActivity, type StreakData } from '../lib/streakService';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose }) => {
  const [streakData, setStreakData] = useState<StreakData>(getStreakData);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStreakData(getStreakData());
      setJustCheckedIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckIn = () => {
    const updated = recordStreakActivity("Candidate checked in via Streak Console");
    setStreakData(updated);
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3000);
  };

  const progressPercent = Math.min(
    100,
    Math.round((streakData.currentStreak / (streakData.nextMilestone || 7)) * 100)
  );

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div 
        className="w-full max-w-xl bg-background-panel border border-border shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh] rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-background shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <Flame size={22} className="fill-zinc-950/20 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2 font-mono">
                PRACTICE STREAK & CONSISTENCY HUB
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 uppercase tracking-wider font-semibold">
                  {streakData.tier} Tier
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Daily algorithmic momentum tracked for premier engineering interviews.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* HERO FLAME DISPLAY */}
          <div className="p-6 rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent text-center relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-zinc-950 shadow-[0_0_40px_rgba(245,158,11,0.4)] mb-3">
              <Flame size={44} className="fill-zinc-950/20" />
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-5xl font-black font-mono text-zinc-100 tracking-tight">
                  {streakData.currentStreak}
                </span>
                <span className="text-lg font-mono font-bold text-amber-400">
                  DAYS IN A ROW
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto">
                {streakData.todayCompleted
                  ? '🔥 You have already logged practice today! Streak safe.'
                  : '⚠️ Practice pending for today. Solve a problem or check in to keep it blazing!'}
              </p>
            </div>

            {/* Check in button */}
            {!streakData.todayCompleted && (
              <div className="mt-4">
                <button
                  onClick={handleCheckIn}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] transition transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  ⚡ Check-In & Extend Streak Today
                </button>
              </div>
            )}

            {justCheckedIn && (
              <div className="mt-3 text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5 animate-bounce">
                <Sparkles size={14} />
                <span>Streak successfully preserved for today!</span>
              </div>
            )}
          </div>

          {/* 7-DAY WEEKLY TRACKER */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-zinc-300 flex items-center gap-1.5 uppercase">
                <Calendar size={13} className="text-brand-cyan" />
                This Week's Consistency
              </span>
              <span className="text-[10px] text-zinc-400">
                {streakData.weeklyProgress.filter(d => d.active).length} / 7 Days Active
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {streakData.weeklyProgress.map((day) => {
                return (
                  <div
                    key={day.dateStr}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                      day.active
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.12)]'
                        : day.isToday
                        ? 'bg-zinc-800/80 border-brand-cyan/60 text-brand-cyan'
                        : 'bg-background border-border text-zinc-500'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold block mb-1">
                      {day.dayName}
                    </span>
                    <div className="w-6 h-6 flex items-center justify-center">
                      {day.active ? (
                        <Flame size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
                      ) : day.isToday ? (
                        <Clock size={14} className="text-brand-cyan" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                      )}
                    </div>
                    <span className="text-[8px] font-mono mt-1 opacity-70">
                      {day.dateStr.slice(8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MILESTONE PROGRESS BAR */}
          <div className="p-4 rounded-xl border border-border bg-background space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                <Award size={14} className="text-brand-violet" />
                Next Milestone: {streakData.nextMilestone}-Day Club
              </span>
              <span className="text-brand-cyan font-semibold text-[11px]">
                {streakData.daysToNextMilestone} days away ({progressPercent}%)
              </span>
            </div>
            
            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-brand-cyan transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-zinc-500">
              Unlocks executive readiness badge on your candidate autopsy telemetry.
            </p>
          </div>

          {/* TELEMETRY METRICS 3-GRID */}
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3.5 rounded-xl border border-border bg-background">
              <span className="text-[9px] text-zinc-500 uppercase block mb-1">Personal Record</span>
              <span className="text-lg font-bold text-zinc-200">{streakData.longestStreak}d</span>
              <span className="text-[8px] text-zinc-500 block mt-0.5">All-time best</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background">
              <span className="text-[9px] text-zinc-500 uppercase block mb-1">Streak Shield</span>
              <div className="flex items-center justify-center gap-1">
                <Shield size={14} className="text-cyan-400" />
                <span className="text-lg font-bold text-cyan-400">{streakData.freezeCount}</span>
              </div>
              <span className="text-[8px] text-zinc-500 block mt-0.5">Miss protection</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background">
              <span className="text-[9px] text-zinc-500 uppercase block mb-1">Total Active</span>
              <span className="text-lg font-bold text-brand-emerald">{streakData.totalActiveDays}</span>
              <span className="text-[8px] text-zinc-500 block mt-0.5">Sessions logged</span>
            </div>
          </div>

          {/* MOTIVATIONAL QUOTE */}
          <div className="p-3.5 rounded-xl border border-border bg-background-elevated text-center">
            <p className="text-xs text-zinc-400 italic">
              "{streakData.motivationalQuote}"
            </p>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-border flex justify-end bg-background shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
