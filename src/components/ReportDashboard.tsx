import React, { useState, useEffect } from 'react';
import { AppState, DailyLog } from '../types';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Trophy, 
  BookOpen, 
  CheckCircle, 
  CalendarRange, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  CheckSquare, 
  BookMarked,
  X,
  Plus,
  Compass,
  Zap,
  TrendingUp,
  Smile,
  Award,
  Lock,
  Gift
} from 'lucide-react';
import { D3BarChart, D3LineChart } from './D3Charts';

interface ReportDashboardProps {
  state: AppState;
  language: 'bn' | 'en';
  onUpdateAchievements?: (badges: string[]) => void;
}

export default function ReportDashboard({ state, language, onUpdateAchievements }: ReportDashboardProps) {
  // Extract last 7 calendar days to plot chronologically (used by original weekly charts)
  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    last7Days.push(dateStr);
  }

  // Helper translations
  const t = (bnText: string, enText: string) => (language === 'bn' ? bnText : enText);

  // Keep track of currently viewable month and year for our Monthly Streak Grid
  const todayDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(todayDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(todayDate.getMonth()); // 0-11
  
  // Custom Filters for the visual calendar
  const [selectedHabitFilter, setSelectedHabitFilter] = useState<string>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  
  // Selected Day deep-dive card toggling
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  // Helper to format Date target
  const getDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // ----------------------------------------------------
  // ROBUST STREAK CALCULATING SYSTEMS
  // ----------------------------------------------------
  
  // Calculate Habit Streak (Days with compiled habits)
  const calculateHabitStreak = () => {
    let currentStreak = 0;
    const sortedDates = Object.keys(state.history).sort();
    if (sortedDates.length === 0) return { current: 0, best: 0 };

    let checkDate = new Date();
    let todayStr = getDateString(checkDate);
    
    const todayLog = state.history[todayStr];
    let todayQualifies = false;
    if (todayLog && todayLog.habits) {
      todayQualifies = Object.values(todayLog.habits).some(v => v === true);
    }
    
    if (!todayQualifies) {
      // Check if yesterday had completed habits to continue the chain
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = getDateString(checkDate);
      const yesterdayLog = state.history[yesterdayStr];
      const yesterdayQualifies = yesterdayLog && yesterdayLog.habits && Object.values(yesterdayLog.habits).some(v => v === true);
      
      if (yesterdayQualifies) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const dStr = getDateString(checkDate);
          const log = state.history[dStr];
          const qualifies = log && log.habits && Object.values(log.habits).some(v => v === true);
          if (qualifies) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    } else {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const dStr = getDateString(checkDate);
        const log = state.history[dStr];
        const qualifies = log && log.habits && Object.values(log.habits).some(v => v === true);
        if (qualifies) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Best Streak
    let best = 0;
    let temp = 0;
    const start = new Date(sortedDates[0]);
    const end = new Date();
    
    // Safety limit of 1000 days lookup
    const limit = new Date(start);
    limit.setDate(limit.getDate() + 1000);
    const actualEnd = end > limit ? limit : end;

    for (let d = new Date(start); d <= actualEnd; d.setDate(d.getDate() + 1)) {
      const dStr = getDateString(d);
      const log = state.history[dStr];
      const qualifies = log && log.habits && Object.values(log.habits).some(v => v === true);
      if (qualifies) {
        temp++;
        if (temp > best) best = temp;
      } else {
        temp = 0;
      }
    }

    return { current: currentStreak, best: Math.max(best, currentStreak) };
  };

  // Calculate Study Streak (Days studied > 0 mins)
  const calculateStudyStreak = () => {
    let currentStreak = 0;
    const sortedDates = Object.keys(state.history).sort();
    if (sortedDates.length === 0) return { current: 0, best: 0 };

    let checkDate = new Date();
    let todayStr = getDateString(checkDate);
    
    const todayLog = state.history[todayStr];
    let todayQualifies = false;
    if (todayLog && todayLog.study) {
      todayQualifies = Object.values(todayLog.study).some(s => s > 0);
    }
    
    if (!todayQualifies) {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = getDateString(checkDate);
      const yesterdayLog = state.history[yesterdayStr];
      const yesterdayQualifies = yesterdayLog && yesterdayLog.study && Object.values(yesterdayLog.study).some(s => s > 0);
      
      if (yesterdayQualifies) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const dStr = getDateString(checkDate);
          const log = state.history[dStr];
          const qualifies = log && log.study && Object.values(log.study).some(s => s > 0);
          if (qualifies) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    } else {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const dStr = getDateString(checkDate);
        const log = state.history[dStr];
        const qualifies = log && log.study && Object.values(log.study).some(s => s > 0);
        if (qualifies) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Best Streak
    let best = 0;
    let temp = 0;
    const start = new Date(sortedDates[0]);
    const end = new Date();
    
    const limit = new Date(start);
    limit.setDate(limit.getDate() + 1000);
    const actualEnd = end > limit ? limit : end;

    for (let d = new Date(start); d <= actualEnd; d.setDate(d.getDate() + 1)) {
      const dStr = getDateString(d);
      const log = state.history[dStr];
      const qualifies = log && log.study && Object.values(log.study).some(s => s > 0);
      if (qualifies) {
        temp++;
        if (temp > best) best = temp;
      } else {
        temp = 0;
      }
    }

    return { current: currentStreak, best: Math.max(best, currentStreak) };
  };

  const habitStreaks = calculateHabitStreak();
  const studyStreaks = calculateStudyStreak();

  // ----------------------------------------------------
  // SELECTED MONTH DETAILS & DAYS ASSEMBLY
  // ----------------------------------------------------
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const monthFirstDayIdx = new Date(selectedYear, selectedMonth, 1).getDay(); // first day offset

  const monthDates: { dateStr: string; dayNum: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    monthDates.push({ dateStr: dStr, dayNum: d });
  }

  // Monthly stats calculations
  let monthSecondsStudied = 0;
  let monthHabitsTracked = 0;
  let monthHabitsCompleted = 0;
  let monthDaysStudiedCount = 0;
  let monthDaysCompletedAllHabits = 0;

  monthDates.forEach(({ dateStr }) => {
    const log = state.history[dateStr];
    if (log) {
      // Study calculation
      if (log.study) {
        let subSecs = 0;
        Object.entries(log.study).forEach(([subName, secs]) => {
          if (selectedSubjectFilter === 'all' || subName === selectedSubjectFilter) {
            subSecs += secs;
          }
        });
        monthSecondsStudied += subSecs;
        if (subSecs > 0) monthDaysStudiedCount++;
      }

      // Habits calculation
      if (log.habits) {
        if (selectedHabitFilter === 'all') {
          // Track all habits
          state.habits.forEach((h) => {
            monthHabitsTracked++;
            if (log.habits[h.id] || log.habits[h.name]) {
              monthHabitsCompleted++;
            }
          });
          
          // Check if all habits for that day were done
          const dayTotal = state.habits.length;
          const dayDone = state.habits.filter(h => log.habits[h.id] || log.habits[h.name]).length;
          if (dayTotal > 0 && dayDone === dayTotal) {
            monthDaysCompletedAllHabits++;
          }
        } else {
          // Track specific habit only
          monthHabitsTracked++;
          const habitObj = state.habits.find(h => h.id === selectedHabitFilter);
          if (habitObj) {
            const isDone = log.habits[habitObj.id] || log.habits[habitObj.name];
            if (isDone) {
              monthHabitsCompleted++;
              monthDaysCompletedAllHabits++; // perfect for that single target
            }
          }
        }
      }
    }
  });

  const monthHabitCompletionRate = monthHabitsTracked > 0 
    ? Math.round((monthHabitsCompleted / monthHabitsTracked) * 100) 
    : 0;

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
    setSelectedDayStr(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
    setSelectedDayStr(null);
  };

  // ----------------------------------------------------
  // ORIGINAL ACCUMULATIVE CALCULATIONS (PRESERVED)
  // ----------------------------------------------------
  const subjectStudyHours = state.subjects.map((sub) => {
    let totalSeconds = 0;
    Object.values(state.history).forEach((dayLog) => {
      if (dayLog.study && dayLog.study[sub.name]) {
        totalSeconds += dayLog.study[sub.name];
      }
    });

    const hours = totalSeconds / 3600;
    return {
      name: sub.name,
      hours: parseFloat(hours.toFixed(2)),
      seconds: totalSeconds,
      targetMinutes: sub.target
    };
  });

  const maxSubject = [...subjectStudyHours].sort((a, b) => b.hours - a.hours)[0];

  const dailyStudyData = last7Days.map((dateStr) => {
    const dayLog = state.history[dateStr];
    let dailySecs = 0;
    if (dayLog && dayLog.study) {
      dailySecs = Object.values(dayLog.study).reduce((sum, s) => sum + s, 0);
    }
    const dateObj = new Date(dateStr);
    const dayName = dateObj.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' });
    const dayNum = dateStr.split('-')[2];

    return {
      dateLabel: `${dayName} (${dayNum})`,
      hours: parseFloat((dailySecs / 3600).toFixed(2)),
      seconds: dailySecs
    };
  });

  const maxDailyStudyHours = Math.max(...dailyStudyData.map((d) => d.hours), 1);

  const prayerCompletionData = last7Days.map((dateStr) => {
    const dayLog = state.history[dateStr];
    let completedWaqtsCount = 0;
    if (dayLog && dayLog.prayer) {
      Object.values(dayLog.prayer).forEach((status) => {
        if (status === 'জামাত' || status === 'ঘরে' || status === 'jamaat' || status === 'home') {
          completedWaqtsCount++;
        }
      });
    }

    const percentage = (completedWaqtsCount / 5) * 100;
    const dateObj = new Date(dateStr);
    const dayNum = dateStr.split('-')[2];

    return {
      dayNum,
      percentage
    };
  });

  let totalHabitsTracked = 0;
  let totalHabitsCompleted = 0;
  Object.values(state.history).forEach((dayLog) => {
    if (dayLog.habits) {
      Object.keys(dayLog.habits).forEach((id) => {
        totalHabitsTracked++;
        if (dayLog.habits[id]) totalHabitsCompleted++;
      });
    }
  });

  const habitFidelity = totalHabitsTracked > 0 ? Math.round((totalHabitsCompleted / totalHabitsTracked) * 100) : 0;

  // ----------------------------------------------------
  // WEEKLY CALENDAR HEATMAP GENERATION (PAST 30 DAYS)
  // ----------------------------------------------------
  const getWeeklyCalendarHeatmap = () => {
    const thirtyDays = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const log = state.history[dateStr];
      
      let totalHabits = state.habits.length;
      let completedCount = 0;
      if (log && log.habits) {
        completedCount = state.habits.filter(h => log.habits[h.id] || log.habits[h.name]).length;
      }
      thirtyDays.push({
        dateStr,
        dayNum: d.getDate(),
        dayOfWeek: d.getDay(),
        month: d.getMonth(),
        completedCount,
        totalHabits,
        ratio: totalHabits > 0 ? completedCount / totalHabits : 0,
        percentage: totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0
      });
    }

    const weeksList: any[][] = [];
    let currentWeek: any[] = [];
    
    // Fill leading empty days in first week
    const firstDayOfWeek = thirtyDays[0].dayOfWeek;
    for (let j = 0; j < firstDayOfWeek; j++) {
      currentWeek.push(null);
    }

    thirtyDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksList.push(currentWeek);
    }

    return weeksList;
  };

  // ----------------------------------------------------
  // ACHIEVEMENTS / MILESTONE BADGES SYSTEM
  // ----------------------------------------------------
  
  // Calculate total study hours across all history
  let totalCumulativeStudySeconds = 0;
  Object.values(state.history).forEach((dayLog) => {
    if (dayLog.study) {
      Object.values(dayLog.study).forEach((val) => {
        totalCumulativeStudySeconds += val;
      });
    }
  });
  const totalCumulativeStudyHours = parseFloat((totalCumulativeStudySeconds / 3600).toFixed(2));

  // Determine if there has been any day with all 5 prayers completed
  let hasCompletedAll5PrayersDay = false;
  Object.values(state.history).forEach((dayLog) => {
    if (dayLog.prayer) {
      let dailyDone = 0;
      Object.values(dayLog.prayer).forEach((status) => {
        if (status === 'জামাত' || status === 'ঘরে' || status === 'jamaat' || status === 'home') {
          dailyDone++;
        }
      });
      if (dailyDone === 5) {
        hasCompletedAll5PrayersDay = true;
      }
    }
  });

  // Calculate self-reflections count
  const totalReflectionsCount = state.reflections ? state.reflections.length : 0;

  // Define Achievements definition list
  interface AchievementDefinition {
    id: string;
    titleBn: string;
    titleEn: string;
    descBn: string;
    descEn: string;
    icon: React.ElementType;
    colorClass: string; // Theme styling colors
    glowClass: string;
    metricValue: number | boolean;
    threshold: number | boolean;
    unitBn: string;
    unitEn: string;
  }

  const achievementsList: AchievementDefinition[] = [
    {
      id: 'ach-first-step',
      titleBn: 'প্রথম পদক্ষেপ',
      titleEn: 'First Step',
      descBn: 'প্রথম কোনো সুঅভ্যাস বা ফোকাস স্টাডি সেশন সম্পন্ন করুন।',
      descEn: 'Complete your first daily habit checklist or focused study session.',
      icon: Sparkles,
      colorClass: 'emerald',
      glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.4)] border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      metricValue: totalCumulativeStudyHours > 0 || totalHabitsCompleted > 0,
      threshold: true,
      unitBn: '',
      unitEn: ''
    },
    {
      id: 'ach-habit-streak-3',
      titleBn: 'অভ্যাসের সূচনা',
      titleEn: 'Habit Starter',
      descBn: 'টানা ৩ দিনের চমৎকার হ্যাবিট স্ট্রাক বা ধারাবাহিকতা অর্জন করুন।',
      descEn: 'Form a solid routine with a consistent 3-day habit streak.',
      icon: Flame,
      colorClass: 'orange',
      glowClass: 'shadow-[0_0_12px_rgba(249,115,22,0.4)] border-orange-500/40 text-orange-400 bg-orange-950/20',
      metricValue: habitStreaks.best,
      threshold: 3,
      unitBn: 'দিন',
      unitEn: 'days'
    },
    {
      id: 'ach-habit-streak-7',
      titleBn: 'অভ্যাস মাস্টার',
      titleEn: 'Habit Master',
      descBn: 'টানা ৭ দিন টানা ভালো অভ্যাস বজায় রাখার মহান কৃতিত্ব অর্জন করুন!',
      descEn: 'Achieve iron-clad focus with a rigorous 7-day habit streak.',
      icon: Trophy,
      colorClass: 'amber',
      glowClass: 'shadow-[0_0_12px_rgba(245,158,11,0.4)] border-amber-500/40 text-amber-400 bg-amber-950/20',
      metricValue: habitStreaks.best,
      threshold: 7,
      unitBn: 'দিন',
      unitEn: 'days'
    },
    {
      id: 'ach-study-5h',
      titleBn: 'একাগ্র মন',
      titleEn: 'Focused Mind',
      descBn: 'মোট ৫ ঘণ্টা পড়াশোনার ফোকাস স্টাডি সেশন সম্পন্ন করুন।',
      descEn: 'Log a cumulative 5 hours of total active study and discipline time.',
      icon: BookOpen,
      colorClass: 'sky',
      glowClass: 'shadow-[0_0_12px_rgba(56,189,248,0.4)] border-sky-500/40 text-sky-400 bg-sky-950/20',
      metricValue: totalCumulativeStudyHours,
      threshold: 5,
      unitBn: 'ঘণ্টা',
      unitEn: 'hours'
    },
    {
      id: 'ach-study-20h',
      titleBn: 'মেধাবী যাত্রা',
      titleEn: 'Scholar Journey',
      descBn: 'মোট ২০ ঘণ্টা পড়াশোনা এবং আত্মউন্নয়ন ট্র্যাকিং কমপ্লিট করুন।',
      descEn: 'Log a cumulative 20 hours of focused study in your lifetime logs.',
      icon: BookMarked,
      colorClass: 'indigo',
      glowClass: 'shadow-[0_0_12px_rgba(99,102,241,0.4)] border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
      metricValue: totalCumulativeStudyHours,
      threshold: 20,
      unitBn: 'ঘণ্টা',
      unitEn: 'hours'
    },
    {
      id: 'ach-study-50h',
      titleBn: 'পরম সাধনা',
      titleEn: 'Ultimate Devotion',
      descBn: 'মোট ৫০ ঘণ্টা পড়াশোনার অবিশ্বাস্য বাউন্ডারি অর্জন করুন!',
      descEn: 'Master of study: Log a massive 50 hours of total cumulative focus.',
      icon: Award,
      colorClass: 'fuchsia',
      glowClass: 'shadow-[0_0_12px_rgba(217,70,239,0.4)] border-fuchsia-500/40 text-fuchsia-400 bg-fuchsia-950/20',
      metricValue: totalCumulativeStudyHours,
      threshold: 50,
      unitBn: 'ঘণ্টা',
      unitEn: 'hours'
    },
    {
      id: 'ach-prayer',
      titleBn: 'ধারাবাহিক সালাত',
      titleEn: 'Faithful Day',
      descBn: 'যেকোনো একটি দিনে ৫ ওয়াক্ত নামাজই জামাতে বা ঘরে আদায় করুন।',
      descEn: 'Log all 5 daily prayers on a single day (Jamaat/Home).',
      icon: Zap,
      colorClass: 'teal',
      glowClass: 'shadow-[0_0_12px_rgba(20,184,166,0.4)] border-teal-500/40 text-teal-400 bg-teal-950/20',
      metricValue: hasCompletedAll5PrayersDay,
      threshold: true,
      unitBn: '',
      unitEn: ''
    },
    {
      id: 'ach-reflection',
      titleBn: 'মানসিক প্রশান্তি',
      titleEn: 'Mental Clarity',
      descBn: 'কমপক্ষে ৩টি গভীর আত্মপর্যালোচনা বা রিফ্লেকশন নোট লিখুন।',
      descEn: 'Establish mindfulness by writing 3 separate self-reflection logs.',
      icon: Smile,
      colorClass: 'rose',
      glowClass: 'shadow-[0_0_12px_rgba(244,63,94,0.4)] border-rose-500/40 text-rose-400 bg-rose-950/20',
      metricValue: totalReflectionsCount,
      threshold: 3,
      unitBn: 'নোট',
      unitEn: 'logs'
    }
  ];

  // Auto-synchronize newly unlocked achievements inside app state on component render
  useEffect(() => {
    if (!onUpdateAchievements) return;

    // Check currently unlocked list based on real math metrics
    const currentUnlockedList: string[] = [];
    achievementsList.forEach((ach) => {
      let isUnlocked = false;
      if (typeof ach.threshold === 'boolean') {
        isUnlocked = !!ach.metricValue === ach.threshold;
      } else if (typeof ach.threshold === 'number') {
        isUnlocked = (ach.metricValue as number) >= ach.threshold;
      }
      if (isUnlocked) {
        currentUnlockedList.push(ach.id);
      }
    });

    const previouslySavedList = state.unlockedAchievements || [];
    
    // Evaluate if any changes needs saving (to avoid infinite react loops)
    const listsMatch = 
      currentUnlockedList.length === previouslySavedList.length &&
      currentUnlockedList.every(id => previouslySavedList.includes(id));

    if (!listsMatch) {
      onUpdateAchievements(currentUnlockedList);
    }
  }, [state.history, state.unlockedAchievements, state.reflections]);

  const currentlyUnlockedBadgesSet = new Set(state.unlockedAchievements || []);

  return (
    <div className="space-y-6">

      {/* ===================================================================
          HERO MODULE: MONTHLY STREAKS & PROGRESS GRID
          =================================================================== */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-2xl space-y-6">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
          <div>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2 font-sans">
              <CalendarRange className="w-5 h-5 text-amber-500 animate-pulse" />
              <span>{t('মাসিক অগ্রগতি ও হ্যাবিট স্ট্রাক', 'Monthly Progress & Habits Streak Grid')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t('আপনার দৈনিক পড়াশোনা ও অভ্যাসের ধারাবাহিকতার রিয়েল-টাইম গ্রিড ভিউ', 'Real-time grid visualizing your monthly training consistency & daily dedication')}
            </p>
          </div>

          {/* Month Navigator Controls */}
          <div className="flex items-center gap-2 justify-start md:justify-end shrink-0">
            <button 
              onClick={handlePrevMonth}
              className="p-1 px-[11px] rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition text-slate-300 pointer"
              title={t('পূর্ববর্তী মাস', 'Previous Month')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs font-black uppercase text-amber-400 tracking-wider font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800/80 min-w-[120px] text-center">
              {language === 'bn' ? monthNamesBn[selectedMonth] : monthNamesEn[selectedMonth]} {selectedYear}
            </div>
            <button 
              onClick={handleNextMonth}
              className="p-1 px-[11px] rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition text-slate-300 pointer"
              title={t('পরবর্তী মাস', 'Next Month')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- STREAK HERO BENTO SLOTS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          
          {/* Card 1: Habit Streak */}
          <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-amber-500/25 transition relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition" />
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold font-sans">
              <span>{t('হ্যাবিট স্ট্রাক', 'Habit Streak')}</span>
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black font-sans leading-none text-slate-100 flex items-baseline gap-1">
                <span>{habitStreaks.current}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t('দিন', 'DAYS')}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{t('সর্বোচ্চ:', 'Best:')} {habitStreaks.best} {t('দিন', 'days')}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Study Streak */}
          <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-blue-500/25 transition relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition" />
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold font-sans">
              <span>{t('স্টাডি স্ট্রাক', 'Study Streak')}</span>
              <BookMarked className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black font-sans leading-none text-slate-100 flex items-baseline gap-1">
                <span>{studyStreaks.current}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t('দিন', 'DAYS')}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{t('সর্বোচ্চ:', 'Best:')} {studyStreaks.best} {t('দিন', 'days')}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Monthly Study Hours */}
          <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-indigo-500/25 transition relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl transition" />
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold font-sans">
              <span>{t('মোট অধ্যয়ন সময়', 'Month Study')}</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-black font-sans leading-none text-slate-100">
                {Math.floor(monthSecondsStudied / 3600)}h {Math.floor((monthSecondsStudied % 3600) / 60)}m
              </div>
              <p className="text-[9px] text-slate-500 mt-1.5 truncate">
                {t('অধ্যয়ন সেশন করা হয়েছে:', 'Studied days:')} {monthDaysStudiedCount} {t('দিন', 'days')}
              </p>
            </div>
          </div>

          {/* Card 4: Month Habits Rate */}
          <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-emerald-500/25 transition relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl transition" />
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold font-sans">
              <span>{t('হ্যাবিট রেট', 'Habits Fidelity')}</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black font-sans leading-none text-slate-100">
                {monthHabitCompletionRate}%
              </div>
              <p className="text-[9px] text-slate-500 mt-1.5 truncate">
                {t('শতভাগ সাকসেস:', 'Perfect achievement:')} {monthDaysCompletedAllHabits} {t('দিন', 'days')}
              </p>
            </div>
          </div>

        </div>

        {/* --- DYNAMIC FILTER SYSTEM --- */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('ক্যালেন্ডার গ্রিড ফিল্টার করুন:', 'Filter Calendar Dashboard Grid:')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Habits filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold hidden sm:inline">{t('অভ্যাস:', 'Habit:')}</span>
              <select
                value={selectedHabitFilter}
                onChange={(e) => {
                  setSelectedHabitFilter(e.target.value);
                  setSelectedDayStr(null);
                }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-[11px] font-bold rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer max-w-[140px]"
              >
                <option value="all">{t('সব অভ্যাস (All Habits)', 'All Habits')}</option>
                {state.habits.map((h, i) => (
                  <option key={`h-${h.id || i}`} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            {/* Subject filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold hidden sm:inline">{t('বিষয়:', 'Subject:')}</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => {
                  setSelectedSubjectFilter(e.target.value);
                  setSelectedDayStr(null);
                }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-[11px] font-bold rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer max-w-[140px]"
              >
                <option value="all">{t('সব বিষয় (All Subjects)', 'All Subjects')}</option>
                {state.subjects.map((s, i) => (
                  <option key={`s-${s.id || s.name || i}`} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- THE MASTER CALENDAR GRID MATRIX --- */}
        <div className="space-y-4">
          
          {/* Day of week labels */}
          <div className="grid grid-cols-7 gap-1 md:gap-1.5 text-center">
            {(language === 'bn' ? dayNamesBn : dayNamesEn).map((dayName, idx) => (
              <span key={idx} className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-wider">
                {dayName}
              </span>
            ))}
          </div>

          {/* Calendar blocks */}
          <div className="grid grid-cols-7 gap-1 md:gap-1.5">
            {/* Empty Offset Spacers */}
            {Array.from({ length: monthFirstDayIdx }).map((_, idx) => (
              <div 
                key={`offset-${idx}`} 
                className="aspect-square bg-slate-950/20 border border-slate-900/30 rounded-xl opacity-25" 
              />
            ))}

            {/* Active Calendar Cells */}
            {monthDates.map(({ dateStr, dayNum }) => {
              const log = state.history[dateStr];
              
              // Habit completion rate inside cell
              let habitDonePct = 0;
              let dayTrackedCount = 0;
              let dayDoneCount = 0;
              
              if (log && log.habits) {
                if (selectedHabitFilter === 'all') {
                  dayTrackedCount = state.habits.length;
                  dayDoneCount = state.habits.filter(h => log.habits[h.id] || log.habits[h.name]).length;
                  habitDonePct = dayTrackedCount > 0 ? (dayDoneCount / dayTrackedCount) * 100 : 0;
                } else {
                  dayTrackedCount = 1;
                  const targetHabit = state.habits.find(h => h.id === selectedHabitFilter);
                  const isDone = targetHabit && (log.habits[targetHabit.id] || log.habits[targetHabit.name]);
                  dayDoneCount = isDone ? 1 : 0;
                  habitDonePct = isDone ? 100 : 0;
                }
              }

              // Study hours inside cell
              let studySecs = 0;
              if (log && log.study) {
                Object.entries(log.study).forEach(([subName, secs]) => {
                  if (selectedSubjectFilter === 'all' || subName === selectedSubjectFilter) {
                    studySecs += secs;
                  }
                });
              }
              const studyMins = studySecs / 60;
              const studyHrs = studySecs / 3600;

              // Color metrics & rings helper
              const isSelected = selectedDayStr === dateStr;
              
              // Study blue glow level
              let studyIntensityClass = "bg-transparent";
              if (studySecs > 0) {
                if (studyHrs >= 4) {
                  studyIntensityClass = "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
                } else if (studyHrs >= 2) {
                  studyIntensityClass = "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.3)]";
                } else {
                  studyIntensityClass = "bg-blue-600/70";
                }
              }

              return (
                <motion.button
                  key={dateStr}
                  onClick={() => setSelectedDayStr(isSelected ? null : dateStr)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square rounded-xl p-1 md:p-1.5 flex flex-col justify-between items-center relative cursor-pointer select-none transition-all duration-300 ${
                    isSelected 
                      ? 'bg-slate-800 border-2 border-amber-500' 
                      : 'bg-slate-950/60 border border-slate-900 hover:bg-slate-900/60 hover:border-slate-800'
                  }`}
                >
                  {/* Top segment: Day number & tiny status dot */}
                  <div className="flex w-full justify-between items-center">
                    <span className={`text-[10px] md:text-xs font-black font-mono leading-none ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                      {dayNum}
                    </span>
                    {/* Habit visual compact badge */}
                    {dayTrackedCount > 0 && (
                      <span 
                        className={`w-2 h-2 rounded-full ${
                          habitDonePct === 100 
                            ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' 
                            : dayDoneCount > 0 
                            ? 'bg-amber-500' 
                            : 'bg-red-500/60'
                        }`}
                        title={`${dayDoneCount}/${dayTrackedCount} habits done`}
                      />
                    )}
                  </div>

                  {/* Middle segment: micro feedback labels if enough room */}
                  <div className="w-full flex-1 flex items-center justify-center">
                    {studySecs > 0 && (
                      <span className="text-[7.5px] sm:text-[9px] font-black text-blue-400 font-mono">
                        {studyMins >= 60 ? `${studyHrs.toFixed(1)}h` : `${Math.round(studyMins)}m`}
                      </span>
                    )}
                  </div>

                  {/* Bottom segment: Custom miniature study session bar */}
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-0.5 shrink-0">
                    {studySecs > 0 && (
                      <div 
                        className={`h-full ${studyIntensityClass} rounded-full transition-all`} 
                        style={{ width: `${Math.min(100, (studyHrs / 4) * 100)}%` }}
                      />
                    )}
                  </div>

                  {/* Dynamic Tooltip helper inside grid cells */}
                  {isSelected && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rotate-45 z-10" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Calendar Indicators Legend */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] text-slate-500 font-bold border-t border-slate-900 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{t('শতভাগ অভ্যাস পূর্ণ', '100% Habits Done')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{t('অংশবিশেষ অভ্যাস সম্পন্ন', 'Some Habits Done')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1.5 rounded-full bg-blue-500" />
              <span>{t('স্টাডি সেশন সম্পন্ন', 'Studied Sessions')}</span>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC CALENDAR CELL DEEP DIVE SECTION --- */}
        {selectedDayStr && (() => {
          const log = state.history[selectedDayStr];
          const dateObj = new Date(selectedDayStr);
          const localizedDateStr = dateObj.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 bg-slate-950 rounded-2xl border border-amber-500/20 p-4 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <div>
                  <span className="text-[9px] text-amber-500 uppercase font-bold tracking-widest font-mono">
                    {t('চিহ্নিত দিনের বিশ্লেষণ', 'Selected Day Analysis')}
                  </span>
                  <h4 className="text-xs md:text-sm font-extrabold text-slate-100 mt-0.5">
                    {localizedDateStr}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedDayStr(null)}
                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Data Content */}
              {!log ? (
                <div className="text-center py-4 text-xs text-slate-500 italic">
                  {t('দুঃখিত, এই তারিখে কোনো ডাটা রেকর্ড করা হয়নি।', 'Oops! No activities were logged on this specific calendar date.')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Habits check */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-900 space-y-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t('সুঅভ্যাস ট্র্যাকলিস্ট', 'Habit Checklists')}</span>
                    </span>

                    <div className="space-y-1.5 pt-1">
                      {state.habits.map((h) => {
                        const isDone = log.habits?.[h.id] || log.habits?.[h.name];
                        return (
                          <div key={h.id} className="flex items-center justify-between text-xs bg-slate-950/40 p-1.5 rounded-lg border border-slate-900">
                            <span className="text-slate-300 font-medium">{h.name}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              isDone 
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/25' 
                                : 'bg-slate-900 text-slate-500'
                            }`}>
                              {isDone ? t('সম্পূর্ণ', 'Completed') : t('অপূর্ণ', 'Pending')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Study check */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-900 space-y-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t('স্টাডি সেশন বিশ্লেষণ', 'Study Hours Log')}</span>
                    </span>

                    <div className="space-y-1.5 pt-1">
                      {Object.keys(log.study || {}).length === 0 ? (
                        <div className="text-[11px] text-slate-500 italic py-2">
                          {t('কোনো অধ্যয়ন করা হয়নি।', 'No study minutes logged.')}
                        </div>
                      ) : (
                        Object.entries(log.study).map(([subName, secs]) => {
                          const h = Math.floor(secs / 3600);
                          const m = Math.floor((secs % 3600) / 60);
                          return (
                            <div key={subName} className="flex items-center justify-between text-xs bg-slate-950/40 p-1.5 rounded-lg border border-slate-900">
                              <span className="text-slate-300 font-semibold">{subName}</span>
                              <span className="font-mono text-amber-400 font-black">
                                {h > 0 ? `${h}h ` : ''}{m}m
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })()}

      </div>

      {/* ===================================================================
          NEW FEATURE: WEEKLY CONSISTENCY HEATMAP CALENDAR (PAST 30 DAYS)
          =================================================================== */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Heatmap Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/60 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2 font-sans">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Flame className="w-5 h-5 text-emerald-400" />
              <span>{t('সাপ্তাহিক হ্যাবিট হিটম্যাপ (ধারাবাহিকতা)', 'Weekly Consistency Calendar & Heatmap')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t('গত ৩০ দিনে আপনার নিয়মানুবর্তিতা ও সুঅভ্যাস অর্জনের ধারাবাহিকতার হিটম্যাপ ট্র্যাকলিস্ট। বক্সে ক্লিক করে সেই দিনের বিবরণ দেখুন।', 'Track heatmap-style daily completeness of your habits over the past 30 days. Click any cell to see that day\'s complete activities.')}
            </p>
          </div>

          {/* Quick stats summarizing the heatmap */}
          {(() => {
            const weeksData = getWeeklyCalendarHeatmap();
            let totalPossibleHabitsSum = 0;
            let totalActuallyCompletedSum = 0;
            
            weeksData.forEach(w => {
              w.forEach(d => {
                if (d) {
                  totalPossibleHabitsSum += d.totalHabits;
                  totalActuallyCompletedSum += d.completedCount;
                }
              });
            });

            const overallPct = totalPossibleHabitsSum > 0 
              ? Math.round((totalActuallyCompletedSum / totalPossibleHabitsSum) * 100) 
              : 0;

            return (
              <div className="flex gap-3 shrink-0 bg-slate-950 p-2.5 rounded-2xl border border-slate-850">
                <div className="text-left font-sans">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">{t('৩০ দিনে গড় কাজ', '30-Day Avg')}</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">{overallPct}%</span>
                </div>
                <div className="w-px bg-slate-800" />
                <div className="text-left font-sans">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">{t('সম্পূর্ণ অভ্যাস', 'Total Done')}</span>
                  <span className="text-sm font-black text-slate-200 font-mono">{totalActuallyCompletedSum}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* The Heatmap Area wrapper */}
        <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850/60">
          <div className="flex gap-2 items-start">
            
            {/* Labeled rows on side */}
            <div className="grid grid-rows-7 h-[168px] text-[10px] text-slate-500 font-black font-mono shrink-0 select-none py-1.5 uppercase tracking-wider text-right pr-2">
              <span>{t('রবি', 'Sun')}</span>
              <span>{t('সোম', 'Mon')}</span>
              <span>{t('মঙ্গল', 'Tue')}</span>
              <span>{t('বুধ', 'Wed')}</span>
              <span>{t('বৃহ', 'Thu')}</span>
              <span>{t('শুক্র', 'Fri')}</span>
              <span>{t('শনি', 'Sat')}</span>
            </div>

            {/* Heatmap Grid matrix */}
            <div className="flex-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <div className="grid grid-flow-col grid-rows-7 gap-2 min-w-[340px] h-[168px] justify-start py-0.5">
                {(() => {
                  const weeks = getWeeklyCalendarHeatmap();
                  return weeks.flatMap((week, wIdx) => {
                    return week.map((day, dIdx) => {
                      if (!day) {
                        return (
                          <div 
                            key={`heatmap-null-${wIdx}-${dIdx}`}
                            className="w-[20px] h-[20px] rounded bg-slate-950/20 border border-slate-900/30 opacity-15"
                          />
                        );
                      }

                      // Active day has habit completions
                      const isSelected = selectedDayStr === day.dateStr;
                      const hasData = day.totalHabits > 0;
                      
                      let colorClass = "bg-slate-950/90 border-slate-900 h-5 w-5 text-slate-600";
                      
                      if (hasData) {
                        if (day.percentage === 0) {
                          colorClass = "bg-slate-900 border-slate-850 text-slate-500";
                        } else if (day.percentage <= 25) {
                          colorClass = "bg-emerald-950/40 border-emerald-900/20 text-emerald-500";
                        } else if (day.percentage <= 50) {
                          colorClass = "bg-emerald-900/50 border-emerald-800/35 text-emerald-400";
                        } else if (day.percentage <= 75) {
                          colorClass = "bg-emerald-700/50 border-emerald-600/35 text-emerald-300";
                        } else if (day.percentage < 100) {
                          colorClass = "bg-emerald-600 border-emerald-500/40 text-emerald-200 shadow-sm shadow-emerald-500/10";
                        } else {
                          colorClass = "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.35)] font-black";
                        }
                      }

                      // Highlight outline if cells match today's local date
                      const todayLocalStr = new Date().toISOString().split('T')[0];
                      const isToday = day.dateStr === todayLocalStr;

                      return (
                        <motion.button
                          key={day.dateStr}
                          onClick={() => setSelectedDayStr(isSelected ? null : day.dateStr)}
                          whileHover={{ scale: 1.15, zIndex: 10 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-[20px] h-[20px] rounded flex items-center justify-center text-[8px] border cursor-pointer select-none relative transition-all duration-300 group ${colorClass} ${
                            isSelected 
                              ? 'ring-2 ring-amber-500/80 border-amber-400 scale-105 z-10' 
                              : isToday 
                              ? 'border-cyan-400 ring-1 ring-cyan-500/30' 
                              : ''
                          }`}
                        >
                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 border border-slate-850 p-2 rounded-xl text-[10px] text-slate-200 font-sans tracking-tight min-w-[130px] shadow-2xl z-50 pointer-events-none">
                            <div className="font-extrabold text-slate-100 flex items-center justify-between gap-2 border-b border-slate-900 pb-1 mb-1">
                              <span>
                                {new Date(day.dateStr).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              {isToday && (
                                <span className="text-[8px] text-cyan-400 uppercase font-black tracking-widest">{t('আজ', 'Today')}</span>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <span className="block font-medium">
                                {t('সম্পন্ন:', 'Completed:')} <strong className="text-emerald-400 font-mono">{day.completedCount}/{day.totalHabits}</strong>
                              </span>
                              <span className="block text-[9px] text-slate-400">
                                {t('হার:', 'Rate:')} <strong className="text-yellow-400 font-mono">{day.percentage}%</strong>
                              </span>
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-850 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-[4px]" />
                          </div>

                          {/* Render tiny indicator inside cell for full completions */}
                          {day.percentage === 100 && (
                            <span className="text-[7.5px]">✓</span>
                          )}
                        </motion.button>
                      );
                    });
                  });
                })()}
              </div>
            </div>

          </div>

          {/* Heatmap Legend */}
          <div className="flex flex-wrap justify-between items-center gap-4 text-[10px] text-slate-500 font-black border-t border-slate-900/50 pt-3 select-none">
            
            {/* Heatmap intensity visual labels */}
            <div className="flex items-center gap-1.5">
              <span>{t('পেন্ডিং', 'Less')}</span>
              <div className="w-3 w-[12px] h-[12px] rounded bg-slate-900 border border-slate-850" />
              <div className="w-3 w-[12px] h-[12px] rounded bg-emerald-950/40 border border-emerald-900/20" />
              <div className="w-3 w-[12px] h-[12px] rounded bg-emerald-900/50 border border-emerald-800/30" />
              <div className="w-3 w-[12px] h-[12px] rounded bg-emerald-700/50 border border-emerald-600/35" />
              <div className="w-3 w-[12px] h-[12px] rounded bg-emerald-600 border border-emerald-500/40" />
              <div className="w-3 w-[12px] h-[12px] rounded bg-emerald-500 border border-emerald-400" />
              <span>{t('শতভাগ', 'More')}</span>
            </div>

            <div className="text-slate-500 text-[9px] italic font-bold">
              💡 {t('যেকোনো বক্সে ক্লিক করে বিশদ দৈনন্দিন ডায়েরি লোড করুন', 'Click any heatmap square cell to open daily metrics detail log.')}
            </div>
          </div>

        </div>

      </div>

      {/* ===================================================================
          NEW FEATURE: MILESTONE ACHIEVEMENTS / VISUAL BADGES SYSTEM
          =================================================================== */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Achievements Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2 font-sans">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>{t('অর্জিত কৃতি সম্মাননা ও মেডেলসমূহ', 'My Milestones & Visual Badges')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t('নিয়মিত অভ্যাস ও পড়াশোনার গুরুত্বপূর্ণ মাইলফলক স্পর্শ করে মেডেল আনলক করুন!', 'Unlock authentic visual honors and medallions as your consistent focus and daily prayer grows!')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 shrink-0 self-start sm:self-center">
            <Gift className="w-4 h-4 text-amber-500 animate-pulse" />
            <div className="text-xs font-bold text-slate-300 font-sans">
              <span>{t('আনলকড:', 'Unlocked:')} </span>
              <span className="text-amber-400 font-black font-mono">{currentlyUnlockedBadgesSet.size}</span>
              <span className="text-slate-500"> / {achievementsList.length}</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
            <span>{t('সম্মাননা অর্জনের অগ্রগতি', 'Overall Achievements Progress')}</span>
            <span className="font-mono text-amber-500 font-black">
              {Math.round((currentlyUnlockedBadgesSet.size / achievementsList.length) * 100)}%
            </span>
          </div>

          <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${(currentlyUnlockedBadgesSet.size / achievementsList.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Badges Grid Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievementsList.map((ach) => {
            const isUnlocked = currentlyUnlockedBadgesSet.has(ach.id);
            const IconComponent = ach.icon;

            // Generate progress calculation string dynamically
            let progressLabel = '';
            let progressPercent = 0;

            if (typeof ach.threshold === 'number') {
              const currentNum = typeof ach.metricValue === 'number' ? ach.metricValue : 0;
              progressLabel = `${currentNum.toFixed(1)} / ${ach.threshold} ${language === 'bn' ? ach.unitBn : ach.unitEn}`;
              progressPercent = Math.min(100, (currentNum / ach.threshold) * 100);
            } else if (typeof ach.threshold === 'boolean') {
              const currentVal = !!ach.metricValue;
              progressLabel = currentVal ? (language === 'bn' ? 'অর্জিত!' : 'Unlocked!') : (language === 'bn' ? 'অপ্রাপ্ত' : 'Incomplete');
              progressPercent = currentVal ? 100 : 0;
            }

            return (
              <div 
                key={ach.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                  isUnlocked 
                    ? `${ach.glowClass} hover:scale-[1.03]` 
                    : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-65'
                }`}
              >
                {/* Background graphic flare */}
                {isUnlocked && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-current opacity-5 rounded-full blur-2xl transition group-hover:scale-125" />
                )}

                {/* Card Top: Icon & lock state */}
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-2xl ${
                    isUnlocked 
                      ? 'bg-slate-900 text-current' 
                      : 'bg-slate-900/60 text-slate-600'
                  }`}>
                    <IconComponent className="w-5 h-5 shrink-0" />
                  </div>

                  <div className="text-[10px] uppercase font-mono tracking-widest font-black">
                    {isUnlocked ? (
                      <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                        {t('অর্জন', 'Badge')}
                      </span>
                    ) : (
                      <span className="text-slate-600 bg-slate-900/40 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {t('লকড', 'Locked')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Mid: Title & Description */}
                <div className="space-y-1 mb-4">
                  <h4 className={`text-xs md:text-sm font-black font-sans ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                    {language === 'bn' ? ach.titleBn : ach.titleEn}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {language === 'bn' ? ach.descBn : ach.descEn}
                  </p>
                </div>

                {/* Card Bottom: Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-900/50">
                  <div className="flex justify-between text-[10px] font-mono leading-none font-bold">
                    <span>{t('অগ্রগতি', 'Progress')}</span>
                    <span className={isUnlocked ? 'text-amber-400 font-extrabold' : 'text-slate-500'}>
                      {progressLabel}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isUnlocked 
                          ? 'bg-current' 
                          : 'bg-slate-800'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ===================================================================
          EXISTING PANELS: CUMULATIVE & CHART GRAPHS
          =================================================================== */}
      
      {/* Subject-Wise Study Report Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            {t('বিষয় ভিত্তিক অধ্যয়ন ঘণ্টা (সর্বমোট)', 'Subject-Wise Study Hours (Cumulative)')}
          </h3>
          <span className="bg-blue-500/15 text-blue-400 font-bold font-mono text-[11px] px-2.5 py-1 rounded-full border border-blue-500/25">
            {t('বাস্তব সময়ের লগস', 'Realtime logs')}
          </span>
        </div>

        {/* Display bars */}
        <div className="space-y-4 pt-1">
          {subjectStudyHours.length === 0 ? (
            <div className="text-slate-500 text-sm italic text-center py-4">
              {t('কোনো বিষয় পাওয়া যায়নি। অনুগ্রহ করে স্টাডি ট্যাবে নতুন বিষয় এড করুন!', 'No subjects found. Please add subjects to start tracking!')}
            </div>
          ) : (
            subjectStudyHours.map((sub, idx) => {
              const totalHours = sub.hours;
              const barWidth = Math.min((totalHours / 10) * 100, 100);
              
              const hFloat = sub.seconds / 3600;
              const h = Math.floor(hFloat);
              const m = Math.floor((sub.seconds % 3600) / 60);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="font-semibold text-slate-200 truncate pr-4">{sub.name}</span>
                    <span className="font-mono text-slate-300 font-bold whitespace-nowrap">
                      {h > 0 ? `${h}h ` : ''}{m}m 
                      <span className="text-[10px] text-slate-500 font-normal ml-1">
                        ({totalHours.toFixed(2)} {t('ঘণ্টা', 'hrs')})
                      </span>
                    </span>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.max(barWidth, totalHours > 0 ? 3 : 1)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{t('শ্রেণী টার্গেট:', 'Target per day:')} {sub.targetMinutes} {t('মিনিট', 'mins')}</span>
                    {totalHours > 0 && (
                      <span className="text-emerald-400 font-medium">
                        ✓ {t('ফোকাস গাছ সফলভাবে পুষ্ট!', 'Nurtured focus tree successfully!')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {maxSubject && maxSubject.hours > 0 && (
          <div className="mt-5 p-4 rounded-2xl border border-blue-500/15 bg-blue-950/20 text-xs text-blue-200 leading-relaxed font-sans">
            🔥 {t('সর্বোচ্চ একাগ্রতা এসেছে', 'Highest dedication achieved in')}{' '}
            <strong className="text-amber-400">"{maxSubject.name}"</strong>{' '}
            {t('বিষয়ে, যেখানে আপনি মোট', 'subject, with total study of')}{' '}
            <strong className="text-amber-400">{maxSubject.hours} {t('ঘণ্টা', 'hours')}</strong>{' '}
            {t('ব্যয় করেছেন! আপনার মস্তিষ্ক এটি মনে রাখতে সাহায্য করবে।', 'invested! Self-reflection notes will solidify this memory.')}
          </div>
        )}
      </div>

      {/* Interactive D3 Bar Chart for last 7 days study progress */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-5 font-sans flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          {t('গত ৭ দিনের দৈনিক স্টাডি চার্ট (ঘণ্টা হিসেবে)', 'Daily Study Hours - Last 7 Days')}
        </h3>

        <div className="relative pt-2">
          <D3BarChart 
            data={dailyStudyData.map(d => ({ label: d.dateLabel, value: d.hours }))} 
            color="#3b82f6" 
            height={160} 
          />
        </div>
      </div>

      {/* Prayer Accuracy Line Graph - Last 7 Days */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-5 font-sans flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
          {t('৫ ওয়াক্ত নামাজ আদায়ের হার (%)', 'Five Prayers Realization Rate (%)')}
        </h3>

        <div className="relative pt-2">
          <D3LineChart 
            data={prayerCompletionData.map(d => ({ label: d.dayNum, value: d.percentage }))} 
            color="#22c55e" 
            height={140} 
          />
        </div>
      </div>

      {/* Weekly Habit Trend - Last 7 Days using D3 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
            {t('দৈনিক সুঅভ্যাস সম্পন্ন করার প্রবণতা (সাপ্তাহিক ট্রেন্ড)', 'Weekly Habit Trend - Last 7 Days')}
          </h3>
          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
            {t('গত ৭ দিনে প্রতিদিন কয়টি করে সুঅভ্যাস সম্পন্ন করা হয়েছে তা ট্র্যাক করছে', 'Track of completed habits count trend over the past week')}
          </p>
        </div>

        <div className="h-44 w-full relative pt-2">
          {(() => {
            const chartData = last7Days.map((dateStr) => {
              const dayLog = state.history[dateStr];
              let completedCount = 0;
              if (dayLog && dayLog.habits) {
                completedCount = Object.values(dayLog.habits).filter((status) => status === true).length;
              }
              const dateObj = new Date(dateStr);
              const dayName = dateObj.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' });
              const dayNum = dateStr.split('-')[2];
              return {
                label: `${dayName} (${dayNum})`,
                value: completedCount,
              };
            });

            return (
              <D3LineChart 
                data={chartData} 
                color="#818cf8" 
                height={176} 
              />
            );
          })()}
        </div>
      </div>

      {/* Wellness & Habits Bento overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Habit card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest font-mono">
            <span>{t('দৈনিক সুঅভ্যাস', 'Habits Fidelity')}</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">{habitFidelity}%</span>
          </div>
          <div className="text-2xl font-black font-sans text-slate-100">
            {totalHabitsCompleted} / {totalHabitsTracked}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
            {t('সুঅভ্যাসের প্রতি আপনার ধারাবাহিকতা। এটি আপনার জীবনে নিয়মানুবর্তিতা বয়ে আনবে!', 'Your consistency index across daily habits. Small tasks compound into great character.')}
          </p>
        </div>

        {/* Message of support From Sohan */}
        <div className="p-5 rounded-2xl border border-amber-500/10 bg-amber-950/10 flex gap-3.5 items-start">
          <img 
            src="https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p" 
            alt="Sohan" 
            className="w-10 h-10 rounded-full border border-amber-500/30 object-cover shrink-0"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/src/assets/images/sohan_mridha_avatar_1781871331231.jpg";
            }}
          />
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-sans">
              {t('সোহান মৃধার উপদেশ', "Sohan's Report Tip")}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans italic">
              {t(
                '"রিপোর্টিং নিজেকে ফাঁকি দেওয়া থেকে রক্ষা করার সবচেয়ে মোক্ষম প্রতিষেধক। প্রতি সপ্তাহে নামাজ আদায় এবং কমপ্লিট স্টাডি আওয়ার মনিটর করুন!"', 
                '"Reports are the best remedy against self-deception. Monitor your daily focus rates and prayer fidelity to discover absolute stability!"'
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
