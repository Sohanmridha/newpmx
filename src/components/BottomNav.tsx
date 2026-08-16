import React from 'react';
import { Home, Dumbbell, Mic, BarChart2, User } from 'lucide-react';
import { Language } from '../types/voice';

export type TabType = 'home' | 'training' | 'studio' | 'progress' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  language: Language;
  onSelectTab: (tab: TabType) => void;
}

export function BottomNav({ activeTab, language, onSelectTab }: BottomNavProps) {
  const tabs = [
    {
      id: 'home' as TabType,
      labelBn: 'হোম',
      labelEn: 'Home',
      icon: Home
    },
    {
      id: 'training' as TabType,
      labelBn: 'ট্রেনিং',
      labelEn: 'Training',
      icon: Dumbbell
    },
    {
      id: 'studio' as TabType,
      labelBn: 'স্টুডিও',
      labelEn: 'Studio',
      icon: Mic,
      isSpecial: true
    },
    {
      id: 'progress' as TabType,
      labelBn: 'প্রোগ্রেস',
      labelEn: 'Progress',
      icon: BarChart2
    },
    {
      id: 'profile' as TabType,
      labelBn: 'প্রোফাইল',
      labelEn: 'Profile',
      icon: User
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 max-w-lg mx-auto pointer-events-none">
      <nav className="pointer-events-auto bg-slate-950/90 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-300 text-slate-950 shadow-emerald-500/25 scale-105'
                      : 'bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/50'
                  }`}
                >
                  <Icon className="w-5 h-5 animate-pulse" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {language === 'bn' ? tab.labelBn : tab.labelEn}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center gap-1 transition-all focus:outline-none ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'font-black' : ''}`}>
                {language === 'bn' ? tab.labelBn : tab.labelEn}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
