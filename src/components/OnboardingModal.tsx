import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Sparkles, 
  User, 
  CheckCircle, 
  TrendingUp, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  Smartphone, 
  Smile, 
  Activity, 
  Award, 
  Shield, 
  Heart, 
  Percent, 
  Flame,
  Check,
  Bell,
  Volume2
} from 'lucide-react';

interface OnboardingModalProps {
  language: 'bn' | 'en';
  onClose: () => void;
}

export default function OnboardingModal({ language, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Custom states for interactive onboarding elements
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [interactiveTreeLevel, setInteractiveTreeLevel] = useState<number>(0);
  const [prayerState, setPrayerState] = useState({
    Fajr: true,
    Dhuhr: true,
    Asr: false,
    Maghrib: false,
    Isha: false
  });
  const [chapterStatus, setChapterStatus] = useState([true, false, false]);

  const totalSteps = 5;

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // List of Goals for Slide 1
  const goalItems = [
    { id: 'prayer', bn: '৫ ওয়াক্ত নামাজ ঠিকভাবে আদায় করা', en: 'Perform 5 daily prayers on time', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
    { id: 'exam', bn: 'পরীক্ষায় গোল্ডেন এ+ / জিপিএ ৫ পাওয়া', en: 'Achieve GPA 5 / A+ Grade in exams', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' },
    { id: 'phone', bn: 'ক্ষতিকর মোবাইল আসক্তি ও রিলস দেখা কমানো', en: 'Overcome toxic social media & reels addiction', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' },
    { id: 'fitness', bn: 'শরীর সুস্থ ও মেদহীন ফিট রাখা', en: 'Keep body active, fit & metadata healthy', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Cinematic Starfield Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Outer Glow Wrapper */}
      <div className="relative w-full max-w-2xl overflow-hidden border border-slate-800/80 bg-slate-900/95 text-white rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.15)] flex flex-col my-8">
        
        {/* Dynamic Top Cinematic Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Header containing Lang Indicator & Close */}
        <div className="flex justify-between items-center px-6 pt-5 pb-2 relative z-10 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono">
              {language === 'bn' ? `স্লাইড ${currentStep + 1} / ${totalSteps}` : `STEP ${currentStep + 1} OF ${totalSteps}`}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800/80 text-slate-500 hover:text-white transition duration-200"
            title={language === 'bn' ? 'স্কিপ করুন' : 'Skip'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Scroll Container */}
        <div className="p-6 md:p-8 flex flex-col items-center flex-1 max-h-[80vh] overflow-y-auto relative z-10">
          
          {/* SLIDE CONTENT RENDERING */}

          {/* ================= STEP 0: SOHAN MRIDHA CREATOR INTRO ================= */}
          {currentStep === 0 && (
            <div className="w-full text-center space-y-6">
              
              {/* Creator Profile Image with Dynamic Aura */}
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full blur-xl opacity-60 animate-pulse transition duration-1000"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  <img 
                    src="https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p" 
                    alt="Sohan Mridha" 
                    className="w-full h-full object-cover scale-105 hover:scale-115 transition duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/src/assets/images/sohan_mridha_avatar_1781871331231.jpg";
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black px-3.5 py-1 rounded-full text-[10px] uppercase tracking-widest border-2 border-slate-900 shadow-xl">
                  {language === 'bn' ? 'সোহান মৃধা' : 'SOHAN MRIDHA'}
                </span>
              </div>

              {/* Hook Title */}
              <div className="space-y-2">
                <h2 className="text-xl md:text-3xl font-black font-sans tracking-tight bg-gradient-to-r from-amber-300 via-yellow-100 to-indigo-300 bg-clip-text text-transparent leading-snug">
                  {language === 'bn' 
                    ? 'আসসালামু আলাইকুম, আমি সোহান মৃধা' 
                    : 'Assalamu Alaikum, I am Sohan Mridha'}
                </h2>
                <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                  {language === 'bn'
                    ? 'আপনাদের বাস্তব সমস্যা এবং আমার নিজের পরিবর্তনের কথা ভেবে আমি এই বিশেষ অপ্টিমাইজেশন প্ল্যাটফর্মটি তৈরি করেছি।'
                    : 'I engineered this deep life optimizer keeping both your daily struggles and my own growth transformation in mind.'}
                </p>
              </div>

              {/* Emotional & Logical Core Hook Box */}
              <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 text-indigo-200/90 text-sm leading-relaxed text-left space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>{language === 'bn' ? 'সোহানের হৃদয়ের কথা (Emotional Hook)' : 'SOHAN\'S HEARTFELT MISSION'}</span>
                </div>
                <p className="italic">
                  {language === 'bn'
                    ? '"আমরা প্রায়ই অলসতা, সোশ্যাল মিডিয়ার রিলস আসক্তি এবং লক্ষ্যহীনতায় জীবনের সেরা সময়গুলো হারিয়ে ফেলি। প্রতিটি দিন যেন আমাদের আল্লাহর কাছে নিয়ে যায়, পরীক্ষায় সর্বোচ্চ ফলাফল নিশ্চিত করে এবং আমাদের অলসতাকে শৃঙ্খলায় রূপান্তর করে - সেই লক্ষ্যেই MridhaX তৈরি। এটি সাধারণ কোনো অ্যাপ না, এটি আপনার সফল ক্যারিয়ার ও আত্মিক প্রশান্তির গাইড।"'
                    : '"We often squander our precious days in mindless scrolling, procrastination, and spiritual void. MridhaX was built from my personal devotion to help you perform 5 daily prayers on time, conquer academic challenges, and structure a bulletproof routine. This is not just an app—it is your transformation companion."'}
                </p>
              </div>

              {/* Interactive Goals Selector */}
              <div className="space-y-3 pt-2 text-left">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  🎯 {language === 'bn' ? 'নির্বাচন করুন: আজকের দিনে আপনার প্রধান সংকট কি?' : 'SELECT: WHAT IS YOUR BIGGEST OBSTACLE TODAY?'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {goalItems.map(item => {
                    const active = selectedGoals.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleGoal(item.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 font-semibold ${
                          active 
                            ? `${item.color} border-current ring-1 ring-current scale-[1.02] shadow-[0_0_15px_rgba(99,102,241,0.1)]` 
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{language === 'bn' ? item.bn : item.en}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          active ? 'bg-indigo-500 border-indigo-400 text-slate-900' : 'border-slate-700'
                        }`}>
                          {active && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedGoals.length > 0 && (
                  <div className="text-center text-[11px] text-emerald-400 font-bold animate-pulse pt-1">
                    ✨ {language === 'bn' ? 'দুর্দান্ত! MridhaX AI আপনার এই লক্ষ্যগুলো অপ্টিমাইজ করবে।' : 'Excellent! MridhaX AI will prioritize optimizing these targets.'}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= STEP 1: FAITH & PRAYER (How it makes you a better human) ================= */}
          {currentStep === 1 && (
            <div className="w-full text-center space-y-6 animate-slide-in">
              
              {/* Compass / Faith Interactive Mockup */}
              <div className="flex flex-col items-center justify-center relative">
                <div className="absolute -inset-10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
                
                {/* Visual Widget */}
                <div className="relative w-40 h-40 bg-slate-950/80 rounded-full border-2 border-emerald-500/30 flex items-center justify-center shadow-2xl overflow-hidden p-3 group">
                  <div className="absolute inset-2 border border-emerald-500/10 rounded-full border-dashed animate-spin-slow" />
                  
                  {/* Rotating Qibla Compass Needle */}
                  <Compass className="w-20 h-20 text-emerald-400 transform group-hover:rotate-[360deg] transition-transform duration-1000 ease-out" />
                  
                  <div className="absolute top-2.5 text-[8px] font-mono font-black text-emerald-500 tracking-widest uppercase">
                    QIBLA FOCUS
                  </div>
                  <div className="absolute bottom-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[9px] px-2.5 py-0.5 rounded-full font-bold">
                    Kaaba: 21° N
                  </div>
                </div>
              </div>

              {/* Title & Core Concept */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-emerald-400 flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6" />
                  <span>{language === 'bn' ? '১. আধ্যাত্মিক বিশুদ্ধতা ও ভালো মানুষ হওয়া' : '1. Spiritual Purity & Character Building'}</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto font-sans">
                  {language === 'bn'
                    ? 'MridhaX-এর প্রথম মূল ভিত্তি হলো দ্বীন ও নৈতিকতা। এটি আপনাকে আল্লাহর সন্তুষ্টির পথে পরিচালিত করে একজন সৎ ও উত্তম চরিত্রের মানুষে পরিণত করবে।'
                    : 'The ultimate bedrock of MridhaX is spiritual discipline. It fosters moral strength and coordinates your daily schedule around devotion.'}
                </p>
              </div>

              {/* Real-time Prayer Alerts Features Visual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                
                {/* Visual Column 1: Prayer list */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase font-mono block">
                    ⚡ {language === 'bn' ? 'লাইভ ওয়াক্ত ট্র্যাকার ও নিখুঁত এলার্ট' : 'LIVE FAITH TRACKER'}
                  </span>
                  
                  <div className="space-y-2">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((pr) => {
                      const active = (prayerState as any)[pr];
                      return (
                        <button
                          key={pr}
                          onClick={() => setPrayerState({ ...prayerState, [pr]: !active })}
                          className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-bold transition-all ${
                            active 
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                              : 'border-slate-900 bg-slate-950/30 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{pr}</span>
                          </span>
                          <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-black/40">
                            {active ? (language === 'bn' ? 'পড়া হয়েছে' : 'Completed') : (language === 'bn' ? 'বাকী' : 'Pending')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Info Column 2: Emotional & Logical Outcomes */}
                <div className="space-y-3 flex flex-col justify-between">
                  
                  {/* How it helps your character */}
                  <div className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-950/10 space-y-1.5">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'কিভাবে আপনাকে ভালো মানুষ বানাবে?' : 'How will it make you better?'}</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {language === 'bn'
                        ? '• পাঁচ ওয়াক্ত নামাজ যথাসময়ে পড়তে সাহায্য করতে রয়েছে রিয়েল-টাইম জিপিএস ও আইপি ভিত্তিক নামাজের সময়সূচী।\n• কোরআনিক সতর্কতা ও হাদীসের উদ্ধৃতি সম্বলিত অভ্যাস ট্র্যাকারের মাধ্যমে কুপ্রবৃত্তি ও খারাপ অভ্যাস দমন।'
                        : '• Prompts you on exact prayer starts with live GPS calculations.\n• Overcomes harmful desires through Qur\'anic verses & bad habit trigger trackers.'}
                    </p>
                  </div>

                  {/* Character Cleansed Indicator */}
                  <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black font-mono text-emerald-400 uppercase tracking-widest">
                      <span>{language === 'bn' ? 'মানসিক একাগ্রতা ও আত্মিক নূর' : 'Spiritual Focus Level'}</span>
                      <span>85% Completed</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '85%' }} />
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================= STEP 2: FOCUS CENTER (How it improves your life & productivity) ================= */}
          {currentStep === 2 && (
            <div className="w-full text-center space-y-6 animate-slide-in">
              
              {/* Interactive Growing Focus Tree Mockup */}
              <div className="flex flex-col items-center justify-center relative">
                <div className="absolute -inset-10 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                
                {/* Visual Widget */}
                <div className="relative w-44 h-44 bg-slate-950/80 rounded-2xl border border-cyan-500/20 shadow-2xl flex flex-col items-center justify-between p-4 group">
                  
                  {/* Digital Sapling */}
                  <div className="flex-1 flex items-center justify-center">
                    {interactiveTreeLevel === 0 && (
                      <div className="text-center space-y-1">
                        <span className="text-4xl block animate-bounce">🌱</span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">SEED STATE</span>
                      </div>
                    )}
                    {interactiveTreeLevel === 1 && (
                      <div className="text-center space-y-1">
                        <span className="text-5xl block animate-bounce">🌿</span>
                        <span className="text-[10px] font-mono font-bold text-cyan-400">SAPLING STATE</span>
                      </div>
                    )}
                    {interactiveTreeLevel >= 2 && (
                      <div className="text-center space-y-1">
                        <span className="text-6xl block animate-bounce">🌳</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 animate-pulse">BLOOMING MAHIRUH</span>
                      </div>
                    )}
                  </div>

                  {/* Tap to simulate focus */}
                  <button
                    onClick={() => setInteractiveTreeLevel((prev) => (prev + 1) % 3)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-[10px] font-black py-1.5 rounded-lg tracking-widest uppercase transition-all shadow-md shadow-cyan-500/10"
                  >
                    ⚡ {language === 'bn' ? 'ফোকাস টেস্ট করতে ট্যাপ দিন' : 'TAP TO SIMULATE FOCUS'}
                  </button>
                </div>
              </div>

              {/* Title & Core Concept */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-cyan-400 flex items-center justify-center gap-2">
                  <Activity className="w-6 h-6 animate-pulse" />
                  <span>{language === 'bn' ? '২. লাইফস্টাইল অপ্টিমাইজ ও গভীর মনোযোগ' : '2. Lifestyle Optimization & Deep Work'}</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto font-sans">
                  {language === 'bn'
                    ? 'আপনার মেধা শক্তিকে চরম শিখরে নিয়ে যেতে আছে বিশেষ "ফোকাস ট্রি গ্রোথ" লুপ, ব্রেইনওয়েভ সাউন্ড ও সোশ্যাল মিডিয়া ডিস্ট্রাকশন ব্লকার।'
                    : 'To scale your mental throughput, MridhaX integrates a gamified Study Tree system, synthesized audio therapy, and distraction blocker.'}
                </p>
              </div>

              {/* Logical Features list grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left text-xs">
                
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-1">
                    <Flame className="w-4 h-4" />
                    <span>{language === 'bn' ? 'বৃক্ষ অঙ্কুরোদগম' : 'Focus Tree'}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed font-sans">
                    {language === 'bn' ? 'পড়ার টেবিলে আপনার ফোকাস সচল রাখলে ধীরে ধীরে বেড়ে উঠবে গাছ, যা মনোযোগ বাড়ানোর চরম ট্রিগার।' : 'Focus stopwatch converts studying minutes into virtual sapling growth.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50">
                  <div className="flex items-center gap-1.5 font-bold text-purple-400 mb-1">
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ব্রেইনওয়েভ সাউন্ড' : 'Audio Therapy'}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed font-sans">
                    {language === 'bn' ? 'মস্তিষ্ককে শান্ত করতে যুক্ত করা হয়েছে বাইনরাল থিটা বিট, কসমিক মেডিটেশন ও গভীর বৃষ্টির শব্দ।' : 'Integrated binaural beats, pink noise, and rain sounds to block ambient noises.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
                    <Smartphone className="w-4 h-4" />
                    <span>{language === 'bn' ? 'আসক্তি ব্লকার' : 'Distraction Blocker'}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed font-sans">
                    {language === 'bn' ? 'ফেসবুক রিলস, ইউটিউব শর্টস আসক্তি কমাতে আছে ডিজিটাল ডিক্সিপ্লিন ট্র্যাকার ও রিফ্লেক্ট নোটবুক।' : 'Combats endless reels and TikTok scrolling with self-audit timers.'}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ================= STEP 3: EXAM INTELLIGENCE (How to get perfect results) ================= */}
          {currentStep === 3 && (
            <div className="w-full text-center space-y-6 animate-slide-in">
              
              {/* Exam Prep Dashboard Interactive Mockup */}
              <div className="flex flex-col items-center justify-center relative">
                <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
                
                {/* Visual Widget */}
                <div className="relative w-64 bg-slate-950/80 rounded-2xl border border-indigo-500/25 p-4 shadow-2xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-400" />
                      <span className="text-[10px] font-mono font-black text-slate-300">EXAM WORKSPACE</span>
                    </div>
                    <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] px-2 py-0.5 rounded font-black font-mono">
                      A+ TARGET
                    </span>
                  </div>

                  {/* Syllabus chapters mockup check list */}
                  <div className="space-y-2 text-left">
                    {['Chapter 1: Quantum Mechanics', 'Chapter 2: Thermodynamics', 'Chapter 3: Electromagnetism'].map((chapter, index) => {
                      const completed = chapterStatus[index];
                      return (
                        <button
                          key={chapter}
                          onClick={() => {
                            const clone = [...chapterStatus];
                            clone[index] = !clone[index];
                            setChapterStatus(clone);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg border text-[10px] transition-all ${
                            completed 
                              ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold' 
                              : 'border-slate-900 bg-slate-950/40 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <span className="truncate">{chapter}</span>
                          <CheckCircle className={`w-3.5 h-3.5 ${completed ? 'text-emerald-400' : 'text-slate-700'}`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Progress Indicator */}
                  <div className="pt-1.5 text-left">
                    <div className="flex justify-between text-[8px] text-slate-400 font-mono uppercase font-black mb-1">
                      <span>Syllabus Completion</span>
                      <span>{chapterStatus.filter(Boolean).length * 33}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300" 
                        style={{ width: `${chapterStatus.filter(Boolean).length * 33.3}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Core Concept */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-indigo-400 flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 animate-pulse" />
                  <span>{language === 'bn' ? '৩. এক্সাম ইন্টেলিজেন্স ও নিখুঁত এ+ গোল' : '3. Exam Prep & Scholarly Mastery'}</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto font-sans">
                  {language === 'bn'
                    ? 'পরীক্ষায় অসাধারণ রেজাল্ট নিশ্চিত করতে এতে রয়েছে ডেডিকেটেড এক্সাম ইন্টেলিজেন্স এবং চ্যাপ্টার-ভিত্তিক স্মার্ট ট্র্যাকার।'
                    : 'Unlocks ultimate exam success through tailored syllabus breakdown metrics and live chapter completeness maps.'}
                </p>
              </div>

              {/* Detailed Explanation */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-left space-y-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <Check className="w-4 h-4 text-indigo-400" />
                  <span>{language === 'bn' ? 'পরীক্ষায় ভালো রেজাল্ট করার মাস্টার মেকানিজম:' : 'Master Mechanism for Straight As:'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed text-slate-400 font-sans">
                  <p>
                    {language === 'bn' 
                      ? '• বিশৃঙ্খল স্টাডি প্ল্যানিং দূর করে আপনার প্রতিটি বিষয়ের সম্পূর্ণ চ্যাপ্টার সূচী, ডেডলাইন ও লাইভ পরীক্ষা কত দিন বাকি রয়েছে তা সুনির্দিষ্ট কাউন্টডাউন আকারে দেখায়।' 
                      : '• Breaks down overwhelming course content into systematic chapters, showing a live deadline countdown.'}
                  </p>
                  <p>
                    {language === 'bn'
                      ? '• আপনি প্রতিদিন কোন সাবজেক্টে কতো মিনিট ফোকাসড হয়ে পড়েছেন, তার লাইভ ক্যালেন্ডার হিটম্যাপ তৈরি করে এবং পরীক্ষার প্রস্তুতি প্রগ্রেস ট্র্যাক করে।'
                      : '• Automatically builds color-coded focus maps based on minutes you spent on subjects, ensuring zero syllabus gaps.'}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 4: DECISION PATH (Logical & Emotional Call to Action) ================= */}
          {currentStep === 4 && (
            <div className="w-full text-center space-y-6 animate-slide-in">
              
              {/* Dynamic Contrast Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                
                {/* The Unproductive Path */}
                <div className="p-4 rounded-2xl border border-rose-500/20 bg-red-950/10 space-y-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl" />
                  <div className="flex items-center gap-1.5 font-black text-rose-400 uppercase tracking-wider text-[10px] font-mono">
                    <X className="w-4 h-4 text-rose-500" />
                    <span>{language === 'bn' ? 'পথ ১: অলসতা ও অবহেলা' : 'PATH A: PROCRASTINATION'}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-200">{language === 'bn' ? 'অগোছালো ও লক্ষ্যহীন জীবন' : 'Unstructured & Mindless'}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {language === 'bn' 
                      ? '• নামাযের ওয়াক্ত চলে যাওয়া ও আধ্যাত্মিক অসাড়তা।\n• সোশ্যাল মিডিয়া ও রিলসের জালে ফেঁসে ৩-৪ ঘন্টা সময় নষ্ট।\n• পরীক্ষার আগে তীব্র দুশ্চিন্তা ও মন ভেঙে যাওয়া ফলাফল।\n• মা-বাবার মনে অসন্তুষ্টি ও নিজের উপর বিশ্বাস হারিয়ে ফেলা।'
                      : '• Missed prayers, digital clutter, and brain fog.\n• Wasting hours on TikTok/Insta reels.\n• Night-before exam panic and devastating grades.\n• Emotional regret and disappointed parents.'}
                  </p>
                </div>

                {/* The MridhaX Discipline Path */}
                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-2 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl animate-pulse" />
                  <div className="flex items-center gap-1.5 font-black text-emerald-400 uppercase tracking-wider text-[10px] font-mono">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'পথ ২: মৃধাক্স শৃঙ্খলা' : 'PATH B: MRIDHAX DISCIPLINE'}</span>
                  </div>
                  <h4 className="font-bold text-sm text-emerald-300">{language === 'bn' ? 'আত্মনিয়ন্ত্রিত ও সফলতম জীবন' : 'Organized & Unstoppable'}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {language === 'bn' 
                      ? '• সময়ে ৫ ওয়াক্ত নামায ও আত্মিক প্রশান্তি।\n• ফোকাসড স্টাডি ট্রি ও ব্রেইন সাউন্ড দিয়ে গভীর পড়াশোনা।\n• সিলেবাস ব্রেকডাউন ও রিফ্লেক্ট বুক দিয়ে পরীক্ষায় এ+ নিশ্চিত করা।\n• সুস্থ শরীর, সুন্দর রুটিন এবং মা-বাবার ঠোঁটে পরম হাসি।'
                      : '• Prayers on time, pristine peace, and core alignment.\n• Deep study flow sessions, saving days of cognitive load.\n• Outstanding grades, robust fitness, and nightly self-audit.\n• Parents beaming with absolute pride and joy.'}
                  </p>
                </div>

              </div>

              {/* Action Call text */}
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-black text-amber-400">
                  {language === 'bn' ? 'চূড়ান্ত অঙ্গীকার: আজই হোক আপনার বিজয়ের সূচনা' : 'The Commitment: Your Destiny Starts Today'}
                </h3>
                <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                  {language === 'bn'
                    ? 'আমি সোহান মৃধা আপনার পাশে আছি। MridhaX AI অ্যাপের প্রতিটি ফিচার নিখুঁতভাবে তৈরি করা হয়েছে আপনাকে এক অসাধারণ মানুষে পরিণত করতে।'
                    : 'I am Sohan Mridha, and I am deeply honored to walk this path of extreme self-mastery alongside you. Choose discipline.'}
                </p>
              </div>

              {/* Cinematic Bottom Quote from Sohan */}
              <div className="p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 text-amber-200/90 italic font-mono text-[10px] uppercase tracking-widest max-w-md mx-auto text-center">
                "{language === 'bn' ? 'অলসতা একটি ধ্বংসাত্মক বিষাদ, আর শৃঙ্খলা হলো আলোর মহাসড়ক।' : 'Laziness is a destructive anchor, discipline is your glorious wings.'}"
              </div>

            </div>
          )}

          {/* Flow Indicator dots */}
          <div className="flex gap-2.5 mt-8 mb-2 relative z-10">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentStep 
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 w-8 shadow-[0_0_8px_rgba(99,102,241,0.6)]' 
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Actions Button Block */}
          <div className="flex items-center justify-between w-full gap-4 mt-6 pt-4 border-t border-slate-800/40 relative z-10">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-black text-slate-400 hover:text-white transition duration-200 uppercase tracking-widest hover:bg-slate-800/40 rounded-xl"
            >
              {language === 'bn' ? 'স্কিপ করুন' : 'Skip Info'}
            </button>

            <div className="flex gap-2.5">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2.5 text-xs font-black text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/50 rounded-xl transition duration-200 uppercase tracking-widest"
                >
                  {language === 'bn' ? 'পেছনে' : 'Back'}
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all text-sm uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>
                  {currentStep === totalSteps - 1 
                    ? (language === 'bn' ? 'ওয়ার্কস্পেস চলুন' : 'Enter Workspace') 
                    : (language === 'bn' ? 'পরবর্তী' : 'Next')
                  }
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
