import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, Trophy, Info } from 'lucide-react';

interface CinematicTreeProps {
  dayNumber: number; // 1 to 30
  stageLevel: 1 | 2 | 3 | 4 | 5 | 6;
  dailyProgressPct: number; // 0 to 100
  streak: number;
  language: 'bn' | 'en';
  onClickInfo?: () => void;
}

export function CinematicTree({
  dayNumber,
  stageLevel,
  dailyProgressPct,
  streak,
  language,
  onClickInfo
}: CinematicTreeProps) {
  const isCompleteToday = dailyProgressPct >= 100;
  const isStreakStrong = streak >= 7;
  const isMasterDay = dayNumber >= 30;

  // Stage name & details
  const stageInfo = {
    1: {
      nameBn: 'লেভেল ১: ছোট বীজ (Seed)',
      nameEn: 'Level 1: Foundation Seed',
      descBn: 'কণ্ঠের ভিত্তিপ্রস্তর ও মৃদু শ্বাস নেওয়া শুরু হয়েছে।',
      descEn: 'Foundational breath control & laryngeal relaxation.',
      height: 120,
    },
    2: {
      nameBn: 'লেভেল ২: কোমল অঙ্কুর (Sprout)',
      nameEn: 'Level 2: Green Sprout',
      descBn: 'হামিং ও লিপ ট্রিলের মাধ্যমে স্বরতন্ত্রীর জাগরণ।',
      descEn: 'Gentle humming & vocal fold decompression.',
      height: 150,
    },
    3: {
      nameBn: 'লেভেল ৩: তরুণ বৃক্ষ (Young Tree)',
      nameEn: 'Level 3: Young Tree',
      descBn: 'প্রথম সপ্তাহের সফলতায় সুন্দর ডালপালা ও পাতার বিস্তার।',
      descEn: 'Week 1 unlocked! Developing mask & chest resonance.',
      height: 180,
    },
    4: {
      nameBn: 'লেভেল ৪: বর্ধনশীল বৃক্ষ (Growing Tree)',
      nameEn: 'Level 4: Growing Tree',
      descBn: '১৪ দিনের নিবিড় অনুশীলনে কণ্ঠ হয়েছে সুদৃঢ় ও পরিশীলিত।',
      descEn: '14-Day milestone: Articulation clarity & steady tone.',
      height: 210,
    },
    5: {
      nameBn: 'লেভেল ৫: শক্তিশালী মহীরুহ (Strong Tree)',
      nameEn: 'Level 5: Strong Resonant Tree',
      descBn: '২১ দিনের রেডিও-গ্রেড আরজে ডেলিভারি ও সাবলীলতা।',
      descEn: '21-Day broadcast stability, deep poise, and pacing.',
      height: 235,
    },
    6: {
      nameBn: 'লেভেল ৬: পূর্ণাঙ্গ রূপান্তর বৃক্ষ (Master Tree)',
      nameEn: 'Level 6: Full Transformation Tree',
      descBn: '৩০ দিনের পূর্ণাঙ্গ রূপান্তর সম্পন্ন! আজীবন স্পষ্ট ও সুন্দর কণ্ঠ।',
      descEn: '30-Day Master Milestone: Flourished resonance & clarity.',
      height: 260,
    }
  }[stageLevel];

  return (
    <div className="relative w-full flex flex-col items-center select-none py-2">
      {/* Background Ambient Glow & Particles */}
      <motion.div
        animate={{
          scale: isCompleteToday ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: isCompleteToday ? [0.35, 0.6, 0.35] : [0.15, 0.28, 0.15]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isMasterDay
            ? 'bg-amber-400/25'
            : isCompleteToday
            ? 'bg-emerald-400/25'
            : 'bg-teal-500/15'
        }`}
      />

      {/* Interactive Tree SVG Visualizer */}
      <div 
        onClick={onClickInfo}
        className="relative w-full max-w-xs h-64 flex items-end justify-center cursor-pointer group"
      >
        <svg
          viewBox="0 0 320 280"
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] overflow-visible"
        >
          <defs>
            {/* Trunk Gradient */}
            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#784b2c" />
              <stop offset="60%" stopColor="#452714" />
              <stop offset="100%" stopColor="#2e170b" />
            </linearGradient>

            {/* Glowing Golden Branch Gradient */}
            <linearGradient id="goldTrunkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Lush Leaf Gradient */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            {/* Master Radiant Leaf Gradient */}
            <linearGradient id="masterLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Soil / Pod Gradient */}
            <radialGradient id="soilGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#064e3b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Glowing Island / Soil Base */}
          <ellipse cx="160" cy="255" rx="90" ry="18" fill="url(#soilGlow)" />
          <ellipse cx="160" cy="254" rx="72" ry="10" fill="#142820" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="160" cy="253" rx="55" ry="6" fill="#1f3d32" />

          {/* STAGE 1: Seed */}
          {stageLevel === 1 && (
            <g className="transition-all duration-700">
              <motion.ellipse
                cx="160"
                cy="245"
                rx="14"
                ry="18"
                fill="url(#trunkGrad)"
                stroke="#34d399"
                strokeWidth="2"
                animate={{ scale: [1, 1.06, 1], y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <path d="M 160 228 Q 163 218 168 214 Q 163 220 160 228" fill="#34d399" />
              {/* Seed Energy Pulse */}
              <motion.circle
                cx="160"
                cy="245"
                r="22"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                animate={{ scale: [0.8, 1.4], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </g>
          )}

          {/* STAGE 2: Sprout */}
          {stageLevel === 2 && (
            <g className="transition-all duration-700">
              {/* Small Stem */}
              <path
                d="M 160 252 Q 158 220 160 190"
                stroke="url(#trunkGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left Leaf */}
              <motion.path
                d="M 159 205 Q 135 195 130 180 Q 148 185 159 202"
                fill="url(#leafGrad)"
                stroke="#6ee7b7"
                strokeWidth="1"
                animate={{ rotate: [-2, 3, -2] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '159px 205px' }}
              />
              {/* Right Leaf */}
              <motion.path
                d="M 161 192 Q 185 180 190 165 Q 172 172 161 190"
                fill="url(#leafGrad)"
                stroke="#6ee7b7"
                strokeWidth="1"
                animate={{ rotate: [2, -4, 2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '161px 192px' }}
              />
              {/* Top Sprout Tip */}
              <circle cx="160" cy="188" r="4" fill="#6ee7b7" className="animate-pulse" />
            </g>
          )}

          {/* STAGE 3: Young Tree */}
          {stageLevel === 3 && (
            <g className="transition-all duration-700">
              {/* Trunk */}
              <path
                d="M 152 254 Q 156 210 157 165 Q 160 140 160 120"
                stroke={isStreakStrong ? "url(#goldTrunkGrad)" : "url(#trunkGrad)"}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              {/* Branches */}
              <path d="M 158 175 Q 130 155 115 145" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 158 150 Q 190 135 205 125" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />

              {/* Foliage Clusters */}
              <motion.ellipse
                cx="115"
                cy="140"
                rx="28"
                ry="22"
                fill="url(#leafGrad)"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.ellipse
                cx="205"
                cy="120"
                rx="26"
                ry="20"
                fill="url(#leafGrad)"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.ellipse
                cx="160"
                cy="105"
                rx="34"
                ry="26"
                fill="url(#leafGrad)"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </g>
          )}

          {/* STAGE 4: Growing Tree */}
          {stageLevel === 4 && (
            <g className="transition-all duration-700">
              {/* Sturdy Trunk */}
              <path
                d="M 148 254 Q 155 200 156 150 Q 160 110 160 85"
                stroke={isStreakStrong ? "url(#goldTrunkGrad)" : "url(#trunkGrad)"}
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left Main Branch */}
              <path d="M 155 170 Q 120 145 95 130" stroke="url(#trunkGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              {/* Right Main Branch */}
              <path d="M 158 145 Q 200 120 225 105" stroke="url(#trunkGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
              {/* Sub branches */}
              <path d="M 110 140 Q 95 110 85 95" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Foliage Puffs */}
              <ellipse cx="85" cy="95" rx="30" ry="24" fill="url(#leafGrad)" />
              <ellipse cx="105" cy="130" rx="34" ry="26" fill="url(#leafGrad)" />
              <ellipse cx="225" cy="100" rx="36" ry="28" fill="url(#leafGrad)" />
              <ellipse cx="190" cy="80" rx="38" ry="30" fill="url(#leafGrad)" />
              <motion.ellipse
                cx="160"
                cy="65"
                rx="44"
                ry="34"
                fill="url(#leafGrad)"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </g>
          )}

          {/* STAGE 5: Strong Tree */}
          {stageLevel === 5 && (
            <g className="transition-all duration-700">
              {/* Mighty Trunk */}
              <path
                d="M 144 254 Q 154 185 156 130 Q 160 85 160 60"
                stroke={isStreakStrong ? "url(#goldTrunkGrad)" : "url(#trunkGrad)"}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />
              {/* Strong Left Branches */}
              <path d="M 154 180 Q 110 150 75 125" stroke="url(#trunkGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 95 135 Q 70 100 55 75" stroke="url(#trunkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Strong Right Branches */}
              <path d="M 158 145 Q 215 115 245 95" stroke="url(#trunkGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 205 120 Q 235 85 255 60" stroke="url(#trunkGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />

              {/* Rich Foliage Canopy */}
              <ellipse cx="55" cy="75" rx="34" ry="28" fill="url(#leafGrad)" />
              <ellipse cx="85" cy="120" rx="38" ry="30" fill="url(#leafGrad)" />
              <ellipse cx="255" cy="65" rx="36" ry="28" fill="url(#leafGrad)" />
              <ellipse cx="235" cy="95" rx="42" ry="32" fill="url(#leafGrad)" />
              <ellipse cx="120" cy="55" rx="44" ry="34" fill="url(#leafGrad)" />
              <ellipse cx="200" cy="50" rx="46" ry="36" fill="url(#leafGrad)" />
              <motion.ellipse
                cx="160"
                cy="42"
                rx="52"
                ry="40"
                fill="url(#leafGrad)"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4.5, repeat: Infinity }}
              />
            </g>
          )}

          {/* STAGE 6: Master Tree (Grand 30-Day Completion) */}
          {stageLevel === 6 && (
            <g className="transition-all duration-700">
              {/* Celestial Radial Halo */}
              <circle cx="160" cy="100" r="110" fill="url(#soilGlow)" opacity="0.8" />

              {/* Master Golden Trunk */}
              <path
                d="M 140 254 Q 152 175 155 120 Q 160 70 160 45"
                stroke="url(#goldTrunkGrad)"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
              {/* Grand Left Branches */}
              <path d="M 152 175 Q 100 135 60 110" stroke="url(#goldTrunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M 85 125 Q 50 85 35 55" stroke="url(#goldTrunkGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
              {/* Grand Right Branches */}
              <path d="M 158 135 Q 225 105 265 80" stroke="url(#goldTrunkGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M 215 110 Q 255 70 280 40" stroke="url(#goldTrunkGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />

              {/* Full Radiant Canopy */}
              <ellipse cx="35" cy="55" rx="38" ry="30" fill="url(#masterLeafGrad)" />
              <ellipse cx="70" cy="105" rx="44" ry="34" fill="url(#masterLeafGrad)" />
              <ellipse cx="280" cy="45" rx="40" ry="30" fill="url(#masterLeafGrad)" />
              <ellipse cx="255" cy="85" rx="48" ry="36" fill="url(#masterLeafGrad)" />
              <ellipse cx="110" cy="40" rx="50" ry="38" fill="url(#masterLeafGrad)" />
              <ellipse cx="210" cy="35" rx="52" ry="40" fill="url(#masterLeafGrad)" />
              <motion.ellipse
                cx="160"
                cy="30"
                rx="60"
                ry="44"
                fill="url(#masterLeafGrad)"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              {/* Golden Floating Glow Orbs */}
              <circle cx="110" cy="30" r="3" fill="#fde68a" className="animate-ping" />
              <circle cx="210" cy="25" r="3" fill="#fde68a" className="animate-ping" />
              <circle cx="160" cy="10" r="4" fill="#fde68a" className="animate-bounce" />
            </g>
          )}

          {/* Daily 100% Sparkle Overlay */}
          {isCompleteToday && (
            <g>
              <motion.g
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <circle cx="130" cy="90" r="2.5" fill="#34d399" />
                <circle cx="190" cy="85" r="2.5" fill="#34d399" />
                <circle cx="160" cy="60" r="3" fill="#fbbf24" />
              </motion.g>
            </g>
          )}
        </svg>

        {/* Floating Day Indicator Pill */}
        <div className="absolute top-2 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-300 font-mono">
            {language === 'bn' ? `দিন ${dayNumber} / ৩০` : `Day ${dayNumber} / 30`}
          </span>
        </div>

        {/* Streak Badge indicator on Tree */}
        {streak > 0 && (
          <div className="absolute top-2 right-3 bg-amber-950/70 backdrop-blur-md border border-amber-800/60 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-[11px] font-bold text-amber-300 font-mono">
              {streak} {language === 'bn' ? 'দিন স্ট্রিক' : 'D Streak'}
            </span>
          </div>
        )}
      </div>

      {/* Tree Info Bar */}
      <div className="mt-1 text-center max-w-sm px-4">
        <div className="flex items-center justify-center gap-1.5">
          <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 tracking-wide">
            {language === 'bn' ? stageInfo.nameBn : stageInfo.nameEn}
          </h3>
          <button 
            onClick={onClickInfo}
            className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Tree Stage Details"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 leading-relaxed">
          {language === 'bn' ? stageInfo.descBn : stageInfo.descEn}
        </p>
      </div>
    </div>
  );
}
