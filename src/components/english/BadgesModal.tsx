import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Award, 
  Sparkles, 
  HelpCircle, 
  Flame, 
  PenTool, 
  BookOpen, 
  Trophy, 
  Zap, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { Badge, UserProgressState } from '../../types/englishCare';
import { INITIAL_BADGES } from '../../data/badgesData';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgressState;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Award,
  HelpCircle,
  Flame,
  PenTool,
  BookOpen,
  Trophy,
  Zap,
};

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, progress }) => {
  if (!isOpen) return null;

  const unlockedCount = progress.unlockedBadges.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 text-white p-6 relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Achievements & Badges</h2>
                <p className="text-xs text-slate-300">
                  Unlocked: <strong>{unlockedCount} / {INITIAL_BADGES.length} Badges</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badge Grid */}
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INITIAL_BADGES.map((badge) => {
                const isUnlocked = progress.unlockedBadges.includes(badge.id);
                const IconComponent = iconMap[badge.icon] || Award;

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-amber-50/50 border-amber-300/80 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isUnlocked ? <IconComponent className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {badge.name}
                        </h4>
                        {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Keep learning grammar and writing to unlock all badges!</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
