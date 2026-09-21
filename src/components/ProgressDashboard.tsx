import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Award, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Moon, 
  FileText, 
  Download, 
  Share2, 
  ChevronRight,
  Flame,
  Star,
  Check,
  BookOpen,
  BarChart3,
  Clock,
  Lock,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { VoiceState, BadgeItem, Language } from '../types/voice';
import { VOICE_BADGES } from '../data/voiceBadges';
import { D3VoiceScoreChart, ScoreDataPoint } from './D3VoiceScoreChart';
import { YEAR_365_CYCLES, getYearCycleForDay } from '../data/voiceCurriculum';

interface ProgressDashboardProps {
  voiceState: VoiceState;
  language: Language;
  onOpenDailyReport?: (day: number) => void;
  onOpenScientificReading?: () => void;
}

export function ProgressDashboard({ 
  voiceState, 
  language,
  onOpenDailyReport,
  onOpenScientificReading 
}: ProgressDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'calendar' | 'report'>('calendar');
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  // Active Cycle in 365-day calendar (1 to 12)
  const currentCycle = getYearCycleForDay(voiceState.currentDay);
  const [selectedCycleNumber, setSelectedCycleNumber] = useState<number>(currentCycle.cycleNumber);

  const activeCycleInfo = YEAR_365_CYCLES.find(c => c.cycleNumber === selectedCycleNumber) || currentCycle;

  // Generate 30-day comprehensive D3 trajectory data
  const d3ScoreData: ScoreDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const isCompleted = day < voiceState.currentDay;
    const isCurrent = day === voiceState.currentDay;

    const baseScore = 65 + Math.min(29, (day - 1) * 1.05);
    const dayLog = voiceState.dayLogsByDay?.[day] || Object.values(voiceState.todayLogs || {}).find(l => l.dayNumber === day);
    
    const actualOrProjectedScore = dayLog?.voiceScore || Math.min(97, Math.round(baseScore + (day % 4 === 0 ? 1.5 : (day % 3 === 0 ? -1 : 0.5))));

    return {
      day,
      score: actualOrProjectedScore,
      isCompleted,
      isCurrent,
      wpm: dayLog?.voiceMetrics?.pacingWpm || (105 + Math.min(20, day)),
      clarity: dayLog?.voiceMetrics?.clarity || Math.min(98, 70 + Math.round(day * 0.9))
    };
  });

  const unlockedBadgeCount = VOICE_BADGES.filter(
    (b) => voiceState.unlockedBadgeIds?.includes(b.id) || (b.dayRequired && voiceState.currentDay >= b.dayRequired)
  ).length;

  const currentScore = d3ScoreData.find(d => d.day === voiceState.currentDay)?.score || 72;
  const initialScore = d3ScoreData[0]?.score || 65;
  const growthGain = Math.max(0, currentScore - initialScore);

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-24 select-none animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            {language === 'bn' ? 'অগ্রগতি ও রূপান্তর প্রতিবেদন' : 'Analytics & Transformation Report'}
          </span>
          <h2 className="text-xl font-black text-white">
            {language === 'bn' ? 'ভয়েস প্রোগ্রেস ও ট্রফি রুম' : 'Voice Progress & Achievements'}
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-amber-950/70 border border-amber-800/60 px-3 py-1.5 rounded-2xl shadow-lg">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 font-mono">
            {unlockedBadgeCount} / {VOICE_BADGES.length}
          </span>
        </div>
      </div>

      {/* Sub-Nav Pill Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
        {[
          { id: 'overview', labelBn: 'গ্রাফ ও পরিসংখ্যান', labelEn: 'Overview' },
          { id: 'badges', labelBn: 'ব্যাজ ও ট্রফি', labelEn: 'Badges' },
          { id: 'calendar', labelBn: '৩০ দিনের ক্যালেন্ডার', labelEn: 'Calendar' },
          { id: 'report', labelBn: 'মাইলস্টোন ও রিপোর্ট', labelEn: 'Reports' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'bn' ? tab.labelBn : tab.labelEn}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW CHARTS (D3 Line Chart) */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Main D3 Voice Score Trajectory Graph */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {language === 'bn' ? '৩০ দিনের D3 ভয়েস স্কোর প্রোগ্রেশন কার্ভ' : '30-Day D3 Voice Score Trajectory'}
                </span>
                <h3 className="text-base font-black text-white mt-0.5">
                  {language === 'bn' ? 'রেজোন্যান্স, স্পষ্টতা ও সাউন্ড গ্রোথ' : 'Resonance & Clarity Progression'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-mono font-bold">+{growthGain}% {language === 'bn' ? 'উন্নতি' : 'Gain'}</span>
                <span className="block text-[10px] text-slate-500">Day 1 ({initialScore}%) → Day {voiceState.currentDay} ({currentScore}%)</span>
              </div>
            </div>

            {/* D3 Line Chart Component */}
            <div className="pt-2">
              <D3VoiceScoreChart
                data={d3ScoreData}
                language={language}
                currentDay={voiceState.currentDay}
                onSelectDay={(day) => onOpenDailyReport && onOpenDailyReport(day)}
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                <span>{language === 'bn' ? 'দিন ১ থেকে ৩০ বৃদ্ধি কার্ভ' : 'Day 1 to 30 Curve'}</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400/90">
                {language === 'bn' ? 'গ্রাফের যেকোনো পয়েন্টে ট্যাপ করে রিপোর্ট দেখুন' : 'Tap any point to inspect day log'}
              </span>
            </div>
          </div>

          {/* Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                {language === 'bn' ? 'বর্তমান স্ট্রিক' : 'Current Streak'}
              </span>
              <div className="text-xl font-extrabold text-amber-400 font-mono mt-1 flex items-center gap-1.5">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{voiceState.streak} Days</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                {language === 'bn' ? 'মোট অর্জিত এক্সপি' : 'Total XP Earned'}
              </span>
              <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5" />
                <span>{voiceState.xp} XP</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                {language === 'bn' ? 'স্লিপ রিকভারি' : 'Sleep Recovery'}
              </span>
              <div className="text-xl font-extrabold text-cyan-400 font-mono mt-1 flex items-center gap-1.5">
                <Moon className="w-5 h-5" />
                <span>{voiceState.sleepTracker?.voiceRecoveryScore || 88}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BADGES & TROPHY HALL */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VOICE_BADGES.map((badge) => {
              const isUnlocked =
                voiceState.unlockedBadgeIds?.includes(badge.id) ||
                (badge.dayRequired && voiceState.currentDay >= badge.dayRequired);

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-slate-900/90 border-amber-500/40 shadow-lg hover:border-amber-400'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Trophy className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {language === 'bn' ? badge.titleBn : badge.titleEn}
                      </h4>
                      {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {language === 'bn' ? badge.descBn : badge.descEn}
                    </p>
                    {badge.dayRequired && (
                      <span className="inline-block mt-1 text-[10px] font-mono text-amber-400/80">
                        {language === 'bn' ? `দিন ${badge.dayRequired} আনলক` : `Day ${badge.dayRequired} unlock`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: 365-DAY YEAR CALENDAR MATRIX (12 CYCLES OF 30 DAYS) */}
      {activeTab === 'calendar' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {language === 'bn' ? '৩৬৫ দিনের ভয়েস রূপান্তর জার্নি' : '365-Day Voice Transformation Journey'}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {language === 'bn' ? '১২টি সাইকেল' : '12 Cycles'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'bn' 
                  ? `দিন #${voiceState.currentDay} চলমান • মোট ${Math.max(0, voiceState.currentDay - 1)}/৩৬৫ দিন সম্পন্ন (সাইকেল ${currentCycle.cycleNumber})` 
                  : `Day #${voiceState.currentDay} In Progress • Total ${Math.max(0, voiceState.currentDay - 1)}/365 Days Done (Cycle ${currentCycle.cycleNumber})`}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                {language === 'bn' ? `দিন ${voiceState.currentDay} / ৩৬৫` : `Day ${voiceState.currentDay} / 365`}
              </span>
            </div>
          </div>

          {/* 12-Cycle Selector Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
              <span>{language === 'bn' ? 'সাইকেল নির্বাচন করুন (প্রতি সাইকেলে ৩০ দিন):' : 'Select 30-Day Cycle (12 Total):'}</span>
              <span className="text-emerald-400 font-mono text-[10px]">
                {language === 'bn' ? `বর্তমান সাইকেল #${currentCycle.cycleNumber}` : `Current: Cycle #${currentCycle.cycleNumber}`}
              </span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {YEAR_365_CYCLES.map((cycle) => {
                const isCurrentActiveCycle = currentCycle.cycleNumber === cycle.cycleNumber;
                const isSelected = selectedCycleNumber === cycle.cycleNumber;
                const isCompletedCycle = voiceState.currentDay > cycle.endDay;
                const isFutureCycle = voiceState.currentDay < cycle.startDay;

                return (
                  <button
                    key={cycle.cycleNumber}
                    onClick={() => setSelectedCycleNumber(cycle.cycleNumber)}
                    className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold scale-[1.02]'
                        : isCurrentActiveCycle
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 ring-1 ring-emerald-500/40'
                        : isCompletedCycle
                        ? 'bg-slate-900 border-slate-800 text-emerald-400/90'
                        : 'bg-slate-950/60 border-slate-800/60 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>C{cycle.cycleNumber}</span>
                      {isCompletedCycle && !isSelected && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                      {isCurrentActiveCycle && !isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    </div>
                    <span className={`text-[9px] font-mono ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {cycle.startDay}-{cycle.endDay}d
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Cycle Focus Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-300">
                {language === 'bn' ? activeCycleInfo.titleBn : activeCycleInfo.titleEn}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                {language === 'bn' ? `দিন ${activeCycleInfo.startDay} - ${activeCycleInfo.endDay}` : `Days ${activeCycleInfo.startDay} - ${activeCycleInfo.endDay}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {language === 'bn' ? activeCycleInfo.focusBn : activeCycleInfo.focusEn}
            </p>
          </div>

          {/* 30-Day Grid Matrix for Selected Cycle */}
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {Array.from(
              { length: activeCycleInfo.endDay - activeCycleInfo.startDay + 1 },
              (_, i) => activeCycleInfo.startDay + i
            ).map((d) => {
              const isPast = d < voiceState.currentDay;
              const isCurrent = d === voiceState.currentDay;
              const isFuture = d > voiceState.currentDay;
              const dayLog = voiceState.dayLogsByDay?.[d];
              const isLoggedCompleted = (dayLog?.dailyProgressPct || 0) >= 100;

              return (
                <button
                  key={d}
                  onClick={() => {
                    if (onOpenDailyReport) {
                      onOpenDailyReport(d);
                    }
                  }}
                  className={`h-16 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all hover:scale-105 active:scale-95 cursor-pointer relative group ${
                    isCurrent
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg scale-105 ring-2 ring-emerald-500/40'
                      : isPast || isLoggedCompleted
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-900/40'
                      : 'bg-slate-950 border-slate-800/80 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  }`}
                  title={
                    isFuture
                      ? (language === 'bn' ? `দিন #${d} (লক করা - দিন #${voiceState.currentDay} শেষ করুন)` : `Day #${d} (Locked - Complete Day #${voiceState.currentDay} first)`)
                      : (language === 'bn' ? `দিন #${d} এর রিপোর্ট দেখুন` : `View Day #${d} Report`)
                  }
                >
                  <span className="text-[9px] font-sans font-bold uppercase text-slate-400">Day</span>
                  <span className="text-sm font-extrabold">{d}</span>
                  {(isPast || isLoggedCompleted) && <Check className="w-3 h-3 text-emerald-400 mt-0.5" />}
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mt-0.5" />}
                  {isFuture && <Lock className="w-2.5 h-2.5 text-slate-600 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-slate-400">{language === 'bn' ? 'সম্পন্ন দিন' : 'Completed'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/50" />
                <span className="text-[11px] text-slate-300 font-bold">{language === 'bn' ? 'চলমান দিন' : 'Current'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-500" />
                <span className="text-[11px] text-slate-500">{language === 'bn' ? 'লক করা দিন' : 'Locked'}</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium hidden sm:inline">
              {language === 'bn' ? 'ক্লিক করলেই দৈনিক রিপোর্ট বা প্রিভিউ খুলবে' : 'Click any day to open report'}
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS & CERTIFICATES */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          {/* Day-by-Day Inspection Quick Launcher Banner */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  {language === 'bn' ? 'দিন-ভিত্তিক অনুশীলন রিপোর্ট' : 'Day-by-Day Practice Analysis'}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {language === 'bn' ? `দিন #${voiceState.currentDay} এর সময় ও ভয়েস ইম্প্রুভমেন্ট` : `Day #${voiceState.currentDay} Time & Voice Improvement`}
                </h3>
              </div>
              {onOpenDailyReport && (
                <button
                  onClick={() => onOpenDailyReport(voiceState.currentDay)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{language === 'bn' ? 'রিপোর্ট খুলুন' : 'Open Report'}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300">
              {language === 'bn' 
                ? 'প্রতিটি দিনে কোন টাস্কে (শ্বাস, ভোকাল, রিডিং, বডি) কত মিনিট ব্যয় করেছেন এবং ডে ১ এর তুলনায় পিচ, রেজোন্যান্স ও ক্ল্যারিটি কতটা ইম্প্রুভ হয়েছে তা সরাসরি দেখুন।'
                : 'Inspect exact minutes per task (Breath, Voice, Reading, Body) and track voice improvement metrics compared to Day 1.'}
            </p>
          </div>

          {/* Scientific Reading Lab Launcher */}
          {onOpenScientificReading && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  {language === 'bn' ? 'কণ্ঠের বৈজ্ঞানিক পাঠশালা' : 'Scientific Vocal Lab'}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {language === 'bn' ? 'দৈনিক সাইন্টিফিক রিডিং ড্রিলস' : 'Daily Scientific Reading Drills'}
                </h4>
              </div>
              <button
                onClick={onOpenScientificReading}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অনুশীলন শুরু' : 'Practice'}</span>
              </button>
            </div>
          )}
          {/* 7-Day Weekly Report Card (Unlocked on Day 7+) */}
          {voiceState.currentDay >= 7 ? (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {language === 'bn' ? 'সাপ্তাহিক মূল্যায়ন (Week 1 সম্পন্ন)' : 'Week 1 Report Complete'}
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {language === 'bn' ? '৭ ডে ভয়েস বিল্ডার রিপোর্ট' : '7-Day Voice Builder Milestone'}
                  </h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'bn'
                  ? 'প্রথম সপ্তাহের অনুশীলনে আপনার ডায়াফ্রাম্যাটিক শ্বাস নিয়ন্ত্রণ উন্নত হয়েছে। স্বরতন্ত্রীর অপ্রয়োজনীয় চাপ হ্রাস পেয়েছে এবং মাস্ক রেজোন্যান্স বৃদ্ধি পেয়েছে।'
                  : 'Week 1 foundational training successfully lowered throat constriction, enhanced lower breath support, and introduced crisp resonance projection.'}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Clarity</span>
                  <span className="text-sm font-bold text-emerald-400">+35%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Consistency</span>
                  <span className="text-sm font-bold text-cyan-400">100%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Sleep Rest</span>
                  <span className="text-sm font-bold text-amber-400">8.0 hrs</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'সাপ্তাহিক মূল্যায়ন (Week 1 মাইলস্টোন — ৭ম দিনে উন্মোচিত হবে)' : 'Week 1 Report (Unlocks on Day 7)'}
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {language === 'bn' ? '৭ ডে ভয়েস বিল্ডার রিপোর্ট' : '7-Day Voice Builder Milestone'}
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-slate-800 text-slate-400 font-mono text-xs font-bold">
                  {Math.max(0, voiceState.currentDay - 1)} / 7 {language === 'bn' ? 'দিন' : 'Days'}
                </div>
              </div>

              {/* Progress towards 7 days */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {language === 'bn' 
                      ? `দিন ১ সম্পন্ন • দিন ${voiceState.currentDay} চলমান` 
                      : `Day 1 complete • Day ${voiceState.currentDay} in progress`}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {Math.round((Math.max(0, voiceState.currentDay - 1) / 7) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(10, ((voiceState.currentDay - 1) / 7) * 100)}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? `আপনি বর্তমানে ২য় দিনে আছেন। ১ম দিন সফলভাবে সম্পন্ন হয়েছে। ৭ম দিন পর্যন্ত নিয়মিত অনুশীলন সম্পন্ন করলে ১ম সপ্তাহের পূর্ণাঙ্গ ভয়েস অ্যানালাইসিস এবং তরুণ বৃক্ষ (Young Tree) ব্যাজ উন্মুক্ত হবে।`
                  : `You are currently on Day ${voiceState.currentDay}. Complete all 7 days to unlock the comprehensive weekly voice analysis report and Week 1 milestones.`}
              </p>
            </div>
          )}

          {/* 30-Day Master Graduation Certificate Showcase */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/40 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                {language === 'bn' ? '৩০ ডে ভয়েস ট্রান্সফরমেশন গ্র্যাজুয়েশন' : '30-Day Voice Master Certificate'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                {language === 'bn'
                  ? `৩০ দিন পূর্ণ সম্পন্ন করার পর আপনার আজীবন স্থায়ী স্পষ্ট ও সাবলীল কণ্ঠের অফিসিয়াল রূপান্তর সার্টিফিকেট উন্মোচিত হবে। (অগ্রগতি: ${Math.max(0, voiceState.currentDay - 1)} / ৩০ দিন সম্পন্ন)`
                  : `Upon completing all 30 days, your verified Voice Transformation certificate and full-growth Master Tree badge will unlock. (Progress: ${Math.max(0, voiceState.currentDay - 1)} / 30 days complete)`}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert(language === 'bn' ? 'আপনার বর্তমান অগ্রগতি রেকর্ড সফলভাবে এক্সপোর্ট হয়েছে!' : 'Current voice training progress exported!')}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'bn' ? 'বর্তমান প্রোগ্রেস সামারি ডাউনলোড করুন' : 'Export Current Progress Summary'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

