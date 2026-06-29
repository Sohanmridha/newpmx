import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface FocusTreeProps {
  progressPercentage: number; // 0 to 100+
  isFocused: boolean; // active timer
  isActiveFocusWindow: boolean; // user currently has page focused
  language: 'bn' | 'en';
  treeType?: 'sakura' | 'olive' | 'rosemary' | 'cactus' | 'banyan' | 'bamboo' | 'pine' | 'rose' | 'maple' | 'ginkgo' | 'bonsai' | 'palm' | 'sunflower' | 'clover' | 'tulip' | 'lavender' | 'lotus' | 'sequoia' | 'lemon' | 'apple';
  minimal?: boolean;
  onToggle?: () => void;
  onReset?: () => void;
  secondsElapsed?: number;
}

export default function FocusTree({ 
  progressPercentage, 
  isFocused, 
  isActiveFocusWindow, 
  language,
  treeType = 'sakura',
  minimal = false,
  onToggle,
  onReset,
  secondsElapsed = 0
}: FocusTreeProps) {
  // Cap percentage at 120 for extreme progress
  const pct = Math.min(progressPercentage, 120);

  // Growth Stage evaluation depending on plant type
  let stageTextBn = "অঙ্কুর রোপণের অপেক্ষায়";
  let stageTextEn = "Awaiting Seed sowing";

  if (pct > 0 && pct < 15) {
    stageTextBn = "বীজ ফুটছে (অঙ্কুরদগম)";
    stageTextEn = "Seed Sprouting (Germination)";
  } else if (pct >= 15 && pct < 50) {
    stageTextBn = "ছোট চারাগাছ (যত্ন নিন)";
    stageTextEn = "Small Sapling (Requires attention)";
  } else if (pct >= 50 && pct < 85) {
    stageTextBn = "সুবিন্যস্ত কান্ড ও শাখা";
    stageTextEn = "Sturdy Trunk & Fresh Branches";
  } else if (pct >= 85 && pct < 100) {
    stageTextBn = "ঘন পজিティブ বৃক্ষ!";
    stageTextEn = "Mature Lush Flowering Tree!";
  } else if (pct >= 100) {
    const treeNamesBn: Record<string, string> = {
      sakura: 'চেরি ব্লসম',
      olive: 'জায়তুন',
      rosemary: 'রোজমেরি',
      cactus: 'ক্যাকটাস',
      banyan: 'বটবৃক্ষ',
      bamboo: 'বাঁশঝাড়',
      pine: 'পাইন বন',
      rose: 'গোলাপ গাছ',
      maple: 'লাল ম্যাপেল',
      ginkgo: 'সোনালী জিঙ্কগো',
      bonsai: 'জুনিপার বনসাই',
      palm: 'নারকেল পাম',
      sunflower: 'সূর্যমুখী',
      clover: 'চার পাতার ক্লোভার',
      tulip: 'টিউলিপ ফুল',
      lavender: 'ল্যাভেন্ডার',
      lotus: 'পদ্ম ফুল',
      sequoia: 'সিকোইয়া বৃক্ষ',
      lemon: 'লেবু লেবু গাছ',
      apple: 'আপেল বৃক্ষ'
    };
    const treeNamesEn: Record<string, string> = {
      sakura: 'Sakura Cherry Blossom',
      olive: 'Sacred Olive',
      rosemary: 'Lavender Rosemary',
      cactus: 'Desert Cactus Rose',
      banyan: 'Eternal Banyan',
      bamboo: 'Bright Jade Bamboo',
      pine: 'Evergreen Alpine Pine',
      rose: 'Royal Red Rose Bush',
      maple: 'Crimson Golden Maple',
      ginkgo: 'Sunlight Yellow Ginkgo',
      bonsai: 'Zen Juniper Bonsai',
      palm: 'Tropical Coconut Palm',
      sunflower: 'Radiant Giant Sunflower',
      clover: 'Lucky Four-Leaf Clover',
      tulip: 'Velvet Pink Tulip Duo',
      lavender: 'Scented Sweet Lavender',
      lotus: 'Pristine Water Lotus',
      sequoia: 'Colossal Sequoia Giant',
      lemon: 'Zesty Yellow Lemon Tree',
      apple: 'Imperial Apple Orchard'
    };
    stageTextBn = `ফলবন্ত পূর্ণ ${treeNamesBn[treeType] || 'চেরি ব্লসম'} গাছ!`;
    stageTextEn = `Magnificent Mature ${treeNamesEn[treeType] || 'Sakura'} complete!`;
  }

  // Determine colors based on active tab state
  // If user left study and timer is running but they left the window => wither the tree!
  const isWithered = isFocused && !isActiveFocusWindow;

  // Let's declare our SVG styling variables
  const potColor = isWithered ? '#4b5563' : '#1e293b';
  const soilColor = isWithered ? '#78350f' : '#451a03';
  const trunkColor = isWithered ? '#7c2d12' : '#854d0e';
  
  // Custom leaf and blossom colors for different plants!
  let leafColor = isWithered ? '#ea580c' : '#22c55e'; // Default blooming green
  let bloomColor = isWithered ? '#b91c1c' : '#ec4899'; // Default sakura pink

  if (treeType === 'olive') {
    leafColor = isWithered ? '#6b7280' : '#3f6212'; // Sage/olive matte green
    bloomColor = isWithered ? '#4b5563' : '#facc15'; // Golden yellow olives
  } else if (treeType === 'rosemary') {
    leafColor = isWithered ? '#4b5563' : '#047857'; // Herbal rosemary dark emerald
    bloomColor = isWithered ? '#312e81' : '#c084fc'; // Rosemary purple lavender beads
  } else if (treeType === 'cactus') {
    leafColor = isWithered ? '#78350f' : '#166534'; // Spiky deep desktop cactus green
    bloomColor = isWithered ? '#7c2d12' : '#ef4444'; // Radiant ruby desert rose bloom
  } else if (treeType === 'banyan') {
    leafColor = isWithered ? '#782d12' : '#15803d'; // Golden dark roots green
    bloomColor = isWithered ? '#b91c1c' : '#f97316'; // Reddish-orange banyan fruits
  } else if (treeType === 'bamboo') {
    leafColor = isWithered ? '#854d0e' : '#4ade80'; // Tall vibrant bamboo jade
    bloomColor = isWithered ? '#701a08' : '#10b981'; // Slinky emerald buds
  } else if (treeType === 'pine') {
    leafColor = isWithered ? '#451a03' : '#065f46'; // Mountain spruce deep green
    bloomColor = isWithered ? '#78350f' : '#34d399'; // Gold pinecone needles
  } else if (treeType === 'rose') {
    leafColor = isWithered ? '#7c2d12' : '#047857'; // Lush foliage emerald
    bloomColor = isWithered ? '#991b1b' : '#f43f5e'; // Deep crimson velvet roses
  } else if (treeType === 'maple') {
    leafColor = isWithered ? '#7c2d12' : '#ea580c'; // Warm autumnal orange
    bloomColor = isWithered ? '#991b1b' : '#f97316'; // Vivid orange stars
  } else if (treeType === 'ginkgo') {
    leafColor = isWithered ? '#78350f' : '#eab308'; // Bright Ginkgo yellow
    bloomColor = isWithered ? '#451a03' : '#fef08a'; // Pale yellow seeds
  } else if (treeType === 'bonsai') {
    leafColor = isWithered ? '#4b5563' : '#0d9488'; // Clean teal bonsai spikes
    bloomColor = isWithered ? '#1e293b' : '#ffffff'; // Pristine white river stones
  } else if (treeType === 'palm') {
    leafColor = isWithered ? '#854d0e' : '#047857'; // Arching fronds
    bloomColor = isWithered ? '#451a03' : '#78350f'; // Coconut brown pods
  } else if (treeType === 'sunflower') {
    leafColor = isWithered ? '#78350f' : '#84cc16'; // Bright light green
    bloomColor = isWithered ? '#451a03' : '#fbbf24'; // Golden ray wild petals
  } else if (treeType === 'clover') {
    leafColor = isWithered ? '#7c2d12' : '#10b981'; // Lucky clover emerald
    bloomColor = isWithered ? '#1e293b' : '#34d399'; // Shimmering green
  } else if (treeType === 'tulip') {
    leafColor = isWithered ? '#854d0e' : '#22c55e'; // Spring green
    bloomColor = isWithered ? '#730d1c' : '#f43f5e'; // Bright rose tulip bulbs
  } else if (treeType === 'lavender') {
    leafColor = isWithered ? '#4b5563' : '#8b5cf6'; // Herbaceous purple-green
    bloomColor = isWithered ? '#312e81' : '#a78bfa'; // Deep lavender spire blooms
  } else if (treeType === 'lotus') {
    leafColor = isWithered ? '#115e59' : '#0d9488'; // Wide aquatic teal leaves
    bloomColor = isWithered ? '#831843' : '#f472b6'; // Sacred pink lotus blossom
  } else if (treeType === 'sequoia') {
    leafColor = isWithered ? '#451a03' : '#14532d'; // Ancient dark green
    bloomColor = isWithered ? '#7c2d12' : '#b45309'; // Redcedar gold pinecones
  } else if (treeType === 'lemon') {
    leafColor = isWithered ? '#854d0e' : '#65a30d'; // Energetic lime leafy green
    bloomColor = isWithered ? '#78350f' : '#facc15'; // Ripe bright yellow lemons
  } else if (treeType === 'apple') {
    leafColor = isWithered ? '#7c2d12' : '#15803d'; // Strong apple branches
    bloomColor = isWithered ? '#7f1d1d' : '#dc2626'; // Red delicious orchard fruit dots
  }

  // Grow trunk height & branches based on percentage
  const scale = pct / 100;

  const renderSvg = () => (
    <svg viewBox="0 0 200 240" className={`${minimal ? 'w-full h-full' : 'w-56 h-56'} transition-all duration-1000`}>
      
      {/* Background Decorative Rings */}
      <circle cx="100" cy="110" r="80" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" fill="none" />
      <circle cx="100" cy="110" r="50" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" fill="none" />

      {/* Soil/Planter base */}
      <ellipse cx="100" cy="190" rx="40" ry="10" fill={soilColor} className="transition-colors duration-500" />
      <path d="M72 192 L128 192 L120 215 L80 215 Z" fill={potColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" className="transition-colors duration-500" />
      <line x1="85" y1="202" x2="115" y2="202" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />

      {/* --- DYNAMIC STAGE 1: Seed / Sprout (progress 0 - 20) --- */}
      {pct > 0 && pct < 20 && (
        <g>
          {/* Sprout stem */}
          <path 
            d={`M100 190 Q${98 - (scale * 20)} ${180 - (scale * 80)} 100 ${190 - Math.max(scale * 150, 15)}`} 
            stroke={trunkColor} 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* Small leaves */}
          <path 
            d={`M100 ${190 - Math.max(scale * 150, 15)} Q112 ${182 - Math.max(scale * 150, 15)} 108 ${193 - Math.max(scale * 150, 15)} Z`} 
            fill={leafColor} 
          />
          <path 
            d={`M100 ${190 - Math.max(scale * 150, 15)} Q88 ${182 - Math.max(scale * 150, 15)} 92 ${193 - Math.max(scale * 150, 15)} Z`} 
            fill={leafColor} 
          />
        </g>
      )}

      {/* --- DYNAMIC STAGE 2: Sapling (progress 20 - 55) --- */}
      {pct >= 20 && pct < 55 && (
        <g>
          {/* Trunk */}
          <path 
            d="M100 190 Q95 150 100 120" 
            stroke={trunkColor} 
            strokeWidth="5.5" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* Left branch */}
          <path 
            d="M98 160 Q85 145 78 135" 
            stroke={trunkColor} 
            strokeWidth="3.5" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* Right branch */}
          <path 
            d="M100 145 Q115 130 122 120" 
            stroke={trunkColor} 
            strokeWidth="3.5" 
            fill="none" 
            strokeLinecap="round" 
          />

          {/* Sapling Leaves */}
          <ellipse cx="100" cy="120" rx="8" ry="12" fill={leafColor} transform="rotate(-15, 100, 120)" />
          <ellipse cx="78" cy="135" rx="7" ry="10" fill={leafColor} transform="rotate(-45, 78, 135)" />
          <ellipse cx="122" cy="120" rx="7" ry="10" fill={leafColor} transform="rotate(45, 122, 120)" />
          <ellipse cx="90" cy="140" rx="5" ry="8" fill={leafColor} transform="rotate(-30, 90, 140)" />
        </g>
      )}

      {/* --- DYNAMIC STAGE 3: Medium Tree (progress 55 - 85) --- */}
      {pct >= 55 && pct < 85 && (
        <g>
          {/* Strong Trunk */}
          <path d="M100 190 Q96 140 100 95" stroke={trunkColor} strokeWidth="8" fill="none" strokeLinecap="round" />
          
          {/* Left Branch */}
          <path d="M98 145 Q75 130 65 110" stroke={trunkColor} strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d="M72 125 Q60 115 50 115" stroke={trunkColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          
          {/* Right Branch */}
          <path d="M100 130 Q125 110 135 90" stroke={trunkColor} strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d="M118 110 Q135 105 145 110" stroke={trunkColor} strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Leaves Blocks */}
          <circle cx="100" cy="90" r="16" fill={leafColor} opacity="0.95" />
          <circle cx="65" cy="105" r="14" fill={leafColor} opacity="0.95" />
          <circle cx="135" cy="85" r="15" fill={leafColor} opacity="0.95" />
          <circle cx="50" cy="115" r="10" fill={leafColor} opacity="0.9" />
          <circle cx="145" cy="110" r="11" fill={leafColor} opacity="0.9" />
          <circle cx="95" cy="115" r="12" fill={leafColor} opacity="0.85" />
        </g>
      )}

      {/* --- DYNAMIC STAGE 4: Full Mature & Blooming Tree (progress 85+) --- */}
      {pct >= 85 && (
        <g>
          {/* Massive Thick Trunk */}
          <path d="M100 190 Q97 130 100 80" stroke={trunkColor} strokeWidth="11" fill="none" strokeLinecap="round" className="transition-colors duration-500" />
          
          {/* Elaborate branch network */}
          <path d="M98 140 Q70 120 55 90" stroke={trunkColor} strokeWidth="7" fill="none" strokeLinecap="round" className="transition-colors duration-500" />
          <path d="M68 110 Q50 95 40 98" stroke={trunkColor} strokeWidth="4" fill="none" strokeLinecap="round" className="transition-colors duration-500" />
          
          <path d="M100 125 Q130 100 145 75" stroke={trunkColor} strokeWidth="7" fill="none" strokeLinecap="round" className="transition-colors duration-500" />
          <path d="M120 100 Q145 92 158 95" stroke={trunkColor} strokeWidth="4" fill="none" strokeLinecap="round" className="transition-colors duration-500" />
          
          <path d="M100 95 Q90 70 85 55" stroke={trunkColor} strokeWidth="5.5" fill="none" strokeLinecap="round" className="transition-colors duration-500" />
          <path d="M102 95 Q115 75 120 58" stroke={trunkColor} strokeWidth="5.5" fill="none" strokeLinecap="round" className="transition-colors duration-500" />

          {/* Giant dense leaves clumps */}
          <circle cx="100" cy="72" r="23" fill={leafColor} opacity="0.95" className="transition-colors duration-500" />
          <circle cx="55" cy="85" r="21" fill={leafColor} opacity="0.95" className="transition-colors duration-500" />
          <circle cx="145" cy="72" r="22" fill={leafColor} opacity="0.95" className="transition-colors duration-500" />
          <circle cx="85" cy="50" r="18" fill={leafColor} opacity="0.95" className="transition-colors duration-500" />
          <circle cx="120" cy="52" r="18" fill={leafColor} opacity="0.95" className="transition-colors duration-500" />
          <circle cx="40" cy="98" r="15" fill={leafColor} opacity="0.9" className="transition-colors duration-500" />
          <circle cx="160" cy="95" r="15" fill={leafColor} opacity="0.9" className="transition-colors duration-500" />
          <circle cx="100" cy="110" r="16" fill={leafColor} opacity="0.85" className="transition-colors duration-500" />

          {/* Flowers & Fruit stars when reached 100%+ progress */}
          {pct >= 100 && (
            <g className="animate-pulse">
              {/* Top star fruits */}
              <circle cx="100" cy="60" r="4" fill={bloomColor} />
              <circle cx="50" cy="80" r="3.5" fill={bloomColor} />
              <circle cx="140" cy="65" r="4" fill={bloomColor} />
              <circle cx="80" cy="45" r="3" fill={bloomColor} />
              <circle cx="120" cy="45" r="3" fill={bloomColor} />
              <circle cx="155" cy="90" r="3.5" fill={bloomColor} />
              
              {/* Mini blooming star shapes */}
              <polygon points="100,53 102,57 106,57 103,59 104,63 100,61 96,63 97,59 94,57 98,57" fill="#facc15" />
              <polygon points="60,70 61,73 64,73 62,75 63,78 60,76 57,78 58,75 56,73 59,73" fill="#facc15" />
              <polygon points="135,50 136,53 139,53 137,55 138,58 135,56 132,58 133,55 131,53 134,53" fill="#facc15" />
            </g>
          )}
        </g>
      )}

      {/* Flat floor shadow */}
      <ellipse cx="100" cy="225" rx="55" ry="6" fill="rgba(0,0,0,0.15)" />
    </svg>
  );

  if (minimal) {
    return (
      <div className="relative flex items-center justify-center w-36 h-36 md:w-44 md:h-44 mx-auto select-none">
        {!isWithered && isFocused && (
          <div className="absolute inset-0 bg-green-500/5 rounded-full blur-2xl animate-pulse"></div>
        )}
        {renderSvg()}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative overflow-hidden">
      
      {/* Background glowing aura when focus is actively growing */}
      {!isWithered && isFocused && (
        <div className="absolute w-44 h-44 bg-green-500/10 rounded-full blur-3xl animate-pulse -top-6"></div>
      )}

      {/* SVG Canvas */}
      {renderSvg()}

      {/* Progress status indicators */}
      <div className="w-full mt-4 text-center">
        <div className="text-xs font-semibold text-slate-400 capitalize tracking-wider flex items-center justify-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isWithered ? 'bg-red-500' : isFocused ? 'bg-green-500 animate-ping' : 'bg-slate-600'}`} />
          {language === 'bn' ? stageTextBn : stageTextEn}
        </div>

        {/* Hither/Wither Alert */}
        {isWithered ? (
          <div className="mt-2.5 px-3 py-1.5 rounded-lg border border-red-500/25 bg-red-950/20 text-red-200 text-xs font-medium animate-bounce leading-tight">
            ⚠️ {language === 'bn' ? 'বৃদ্ধি থেমে গেছে! মনোযোগ হারিয়ে অন্য ট্যাবে গিয়েছেন!' : 'GROWTH SUSPENDED: Loss of Window Focus Detected!'}
          </div>
        ) : isFocused && isActiveFocusWindow ? (
          <div className="mt-2.5 text-green-400 text-xs font-medium tracking-wide">
            🌱 {language === 'bn' ? 'চমৎকার! ফোকাস সচল আছে। গাছটি ধীরে ধীরে বড় হচ্ছে...' : 'Active Focus: Growth in progress...'}
          </div>
        ) : (
          <div className="mt-2.5 text-slate-500 text-xs italic">
            🕒 {language === 'bn' ? 'টাইমার শুরু করুন এবং মনোযোগ দিন গাছটি বড় করতে' : 'Start study timer to nurture the tree'}
          </div>
        )}

        {/* Numerical indicator */}
        <div className="mt-3 flex items-center justify-between px-3 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          <span>{language === 'bn' ? 'প্রগতি:' : 'Progress:'}</span>
          <span className="font-mono text-amber-500 font-bold">{Math.floor(pct)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${isWithered ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-green-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* 'Focus Timer' control buttons direct integration inside FocusTree area */}
        {onToggle && (
          <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex items-center justify-center gap-2 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.97] cursor-pointer ${
                isFocused
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              {isFocused ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'থামুন' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'শুরু' : 'Start'}</span>
                </>
              )}
            </button>
            {onReset && secondsElapsed > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                className="px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-[11px] text-slate-400 hover:text-rose-300 font-extrabold uppercase tracking-wider transition-all active:scale-[0.97] flex items-center gap-1.5 cursor-pointer"
                title={language === 'bn' ? 'রিসেট' : 'Reset Timer'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
