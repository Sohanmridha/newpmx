import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Timer, 
  Sparkles, 
  BookOpen, 
  Award, 
  Zap, 
  Smile, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  BookMarked,
  Activity,
  Calendar,
  Compass
} from 'lucide-react';
import { AppState } from '../types';

interface AchievementSystemProps {
  state: AppState;
  saveState: (s: AppState) => void;
  playCompletionBeep?: () => void;
  triggerCustomAlert?: (text: string, title?: string, type?: 'info' | 'success' | 'error') => void;
}

export interface AchievementBadge {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  icon: React.ComponentType<any>;
  color: string;
  glowClass: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  requirementBn: string;
  requirementEn: string;
  mridhaxTipBn: string;
  mridhaxTipEn: string;
  
  // Progress calculations
  currentValue: number;
  threshold: number;
  isUnlocked: boolean;
  unitBn: string;
  unitEn: string;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ 
  state, 
  saveState, 
  playCompletionBeep,
  triggerCustomAlert 
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // Helper: date string
  const getDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 1. Calculate focus hours
  const totalStudyMinutes: number = Object.values(state.history || {}).reduce<number>((acc: number, log: any) => {
    if (log && log.study) {
      return acc + Object.values(log.study as Record<string, number>).reduce((a, b) => a + (Math.floor(Number(b) / 60) || 0), 0);
    }
    return acc;
  }, 0);
  const totalFocusHours = parseFloat((totalStudyMinutes / 60).toFixed(1));

  // 2. Calculate Streaks
  const calculateStreaks = () => {
    let habitCurrent = 0;
    let habitBest = 0;
    let studyCurrent = 0;
    let studyBest = 0;
    const sortedDates = Object.keys(state.history || {}).sort();

    if (sortedDates.length > 0) {
      // Current Habit Streak
      let checkDate = new Date();
      let todayStr = getDateString(checkDate);
      let todayLog = state.history[todayStr];
      let todayQualifies = todayLog && todayLog.habits && Object.values(todayLog.habits).some(v => v === true);

      if (!todayQualifies) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = getDateString(checkDate);
        const yesterdayLog = state.history[yesterdayStr];
        const yesterdayQualifies = yesterdayLog && yesterdayLog.habits && Object.values(yesterdayLog.habits).some(v => v === true);
        if (yesterdayQualifies) {
          habitCurrent = 1;
          checkDate.setDate(checkDate.getDate() - 1);
          while (true) {
            const dStr = getDateString(checkDate);
            const log = state.history[dStr];
            const qualifies = log && log.habits && Object.values(log.habits).some(v => v === true);
            if (qualifies) {
              habitCurrent++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
      } else {
        habitCurrent = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const dStr = getDateString(checkDate);
          const log = state.history[dStr];
          const qualifies = log && log.habits && Object.values(log.habits).some(v => v === true);
          if (qualifies) {
            habitCurrent++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      // Best Habit Streak
      let tempHabit = 0;
      const start = new Date(sortedDates[0]);
      const end = new Date();
      const limit = new Date(start);
      limit.setDate(limit.getDate() + 1000);
      const actualEnd = end > limit ? limit : end;

      for (let d = new Date(start); d <= actualEnd; d.setDate(d.getDate() + 1)) {
        const dStr = getDateString(d);
        const log = state.history[dStr];
        const qualifies = log && log.habits && Object.values(log.habits).some(v => v === true);
        if (qualifies) {
          tempHabit++;
          if (tempHabit > habitBest) habitBest = tempHabit;
        } else {
          tempHabit = 0;
        }
      }
    }

    if (sortedDates.length > 0) {
      // Current Study Streak
      let checkDate = new Date();
      let todayStr = getDateString(checkDate);
      let todayLog = state.history[todayStr];
      let todayQualifies = todayLog && todayLog.study && Object.values(todayLog.study).some(s => Number(s) > 0);

      if (!todayQualifies) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = getDateString(checkDate);
        const yesterdayLog = state.history[yesterdayStr];
        const yesterdayQualifies = yesterdayLog && yesterdayLog.study && Object.values(yesterdayLog.study).some(s => Number(s) > 0);
        if (yesterdayQualifies) {
          studyCurrent = 1;
          checkDate.setDate(checkDate.getDate() - 1);
          while (true) {
            const dStr = getDateString(checkDate);
            const log = state.history[dStr];
            const qualifies = log && log.study && Object.values(log.study).some(s => Number(s) > 0);
            if (qualifies) {
              studyCurrent++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
      } else {
        studyCurrent = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const dStr = getDateString(checkDate);
          const log = state.history[dStr];
          const qualifies = log && log.study && Object.values(log.study).some(s => Number(s) > 0);
          if (qualifies) {
            studyCurrent++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      // Best Study Streak
      let tempStudy = 0;
      const start = new Date(sortedDates[0]);
      const end = new Date();
      const limit = new Date(start);
      limit.setDate(limit.getDate() + 1000);
      const actualEnd = end > limit ? limit : end;

      for (let d = new Date(start); d <= actualEnd; d.setDate(d.getDate() + 1)) {
        const dStr = getDateString(d);
        const log = state.history[dStr];
        const qualifies = log && log.study && Object.values(log.study).some(s => Number(s) > 0);
        if (qualifies) {
          tempStudy++;
          if (tempStudy > studyBest) studyBest = tempStudy;
        } else {
          tempStudy = 0;
        }
      }
    }

    return {
      habitCurrent,
      habitBest: Math.max(habitBest, habitCurrent),
      studyCurrent,
      studyBest: Math.max(studyBest, studyCurrent)
    };
  };

  const streaks = calculateStreaks();
  const bestOverallStreak = Math.max(streaks.habitBest, streaks.studyBest);

  // 3. Total Habits completed
  let totalHabitsCompleted = 0;
  Object.values(state.history || {}).forEach((dayLog: any) => {
    if (dayLog.habits) {
      Object.values(dayLog.habits).forEach((val) => {
        if (val === true) totalHabitsCompleted++;
      });
    }
  });

  // 4. Has Completed All 5 Prayers Day
  let total5PrayerDays = 0;
  Object.values(state.history || {}).forEach((dayLog: any) => {
    if (dayLog.prayer) {
      const loggedPrayers = Object.values(dayLog.prayer).filter(v => v === 'jamaat' || v === 'home' || v === 'জামাত' || v === 'ঘরে');
      if (loggedPrayers.length >= 5) {
        total5PrayerDays++;
      }
    }
  });

  // 5. Reflections Count
  const reflectionsCount = state.reflections ? state.reflections.length : 0;

  // 6. Syllabus Progress (Exam Subjects)
  let subjectsCompleted = 0;
  if (state.examPreps && state.examPreps.length > 0) {
    state.examPreps.forEach((ep) => {
      if (ep.subjects) {
        ep.subjects.forEach((subj) => {
          if (subj.chapters && subj.chapters.length > 0) {
            const allDone = subj.chapters.every(ch => ch.isCompleted);
            if (allDone) {
              subjectsCompleted++;
            }
          }
        });
      }
    });
  }

  // Define Achievements List with realistic progress calculation
  const badgesList: AchievementBadge[] = [
    {
      id: 'ach-first-step',
      titleBn: 'প্রথম পদক্ষেপ',
      titleEn: 'First Step',
      descBn: 'প্রথম সুঅভ্যাস অথবা পড়াশোনা ট্র্যাকিং সম্পন্ন করুন।',
      descEn: 'Complete your first daily habit checklist or focused study session.',
      icon: Sparkles,
      color: 'emerald',
      badgeBg: 'bg-emerald-950/25',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      requirementBn: '১টি যেকোনো অ্যাক্টিভিটি সম্পন্ন করা',
      requirementEn: 'Complete 1 activity',
      mridhaxTipBn: 'দারুণ শুরু! প্রথম কদমটি নেওয়া সবচেয়ে কঠিন, আপনি তা করে দেখিয়েছেন। আমাদের এই যাত্রা লম্বা হবে!',
      mridhaxTipEn: 'Fantastic start! Taking the first step is always the hardest part, and you did it. Let\'s build the momentum!',
      currentValue: (totalFocusHours > 0 || totalHabitsCompleted > 0) ? 1 : 0,
      threshold: 1,
      isUnlocked: totalFocusHours > 0 || totalHabitsCompleted > 0,
      unitBn: 'অ্যাক্টিভিটি',
      unitEn: 'activity'
    },
    {
      id: 'ach-habit-streak-3',
      titleBn: 'অভ্যাসের সূচনা',
      titleEn: 'Habit Starter',
      descBn: 'টানা ৩ দিনের চমৎকার হ্যাবিট অথবা পড়াশোনা স্ট্রাক বজায় রাখুন।',
      descEn: 'Form a solid routine with a consistent 3-day consistency streak.',
      icon: Flame,
      color: 'orange',
      badgeBg: 'bg-orange-950/25',
      borderColor: 'border-orange-500/40',
      textColor: 'text-orange-400',
      glowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]',
      requirementBn: 'টানা ৩ দিনের স্ট্রাক অর্জন করা',
      requirementEn: 'Achieve a 3-day streak',
      mridhaxTipBn: 'অভ্যাস গড়ে উঠছে! ৩ দিনে আপনার নিউরনগুলো নতুন প্যাটার্ন বুঝতে শুরু করেছে। ধরে রাখুন!',
      mridhaxTipEn: 'Habit is forming! After 3 days, your neurons are beginning to recognize the new pattern. Keep pushing!',
      currentValue: bestOverallStreak,
      threshold: 3,
      isUnlocked: bestOverallStreak >= 3,
      unitBn: 'দিন',
      unitEn: 'days'
    },
    {
      id: 'ach-habit-streak-10',
      titleBn: 'লৌহ শৃঙ্খলা',
      titleEn: '10-Day Streak',
      descBn: 'টানা ১০ দিন চমৎকার একাডেমিক শৃঙ্খলা ও অভ্যাসের স্ট্রাক বজায় রাখুন!',
      descEn: 'Build iron-clad consistency with a stellar 10-day streak of daily discipline.',
      icon: Activity,
      color: 'pink',
      badgeBg: 'bg-pink-950/25',
      borderColor: 'border-pink-500/40',
      textColor: 'text-pink-400',
      glowClass: 'shadow-[0_0_15px_rgba(236,72,153,0.25)]',
      requirementBn: 'টানা ১০ দিনের অবিরাম স্ট্রাক অর্জন',
      requirementEn: 'Achieve an unbroken 10-day streak',
      mridhaxTipBn: 'অবিশ্বাস্য ধারাবাহিকতা! ১০ দিন মানে আপনি প্রোফেশনাল মোডে আছেন। এটি কোনো শখ নয়, এটি এখন আপনার ডিসিপ্লিন!',
      mridhaxTipEn: 'Incredible dedication! A 10-day streak means you are in professional mode. This isn\'t a hobby anymore; it\'s true discipline!',
      currentValue: bestOverallStreak,
      threshold: 10,
      isUnlocked: bestOverallStreak >= 10,
      unitBn: 'দিন',
      unitEn: 'days'
    },
    {
      id: 'ach-study-5h',
      titleBn: 'একাগ্র মন',
      titleEn: 'Focused Mind',
      descBn: 'মোট ৫ ঘণ্টা পড়াশোনার বা সেলফ-স্টাডির ফোকাস সেশন সম্পন্ন করুন।',
      descEn: 'Log a cumulative 5 hours of total active study and discipline time.',
      icon: BookOpen,
      color: 'sky',
      badgeBg: 'bg-sky-950/25',
      borderColor: 'border-sky-500/40',
      textColor: 'text-sky-400',
      glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.25)]',
      requirementBn: '৫ ঘণ্টা মোট পড়াশোনা সম্পন্ন করা',
      requirementEn: 'Focus for 5 hours in total',
      mridhaxTipBn: 'অসাধারণ! ৫ ঘণ্টায় আপনি গুরুত্বপূর্ণ সিলেবাস কভার করে ফেলেছেন। ডিপ ওয়ার্ক টেকনিক ব্যবহারে মনোযোগ দিন।',
      mridhaxTipEn: 'Great job! In 5 hours, you have likely covered key chapters. Continue using high-intensity focus sessions.',
      currentValue: totalFocusHours,
      threshold: 5,
      isUnlocked: totalFocusHours >= 5,
      unitBn: 'ঘণ্টা',
      unitEn: 'hours'
    },
    {
      id: 'ach-study-20h',
      titleBn: 'মেধাবী যাত্রা',
      titleEn: 'Scholar Journey',
      descBn: 'সব মিলিয়ে ২০ ঘণ্টা নিবিড় অধ্যয়ন ও প্রোডাক্টিভিটি সম্পন্ন করুন।',
      descEn: 'Log a cumulative 20 hours of focused study in your lifetime logs.',
      icon: BookMarked,
      color: 'indigo',
      badgeBg: 'bg-indigo-950/25',
      borderColor: 'border-indigo-500/40',
      textColor: 'text-indigo-400',
      glowClass: 'shadow-[0_0_15px_rgba(99,102,241,0.25)]',
      requirementBn: '২০ ঘণ্টা নিবিড় ফোকাস সম্পূর্ণ করা',
      requirementEn: 'Log 20 hours of total deep focus',
      mridhaxTipBn: 'যাত্রা শুরু হয়েছে! ২০ ঘণ্টার ডিপ স্টাডি আপনার একাডেমিক কনফিডেন্স অনেক বাড়িয়ে দেবে।',
      mridhaxTipEn: 'Your journey is well underway! 20 hours of deep study will boost your academic confidence tremendously.',
      currentValue: totalFocusHours,
      threshold: 20,
      isUnlocked: totalFocusHours >= 20,
      unitBn: 'ঘণ্টা',
      unitEn: 'hours'
    },
    {
      id: 'ach-study-100h',
      titleBn: 'ধ্যানমগ্ন মেন্টর',
      titleEn: '100 Hours Focused',
      descBn: 'সব মিলিয়ে ১০০ ঘণ্টার অবিশ্বাস্য ফোকাস বা গভীর পড়াশোনার বাউন্ডারি পার করুন!',
      descEn: 'Enter the master realm: Accumulate a massive 100 hours of active focus study.',
      icon: Trophy,
      color: 'amber',
      badgeBg: 'bg-amber-950/25',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-400',
      glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      requirementBn: '১০০ ঘণ্টার অবিশ্বাস্য লাইফটাইম ফোকাস অর্জন',
      requirementEn: 'Exceed 100 hours of total cumulative focus',
      mridhaxTipBn: 'অধ্যবসায়ের জীবন্ত উদাহরণ! ১০০ ঘণ্টা মানে আপনি পড়াশোনাকে তপস্যায় রূপান্তর করেছেন। সোহান মৃধার পক্ষ থেকে আপনাকে স্যালুট!',
      mridhaxTipEn: 'A living legend of perseverance! 100 hours means you have converted studying into a sacred mastery. Salute to you!',
      currentValue: totalFocusHours,
      threshold: 100,
      isUnlocked: totalFocusHours >= 100,
      unitBn: 'ঘণ্টা',
      unitEn: 'hours'
    },
    {
      id: 'ach-prayer',
      titleBn: 'ধারাবাহিক সালাত',
      titleEn: 'Faithful Day',
      descBn: 'যেকোনো দিনে ৫ ওয়াক্ত সালাত জামাত বা ঘরে আদায় করে ট্র্যাক করুন।',
      descEn: 'Log all 5 daily prayers on a single day to cultivate spiritual discipline.',
      icon: Zap,
      color: 'teal',
      badgeBg: 'bg-teal-950/25',
      borderColor: 'border-teal-500/40',
      textColor: 'text-teal-400',
      glowClass: 'shadow-[0_0_15px_rgba(20,184,166,0.25)]',
      requirementBn: '১ দিনে ৫ ওয়াক্ত সালাত সম্পন্ন করা',
      requirementEn: 'Log 5 prayers on a single day',
      mridhaxTipBn: 'আধ্যাত্মিক শান্তি! পড়াশোনার পাশাপাশি আল্লাহর ইবাদতে অবিচল থাকা আপনাকে প্রকৃত মানসিক শক্তি দেবে।',
      mridhaxTipEn: 'Spiritual tranquility! Keeping up with prayers alongside your studies brings absolute peace and clarity.',
      currentValue: total5PrayerDays > 0 ? 1 : 0,
      threshold: 1,
      isUnlocked: total5PrayerDays > 0,
      unitBn: 'দিন',
      unitEn: 'day'
    },
    {
      id: 'ach-reflection',
      titleBn: 'মানসিক প্রশান্তি',
      titleEn: 'Mental Clarity',
      descBn: 'কমপক্ষে ৩টি গভীর আত্মপর্যালোচনা বা রিফ্লেকশন নোট লিখুন।',
      descEn: 'Establish mindfulness by writing 3 separate self-reflection logs.',
      icon: Smile,
      color: 'rose',
      badgeBg: 'bg-rose-950/25',
      borderColor: 'border-rose-500/40',
      textColor: 'text-rose-400',
      glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.25)]',
      requirementBn: '৩টি ডায়েরি/রিফ্লেকশন নোট লেখা',
      requirementEn: 'Write 3 self-reflection logs',
      mridhaxTipBn: 'নিজের শিক্ষক হোন! আত্মপর্যালোচনার মাধ্যমে আপনি আপনার ভুলত্রুটিগুলো সংশোধন করে দ্রুত এগিয়ে যাচ্ছেন।',
      mridhaxTipEn: 'Be your own mentor! By reflecting on your days, you quickly correct course and build authentic self-awareness.',
      currentValue: reflectionsCount,
      threshold: 3,
      isUnlocked: reflectionsCount >= 3,
      unitBn: 'নোট',
      unitEn: 'logs'
    },
    {
      id: 'ach-detox',
      titleBn: 'সোশ্যাল ডিটক্স কিলার',
      titleEn: 'Digital Detox Shield',
      descBn: 'আপনার ডিজিটাল ফোকাস বাড়ানোর জন্য সোশ্যাল রিলস ব্লকার চালু রাখুন।',
      descEn: 'Shield your dopamine receptors by keeping the social reels blocker active.',
      icon: ShieldCheck,
      color: 'violet',
      badgeBg: 'bg-violet-950/25',
      borderColor: 'border-violet-500/40',
      textColor: 'text-violet-400',
      glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.25)]',
      requirementBn: 'সোশ্যাল রিলস ব্লকার শিল্ড অ্যাক্টিভেট করা',
      requirementEn: 'Enable social reels blocker shield',
      mridhaxTipBn: 'ডোপামিন নিয়ন্ত্রণ! অপ্রয়োজনীয় স্ক্রোলিং বন্ধ করে আপনি মস্তিষ্কের অমূল্য মনোযোগ সাশ্রয় করছেন। স্যালুট!',
      mridhaxTipEn: 'Dopamine mastery! By blocking mindless scrolling, you protect your brain\'s most valuable asset: attention.',
      currentValue: state.reelsBlockerActive ? 1 : 0,
      threshold: 1,
      isUnlocked: !!state.reelsBlockerActive,
      unitBn: 'স্ট্যাটাস',
      unitEn: 'status'
    },
    {
      id: 'ach-syllabus-master',
      titleBn: 'সিলেবাস বিজয়ী',
      titleEn: 'Syllabus Conqueror',
      descBn: 'যেকোনো একটি পরীক্ষার কোনো বিষয়ের সব চ্যাপ্টার ১০০% সম্পন্ন করুন।',
      descEn: 'Conquer academics by completing 100% of chapters in any subject.',
      icon: Award,
      color: 'fuchsia',
      badgeBg: 'bg-fuchsia-950/25',
      borderColor: 'border-fuchsia-500/40',
      textColor: 'text-fuchsia-400',
      glowClass: 'shadow-[0_0_15px_rgba(217,70,239,0.25)]',
      requirementBn: '১টি বিষয়ের সব সিলেবাস শেষ করা',
      requirementEn: 'Complete all chapters for 1 subject',
      mridhaxTipBn: 'সম্পূর্ণ প্রস্তুতি! প্রতিটি চ্যাপ্টার কভার করার পর পরীক্ষা হলে আপনার আত্মবিশ্বাস থাকবে তুঙ্গে।',
      mridhaxTipEn: 'Ultimate preparedness! Once you have covered 100% of a subject, you will walk into the exam hall fearlessly.',
      currentValue: subjectsCompleted,
      threshold: 1,
      isUnlocked: subjectsCompleted >= 1,
      unitBn: 'বিষয়',
      unitEn: 'subject'
    }
  ];

  // Auto-save unlocked achievements list in AppState if changed
  useEffect(() => {
    const currentlyUnlockedIds = badgesList.filter(b => b.isUnlocked).map(b => b.id);
    const storedUnlockedIds = state.unlockedAchievements || [];
    
    // If we have newly unlocked ones that aren't stored yet
    const hasNew = currentlyUnlockedIds.some(id => !storedUnlockedIds.includes(id));
    if (hasNew) {
      const merged = Array.from(new Set([...storedUnlockedIds, ...currentlyUnlockedIds]));
      saveState({
        ...state,
        unlockedAchievements: merged
      });

      // Show alert and play sound for the newly unlocked badge
      const newlyUnlockedBadge = badgesList.find(b => b.isUnlocked && !storedUnlockedIds.includes(b.id));
      if (newlyUnlockedBadge) {
        if (playCompletionBeep) playCompletionBeep();
        if (triggerCustomAlert) {
          const title = state.language === 'bn' 
            ? `🏆 মেডেল আনলকড: ${newlyUnlockedBadge.titleBn}` 
            : `🏆 Medal Unlocked: ${newlyUnlockedBadge.titleEn}`;
          const desc = state.language === 'bn'
            ? `অভিনন্দন! আপনি "${newlyUnlockedBadge.titleBn}" মেডেলটি সফলভাবে অর্জন করেছেন!`
            : `Congratulations! You have earned the "${newlyUnlockedBadge.titleEn}" badge!`;
          triggerCustomAlert(desc, title, 'success');
        }
      }
    }
  }, [totalFocusHours, bestOverallStreak, totalHabitsCompleted, total5PrayerDays, reflectionsCount, subjectsCompleted, state.reelsBlockerActive]);

  // Filter list
  const filteredBadges = badgesList.filter(b => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  const totalUnlockedCount = badgesList.filter(b => b.isUnlocked).length;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION WITH STATS ROW */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 grid grid-cols-3 gap-3 shadow-inner">
        <div className="text-center p-2 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center">
          <Trophy className="w-5 h-5 text-amber-500 mb-1 shrink-0" />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            {state.language === 'bn' ? 'অর্জিত মেডেল' : 'Badges'}
          </span>
          <span className="text-sm font-black font-mono text-slate-100 mt-0.5">
            {totalUnlockedCount} / {badgesList.length}
          </span>
        </div>

        <div className="text-center p-2 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center">
          <Flame className="w-5 h-5 text-orange-500 mb-1 shrink-0" />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            {state.language === 'bn' ? 'সর্বোচ্চ স্ট্রাক' : 'Best Streak'}
          </span>
          <span className="text-sm font-black font-mono text-slate-100 mt-0.5">
            {bestOverallStreak} {state.language === 'bn' ? 'দিন' : 'days'}
          </span>
        </div>

        <div className="text-center p-2 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center">
          <Timer className="w-5 h-5 text-sky-500 mb-1 shrink-0" />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            {state.language === 'bn' ? 'মোট পড়াশোনা' : 'Total Focus'}
          </span>
          <span className="text-sm font-black font-mono text-slate-100 mt-0.5">
            {totalFocusHours}h
          </span>
        </div>
      </div>

      {/* FILTER BUTTONS & TITLE */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          {state.language === 'bn' ? 'অর্জন ও সম্মাননা' : 'Milestones & Badges'}
        </h3>
        <div className="flex gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
          {(['all', 'unlocked', 'locked'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all leading-none ${
                filter === t 
                  ? 'bg-slate-800 text-amber-400 shadow-lg border border-slate-700/80' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t === 'all' && (state.language === 'bn' ? 'সবগুলো' : 'All')}
              {t === 'unlocked' && (state.language === 'bn' ? 'অর্জিত' : 'Unlocked')}
              {t === 'locked' && (state.language === 'bn' ? 'বাকি' : 'Locked')}
            </button>
          ))}
        </div>
      </div>

      {/* BADGES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredBadges.map((badge) => {
          const IconComponent = badge.icon;
          const pct = Math.min(100, Math.floor((badge.currentValue / badge.threshold) * 100));

          return (
            <motion.div
              layoutId={`badge-card-${badge.id}`}
              onClick={() => setSelectedBadge(badge)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                badge.isUnlocked
                  ? `${badge.badgeBg} ${badge.borderColor} ${badge.glowClass} shadow-md`
                  : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700 text-slate-500'
              }`}
            >
              {/* Background gradient hint */}
              {badge.isUnlocked && (
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current pointer-events-none" />
              )}

              <div className="flex items-start gap-3.5 relative z-10">
                {/* Badge Icon circle */}
                <div className={`p-2.5 rounded-xl border shrink-0 transition-all ${
                  badge.isUnlocked
                    ? `${badge.badgeBg} ${badge.borderColor} ${badge.textColor}`
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}>
                  {badge.isUnlocked ? (
                    <IconComponent className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-black tracking-tight truncate ${
                      badge.isUnlocked ? 'text-slate-100' : 'text-slate-400'
                    }`}>
                      {state.language === 'bn' ? badge.titleBn : badge.titleEn}
                    </h4>
                    {badge.isUnlocked && (
                      <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase leading-none">
                        {state.language === 'bn' ? 'অর্জিত' : 'Earned'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                    {state.language === 'bn' ? badge.descBn : badge.descEn}
                  </p>
                </div>
              </div>

              {/* Progress Bar for Locked ones */}
              {!badge.isUnlocked && (
                <div className="mt-4 pt-3 border-t border-slate-800/40">
                  <div className="flex justify-between text-[9px] font-bold font-mono uppercase text-slate-500 mb-1 leading-none">
                    <span>{state.language === 'bn' ? 'অগ্রগতি' : 'Progress'}</span>
                    <span>
                      {parseFloat(badge.currentValue.toFixed(1))} / {badge.threshold} {state.language === 'bn' ? badge.unitBn : badge.unitEn} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
                    <div 
                      className="h-full bg-slate-700 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Unlocked status footer */}
              {badge.isUnlocked && (
                <div className="mt-3.5 pt-2 border-t border-slate-800/10 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {state.language === 'bn' ? 'কমপ্লিট' : 'Completed'}
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-400 hover:text-amber-300">
                    {state.language === 'bn' ? 'বিস্তারিত' : 'Details'} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* DETAILED DIALOG MODAL VIEW FOR SELECTED BADGE */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              layoutId={`badge-card-${selectedBadge.id}`}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full relative overflow-hidden shadow-2xl"
            >
              {/* Radial gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Header Info */}
              <div className="text-center space-y-3.5 pt-2">
                <div className={`mx-auto p-4 rounded-2xl border w-16 h-16 flex items-center justify-center ${
                  selectedBadge.isUnlocked
                    ? `${selectedBadge.badgeBg} ${selectedBadge.borderColor} ${selectedBadge.textColor}`
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}>
                  {selectedBadge.isUnlocked ? (
                    React.createElement(selectedBadge.icon, { className: 'w-8 h-8 animate-bounce' })
                  ) : (
                    <Lock className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-100 tracking-tight uppercase">
                    {state.language === 'bn' ? selectedBadge.titleBn : selectedBadge.titleEn}
                  </h3>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border inline-block mt-1 ${
                    selectedBadge.isUnlocked 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    {selectedBadge.isUnlocked 
                      ? (state.language === 'bn' ? 'অর্জিত মেডেল' : 'Badge Unlocked') 
                      : (state.language === 'bn' ? 'মেডেল লকড' : 'Badge Locked')}
                  </span>
                </div>
              </div>

              {/* Requirement & Progress */}
              <div className="mt-6 space-y-4">
                <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                    {state.language === 'bn' ? 'অর্জনের শর্ত' : 'Unlock Requirement'}
                  </span>
                  <p className="text-xs font-bold text-slate-200">
                    {state.language === 'bn' ? selectedBadge.requirementBn : selectedBadge.requirementEn}
                  </p>

                  <div className="mt-3.5">
                    <div className="flex justify-between text-[8px] font-bold font-mono text-slate-500 mb-1 uppercase">
                      <span>{state.language === 'bn' ? 'বর্তমান অগ্রগতি' : 'Current Progress'}</span>
                      <span>
                        {parseFloat(selectedBadge.currentValue.toFixed(1))} / {selectedBadge.threshold} {state.language === 'bn' ? selectedBadge.unitBn : selectedBadge.unitEn}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${selectedBadge.isUnlocked ? 'bg-emerald-500' : 'bg-slate-700'}`} 
                        style={{ width: `${Math.min(100, Math.floor((selectedBadge.currentValue / selectedBadge.threshold) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* MridhaX AI Advisor Speech */}
                <div className="bg-gradient-to-br from-amber-500/5 to-amber-600/0 border border-amber-500/15 p-4 rounded-2xl relative">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Compass className="w-4 h-4 text-amber-500" />
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">
                      {state.language === 'bn' ? 'মৃধাক্স এআই পরামর্শ' : 'MridhaX AI Advice'}
                    </span>
                  </div>
                  <p className="text-xs italic text-amber-100/90 leading-relaxed font-medium">
                    "{state.language === 'bn' ? selectedBadge.mridhaxTipBn : selectedBadge.mridhaxTipEn}"
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full mt-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl transition-all border border-slate-700/60"
              >
                {state.language === 'bn' ? 'বন্ধ করুন' : 'Close Details'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
