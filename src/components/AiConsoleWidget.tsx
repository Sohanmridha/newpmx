import React, { useState } from 'react';
import { AppState, HabitItem, SubjectItem, BadHabitItem } from '../types';
import { Settings, Plus, Trash2, CheckSquare, BookOpen, Flame, Clock } from 'lucide-react';

interface AiConsoleWidgetProps {
  state: AppState;
  onSaveState: (updated: AppState) => void;
  triggerCustomAlert: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export const AiConsoleWidget: React.FC<AiConsoleWidgetProps> = ({
  state,
  onSaveState,
  triggerCustomAlert
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'habits' | 'subjects' | 'badHabits'>('habits');
  
  // Good habits inputs
  const [habitName, setHabitName] = useState('');
  const [habitTime, setHabitTime] = useState<'Morning' | 'Night' | 'Anytime'>('Morning');

  // Study subjects inputs
  const [subjectName, setSubjectName] = useState('');
  const [subjectTarget, setSubjectTarget] = useState('60'); // default 60 mins

  // Bad habits inputs
  const [badHabitName, setBadHabitName] = useState('');

  // Save Good Habit
  const handleAddGoodHabit = () => {
    if (!habitName.trim()) {
      triggerCustomAlert(
        state.language === 'bn' ? 'দয়া করে অভ্যাসের একটি নাম লিখুন!' : 'Please fill out the habit name first!',
        'warning'
      );
      return;
    }
    
    const newId = 'habit_' + Date.now() + '_' + Math.floor(Math.random() * 100);
    const item: HabitItem = {
      id: newId,
      name: habitName.trim(),
      time: habitTime
    };

    const updated: AppState = {
      ...state,
      habits: [...state.habits, item]
    };

    onSaveState(updated);
    setHabitName('');
    triggerCustomAlert(
      state.language === 'bn' 
        ? `সফল! '${item.name}' সুঅভ্যাসটি যুক্ত করা হলো।` 
        : `Success! Added '${item.name}' good habit!`,
      'success'
    );
  };

  // Remove Good Habit
  const handleRemoveGoodHabit = (id: string, name: string) => {
    const updated: AppState = {
      ...state,
      habits: state.habits.filter(h => h.id !== id)
    };
    onSaveState(updated);
    triggerCustomAlert(
      state.language === 'bn' 
        ? `সফল! '${name}' সুঅভ্যাসটি মুছে ফেলা হয়েছে।` 
        : `Deleted good habit: '${name}'!`,
      'success'
    );
  };

  // Save Study Subject
  const handleAddSubject = () => {
    if (!subjectName.trim()) {
      triggerCustomAlert(
        state.language === 'bn' ? 'দয়া করে পড়ার বিষয়ের নাম লিখুন!' : 'Please enter the study subject name!',
        'warning'
      );
      return;
    }
    const mins = parseInt(subjectTarget, 10) || 60;
    
    const newId = 'sub_' + Date.now() + '_' + Math.floor(Math.random() * 100);
    const item: SubjectItem = {
      id: newId,
      name: subjectName.trim(),
      target: mins
    };

    const updated: AppState = {
      ...state,
      subjects: [...state.subjects, item]
    };

    onSaveState(updated);
    setSubjectName('');
    triggerCustomAlert(
      state.language === 'bn' 
        ? `সফল! নতুন পড়ার বিষয় '${item.name}' যুক্ত হলো।` 
        : `Success! Added '${item.name}' subject to studies!`,
      'success'
    );
  };

  // Remove Study Subject
  const handleRemoveSubject = (id: string, name: string) => {
    const updated: AppState = {
      ...state,
      subjects: state.subjects.filter(s => s.id !== id)
    };
    onSaveState(updated);
    triggerCustomAlert(
      state.language === 'bn' 
        ? `সফল! '${name}' বিষয়টি বাদ দেওয়া হয়েছে।` 
        : `Removed study subject: '${name}'`,
      'success'
    );
  };

  // Save Bad Habit
  const handleAddBadHabit = () => {
    if (!badHabitName.trim()) {
      triggerCustomAlert(
        state.language === 'bn' ? 'দয়া করে কুঅভ্যাসের বিবরণ লিখুন!' : 'Please define the bad habit name!',
        'warning'
      );
      return;
    }

    const newId = 'bad_' + Date.now() + '_' + Math.floor(Math.random() * 100);
    const item: BadHabitItem = {
      id: newId,
      name: badHabitName.trim(),
      quitAt: new Date().toISOString()
    };

    const updated: AppState = {
      ...state,
      badHabits: [...(state.badHabits || []), item]
    };

    onSaveState(updated);
    setBadHabitName('');
    triggerCustomAlert(
      state.language === 'bn' 
        ? `সফল! '${item.name}' কুঅভ্যাস বর্জন ট্র্যাকার চালু হয়েছে।` 
        : `Success! Activated quit-clock for '${item.name}'!`,
      'success'
    );
  };

  // Remove Bad Habit
  const handleRemoveBadHabit = (id: string, name: string) => {
    const updated: AppState = {
      ...state,
      badHabits: (state.badHabits || []).filter(b => b.id !== id)
    };
    onSaveState(updated);
    triggerCustomAlert(
      state.language === 'bn' 
        ? `কুঅভ্যাস ট্র্যাকার থেকে '${name}' বাদ দেওয়া হলো।` 
        : `Removed '${name}' from bad habits list!`,
      'success'
    );
  };

  return (
    <div className="bg-[#111622] rounded-2xl border border-blue-500/20 p-4 shadow-xl space-y-3 mt-2 mb-4 text-left">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-amber-400 animate-spin-slow" />
        <div>
          <h4 className="text-xs sm:text-sm font-black text-slate-100 uppercase tracking-wider font-sans">
            {state.language === 'bn' ? 'মৃধাক্স এআই কন্ট্রোল কনসোল' : 'MridhaX AI Smart Console'}
          </h4>
          <p className="text-[10px] text-slate-400">
            {state.language === 'bn' ? 'সরাসরি সেকশন গুলোর তালিকায় ডাটা যোগ অথবা রিমুভ করুন' : 'Directly insert/remove tracker entries voluntarily'}
          </p>
        </div>
      </div>

      {/* Tabs list grid */}
      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900">
        <button
          onClick={() => setActiveConsoleTab('habits')}
          className={`py-1.5 px-0.5 rounded-lg text-[10px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
            activeConsoleTab === 'habits' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-450 hover:text-white'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 shrink-0" />
          <span>{state.language === 'bn' ? 'সুঅভ্যাস' : 'Habits'}</span>
        </button>

        <button
          onClick={() => setActiveConsoleTab('subjects')}
          className={`py-1.5 px-0.5 rounded-lg text-[10px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
            activeConsoleTab === 'subjects' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-450 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span>{state.language === 'bn' ? 'পড়ার বিষয়' : 'Subjects'}</span>
        </button>

        <button
          onClick={() => setActiveConsoleTab('badHabits')}
          className={`py-1.5 px-0.5 rounded-lg text-[10px] sm:text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
            activeConsoleTab === 'badHabits' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-450 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 shrink-0" />
          <span>{state.language === 'bn' ? 'কুঅভ্যাস' : 'Q. Habits'}</span>
        </button>
      </div>

      {/* Habits Content Card panel */}
      {activeConsoleTab === 'habits' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className="flex gap-2 items-end bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
            <div className="flex-1 space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'নতুন অভ্যাসের নাম' : 'Habit Name Description'}</label>
              <input
                type="text"
                placeholder={state.language === 'bn' ? 'উদা: ৫ মিনিট সুরা তেলাওয়াত' : 'e.g. Read 5 pages'}
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
            <div className="w-20 space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'সময়' : 'Schedule'}</label>
              <select
                value={habitTime}
                onChange={(e) => setHabitTime(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px] text-slate-200 outline-none"
              >
                <option value="Morning">{state.language === 'bn' ? 'সকাল' : 'Morning'}</option>
                <option value="Night">{state.language === 'bn' ? 'রাত' : 'Night'}</option>
                <option value="Anytime">{state.language === 'bn' ? 'যেকোনো' : 'Anytime'}</option>
              </select>
            </div>
            <button
              onClick={handleAddGoodHabit}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer shrink-0 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* List display and remove console */}
          <div className="space-y-1.5">
            <p className="text-[9px] text-slate-500 font-extrabold uppercase mt-2 tracking-widest">{state.language === 'bn' ? 'বর্তমান সেভ করা সুঅভ্যাসসমূহ (রিমুভ করতে চাইলে ক্লিক করুন)' : 'Saved Good Habits (Click to Remove)'}</p>
            {state.habits.length === 0 ? (
              <p className="text-[10px] text-slate-500 italic py-1">{state.language === 'bn' ? 'কোনো সুঅভ্যাস পাওয়া যায়নি।' : 'No good habits saved.'}</p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950/30 p-1 rounded-xl">
                {state.habits.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-slate-950/60 rounded-lg text-slate-300 border border-slate-900">
                    <span className="text-xs truncate font-medium">{item.name} <span className="text-[9px] text-slate-500 bg-slate-900 px-1 py-0.5 rounded">⏰ {item.time}</span></span>
                    <button
                      onClick={() => handleRemoveGoodHabit(item.id, item.name)}
                      className="p-1 hover:bg-rose-950/40 text-rose-500 hover:text-rose-400 rounded transition shrink-0 cursor-pointer"
                      title="Remove habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subjects panel content */}
      {activeConsoleTab === 'subjects' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className="flex gap-2 items-end bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
            <div className="flex-1 space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'পড়ার বিষয়ের নাম' : 'Study Subject Name'}</label>
              <input
                type="text"
                placeholder={state.language === 'bn' ? 'উদা: গণিত, রসায়ন' : 'e.g. Physics, Coding'}
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
            <div className="w-20 space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'লক্ষ্য (মিনিট)' : 'Target Min'}</label>
              <input
                type="number"
                value={subjectTarget}
                onChange={(e) => setSubjectTarget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white outline-none"
                min="5"
              />
            </div>
            <button
              onClick={handleAddSubject}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer shrink-0 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* List existing study subjects */}
          <div className="space-y-1.5">
            <p className="text-[9px] text-slate-500 font-extrabold uppercase mt-2 tracking-widest">{state.language === 'bn' ? 'পড়ার বিষয়ের তালিকা (রিমুভ করতে চাইলে ক্লিক করুন)' : 'Saved Study Subjects (Click to Remove)'}</p>
            {state.subjects.length === 0 ? (
              <p className="text-[10px] text-slate-500 italic py-1">{state.language === 'bn' ? 'কোনো বিষয় সাজানো নেই।' : 'No subjects registered.'}</p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950/30 p-1 rounded-xl">
                {state.subjects.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-slate-950/60 rounded-lg text-slate-300 border border-slate-900">
                    <span className="text-xs truncate font-medium">{item.name} <span className="text-[9px] text-amber-550 bg-slate-900 px-1 py-0.5 rounded">🎯 {item.target}m</span></span>
                    <button
                      onClick={() => handleRemoveSubject(item.id, item.name)}
                      className="p-1 hover:bg-rose-950/40 text-rose-500 hover:text-rose-400 rounded transition shrink-0 cursor-pointer"
                      title="Remove subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bad habits panel content */}
      {activeConsoleTab === 'badHabits' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className="flex gap-2 items-end bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
            <div className="flex-1 space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'বর্জনীয় কুঅভ্যাসের নাম' : 'Addiction/Bad Habit Name'}</label>
              <input
                type="text"
                placeholder={state.language === 'bn' ? 'উদা: অতিরিক্ত ফেসবুক ব্যবহার' : 'e.g. Video bingeing, Smoking'}
                value={badHabitName}
                onChange={(e) => setBadHabitName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={handleAddBadHabit}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer shrink-0 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* List bad habits */}
          <div className="space-y-1.5">
            <p className="text-[9px] text-slate-500 font-extrabold uppercase mt-2 tracking-widest">{state.language === 'bn' ? 'বর্তমান কুঅভ্যাস বর্জন ট্র্যাকার (রিমুভ করতে চাইলে ক্লিক করুন)' : 'Saved Addiction Trackers (Click to Remove)'}</p>
            {(!state.badHabits || state.badHabits.length === 0) ? (
              <p className="text-[10px] text-slate-500 italic py-1">{state.language === 'bn' ? 'কোনো কুঅভ্যাস তালিকাভুক্ত করা নাই।' : 'No bad habits logged to resolve.'}</p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950/30 p-1 rounded-xl">
                {state.badHabits.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-slate-950/60 rounded-lg text-slate-300 border border-slate-900">
                    <span className="text-xs truncate font-medium">{item.name}</span>
                    <button
                      onClick={() => handleRemoveBadHabit(item.id, item.name)}
                      className="p-1 hover:bg-rose-950/40 text-rose-500 hover:text-rose-400 rounded transition shrink-0 cursor-pointer"
                      title="Remove quit-clock"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
