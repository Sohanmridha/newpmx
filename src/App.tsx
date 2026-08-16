import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceState, SessionPlan, VoiceAnalysisResult, Language } from './types/voice';
import { getCurriculumForDay } from './data/voiceCurriculum';
import { VOICE_BADGES } from './data/voiceBadges';
import { SkyEnvironment } from './components/SkyEnvironment';
import { HomeDashboard } from './components/HomeDashboard';
import { TrainingView } from './components/TrainingView';
import { VoiceStudio } from './components/VoiceStudio';
import { ProgressDashboard } from './components/ProgressDashboard';
import { ProfileSettings } from './components/ProfileSettings';
import { BottomNav, TabType } from './components/BottomNav';
import { GuidedExerciseModal } from './components/GuidedExerciseModal';
import { SleepTrackerModal } from './components/SleepTrackerModal';
import { BodyWellnessModal } from './components/BodyWellnessModal';
import { TreeInfoModal } from './components/TreeInfoModal';
import { DailyReportViewerModal } from './components/DailyReportViewerModal';
import { ScientificReadingModal } from './components/ScientificReadingModal';
import { TaskTimeBreakdown, ExerciseRecord } from './types/voice';

const STORAGE_KEY = 'ai_voice_transformation_state_v1';

const INITIAL_STATE: VoiceState = {
  userName: 'Sohan Mridha',
  language: 'bn',
  currentDay: 1,
  streak: 1,
  xp: 120,
  treeLevel: 1,
  treeHealth: 100,
  unlockedBadgeIds: ['badge_day_1'],
  scheduleTimes: {
    morning: '08:00',
    afternoon: '13:00',
    evening: '17:00',
    night: '21:00',
    sleepTime: '22:30',
    wakeTime: '06:30'
  },
  sleepTracker: {
    bedTime: '22:30',
    wakeTime: '06:30',
    durationHours: 8.0,
    consistencyScore: 90,
    voiceRecoveryScore: 92
  },
  todayLogs: {},
  dayLogsByDay: {},
  completedExercisesToday: [],
  voiceRecordings: [],
  difficultyFeedback: {},
  skyTheme: 'auto',
  audioGuidance: true,
  notificationsEnabled: true,
  safetyAgreementAccepted: true,
  aiCoachMessages: []
};

export default function App() {
  // Load persisted voice state
  const [voiceState, setVoiceState] = useState<VoiceState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse local state:', e);
    }
    return INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeSession, setActiveSession] = useState<SessionPlan | null>(null);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isBodyModalOpen, setIsBodyModalOpen] = useState(false);
  const [isTreeInfoOpen, setIsTreeInfoOpen] = useState(false);
  const [selectedReportDay, setSelectedReportDay] = useState<number | null>(null);
  const [isScientificReadingOpen, setIsScientificReadingOpen] = useState(false);

  // Sync state changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voiceState));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [voiceState]);

  // Current Day Curriculum
  const curriculum = getCurriculumForDay(voiceState.currentDay);

  // Partial State Updater
  const handleUpdateState = (partial: Partial<VoiceState>) => {
    setVoiceState((prev) => ({ ...prev, ...partial }));
  };

  // Complete a guided session
  const handleCompleteSession = (
    completedExerciseIds: string[], 
    difficultyRating: 'easy' | 'normal' | 'difficult',
    timeBreakdown?: TaskTimeBreakdown,
    exerciseRecords?: ExerciseRecord[]
  ) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const dayNum = voiceState.currentDay;
    const currentLog = voiceState.dayLogsByDay?.[dayNum] || voiceState.todayLogs[todayKey] || {
      date: todayKey,
      dayNumber: dayNum,
      completedExerciseIds: [],
      sessionsCompleted: { morning: false, afternoon: false, evening: false, night: false },
      breathCompleted: false,
      voiceCompleted: false,
      bodyCompleted: false,
      recoveryCompleted: false,
      dailyProgressPct: 0,
      xpEarned: 0,
      sleepDurationHours: voiceState.sleepTracker.durationHours,
      sleepConsistencyScore: voiceState.sleepTracker.consistencyScore,
      voiceRecoveryScore: voiceState.sleepTracker.voiceRecoveryScore,
      timeBreakdown: {
        breathSeconds: 0,
        voiceSeconds: 0,
        bodySeconds: 0,
        readingSeconds: 0,
        recoverySeconds: 0,
        totalSeconds: 0
      },
      exerciseRecords: []
    };

    const sessionId = activeSession?.id;
    const updatedSessions = {
      ...currentLog.sessionsCompleted,
      ...(sessionId ? { [sessionId]: true } : {})
    };

    const completedCount = Object.values(updatedSessions).filter(Boolean).length;
    const progressPct = Math.min(100, Math.round((completedCount / 4) * 100));

    // Calculate XP reward
    const xpGain = 50;

    // Check badge unlocks
    const newUnlockedBadges = [...(voiceState.unlockedBadgeIds || [])];
    if (voiceState.currentDay >= 3 && !newUnlockedBadges.includes('badge_day_3')) {
      newUnlockedBadges.push('badge_day_3');
    }
    if (voiceState.currentDay >= 7 && !newUnlockedBadges.includes('badge_day_7')) {
      newUnlockedBadges.push('badge_day_7');
    }
    if (voiceState.currentDay >= 14 && !newUnlockedBadges.includes('badge_day_14')) {
      newUnlockedBadges.push('badge_day_14');
    }
    if (voiceState.currentDay >= 21 && !newUnlockedBadges.includes('badge_day_21')) {
      newUnlockedBadges.push('badge_day_21');
    }
    if (voiceState.currentDay >= 30 && !newUnlockedBadges.includes('badge_day_30')) {
      newUnlockedBadges.push('badge_day_30');
    }

    // Accumulate time breakdown
    const existingBreakdown = currentLog.timeBreakdown || {
      breathSeconds: 0,
      voiceSeconds: 0,
      bodySeconds: 0,
      readingSeconds: 0,
      recoverySeconds: 0,
      totalSeconds: 0
    };

    const newBreakdown: TaskTimeBreakdown = timeBreakdown ? {
      breathSeconds: existingBreakdown.breathSeconds + timeBreakdown.breathSeconds,
      voiceSeconds: existingBreakdown.voiceSeconds + timeBreakdown.voiceSeconds,
      bodySeconds: existingBreakdown.bodySeconds + timeBreakdown.bodySeconds,
      readingSeconds: existingBreakdown.readingSeconds + timeBreakdown.readingSeconds,
      recoverySeconds: existingBreakdown.recoverySeconds + timeBreakdown.recoverySeconds,
      totalSeconds: existingBreakdown.totalSeconds + timeBreakdown.totalSeconds
    } : existingBreakdown;

    const mergedRecords = [
      ...(currentLog.exerciseRecords || []),
      ...(exerciseRecords || [])
    ];

    const updatedLog = {
      ...currentLog,
      completedExerciseIds: Array.from(new Set([...currentLog.completedExerciseIds, ...completedExerciseIds])),
      sessionsCompleted: updatedSessions,
      dailyProgressPct: progressPct,
      xpEarned: currentLog.xpEarned + xpGain,
      difficultyRating,
      timeBreakdown: newBreakdown,
      exerciseRecords: mergedRecords
    };

    setVoiceState((prev) => ({
      ...prev,
      xp: prev.xp + xpGain,
      completedExercisesToday: Array.from(new Set([...prev.completedExercisesToday, ...completedExerciseIds])),
      unlockedBadgeIds: newUnlockedBadges,
      todayLogs: {
        ...prev.todayLogs,
        [todayKey]: updatedLog
      },
      dayLogsByDay: {
        ...(prev.dayLogsByDay || {}),
        [dayNum]: updatedLog
      },
      difficultyFeedback: {
        ...prev.difficultyFeedback,
        [prev.currentDay]: difficultyRating
      }
    }));
  };

  // Save Scientific Reading drill completion
  const handleSaveReadingLog = (result: VoiceAnalysisResult, secondsSpent: number, passage: any) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const dayNum = voiceState.currentDay;
    const currentLog = voiceState.dayLogsByDay?.[dayNum] || voiceState.todayLogs[todayKey] || {
      date: todayKey,
      dayNumber: dayNum,
      completedExerciseIds: [],
      sessionsCompleted: { morning: false, afternoon: false, evening: false, night: false },
      breathCompleted: false,
      voiceCompleted: false,
      bodyCompleted: false,
      recoveryCompleted: false,
      dailyProgressPct: 0,
      xpEarned: 0,
      sleepDurationHours: 8,
      sleepConsistencyScore: 90,
      voiceRecoveryScore: 90,
      timeBreakdown: {
        breathSeconds: 0,
        voiceSeconds: 0,
        bodySeconds: 0,
        readingSeconds: 0,
        recoverySeconds: 0,
        totalSeconds: 0
      },
      exerciseRecords: []
    };

    const prevBreakdown = currentLog.timeBreakdown || {
      breathSeconds: 0,
      voiceSeconds: 0,
      bodySeconds: 0,
      readingSeconds: 0,
      recoverySeconds: 0,
      totalSeconds: 0
    };

    const newBreakdown: TaskTimeBreakdown = {
      ...prevBreakdown,
      readingSeconds: prevBreakdown.readingSeconds + secondsSpent,
      totalSeconds: prevBreakdown.totalSeconds + secondsSpent
    };

    const readingRecord: ExerciseRecord = {
      id: passage?.id || 'scientific_reading_drill',
      nameBn: passage?.titleBn || 'বৈজ্ঞানিক রিডিং ও রেজোন্যান্স ড্রিল',
      nameEn: passage?.titleEn || 'Scientific Vocal Reading Drill',
      category: 'reading',
      secondsSpent,
      completedAt: new Date().toISOString()
    };

    const wordsCount = (passage?.textBn || passage?.textEn || '').trim().split(/\s+/).filter(Boolean).length || 45;

    const updatedLog = {
      ...currentLog,
      voiceScore: Math.max(currentLog.voiceScore || 0, result.voiceScore),
      timeBreakdown: newBreakdown,
      exerciseRecords: [...(currentLog.exerciseRecords || []), readingRecord],
      xpEarned: currentLog.xpEarned + 40
    };

    setVoiceState((prev) => ({
      ...prev,
      xp: prev.xp + 40,
      lifetimeWordsPracticed: (prev.lifetimeWordsPracticed || 0) + wordsCount,
      totalReadingSecondsPracticed: (prev.totalReadingSecondsPracticed || 0) + secondsSpent,
      voiceRecordings: [result, ...prev.voiceRecordings],
      todayLogs: {
        ...prev.todayLogs,
        [todayKey]: updatedLog
      },
      dayLogsByDay: {
        ...(prev.dayLogsByDay || {}),
        [dayNum]: updatedLog
      }
    }));
  };

  // Save Voice Analysis Result
  const handleSaveVoiceAnalysis = (result: VoiceAnalysisResult) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const currentLog = voiceState.todayLogs[todayKey];

    const newUnlocked = [...voiceState.unlockedBadgeIds];
    if (result.voiceScore >= 85 && !newUnlocked.includes('badge_rj_star')) {
      newUnlocked.push('badge_rj_star');
    }

    setVoiceState((prev) => ({
      ...prev,
      xp: prev.xp + 40,
      unlockedBadgeIds: newUnlocked,
      voiceRecordings: [result, ...prev.voiceRecordings],
      todayLogs: {
        ...prev.todayLogs,
        [todayKey]: {
          ...(currentLog || {
            date: todayKey,
            dayNumber: prev.currentDay,
            completedExerciseIds: [],
            sessionsCompleted: { morning: false, afternoon: false, evening: false, night: false },
            breathCompleted: false,
            voiceCompleted: false,
            bodyCompleted: false,
            recoveryCompleted: false,
            dailyProgressPct: 25,
            xpEarned: 0,
            sleepDurationHours: 8,
            sleepConsistencyScore: 90,
            voiceRecoveryScore: 90
          }),
          voiceScore: result.voiceScore
        }
      }
    }));
  };

  // Save Sleep Tracker Data
  const handleSaveSleep = (bedTime: string, wakeTime: string, duration: number, recoveryScore: number) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const currentLog = voiceState.todayLogs[todayKey];

    setVoiceState((prev) => ({
      ...prev,
      sleepTracker: {
        bedTime,
        wakeTime,
        durationHours: duration,
        consistencyScore: 92,
        voiceRecoveryScore: recoveryScore
      },
      todayLogs: {
        ...prev.todayLogs,
        [todayKey]: {
          ...(currentLog || {
            date: todayKey,
            dayNumber: prev.currentDay,
            completedExerciseIds: [],
            sessionsCompleted: { morning: false, afternoon: false, evening: false, night: false },
            breathCompleted: false,
            voiceCompleted: false,
            bodyCompleted: false,
            recoveryCompleted: false,
            dailyProgressPct: 0,
            xpEarned: 0,
            sleepDurationHours: duration,
            sleepConsistencyScore: 92,
            voiceRecoveryScore: recoveryScore
          }),
          sleepDurationHours: duration,
          voiceRecoveryScore: recoveryScore
        }
      }
    }));
  };

  return (
    <SkyEnvironment themeMode={voiceState.skyTheme}>
      <main className="min-h-screen max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 pt-4 pb-28">
        {/* TAB VIEWS */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HomeDashboard
                voiceState={voiceState}
                curriculum={curriculum}
                language={voiceState.language}
                onOpenSession={(session) => setActiveSession(session)}
                onOpenSleepTracker={() => setIsSleepModalOpen(true)}
                onOpenBodyWellness={() => setIsBodyModalOpen(true)}
                onOpenVoiceStudio={() => setActiveTab('studio')}
                onOpenTreeInfo={() => setIsTreeInfoOpen(true)}
                onOpenDailyReport={(day) => setSelectedReportDay(day)}
                onOpenScientificReading={() => setIsScientificReadingOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TrainingView
                currentDay={voiceState.currentDay}
                voiceState={voiceState}
                language={voiceState.language}
                onSelectDay={(day) => handleUpdateState({ currentDay: day })}
                onOpenSession={(session) => setActiveSession(session)}
                onOpenDailyReport={(day) => setSelectedReportDay(day)}
                onOpenScientificReading={() => setIsScientificReadingOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'studio' && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <VoiceStudio
                currentDay={voiceState.currentDay}
                language={voiceState.language}
                savedRecordings={voiceState.voiceRecordings}
                onSaveAnalysis={handleSaveVoiceAnalysis}
              />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProgressDashboard
                voiceState={voiceState}
                language={voiceState.language}
                onOpenDailyReport={(day) => setSelectedReportDay(day)}
                onOpenScientificReading={() => setIsScientificReadingOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileSettings
                voiceState={voiceState}
                onUpdateState={handleUpdateState}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL 1: Interactive Guided Session Player */}
        <AnimatePresence>
          {activeSession && (
            <GuidedExerciseModal
              session={activeSession}
              language={voiceState.language}
              onClose={() => setActiveSession(null)}
              onCompleteSession={handleCompleteSession}
            />
          )}
        </AnimatePresence>

        {/* MODAL 2: Sleep Tracker & Vocal Rest */}
        <AnimatePresence>
          {isSleepModalOpen && (
            <SleepTrackerModal
              language={voiceState.language}
              bedTime={voiceState.sleepTracker?.bedTime || '22:30'}
              wakeTime={voiceState.sleepTracker?.wakeTime || '06:30'}
              onSave={handleSaveSleep}
              onClose={() => setIsSleepModalOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* MODAL 3: Body & Posture Wellness */}
        <AnimatePresence>
          {isBodyModalOpen && (
            <BodyWellnessModal
              language={voiceState.language}
              onClose={() => setIsBodyModalOpen(false)}
              onComplete={() => handleUpdateState({ xp: voiceState.xp + 30 })}
            />
          )}
        </AnimatePresence>

        {/* MODAL 4: Tree Info & Stages Guide */}
        <AnimatePresence>
          {isTreeInfoOpen && (
            <TreeInfoModal
              currentDay={voiceState.currentDay}
              treeLevel={curriculum.treeStage}
              language={voiceState.language}
              onClose={() => setIsTreeInfoOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* MODAL 5: Scientific Reading Lab & Daily Drills */}
        <AnimatePresence>
          {isScientificReadingOpen && (
            <ScientificReadingModal
              language={voiceState.language}
              currentDay={voiceState.currentDay}
              todayReadingSeconds={
                (voiceState.dayLogsByDay?.[voiceState.currentDay] ||
                  voiceState.todayLogs[new Date().toISOString().split('T')[0]])?.timeBreakdown?.readingSeconds || 0
              }
              lifetimeWordsPracticed={voiceState.lifetimeWordsPracticed || 0}
              totalReadingSecondsPracticed={voiceState.totalReadingSecondsPracticed || 0}
              onClose={() => setIsScientificReadingOpen(false)}
              onSaveReadingLog={handleSaveReadingLog}
            />
          )}
        </AnimatePresence>

        {/* MODAL 6: Granular Daily Practice & Voice Growth Report */}
        <AnimatePresence>
          {selectedReportDay !== null && (
            <DailyReportViewerModal
              initialDay={selectedReportDay}
              voiceState={voiceState}
              language={voiceState.language}
              onClose={() => setSelectedReportDay(null)}
              onSelectDayToTrain={(d) => {
                setSelectedReportDay(null);
                handleUpdateState({ currentDay: d });
                setActiveTab('training');
              }}
            />
          )}
        </AnimatePresence>

        {/* Mobile-First Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          language={voiceState.language}
          onSelectTab={(tab) => setActiveTab(tab)}
        />
      </main>
    </SkyEnvironment>
  );
}
