export type TimeOfDay = 'Morning' | 'Night' | 'Anytime' | 'সকাল' | 'রাত' | 'যেকোনো সময়';

export interface SubjectItem {
  id: string;
  name: string;
  target: number; // in minutes
  chapters?: Chapter[];
}

export interface HabitItem {
  id: string;
  name: string;
  time: string; // e.g., 'Morning' / 'সকাল', 'Night' / 'রাত', 'Anytime' / 'যেকোনো সময়'
}

export interface FitnessItem {
  id: string;
  name: string;
  goal: string; // target amount (e.g., "30 min", "20 Reps")
}

export interface RoutineDayData {
  lunch: string; // Who's cooking lunch
  dinner: string; // Who's cooking dinner
  clean: string; // Who's cleaning the room
  customTasks?: string[]; // Multiple custom routine items
}

export interface ReflectionNote {
  id: string;
  date: string;
  text: string;
  subject?: string;
  focusedRating: number; // 1-5 stars
  mood: string; // e.g. Happy, Focused, Tired
}

export interface DailyLog {
  study: Record<string, number>; // Record of subject ID or name -> total accumulated seconds
  prayer: Record<string, 'জামাত' | 'ঘরে' | 'কাজা' | 'পড়িনি' | 'jamaat' | 'home' | 'qaza' | 'skipped'>;
  habits: Record<string, boolean>; // Habit ID -> isCompleted Today
  fitness: Record<string, number>; // Fitness ID -> completed reps or minutes today
}

export interface BadHabitItem {
  id: string;
  name: string;
  quitAt: string; // ISO String of when they quit
}

export interface StudyRoutineItem {
  id: string;
  subject: string;
  timeSlot: string;
  topic?: string;
  completed?: boolean;
}

export interface UserProfile {
  name: string;
  age: string;
  grade: string;
  favSubjects: string;
  interests: string;
  isSocialPublic?: boolean;
  isPrayerPublic?: boolean;
  points?: number;
  prayerStreak?: number;
  maintenanceScore?: number;
}

export interface Chapter {
  id: string;
  name: string;
  isCompleted: boolean;
  hoursSpent?: number;
}

export interface ExamSubject {
  id: string;
  name: string;
  chapters: Chapter[];
  examDate?: string; // New: date of exam for this specific subject
}

export interface ExamPrepInfo {
  id?: string; // Unique ID for multiple exams
  examName: string;
  targetDate: string; // Overall target
  subjects: ExamSubject[];
  badges: string[]; // New: earned rewards/badges
  category?: 'Final' | 'Midterm' | 'Mock'; // New: exam category
}

export interface MessTransaction {
  id: string;
  date: string;
  type: 'cooking' | 'room_rent' | 'others';
  amount: number;
  paidBy: string;
  description: string;
}

export interface MessDebt {
  id: string;
  fromPerson: string;
  toPerson: string;
  amount: number;
  reason: string;
  date?: string;
}

export interface AppState {
  aiTheme?: 'midnight' | 'emerald' | 'sunset';
  theme: 'default' | 'luxury' | 'cyberpunk' | 'minimalist';
  layoutMode: 'classic' | 'clean';
  language: 'bn' | 'en';
  userProfile?: UserProfile;
  subjects: SubjectItem[];
  habits: HabitItem[];
  fitness: FitnessItem[];
  routine: Record<number, RoutineDayData>; // 0 to 6 (Sat to Fri)
  prayerTimes: Record<string, string>; // Fajr, Dhuhr, etc. -> e.g. "05:00"
  history: Record<string, DailyLog>; // YYYY-MM-DD -> DailyLog
  reflections: ReflectionNote[];
  showOnboarding: boolean;
  onboardingStep: number;
  badHabits?: BadHabitItem[];
  noteScratchpad?: string;
  activeTreeType?: 'sakura' | 'olive' | 'rosemary' | 'cactus';
  phoneLimitMinutes?: number;
  phoneUsageHistory?: Record<string, number>; // dateStr -> minutes
  customStudyRoutines?: Record<number, StudyRoutineItem[]>; // 0 to 6 (Sat to Fri)
  focusPoints?: number;
  focusLevel?: number;
  unlockedTrees?: string[];
  headerRoutineMode?: 'cooking' | 'study';
  headerDisplayMode?: 'cooking' | 'study' | 'exam' | 'hidden';
  uiMode?: 'standard' | 'cinematic';
  examPrep?: ExamPrepInfo;
  examPreps?: ExamPrepInfo[];
  activeExamId?: string;
  unlockedAchievements?: string[];
  notificationConsentAsked?: boolean;
  notificationSettings?: {
    friendship: boolean;
    emotional: boolean;
    reminder: boolean;
    morningTime: string;
    eveningTime: string;
  };
  // Premium Digital Wellbeing & Blocker Suite
  digitalUnlockCount?: Record<string, number>; // dateStr -> unlock count
  appUsageDurations?: Record<string, Record<string, number>>; // dateStr -> { appName -> minutes }
  reelsBlockerActive?: boolean;
  reelsBlockerDuration?: number; // duration in minutes, -1 for infinite/unlimited
  reelsBlockerStartedAt?: string | null; // ISO Date string of when blocker started
  reelsBlockedApps?: string[]; // e.g. ['facebook', 'youtube', 'instagram', 'tiktok']
  adultSiteBlockerActive?: boolean;
  dndModeActive?: boolean;
  dndStartTime?: string; // e.g. "22:00"
  dndEndTime?: string; // e.g. "06:00"
  brainFatigueRatings?: Record<string, number>; // dateStr -> fatigue score (1 to 5)
  digitalDetoxStreak?: number; // current streak in days
  careerGoal?: string;
  // Deep Focus Mode
  focusModeActive?: boolean;
  focusTimerSeconds?: number;
  focusSubjectId?: string;
  focusChapterName?: string;
  focusTreeStyle?: string;
  focusSoundscape?: string;
  customAiDirectives?: string;
  aiTrainingData?: {
    lastTrainedAt?: string;
    trainingCount: number;
    brainScore: number;
    learnedPatterns: string[];
  };
  prayerNotifications?: Record<string, { enabled: boolean; triggerOffset: number }>;
  prayerLocation?: { lat: number; lng: number; name: string; isCustom: boolean };
  weeklyTransformationTargets?: WeeklyTransformationTarget[];
  personalDailyRoutines?: Record<number, PersonalRoutineItem[]>;
  monthlyIncomeSource?: string;
  monthlyIncomeAmount?: number;
  cashFromHome?: number;
  financeTransactions?: FinanceTransaction[];
  debts?: DebtItem[];
  budgetWarningLimit?: number;
  lunchCookStartTime?: string;
  lunchCookEndTime?: string;
  dinnerCookStartTime?: string;
  dinnerCookEndTime?: string;
  messTransactions?: MessTransaction[];
  messDebts?: MessDebt[];
  messAccessCode?: string | null;
  messMeals?: MessMeal[];
  messMembers?: string[];
}

export interface MessMeal {
  id: string;
  memberName: string;
  date: string;
  lunchCount: number;
  dinnerCount: number;
}

export interface WeeklyTransformationTarget {
  id: string;
  target: string;
  completed: boolean;
}

export interface PersonalRoutineItem {
  id: string;
  taskName: string;
  timeSlot: string;
  durationHours: number;
  completed: boolean;
}

export interface FinanceTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string; // ISO format or YYYY-MM-DD
}

export interface DebtItem {
  id: string;
  type: 'borrowed' | 'lent'; // 'borrowed' = I took money, 'lent' = I gave money
  personName: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: 'pending' | 'paid';
  paidAmount: number; // For future-proof partial/full logging
  description?: string;
}


