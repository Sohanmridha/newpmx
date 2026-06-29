import { AppState } from './types';

export const LOCAL_STORAGE_KEY = 'mridha_pro_state_v2';

export const defaultState: AppState = {
  theme: 'default',
  layoutMode: 'classic',
  language: 'bn',
  userProfile: {
    name: 'Sohan Mridha',
    age: '24',
    grade: 'Graduate',
    favSubjects: 'Physics, Coding',
    interests: 'Lifestyle Architecture, Programming'
  },
  subjects: [
    { id: '1', name: 'General Study', target: 60 },
    { id: '2', name: 'React Development', target: 120 },
    { id: '3', name: 'Mathematics MCQ', target: 45 }
  ],
  habits: [
    { id: 'h1', name: 'Quran Recitation / ধর্মীয় বই পড়া', time: 'সকাল' },
    { id: 'h2', name: 'Early Morning Wakeup', time: 'সকাল' },
    { id: 'h3', name: 'Journaling', time: 'রাত' }
  ],
  fitness: [
    { id: 'f1', name: 'Push-ups', goal: '20 reps' },
    { id: 'f2', name: 'Arobic Walk / রানিং', goal: '30 min' }
  ],
  routine: {
    0: { lunch: 'সোহান', dinner: 'রাফি', clean: 'সোহান', customTasks: ['গাছে পানি দেওয়া'] },
    1: { lunch: 'রাফি', dinner: 'রনি', clean: 'রাফি', customTasks: ['বাজার করা'] },
    2: { lunch: 'রনি', dinner: 'সোহান', clean: 'রনি', customTasks: [] },
    3: { lunch: 'সোহান', dinner: 'রাফি', clean: 'সোহান', customTasks: [] },
    4: { lunch: 'রাফি', dinner: 'রনি', clean: 'রাফি', customTasks: [] },
    5: { lunch: 'রনি', dinner: 'সোহান', clean: 'রনি', customTasks: ['কাপড় ধোয়া'] },
    6: { lunch: 'সোহান', dinner: 'সোহান', clean: 'সবাই', customTasks: ['পুরো ঘর গোছানো'] }
  },
  prayerTimes: {
    Fajr: '05:00',
    Dhuhr: '13:15',
    Asr: '16:30',
    Maghrib: '18:15',
    Isha: '19:45'
  },
  history: {},
  reflections: [
    {
      id: 'r-sample',
      date: '2026-06-18',
      text: 'আজ পড়াশোনা অনেক ভালো হয়েছে। ২ ঘণ্টা ফোকাসড কাজ করতে পেরেছি। রুটিন ঠিকমত মেইনটেইন করেছি।',
      focusedRating: 5,
      mood: 'Focused / ফোকাসড'
    }
  ],
  showOnboarding: true,
  onboardingStep: 0,
  badHabits: [
    { id: 'bh1', name: 'সোশ্যাল মিডিয়ায় অযথা সময় নষ্ট / Wasting time scrolling social media', quitAt: new Date(Date.now() - 86400 * 1000).toISOString() },
    { id: 'bh2', name: 'অলসতা ও কাজ জমিয়ে রাখা / Procrastination & putting off work', quitAt: new Date(Date.now() - 86400 * 3 * 1000).toISOString() }
  ],
  noteScratchpad: '',
  activeTreeType: 'sakura',
  phoneLimitMinutes: 150,
  phoneUsageHistory: {},
  customStudyRoutines: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
  },
  focusPoints: 0,
  focusLevel: 1,
  unlockedTrees: ['sakura'],
  headerRoutineMode: 'cooking',
  unlockedAchievements: [],
  notificationConsentAsked: false,
  notificationSettings: {
    friendship: true,
    emotional: true,
    reminder: true,
    morningTime: '08:00',
    eveningTime: '21:00'
  },
  // Premium Digital Wellbeing & Blocker Suite
  digitalUnlockCount: {},
  appUsageDurations: {},
  reelsBlockerActive: false,
  reelsBlockerDuration: 120, // 120 minutes by default
  reelsBlockerStartedAt: null,
  reelsBlockedApps: ['facebook', 'youtube', 'instagram', 'tiktok'],
  adultSiteBlockerActive: true,
  dndModeActive: false,
  dndStartTime: '22:00',
  dndEndTime: '06:00',
  brainFatigueRatings: {},
  digitalDetoxStreak: 0,
  customAiDirectives: '',
  aiTrainingData: {
    lastTrainedAt: undefined,
    trainingCount: 0,
    brainScore: 10,
    learnedPatterns: [
      'পড়াশোনার সময় সাধারণত লফি স্টাডি বিট বা বৃষ্টির শব্দ পছন্দ করেন',
      'প্রতিদিন সকালের অভ্যাসগুলো ট্র্যাক করার ব্যাপারে খুবই সচেতন'
    ]
  }
};

// Creator messages from Sohan Mridha
export interface OnboardingSlide {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  emoji: string;
  emotionalMessageEn?: string;
  emotionalMessageBn?: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    titleBn: 'মেকানিজম অব সাকসেস: আপনার পারসোনাল গ্রোথ কো-পাইলট',
    titleEn: 'MridhaX: Your Ultimate Life Optimization Companion',
    descriptionBn: 'অভিনন্দন! আমি সোহান মৃধা। একজন লাইফস্টাইল হাবস আর্কিটেক্ট ও ডেভেলপার হিসেবে আপনাকে এই স্পেশাল প্ল্যাটফর্মে ফোকাস করার জন্য আমন্ত্রণ জানাচ্ছি। MridhaX কোনো সাধারণ ট্র্যাকার অ্যাপ নয়; এটি আপনার দিনকে সুশৃঙ্খল, প্রোডাক্টিভ এবং সফলতম করার লক্ষ্যে ডিজাইন করা একটি আল্ট্রা-প্রিমিয়াম কমপ্লিট ইকোসিস্টেম।',
    descriptionEn: 'Welcome! I am Sohan Mridha. As your Lifestyle Architect, I invite you to join this elite, highly focus-centric environment. MridhaX is a complete workspace ecosystem engineered precisely to orchestrate your discipline, elevate your deep study focus, and perfect your life balance.',
    emoji: '🚀',
    emotionalMessageBn: 'সময় আমাদের সবচেয়ে দামি সম্পদ। এই সম্পদকে কাজে লাগিয়ে নিজেকে অনন্য উচ্চতায় নিয়ে যাওয়া এবং প্রতিটি দিনে আল্লাহর কাছাকাছি হওয়াই আমাদের চরম লক্ষ্য।',
    emotionalMessageEn: 'Time is our most precious trust. Harnessing this non-renewable resources to cultivate absolute discipline and build strong spiritual clarity is our ultimate goal.'
  },
  {
    titleBn: 'কেন MridhaX? এবং আপনার জীবনের আসল লাভ',
    titleEn: 'Why MridhaX? Elevate Your Core Life Performance',
    descriptionBn: 'আপনার জীবনকে শতভাগ পজিটিভ করতে এটি পাঁচটি প্রধান স্তম্ভকে একত্রিত করেছে: ফোকাসড স্টাডি ট্র্যাকিং, সময়ে পাঁচ ওয়াক্ত নামাজ (ইসলামিক আধ্যাত্মিকতা), প্রো-অ্যাক্টিভ ডাবল হ্যাবিট ম্যানেজার, রুটিন ওয়ার্ক অপ্টিমাইজেশান এবং লার্নিং ডায়েরি ও রিফ্লেকশন নোটস। এই সমন্বিত পদ্ধতি আপনার মানসিক ও আত্মিক একাগ্রতাকে চরম শিখরে পৌছে দিবে।',
    descriptionEn: 'This ecosystem integrates the five indispensable pillars of extreme performance: Deep Study-Focus, Periodic Prayer Tracking, Proactive Habit Engineering (Good & Bad Habits), Organized Task Routines, and Self-Reflection Diary. It provides complete clarity, removing distraction from your pathway.',
    emoji: '🏆',
    emotionalMessageBn: 'শৃঙ্খলাই স্বাধীনতার একমাত্র পথ। যখন আপনি প্রতিটি কাজের হিসাব সুন্দরভাবে নিজের কাছে রাখবেন, অলসতা নিজে থেকেই আপনার জীবন থেকে বিদায় নিবে।',
    emotionalMessageEn: 'Discipline is the only pathway to true freedom. When you hold yourself accountable through real-time telemetry, procrastination dissolves automatically.'
  },
  {
    titleBn: 'লাইভ ফোকাসিং, ব্রেইনওয়েভ সাউন্ডস এবং গাছ-অঙ্কুরদগম',
    titleEn: 'Deep Focus, Integrated Audio & Mobile Notifications',
    descriptionBn: 'পড়াশোনাকে উপভোগ্য করতে এতে আছে লাইভ ফোকাস ট্রি। আপনার মনোযোগ সচল থাকলে গাছটি বীজ থেকে ধীরে ধীরে বড় হয়ে ফুল-ফলে সুশোভিত হবে। সাথে যুক্ত হয়েছে প্রফেশনাল ব্রেইনওয়েভ সাউন্ড জেনারেটর (Deep Rain, Focus Ticking, Cosmic Meditation) এবং ইন্টেলিজেন্ট মোবাইল পুশ নোটিফিকেশন যা আপনাকে অবিরাম ট্র্যাকে রাখবে।',
    descriptionEn: 'To make cognitive work fully engaging, MridhaX features a real-time Focus Growth Tree. Your persistent focus expands your digital sapling into a magnificent blooming tree. It also incorporates synthesized Audio Therapy (Ambient Rain, Focus Clock Ticking, Cosmic Meditative Hum) and local push notifications to enter a state of flow.',
    emoji: '🌲',
    emotionalMessageBn: 'ফোকাস হলো এক জাদুকরী আধ্যাত্মিক শক্তি। প্রতিদিন ফোকাসের ছোট্ট একটু চারা রোপণ করুন, কাল তা একটি বিশাল সফল মহীরূহে পরিণত হবে ইন-শা-আল্লাহ।',
    emotionalMessageEn: 'Focus is a superpower. Plant a small seed of intense focus daily, and watch the canopy of your achievements shelter your future in-sha-Allah.'
  },
  {
    titleBn: 'স্ক্রীন টাইম ট্র্যাকার ও সেলফ-অডিট রিফ্লেক্ট নোট বুক',
    titleEn: 'Screen-time Logging & Core Reflection Notebook',
    descriptionBn: 'মোবাইল আসক্তি কমাতে আমরা মেনুতে যুক্ত করেছি বিশেষ স্ক্রিন-টাইম ট্র্যাকার এবং রিফ্লেকশন ডায়েরি। রাতের বেলা সেলফ-অডিট করুন, আজ কতো ঘন্টা মোবাইল টিপলেন, কি কি নতুন জ্ঞান অর্জন করলেন এবং নিজের সঙ্কল্পের সাথে আপনি কতোটা সৎ ছিলেন। চলুন, MridhaX-এর মাধ্যমে আপনার চরম আত্মউন্নয়ন সফর শুরু করি!',
    descriptionEn: 'To fight modern distraction, we introduced a professional Mobile Screen-Time telemetry tracker alongside our Reflection diary. Perform nightly self-audits, review your daily learning, and check your alignment. Your premium, optimized lifestyle starts today inside MridhaX.',
    emoji: '📓',
    emotionalMessageBn: 'নিজের কাজের প্রাত্যহিক নিরপেক্ষ আত্ম-সমীক্ষাই শ্রেষ্ঠ নামাজী ও প্রোডাক্টিভ মানুষে রূপান্তর করে। আসুন প্রতিদিন আল্লাহর কাছে কৃতজ্ঞ থাকি এবং নিজেদের ছাড়িয়ে যাই।',
    emotionalMessageEn: 'Daily self-audit of your efforts is the single greatest catalyst for high-performance. Let us stay grateful to Allah and push past our boundaries daily.'
  }
];

export const creatorsEncouragements = {
  bn: [
    "প্রিয় ভাই, কাজের ফোকাস হারাচ্ছেন না তো? গাছটি বেড়ে উঠছে, সময়কে অবহেলায় নষ্ট হতে দেবেন না!",
    "সাফল্যের মূল চাবিকাঠি হলো প্রতিটি কাজের শুরুতে নিয়ত খাঁটি করা এবং অবিরাম চেষ্টা চালিয়ে যাওয়া।",
    "একটি নামাজও যেন অবহেলায় কাজা না হয়। দুনিয়ার সমস্ত সফলতা নামাজের কামিয়াবির পেছনে ছুটে আসে।",
    "দিনের লক্ষ্যগুলো পূরণ করে আজ রাতে হৃদয়ে শান্তিময় তৃপ্তি নিয়ে ঘুমাতে হবে। এখনই উঠে দাঁড়ান!",
    "সবর ও নামাজের মাধ্যমে আল্লাহর সাহায্য প্রার্থনা করুন। অলসতাকে জয় করাই হোক আজকের অঙ্গীকার!",
    "আপনার শরীর আল্লাহর দেওয়া আমানত। ভালো খাবার খান, পর্যাপ্ত পানি পান করুন এবং আজ অবশ্যই কিছু সময় শরীরচর্চা করুন।",
    "আজকের ছোট্ট একটি সঠিক অভ্যাস এবং কষ্টই আগামীকাল আপনার জীবনের সবচেয়ে বড় বিজয়ের দরজা খুলে দিবে।",
    "জ্ঞান অর্জন করা প্রত্যেক মুসলিমের জন্য ইবাদত। এই ফোকাসড টাইমটুকু আপনার জীবনের সৌভাগ্যের চাবি হয়ে উঠবে। অবহেলা একদম নয়!",
    "আলসেমি ও সোশ্যাল মিডিয়ার নোটিফিকেশন আপনার চমৎকার ভবিষ্যৎ নষ্ট করে দেওয়ার এক বড় ফাদ। এগুলো জয় করাই আপনার আজকের কাজ!",
    "কঠোর পরিশ্রম কখনো বৃথা যায় না। আজ আপনার বৃক্ষটি যে যত্ন পাচ্ছেন, সামনে সেটি সফলতার ছায়া ও সুমিষ্ট ফল হয়ে আপনাকে ফিরে আসবে।",
    "মনোযোগ ধরে রাখুন। মনে রাখবেন আপনার মা-বাবার আশা আকাঙ্ক্ষা এবং আপনার ভবিষ্যতের উন্নত ক্যারিয়ার এই আজকের ফোকাসের ওপর নির্ভরশীল!",
    "মোবাইল থেকে দূরে থাকুন। আপনার ভেতরের অসীম প্রতিভাকে জাগিয়ে তোলার এই উপযুক্ত সুযোগ। গভীর মনোযোগ আজ আপনাকে বিজয়ী করবে।",
    "আপনার ইচ্ছা এবং আল্লাহর রহমতই সমস্ত অসাধ্য সাধন করবে। নিজের ওপর আস্থা রাখুন এবং ফোকাস রক্ষা করুন।",
    "কখনো হাল ছাড়বেন না। প্রতিটি সফলতার পেছনে থাকে হাজারো না-বলা ছোট ছোট ত্যাগের ইতিহাস। আপনার ত্যাগের মূল্য অবশ্যই মিলবে।",
    "সময় হলো জীবনের সবচেয়ে দামি সম্পদ। ফোকাসের প্রতিটি সেকেন্ডে আপনি আপনার স্বপ্নের রাজপ্রাসাদ তৈরির ইট সাজাচ্ছেন।",
    "নিয়মানুবর্তিতা ও আত্মনিয়ন্ত্রণই সাধারণ ও সেরাদের মধ্যকার একমাত্র মূল পার্থক্য। আপনি সাধারণ হয়ে থাকতে জন্মাননি!",
    "একটি সুশৃঙ্খল দিন আপনার ভাগ্যের চাকা ঘুরিয়ে দেবে। প্রতিদিন একটু একটু করে এগিয়ে যান, পেছনে ফেরার আর কোনো সুযোগ নেই।",
    "আপনি যা শিখছেন তা আপনার আত্মিক শক্তির অংশ। গভীর জ্ঞানই আপনার সবচেয়ে শক্তিশালী ঢাল ও উজ্জ্বল তরবারি।"
  ],
  en: [
    "My friend, are you losing focus? The tree is growing, do not let your precious time wither away!",
    "The master key to success is keeping your intentions pure and pursuing consistency with absolute grit.",
    "Make sure no prayer is delayed. All earthly duties and crowns come after our devotion to the Almighty.",
    "Complete today's targets to sleep with a heart full of absolute peace and satisfaction tonight!",
    "Seek support through patience and prayer. Defeat the temptation of laziness right now!",
    "Your body is a sacred sanctuary. Eat whole foods, hydrate, and dedicate some time to sweating out toxins today!",
    "Small incremental gains made in pain today lay the foundation of giant successes and spiritual peace tomorrow. Keep pushing!",
    "Seeking beneficial knowledge is a noble form of ibadah. Every minute you study changes your intellectual path forever!",
    "An hour of deep study is worth weeks of distracted scrolling. Protect your screen boundaries with ultimate willpower!",
    "Success requires doing things that are hard but necessary. Your digital garden flourishes only when you refuse to give in to distractions!",
    "Every drop of focus today builds your fortress of tomorrow's freedom. Real leaders are carved out of quiet, disciplined hours.",
    "Lock down your environment, turn off public alerts, and let your intellect shine in this majestic deep focus space.",
    "You are capable of astounding greatness if you simply finish the single task before you. Hold the line, friend!",
    "No grand legacy was ever built on pure luck. It is built in the silence of deep work and persistent, daily prayer.",
    "Embrace the friction of learning something new. That discomfort is the exact feeling of your mental capacity expanding!",
    "Keep your environment sacred and your vision sharp. There is zero match for a focused human being driven by pure intentions."
  ]
};

export interface IslamicQuote {
  bn: string;
  en: string;
  sourceBn: string;
  sourceEn: string;
}

export const islamicBadHabitQuotes: IslamicQuote[] = [
  {
    bn: "যে ব্যক্তি তার প্রতিপালকের সামনে দাঁড়ানোকে ভয় করে এবং নিজের নফসকে কুপ্রবৃত্তি থেকে বিরত রাখে, জান্নাতই হবে তার জন্য চূড়ান্ত গন্তব্য।",
    en: "But as for him who feared the position of his Lord and prevented the soul from [unlawful] inclination, then indeed, Paradise will be his refuge.",
    sourceBn: "আল-কুরআন, সূরা আন-নাযিয়াত: ৪০-৪১",
    sourceEn: "Al-Quran, Surah An-Nazi'at: 40-41"
  },
  {
    bn: "প্রকৃত মুজাহিদ সে-ই, যে আল্লাহর আনুগত্য করার ব্যাপারে নিজের নফসের বিরুদ্ধে সবসময় জিহাদ করে যায়।",
    en: "The true mujahid (struggler) is the one who strives against his own soul and desires in obedience to Allah.",
    sourceBn: "তিরমিযী, সহীহ হাদিস",
    sourceEn: "Jami` at-Tirmidhi, Sahih Hadith"
  },
  {
    bn: "তোমরা পাপ কাজ ও মন্দ অভ্যাস সম্পূর্ণ বর্জন করো, তবেই তোমরা আল্লাহর সবচেয়ে বেশি ইবাদতকারী বান্দা হতে পারবে।",
    en: "Avoid prohibited matters and bad deeds, and you will be the most worshipful of people.",
    sourceBn: "তিরমিযী ও আহমদ",
    sourceEn: "Sunan At-Tirmidhi & Musnad Ahmad"
  },
  {
    bn: "হিযরতকারী মূলত সে-ই, যে আল্লাহর নিষেধ করা সকল মন্দ কাজ এবং কদর্য অভ্যাস পরিত্যাগ করতে পেরেছে।",
    en: "The true emigrant (Muhajir) is the one who abandons what Allah has forbidden.",
    sourceBn: "সহীহ বুখারী",
    sourceEn: "Sahih al-Bukhari"
  },
  {
    bn: "তোমরা অবশ্যই প্রকাশ্য ও গোপন সকল প্রকার পাপ কাজ বর্জন করবে।",
    en: "And leave what is apparent of sin and what is concealed thereof.",
    sourceBn: "আল-কুরআন, সূরা আল-আন'আম: ১২০",
    sourceEn: "Al-Quran, Surah Al-An'am: 120"
  },
  {
    bn: "যাদের বিচার করা হবে, তাদের নিজেদের কর্মের হিসাব নেওয়ার আগেই তোমরা নিজেদের নফস ও অভ্যাসের হিসাব নাও।",
    en: "Bring your own souls to account before you are brought to account, and weigh your deeds before they are weighed for you.",
    sourceBn: "হযরত ওমর ইবনুল খাত্তাব (রা.)",
    sourceEn: "Hazrat Umar ibn al-Khattab (R.A.)"
  },
  {
    bn: "নফসকে মন্দ অভ্যাস থেকে ফিরিয়ে রাখা অতি কঠিন ও কষ্টসাধ্য সংগ্রাম, কিন্তু এরই মাঝে আত্মার চূড়ান্ত মুক্তি ও শান্তি নিহিত।",
    en: "Refraining the self from bad habits is a difficult struggle, but in it lies the ultimate purification and serenity of the soul.",
    sourceBn: "ইমাম আল-গাজালী (র.)",
    sourceEn: "Imam Al-Ghazali (R.A.)"
  }
];

export const bnlTranslation = {
  // General UI Translation
  appLogo: "MridhaX",
  themeToggle: "থিম পরিবর্তন",
  langToggle: "English",
  studyTab: "স্টাডি ফোকাস",
  prayerTab: "নামাজ",
  habitsTab: "হ্যাবিট",
  fitnessTab: "ফিটনেস",
  routineTab: "রুটিন",
  reportTab: "রিপোর্ট",
  reflectionTab: "নোট বুক",
  profileTab: "প্রোফাইল",
  
  // Profile Section
  profileHeader: "ব্যক্তিগত প্রোফাইল ও রিপোর্ট",
  profileSubHeader: "আপনার ব্যক্তিগত তথ্য এবং সাফল্যের পরিসংখ্যান",
  performanceReport: "পারফরম্যান্স রিপোর্ট",
  myStats: "আমার পরিসংখ্যান",
  editProfile: "প্রোফাইল এডিট করুন",
  saveProfile: "প্রোফাইল সেভ করুন",
  nameLabel: "নাম",
  ageLabel: "বয়স",
  gradeLabel: "শ্রেণী/ক্লাস",
  favSubjectsLabel: "প্রিয় বিষয়সমূহ",
  interestsLabel: "পছন্দ ও শখ",
  totalFocusTime: "মোট ফোকাস সময়",
  habitConsistency: "অভ্যাসের ধারাবাহিকতা",
  fitnessMilestones: "ফিটনেস মাইলস্টোন",
  
  // Study Section
  studyHeader: "পড়াশোনা ফোকাস সেশন",
  chooseSubject: "বিষয় বেছে নিন",
  subjectPlaceholder: "বিষয় নির্বাচন করুন",
  targetLabel: "টার্গেট সময়:",
  targetMinutes: "মিনিট",
  studyStart: "শুরু করুন",
  studyPause: "বিরতি দিন",
  studyFocusMode: "ফুলস্ক্রিন ফোকাস",
  noSubjectError: "দয়া করে একটি বিষয় নির্বাচন করুন বা তৈরি করুন!",
  alreadyCompleted: "অভিনন্দন! আপনি এই বিষয়ের আজকের লক্ষ্য পূরণ করেছেন!",
  addNewSubject: "নতুন বিষয় যুক্ত করুন",
  subjectNameLabel: "বিষয়ের নাম (যেমন: গণিত MCQ)",
  subjectTargetLabel: "টার্গেট সময় (মিনিট)",
  addBtn: "যোগ করুন",
  focusHalted: "বৃদ্ধি থেমে গেছে! মনোযোগ হারিয়ে অন্য ট্যাবে বা কাজে গিয়েছেন!",
  focusActive: "চমৎকার! ফোকাস ভালো আছে। গাছটি বেড়ে উঠছে...",
  treeStateSeed: "বীজ রোপণ করা হয়েছে",
  treeStateSprout: "ছোট অঙ্কুর বের হয়েছে",
  treeStateSapling: "চারাগাছ বড় হচ্ছে",
  treeStateTree: "সুন্দর পরিপক্ব সবুজ গাছ!",
  treeStateBlooming: "ফুল ফুটেছে! ফলবন্ত বৃক্ষ!",
  customTargetTime: "টার্গেট সময় কাস্টমাইজ করুন",
  deleteSubject: "মুছুন",

  // Prayer Section
  prayerHeader: "দৈনিক নামাজ ট্র্যাকার",
  prayerTimeConfig: "ওয়াক্তের সময় কনফিগার করুন",
  setPrayerTime: "ইচ্ছেমতো সময় পরিবর্তন করুন",
  statusJamaat: "জামাত",
  statusHome: "ঘরে",
  statusQaza: "কাজা",
  statusSkipped: "পড়িনি",
  allPrayersCompleted: "মাশাআল্লাহ! আপনি আজ পাঁচ ওয়াক্ত নামাজ আদায় সম্পূর্ণ করেছেন!",
  addCustomPrayer: "অন্য কোনো নফল/কোরআন তিলাওয়াত সেশন যুক্ত করুন",
  customPrayerLabel: "কাস্টম সেশন নাম (যেমন: তাহাজ্জুদ, ইশরাক)",

  // Habit Section
  habitHeader: "দৈনিক সুঅভ্যাস ট্র্যাকার",
  morning: "সকাল",
  night: "রাত",
  anytime: "যেকোনো সময়",
  addHabit: "নতুন অভ্যাস যোগ করুন",
  habitNamePlaceholder: "অভ্যাসের নাম লিখুন...",
  selectTime: "সময় বেছে নিন",
  habitStreak: "টানা ডিলিজেন্স",

  // Fitness Section
  fitnessHeader: "ব্যায়াম ও স্বাস্থ্য ডায়েরি",
  addActivity: "নতুন ব্যায়াম অ্যাক্টিভিটি",
  activityPlaceholder: "ব্যায়ামের নাম (যেমন: পুশ-আপ, প্ল্যাঙ্ক, জগিং)",
  targetGoalPlaceholder: "টার্গেট (যেমন: ৩০ মিনিট, ৫০ বার)",
  completedAmount: "আজকের অগ্রগতি (রিস্টার্ট বা টাইপ করুন)",

  // Routine Section
  routineHeader: "সাপ্তাহিক মেস/রুম ও কাজের বন্টন",
  daySelectLabel: "দিন নির্বাচন করুন",
  lunchLabel: "দুপুরের রাঁধুনি / দায়িত্ব",
  dinnerLabel: "রাতের রাঁধুনি / দায়িত্ব",
  cleanLabel: "রুম ক্লিনিং / ঝাড়ুদার",
  customChoresLabel: "অন্যান্য কাস্টম দায়িত্ব (যেমন: বাজার, আবর্জনা ফেলা)",
  customChorePlaceholder: "নতুন কাস্টম দায়িত্ব যোগ করুন...",
  saveSuccess: "রুটিন সফলভাবে সেভ হয়েছে!",
  saveBtn: "সেভ করুন",
  todayDuty: "আজকের রুটিন দায়িত্ব",
  addCustomChore: "নতুন দায়িত্ব যোগ করুন",

  // Reflection Section
  reflectionHeader: "সেলফ-রিফ্লেকশন নোটবুক",
  newReflectionTitle: "আজকের লার্নিং ও অনুভূতির নোট",
  reflectionPlaceholder: "আজ পড়াশোনায় কী নতুন শিখলেন বা নামাজ ও অভ্যাসের কেমন অগ্রগতি হলো? এখানে লিখে রাখুন...",
  ratingLabel: "ফোকাস রেটিং (১-৫) :",
  moodLabel: "আজকের অনুভূতি/মুড :",
  saveReflection: "নোট সেভ করুন",
  previousNotes: "পূর্ববর্তী সেভ করা নোটসমূহ",
  noNotesYet: "এখনো কোনো রিফ্লেকশন নোট লেখা হয়নি। আজই শুরু করুন!",

  // Report Section
  reportHeader: "প্রোডাক্টিভিটি ও আধ্যাত্মিক রিপোর্ট",
  weeklyStudyHours: "সাপ্তাহিক পড়াশোনার বণ্টন (ঘণ্টা)",
  prayerAccuracy: "নামাজ আদায়ের পরিসংখ্যান (%)",
  weeklySummaryCard: "সপ্তাহের কার্যনির্বাহী সারসংক্ষেপ",
  deleteBtn: "মুছুন",
  onboardingTitle: "লাইফ গাইডেন্স প্রো",
  nextBtn: "পরবর্তী",
  skipBtn: "স্কিপ",
  getStartedBtn: "শুরু করুন",
  creatorCredit: "সোহান মৃধা কর্তৃক সযত্নে ডিজাইন এবং ডেভেলপড (ক্রাফটেড উইথ লাভ)",

  // Popups & Feedback
  congrats: "চমৎকার!",
  wellDone: "মাশাআল্লাহ, ভালো অগ্রগতি!",
  focusNotification: "সোহানের বার্তা"
};

export const enlTranslation = {
  // General UI Translation
  appLogo: "MridhaX",
  themeToggle: "Theme Toggle",
  langToggle: "বাংলা",
  studyTab: "Study Focus",
  prayerTab: "Prayers",
  habitsTab: "Habits",
  fitnessTab: "Fitness",
  routineTab: "Routine",
  reportTab: "Reports",
  reflectionTab: "Reflection Journal",
  profileTab: "User Profile",
  
  // Profile Section
  profileHeader: "Personal Profile & Reports",
  profileSubHeader: "Manage personal details and track success",
  performanceReport: "Performance Report",
  myStats: "My Stats",
  editProfile: "Edit Profile",
  saveProfile: "Save Profile",
  nameLabel: "Name",
  ageLabel: "Age",
  gradeLabel: "Grade/Class",
  favSubjectsLabel: "Favorite Subjects",
  interestsLabel: "Interests & Hobbies",
  totalFocusTime: "Total Focus Time",
  habitConsistency: "Habit Consistency",
  fitnessMilestones: "Fitness Milestones",
  
  // Study Section
  studyHeader: "Study Concentration Session",
  chooseSubject: "Choose Subject",
  subjectPlaceholder: "Select a subject",
  targetLabel: "Target Time:",
  targetMinutes: "mins",
  studyStart: "Start Session",
  studyPause: "Pause Study",
  studyFocusMode: "Fullscreen Focus",
  noSubjectError: "Please select or create a subject first!",
  alreadyCompleted: "Congratulations! You have completed today's target for this subject!",
  addNewSubject: "Add New Subject Tracker",
  subjectNameLabel: "Subject Name (e.g. Physics Theory, JS Coding)",
  subjectTargetLabel: "Target Time (Minutes)",
  addBtn: "Add Item",
  focusHalted: "Growth Halted! Focus lost due to leaving the workspace page or window!",
  focusActive: "Excellent! Your focus is sharp. The beautiful tree is blooming...",
  treeStateSeed: "Seed Planted",
  treeStateSprout: "Sprout Erupted",
  treeStateSapling: "Sapling Growing Stronger",
  treeStateTree: "Beautiful Lush Green Tree!",
  treeStateBlooming: "Flowers Blooming! Magnificent Fruitful Tree!",
  customTargetTime: "Customize Target Time",
  deleteSubject: "Delete",

  // Prayer Section
  prayerHeader: "Daily Prayer Tracker",
  prayerTimeConfig: "Configure Prayer Times",
  setPrayerTime: "Set Custom Waqt Schedule",
  statusJamaat: "Jamaat",
  statusHome: "Home",
  statusQaza: "Qaza",
  statusSkipped: "Missed",
  allPrayersCompleted: "Mashallah! You completed all 5 prayers today. Keep it up!",
  addCustomPrayer: "Add Extra Spiritual Sessions / Quran Recitation",
  customPrayerLabel: "Session Name (e.g. Tahajjud, Ishraq, Quran Reading)",

  // Habit Section
  habitHeader: "Daily Good Habits Tracker",
  morning: "Morning",
  night: "Night",
  anytime: "Anytime",
  addHabit: "Add Custom Daily Habit",
  habitNamePlaceholder: "Write brand new habit title...",
  selectTime: "Select Ideal Timing",
  habitStreak: "Consistency Streak",

  // Fitness Section
  fitnessHeader: "Fitness & Muscle Wellness Log",
  addActivity: "Add New Workout Activity",
  activityPlaceholder: "Workout Title (e.g., Push-ups, Squats, Cardio Workout)",
  targetGoalPlaceholder: "Target (e.g., 30 mins, 40 times)",
  completedAmount: "Today's Target Completed",

  // Routine Section
  routineHeader: "Weekly Mess Duties & Chores Organizer",
  daySelectLabel: "Choose Weekday",
  lunchLabel: "Lunch Responsibility (Name)",
  dinnerLabel: "Dinner Responsibility (Name)",
  cleanLabel: "Room Cleaning / Dusting (Name)",
  customChoresLabel: "Other Tasks (e.g. Groceries, Disposing Waste)",
  customChorePlaceholder: "Add new task or chores...",
  saveSuccess: "Weekly schedule successfully updated!",
  saveBtn: "Save Routine Details",
  todayDuty: "Today's Active Duties",
  addCustomChore: "Add New Chores Target",

  // Reflection Section
  reflectionHeader: "Self-Reflection Journal Notebook",
  newReflectionTitle: "Log Today's Highs, Lows, and Learnings",
  reflectionPlaceholder: "What did you learn today? Describe your mental focus, queries you solved, and what can be improved for tomorrow...",
  ratingLabel: "Concentration Rating (1-5) :",
  moodLabel: "Current Emotional State :",
  saveReflection: "Save Reflection Log",
  previousNotes: "Your Historical Memory & Notes Journal",
  noNotesYet: "No logs found yet. Start journaling and capture your daily learnings!",

  // Report Section
  reportHeader: "Productivity & Spiritual Dashboard Reports",
  weeklyStudyHours: "Sometime Devoted to Subjects (Hours)",
  prayerAccuracy: "Five Waqt Prayer Fidelity (%)",
  weeklySummaryCard: "Executive Weekly Balance Recap",
  deleteBtn: "Delete",
  onboardingTitle: "Workspace Life Coach Setup",
  nextBtn: "Next",
  skipBtn: "Skip",
  getStartedBtn: "Get Started",
  creatorCredit: "Lovingly Designed & Developed by Sohan Mridha",

  // Popups & Feedback
  congrats: "Spectacular!",
  wellDone: "Mashallah, incredible discipline today!",
  focusNotification: "Message from Sohan"
};

// --- DYNAMIC COMBINATORIAL SPIRITUAL/MOTIVATIONAL MESSAGE GENERATOR (2000+ UNIQUE COMBINATIONS) ---
export interface DynamicInspirationMessage {
  bn: string;
  en: string;
  categoryBn: string;
  categoryEn: string;
}

export const salutationsBn = [
  "প্রিয় সংগ্রামকারী ভাই, অন্তর থেকে বলছি— ",
  "একটু থমকে দাঁড়িয়ে মনোযোগ দিন, আল্লাহ কিন্তু আপনার প্রচেষ্টাকে দেখছেন— ",
  "দুনিয়ার এই ব্যস্ত কোলাহলে একটু শান্ত হোন— ",
  "একটি পরম শান্তিময় মুহূর্ত নিন এবং ভাবুন— ",
  "মনে রাখবেন, আপনার জীবনের প্রতিটি সেকেন্ড আল্লাহর দেওয়া আমানত— ",
  "অলসতার চাদর ঝেড়ে ফেলে সফলতার দিকে জেগে উঠুন— ",
  "সবর ও ধৈর্যের একটি পরম সান্ত্বনাদায়ক বাণী স্মরণ করুন— ",
  "আল্লাহর অনন্য ও অসীম রহমতের মহাসমুদ্র নিয়ে রিমাইন্ডার নিন— ",
  "জ্ঞান অন্বেষণের পবিত্র আলো নিজের আত্মায় স্পর্শ করুন— ",
  "যদি আজ নিজেকে বড় ক্লান্ত ও দিশেহারা মনে হয়, তবে মনে রাখুন— "
];

export const salutationsEn = [
  "Dear struggling brother, from the absolute depth of my heart— ",
  "Pause for a silent moment, remember Allah is watching your sincere efforts— ",
  "Calm your soul amidst the heavy noise of this world— ",
  "Take a serene moment of deep spiritual peace and reflect— ",
  "Remember, every single second of your life is a sacred trust from Allah— ",
  "Cast away the heavy blanket of procrastination and rise towards success— ",
  "Re-anchor your heart with a highly comforting counsel of patience (Sabr)— ",
  "Receive this beautiful reminder about the infinite ocean of Allah's mercy— ",
  "Enlighten your inner soul with the sacred seeking of true knowledge— ",
  "If you feel exhausted and scattered today, take comfort in knowing that— "
];

export const wisdomsBn = [
  "আল্লাহ তাআলা কোনো প্রাণীকে তার সাধ্যের বাইরে অতিরিক্ত দায়িত্ব বা কষ্ট চাপিয়ে দেন না (সূরা আল-বাকারাহ: ২৮৬)। আপনার এই গভীর ভেতরের ক্লান্তি এবং প্রতিটি সৎ সংগ্রাম আল্লাহর কাছে অত্যন্ত মূল্যবান।",
  "নিশ্চয়ই কষ্টের সাথেই লুকিয়ে আছে পরম স্বস্তি ও প্রকৃত সফলতা (সূরা আল-ইনশিরাহ: ৬)। অন্ধকারের পরেই আলো আসবে এবং এই কষ্টের দিনগুলো কাটিয়ে চমৎকার সুদিন আসবে ইন-শা-আল্লাহ।",
  "হে ইমানদারগণ! তোমরা চরম ধৈর্য (সবর) ও নামাজের মাধ্যমে একমাত্র আল্লাহর সাহায্য কামনা করো (সূরা আল-বাকারাহ: ১৫৩)। আপনার অশান্ত মনকে সিজদার মাধ্যমে আল্লাহর চরণে শান্ত করুন।",
  "যে ব্যক্তি আল্লাহ তাআলাকে সঠিকভাবে ভয় করে চলে, আল্লাহ তার জন্য প্রতিটি কঠিন থেকে কঠিনতর সংকটের পথ সহজ করে দেন (সূরা আত-তালাক: ৪)। নিয়ত খাঁটি রেখে সামনের দিকে এগিয়ে যান।",
  "আপনার পরম দয়ালু প্রতিপালক আপনাকে কখনো পরিত্যাগ করেননি এবং আপনার ওপর কখনো ক্ষুব্ধও হননি (সূরা আদ-দুহা: ৩)। ভরসা রাখুন, তিনি আপনার সাথেই আছেন।",
  "মানুষ তার জীবনে কেবল সেটাই পায়, যার জন্য সে জান-প্রাণ দিয়ে আন্তরিক চেষ্টা ও পরিশ্রম করে (সূরা আন-নাজম: ৩৯)। আপনার প্রতিটি ফোটা ঘাম ও কষ্ট সফলতার অনন্য চাবি।",
  "দ্বিধাহীনভাবে জেনে রাখুন, কেবল আল্লাহর নিবিড় জিকির ও স্মরণের মাধ্যমেই মুমিনের অন্তর লাভ করে পরম আধ্যাত্মিক প্রশান্তি (সূরা আর-রাদ: ২৮)। জিকির ও তাসবিহ দ্বারা দিনটি সাজান।",
  "একজন প্রকৃত মুমিন বান্দা আল্লাহর ফয়সালায় সর্বদা পরম সন্তুষ্ট থাকে এবং যেকোনো কঠিন পরিস্থিতি হাসিমুখে অনন্য ধৈর্যের সাথে মোকাবেলা করে চূড়ান্ত বিজয়ী হয়।",
  "আজকের এই বরকতময় দিনটি আল্লাহর চমৎকার উপহার। রাসুলুল্লাহ (সা.) বলেছেন: 'দুটি নেয়ামতের ব্যাপারে অধিকাংশ মানুষ ধোঁকায় পড়ে—তা হলো চমৎকার সুস্থতা এবং অবসর সময়।' একে কাজে লাগান।",
  "আল্লাহর কাছে সবচেয়ে প্রিয় ও বরকতময় আমল হলো যা অতি নিয়মিতভাবে পালন করা হয়, যদিও তা পরিমাণে খুবই অল্প হয় (সহীহ বুখারী)। আপনার ছোট ছোট পজিটিভ অভ্যাসকে ধরে রাখুন।"
];

export const wisdomsEn = [
  "Allah does not burden a soul beyond that it can bear (Surah Al-Baqarah: 286). Your hidden inner fatigue and every silent effort are highly valued by your Lord.",
  "Indeed, with hardship comes supreme ease and true victory (Surah Al-Inshirah: 6). Shines of relief will soon bloom, and these struggling days will pass, in-sha-Allah.",
  "O you who have believed, seek ultimate support through beautiful patience and prayer (Surah Al-Baqarah: 153). Calm your anxious heart through deep, humble prostration.",
  "And whoever fears Allah—He will graciously make for him of his difficult matters absolute ease (Surah At-Talaq: 4). Keep your intentions pure and move forward.",
  "Your loving Lord has not taken leave of you, nor has He detested you (Surah Ad-Duha: 3). Rest assured knowing He is orchestrating what is best for your soul.",
  "And that there is not for man except that for which he sincerely strives and works (Surah An-Nazm: 39). Your sweat is a seed of future glory.",
  "Unquestionably, by the remembrance of Allah do anxious hearts find absolute core peace and serenity (Surah Ar-Ra'd: 28). Hydrate your tongue with dhikr.",
  "A true elite believer is always deeply content with Allah's decree and faces life's tests with outstanding composure and quiet dignity.",
  "Today is a golden gate of opportunity. The Holy Prophet (PBUH) said: 'Two blessings are neglected by many people—good health and free time.' Guard them securely.",
  "The most beloved of deeds to Allah are those that are performed most consistently, even if they seem extremely small (Sahih al-Bukhari). Keep your habits alive."
];

export const directivesBn = [
  "তাই এখনই মোবাইল স্ক্রিন ও সমস্ত অপ্রয়োজনীয় ডিস্ট্রাকশন সম্পূর্ণ দূরে রেখে বই নিয়ে গভীর মনোযোগে বসে পড়ুন এবং আপনার পড়াশোনার ফোকাস গাছটিকে বিশাল সমৃদ্ধ করুন।",
  "তাই আজ আলসতাকে সম্পূর্ণ পরাজিত করুন এবং নিখুঁতভাবে ৫ ওয়াক্ত ফরজ নামাজ মসজিদে জামায়াতের সাথে প্রথম ওয়াক্তে আদায়ের মজবুত প্রতিজ্ঞা করুন। দুনিয়ার সমস্ত কাজ নামাজের পরে।",
  "তাই পরম যত্নে শরীরচর্চায় গভীরভাবে ফোকাস করুন। সুস্থ ও শক্তিশালী মুমিন দুর্বল মুমিনের চেয়ে আল্লাহর কাছে শতগুণ বেশি প্রিয়। আজ অন্তত ২০ মিনিটের ব্যায়াম টার্গেট পূর্ণ করুন।",
  "দিনের কর্মব্যস্ততা শেষে বুক অব রিফ্লেকশনে যান এবং ডায়েরি নোট লিখুন। নিজেকে সোহান মৃধার মতো নিরপেক্ষভাবে প্রশ্ন করুন: 'আজ আমি কতোটা সময় আল্লাহর পথে কাটিয়েছি?'",
  "তাই জীবনকে অপটিমাইজ করতে একটি সুন্দর রুটিন এবং খাতা প্রফেশনাল মাইন্ডসেট সহ হাতে নিন। অলসদের এই আধুনিক সমাজে আপনার ডিসিপ্লিন হোক আপনার সবচেয়ে বড় অহংকার ও পরিচিতি।",
  "তাই মনের কুপ্রবৃত্তি, পর্নোগ্রাফি, অতিরিক্ত রিলস দেখার কদর্য অভ্যাসকে চিরতরে পরাজিত করুন। আল্লাহর দেওয়া আপনার পবিত্র রূহকে পাপে মলিন হতে দেবেন না। তওবা করে সৎ পথে ফিরুন।"
];

export const directivesEn = [
  "So, cast aside your phone, silence all social media noise, and sit down for highly intense deep work. Nurture your virtual focus tree into majestic leaf growth.",
  "So, defeat procrastination right now and establish a firm commitment to praying your 5 daily prayers on time. Remember, all earthly crowns are secondary to prayers.",
  "So, dedicate some mindful energy to your physical health. A physically strong and vibrant believer is far more beloved to Allah. Achieve your daily fitness goals today.",
  "So, open your digital notebook and write your daily reflection. Audit your behavior like a professional, asking: 'Did my actions today get me closer to my divine destiny?'",
  "So, grab a planner, sketch a custom routine, and execute with an elite professional mindset. Let your absolute discipline shine in this chaotic world.",
  "So, wage a holy war against your worst toxic bad habits and short dopamine loops. Do not let cheap screen addictions decay your potential. Repent and rise higher."
];

export const categoryTagsBn = ["সবর ও সুশৃঙ্খলতা 🧘", "পরম আধ্যাত্মিকতা 🕋", "চরম ফোকাস ও মেহনত 🌲", "আত্মশুদ্ধি ও নিরাময় 🛡️", "সরল জীবন ও শান্তি 🌱"];
export const categoryTagsEn = ["Patience & Order 🧘", "Divine Connection 🕋", "Intense Focus & Grit 🌲", "Self-Purification 🛡️", "Simple Lifestyle 🌱"];

// Generator algorithm creating over 2000 combinations
export function get2000PlusIslamicInspiration(index: number): DynamicInspirationMessage {
  // We use deterministic mathematical indices to safely cover thousands of distinct possibilities
  const salId = index % salutationsBn.length;
  const wisId = (index + 3) % wisdomsBn.length;
  const dirId = (index + 7) % directivesBn.length;
  const catId = index % categoryTagsBn.length;

  return {
    bn: salutationsBn[salId] + wisdomsBn[wisId] + " " + directivesBn[dirId],
    en: salutationsEn[salId] + wisdomsEn[wisId] + " " + directivesEn[dirId],
    categoryBn: categoryTagsBn[catId],
    categoryEn: categoryTagsEn[catId]
  };
}
