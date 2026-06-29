import React, { useState, useEffect } from 'react';
import { motion } from "motion/react";
import { Play, Pause, Square, Settings, Music } from 'lucide-react';
import FocusTree from './FocusTree'; 

export const FocusModeOverlay = ({ 
  onExit, 
  state,
  onSaveFocusTime,
  onOpenSounds,
  onOpenSettings
}: { 
  onExit: () => void; 
  state: any; 
  onSaveFocusTime: (data: any) => void;
  onOpenSounds: () => void;
  onOpenSettings: () => void;
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [subject, setSubject] = useState(state.subjects[0]?.name || 'General');
  const [chapter, setChapter] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Grow tree over 1 hour
  const scale = Math.min(1.5, 0.5 + (seconds / 3600));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-between p-8 text-white"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-sm">
        {/* Tree container - Cleaned up */}
        <div className="w-80 h-80 flex items-center justify-center">
            <motion.div animate={{ scale }}>
                <FocusTree 
                  progressPercentage={((seconds / ((state.subjects.find((s: any) => s.name === subject)?.target || 60) * 60)) * 100)}
                  isFocused={isActive}
                  isActiveFocusWindow={true}
                  language={state.language || 'bn'}
                  treeType={state.selectedTreeType || 'sakura'}
                  minimal={true}
                />
            </motion.div>
        </div>

        {/* Timer */}
        <h2 className="text-6xl font-mono tracking-widest tabular-nums font-thin">{formatTime(seconds)}</h2>
        
        {/* Subject & Chapter */}
        <div className="flex flex-col gap-3 w-full">
            <select 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white text-md focus:outline-none focus:border-emerald-500/50"
            >
            {state.subjects.map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <input 
            type="text" 
            placeholder="Chapter name"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white text-md focus:outline-none focus:border-emerald-500/50"
            />
        </div>
      </div>

      {/* Actions - Bottom Dock */}
      <div className="flex items-center gap-8 py-6 px-10 bg-white/5 rounded-full backdrop-blur-sm border border-white/5">
        <button onClick={onOpenSounds} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Music className="w-5 h-5 text-emerald-400" />
        </button>
        <button onClick={() => { setIsActive(!isActive); }} className="p-5 bg-white/10 rounded-full hover:bg-emerald-500/20 transition-all">
          {isActive ? <Pause className="w-8 h-8 text-emerald-400" /> : <Play className="w-8 h-8 text-emerald-400" />}
        </button>
        <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Settings className="w-5 h-5 text-emerald-400" />
        </button>
        <button onClick={() => { onSaveFocusTime({ seconds, subject, chapter }); onExit(); }} className="p-2 rounded-full hover:bg-red-500/20 transition-colors">
            <Square className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </motion.div>
  );
};
