import React, { useState, useEffect } from 'react';
import { Flame, ShieldCheck } from 'lucide-react';
import { getStreakData, type StreakData } from '../lib/streakService';

interface StreakBadgeProps {
  onClick?: () => void;
  compact?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ onClick, compact = false }) => {
  const [streakData, setStreakData] = useState<StreakData>(getStreakData);

  useEffect(() => {
    const handleUpdate = () => {
      setStreakData(getStreakData());
    };

    window.addEventListener('kodexis_streak_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kodexis_streak_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const { currentStreak, todayCompleted } = streakData;

  if (compact) {
    return (
      <button
        onClick={onClick}
        title={`Daily Practice Streak: ${currentStreak} Days (${todayCompleted ? 'Active Today' : 'Practice Pending'})`}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 font-mono text-xs ${
          todayCompleted
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-amber-300 hover:border-amber-500/40'
        }`}
      >
        <Flame
          size={14}
          className={`${todayCompleted ? 'text-amber-400 animate-pulse fill-amber-400/20' : 'text-zinc-500'}`}
        />
        <span className="font-bold">{currentStreak}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full p-2.5 rounded-lg border transition-all duration-300 flex items-center justify-between text-left group ${
        todayCompleted
          ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
          : 'bg-background border-border hover:border-amber-500/40 hover:bg-background-elevated'
      }`}
    >
      <div className="flex items-center space-x-2.5">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
            todayCompleted
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          }`}
        >
          <Flame size={18} className={todayCompleted ? 'fill-zinc-950/20 animate-pulse' : ''} />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-mono font-bold text-zinc-100 group-hover:text-amber-400 transition">
              {currentStreak} DAY STREAK
            </span>
            {todayCompleted && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <p className="text-[9px] font-mono text-zinc-400">
            {todayCompleted ? 'Goal active today • Tap stats' : 'Practice today to maintain!'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {streakData.freezeCount > 0 && (
          <span title="Streak Freeze Shield Equipped" className="text-cyan-400">
            <ShieldCheck size={14} />
          </span>
        )}
      </div>
    </button>
  );
};
