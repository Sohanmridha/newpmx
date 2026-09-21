import { Badge } from '../types/englishCare';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_first_step',
    name: 'First Step to A+',
    description: 'Completed your first grammar quiz or practice lesson.',
    icon: 'Sparkles',
    unlocked: true,
    unlockedAt: 'Day 1'
  },
  {
    id: 'badge_rfv_pro',
    name: 'Right Form of Verbs Master',
    description: 'Mastered all 23 top super-short rules with 100% quiz accuracy.',
    icon: 'Award',
    unlocked: false
  },
  {
    id: 'badge_wh_wizard',
    name: 'Wh-Question Wizard',
    description: 'Solved all WH drag-and-drop sentence builder challenges.',
    icon: 'HelpCircle',
    unlocked: false
  },
  {
    id: 'badge_vocab_titan',
    name: 'Vocabulary Arena Champion',
    description: 'Mastered 30+ Synonyms and Antonyms in flashcard swipe mode.',
    icon: 'Flame',
    unlocked: false
  },
  {
    id: 'badge_writing_architect',
    name: 'Writing & Composition Architect',
    description: 'Generated complete Notice, Poster, Application with CV, and Paragraphs.',
    icon: 'PenTool',
    unlocked: false
  },
  {
    id: 'badge_unseen_detective',
    name: 'Unseen Passage Detective',
    description: 'Extracted Main & Supporting ideas and keywords with 100% score.',
    icon: 'BookOpen',
    unlocked: false
  },
  {
    id: 'badge_100_mark_hero',
    name: '100-Mark Conqueror',
    description: 'Completed a full NU 100-Marks simulated exam session with passing score.',
    icon: 'Trophy',
    unlocked: false
  },
  {
    id: 'badge_streak_7',
    name: '7-Day Study Warrior',
    description: 'Maintained a consistent daily study habit for 7 consecutive days.',
    icon: 'Zap',
    unlocked: false
  }
];
