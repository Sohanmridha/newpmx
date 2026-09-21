import { GrammarRuleItem } from '../types/englishCare';

export interface CorrectionItem {
  id: string;
  incorrectSentence: string;
  correctSentence: string;
  alternativeCorrect?: string;
  ruleExplanationBn: string;
  categoryTag: string;
}

export const SENTENCE_CORRECTION_RULES: GrammarRuleItem[] = [
  {
    id: 'sc_01',
    ruleNumber: 1,
    category: 'sentence_correction',
    title: 'Insist on / Prefer to / Inform of / Avail oneself of',
    shortcutFormula: 'insist + on + possessive + V-ing | prefer ... to ... | inform + ব্যক্তি + of + বিষয় | avail + self-pronoun + of',
    noteBn: 'এই চারটি ভার্ব জাতীয় বিশ্ববিদ্যালয়ের পরীক্ষায় সবচেয়ে বেশি আসে। বিশেষ করে insist-এর পর on ও ing, prefer-এর পর than না বসে to, এবং avail-এর পর reflex pronoun বসে।',
    examples: [
      { sentence: 'He insisted me to go there.', answer: 'He insisted on my going there.' },
      { sentence: 'I prefer to read than write.', answer: 'I prefer reading to writing.' },
      { sentence: 'Please inform this matter to the Principal.', answer: 'Please inform the Principal of this matter.' },
      { sentence: 'He avails the chance.', answer: 'He avails himself of the chance.' },
      { sentence: 'He absented from the college yesterday.', answer: 'He absented himself from the college yesterday.' }
    ],
    practiceQuestions: [
      {
        id: 'sc_q1_1',
        question: 'My father insisted me to study Honours Course.',
        correctAnswer: 'My father insisted on my studying Honours Course.',
        explanation: 'insist + on + my + V-ing হয়।'
      },
      {
        id: 'sc_q1_2',
        question: 'I prefer tea than coffee.',
        correctAnswer: 'I prefer tea to coffee.',
        explanation: 'prefer-এর পর তুলনার ক্ষেত্রে than না বসে to বসে।'
      }
    ]
  },
  {
    id: 'sc_02',
    ruleNumber: 2,
    category: 'sentence_correction',
    title: 'Embedded Questions (বাক্যের মাঝখানে WH)',
    shortcutFormula: 'Sentence-এর মাঝখানে WH থাকলে ➜ WH + Subject + Verb (Auxiliary আগে আসে না)',
    noteBn: 'বাক্যের মাঝখানে WH বসলে তা conjunction এর মতো কাজ করে। তাই Do/Does/Did থাকলে তা উঠে যায় এবং সাধারণ assertive গঠন হয়।',
    examples: [
      { sentence: 'Do you know who am I?', answer: 'Do you know who I am?' },
      { sentence: 'Do you know when do they come?', answer: 'Do you know when they come?' },
      { sentence: 'Tell me what is your name.', answer: 'Tell me what your name is.' },
      { sentence: 'Do you know how did he pass in the exam?', answer: 'Do you know how he passed in the exam?' }
    ],
    practiceQuestions: [
      {
        id: 'sc_q2_1',
        question: 'Do you know where does he live?',
        correctAnswer: 'Do you know where he lives?',
        explanation: 'does বাদ যাবে এবং live এর সাথে s যুক্ত হয়ে lives হবে।'
      }
    ]
  },
  {
    id: 'sc_03',
    ruleNumber: 3,
    category: 'sentence_correction',
    title: 'Unless / Until এ Double Negative বর্জন',
    shortcutFormula: 'Unless / Until ক্লজে ➜ do not / does not / did not বাদ যায়',
    noteBn: 'Unless বা Until এর ভেতরেই "যদি না / যতক্ষণ না" না-বোধক অর্থ থাকায় উক্ত অংশে আর কোনো not ব্যবহার করা যাবে না।',
    examples: [
      { sentence: 'Unless you do not study, you will fail.', answer: 'Unless you study, you will fail.' },
      { sentence: 'Do not come unless you are not called.', answer: 'Do not come unless you are called.' },
      { sentence: 'Wait here until I do not return.', answer: 'Wait here until I return.' }
    ],
    practiceQuestions: [
      {
        id: 'sc_q3_1',
        question: 'Unless you do not work hard, you cannot shine.',
        correctAnswer: 'Unless you work hard, you cannot shine.',
        explanation: 'do not বাদ দিয়ে affirmative বাক্য করতে হবে।'
      }
    ]
  },
  {
    id: 'sc_04',
    ruleNumber: 4,
    category: 'sentence_correction',
    title: 'তুলনার ক্ষেত্রে Than that of / Than those of',
    shortcutFormula: 'Singular হলে ➜ than that of | Plural হলে ➜ than those of',
    noteBn: 'দুই অঞ্চলের জিনিসের মধ্যে তুলনা করলে সরাসরি জেলার নাম বসে না। চাল, জলবায়ু, আম ইত্যাদির সাথে that of বা those of যোগ করতে হয়।',
    examples: [
      { sentence: 'The rice of Dinajpur is better than Rajshahi.', answer: 'The rice of Dinajpur is better than that of Rajshahi.' },
      { sentence: 'The mangoes of Rajshahi are better than Jashore.', answer: 'The mangoes of Rajshahi are better than those of Jashore.' },
      { sentence: 'The streets of Dhaka are wider than Sylhet.', answer: 'The streets of Dhaka are wider than those of Sylhet.' }
    ],
    practiceQuestions: [
      {
        id: 'sc_q4_1',
        question: 'The climate of Cox\'s Bazar is better than Dhaka.',
        correctAnswer: 'The climate of Cox\'s Bazar is better than that of Dhaka.',
        explanation: 'climate singular, তাই than that of Dhaka হবে।'
      }
    ]
  },
  {
    id: 'sc_05',
    ruleNumber: 5,
    category: 'sentence_correction',
    title: 'সচরাচর ভুল হওয়া জোড়া শব্দ (Word Pairs in Correction)',
    shortcutFormula: 'Weather ➜ Climate | Notorious ➜ Famous (বা বিপরীত) | Cut line ➜ Pen through | See pulse ➜ Feel pulse',
    noteBn: 'ইংরেজি ভাষায় বিশেষ পরিস্থিতিতে বিশেষ শব্দ ব্যবহৃত হয়। যেমন: লাইনে দাগ টানা = pen through the line, নাড়ি দেখা = feel pulse, খারাপ কাজের জন্য বিখ্যাত = notorious, ইত্যাদি।',
    examples: [
      { sentence: 'The weather of Cox\'s Bazar is healthy.', answer: 'The climate of Cox\'s Bazar is healthy.' },
      { sentence: 'The doctor saw my pulse.', answer: 'The doctor felt my pulse.' },
      { sentence: 'Cut the line.', answer: 'Pen through the line.' },
      { sentence: 'Columbus invented America.', answer: 'Columbus discovered America.' },
      { sentence: 'He did a crime.', answer: 'He committed a crime.' },
      { sentence: 'The man was hung for murder.', answer: 'The man was hanged for murder.' },
      { sentence: 'He gave me good bye.', answer: 'He bade me good bye.' },
      { sentence: 'He will give the examination.', answer: 'He will sit for / take the examination.' }
    ],
    practiceQuestions: [
      {
        id: 'sc_q5_1',
        question: 'He gave false witness.',
        correctAnswer: 'He gave false evidence.',
        explanation: 'সাক্ষ্যের বক্তব্যের ক্ষেত্রে evidence বসে, witness নয়।'
      }
    ]
  }
];

export const TOP_CORRECTION_DRILLS: CorrectionItem[] = [
  {
    id: 'corr_1',
    incorrectSentence: 'He insisted me to go there.',
    correctSentence: 'He insisted on my going there.',
    ruleExplanationBn: 'insist এর পর on + my + Verb+ing বসে।',
    categoryTag: 'Preposition + Gerund'
  },
  {
    id: 'corr_2',
    incorrectSentence: 'Do you know where does he live?',
    correctSentence: 'Do you know where he lives?',
    ruleExplanationBn: 'Embedded question এ WH এর পর Subject + Verb হয় (does বাদ যাবে)।',
    categoryTag: 'Embedded Question'
  },
  {
    id: 'corr_3',
    incorrectSentence: 'The rice of Dinajpur is better than Rajshahi.',
    correctSentence: 'The rice of Dinajpur is better than that of Rajshahi.',
    ruleExplanationBn: 'তুলনা করার সময় singular বিষয়ের ক্ষেত্রে than that of বসে।',
    categoryTag: 'Comparison'
  },
  {
    id: 'corr_4',
    incorrectSentence: 'The doctor saw my pulse.',
    correctSentence: 'The doctor felt my pulse.',
    ruleExplanationBn: 'নাড়ি দেখা অর্থে saw নয়, felt বসে।',
    categoryTag: 'Collocation'
  },
  {
    id: 'corr_5',
    incorrectSentence: 'Cut the line.',
    correctSentence: 'Pen through the line.',
    ruleExplanationBn: 'লেখায় লাইন কাটার ক্ষেত্রে pen through the line ব্যবহৃত হয়।',
    categoryTag: 'Idiomatic'
  },
  {
    id: 'corr_6',
    incorrectSentence: 'He was absent in the meeting.',
    correctSentence: 'He was absent from the meeting.',
    ruleExplanationBn: 'absent এর পর appropriate preposition হিসেবে from বসে।',
    categoryTag: 'Appropriate Preposition'
  },
  {
    id: 'corr_7',
    incorrectSentence: 'One should do his duty.',
    correctSentence: 'One should do one\'s duty.',
    ruleExplanationBn: 'One এর possessive রূপ হলো one\'s (his নয়)।',
    categoryTag: 'Pronoun Agreement'
  },
  {
    id: 'corr_8',
    incorrectSentence: 'Death is more preferable than disgrace.',
    correctSentence: 'Death is preferable to disgrace.',
    ruleExplanationBn: 'preferable এর পূর্বে more বসে না এবং পরে than না বসে to বসে।',
    categoryTag: 'Degree'
  },
  {
    id: 'corr_9',
    incorrectSentence: 'There is no place in the bench.',
    correctSentence: 'There is no room/space in the bench.',
    ruleExplanationBn: 'বেঞ্চে বা গাড়িতে বসার খালি জায়গা বোঝাতে room বা space বসে।',
    categoryTag: 'Word Choice'
  },
  {
    id: 'corr_10',
    incorrectSentence: 'I saw a dead cow walking on the street.',
    correctSentence: 'I saw a dead cow while I was walking on the street.',
    ruleExplanationBn: 'মৃত গরু নিজে হাঁটতে পারে না (Misplaced modifier)।',
    categoryTag: 'Dangling Modifier'
  },
  {
    id: 'corr_11',
    incorrectSentence: 'I, you and he must work together.',
    correctSentence: 'You, he and I must work together.',
    ruleExplanationBn: 'সাধারণ বা ভালো অর্থে ২য়, ৩য় ও ১ম পুরুষ (231 নিয়ম) বসে।',
    categoryTag: 'Pronoun Order'
  },
  {
    id: 'corr_12',
    incorrectSentence: 'He is senior than me.',
    correctSentence: 'He is senior to me.',
    ruleExplanationBn: 'senior, junior, superior, inferior এর পর than না বসে to বসে।',
    categoryTag: 'Latin Comparatives'
  }
];
