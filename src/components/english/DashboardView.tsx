import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Flame, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Target, 
  Trophy,
  Brain,
  Edit3,
  HelpCircle,
  Zap,
  BookmarkCheck,
  GraduationCap
} from 'lucide-react';
import { MainTab, UserProgressState } from '../../types/englishCare';

interface DashboardViewProps {
  progress: UserProgressState;
  onNavigateTab: (tab: MainTab) => void;
  onOpenBadges: () => void;
  onAddStudyMinutes: (mins: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onNavigateTab,
  onOpenBadges,
  onAddStudyMinutes
}) => {
  const percentage = progress.syllabusCoveragePercent;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Coach Sohan Mridha & MridhaX AI Study Analysis Briefing */}
      <div className="bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#0D47A1] rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-indigo-400/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-indigo-950 font-extrabold flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Coach Sohan Mridha & MridhaX AI Co-pilot
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-indigo-950">
                  লাইভ স্টাডি অ্যানালাইসিস
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                ব্যক্তিগত প্রিপারেশন ইনসাইটস • জাতীয় বিশ্ববিদ্যালয় নন-ক্রেডিট ইংলিশ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('copilot')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-indigo-950 hover:bg-amber-300 transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>কো-পাইলটের সাথে কথা বলুন</span>
            </button>
          </div>
        </div>

        {/* Personalized Coach Feedback Message */}
        <div className="mt-4 bg-indigo-950/60 backdrop-blur-md rounded-xl p-4 border border-indigo-700/50">
          <p className="text-sm leading-relaxed text-indigo-100 font-medium">
            <span className="font-bold text-amber-300">"সোহান,</span> আমি তোমার গত ৩ দিনের কুইজ এবং স্টাডি ডেটা পর্যবেক্ষণ করেছি। তুমি এখন পর্যন্ত পুরো সিলেবাসের <span className="text-amber-400 font-bold underline">{percentage}%</span> কভার করেছ। আজকেই গ্রামারের বাকি থাকা <span className="text-cyan-300 font-bold">'Right Form of Verbs'</span>-এর শেষ ৩টি শর্ট টেকনিক (Passive Voice এবং Modals) শেষ করে নাও। পড়ার সময় সবসময় সাথে একটি <span className="text-amber-300 font-bold">নোট খাতা</span> রাখবে এবং শর্টকাট সূত্রগুলো নিজের হাতে লিখে প্র্যাকটিস করবে। প্রতিদিন অন্তত <span className="text-emerald-300 font-bold">৯০ মিনিট</span> সময় দাও—তোমার এ+ পাওয়ার সম্ভাবনা দারুণ!"
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-indigo-900/60 rounded-lg p-2.5 border border-indigo-800">
              <span className="text-indigo-300 block mb-1">আজকের গ্রামার মিশন:</span>
              <span className="font-bold text-white flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                Right Form of Verbs (রুল ২১-২৩)
              </span>
            </div>
            <div className="bg-indigo-900/60 rounded-lg p-2.5 border border-indigo-800">
              <span className="text-indigo-300 block mb-1">স্টাডি নোটবুক টাস্ক:</span>
              <span className="font-bold text-white flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                খাতায় ৫টি Poster ছক আঁকা
              </span>
            </div>
            <div className="bg-indigo-900/60 rounded-lg p-2.5 border border-indigo-800">
              <span className="text-indigo-300 block mb-1">আজকের ভোকাব টার্গেট:</span>
              <span className="font-bold text-white flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                ১৫টি Antonyms সোয়াইপ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Target Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Syllabus Coverage */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">সিলেবাস সম্পন্ন</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              NU
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-black text-slate-900">{percentage}%</span>
              <span className="text-xs font-semibold text-slate-500">১০০ নম্বরের মধ্যে</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-600">
            {progress.targetGoal === 'aplus_target' ? 'লক্ষ্য ৮০+ (A+ গ্রেড)' : 'লক্ষ্য ৪০+ (পাস)'}
          </p>
        </div>

        {/* Daily Study Target */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">দৈনিক স্টাডি লক্ষ্য</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-3">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-black text-slate-900">
                {progress.todayStudyMinutes} <span className="text-sm font-normal text-slate-500">/ {progress.dailyTargetMinutes} মিনিট</span>
              </span>
              <span className="text-xs font-bold text-cyan-700">
                {Math.round((progress.todayStudyMinutes / progress.dailyTargetMinutes) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (progress.todayStudyMinutes / progress.dailyTargetMinutes) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => onAddStudyMinutes(15)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors"
            >
              +১৫ মিনিট
            </button>
            <button
              onClick={() => onAddStudyMinutes(30)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors"
            >
              +৩০ মিনিট
            </button>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ধারাবাহিক স্টাডি স্ট্রিক</span>
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{progress.dailyStreak} দিন</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">
                চলমান 🔥
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">প্রতিদিন অন্তত ১৫ মিনিট অ্যাপে স্টাডি করলে স্ট্রিক বজায় থাকে।</p>
          </div>
          <span className="text-[11px] font-medium text-slate-400">সর্বোচ্চ স্ট্রিক: ৭ দিন</span>
        </div>

        {/* Badges & XP */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ব্যাজ ও লেভেল</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{progress.totalXp} XP</span>
              <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-amber-100 text-amber-800">
                Level {progress.level}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {progress.unlockedBadges.length} টি ব্যাজ আনলকড
            </p>
          </div>
          <button
            onClick={onOpenBadges}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
          >
            <span>সব ব্যাজ দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Learning Hubs (Exam Centric Sections) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1A237E]" />
            <span>সিলেবাস অনুযায়ী মূল লার্নিং মডিউলসমূহ</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">জাতীয় বিশ্ববিদ্যালয় সিলেবাস কোড ২২১১০৯</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Grammar Master */}
          <div 
            onClick={() => onNavigateTab('grammar')}
            className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200 transition-all cursor-pointer hover:border-indigo-400 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-black group-hover:bg-[#1A237E] group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800">
                ৪৫ নম্বর
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
              Grammar Master (রুলস ও প্র্যাক্টিস)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Right Form of Verbs (23 Rules), Wh-Questions, Sentence Correction, Articles, Punctuation, Rearrange, Changing Words ও Translation।
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>প্র্যাক্টিস শুরু করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Vocabulary Arena */}
          <div 
            onClick={() => onNavigateTab('vocabulary')}
            className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200 transition-all cursor-pointer hover:border-amber-400 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black group-hover:bg-amber-500 group-hover:text-indigo-950 transition-colors">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800">
                Flashcard Swipe
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
              Vocabulary Arena (Synonyms & Antonyms)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              ৫০টি সিনোনিম এবং ১৫০টি এন্টোনিম কার্ড সোয়াইপ মোডে শিখুন। সাথে বোর্ড প্রশ্নের রেফারেন্স ও এক্সাম্পল সেন্টেন্স।
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>সোয়াইপ গেম খেলুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Writing & Composition Hub */}
          <div 
            onClick={() => onNavigateTab('writing')}
            className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200 transition-all cursor-pointer hover:border-emerald-400 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                ৩৫ নম্বর
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
              Writing & Composition Hub
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              ৬-বক্স পোস্টার জেনারেটর, অফিশিয়াল নোটিশ ফরম্যাট, জব অ্যাপ্লিকেশনের সাথে কমপ্লিট সিভি, এবং প্যারাগ্রাফ ভোকাবুলারি।
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>ফরম্যাট জেনারেট করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Unseen Passage */}
          <div 
            onClick={() => onNavigateTab('unseen')}
            className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200 transition-all cursor-pointer hover:border-blue-400 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800">
                ২০ নম্বর
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
              Unseen Comprehension Passage
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              বোর্ড স্ট্যান্ডার্ড প্যাসেজ, বাংলা অনুবাদ, Wh-প্রশ্ন কৌশল, মেইন আইডিয়া এবং ৪ লাইনে সামারি লেখার সহজ ম্যাজিক ফর্মুলা।
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>প্যাসেজ সলভিং দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Full 100-Marks Model Test */}
          <div 
            onClick={() => onNavigateTab('mocktest')}
            className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200 transition-all cursor-pointer hover:border-rose-400 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-black group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800">
                ১০০ নম্বর রিয়েল এক্সাম
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-900 transition-colors">
              Exam Simulation (মক টেস্ট জোন)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              জাতীয় বিশ্ববিদ্যালয়ের সম্পূর্ণ ৩ ঘণ্টার প্রশ্নপত্র অনুসারে টেস্ট দিন। সাথে রয়েছে সমাধান ও মার্কস মূল্যায়ন।
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700">
              <span>মক টেস্ট শুরু করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: AI Co-pilot & Problem Solver */}
          <div 
            onClick={() => onNavigateTab('copilot')}
            className="group bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-indigo-700 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-800 text-amber-300">
                স্মার্ট স্টাডি হেল্প
              </span>
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              MridhaX AI সহকারী ও গণিত সমাধান
            </h4>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
              যে কোনো কঠিন গ্রামার নিয়ম, গণিত সমাধান (ধাপে ধাপে বইয়ের মতো ব্যাখ্যা), বা রোডম্যাপের জন্য কো-পাইলট প্রস্তুত।
            </p>
            <div className="mt-4 pt-3 border-t border-indigo-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>প্রশ্ন জিজ্ঞাসা করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
