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
  Settings
} from 'lucide-react';
import { DayCurriculum, SessionPlan, Language, VoiceState } from '../types/voice';
import { getCurriculumForDay } from '../data/voiceCurriculum';
import { BookOpen, BarChart3, Wind, Volume2, Activity } from 'lucide-react';

interface TrainingViewProps {
  currentDay: number;
  voiceState: VoiceState;
  language: Language;
  onSelectDay: (day: number) => void;
  onOpenSession: (session: SessionPlan) => void;
  onOpenDailyReport?: (day: number) => void;
  onOpenScientificReading?: () => void;
}

export function TrainingView({
  currentDay,
  voiceState,
  language,
  onSelectDay,
  onOpenSession,
  onOpenDailyReport,
  onOpenScientificReading
}: TrainingViewProps) {
  const [activeDay, setActiveDay] = useState(currentDay);
  const curriculum = getCurriculumForDay(activeDay);

  const todayKey = new Date().toISOString().split('T')[0];
  const dayLog = voiceState.dayLogsByDay?.[activeDay] || voiceState.todayLogs[todayKey];

  const timeBreakdown = dayLog?.timeBreakdown || {
    breathSeconds: (dayLog?.breathCompleted ? 8 * 60 : 0) + (activeDay <= voiceState.currentDay ? 240 : 0),
    voiceSeconds: (dayLog?.voiceCompleted ? 14 * 60 : 0) + (activeDay <= voiceState.currentDay ? 420 : 0),
    bodySeconds: (dayLog?.bodyCompleted ? 6 * 60 : 0) + (activeDay <= voiceState.currentDay ? 180 : 0),
    readingSeconds: (dayLog?.sessionsCompleted?.afternoon ? 10 * 60 : 0) + (activeDay <= voiceState.currentDay ? 300 : 0),
    recoverySeconds: (dayLog?.recoveryCompleted ? 8 * 60 : 0) + (activeDay <= voiceState.currentDay ? 240 : 0),
    totalSeconds: 0
  };

  const totalMin = Math.floor(
    (timeBreakdown.breathSeconds + timeBreakdown.voiceSeconds + timeBreakdown.bodySeconds + timeBreakdown.readingSeconds + timeBreakdown.recoverySeconds) / 60
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-24 select-none animate-fade-in">
      {/* Top Header & Day Selector Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              {language === 'bn' ? '৩০ দিনের পূর্ণাঙ্গ সিলেবাস' : '30-Day Transformation Curriculum'}
            </span>
            <h2 className="text-xl font-black text-white">
              {language === 'bn' ? `দিন ${activeDay}: ${curriculum.stageNameBn}` : `Day ${activeDay}: ${curriculum.stageNameEn}`}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => {
                const nextD = Math.max(1, activeDay - 1);
                setActiveDay(nextD);
                onSelectDay(nextD);
              }}
              disabled={activeDay <= 1}
              className="p-2 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-emerald-400 px-1.5">
              {activeDay} / 30
            </span>
            <button
              onClick={() => {
                const nextD = Math.min(30, activeDay + 1);
                setActiveDay(nextD);
                onSelectDay(nextD);
              }}
              disabled={activeDay >= 30}
              className="p-2 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 30-Day Horizontal Timeline Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none py-1">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
            const isCurrent = d === currentDay;
            const isSelected = d === activeDay;
            return (
              <button
                key={d}
                onClick={() => {
                  setActiveDay(d);
                  onSelectDay(d);
                }}
                className={`shrink-0 w-9 h-11 rounded-xl flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-lg scale-105'
                    : isCurrent
                    ? 'bg-slate-800 border-2 border-emerald-400 text-emerald-400'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-[9px] uppercase font-sans">D</span>
                <span>{d}</span>
              </button>
            );
          })}
        </div>
      </div>

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
            {language === 'bn' ? 'আজকের মূল ফোকাস' : "Today's Theme & Focus"}
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
          isDone={activeDay === currentDay && !!dayLog?.sessionsCompleted?.morning}
          onStart={() => onOpenSession(curriculum.sessions.morning)}
        />

        {/* Afternoon Session */}
        <SessionCard
          session={curriculum.sessions.afternoon}
          language={language}
          customTime={voiceState.scheduleTimes?.afternoon}
          isDone={activeDay === currentDay && !!dayLog?.sessionsCompleted?.afternoon}
          onStart={() => onOpenSession(curriculum.sessions.afternoon)}
        />

        {/* Evening RJ Session */}
        <SessionCard
          session={curriculum.sessions.evening}
          language={language}
          customTime={voiceState.scheduleTimes?.evening}
          isDone={activeDay === currentDay && !!dayLog?.sessionsCompleted?.evening}
          onStart={() => onOpenSession(curriculum.sessions.evening)}
        />

        {/* Night Recovery Session */}
        <SessionCard
          session={curriculum.sessions.night}
          language={language}
          customTime={voiceState.scheduleTimes?.night}
          isDone={activeDay === currentDay && !!dayLog?.sessionsCompleted?.night}
          onStart={() => onOpenSession(curriculum.sessions.night)}
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
  onStart: () => void;
}

function SessionCard({ session, language, customTime, isDone, onStart }: SessionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden transition-all hover:border-slate-700">
      {/* Session Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 shrink-0">
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
          <button
            onClick={onStart}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'bn' ? 'শুরু করুন' : 'Start'}</span>
          </button>
        </div>
      </div>

      {/* Exercises Step List Toggle */}
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
