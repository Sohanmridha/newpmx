import { GrammarRuleItem } from '../types/englishCare';

export const RIGHT_FORM_OF_VERBS_RULES: GrammarRuleItem[] = [
  {
    id: 'rfv_01',
    ruleNumber: 1,
    category: 'right_form_of_verbs',
    title: 'Just / Recently / Already / Yet / Lately',
    shortcutFormula: 'just / just now / recently / already / yet / lately থাকলে ➜ Present Perfect Tense (have/has + V3)',
    noteBn: 'বাক্যে এই শব্দগুলো থাকলে কাজটি এইমাত্র শেষ হয়েছে বুঝায়, তাই Subject অনুসারে have বা has বসে এবং মূল Verb-এর Past Participle (V3) ফর্ম হয়।',
    examples: [
      { sentence: 'He (buy) a car recently.', answer: 'He has bought a car recently.' },
      { sentence: 'He recently (join) the club.', answer: 'He has recently joined the club.' },
      { sentence: 'The play just (begin).', answer: 'The play has just begun.' },
      { sentence: 'I just (receive) your letter.', answer: 'I have just received your letter.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q1_1',
        question: 'He (buy) a car recently.',
        bracketVerb: 'buy',
        options: ['bought', 'has bought', 'had bought', 'is buying'],
        correctAnswer: 'has bought',
        explanation: 'recently থাকায় Present Perfect (has + bought) হবে।'
      },
      {
        id: 'rfv_q1_2',
        question: 'The play just (begin).',
        bracketVerb: 'begin',
        options: ['began', 'has begun', 'is beginning', 'was begun'],
        correctAnswer: 'has begun',
        explanation: 'just থাকায় have/has + V3; play singular তাই has begun।'
      },
      {
        id: 'rfv_q1_3',
        question: 'I just (receive) your letter.',
        bracketVerb: 'receive',
        options: ['received', 'have received', 'am receiving', 'had received'],
        correctAnswer: 'have received',
        explanation: 'I এর সাথে have received হবে।'
      }
    ]
  },
  {
    id: 'rfv_02',
    ruleNumber: 2,
    category: 'right_form_of_verbs',
    title: 'Since / For + Time (সময়ের উল্লেখ)',
    shortcutFormula: 'since / for + সময় ➜ Present Perfect Continuous (have been / has been + Verb+ing)',
    noteBn: 'কোনো কাজ অতীতে শুরু হয়ে এখনো চলছে বোঝালে have been / has been + Verb-এর সাথে ing যোগ হয়।',
    warningBn: 'সতর্কতা: ব্র্যাকেটে (be) থাকলে শুধু Have been / Has been বসে, ing বসে না। যেমন: He (be) absent for three days ➜ He has been absent for three days.',
    examples: [
      { sentence: 'They (learn) English for seven days.', answer: 'They have been learning English for seven days.' },
      { sentence: 'They (play) in the field for two hours.', answer: 'They have been playing in the field for two hours.' },
      { sentence: 'I (live) here for three years.', answer: 'I have been living here for three years.' },
      { sentence: 'Chinmoy (read) in this college for the last two years.', answer: 'Chinmoy has been reading in this college for the last two years.' },
      { sentence: 'It (rain) since morning.', answer: 'It has been raining since morning.' },
      { sentence: 'He (be) absent for three days.', answer: 'He has been absent for three days.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q2_1',
        question: 'It (rain) since morning.',
        bracketVerb: 'rain',
        options: ['rained', 'is raining', 'has been raining', 'was raining'],
        correctAnswer: 'has been raining',
        explanation: 'since morning সময়ের নির্দেশক, তাই has been raining।'
      },
      {
        id: 'rfv_q2_2',
        question: 'He (be) absent for three days.',
        bracketVerb: 'be',
        options: ['is being', 'has been', 'had been being', 'was'],
        correctAnswer: 'has been',
        explanation: 'ব্র্যাকেটে be থাকলে ing হয় না, সরাসরি has been বসে।'
      }
    ]
  },
  {
    id: 'rfv_03',
    ruleNumber: 3,
    category: 'right_form_of_verbs',
    title: 'It is time / It is high time / Fancy',
    shortcutFormula: 'It is time / It is high time / Fancy থাকলে ➜ Verb-এর Past Form (V2)',
    noteBn: 'উপযুক্ত সময় এখনই বা ইতিমধ্যে অনেক দেরি হয়ে গেছে বোঝাতে It is high time এর পর Subject থাকলে ব্র্যাকেটের Verb-টি V2 হবে।',
    examples: [
      { sentence: 'It is high time we (serve) the nation.', answer: 'It is high time we served the nation.' },
      { sentence: 'It is high time she (change) her habit.', answer: 'It is high time she changed her habit.' },
      { sentence: 'It is high time we (change) our eating habit.', answer: 'It is high time we changed our eating habit.' },
      { sentence: 'I fancy I (turn) pale.', answer: 'I fancy I turned pale.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q3_1',
        question: 'It is high time we (change) our bad habits.',
        bracketVerb: 'change',
        options: ['change', 'changed', 'should change', 'had changed'],
        correctAnswer: 'changed',
        explanation: 'It is high time + subject থাকলে verb এর V2 (changed) হয়।'
      }
    ]
  },
  {
    id: 'rfv_04',
    ruleNumber: 4,
    category: 'right_form_of_verbs',
    title: 'I wish (অবাস্তব কল্পনা)',
    shortcutFormula: 'I wish + Main verb থাকলে ➜ could + V1 | Be verb থাকলে ➜ were (সবার জন্য)',
    noteBn: 'অবাস্তব ইচ্ছা বা আক্ষেপ প্রকাশে I wish এর পর সাধারণ ক্রিয়ার ক্ষেত্রে could + V1 এবং be verb থাকলে Subject যাই হোক না কেন were বসে।',
    examples: [
      { sentence: 'I wish I (sing) a folk song.', answer: 'I wish I could sing a folk song.' },
      { sentence: 'I wish I (fly) in the sky.', answer: 'I wish I could fly in the sky.' },
      { sentence: 'I wish I (be) a bird.', answer: 'I wish I were a bird.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q4_1',
        question: 'I wish I (be) a king.',
        bracketVerb: 'be',
        options: ['was', 'were', 'am', 'had been'],
        correctAnswer: 'were',
        explanation: 'I wish-এ Be verb এর জায়গায় নির্বিশেষে were বসে।'
      },
      {
        id: 'rfv_q4_2',
        question: 'I wish I (fly) like a bird.',
        bracketVerb: 'fly',
        options: ['flew', 'could fly', 'can fly', 'flying'],
        correctAnswer: 'could fly',
        explanation: 'I wish + main verb থাকলে could + V1 (could fly) বসে।'
      }
    ]
  },
  {
    id: 'rfv_05',
    ruleNumber: 5,
    category: 'right_form_of_verbs',
    title: 'Simple বাক্যে দুটি Main Verb',
    shortcutFormula: 'একই বাক্যে দুটো Main verb থাকলে ➜ অপর Main verb এর সাথে ing যোগ হয়',
    noteBn: 'একটি Simple বাক্যে একটিই ফাইনাইট ভার্ব থাকে। দ্বিতীয় ভার্বটির সাথে ing যুক্ত হয়ে পার্টিসিপল বা জেরান্ড হয়।',
    examples: [
      { sentence: 'I saw two boys (swim) in the pond.', answer: 'I saw two boys swimming in the pond.' },
      { sentence: 'I went back to work (close) the door.', answer: 'I went back to work closing the door.' },
      { sentence: 'I saw my friend (walk) in the field.', answer: 'I saw my friend walking in the field.' },
      { sentence: 'The sun (have) set, we went home.', answer: 'The sun having set, we went home.' },
      { sentence: 'The boy saw the thief (run) away.', answer: 'The boy saw the thief running away.' },
      { sentence: 'I found him (hide) behind the wall.', answer: 'I found him hiding behind the wall.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q5_1',
        question: 'I found him (hide) behind the door.',
        bracketVerb: 'hide',
        options: ['hid', 'hidden', 'hiding', 'to hide'],
        correctAnswer: 'hiding',
        explanation: 'Simple sentence এ দ্বিতীয় verb এর সাথে ing (hiding) হয়।'
      }
    ]
  },
  {
    id: 'rfv_06',
    ruleNumber: 6,
    category: 'right_form_of_verbs',
    title: 'Preposition (to বাদে) এর পর Verb',
    shortcutFormula: 'Preposition (to ব্যতীত: in, on, of, for, with, without, by ইত্যাদি) + Verb+ing',
    noteBn: 'সাধারণত to এর পর verb-এর base form বসে, কিন্তু অন্য যেকোনো Preposition এর পর Verb আসলে তার সাথে ing যুক্ত হয়।',
    examples: [
      { sentence: 'On (return) home, he had his meal.', answer: 'On returning home, he had his meal.' },
      { sentence: 'One should not say anything without (know).', answer: 'One should not say anything without knowing.' },
      { sentence: 'We must invent the way of (increase) our wealth again.', answer: 'We must invent the way of increasing our wealth again.' },
      { sentence: 'I never thought of (go) there.', answer: 'I never thought of going there.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q6_1',
        question: 'She left the room without (say) a word.',
        bracketVerb: 'say',
        options: ['said', 'saying', 'says', 'to say'],
        correctAnswer: 'saying',
        explanation: 'without একটি preposition, তাই verb+ing (saying) হবে।'
      }
    ]
  },
  {
    id: 'rfv_07',
    ruleNumber: 7,
    category: 'right_form_of_verbs',
    title: 'With a view to / Look forward to / Mind ইত্যাদি',
    shortcutFormula: 'with a view to / look forward to / get used to / be used to / contribute to / addicted to / prefer to / cannot help / could not help / mind / worth + Verb+ing',
    noteBn: 'এই ফ্রেজগুলোর পর সবসময় Verb-এর সাথে ing যুক্ত হয়। এটি পরীক্ষায় প্রায় প্রতি বছরই আসে (V.V.I.)।',
    examples: [
      { sentence: 'I went to New Market with a view to (buy) a new shirt.', answer: 'I went to New Market with a view to buying a new shirt.' },
      { sentence: 'Upama is used to (swim) in the river.', answer: 'Upama is used to swimming in the river.' },
      { sentence: 'I look forward to (receive) your letter.', answer: 'I look forward to receiving your letter.' },
      { sentence: 'I cannot help (laugh).', answer: 'I cannot help laughing.' },
      { sentence: 'Would you mind (open) the door?', answer: 'Would you mind opening the door?' },
      { sentence: 'Would you mind (to have) a cup of tea?', answer: 'Would you mind having a cup of tea?' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q7_1',
        question: 'I went there with a view to (meet) him.',
        bracketVerb: 'meet',
        options: ['meet', 'meeting', 'met', 'to meet'],
        correctAnswer: 'meeting',
        explanation: 'with a view to এর পর সর্বদা verb+ing (meeting) বসে।'
      },
      {
        id: 'rfv_q7_2',
        question: 'Would you mind (close) the window?',
        bracketVerb: 'close',
        options: ['close', 'closing', 'closed', 'to close'],
        correctAnswer: 'closing',
        explanation: 'Would you mind এর পর verb+ing (closing) হয়।'
      }
    ]
  },
  {
    id: 'rfv_08',
    ruleNumber: 8,
    category: 'right_form_of_verbs',
    title: 'Before & After (Past Perfect)',
    shortcutFormula: '(i) had + V3 + before + V2 | (ii) V2 + after + had + V3',
    noteBn: 'before এর পূর্বে had+v3 এবং after এর পরে had+v3 বসে। অর্থাৎ, যে কাজটি আগে ঘটেছিল সেটি Past Perfect (had+V3) হবে।',
    examples: [
      { sentence: 'The rain (stop) before the guests came.', answer: 'The rain had stopped before the guests came.' },
      { sentence: 'The patient (die) before the doctor came.', answer: 'The patient had died before the doctor came.' },
      { sentence: 'The patient (die) after the doctor had come.', answer: 'The patient died after the doctor had come.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q8_1',
        question: 'The train (leave) before we reached the station.',
        bracketVerb: 'leave',
        options: ['left', 'had left', 'has left', 'leaving'],
        correctAnswer: 'had left',
        explanation: 'before এর আগের অংশে Past Perfect (had left) হয়।'
      }
    ]
  },
  {
    id: 'rfv_09',
    ruleNumber: 9,
    category: 'right_form_of_verbs',
    title: 'Since / As if / As though এর সময়ভিত্তিক রূপ',
    shortcutFormula: '(i) Present Tense (V1) + since/as if/as though + V2 | (ii) Past Tense (V2) + since/as if/as though + had+V3',
    noteBn: 'প্রথম অংশ Present হলে পরের অংশ Past Indefinite (V2) হয়; কিন্তু প্রথম অংশ Past হলে পরের অংশ Past Perfect (had+V3) হয়।',
    examples: [
      { sentence: 'It is a long time since I (see) him.', answer: 'It is a long time since I saw him.' },
      { sentence: 'It was a long time since I (see) him.', answer: 'It was a long time since I had seen him.' },
      { sentence: 'He talks as if he (be) a leader.', answer: 'He talks as if he were a leader.' },
      { sentence: 'He talked as if he (know) everything.', answer: 'He talked as if he had known everything.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q9_1',
        question: 'He talks as if he (know) everything.',
        bracketVerb: 'know',
        options: ['knows', 'knew', 'had known', 'has known'],
        correctAnswer: 'knew',
        explanation: 'talks (Present) + as if + V2 (knew)।'
      },
      {
        id: 'rfv_q9_2',
        question: 'He talked as if he (know) everything.',
        bracketVerb: 'know',
        options: ['knew', 'had known', 'knows', 'was knowing'],
        correctAnswer: 'had known',
        explanation: 'talked (Past V2) + as if + had + V3 (had known)।'
      }
    ]
  },
  {
    id: 'rfv_10',
    ruleNumber: 10,
    category: 'right_form_of_verbs',
    title: 'Conditional Sentences (If / Unless / Had)',
    shortcutFormula: '1st: If + V1 ➜ shall/will/can/may + V1 | 2nd: If + V2 ➜ would/could/might + V1 | 3rd: If + had + V3 / Had+Sub+V3 ➜ would have + V3',
    noteBn: 'Had + Sub + V3 দিয়ে বাক্য শুরু হলে তা ৩য় কন্ডিশনাল, ডানপাশে would have + V3 বসবে।',
    warningBn: 'সতর্কতা: যদি Had এর পর V3 না থাকে (যেমন: If I had a camera), তবে সেটি ২য় কন্ডিশনাল ধরে ডানপাশে would + V1 দিতে হবে (I would take a snap)।',
    examples: [
      { sentence: 'If you had called me, I (help) you.', answer: 'If you had called me, I would have helped you.' },
      { sentence: 'If you try, you (succeed).', answer: 'If you try, you will succeed.' },
      { sentence: 'If he came, I (go).', answer: 'If he came, I would go.' },
      { sentence: 'If I were a magician, I (solve) everything.', answer: 'If I were a magician, I would solve everything.' },
      { sentence: 'Had I been a rich man, I (help) the poor.', answer: 'Had I been a rich man, I would have helped the poor.' },
      { sentence: 'If I had a camera, I (take) a snap.', answer: 'If I had a camera, I would take a snap.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q10_1',
        question: 'Had I possessed much wealth, I (help) the poor.',
        bracketVerb: 'help',
        options: ['will help', 'would help', 'would have helped', 'helped'],
        correctAnswer: 'would have helped',
        explanation: 'Had + Sub + V3 (possessed) ৩য় কন্ডিশনাল, তাই would have helped হবে।'
      }
    ]
  },
  {
    id: 'rfv_11',
    ruleNumber: 11,
    category: 'right_form_of_verbs',
    title: 'Causative Verbs (make, let, have, get)',
    shortcutFormula: 'make / made / let এর পর ➜ V1 (Base form) | have / has / had / get / got এর পর Object থাকলে ➜ V3 (Past Participle)',
    noteBn: 'অন্যকে দিয়ে কাজ করানো বোঝাতে Causative Verb ব্যবহৃত হয়। let এবং make এর পর সর্বদা bare infinitive (V1) বসে।',
    examples: [
      { sentence: 'They had their rice (cook).', answer: 'They had their rice cooked.' },
      { sentence: 'I got the letter (open) by him.', answer: 'I got the letter opened by him.' },
      { sentence: 'I let the other boys (use) it.', answer: 'I let the other boys use it.' },
      { sentence: 'I got the work (do).', answer: 'I got the work done.' },
      { sentence: 'He got his leg (break).', answer: 'He got his leg broken.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q11_1',
        question: 'He made me (do) the work.',
        bracketVerb: 'do',
        options: ['to do', 'doing', 'do', 'done'],
        correctAnswer: 'do',
        explanation: 'made এর পর Base verb (do) বসে।'
      },
      {
        id: 'rfv_q11_2',
        question: 'She had her picture (hang) on the wall.',
        bracketVerb: 'hang',
        options: ['hung', 'hanged', 'hanging', 'to hang'],
        correctAnswer: 'hung',
        explanation: 'had + বস্তু + V3 (hung) হয়।'
      }
    ]
  },
  {
    id: 'rfv_12',
    ruleNumber: 12,
    category: 'right_form_of_verbs',
    title: 'Lest (পাছে কোনো ভয় থাকে)',
    shortcutFormula: 'Lest থাকলে ➜ Subject + should / might + V1',
    noteBn: 'Lest এর অর্থ পাছে ভয় হয় যে বা যাতে এমন না ঘটে। Lest এর পর সর্বদা should বা might + Verb-এর base form বসে।',
    examples: [
      { sentence: 'I read more lest I (fail) in the exam.', answer: 'I read more lest I should fail in the exam.' },
      { sentence: 'He started saving money lest he (fall) into trouble.', answer: 'He started saving money lest he should fall into trouble.' },
      { sentence: 'Run fast lest you (miss) the train.', answer: 'Run fast lest you should miss the train.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q12_1',
        question: 'Walk fast lest you (miss) the bus.',
        bracketVerb: 'miss',
        options: ['miss', 'should miss', 'will miss', 'missed'],
        correctAnswer: 'should miss',
        explanation: 'lest থাকলে should + V1 (should miss) বসে।'
      }
    ]
  },
  {
    id: 'rfv_13',
    ruleNumber: 13,
    category: 'right_form_of_verbs',
    title: 'Sequence of Tense: V2 + That ➜ Would + V1',
    shortcutFormula: 'Sentence-এর মাঝখানে that এবং বামপাশে V2 থাকলে ➜ ডানপাশে would + V1 বসে',
    noteBn: 'Past tense-এর অধীনস্থ ক্লজে ভবিষ্যৎ ভাব প্রকাশে will না হয়ে would + V1 হয়।',
    warningBn: 'সতর্কতা: that-এর ডানপাশে already/recently/yesterday/before থাকলে উত্তরে had + V3 বসে।',
    examples: [
      { sentence: 'Karim said that he (go) home next week.', answer: 'Karim said that he would go home next week.' },
      { sentence: 'He said that Bangladesh (develop) day by day.', answer: 'He said that Bangladesh would develop day by day.' },
      { sentence: 'You told me that you (help) me.', answer: 'You told me that you would help me.' },
      { sentence: 'Selina said that already she (finish) all her course.', answer: 'Selina said that already she had finished all her course.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q13_1',
        question: 'He hoped that he (get) the first prize.',
        bracketVerb: 'get',
        options: ['will get', 'would get', 'got', 'gets'],
        correctAnswer: 'would get',
        explanation: 'hoped (V2) থাকায় that এর পর would + V1 (would get) হবে।'
      }
    ]
  },
  {
    id: 'rfv_14',
    ruleNumber: 14,
    category: 'right_form_of_verbs',
    title: 'Would that (অসম্ভব ইচ্ছা)',
    shortcutFormula: 'Would that থাকলে ➜ could + V1 বসে (Be verb থাকলে were বা would be)',
    noteBn: 'বাক্যের শুরুতে Would that থাকলে মনের কোনো সুপ্ত ইচ্ছা প্রকাশে Subject-এর পর could + V1 বসে।',
    examples: [
      { sentence: 'Would that I (fly) like a bird.', answer: 'Would that I could fly like a bird.' },
      { sentence: 'Would that I (be) a bird!', answer: 'Would that I were / would be a bird!' },
      { sentence: 'Would that he (come) today!', answer: 'Would that he would come today!' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q14_1',
        question: 'Would that I (enter) the kingdom of heaven.',
        bracketVerb: 'enter',
        options: ['could enter', 'entered', 'can enter', 'enter'],
        correctAnswer: 'could enter',
        explanation: 'Would that থাকলে could + V1 (could enter) বসে।'
      }
    ]
  },
  {
    id: 'rfv_15',
    ruleNumber: 15,
    category: 'right_form_of_verbs',
    title: 'Present Indefinite & Imperative Time Clauses',
    shortcutFormula: 'Wait here until / Time clause ➜ V1 (Base form)',
    noteBn: 'সাধারণ সময়নির্দেশক বাক্যাংশে Present Indefinite Tense (V1) বসে।',
    examples: [
      { sentence: 'Wait here until I (call) you.', answer: 'Wait here until I call you.' },
      { sentence: 'We (celebrate) our victory day every year.', answer: 'We celebrate our victory day every year.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q15_1',
        question: 'Stay here until the rain (stop).',
        bracketVerb: 'stop',
        options: ['stopped', 'stops', 'will stop', 'has stopped'],
        correctAnswer: 'stops',
        explanation: 'until ক্লজে Present Indefinite (stops) বসে।'
      }
    ]
  },
  {
    id: 'rfv_16',
    ruleNumber: 16,
    category: 'right_form_of_verbs',
    title: 'Subject-Verb Agreement: Preposition & Every/Each',
    shortcutFormula: 'Subject 3rd person singular ➜ Verb + s/es | Preposition-এর বামের শব্দটিই আসল Subject',
    noteBn: 'Every+Noun, No+Noun, Each, Either, Neither সবসময় Singular। তেমনি as well as / together with / along with থাকলে প্রথম (বামের) Subject অনুযায়ী Verb নির্ধারণ হয়।',
    examples: [
      { sentence: 'Ice (float) on water.', answer: 'Ice floats on water.' },
      { sentence: 'The colour of the mangoes (look) beautiful.', answer: 'The colour of the mangoes looks beautiful.' },
      { sentence: 'The captain along with his soldiers (feel) tired.', answer: 'The captain along with his soldiers feels tired.' },
      { sentence: 'Raju as well as his brothers (work) in this office.', answer: 'Raju as well as his brothers works in this office.' },
      { sentence: 'Neither the director nor the manager (seem) happy.', answer: 'Neither the director nor the manager seems happy.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q16_1',
        question: 'The quality of these mangoes (be) good.',
        bracketVerb: 'be',
        options: ['are', 'is', 'were', 'have been'],
        correctAnswer: 'is',
        explanation: 'Preposition "of" এর বামে "quality" singular, তাই is হবে।'
      }
    ]
  },
  {
    id: 'rfv_17',
    ruleNumber: 17,
    category: 'right_form_of_verbs',
    title: 'ব্র্যাকেটে (be) ভার্ব ব্যবহারের ম্যাজিক টেকনিক',
    shortcutFormula: 'I ➜ am/was | 3rd Sing ➜ is/was | Plural ➜ are/were',
    noteBn: 'বইয়ের নাম (The Arabian Nights, Gulliver\'s Travels), একক দূরত্ব বা টাকা Singular হয়। The + Adjective (The rich, The poor) পুরো শ্রেণী বুঝায় বলে Plural হয়।',
    examples: [
      { sentence: 'I (be) a student studying in NU.', answer: 'I am a student studying in NU.' },
      { sentence: 'Gulliver\'s Travels (be) a famous book.', answer: 'Gulliver\'s Travels is a famous book.' },
      { sentence: 'The rich (to be) not always happy.', answer: 'The rich are not always happy.' },
      { sentence: 'The Arabian Nights (be) my favourite book.', answer: 'The Arabian Nights is my favourite book.' },
      { sentence: 'A pair of shoes (be) on the table.', answer: 'A pair of shoes is on the table.' },
      { sentence: 'The poor (be) born to suffer.', answer: 'The poor are born to suffer.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q17_1',
        question: 'The Arabian Nights (be) an interesting book.',
        bracketVerb: 'be',
        options: ['are', 'is', 'were', 'being'],
        correctAnswer: 'is',
        explanation: 'The Arabian Nights একটি বইয়ের নাম (Singular), তাই is।'
      },
      {
        id: 'rfv_q17_2',
        question: 'The virtuous (be) blessed.',
        bracketVerb: 'be',
        options: ['is', 'are', 'was', 'being'],
        correctAnswer: 'are',
        explanation: 'The + Adjective সমগ্র শ্রেণীকে বোঝায়, তাই are হবে।'
      }
    ]
  },
  {
    id: 'rfv_18',
    ruleNumber: 18,
    category: 'right_form_of_verbs',
    title: 'Now / At this moment (চলমান বর্তমান)',
    shortcutFormula: 'Now / At this moment থাকলে ➜ Present Continuous (am / is / are + V+ing)',
    noteBn: 'বর্তমানে কোনো ঘটনা ঘটছে বোঝালে Present Continuous Tense হয়।',
    examples: [
      { sentence: 'At this moment, he (come) to our meeting.', answer: 'At this moment, he is coming to our meeting.' },
      { sentence: 'Now, I (feel) good.', answer: 'Now, I am feeling good.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q18_1',
        question: 'Look! The baby (cry) now.',
        bracketVerb: 'cry',
        options: ['cries', 'is crying', 'cried', 'has cried'],
        correctAnswer: 'is crying',
        explanation: 'now ও Look! থাকায় Present Continuous (is crying) হবে।'
      }
    ]
  },
  {
    id: 'rfv_19',
    ruleNumber: 19,
    category: 'right_form_of_verbs',
    title: 'Last / Yesterday / Once / Ago (অতীত নির্দেশক)',
    shortcutFormula: 'Last, yesterday, once, previous, ago থাকলে ➜ Past Indefinite (V2)',
    noteBn: 'অতীতকালের সুনির্দিষ্ট সময় থাকলে বাক্যটি Passive না হলে সরাসরি Verb-এর Past Form (V2) বসে।',
    examples: [
      { sentence: 'He (come) home yesterday.', answer: 'He came home yesterday.' },
      { sentence: 'I (dream) a bad dream last night.', answer: 'I dreamt / dreamed a bad dream last night.' },
      { sentence: 'The hen (lay) an egg last night.', answer: 'The hen laid an egg last night.' },
      { sentence: 'He (die) last night.', answer: 'He died last night.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q19_1',
        question: 'The hen (lay) an egg yesterday.',
        bracketVerb: 'lay',
        options: ['lied', 'laid', 'lays', 'lain'],
        correctAnswer: 'laid',
        explanation: 'ডিম পাড়ার Past Form হলো laid (yesterday থাকায় V2)।'
      }
    ]
  },
  {
    id: 'rfv_20',
    ruleNumber: 20,
    category: 'right_form_of_verbs',
    title: 'Tomorrow / Next / Following (ভবিষ্যৎ নির্দেশক)',
    shortcutFormula: 'Tomorrow, next day/week, following থাকলে ➜ Future Indefinite (shall / will + V1)',
    noteBn: 'ভবিষ্যত কাজের পরিকল্পনায় shall বা will এর পর verb-এর base form (V1) বসে।',
    examples: [
      { sentence: 'He (come) tomorrow.', answer: 'He will come tomorrow.' },
      { sentence: 'The sun (rise) at 5 am tomorrow.', answer: 'The sun will rise at 5 am tomorrow.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q20_1',
        question: 'They (arrive) here tomorrow.',
        bracketVerb: 'arrive',
        options: ['arrived', 'will arrive', 'arrives', 'had arrived'],
        correctAnswer: 'will arrive',
        explanation: 'tomorrow থাকায় Future Indefinite (will arrive) হবে।'
      }
    ]
  },
  {
    id: 'rfv_21',
    ruleNumber: 21,
    category: 'right_form_of_verbs',
    title: 'Present Passive Voice',
    shortcutFormula: 'Present Tense-এ Passive বোঝালে ➜ am / is / are + V3',
    noteBn: 'Subject নিজে কাজ না করে অন্য কারো দ্বারা কৃত হলে Passive হয়।',
    examples: [
      { sentence: 'An honest man (respect) by all.', answer: 'An honest man is respected by all.' },
      { sentence: 'Fish (eat) raw in some countries.', answer: 'Fish is eaten raw in some countries.' },
      { sentence: 'English (speak) all over the world.', answer: 'English is spoken all over the world.' },
      { sentence: 'The rose (call) the queen of flowers.', answer: 'The rose is called the queen of flowers.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q21_1',
        question: 'English (speak) across the globe.',
        bracketVerb: 'speak',
        options: ['speaks', 'is spoken', 'spoken', 'was speaking'],
        correctAnswer: 'is spoken',
        explanation: 'ভাষা নিজে কথা বলে না, মানুষের দ্বারা কথিত হয় (Passive: is spoken)।'
      }
    ]
  },
  {
    id: 'rfv_22',
    ruleNumber: 22,
    category: 'right_form_of_verbs',
    title: 'Past Passive Voice',
    shortcutFormula: 'Past Tense-এ Passive বোঝালে ➜ was / were + V3',
    noteBn: 'অতীতের কোনো ঘটনায় কর্তা নিষ্ক্রিয় থাকলে was/were + V3 বসে। যেমন: ফাঁসি দেওয়া, শাস্তি পাওয়া, নির্মিত হওয়া।',
    examples: [
      { sentence: 'The man (hang) for murder.', answer: 'The man was hanged for murder.' },
      { sentence: 'The meeting (cancel) at the last moment.', answer: 'The meeting was cancelled at the last moment.' },
      { sentence: 'Last night students (tell) to vacate the hall.', answer: 'Last night students were told to vacate the hall.' },
      { sentence: 'The house (build) ten years ago.', answer: 'The house was built ten years ago.' },
      { sentence: 'You (punish) yesterday for your dishonesty.', answer: 'You were punished yesterday for your dishonesty.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q22_1',
        question: 'The building (construct) five years ago.',
        bracketVerb: 'construct',
        options: ['constructed', 'was constructed', 'had constructed', 'is constructed'],
        correctAnswer: 'was constructed',
        explanation: 'ago থাকায় Past এবং ভবন নিজে তৈরি হয় না (Passive: was constructed)।'
      }
    ]
  },
  {
    id: 'rfv_23',
    ruleNumber: 23,
    category: 'right_form_of_verbs',
    title: 'Modal Auxiliary / Had better / Would rather',
    shortcutFormula: 'can / could / may / might / shall / should / will / would / had better / would rather / dare not + V1 (Base form)',
    noteBn: 'মডাল অক্সিলিয়ারি এবং had better, would rather এর পর কোনো পরিবর্তন ছাড়াই Verb-এর প্রেজেন্ট বা বেস ফর্ম (V1) বসে।',
    examples: [
      { sentence: 'You had better (to speak) the truth.', answer: 'You had better speak the truth.' },
      { sentence: 'You had better (go) home.', answer: 'You had better go home.' },
      { sentence: 'The authoress dared not (to drive) at night.', answer: 'The authoress dared not drive at night.' },
      { sentence: 'You are not allowed to (leave) the school without permission.', answer: 'You are not allowed to leave the school without permission.' }
    ],
    practiceQuestions: [
      {
        id: 'rfv_q23_1',
        question: 'You had better (leave) the room now.',
        bracketVerb: 'leave',
        options: ['to leave', 'leaving', 'leave', 'left'],
        correctAnswer: 'leave',
        explanation: 'had better এর পর Bare infinitive V1 (leave) হয়।'
      }
    ]
  }
];
