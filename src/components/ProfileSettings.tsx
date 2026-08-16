import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Calendar, 
  Clock, 
  Volume2, 
  ShieldAlert, 
  Check, 
  Sparkles, 
  Sun, 
  Moon,
  RotateCcw
} from 'lucide-react';
import { VoiceState, Language } from '../types/voice';

interface ProfileSettingsProps {
  voiceState: VoiceState;
  onUpdateState: (partial: Partial<VoiceState>) => void;
}

export function ProfileSettings({ voiceState, onUpdateState }: ProfileSettingsProps) {
  const [userName, setUserName] = useState(voiceState.userName || 'Sohan');
  const [language, setLanguage] = useState<Language>(voiceState.language || 'bn');
  const [selectedDay, setSelectedDay] = useState(voiceState.currentDay || 1);
  const [morningTime, setMorningTime] = useState(voiceState.scheduleTimes?.morning || '08:00');
  const [afternoonTime, setAfternoonTime] = useState(voiceState.scheduleTimes?.afternoon || '13:00');
  const [eveningTime, setEveningTime] = useState(voiceState.scheduleTimes?.evening || '17:00');
  const [nightTime, setNightTime] = useState(voiceState.scheduleTimes?.night || '21:00');
  const [skyTheme, setSkyTheme] = useState(voiceState.skyTheme || 'auto');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    // Calculate new treeLevel based on selectedDay
    let treeLevel: 1 | 2 | 3 | 4 | 5 | 6 = 1;
    if (selectedDay >= 30) treeLevel = 6;
    else if (selectedDay >= 21) treeLevel = 5;
    else if (selectedDay >= 14) treeLevel = 4;
    else if (selectedDay >= 7) treeLevel = 3;
    else if (selectedDay >= 3) treeLevel = 2;

    onUpdateState({
      userName,
      language,
      currentDay: selectedDay,
      treeLevel,
      skyTheme,
      scheduleTimes: {
        ...voiceState.scheduleTimes,
        morning: morningTime,
        afternoon: afternoonTime,
        evening: eveningTime,
        night: nightTime
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetProgress = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে আপনার অগ্রগতি রিসেট করে দিন ১ এ ফিরতে চান?' : 'Reset progress to Day 1?')) {
      onUpdateState({
        currentDay: 1,
        treeLevel: 1,
        streak: 1,
        xp: 100,
        unlockedBadgeIds: ['badge_day_1']
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-28 select-none animate-fade-in">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
          {language === 'bn' ? 'ইউজার সেটিংস ও প্রেফারেন্স' : 'Profile & Preferences'}
        </span>
        <h2 className="text-xl font-black text-white">
          {language === 'bn' ? 'প্রোফাইল ও শিডিউল কাস্টমাইজেশন' : 'Voice Training Settings'}
        </h2>
      </div>

      {/* User Info Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            {userName ? userName[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase block">
              {language === 'bn' ? 'ব্যবহারকারীর নাম' : 'User Name'}
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 mt-1"
            />
          </div>
        </div>

        {/* Language Selection */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
            {language === 'bn' ? 'ভাষা নির্বাচন (Language)' : 'App Language'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('bn')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                language === 'bn'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>বাংলা (Bengali)</span>
            </button>

            <button
              onClick={() => setLanguage('en')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                language === 'en'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>English</span>
            </button>
          </div>
        </div>
      </div>

      {/* Day Jumper / Demo Selector Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {language === 'bn' ? 'বর্তমান দিন নির্ধারণ (Day Jumper)' : 'Set Active Training Day'}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">Day {selectedDay} / 30</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {language === 'bn'
            ? 'যেকোনো দিনের সিলেবাস ও বৃক্ষের বিভিন্ন বৃদ্ধি স্তর পরীক্ষা করতে নিচের স্লাইডার পরিবর্তন করুন।'
            : 'Slide to test different tree growth stages, scripts, and syllabus levels.'}
        </p>

        <input
          type="range"
          min="1"
          max="30"
          value={selectedDay}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
          className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Day 1 (Seed)</span>
          <span>Day 7 (Young)</span>
          <span>Day 14 (Growing)</span>
          <span>Day 21 (Strong)</span>
          <span>Day 30 (Master)</span>
        </div>
      </div>

      {/* Daily Schedule Alarms */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">
            {language === 'bn' ? '৪টি দৈনিক রুটিন সময়সূচী' : 'Daily Schedule Alarms'}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Morning Activation</span>
            <input
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              className="bg-transparent font-mono text-sm font-bold text-white w-full focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Afternoon Articulation</span>
            <input
              type="time"
              value={afternoonTime}
              onChange={(e) => setAfternoonTime(e.target.value)}
              className="bg-transparent font-mono text-sm font-bold text-white w-full focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Evening RJ Studio</span>
            <input
              type="time"
              value={eveningTime}
              onChange={(e) => setEveningTime(e.target.value)}
              className="bg-transparent font-mono text-sm font-bold text-white w-full focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Night Recovery</span>
            <input
              type="time"
              value={nightTime}
              onChange={(e) => setNightTime(e.target.value)}
              className="bg-transparent font-mono text-sm font-bold text-white w-full focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Atmospheric Sky Atmosphere Selector */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {language === 'bn' ? 'সিনেমাটিক আকাশ আবহ (Sky Atmosphere)' : 'Atmospheric Sky Theme'}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'auto', labelBn: 'অটো (ঘড়ির সময়)', labelEn: 'Auto (Live)' },
            { id: 'morning', labelBn: 'ভোর (Sunrise)', labelEn: 'Sunrise' },
            { id: 'afternoon', labelBn: 'দুপুর (Day)', labelEn: 'Daylight' },
            { id: 'evening', labelBn: 'সন্ধ্যা (Sunset)', labelEn: 'Sunset' },
            { id: 'night', labelBn: 'রাত (Cosmic)', labelEn: 'Cosmic' }
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSkyTheme(theme.id as any)}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                skyTheme === theme.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? theme.labelBn : theme.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Safety & Medical Guidance Note */}
      <div className="p-4 rounded-3xl bg-amber-950/25 border border-amber-800/40 text-xs text-slate-300 space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>{language === 'bn' ? 'ভোকাল স্বাস্থ্য ও নিরাপত্তা নীতি' : 'Vocal Health & Safety Rules'}</span>
        </div>
        <p>
          {language === 'bn'
            ? '১. এই অ্যাপ কখনোই জোর করে কণ্ঠ ভারী করার নির্দেশ দেয় না। সব অনুশীলন সম্পূর্ণ শিথিলতায় করতে হবে।\n২. গলা ব্যথা, শুষ্কতা বা ক্লান্তি লাগলে অবিলম্বে এক্সারসাইজ বন্ধ করে স্বাভাবিক পানি পান করুন ও বিশ্রাম নিন।'
            : '1. Never force vocal heaviness or pitch strain.\n2. In case of vocal fatigue or persistent hoarseness, stop exercises immediately and consult an ENT specialist.'}
        </p>
      </div>

      {/* Save Settings Action Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all"
        >
          <Check className="w-4 h-4" />
          <span>{savedSuccess ? (language === 'bn' ? 'সেভ সম্পন্ন হয়েছে!' : 'Saved Successfully!') : (language === 'bn' ? 'সেটিংস সেভ করুন' : 'Save Preferences')}</span>
        </button>

        <button
          onClick={handleResetProgress}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          title="Reset Progress"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
