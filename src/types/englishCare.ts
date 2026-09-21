export type TargetGoal = 'pass_target' | 'aplus_target';

export type MainTab = 
  | 'dashboard'
  | 'grammar'
  | 'vocabulary'
  | 'writing'
  | 'unseen'
  | 'mocktest'
  | 'copilot';

export type GrammarCategory = 
  | 'right_form_of_verbs'
  | 'wh_questions'
  | 'sentence_correction'
  | 'articles'
  | 'punctuation'
  | 'rearrange'
  | 'changing_words'
  | 'translation';

export interface GrammarQuizQuestion {
  id: string;
  question: string;
  bracketVerb?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  nuTag?: string;
}

export interface GrammarRuleItem {
  id: string;
  ruleNumber: number;
  category: GrammarCategory;
  title: string;
  shortcutFormula: string;
  noteBn: string;
  warningBn?: string;
  examples: Array<{
    sentence: string;
    answer: string;
    nuExamTag?: string;
  }>;
  practiceQuestions: GrammarQuizQuestion[];
}

export interface RearrangeItem {
  id: string;
  number: number;
  scrambled: string;
  tokens: string[];
  correctSentence: string;
}

export interface ChangingWordItem {
  id: string;
  givenWord: string;
  targetPos: 'noun' | 'verb' | 'adj' | 'adv';
  changedWord: string;
  sentence: string;
  stars?: number;
}

export interface TranslationItem {
  id: string;
  nuYear: string;
  banglaText: string;
  englishTranslation: string;
  keyVocabulary?: Array<{ bn: string; en: string }>;
}

export interface ArticlePassageItem {
  id: string;
  number: number;
  title: string;
  textWithBlanks: string;
  answers: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  explanation?: string;
}

export interface PunctuationItem {
  id: string;
  number: number;
  examTag: string;
  rawText: string;
  punctuatedText: string;
  rulesApplied: string[];
}

export interface VocabWord {
  id: string;
  word: string;
  banglaMeaning: string;
  type: 'synonym' | 'antonym';
  targetWord: string; // e.g. accept -> receive (synonym) or accept -> deny (antonym)
  secondaryOptions?: string[];
  exampleSentence: string;
  boardTag?: string;
  stars?: number;
}

export interface PosterTemplate {
  id: string;
  title: string;
  category: 'social_problem' | 'disease' | 'importance' | 'helpless' | 'road_safety' | 'exam_copying';
  box1_top_left: string;
  box2_top_right: string;
  box3_headline: string;
  box4_bullets: string[];
  box5_call_to_action: string;
  box6_circulated_by: string;
  applicableTopics: string[];
}

export interface NoticeTemplate {
  id: string;
  title: string;
  category: 'closure' | 'ceremonial' | 'academic' | 'general';
  collegeName: string;
  department: string;
  noticeNumber: string;
  date: string;
  subjectOrHeadline: string;
  bodyText: string;
  signatory: {
    name: string;
    designation: string;
    institution: string;
    location: string;
  };
  applicableTopics: string[];
}

export interface ParagraphItem {
  id: string;
  title: string;
  category: 'board_common' | 'universal_shortcut';
  boardExamTags?: string;
  englishText: string;
  banglaTranslation: string;
  vocabulary: Array<{ en: string; bn: string; pronunciation?: string }>;
  topicSentence?: string;
}

export interface ApplicationItem {
  id: string;
  title: string;
  type: 'job_application_cv' | 'college_request' | 'universal';
  subject: string;
  coverLetter?: string;
  cvData?: {
    name: string;
    fatherName: string;
    motherName: string;
    dob: string;
    address: string;
    phone: string;
    education: Array<{ exam: string; year: string; result: string; subject: string; board: string }>;
    experience: string;
  };
  bodyText?: string;
}

export interface LetterItem {
  id: string;
  title: string;
  salutation: string;
  body: string;
  applicableTopics: string[];
  universalNote?: string;
}

export interface AdvertisementItem {
  id: string;
  title: string;
  category: 'sale' | 'wanted' | 'notice';
  headline: string;
  features: string[];
  contactInfo: string;
}

export interface UnseenPassageData {
  id: string;
  passageNumber: number;
  title: string;
  passageEnglish: string;
  passageBangla: string;
  vocabularyList: Array<{ word: string; meaningEn: string; sentence: string }>;
  questions: {
    partA: Array<{ question: string; answer: string; marks: number }>;
    partB: {
      mainIdea: string;
      supportingIdeas: string[];
    };
    partC: Array<{ word: string; meaning: string; sentence: string }>;
    partD: {
      question: string;
      answer: string;
    };
    partE: {
      summary: string;
    };
  };
}

export interface ModelTestQuestion {
  id: string;
  marks: number;
  section: 'A' | 'B' | 'C'; // A: Unseen (20m), B: Grammar (45m), C: Writing (35m)
  title: string;
  instruction: string;
  content: string;
  solution: string;
  explanationBn: string;
}

export interface ModelTestFull {
  id: string;
  testNumber: number;
  code: string; // 221109
  title: string;
  totalTimeMinutes: number; // 180 min
  totalMarks: number; // 100 marks
  passMarks: number; // 40 marks
  questions: ModelTestQuestion[];
}

export interface UserProgressState {
  studentName: string;
  targetGoal: TargetGoal; // 'pass_target' | 'aplus_target'
  dailyStreak: number;
  lastActiveDate: string;
  totalXp: number;
  level: number;
  todayStudyMinutes: number;
  dailyTargetMinutes: number;
  syllabusCoveragePercent: number;
  completedRules: string[];
  masteredVocab: string[];
  learningVocab: string[];
  completedQuizzes: Record<string, number>; // quizId -> score
  modelTestResults: Array<{
    testId: string;
    testNumber: number;
    score: number;
    totalMarks: number;
    date: string;
    timeTakenSeconds: number;
  }>;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
