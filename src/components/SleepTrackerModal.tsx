import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Moon, Sun, Check, Heart, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { Language } from '../types/voice';

interface SleepTrackerModalProps {
  language: Language;
  bedTime: string;
  wakeTime: string;
  onSave: (bedTime: string, wakeTime: string, duration: number, recoveryScore: number) => void;
  onClose: () => void;
}

export function SleepTrackerModal({
  language,
  bedTime: initialBedTime,
  wakeTime: initialWakeTime,
  onSave,
  onClose
}: SleepTrackerModalProps) {
  const [bedTime, setBedTime] = useState(initialBedTime || '22:30');
  const [wakeTime, setWakeTime] = useState(initialWakeTime || '06:30');

  // Calculate duration in hours
  const calculateDuration = (b: string, w: string) => {
    const [bH, bM] = b.split(':').map(Number);
    const [wH, wM] = w.split(':').map(Number);
    let bedMinutes = bH * 60 + bM;
    let wakeMinutes = wH * 60 + wM;
    if (wakeMinutes <= bedMinutes) {
      wakeMinutes += 24 * 60; // next day
    }
    const diffHours = (wakeMinutes - bedMinutes) / 60;
    return Math.round(diffHours * 10) / 10;
  };

  const duration = calculateDuration(bedTime, wakeTime);

  // Recovery score calculation
  const recoveryScore = Math.min(
    100,
    Math.round(
      duration >= 7 && duration <= 9
        ? 95
        : duration >= 6
        ? 80
        : duration >= 5
        ? 65
        : 50
    )
  );

  const handleSave = () => {
    onSave(bedTime, wakeTime, duration, recoveryScore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {language === 'bn' ? 'স্লিপ ট্র্যাকার ও ভয়েস রিকভারি' : 'Sleep Tracker & Vocal Rest'}
              </h3>
              <span className="text-xs text-slate-400">
                {language === 'bn' ? 'কণ্ঠের স্বাস্থ্যের জন্য গভীর ঘুম অপরিহার্য' : 'Restorative sleep rejuvenates vocal cords'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'bn' ? 'ঘুমানোর সময়' : 'Bedtime'}</span>
            </div>
            <input
              type="time"
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="w-full bg-transparent font-mono text-xl font-bold text-white focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'ঘুম ভাঙার সময়' : 'Wakeup Time'}</span>
            </div>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full bg-transparent font-mono text-xl font-bold text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Calculated Stats Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-800/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              {language === 'bn' ? 'ঘুমের মোট সময়' : 'Total Duration'}
            </span>
            <div className="text-xl font-black text-white font-mono">{duration} Hours</div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              {language === 'bn' ? 'ভয়েস রিকভারি স্কোর' : 'Recovery Score'}
            </span>
            <div className="text-xl font-black text-emerald-400 font-mono">{recoveryScore}%</div>
          </div>
        </div>

        {/* Voice Health Guidance Note */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1 leading-relaxed">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ভয়েস রেস্ট টিপস:' : 'Vocal Health Advice:'}</span>
          </div>
          <p>
            {language === 'bn'
              ? 'ঘুমানোর ৩০ মিনিট আগে হালকা গরম পানি বা স্বাভাবিক পানি পান করুন। ঘুমের সময় স্বরতন্ত্রীর টিস্যু পুনর্গঠিত হয়।'
              : 'Hydrate well before sleeping. During deep sleep, vocal fold mucosa repairs micro-fatigue.'}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all"
        >
          <Check className="w-4 h-4" />
          <span>{language === 'bn' ? 'স্লিপ ডাটা সেভ করুন' : 'Save Sleep Data'}</span>
        </button>
      </div>
    </div>
  );
}
