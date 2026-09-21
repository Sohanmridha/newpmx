import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/english/Navbar';
import { DashboardView } from './components/english/DashboardView';
import { GrammarMasterView } from './components/english/GrammarMasterView';
import { VocabularyArenaView } from './components/english/VocabularyArenaView';
import { WritingHubView } from './components/english/WritingHubView';
import { UnseenPassageView } from './components/english/UnseenPassageView';
import { MockTestView } from './components/english/MockTestView';
import { CopilotView } from './components/english/CopilotView';
import { BadgesModal } from './components/english/BadgesModal';
import { MainTab, UserProgressState, TargetGoal } from './types/englishCare';
import { soundFX } from './utils/audioFeedback';

const PROGRESS_STORAGE_KEY = 'englishcare_user_progress_v2';

const DEFAULT_PROGRESS: UserProgressState = {
  studentName: 'Sohan Mridha',
  targetGoal: 'aplus_target',
  dailyStreak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalXp: 350,
  level: 2,
  todayStudyMinutes: 35,
  dailyTargetMinutes: 90,
  syllabusCoveragePercent: 42,
  completedRules: ['rfv_rule_1', 'rfv_rule_2', 'wh_rule_1', 'sc_rule_1'],
  masteredVocab: ['syn_01', 'syn_02', 'ant_01'],
  learningVocab: ['syn_03'],
  completedQuizzes: {},
  modelTestResults: [],
  unlockedBadges: ['badge_first_step']
};

export function App() {
  const [currentTab, setCurrentTab] = useState<MainTab>('dashboard');
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // User Progress state with localStorage hydration
  const [progress, setProgress] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_PROGRESS;
  });

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // Live Study Timer (increments minutes)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newTodayMins = prev.todayStudyMinutes + 1;
          return {
            ...prev,
            todayStudyMinutes: newTodayMins
          };
        });
      }, 60000); // every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Earn XP & Level Progression
  const handleEarnXp = (amount: number, reason: string) => {
    setProgress(prev => {
      const newXp = prev.totalXp + amount;
      const newLevel = Math.floor(newXp / 200) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        soundFX.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      return {
        ...prev,
        totalXp: newXp,
        level: newLevel
      };
    });
  };

  // Rule Completion
  const handleCompleteRule = (ruleId: string) => {
    setProgress(prev => {
      if (prev.completedRules.includes(ruleId)) return prev;
      const updatedRules = [...prev.completedRules, ruleId];
      // calculate new coverage based on 23 rules total
      const newCoverage = Math.min(100, Math.round((updatedRules.length / 23) * 50) + 20);

      // Check badges
      const newBadges = [...prev.unlockedBadges];
      if (updatedRules.length >= 10 && !newBadges.includes('badge_rfv_pro')) {
        newBadges.push('badge_rfv_pro');
        confetti({ particleCount: 100, spread: 80 });
      }

      return {
        ...prev,
        completedRules: updatedRules,
        syllabusCoveragePercent: newCoverage,
        unlockedBadges: newBadges
      };
    });
  };

  // Master Vocab Word
  const handleMasterWord = (wordId: string) => {
    setProgress(prev => {
      if (prev.masteredVocab.includes(wordId)) return prev;
      const updatedVocab = [...prev.masteredVocab, wordId];
      const newBadges = [...prev.unlockedBadges];
      if (updatedVocab.length >= 20 && !newBadges.includes('badge_vocab_titan')) {
        newBadges.push('badge_vocab_titan');
        confetti({ particleCount: 100, spread: 80 });
      }
      return {
        ...prev,
        masteredVocab: updatedVocab,
        unlockedBadges: newBadges
      };
    });
  };

  // Update Syllabus Coverage
  const handleUpdateCoverage = (additionalPercent: number) => {
    setProgress(prev => ({
      ...prev,
      syllabusCoveragePercent: Math.min(100, prev.syllabusCoveragePercent + additionalPercent)
    }));
  };

  // Record Model Test Result
  const handleRecordTestResult = (result: {
    testId: string;
    testNumber: number;
    score: number;
    totalMarks: number;
    date: string;
    timeTakenSeconds: number;
  }) => {
    setProgress(prev => {
      const newResults = [...prev.modelTestResults, result];
      const newBadges = [...prev.unlockedBadges];
      if (result.score >= 40 && !newBadges.includes('badge_100_mark_hero')) {
        newBadges.push('badge_100_mark_hero');
        confetti({ particleCount: 120, spread: 90 });
      }
      return {
        ...prev,
        modelTestResults: newResults,
        unlockedBadges: newBadges
      };
    });
  };

  // Toggle Target Goal
  const handleToggleGoal = () => {
    setProgress(prev => {
      const nextGoal: TargetGoal = prev.targetGoal === 'pass_target' ? 'aplus_target' : 'pass_target';
      soundFX.playCardSwipe();
      return {
        ...prev,
        targetGoal: nextGoal
      };
    });
  };

  // Toggle Timer
  const handleToggleTimer = () => {
    setIsTimerRunning(prev => !prev);
    soundFX.playCardSwipe();
  };

  // Add Study Minutes
  const handleAddStudyMinutes = (mins: number) => {
    setProgress(prev => ({
      ...prev,
      todayStudyMinutes: prev.todayStudyMinutes + mins
    }));
    soundFX.playSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Main Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        progress={progress}
        isTimerRunning={isTimerRunning}
        onToggleTimer={handleToggleTimer}
        onToggleGoal={handleToggleGoal}
        onOpenBadges={() => setIsBadgesOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <AnimatePresence mode="wait">
          {currentTab === 'dashboard' && (
            <motion.div
              key="view-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <DashboardView
                progress={progress}
                onNavigateTab={(tab) => {
                  setCurrentTab(tab);
                  soundFX.playCardSwipe();
                }}
                onOpenBadges={() => setIsBadgesOpen(true)}
                onAddStudyMinutes={handleAddStudyMinutes}
              />
            </motion.div>
          )}

          {currentTab === 'grammar' && (
            <motion.div
              key="view-grammar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <GrammarMasterView
                onEarnXp={handleEarnXp}
                completedRules={progress.completedRules}
                onCompleteRule={handleCompleteRule}
              />
            </motion.div>
          )}

          {currentTab === 'vocabulary' && (
            <motion.div
              key="view-vocabulary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <VocabularyArenaView
                onEarnXp={handleEarnXp}
                masteredVocab={progress.masteredVocab}
                onMasterWord={handleMasterWord}
              />
            </motion.div>
          )}

          {currentTab === 'writing' && (
            <motion.div
              key="view-writing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <WritingHubView
                onEarnXp={handleEarnXp}
                onUpdateCoverage={handleUpdateCoverage}
              />
            </motion.div>
          )}

          {currentTab === 'unseen' && (
            <motion.div
              key="view-unseen"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <UnseenPassageView
                onEarnXp={handleEarnXp}
                onUpdateCoverage={handleUpdateCoverage}
              />
            </motion.div>
          )}

          {currentTab === 'mocktest' && (
            <motion.div
              key="view-mocktest"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <MockTestView
                onEarnXp={handleEarnXp}
                onRecordTestResult={handleRecordTestResult}
              />
            </motion.div>
          )}

          {currentTab === 'copilot' && (
            <motion.div
              key="view-copilot"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <CopilotView
                progress={progress}
                onEarnXp={handleEarnXp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Badges Modal */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        progress={progress}
      />

      {/* Minimal Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>National University Honours 2nd Year Non-Credit Compulsory English (Subject Code: 221109)</p>
        <p className="mt-1 font-semibold text-slate-600">EnglishCare Gamified Platform • Powered by MridhaX AI (PIEA)</p>
      </footer>
    </div>
  );
}

export default App;
