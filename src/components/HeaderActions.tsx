import React, { useState } from 'react';
import { 
  Compass, 
  Languages, 
  Sprout, 
  Music, 
  Smartphone, 
  Palette,
  Users,
  MessageSquare,
  ChevronRight,
  X,
  Settings,
  HelpCircle,
  Sparkles,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderActionsProps {
  language: 'bn' | 'en';
  onToggleLanguage: () => void;
  onOpenGarden: () => void;
  onOpenSounds: () => void;
  onOpenInstall: () => void;
  onOpenOnboarding: () => void;
  onChangeTheme: () => void;
  onOpenSocial: () => void;
  onlineCount: number;
  systemStatus: 'optimal' | 'degraded' | 'error';
}

export function HeaderActions({
  language,
  onToggleLanguage,
  onOpenGarden,
  onOpenSounds,
  onOpenInstall,
  onOpenOnboarding,
  onChangeTheme,
  onOpenSocial,
  onlineCount,
  systemStatus
}: HeaderActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    { 
      id: 'lang', 
      icon: Languages, 
      labelBn: language === 'bn' ? 'ভাষা পরিবর্তন' : 'Change Language', 
      labelEn: 'Language', 
      onClick: onToggleLanguage, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10' 
    },
    { 
      id: 'garden', 
      icon: Sprout, 
      labelBn: 'গার্ডেন', 
      labelEn: 'Garden', 
      onClick: onOpenGarden, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      id: 'sounds', 
      icon: Music, 
      labelBn: 'সাউন্ডস', 
      labelEn: 'Sounds', 
      onClick: onOpenSounds, 
      color: 'text-indigo-400', 
      bg: 'bg-indigo-500/10' 
    },
    { 
      id: 'install', 
      icon: Smartphone, 
      labelBn: 'ইন্সটল', 
      labelEn: 'Install', 
      onClick: onOpenInstall, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10' 
    },
    { 
      id: 'guide', 
      icon: Compass, 
      labelBn: 'গাইড', 
      labelEn: 'Guide', 
      onClick: onOpenOnboarding, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10' 
    },
    { 
      id: 'theme', 
      icon: Palette, 
      labelBn: 'থিম', 
      labelEn: 'Theme', 
      onClick: onChangeTheme, 
      color: 'text-violet-400', 
      bg: 'bg-violet-500/10' 
    }
  ];

  return (
    <div className="relative">
      {/* Unified Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition shadow-lg active:scale-95 cursor-pointer relative group"
      >
        <Plus className="w-5 h-5 text-slate-300 group-hover:text-white transition" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
      </button>

      {/* Simplified Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for easy closing */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-3 w-72 sm:w-80 bg-slate-950 border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Settings className="w-4 h-4 text-slate-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-100">
                     {language === 'bn' ? 'মৃধাক্স কন্ট্রোল প্যানেল' : 'MridhaX Control Center'}
                   </h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-lg transition cursor-pointer">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Social Section */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">
                    {language === 'bn' ? 'সামাজিক যোগাযোগ' : 'Social & Growth'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onOpenSocial();
                        setIsOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">
                        {language === 'bn' ? 'অনলাইন পার্টনার' : 'Live Partners'}
                      </span>
                      <span className="text-[8px] text-emerald-500 font-black mt-1 uppercase tracking-tighter">
                        {onlineCount} {language === 'bn' ? 'এক্টিভ' : 'Active Now'}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenSocial();
                        setIsOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">
                        {language === 'bn' ? 'চ্যাট লিস্ট' : 'Chat History'}
                      </span>
                      <span className="text-[8px] text-slate-500 font-bold mt-1 uppercase">
                         Community Room
                      </span>
                    </button>
                  </div>
                </div>

                {/* Utility Grid */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">
                    {language === 'bn' ? 'ইউটিলিটি টুলস' : 'Utility Toolbox'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {tools.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          tool.onClick();
                          if (tool.id !== 'lang') setIsOpen(false);
                        }}
                        className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900 transition group cursor-pointer"
                      >
                        <div className={`w-9 h-9 rounded-xl ${tool.bg} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-4.5 h-4.5 ${tool.color}`} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-200 transition text-center leading-tight">
                          {language === 'bn' ? tool.labelBn : tool.labelEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-2 flex items-center justify-between opacity-40">
                   <div className="flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      <span className="text-[8px] font-bold uppercase">v2.0.4 Stable</span>
                   </div>
                   <div className="text-[8px] font-bold uppercase tracking-widest">
                     MridhaX Ecosystem
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
