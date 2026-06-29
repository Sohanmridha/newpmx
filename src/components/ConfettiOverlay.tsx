import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  angle: number;
  velocity: number;
  rotation: number;
}

interface ConfettiOverlayProps {
  active: boolean;
  onComplete: () => void;
  title?: string;
  message?: string;
}

const COLORS = [
  '#FFC107', // Gold
  '#FF5722', // Deep Orange
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#2196F3', // Light Blue
  '#e0f2fe', // Ice Blue
  '#4CAF50', // Green
  '#10B981', // Emerald
  '#F59E0B'  // Amber
];

const SHAPES: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ active, onComplete, title, message }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      // Build 110 diverse color burst particles
      const newParticles: Particle[] = Array.from({ length: 110 }).map((_, idx) => {
        const angle = Math.random() * Math.PI * 2; // Full circle burst angle
        const velocity = 50 + Math.random() * 150; // Random speed factor
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const size = 5 + Math.random() * 14; 
        const rotation = Math.random() * 360;

        return {
          id: idx,
          x: 0, // Starts at center
          y: 0,
          color: randomColor,
          size,
          shape: randomShape,
          angle,
          velocity,
          rotation
        };
      });

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 4200);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-55 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => {
          // Physics coordinates calculation using framing offsets
          const endX = Math.cos(p.angle) * p.velocity * 4;
          const endY = Math.sin(p.angle) * p.velocity * 4 + 250; // Added gravity effect down

          return (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.1, rotate: 0 }}
              animate={{
                x: endX,
                y: endY,
                opacity: [1, 1, 0.9, 0],
                scale: [0.3, 1.2, 0.8, 0],
                rotate: p.rotation * 4
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: p.shape !== 'triangle' ? p.color : 'transparent',
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
                borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
                borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
                boxShadow: `0 0 10px ${p.color}33`
              }}
            />
          );
        })}
      </AnimatePresence>
      
      {/* Visual Splash Message overlay card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: -40 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1, 0.8], y: [40, 0, 0, -50] }}
        transition={{ duration: 3.5, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
        className="px-8 py-5 rounded-3xl bg-slate-900/95 border-2 border-amber-500/50 text-center shadow-2xl backdrop-blur-md pointer-events-auto"
      >
        <span className="text-3xl block mb-1">🎉</span>
        <h3 className="text-lg font-black bg-gradient-to-r from-amber-400 via-amber-200 to-rose-400 bg-clip-text text-transparent font-sans uppercase tracking-wider">
          {title || (active && title === undefined ? 'Habit Completed!' : '')}
        </h3>
        <p className="text-xs text-slate-300 font-bold mt-1 max-w-[280px] leading-relaxed">
          {message || (active && message === undefined ? 'Incredible consistency! Your academic streak is shining bright.' : '')}
        </p>
      </motion.div>
    </div>
  );
};
