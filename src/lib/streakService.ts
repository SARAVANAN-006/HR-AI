// KODEXIS Daily Practice Streak Engine & Telemetry Service

export interface DayProgress {
  dayName: string;   // 'Mon', 'Tue', etc.
  dateStr: string;   // 'YYYY-MM-DD'
  active: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  todayCompleted: boolean;
  freezeCount: number;
  totalActiveDays: number;
  weeklyProgress: DayProgress[];
  historyDates: string[]; // List of YYYY-MM-DD
  tier: 'Apprentice' | 'Dedicated' | 'Relentless' | 'Grandmaster' | 'Legend';
  nextMilestone: number;
  daysToNextMilestone: number;
  motivationalQuote: string;
}

const STORAGE_KEY = 'kodexis_user_streak';

// Helper to format date as YYYY-MM-DD in local time
export const formatDateStr = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate day difference (d1 - d2 in calendar days)
const getDaysDifference = (d1Str: string, d2Str: string): number => {
  const [y1, m1, day1] = d1Str.split('-').map(Number);
  const [y2, m2, day2] = d2Str.split('-').map(Number);
  const date1 = new Date(y1, m1 - 1, day1);
  const date2 = new Date(y2, m2 - 1, day2);
  const diffTime = date1.getTime() - date2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const getStreakTier = (streak: number): StreakData['tier'] => {
  if (streak >= 30) return 'Legend';
  if (streak >= 14) return 'Grandmaster';
  if (streak >= 7) return 'Relentless';
  if (streak >= 3) return 'Dedicated';
  return 'Apprentice';
};

const getNextMilestone = (streak: number): number => {
  const milestones = [3, 7, 14, 21, 30, 50, 100];
  for (const m of milestones) {
    if (streak < m) return m;
  }
  return streak + 10;
};

const MOTIVATIONAL_QUOTES = [
  "Consistency beats talent when talent isn't consistent.",
  "Top 1% engineering problem solvers practice every single day.",
  "Small daily code repetitions build world-class algorithmic reflexes.",
  "Your streak represents momentum. Guard it relentlessly.",
  "Every session brings you one step closer to your dream engineering offer."
];

// Generate 7-day Monday -> Sunday week structure for current date
const generateWeeklyProgress = (historyDatesSet: Set<string>, todayStr: string): DayProgress[] => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  // Convert so Monday = 0, Sunday = 6
  const monOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + monOffset);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const week: DayProgress[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const dateStr = formatDateStr(current);
    const isToday = dateStr === todayStr;
    const isFuture = dateStr > todayStr;
    const active = historyDatesSet.has(dateStr);

    week.push({
      dayName: dayNames[i],
      dateStr,
      active,
      isToday,
      isFuture
    });
  }

  return week;
};

// Initialize seed data for realistic candidate experience
const createDefaultStreak = (): StreakData => {
  const today = new Date();
  const todayStr = formatDateStr(today);
  
  // Seed past 6 days of activity (today active, yesterday, etc.)
  const pastDates: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    pastDates.push(formatDateStr(d));
  }

  const currentStreak = 6;
  const longestStreak = 14;
  const historySet = new Set(pastDates);
  const nextMilestone = getNextMilestone(currentStreak);

  return {
    currentStreak,
    longestStreak,
    lastActivityDate: todayStr,
    todayCompleted: true,
    freezeCount: 1,
    totalActiveDays: 24,
    weeklyProgress: generateWeeklyProgress(historySet, todayStr),
    historyDates: pastDates,
    tier: getStreakTier(currentStreak),
    nextMilestone,
    daysToNextMilestone: Math.max(0, nextMilestone - currentStreak),
    motivationalQuote: MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  };
};

export const getStreakData = (): StreakData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const todayStr = formatDateStr(new Date());

    if (!raw) {
      const initial = createDefaultStreak();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const data: StreakData = JSON.parse(raw);
    const daysSince = getDaysDifference(todayStr, data.lastActivityDate);
    const historySet = new Set(data.historyDates || []);

    let currentStreak = data.currentStreak;
    let freezeCount = data.freezeCount ?? 1;
    let todayCompleted = data.lastActivityDate === todayStr;

    // Evaluate streak validity
    if (daysSince === 0) {
      // Practiced today
      todayCompleted = true;
    } else if (daysSince === 1) {
      // Practiced yesterday, awaiting today's practice
      todayCompleted = false;
    } else if (daysSince === 2 && freezeCount > 0) {
      // Missed 1 day, protect with streak freeze!
      freezeCount -= 1;
      todayCompleted = false;
      console.log('KODEXIS: Streak freeze shield consumed to protect active streak!');
    } else if (daysSince > 1) {
      // Streak broken
      currentStreak = 0;
      todayCompleted = false;
    }

    const nextMilestone = getNextMilestone(currentStreak);

    const updated: StreakData = {
      ...data,
      currentStreak,
      todayCompleted,
      freezeCount,
      weeklyProgress: generateWeeklyProgress(historySet, todayStr),
      tier: getStreakTier(currentStreak),
      nextMilestone,
      daysToNextMilestone: Math.max(0, nextMilestone - currentStreak),
      motivationalQuote: data.motivationalQuote || MOTIVATIONAL_QUOTES[0]
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error fetching streak data:', err);
    return createDefaultStreak();
  }
};

export const recordStreakActivity = (activityNote?: string): StreakData => {
  try {
    const current = getStreakData();
    const todayStr = formatDateStr(new Date());

    if (current.lastActivityDate === todayStr && current.todayCompleted) {
      // Already recorded for today
      return current;
    }

    const daysSince = getDaysDifference(todayStr, current.lastActivityDate);
    let newStreak = current.currentStreak;

    if (daysSince === 1 || newStreak === 0) {
      newStreak += 1;
    } else if (daysSince === 0) {
      // Same day first check-in
      newStreak = Math.max(1, newStreak);
    } else {
      // Gap
      newStreak = 1;
    }

    const newLongest = Math.max(current.longestStreak, newStreak);
    const historySet = new Set(current.historyDates);
    historySet.add(todayStr);
    const historyDates = Array.from(historySet).sort().reverse();
    const nextMilestone = getNextMilestone(newStreak);

    const updated: StreakData = {
      ...current,
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActivityDate: todayStr,
      todayCompleted: true,
      totalActiveDays: current.totalActiveDays + (current.todayCompleted ? 0 : 1),
      weeklyProgress: generateWeeklyProgress(historySet, todayStr),
      historyDates,
      tier: getStreakTier(newStreak),
      nextMilestone,
      daysToNextMilestone: Math.max(0, nextMilestone - newStreak),
      motivationalQuote: MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('kodexis_streak_updated', { detail: { streak: newStreak, note: activityNote } }));
    return updated;
  } catch (err) {
    console.error('Error recording streak activity:', err);
    return getStreakData();
  }
};
