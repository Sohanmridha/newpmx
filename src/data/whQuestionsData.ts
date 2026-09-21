import { GrammarRuleItem } from '../types/englishCare';

export interface WhQuestionExercise {
  id: string;
  statement: string;
  underlinedPart: string;
  targetWh: string;
  correctQuestion: string;
  explanationBn: string;
  scrambledWords: string[];
}

export const WH_QUESTIONS_RULES: GrammarRuleItem[] = [
  {
    id: 'wh_01',
    ruleNumber: 1,
    category: 'wh_questions',
    title: 'Subject পজিশন থেকে ব্যক্তি বাদ গেলে ➜ Who',
    shortcutFormula: 'Subject (ব্যক্তি) বাদ গেলে ➜ Who + বাকি সব অপরিবর্তিত + ?',
    noteBn: 'যদি কোনো বাক্যের শুরুতে ব্যক্তিবাচক Subject আন্ডারলাইন করা থাকে, তবে কেবল ঐ Subject তুলে দিয়ে Who বসিয়ে শেষে প্রশ্নবোধক চিহ্ন দিলেই প্রশ্ন হয়ে যায়।',
    examples: [
      { sentence: 'Nazrul is the national poet of Bangladesh.', answer: 'Who is the national poet of Bangladesh?' },
      { sentence: 'Columbus discovered America.', answer: 'Who discovered America?' },
      { sentence: 'John Keats was born in England.', answer: 'Who was born in England?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q1_1',
        question: 'Shakespeare wrote "Hamlet". (Wh-question তৈরি করো)',
        correctAnswer: 'Who wrote "Hamlet"?',
        explanation: 'Shakespeare ব্যক্তিবাচক সাবজেক্ট, তাই তার স্থানে Who বসবে।'
      }
    ]
  },
  {
    id: 'wh_02',
    ruleNumber: 2,
    category: 'wh_questions',
    title: 'Subject পজিশন থেকে বস্তু/ধারণা বাদ গেলে ➜ What',
    shortcutFormula: 'Subject (অ-ব্যক্তিবাচক/বস্তু/ধারণা) বাদ গেলে ➜ What + বাকি সব অপরিবর্তিত + ?',
    noteBn: 'Subject স্থানে কোনো বস্তু, ভাব বা বিষয় থাকলে What দিয়ে প্রতিস্থাপন করা হয়।',
    examples: [
      { sentence: 'Health is wealth.', answer: 'What is wealth?' },
      { sentence: 'Charity begins at home.', answer: 'What begins at home?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q2_1',
        question: 'Practice makes a man perfect. (Wh-question)',
        correctAnswer: 'What makes a man perfect?',
        explanation: 'Practice একটি অবস্তুবাচক বিষয়/অভ্যাস, তাই What বসবে।'
      }
    ]
  },
  {
    id: 'wh_03',
    ruleNumber: 3,
    category: 'wh_questions',
    title: 'স্থান বাদ দিয়ে প্রশ্ন করলে ➜ Where',
    shortcutFormula: 'Where + Auxiliary Verb + Subject + Main Verb + ?',
    noteBn: 'বাক্যে কোনো স্থানের নাম বা অবস্থান আন্ডারলাইন থাকলে Where দিয়ে শুরু করতে হবে।',
    examples: [
      { sentence: 'I found him in the park.', answer: 'Where did you find him?' },
      { sentence: 'I met her on my way to school.', answer: 'Where did you meet her?' },
      { sentence: 'The seminar was held in Chattogram.', answer: 'Where was the seminar held?' },
      { sentence: 'He died in Dhaka.', answer: 'Where did he die?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q3_1',
        question: 'He comes from Khulna.',
        correctAnswer: 'Where does he come from?',
        explanation: 'Khulna স্থান, comes (V1+s) থাকায় Auxiliary verb "does" এবং মূল verb "come" হবে।'
      }
    ]
  },
  {
    id: 'wh_04',
    ruleNumber: 4,
    category: 'wh_questions',
    title: 'সময় বাদ দিয়ে প্রশ্ন করলে ➜ When / What time',
    shortcutFormula: 'When + Auxiliary Verb + Subject + Main Verb + ?',
    noteBn: 'দিন, তারিখ, সাল, সকাল/বিকাল বা নির্দিষ্ট সময়ের ক্ষেত্রে When বসে। সুনির্দিষ্ট ঘড়ির সময় নির্দেশ করলে What time ও ব্যবহার করা যায়।',
    examples: [
      { sentence: 'Our college was built in 1956.', answer: 'When was your college built?' },
      { sentence: 'The moon shines at night.', answer: 'When does the moon shine?' },
      { sentence: 'The bank closes at 5 pm.', answer: 'When does the bank close?' },
      { sentence: 'She gets up at 6:30 am every day.', answer: 'When does she get up every day?' },
      { sentence: 'He went to London yesterday.', answer: 'When did he go to London?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q4_1',
        question: 'The French Revolution took place in 1789.',
        correctAnswer: 'When did the French Revolution take place?',
        explanation: '1789 সাল নির্দেশ করে এবং took (V2) থাকায় did + take place হবে।'
      }
    ]
  },
  {
    id: 'wh_05',
    ruleNumber: 5,
    category: 'wh_questions',
    title: 'উপায় / যানবাহন / অবস্থা বাদ দিয়ে ➜ How',
    shortcutFormula: 'How + Auxiliary Verb + Subject + Main Verb + ?',
    noteBn: 'কোনো মাধ্যমে যাওয়া (by bus/train), কোনো অনুভুতি (feverish), কাজের ধরন (silently) বা স্বাদ (sour) প্রকাশে How বসে।',
    examples: [
      { sentence: 'Rony went to Khulna by bus.', answer: 'How did Rony go to Khulna?' },
      { sentence: 'He entered the room silently.', answer: 'How did he enter the room?' },
      { sentence: 'I feel feverish.', answer: 'How do you feel?' },
      { sentence: 'Green mangoes taste sour.', answer: 'How do green mangoes taste?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q5_1',
        question: 'Hamim will go there by bus.',
        correctAnswer: 'How will Hamim go there?',
        explanation: 'by bus যোগাযোগের মাধ্যম, তাই How + will + Hamim + go there হবে।'
      }
    ]
  },
  {
    id: 'wh_06',
    ruleNumber: 6,
    category: 'wh_questions',
    title: 'সময়কাল / স্থায়িত্ব (for/since + time) ➜ How long',
    shortcutFormula: 'How long + have/has + Subject + been + Verb-ing + ?',
    noteBn: 'কতক্ষণ ধরে কোনো কাজ চলছে বোঝালে (for three hours / since morning) How long দিয়ে প্রশ্ন করতে হয়।',
    examples: [
      { sentence: 'I have been waiting here for three hours.', answer: 'How long have you been waiting here?' },
      { sentence: 'I have been out of the country for two years.', answer: 'How long have you been out of the country?' },
      { sentence: 'It has been raining cats and dogs since morning.', answer: 'How long has it been raining cats and dogs?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q6_1',
        question: 'They have been waiting here for half an hour.',
        correctAnswer: 'How long have they been waiting here?',
        explanation: 'for half an hour সময়কাল নির্দেশ করায় How long ব্যবহৃত হয়।'
      }
    ]
  },
  {
    id: 'wh_07',
    ruleNumber: 7,
    category: 'wh_questions',
    title: 'কতবার / পৌনঃপুনিকতা ➜ How often',
    shortcutFormula: 'often / once / twice / sometimes বাদ দিয়ে ➜ How often + AV + Sub + MV + ?',
    noteBn: 'কোনো কাজ কত ঘনঘন ঘটে (twice a week, once a month, every day) তা জানতে How often ব্যবহৃত হয়।',
    examples: [
      { sentence: 'He visits his parents twice a month.', answer: 'How often does he visit his parents a month?' },
      { sentence: 'He visits my house twice a week.', answer: 'How often does he visit your house a week?' },
      { sentence: 'He comes to our house once a week.', answer: 'How often does he come to your house a week?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q7_1',
        question: 'I visit my village home twice a month.',
        correctAnswer: 'How often do you visit your village home a month?',
        explanation: 'twice a month থাকায় How often হবে।'
      }
    ]
  },
  {
    id: 'wh_08',
    ruleNumber: 8,
    category: 'wh_questions',
    title: 'বয়স বাদ দিয়ে ➜ How old',
    shortcutFormula: 'বয়স (thirty-two / four years) বাদ দিয়ে ➜ How old + be verb + Subject + ?',
    noteBn: 'কারো বয়স জানতে চাইলে How old দিয়ে প্রশ্ন করতে হয়।',
    examples: [
      { sentence: 'My brother is thirty-two.', answer: 'How old is your brother?' },
      { sentence: 'He was only four when his father died.', answer: 'How old was he when his father died?' },
      { sentence: 'Jim was only twenty-two.', answer: 'How old was Jim?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q8_1',
        question: 'She is 40 years old.',
        correctAnswer: 'How old is she?',
        explanation: '40 years old বয়স নির্দেশ করে, তাই How old is she? হবে।'
      }
    ]
  },
  {
    id: 'wh_09',
    ruleNumber: 9,
    category: 'wh_questions',
    title: 'টাকার পরিমাণ বা দাম ➜ How much',
    shortcutFormula: 'টাকার পরিমাণ বা দাম বাদ দিয়ে ➜ How much + does/did + Sub + cost + ?',
    noteBn: 'কোনো জিনিসের দাম বা খরচ জানতে How much ব্যবহৃত হয়। সংখ্যা গণনাযোগ্য হলে How many হয়।',
    examples: [
      { sentence: 'The book costs me five hundred taka.', answer: 'How much does the book cost you?' },
      { sentence: 'The pen cost him five dollars.', answer: 'How much did the pen cost him?' },
      { sentence: 'The book cost me Tk. 300.', answer: 'How much did the book cost you?' },
      { sentence: 'I have purchased five books.', answer: 'How many books have you purchased?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q9_1',
        question: 'The pen cost me Tk. 50.',
        correctAnswer: 'How much did the pen cost you?',
        explanation: 'cost এখানে Past Form, তাই did + cost you হবে।'
      }
    ]
  },
  {
    id: 'wh_10',
    ruleNumber: 10,
    category: 'wh_questions',
    title: 'কারণ বা উদ্দেশ্য ➜ Why',
    shortcutFormula: 'to+verb / for+noun / because / so that বাদ দিয়ে ➜ Why + AV + Sub + MV + ?',
    noteBn: 'কেন বা কি উদ্দেশ্যে কোনো কাজ করা হয়েছে তা জানতে Why দিয়ে প্রশ্ন তৈরি করা হয়।',
    examples: [
      { sentence: 'He went home to take care of his ailing father.', answer: 'Why did he go home?' },
      { sentence: 'Rajshahi is famous for silk.', answer: 'Why is Rajshahi famous?' },
      { sentence: 'He will not come because he is ill.', answer: 'Why will he not come?' },
      { sentence: 'We respect him for his honesty.', answer: 'Why do you respect him?' },
      { sentence: 'We went to market to buy a shirt.', answer: 'Why did you go to market?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q10_1',
        question: 'I went to the library to collect some books.',
        correctAnswer: 'Why did you go to the library?',
        explanation: 'to collect some books উদ্দেশ্য, তাই Why did you go to the library? হবে।'
      }
    ]
  },
  {
    id: 'wh_11',
    ruleNumber: 11,
    category: 'wh_questions',
    title: 'Object পজিশন থেকে ব্যক্তি বাদ গেলে ➜ Whom / Who',
    shortcutFormula: 'Whom + Auxiliary Verb + Subject + Main Verb + ?',
    noteBn: 'কর্ম বা অবজেক্টের ব্যক্তিবাচক অংশ বাদ গেলে আধুনিক ব্যাকরণে Whom বা Who উভয়ই গ্রহণযোগ্য।',
    examples: [
      { sentence: 'I visit my father every week.', answer: 'Whom do you visit every week?' },
      { sentence: 'I want to talk to Mr. Alam.', answer: 'Whom do you want to talk to?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q11_1',
        question: 'She went to market with her mother.',
        correctAnswer: 'Whom did she go to market with? / With whom did she go to market?',
        explanation: 'mother অবজেক্ট ব্যক্তি, তাই Whom did she go to market with? হবে।'
      }
    ]
  },
  {
    id: 'wh_12',
    ruleNumber: 12,
    category: 'wh_questions',
    title: 'চেহারা বা সাদৃশ্য ➜ What ... look like? / How does ... look?',
    shortcutFormula: 'What does + Subject + look like? অথবা How does + Subject + look?',
    noteBn: 'কোনো ব্যক্তি বা বস্তুর রূপ বা চেহারা কেমন তা জানতে এই চমৎকার টেকনিকটি ব্যবহার করা হয়।',
    examples: [
      { sentence: 'He looks like a film star.', answer: 'What does he look like? / How does he look?' },
      { sentence: 'She looks like a rose.', answer: 'What does she look like?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q12_1',
        question: 'She looks like an angel.',
        correctAnswer: 'What does she look like?',
        explanation: 'looks like an angel সাদৃশ্য প্রকাশ করে, তাই What does she look like? হবে।'
      }
    ]
  },
  {
    id: 'wh_13',
    ruleNumber: 13,
    category: 'wh_questions',
    title: 'Everybody / Everyone বাদ দিলে ➜ Who doesn\'t ...',
    shortcutFormula: 'Everybody / Everyone বাদ দিয়ে ➜ Who + does not / didn\'t + Base Verb + ?',
    noteBn: 'সকলেই এমনটি করে বা চায় বোঝাতে প্রশ্ন করার সময় নেতিবাচক রূপ "কে না চায়/কে না করে" (Who doesn\'t...?) ব্যবহৃত হয়।',
    examples: [
      { sentence: 'Everybody hates a liar.', answer: 'Who doesn\'t hate a liar?' },
      { sentence: 'Everyone dislikes an idle man.', answer: 'Who doesn\'t dislike an idle man?' },
      { sentence: 'Everybody wishes to be happy.', answer: 'Who doesn\'t wish to be happy?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q13_1',
        question: 'Everybody loves his motherland.',
        correctAnswer: 'Who doesn\'t love his motherland?',
        explanation: 'Everybody এর পরিবর্তে Who doesn\'t + V1 (love) বসে।'
      }
    ]
  },
  {
    id: 'wh_14',
    ruleNumber: 14,
    category: 'wh_questions',
    title: 'Nobody / None বাদ দিলে ➜ Who + affirmative',
    shortcutFormula: 'Nobody / None বাদ দিয়ে উক্ত স্থানে কেবল ➜ Who বসে',
    noteBn: 'যেহেতু Nobody বা None নিজেই নেতিবাচক, তাই প্রশ্ন করার সময় আর not বসে না। শুধু Who বসিয়ে শেষে ? দিলেই হয়ে যায়।',
    examples: [
      { sentence: 'Nobody is free from error.', answer: 'Who is free from error?' },
      { sentence: 'None can escape death.', answer: 'Who can escape death?' },
      { sentence: 'Nobody believes a liar.', answer: 'Who believes a liar?' }
    ],
    practiceQuestions: [
      {
        id: 'wh_q14_1',
        question: 'Nobody trusts a thief.',
        correctAnswer: 'Who trusts a thief?',
        explanation: 'Nobody এর স্থানে সরাসরি Who বসবে এবং verb অপরিবর্তিত থাকবে।'
      }
    ]
  }
];

export const WH_DRAG_DROP_EXERCISES: WhQuestionExercise[] = [
  {
    id: 'wh_ex_1',
    statement: 'Nazrul is the national poet of Bangladesh.',
    underlinedPart: 'Nazrul',
    targetWh: 'Who',
    correctQuestion: 'Who is the national poet of Bangladesh ?',
    explanationBn: 'ব্যক্তিবাচক সাবজেক্ট "Nazrul" বাদ পড়ায় Who ব্যবহৃত হয়েছে।',
    scrambledWords: ['the', 'Who', 'Bangladesh', 'national', 'is', 'poet', 'of', '?']
  },
  {
    id: 'wh_ex_2',
    statement: 'Rony went to Khulna by bus.',
    underlinedPart: 'by bus',
    targetWh: 'How',
    correctQuestion: 'How did Rony go to Khulna ?',
    explanationBn: 'যাতায়াতের মাধ্যম নির্দেশ করায় How এবং went থাকায় did + go হয়েছে।',
    scrambledWords: ['did', 'How', 'to', 'Rony', 'Khulna', 'go', '?']
  },
  {
    id: 'wh_ex_3',
    statement: 'The book costs me five hundred taka.',
    underlinedPart: 'five hundred taka',
    targetWh: 'How much',
    correctQuestion: 'How much does the book cost you ?',
    explanationBn: 'মূল্য নির্দেশ করায় How much does the book cost you? হবে।',
    scrambledWords: ['the', 'How', 'cost', 'does', 'much', 'book', 'you', '?']
  },
  {
    id: 'wh_ex_4',
    statement: 'I have been waiting here for three hours.',
    underlinedPart: 'for three hours',
    targetWh: 'How long',
    correctQuestion: 'How long have you been waiting here ?',
    explanationBn: 'সময়কাল থাকায় How long have you been waiting here? হবে।',
    scrambledWords: ['waiting', 'How', 'long', 'you', 'here', 'have', 'been', '?']
  },
  {
    id: 'wh_ex_5',
    statement: 'Everybody hates a liar.',
    underlinedPart: 'Everybody',
    targetWh: 'Who',
    correctQuestion: 'Who does not hate a liar ?',
    explanationBn: 'Everybody থাকলে Who does not + hate a liar? হয়।',
    scrambledWords: ['not', 'a', 'Who', 'does', 'hate', 'liar', '?']
  },
  {
    id: 'wh_ex_6',
    statement: 'Nobody believes a liar.',
    underlinedPart: 'Nobody',
    targetWh: 'Who',
    correctQuestion: 'Who believes a liar ?',
    explanationBn: 'Nobody থাকলে সরাসরি Who believes a liar? হবে।',
    scrambledWords: ['Who', 'a', 'believes', 'liar', '?']
  }
];
