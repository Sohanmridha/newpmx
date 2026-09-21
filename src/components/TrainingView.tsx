import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sun, 
  Sparkles, 
  Mic, 
  Moon, 
  Clock, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Calendar, 
  ArrowLeft, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Settings,
  Lock,
  BookOpen,
  BarChart3,
  Wind,
  Volume2,
  Activity,
  Check
} from 'lucide-react';
import { DayCurriculum, SessionPlan, Language, VoiceState } from '../types/voice';
import { getCurriculumForDay, YEAR_365_CYCLES, getYearCycleForDay } from '../data/voiceCurriculum';

interface TrainingViewProps {
  currentDay: number;
  voiceState: VoiceState;
  language: Language;
  onOpenSession: (session: SessionPlan) => void;
  onOpenDailyReport?: (day: number) => void;
  onOpenScientificReading?: () => void;
  onAdvanceNextDay?: () => void;
}

export function TrainingView({
  currentDay,
  voiceState,
  language,
  onOpenSession,
  onOpenDailyReport,
  onOpenScientificReading,
  onAdvanceNextDay
}: TrainingViewProps) {
  const [activeDay, setActiveDay] = useState<number>(currentDay);
  const activeCycle = getYearCycleForDay(activeDay);
  const [selectedCycleNum, setSelectedCycleNum] = useState<number>(activeCycle.cycleNumber);

  const curriculum = getCurriculumForDay(activeDay);

  const todayKey = new Date().toISOString().split('T')[0];
  const dayLog = voiceState.dayLogsByDay?.[activeDay] || (activeDay === voiceState.currentDay ? voiceState.todayLogs[todayKey] : undefined);

  const isPastDay = activeDay < voiceState.currentDay;
  const isCurrentDay = activeDay === voiceState.currentDay;
  const isFutureDay = activeDay > voiceState.currentDay;

  // Real logged time (clean 0 if nothing recorded yet)
  const timeBreakdown = dayLog?.timeBreakdown || {
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

  // Check if today is 100% completed
  const completedSessionsCount = [
    dayLog?.sessionsCompleted?.morning,
    dayLog?.sessionsCompleted?.afternoon,
    dayLog?.sessionsCompleted?.evening,
    dayLog?.sessionsCompleted?.night
  ].filter(Boolean).length;

  const isTodayAllDone = isCurrentDay && (completedSessionsCount >= 4 || (dayLog?.dailyProgressPct || 0) >= 100);

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-24 select-none animate-fade-in">
      {/* Top Header & 365-Day Cycle Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                {language === 'bn' ? `সাইকেল #${activeCycle.cycleNumber} (৩৬৫ দিনের জার্নি)` : `Cycle #${activeCycle.cycleNumber} (365-Day Journey)`}
              </span>
              {isPastDay && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
                </span>
              )}
              {isCurrentDay && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-black animate-pulse">
                  {language === 'bn' ? 'আজকের দিন' : 'Today'}
                </span>
              )}
              {isFutureDay && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  {language === 'bn' ? 'লক করা' : 'Locked'}
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-white">
              {language === 'bn' ? `দিন ${activeDay}: ${curriculum.stageNameBn}` : `Day ${activeDay}: ${curriculum.stageNameEn}`}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => {
                const nextD = Math.max(1, activeDay - 1);
                setActiveDay(nextD);
              }}
              disabled={activeDay <= 1}
              className="p-2 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-emerald-400 px-1.5">
              {activeDay} / 365
            </span>
            <button
              onClick={() => {
                const nextD = Math.min(365, activeDay + 1);
                setActiveDay(nextD);
              }}
              disabled={activeDay >= 365}
              className="p-2 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 12 Cycle Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {YEAR_365_CYCLES.map((c) => {
            const isSel = selectedCycleNum === c.cycleNumber;
            const isCur = activeCycle.cycleNumber === c.cycleNumber;
            return (
              <button
                key={c.cycleNumber}
                onClick={() => {
                  setSelectedCycleNum(c.cycleNumber);
                  setActiveDay(c.startDay);
                }}
                className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  isSel
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : isCur
                    ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                C{c.cycleNumber} ({c.startDay}-{c.endDay}d)
              </button>
            );
          })}
        </div>

        {/* Days in Selected Cycle */}
        {(() => {
          const currentCycleData = YEAR_365_CYCLES.find(c => c.cycleNumber === selectedCycleNum) || activeCycle;
          return (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none py-1">
              {Array.from(
                { length: currentCycleData.endDay - currentCycleData.startDay + 1 },
                (_, i) => currentCycleData.startDay + i
              ).map((d) => {
                const isCurrent = d === currentDay;
                const isSelected = d === activeDay;
                const isPast = d < currentDay;
                const isFuture = d > currentDay;

                return (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`shrink-0 w-9 h-11 rounded-xl flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-lg scale-105'
                        : isCurrent
                        ? 'bg-slate-800 border-2 border-emerald-400 text-emerald-400'
                        : isPast
                        ? 'bg-slate-900/90 border border-slate-800 text-emerald-400/80 hover:border-slate-700'
                        : 'bg-slate-950/60 border border-slate-800/60 text-slate-500'
                    }`}
                  >
                    <span className="text-[8px] uppercase font-sans">D</span>
                    <span className="leading-tight">{d}</span>
                    {isPast && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />}
                    {isFuture && <Lock className="w-2 h-2 text-slate-600 absolute -top-0.5 -right-0.5" />}
                  </button>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Future Locked Alert Banner */}
      {isFutureDay && (
        <div className="p-4 rounded-3xl bg-amber-950/40 border border-amber-800/60 shadow-xl space-y-2 text-amber-200">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <h4 className="text-sm font-bold text-amber-300">
              {language === 'bn' ? `দিন #${activeDay} লক করা আছে` : `Day #${activeDay} is Locked`}
            </h4>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            {language === 'bn'
              ? `নিয়ম অনুযায়ী সামনের দিনের কাজ আগে থেকে সম্পন্ন করা যায় না। অনুগ্রহ করে বর্তমান দিনের (দিন #${currentDay}) সব সেশন সম্পন্ন করুন।`
              : `You cannot complete future days ahead of time. Please complete all 4 sessions for current day (Day #${currentDay}) first.`}
          </p>
          <button
            onClick={() => setActiveDay(currentDay)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all"
          >
            {language === 'bn' ? `আজকের দিন #${currentDay} তে ফিরে যান` : `Return to Today (Day #${currentDay})`}
          </button>
        </div>
      )}

      {/* Today Completed - Advance to Next Day Celebration */}
      {isTodayAllDone && onAdvanceNextDay && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-400/60 shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <h4 className="text-sm font-bold">
              {language === 'bn' ? `🎉 দারুণ! আজকের দিন #${currentDay} এর সব সেশন সম্পন্ন!` : `🎉 Awesome! Day #${currentDay} Completed!`}
            </h4>
          </div>
          <p className="text-xs text-emerald-200/80">
            {language === 'bn'
              ? `আপনি সফলভাবে আজকের সমস্ত কাজ শেষ করেছেন। পরবর্তী দিন (দিন #${currentDay + 1}) শুরু করতে নিচের বাটনে চাপুন।`
              : `All tasks for today are done. Advance to the next day when ready.`}
          </p>
          <button
            onClick={onAdvanceNextDay}
            className="w-full py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? `দিন #${currentDay + 1} শুরু করুন (Next Day)` : `Advance to Day #${currentDay + 1}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Scientific Reading Lab & Daily Report Action Bar */}
      <div className="grid grid-cols-2 gap-2.5">
        {onOpenScientificReading && (
          <button
            onClick={onOpenScientificReading}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/40 text-left hover:border-emerald-400 transition-all group shadow-md"
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {language === 'bn' ? 'বৈজ্ঞানিক রিডিং ল্যাব' : 'Scientific Reading'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">
              {language === 'bn' ? 'কণ্ঠের সুর ও পজ ড্রিল' : 'Resonance & Cadence'}
            </h4>
          </button>
        )}

        {onOpenDailyReport && (
          <button
            onClick={() => onOpenDailyReport(activeDay)}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-500/40 text-left hover:border-cyan-400 transition-all group shadow-md"
          >
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {language === 'bn' ? `দিন #${activeDay} রিপোর্ট` : `Day #${activeDay} Report`}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">
              {totalMin} min {language === 'bn' ? 'অনুশীলনের হিসাব' : 'Time Tracker'}
            </h4>
          </button>
        )}
      </div>

      {/* Day Focus Theme Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {language === 'bn' ? 'এই দিনের মূল ফোকাস' : "Day's Theme & Focus"}
          </span>
          <span className="text-[11px] font-mono text-slate-400">Stage {curriculum.treeStage}/6</span>
        </div>
        <h3 className="text-base font-extrabold text-white">
          {language === 'bn' ? curriculum.themeBn : curriculum.themeEn}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'bn' ? curriculum.focusPointBn : curriculum.focusPointEn}
        </p>
      </div>

      {/* 4 Detailed Sessions for the Day */}
      <div className="space-y-4">
        {/* Morning Session */}
        <SessionCard
          session={curriculum.sessions.morning}
          language={language}
          customTime={voiceState.scheduleTimes?.morning}
          isDone={isPastDay || (isCurrentDay && !!dayLog?.sessionsCompleted?.morning)}
          isLocked={isFutureDay}
          onStart={() => {
            if (!isFutureDay) onOpenSession(curriculum.sessions.morning);
          }}
        />

        {/* Afternoon Session */}
        <SessionCard
          session={curriculum.sessions.afternoon}
          language={language}
          customTime={voiceState.scheduleTimes?.afternoon}
          isDone={isPastDay || (isCurrentDay && !!dayLog?.sessionsCompleted?.afternoon)}
          isLocked={isFutureDay}
          onStart={() => {
            if (!isFutureDay) onOpenSession(curriculum.sessions.afternoon);
          }}
        />

        {/* Evening RJ Session */}
        <SessionCard
          session={curriculum.sessions.evening}
          language={language}
          customTime={voiceState.scheduleTimes?.evening}
          isDone={isPastDay || (isCurrentDay && !!dayLog?.sessionsCompleted?.evening)}
          isLocked={isFutureDay}
          onStart={() => {
            if (!isFutureDay) onOpenSession(curriculum.sessions.evening);
          }}
        />

        {/* Night Recovery Session */}
        <SessionCard
          session={curriculum.sessions.night}
          language={language}
          customTime={voiceState.scheduleTimes?.night}
          isDone={isPastDay || (isCurrentDay && !!dayLog?.sessionsCompleted?.night)}
          isLocked={isFutureDay}
          onStart={() => {
            if (!isFutureDay) onOpenSession(curriculum.sessions.night);
          }}
        />
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          {language === 'bn'
            ? 'নিয়ম: প্রতিটি এক্সারসাইজে কণ্ঠ সম্পূর্ণ রিলাক্সড থাকবে। কোনো জোর প্রয়োগ সম্পূর্ণ নিষিদ্ধ।'
            : 'Rule: Maintain total vocal relaxation. Never force artificial vocal heaviness.'}
        </span>
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: SessionPlan;
  language: Language;
  customTime?: string;
  isDone?: boolean;
  isLocked?: boolean;
  onStart: () => void;
}

function SessionCard({ session, language, customTime, isDone, isLocked, onStart }: SessionCardProps) {
  return (
    <div className={`rounded-3xl bg-slate-900/90 border shadow-xl overflow-hidden transition-all ${
      isLocked ? 'border-slate-800/60 opacity-60' : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Session Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl shrink-0 ${
            isLocked ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500/15 text-emerald-400'
          }`}>
            {session.id === 'morning' && <Sun className="w-5 h-5" />}
            {session.id === 'afternoon' && <Sparkles className="w-5 h-5" />}
            {session.id === 'evening' && <Mic className="w-5 h-5" />}
            {session.id === 'night' && <Moon className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {language === 'bn' ? session.titleBn : session.titleEn}
              </h3>
              {isDone && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                  {language === 'bn' ? 'সম্পন্ন' : 'Done'}
                </span>
              )}
              {isLocked && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  {language === 'bn' ? 'লক করা' : 'Locked'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {customTime || session.timeDefault}
              </span>
              <span>•</span>
              <span>{session.durationMinutes} min ({session.exercises.length} steps)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLocked ? (
            <div className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs flex items-center gap-1 cursor-not-allowed">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লক' : 'Locked'}</span>
            </div>
          ) : (
            <button
              onClick={onStart}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'bn' ? 'শুরু করুন' : 'Start'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Exercises Step List */}
      <div className="border-t border-slate-800/80 bg-slate-950/50 p-4 space-y-2.5">
        <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
          {language === 'bn' ? 'এই সেশনের ধাপসমূহ:' : 'Session Steps:'}
        </span>

        <div className="space-y-1.5">
          {session.exercises.map((ex, idx) => (
            <div
              key={ex.id}
              className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70 flex items-center justify-between text-xs text-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
                  {idx + 1}
                </span>
                <span className="font-semibold">{language === 'bn' ? ex.nameBn : ex.nameEn}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {Math.floor(ex.durationSec / 60)}m {ex.durationSec % 60 ? `${ex.durationSec % 60}s` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
