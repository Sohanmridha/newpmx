import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Activity, Play, Pause, Check, RotateCcw, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { Language } from '../types/voice';
import { BODY_VOICE_ROUTINE } from '../data/voiceCurriculum';
import { playSuccessChime } from '../utils/voiceAudioSynth';

interface BodyWellnessModalProps {
  language: Language;
  onClose: () => void;
  onComplete: () => void;
}

export function BodyWellnessModal({ language, onClose, onComplete }: BodyWellnessModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(BODY_VOICE_ROUTINE[0].durationSec);
  const [completed, setCompleted] = useState(false);

  const step = BODY_VOICE_ROUTINE[currentIdx] || BODY_VOICE_ROUTINE[0];

  useEffect(() => {
    setSecondsRemaining(step.durationSec);
    setIsPlaying(true);
  }, [currentIdx, step]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && secondsRemaining > 0 && !completed) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, secondsRemaining, completed]);

  const handleNext = () => {
    if (currentIdx < BODY_VOICE_ROUTINE.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
      setIsPlaying(false);
      playSuccessChime();
    }
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {language === 'bn' ? 'শারীরিক অঙ্গবিন্যাস ও রিলাক্সেশন' : 'Body & Posture Wellness'}
              </h3>
              <span className="text-xs text-slate-400">
                {language === 'bn' ? `ধাপ ${currentIdx + 1} / ${BODY_VOICE_ROUTINE.length}` : `Step ${currentIdx + 1} of ${BODY_VOICE_ROUTINE.length}`}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!completed ? (
          <div className="space-y-4">
            {/* Step Visual Guide Card */}
            <div className="h-44 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: currentIdx === 0 ? [-5, 5, -5] : [0, 0, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-3xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-md mb-2"
              >
                <Activity className="w-8 h-8" />
              </motion.div>

              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? step.nameBn : step.nameEn}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                {language === 'bn' ? step.instructionBn : step.instructionEn}
              </p>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <div className="font-mono text-xl font-black text-white">
                00:{secondsRemaining.toString().padStart(2, '0')}
              </div>

              <button
                onClick={handleNext}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1"
              >
                <span>{language === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 border border-teal-400 flex items-center justify-center mx-auto shadow-xl">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                {language === 'bn' ? 'দেহভঙ্গি সম্পূর্ণ শিথিল!' : 'Posture Aligned & Relaxed!'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {language === 'bn'
                  ? 'বুক ও ঘাড়ের পেশী শিথিল হয়েছে, যা গভীর ডায়াফ্রাম্যাটিক শ্বাস নিতে সাহায্য করবে।'
                  : 'Chest and neck muscles are relaxed, enabling optimal subglottic air projection.'}
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'bn' ? 'সম্পন্ন করুন' : 'Finish Routine'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
