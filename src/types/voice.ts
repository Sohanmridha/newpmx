export type Language = 'bn' | 'en';

export type SessionType = 'morning' | 'afternoon' | 'evening' | 'night';

export type ExerciseCategory = 
  | 'breath' 
  | 'relaxation' 
  | 'humming' 
  | 'lip_trill' 
  | 'resonance' 
  | 'articulation' 
  | 'reading' 
  | 'rj_delivery' 
  | 'pitch' 
  | 'body' 
  | 'sleep';

export interface ExerciseStep {
  id: string;
  nameBn: string;
  nameEn: string;
  category: ExerciseCategory;
  durationSec: number; // in seconds
  instructionBn: string;
  instructionEn: string;
  subInstructionBn?: string;
  subInstructionEn?: string;
  audioToneFrequency?: number; // e.g. 130 Hz for gentle humming
  rhythmBpm?: number; // for articulation metronome
  scriptTextBn?: string;
  scriptTextEn?: string;
  breathingPattern?: {
    inhaleSec: number;
    holdSec: number;
    exhaleSec: number;
    pauseSec?: number;
  };
  animationType: 'breathing' | 'neck_stretch' | 'jaw_relax' | 'humming' | 'lip_trill' | 'resonance' | 'articulation' | 'rj_reading' | 'pitch_glide' | 'body_posture' | 'sleep_prep';
}

export interface SessionPlan {
  id: SessionType;
  titleBn: string;
  titleEn: string;
  timeDefault: string; // e.g. "08:00 AM"
  time24: string; // "08:00"
  durationMinutes: number;
  descriptionBn: string;
  descriptionEn: string;
  icon: string;
  exercises: ExerciseStep[];
}

export interface DayCurriculum {
  dayNumber: number;
  stageNameBn: string;
  stageNameEn: string;
  themeBn: string;
  themeEn: string;
  focusPointBn: string;
  focusPointEn: string;
  treeStage: 1 | 2 | 3 | 4 | 5 | 6; // 1: Seed, 2: Sprout, 3: Young Tree, 4: Growing Tree, 5: Strong Tree, 6: Full Tree
  sessions: {
    morning: SessionPlan;
    afternoon: SessionPlan;
    evening: SessionPlan;
    night: SessionPlan;
  };
}

export interface VoiceAnalysisResult {
  id: string;
  date: string;
  dayNumber: number;
  voiceScore: number;
  clarity: number;
  pacing: number;
  pronunciation: number;
  pauseControl: number;
  resonanceStability: number;
  wpm: number;
  feedback: string;
  strengths: string[];
  improvementArea: string;
  audioBlobUrl?: string;
  transcript?: string;
  targetScript?: string;
  drillCategory?: string;
  durationSeconds?: number;
}

export interface TaskTimeBreakdown {
  breathSeconds: number;
  voiceSeconds: number;
  bodySeconds: number;
  readingSeconds: number;
  recoverySeconds: number;
  totalSeconds: number;
}

export interface ExerciseRecord {
  id: string;
  nameBn: string;
  nameEn: string;
  category: ExerciseCategory;
  secondsSpent: number;
  completedAt: string;
}

export interface VoiceImprovementMetrics {
  overallScore: number;
  clarity: number; // 0-100
  resonanceDepth: number; // 0-100
  pacingWpm: number; // e.g. 125
  pauseDiscipline: number; // 0-100
  throatRelaxation: number; // 0-100 (inverse of strain)
  breathSupport: number; // 0-100
}

export interface ScientificReadingPassage {
  id: string;
  category: 'mask_resonance' | 'chest_depth' | 'articulation' | 'breath_pacing' | 'emotional_rj' | 'classic_eloquence';
  categoryTitleBn: string;
  categoryTitleEn: string;
  titleBn: string;
  titleEn: string;
  scientificBenefitBn: string;
  scientificBenefitEn: string;
  targetWpm: number;
  recommendedPitchTone?: number; // e.g. 130Hz
  keyPhonemes: string[]; // e.g. ['ম্ম', 'ন্ন', 'ং', 'মমতা']
  textBn: string;
  textEn: string;
  cuedTextBn: string; // text with [🫁 শ্বাস] and [⏸️ ২ সে. পজ]
  cuedTextEn: string;
  analysisGuideBn: string;
  analysisGuideEn: string;
}

export interface DailyVoiceLog {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  completedExerciseIds: string[];
  exerciseRecords?: ExerciseRecord[];
  timeBreakdown?: TaskTimeBreakdown;
  sessionsCompleted: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  breathCompleted: boolean;
  voiceCompleted: boolean;
  bodyCompleted: boolean;
  recoveryCompleted: boolean;
  dailyProgressPct: number;
  xpEarned: number;
  sleepDurationHours: number;
  sleepConsistencyScore: number;
  voiceRecoveryScore: number;
  voiceScore?: number;
  voiceMetrics?: VoiceImprovementMetrics;
  aiCoachingNote?: string;
  difficultyRating?: 'easy' | 'normal' | 'difficult';
}

export interface BadgeItem {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  icon: string;
  unlockedAt: string | null;
  dayRequired?: number;
  category: 'streak' | 'mastery' | 'breath' | 'rj' | 'recovery';
}

export interface VoiceState {
  userName: string;
  language: Language;
  currentDay: number; // 1 to 30
  streak: number;
  xp: number;
  treeLevel: 1 | 2 | 3 | 4 | 5 | 6;
  treeHealth: number; // 0 to 100
  unlockedBadgeIds: string[];
  scheduleTimes: {
    morning: string; // "08:00"
    afternoon: string; // "13:00"
    evening: string; // "17:00"
    night: string; // "21:00"
    sleepTime: string; // "22:30"
    wakeTime: string; // "06:30"
  };
  sleepTracker: {
    bedTime: string;
    wakeTime: string;
    durationHours: number;
    consistencyScore: number;
    voiceRecoveryScore: number;
  };
  todayLogs: Record<string, DailyVoiceLog>; // key is YYYY-MM-DD
  dayLogsByDay: Record<number, DailyVoiceLog>; // key is 1 to 30 (for guaranteed per-day reporting)
  completedExercisesToday: string[];
  voiceRecordings: VoiceAnalysisResult[];
  baselineVoiceScore?: VoiceAnalysisResult;
  difficultyFeedback: Record<number, 'easy' | 'normal' | 'difficult'>;
  skyTheme: 'auto' | 'morning' | 'afternoon' | 'evening' | 'night';
  audioGuidance: boolean;
  notificationsEnabled: boolean;
  safetyAgreementAccepted: boolean;
  aiCoachMessages: { id: string; sender: 'ai' | 'user'; text: string; timestamp: string }[];
  totalCumulativeMinutesPracticed?: number;
  lifetimeWordsPracticed?: number;
  totalReadingSecondsPracticed?: number;
}
