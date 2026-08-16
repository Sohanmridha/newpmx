import React from 'react';
import { X, Trees, Sparkles, Sprout, Leaf, Award, Trophy } from 'lucide-react';
import { Language } from '../types/voice';

interface TreeInfoModalProps {
  currentDay: number;
  treeLevel: 1 | 2 | 3 | 4 | 5 | 6;
  language: Language;
  onClose: () => void;
}

export function TreeInfoModal({ currentDay, treeLevel, language, onClose }: TreeInfoModalProps) {
  const stages = [
    {
      level: 1,
      days: 'Day 1 – 2',
      nameBn: 'লেভেল ১: বীজ স্তর (Seed Stage)',
      nameEn: 'Level 1: Foundation Seed',
      descBn: 'কণ্ঠের শিথিলতা এবং প্রাথমিক ডায়াফ্রাম্যাটিক শ্বাস নেওয়া শুরু।',
      descEn: 'Laryngeal relaxation and foundational 4-2-6 diaphragmatic breath.'
    },
    {
      level: 2,
      days: 'Day 3 – 6',
      nameBn: 'লেভেল ২: অঙ্কুরোদগম (Sprout Stage)',
      nameEn: 'Level 2: Sprout Awakening',
      descBn: 'হামিং (ম্মম্ম) ও লিপ ট্রিল (ব্র্র্র্র) দিয়ে স্বরতন্ত্রীর ক্লান্তি দূর করা।',
      descEn: 'Gentle humming and lip trills activate safe subglottic air balance.'
    },
    {
      level: 3,
      days: 'Day 7 – 13',
      nameBn: 'লেভেল ৩: তরুণ বৃক্ষ (Young Tree)',
      nameEn: 'Level 3: Young Tree',
      descBn: '৭ দিনের ধারাবাহিকতায় মাস্ক ও চেস্ট রেজোন্যান্স তৈরি এবং শাখার বিস্তার।',
      descEn: 'Week 1 unlocked! Vibrant facial mask resonance and leaf density.'
    },
    {
      level: 4,
      days: 'Day 14 – 20',
      nameBn: 'লেভেল ৪: বর্ধনশীল বৃক্ষ (Growing Tree)',
      nameEn: 'Level 4: Growing Tree',
      descBn: 'উচ্চারণের স্পষ্টতা, স্বরধ্বনি ড্রিল এবং ধীরগতির পাঠ সাবলীলতা।',
      descEn: 'Phonetic articulation drills and stable slow reading articulation.'
    },
    {
      level: 5,
      days: 'Day 21 – 29',
      nameBn: 'লেভেল ৫: সুদৃঢ় বৃক্ষ (Strong Resonant Tree)',
      nameEn: 'Level 5: Strong Resonant Tree',
      descBn: '২১ দিনের রেডিও-গ্রেড আরজে ব্রডকাস্ট ডেলিভারি ও সুদৃঢ় কণ্ঠ নিয়ন্ত্রণ।',
      descEn: 'RJ studio delivery, narrative pauses, and rich emotional resonance.'
    },
    {
      level: 6,
      days: 'Day 30+',
      nameBn: 'লেভেল ৬: পূর্ণাঙ্গ রূপান্তর বৃক্ষ (Master Tree)',
      nameEn: 'Level 6: Full Transformation Tree',
      descBn: '৩০ দিনের পূর্ণাঙ্গ রূপান্তর সম্পন্ন! আজীবন স্থায়ী স্পষ্ট, সাবলীল ও আত্মবিশ্বাসী কণ্ঠ।',
      descEn: 'Grand transformation milestone! Permanent vocal clarity, poise, and master certificate.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {language === 'bn' ? '৩০ দিনের রূপান্তর বৃক্ষ গাইড' : '30-Day Growth Tree Guide'}
              </h3>
              <span className="text-xs text-slate-400">
                {language === 'bn' ? 'প্রতিটি অনুশীলনে বৃক্ষ বৃদ্ধি পায়' : 'Daily exercises nourish your tree'}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tree Mechanics Box */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-300 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? 'বৃক্ষের নিয়মাবলী:' : 'Tree Growth Rules:'}</span>
          </div>
          <p>
            {language === 'bn'
              ? '১. প্রতিদিনের ৪টি সেশন শেষ করলে পাতায় উজ্জ্বল সবুজ আভা যুক্ত হয়।\n২. ৭ দিন টানা স্ট্রিকে ডালপালা সোনালী রঙে আলোকিত হয়।\n৩. ৩০তম দিনে পূর্ণাঙ্গ রূপান্তর বৃক্ষ উন্মোচিত হয়।'
              : '1. Completing daily 4 sessions triggers emerald leaf glow.\n2. A 7-day streak turns branches into golden resonance.\n3. Day 30 unlocks the Grand Celestial Master Tree.'}
          </p>
        </div>

        {/* 6 Stage List */}
        <div className="space-y-2.5">
          {stages.map((st) => {
            const isCurrent = treeLevel === st.level;

            return (
              <div
                key={st.level}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-900 border-emerald-500/80 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h4 className={`text-xs font-bold ${isCurrent ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {language === 'bn' ? st.nameBn : st.nameEn}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">{st.days}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {language === 'bn' ? st.descBn : st.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
