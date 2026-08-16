import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface SkyEnvironmentProps {
  themeMode?: 'auto' | 'morning' | 'afternoon' | 'evening' | 'night';
  className?: string;
  children?: React.ReactNode;
}

export function SkyEnvironment({ themeMode = 'auto', className = '', children }: SkyEnvironmentProps) {
  // Determine current atmospheric period
  const atmosphere = useMemo(() => {
    if (themeMode !== 'auto') return themeMode;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  }, [themeMode]);

  const styleConfig = useMemo(() => {
    switch (atmosphere) {
      case 'morning':
        return {
          bgGradient: 'from-[#0b1220] via-[#161f38] to-[#2a2233]',
          glowGradient: 'radial-gradient(ellipse at 50% 10%, rgba(251, 191, 36, 0.15), transparent 70%)',
          accentAura: 'bg-amber-500/10',
          cloudColor: 'bg-gradient-to-r from-amber-200/10 via-rose-300/10 to-indigo-300/5',
          starOpacity: 0.15,
          sunMoonGlow: 'bg-amber-400/20 shadow-[0_0_80px_rgba(251,191,36,0.3)]',
          labelBn: 'ভোরের মৃদু আলো ও নতুন উদ্দীপনা',
          labelEn: 'Serene Sunrise Atmosphere'
        };
      case 'afternoon':
        return {
          bgGradient: 'from-[#071324] via-[#0d223f] to-[#0a182e]',
          glowGradient: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.18), transparent 70%)',
          accentAura: 'bg-sky-500/10',
          cloudColor: 'bg-gradient-to-r from-sky-200/10 via-cyan-100/10 to-blue-300/5',
          starOpacity: 0.05,
          sunMoonGlow: 'bg-sky-400/20 shadow-[0_0_80px_rgba(56,189,248,0.25)]',
          labelBn: 'স্পষ্ট দিবাভাগ ও আলোকোজ্জ্বল স্বচ্ছতা',
          labelEn: 'Bright Daytime Atmosphere'
        };
      case 'evening':
        return {
          bgGradient: 'from-[#140a18] via-[#241226] to-[#120816]',
          glowGradient: 'radial-gradient(ellipse at 50% 15%, rgba(244, 63, 94, 0.15), rgba(217, 119, 6, 0.1) 40%, transparent 70%)',
          accentAura: 'bg-rose-500/10',
          cloudColor: 'bg-gradient-to-r from-rose-400/10 via-orange-300/10 to-purple-400/5',
          starOpacity: 0.35,
          sunMoonGlow: 'bg-rose-400/20 shadow-[0_0_80px_rgba(244,63,94,0.3)]',
          labelBn: 'সান্ধ্যকালীন আরজে রেজোন্যান্স ও সুর',
          labelEn: 'Warm Twilight Sunset'
        };
      case 'night':
      default:
        return {
          bgGradient: 'from-[#030712] via-[#070e1c] to-[#040914]',
          glowGradient: 'radial-gradient(ellipse at 50% 5%, rgba(99, 102, 241, 0.12), transparent 70%)',
          accentAura: 'bg-indigo-500/10',
          cloudColor: 'bg-gradient-to-r from-indigo-300/5 via-purple-300/5 to-slate-400/5',
          starOpacity: 0.65,
          sunMoonGlow: 'bg-indigo-300/15 shadow-[0_0_70px_rgba(165,180,252,0.2)]',
          labelBn: 'নিবিড় রজনী ও গভীর ভোকাল রিকভারি',
          labelEn: 'Deep Cosmic Recovery Sky'
        };
    }
  }, [atmosphere]);

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${styleConfig.bgGradient} text-slate-100 overflow-x-hidden ${className}`}>
      {/* Dynamic Atmospheric Radial Light */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{ background: styleConfig.glowGradient }}
      />

      {/* Subtle Starfield */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] transition-opacity duration-1000"
        style={{ opacity: styleConfig.starOpacity }}
      />

      {/* Celestial Orb (Soft Sun / Moon Glow) */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          opacity: [0.7, 0.9, 0.7]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`fixed top-8 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl pointer-events-none z-0 ${styleConfig.sunMoonGlow}`}
      />

      {/* Subtle Animated Clouds drifting horizontally */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <motion.div
          animate={{ x: ['-20%', '100%'] }}
          transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
          className={`absolute top-12 -left-1/3 w-[140%] h-36 blur-3xl rounded-full ${styleConfig.cloudColor}`}
        />
        <motion.div
          animate={{ x: ['100%', '-20%'] }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className={`absolute top-44 -right-1/3 w-[120%] h-44 blur-3xl rounded-full ${styleConfig.cloudColor}`}
        />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
