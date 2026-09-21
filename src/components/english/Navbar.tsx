import React from 'react';
import { 
  BookOpen, 
  Flame, 
  Award, 
  Sparkles, 
  Clock, 
  Play, 
  Pause, 
  GraduationCap, 
  CheckCircle2,
  Trophy,
  Target
} from 'lucide-react';
import { MainTab, TargetGoal, UserProgressState } from '../../types/englishCare';

interface NavbarProps {
  currentTab: MainTab;
  setCurrentTab: (tab: MainTab) => void;
  progress: UserProgressState;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onToggleGoal: () => void;
  onOpenBadges: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  progress,
  isTimerRunning,
  onToggleTimer,
  onToggleGoal,
  onOpenBadges
}) => {
  const formatTimer = (totalMinutes: number) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} min`;
  };

  const tabs: Array<{ id: MainTab; label: string; icon: any; badge?: string }> = [
    { id: 'dashboard', label: 'হোম ড্যাশবোর্ড', icon: GraduationCap },
    { id: 'grammar', label: 'গ্রামার মাস্টার (৪৫)', icon: BookOpen, badge: '23+ Rules' },
    { id: 'vocabulary', label: 'ভোকাবুলারি অ্যারেনা', icon: Flame, badge: 'Swipe' },
    { id: 'writing', label: 'রাইটিং হাব (৩৫)', icon: Award, badge: '6-Box Poster' },
    { id: 'unseen', label: 'আনসিন প্যাসেজ (২০)', icon: Sparkles },
    { id: 'mocktest', label: '১০০-মার্কস টেস্ট', icon: Trophy, badge: 'NU Final' },
    { id: 'copilot', label: 'সোহান AI কো-পাইলট', icon: Sparkles }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1A237E] text-white shadow-lg border-b border-indigo-900/60 backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-indigo-950 font-black flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white">EnglishCare</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-indigo-950 uppercase tracking-wider">
                Honours 2nd Year
              </span>
            </div>
            <p className="text-xs text-indigo-200 hidden sm:block">
              Non-Credit Compulsory English (Code: 221109) • Gamified & Visual Learning
            </p>
          </div>
        </div>

        {/* Gamification Badges, Timer & Target Goal */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Target Goal Switcher */}
          <button
            id="target-goal-toggle"
            onClick={onToggleGoal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-900/80 hover:bg-indigo-800 text-amber-300 border border-amber-400/40 transition-all shadow-sm"
            title="ক্লিক করে টার্গেট লক্ষ্য পরিবর্তন করুন"
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>{progress.targetGoal === 'aplus_target' ? 'টার্গেট: A+ (80+)' : 'টার্গেট: পাস (40+)'}</span>
          </button>

          {/* Daily Study Timer Widget */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/70 border border-indigo-700/60">
            <Clock className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-indigo-100">
              {formatTimer(progress.todayStudyMinutes)} / {formatTimer(progress.dailyTargetMinutes)}
            </span>
            <button
              onClick={onToggleTimer}
              className={`p-1 rounded-md transition-colors ${
                isTimerRunning 
                  ? 'bg-amber-400 text-indigo-950 hover:bg-amber-300' 
                  : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'
              }`}
              title={isTimerRunning ? 'টাইমার পজ করুন' : 'স্টাডি টাইমার শুরু করুন'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-orange-950/60 text-orange-300 border border-orange-500/40">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            <span>{progress.dailyStreak} দিন স্ট্রিক</span>
          </div>

          {/* Total XP & Level */}
          <button
            id="open-badges-btn"
            onClick={onOpenBadges}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-400 text-indigo-950 hover:brightness-105 transition-all shadow-sm"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{progress.totalXp} XP</span>
            <span className="bg-indigo-950/30 px-1.5 py-0.5 rounded text-[10px] uppercase">
              Lvl {progress.level}
            </span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-amber-400 text-indigo-950 shadow-md font-bold'
                  : 'text-indigo-100 hover:bg-indigo-800/60 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-950' : 'text-indigo-300'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                    isActive ? 'bg-indigo-950 text-amber-300' : 'bg-indigo-900 text-amber-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
