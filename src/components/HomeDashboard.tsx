import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Mic, 
  Wind, 
  Activity, 
  Moon, 
  Sun, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Play, 
  Award, 
  TrendingUp,
  Heart,
  Flame,
  ShieldCheck,
  Volume2,
  Clock,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { VoiceState, DayCurriculum, SessionPlan, Language } from '../types/voice';
import { CinematicTree } from './CinematicTree';

interface HomeDashboardProps {
  voiceState: VoiceState;
  curriculum: DayCurriculum;
  language: Language;
  onOpenSession: (session: SessionPlan) => void;
  onOpenSleepTracker: () => void;
  onOpenBodyWellness: () => void;
  onOpenVoiceStudio: () => void;
  onOpenTreeInfo: () => void;
  onOpenDailyReport?: (day: number) => void;
  onOpenScientificReading?: () => void;
}

export function HomeDashboard({
  voiceState,
  curriculum,
  language,
  onOpenSession,
  onOpenSleepTracker,
  onOpenBodyWellness,
  onOpenVoiceStudio,
  onOpenTreeInfo,
  onOpenDailyReport,
  onOpenScientificReading
}: HomeDashboardProps) {
  const todayKey = new Date().toISOString().split('T')[0];
  const dayLog = voiceState.dayLogsByDay?.[voiceState.currentDay] || voiceState.todayLogs[todayKey];
  const todayLog = dayLog || {
    date: todayKey,
    dayNumber: voiceState.currentDay,
    completedExerciseIds: voiceState.completedExercisesToday || [],
    sessionsCompleted: { morning: false, afternoon: false, evening: false, night: false },
    breathCompleted: false,
    voiceCompleted: false,
    bodyCompleted: false,
    recoveryCompleted: false,
    dailyProgressPct: 0,
    xpEarned: 0,
    sleepDurationHours: voiceState.sleepTracker?.durationHours || 7.5,
    sleepConsistencyScore: voiceState.sleepTracker?.consistencyScore || 85,
    voiceRecoveryScore: voiceState.sleepTracker?.voiceRecoveryScore || 88
  };

  const timeBreakdown = todayLog?.timeBreakdown || {
    breathSeconds: 0,
    voiceSeconds: 0,
    bodySeconds: 0,
    readingSeconds: 0,
    recoverySeconds: 0,
    totalSeconds: 0
  };

  const totalMin = Math.floor(
    (timeBreakdown.breathSeconds + timeBreakdown.voiceSeconds + timeBreakdown.bodySeconds + timeBreakdown.readingSeconds + timeBreakdown.recoverySeconds) / 60
  );
  const totalSec = (timeBreakdown.breathSeconds + timeBreakdown.voiceSeconds + timeBreakdown.bodySeconds + timeBreakdown.readingSeconds + timeBreakdown.recoverySeconds) % 60;

  // Calculate today's progress % based on session completions
  const completedSessionsCount = [
    todayLog.sessionsCompleted?.morning,
    todayLog.sessionsCompleted?.afternoon,
    todayLog.sessionsCompleted?.evening,
    todayLog.sessionsCompleted?.night
  ].filter(Boolean).length;

  const calculatedProgressPct = Math.min(100, Math.round((completedSessionsCount / 4) * 100));

  // Determine time-based greeting
  const hour = new Date().getHours();
  const greetingBn = hour < 12 ? 'শুভ সকাল' : hour < 17 ? 'শুভ দুপুর' : hour < 20 ? 'শুভ সন্ধ্যা' : 'শুভরাত্রি';
  const greetingEn = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : hour < 20 ? 'Good Evening' : 'Good Night';

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-24 select-none animate-fade-in">
      {/* Top Profile & Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-400 font-bold text-base">
                {voiceState.userName ? voiceState.userName[0].toUpperCase() : 'V'}
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">
                {language === 'bn' ? greetingBn : greetingEn},
              </span>
              <span className="text-xs font-bold text-slate-200">
                {voiceState.userName || 'Champion'}
              </span>
            </div>
            <h1 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              {language === 'bn' ? curriculum.themeBn : curriculum.themeEn}
            </h1>
          </div>
        </div>

        {/* Top Streak & XP Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-xl shadow-md">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300 font-mono">
              {voiceState.streak}d
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300 font-mono">
              {voiceState.xp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Centerpiece: Animated 30-Day Tree */}
      <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <CinematicTree
          dayNumber={voiceState.currentDay}
          stageLevel={curriculum.treeStage}
          dailyProgressPct={calculatedProgressPct}
          streak={voiceState.streak}
          language={language}
          onClickInfo={onOpenTreeInfo}
        />

        {/* Progress Metric Ring Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-700"
                  strokeDasharray={`${calculatedProgressPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-200 font-mono">
                {calculatedProgressPct}%
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-200 block">
                {language === 'bn' ? 'আজকের সার্বিক অগ্রগতি' : "Today's Overall Routine"}
              </span>
              <span className="text-[10px] text-slate-400">
                {language === 'bn' ? `${completedSessionsCount} / ৪ সেশন সম্পন্ন` : `${completedSessionsCount} of 4 sessions completed`}
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenSession(curriculum.sessions.morning)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'bn' ? 'অনুশীলন' : 'Start'}</span>
          </button>
        </div>
      </div>

      {/* TODAY'S PRACTICE TIME & GRANULAR TASK BREAKDOWN */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                {language === 'bn' ? 'আজকের অনুশীলনের মোট সময়' : "Today's Total Practice Time"}
              </span>
              <h3 className="text-base font-black text-white font-mono">
                {totalMin} {language === 'bn' ? 'মিনিট' : 'min'} {totalSec > 0 ? `${totalSec}s` : ''}
                <span className="text-xs text-slate-400 font-sans font-normal ml-1.5">
                  / 30 {language === 'bn' ? 'মিনিট লক্ষ্য' : 'min goal'}
                </span>
              </h3>
            </div>
          </div>

          {onOpenDailyReport && (
            <button
              onClick={() => onOpenDailyReport(voiceState.currentDay)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 border border-slate-700/60"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'bn' ? 'রিপোর্ট' : 'Report'}</span>
            </button>
          )}
        </div>

        {/* 4 Task Category Minutes Chips */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-cyan-400 font-bold block">
              {language === 'bn' ? 'শ্বাস' : 'Breath'}
            </span>
            <span className="text-xs font-mono font-black text-slate-200">
              {Math.round(timeBreakdown.breathSeconds / 60)}m
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-emerald-400 font-bold block">
              {language === 'bn' ? 'ভয়েস' : 'Voice'}
            </span>
            <span className="text-xs font-mono font-black text-slate-200">
              {Math.round(timeBreakdown.voiceSeconds / 60)}m
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-purple-400 font-bold block">
              {language === 'bn' ? 'রিডিং' : 'Reading'}
            </span>
            <span className="text-xs font-mono font-black text-slate-200">
              {Math.round(timeBreakdown.readingSeconds / 60)}m
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-amber-400 font-bold block">
              {language === 'bn' ? 'বডি' : 'Body'}
            </span>
            <span className="text-xs font-mono font-black text-slate-200">
              {Math.round(timeBreakdown.bodySeconds / 60)}m
            </span>
          </div>
        </div>

        {/* Action Button to Launch Scientific Reading Lab */}
        {onOpenScientificReading && (
          <button
            onClick={onOpenScientificReading}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-950 border border-purple-500/40 hover:border-purple-400 text-slate-200 text-xs font-bold transition-all flex items-center justify-between group shadow-md"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>{language === 'bn' ? 'বৈজ্ঞানিক রিডিং প্র্যাকটিস ল্যাব খুলুন' : 'Open Scientific Vocal Reading Lab'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* 4 PRIMARY STATUS CARDS (VOICE, BREATH, BODY, RECOVERY) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {language === 'bn' ? '৪টি মূল স্তম্ভ (Voice Pillars)' : '4 Core Pillars'}
          </h2>
          <span className="text-[11px] font-mono text-emerald-400">Dynamic Daily Focus</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 1. VOICE CARD */}
          <div 
            onClick={onOpenVoiceStudio}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>

            <h3 className="text-sm font-bold text-white">
              {language === 'bn' ? 'কণ্ঠ ও রেজোন্যান্স' : 'VOICE'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              {language === 'bn' ? 'হামিং, লিপ ট্রিল ও আরজে স্টুডিও' : 'Humming & RJ Broadcast'}
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono text-slate-300">
                {language === 'bn' ? 'এআই স্কোর ৮০+' : 'AI Score 80+'}
              </span>
            </div>
          </div>

          {/* 2. BREATH CARD */}
          <div 
            onClick={() => onOpenSession(curriculum.sessions.morning)}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 group-hover:scale-105 transition-transform">
                <Wind className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>

            <h3 className="text-sm font-bold text-white">
              {language === 'bn' ? 'শ্বাস নিয়ন্ত্রণ' : 'BREATH'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              {language === 'bn' ? '৪-২-৬ ডায়াফ্রাম্যাটিক ব্রিদিং' : '4-2-6 Diaphragmatic Loop'}
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-mono text-slate-300">
                {language === 'bn' ? 'ফুসফুস প্রসারিত' : 'Stable Airflow'}
              </span>
            </div>
          </div>

          {/* 3. BODY CARD */}
          <div 
            onClick={onOpenBodyWellness}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all group shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400 group-hover:scale-105 transition-transform">
                <Activity className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </div>

            <h3 className="text-sm font-bold text-white">
              {language === 'bn' ? 'দেহভঙ্গি ও শিথিলতা' : 'BODY'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              {language === 'bn' ? 'ঘাড়, কাঁধ ও ল্যারিংক্স রিলাক্স' : 'Neck, Jaw & Posture'}
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="text-[10px] font-mono text-slate-300">
                {language === 'bn' ? 'টেনশন মুক্ত' : 'Tension-Free'}
              </span>
            </div>
          </div>

          {/* 4. RECOVERY CARD */}
          <div 
            onClick={onOpenSleepTracker}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 group-hover:scale-105 transition-transform">
                <Moon className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>

            <h3 className="text-sm font-bold text-white">
              {language === 'bn' ? 'ভোকাল রিকভারি' : 'RECOVERY'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              {language === 'bn' ? 'ভয়েস রেস্ট ও স্লিপ ট্র্যাকিং' : 'Deep Sleep & Vocal Rest'}
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-[10px] font-mono text-slate-300">
                {voiceState.sleepTracker?.durationHours || 7.5}h Sleep | {voiceState.sleepTracker?.voiceRecoveryScore || 88}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S TIMELINE CHECKLIST */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {language === 'bn' ? 'আজকের ৪টি রুটিন সেশন' : "Today's 4 Routine Sessions"}
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">{voiceState.currentDay}/30</span>
        </div>

        {/* Morning Session */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenSession(curriculum.sessions.morning)}
              className="text-emerald-400 hover:scale-110 transition-transform"
            >
              {todayLog.sessionsCompleted?.morning ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {language === 'bn' ? curriculum.sessions.morning.titleBn : curriculum.sessions.morning.titleEn}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {voiceState.scheduleTimes?.morning || curriculum.sessions.morning.timeDefault}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {language === 'bn' ? curriculum.sessions.morning.descriptionBn : curriculum.sessions.morning.descriptionEn}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenSession(curriculum.sessions.morning)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Afternoon Session */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenSession(curriculum.sessions.afternoon)}
              className="text-emerald-400 hover:scale-110 transition-transform"
            >
              {todayLog.sessionsCompleted?.afternoon ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {language === 'bn' ? curriculum.sessions.afternoon.titleBn : curriculum.sessions.afternoon.titleEn}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {voiceState.scheduleTimes?.afternoon || curriculum.sessions.afternoon.timeDefault}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {language === 'bn' ? curriculum.sessions.afternoon.descriptionBn : curriculum.sessions.afternoon.descriptionEn}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenSession(curriculum.sessions.afternoon)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Evening RJ Session */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenSession(curriculum.sessions.evening)}
              className="text-emerald-400 hover:scale-110 transition-transform"
            >
              {todayLog.sessionsCompleted?.evening ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {language === 'bn' ? curriculum.sessions.evening.titleBn : curriculum.sessions.evening.titleEn}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {voiceState.scheduleTimes?.evening || curriculum.sessions.evening.timeDefault}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {language === 'bn' ? curriculum.sessions.evening.descriptionBn : curriculum.sessions.evening.descriptionEn}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenSession(curriculum.sessions.evening)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Night Recovery Session */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenSession(curriculum.sessions.night)}
              className="text-emerald-400 hover:scale-110 transition-transform"
            >
              {todayLog.sessionsCompleted?.night ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {language === 'bn' ? curriculum.sessions.night.titleBn : curriculum.sessions.night.titleEn}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {voiceState.scheduleTimes?.night || curriculum.sessions.night.timeDefault}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {language === 'bn' ? curriculum.sessions.night.descriptionBn : curriculum.sessions.night.descriptionEn}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenSession(curriculum.sessions.night)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Voice Coach Wisdom Tip Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-800/40 flex items-start gap-3 shadow-lg">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-300">
              {language === 'bn' ? 'এআই ভয়েস কোচ পরামর্শ' : 'AI Coach Daily Advice'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Day {voiceState.currentDay}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'bn'
              ? 'কথা বলার সময় সবসময় মনে রাখবেন—জোর করে কণ্ঠ ভারী করা নয়, স্বচ্ছতা ও স্বাচ্ছন্দ্যই আসল ব্যক্তিত্ব তৈরি করে।'
              : 'True resonance comes from effortless relaxation and diaphragmatic airflow, never forced vocal depth.'}
          </p>
        </div>
      </div>
    </div>
  );
}
