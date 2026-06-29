export interface NotificationItem {
  id?: string;
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  category: 'friendship' | 'emotional' | 'reminder';
}

export const MORNING_QUOTES: NotificationItem[] = [
  {
    titleBn: "শুভ সকাল!",
    titleEn: "Good Morning!",
    bodyBn: "আজকের দিনটি শুরু হোক নতুন উদ্যমে।",
    bodyEn: "Let today start with fresh energy.",
    category: "emotional"
  },
  {
    titleBn: "ভোরের আলো",
    titleEn: "Morning Light",
    bodyBn: "ভোরের এই স্নিগ্ধতা আপনার মনকে প্রশান্ত করুক।",
    bodyEn: "May this morning serenity calm your mind.",
    category: "reminder"
  }
];

export const EVENING_QUOTES: NotificationItem[] = [
  {
    titleBn: "শুভ সন্ধ্যা!",
    titleEn: "Good Evening!",
    bodyBn: "দিনের ক্লান্তি ভুলে সুন্দর একটি সন্ধ্যা কাটান।",
    bodyEn: "Forget the fatigue of the day and have a beautiful evening.",
    category: "friendship"
  },
  {
    titleBn: "রাতের প্রস্তুতি",
    titleEn: "Evening Prep",
    bodyBn: "আগামীকালের জন্য নিজেকে প্রস্তুত করুন।",
    bodyEn: "Prepare yourself for tomorrow.",
    category: "reminder"
  }
];

export const RANDOM_MOTIVATIONAL_QUOTES = [
  {
    bodyBn: "দারুণ করেছেন! এভাবেই এগিয়ে যান।",
    bodyEn: "Great job! Keep moving forward like this."
  },
  {
    bodyBn: "আপনার প্রতিটি ছোট পদক্ষেপই বড় সাফল্যের চাবিকাঠি।",
    bodyEn: "Every small step you take is a key to big success."
  },
  {
    bodyBn: "অসাধারণ! নিজেকে ছাড়িয়ে যাওয়ার এই তো সময়।",
    bodyEn: "Awesome! This is the time to go beyond yourself."
  }
];

export interface ActionNotificationTemplate {
  id: string;
  actionType: 'study_session_saved' | 'habit_toggled' | 'prayer_logged' | 'fitness_logged' | 'bad_habit_logged' | 'reflection_diary_logged' | 'exam_target_logged' | 'screen_time_high';
  tone: 'emotional' | 'hooked' | 'caring' | 'love' | 'funny' | 'motivation_progress';
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
}

export const ACTION_NOTIFICATION_TEMPLATES: ActionNotificationTemplate[] = [
  // --- STUDY SESSIONS ---
  {
    id: 'study_1',
    actionType: 'study_session_saved',
    tone: 'emotional',
    titleBn: 'আপনার পরিশ্রম বিফলে যাবে না! 🎓❤️',
    titleEn: 'Your hard work will pay off! 🎓❤️',
    bodyBn: 'দোস্ত, পড়াশোনা সেশন শেষ করেছ? মা-বাবার চোখে তোমার এই সফলতার স্বপ্নই তাদের বেঁচে থাকার অনুপ্রেরণা। তুমি সত্যিই খুব ভালো করছ!',
    bodyEn: 'Finished your study session? Your parents live for the dream of seeing you succeed. You are doing amazing!'
  },
  {
    id: 'study_2',
    actionType: 'study_session_saved',
    tone: 'love',
    titleBn: 'সোহান ভাইয়ের পক্ষ থেকে এক বালতি ভালোবাসা! 💌',
    titleEn: 'A bucket of love from Sohan! 💌',
    bodyBn: 'আজ পড়াশোনায় যে মনোযোগটা দিয়েছ, তার জন্য তোমাকে একটা জড়িয়ে ধরা উপহার দিতে ইচ্ছা করছে! এভাবেই এগিয়ে যাও সোনা!',
    bodyEn: 'The focus you showed today makes me want to give you a big warm hug! Keep shining, champion!'
  },
  {
    id: 'study_3',
    actionType: 'study_session_saved',
    tone: 'funny',
    titleBn: 'আইনস্টাইনের আত্মা এখন কাঁপছে! 🧠😂',
    titleEn: 'Einstein is sweating right now! 🧠😂',
    bodyBn: 'যে লেভেলের পড়াশোনা করছ দোস্ত, এভাবে পড়লে সামনে নোবেল প্রাইজ নিয়ে টানাটানি লেগে যাবে! এবার একটু চা খেয়ে রিফ্রেশ হয়ে নাও।',
    bodyEn: 'With the intense focus you have shown, Nobel prizes are on their way! Go grab a cup of tea, Einstein.'
  },
  {
    id: 'study_4',
    actionType: 'study_session_saved',
    tone: 'hooked',
    titleBn: 'এটাই গোল্ডেন এ+ এর আসল সিক্রেট! 🏆✨',
    titleEn: 'The real secret to GPA 5 is here! 🏆✨',
    bodyBn: 'জানো কি? আজকের এই ২৫-৩০ মিনিটের ফোকাস তোমাকে সাধারণ স্টুডেন্টদের থেকে ১০০ কদম এগিয়ে রাখলো। প্রগ্রেসটা ধরে রেখো কিন্তু!',
    bodyEn: 'Did you know? Today\'s focus session put you 100 steps ahead of the average student. Keep that streak alive!'
  },
  {
    id: 'study_5',
    actionType: 'study_session_saved',
    tone: 'caring',
    titleBn: 'ক্লান্ত মাথাটা একটু বিশ্রাম দাও তো? ☕❤️',
    titleEn: 'Rest that beautiful brain now! ☕❤️',
    bodyBn: 'পড়াশোনায় তো উজার করে দিলে! এবার ৫ মিনিট চোখ বন্ধ করে লম্বা শ্বাস নাও। আমি তোমার ক্লান্ত মাথাটা শান্ত করতে বাইনরাল সাউন্ড বাজাচ্ছি।',
    bodyEn: 'You gave your absolute best! Now close your eyes and breathe deep for 5 minutes. I am always here to guide you.'
  },

  // --- HABITS TOGGLED ---
  {
    id: 'habit_1',
    actionType: 'habit_toggled',
    tone: 'motivation_progress',
    titleBn: 'অলসতা আজ লাথি খেলো! ⚡🔥',
    titleEn: 'Procrastination got kicked out! ⚡🔥',
    bodyBn: 'সাবাশ! সুঅভ্যাসটা শেষ করে টিক মার্ক দিয়েছ। অলসতাকে ফুঁ দিয়ে উড়িয়ে দেওয়ার জন্য তোমাকে এক বালতি অভিনন্দন! অলসরা ঘুমাক, তুমি রাজত্ব করো!',
    bodyEn: 'Superb! You ticked off that habit. Kudos to you for destroying laziness! Let the lazy sleep, you rule the day!'
  },
  {
    id: 'habit_2',
    actionType: 'habit_toggled',
    tone: 'funny',
    titleBn: 'বাহ্! অলস সম্রাট এখন সুনাগরিক! 😎👑',
    titleEn: 'The Emperor of Laziness is reformed! 😎👑',
    bodyBn: 'টিভি বা রিলে মগ্ন না থেকে সুঅভ্যাসটা করে ফেললে? আজ রাতে তো তোমার ঘুমটা রাজার মতো শান্ত হবে দোস্ত! অভিনন্দন!',
    bodyEn: 'Instead of scrolling reels, you completed your habit? Your sleep tonight is going to be incredibly peaceful, buddy!'
  },
  {
    id: 'habit_3',
    actionType: 'habit_toggled',
    tone: 'emotional',
    titleBn: 'আপনার পরিবর্তন দেখে আমার মন ভরে গেল 🌟',
    titleEn: 'Your growth fills my heart with joy 🌟',
    bodyBn: 'প্রতিদিন একটা ছোট্ট ভালো অভ্যাস মানুষকে অনেক বড় ব্যক্তিত্বে রূপ দেয়। আমি নিশ্চিত, তোমার এই শৃঙ্খলা তোমাকে অনেক উঁচুতে নিয়ে যাবে।',
    bodyEn: 'A tiny daily habit shapes a great personality. I am confident your discipline will take you to extraordinary heights.'
  },
  {
    id: 'habit_4',
    actionType: 'habit_toggled',
    tone: 'caring',
    titleBn: 'তুমি তো অসাধারণ করছো বন্ধু! 🤗❤️',
    titleEn: 'You are doing amazing, friend! 🤗❤️',
    bodyBn: 'সবকিছু গুছিয়ে নেওয়া সহজ নয়, কিন্তু তুমি আজ তোমার অভ্যাসে জয়ী হয়েছ। নিজের খেয়াল রেখো, আমি সব সময় আছি তোমার পিছে।',
    bodyEn: 'Getting things in order is hard, but you conquered your habits today. Take care of yourself, I am right here.'
  },

  // --- PRAYERS LOGGED ---
  {
    id: 'prayer_1',
    actionType: 'prayer_logged',
    tone: 'emotional',
    titleBn: 'অন্তরে শান্তি, চেহারায় আল্লাহর নূর! 🕌✨',
    titleEn: 'Pure tranquility and Divine light! 🕌✨',
    bodyBn: 'নামাজ শেষ করেছ? বুকটা কতো হালকা লাগছে না? শয়তানের টক্সিক কুপ্রবৃত্তি আজ তোমার কাছে কুর্নিশ করে হেরে গেল! আল্লাহ তোমার দোয়া কবুল করুন।',
    bodyEn: 'Finished your prayer? Feel the weight lift off your soul? Sins retreated, your spiritual purity triumphed. May Allah accept!'
  },
  {
    id: 'prayer_2',
    actionType: 'prayer_logged',
    tone: 'love',
    titleBn: 'সবচেয়ে সুন্দর কাজটা করেছ সোনা! 💕🕋',
    titleEn: 'You performed the absolute best act! 💕🕋',
    bodyBn: 'আল্লাহর দরবারে সেজদা দিয়েছ, এর চেয়ে প্রশান্তির আর কী হতে পারে? তোমার জন্য মন থেকে অনেক অনেক আন্তরিক দোয়া রইলো!',
    bodyEn: 'You prostrated before the Lord of worlds. What is more beautiful than this? Praying for your ultimate success!'
  },
  {
    id: 'prayer_3',
    actionType: 'prayer_logged',
    tone: 'funny',
    titleBn: 'শয়তানের বড় ধাক্কা, আজ তোমার জয়! 👿🔥',
    titleEn: 'Huge blow to the devil, you won! 👿🔥',
    bodyBn: 'শয়তান বলেছিল "আরে পরে পড়ো", কিন্তু তুমি ওযু করে নামাজটা পড়েই ছাড়লে! আজ তো শয়তান কোণায় বসে কান্নাকাটি করছে! হা হা!',
    bodyEn: 'The devil whispered "do it later," but you stood tall and prayed! He is literally crying in the corner right now! Haha!'
  },
  {
    id: 'prayer_4',
    actionType: 'prayer_logged',
    tone: 'hooked',
    titleBn: 'জান্নাতের পাসপোর্টে আরেকটি সিল! ✈️🕌',
    titleEn: 'Another seal on your Jannah Passport! ✈️🕌',
    bodyBn: 'সাফল্য তো একেই বলে! দুনিয়ার সব কাজকে পাশে রেখে পরম সৃষ্টিকর্তার সামনে দাঁড়ানোই তো প্রকৃত জয়ীদের পরিচয়। সালাম তোমাকে!',
    bodyEn: 'This is what true success looks like! Putting everything aside to stand before the Creator is the hallmark of real champions.'
  },

  // --- FITNESS LOGGED ---
  {
    id: 'fitness_1',
    actionType: 'fitness_logged',
    tone: 'funny',
    titleBn: 'বাপরে! বডি তো এবার লোহা হয়ে যাবে! 💪🔥',
    titleEn: 'Oh my! You will be built like iron! 💪🔥',
    bodyBn: 'ব্যায়াম শেষ করে ফেলেছ? ডাম্বেল বা পুশ-আপ দিয়ে একদম ফাটায় দিছ! আয়নার সামনে দাঁড়িয়ে একটু মাসল দেখে নাও তো দোস্ত!',
    bodyEn: 'Completed your workout? You absolutely smashed those push-ups! Go pose in front of the mirror, you handsome beast!'
  },
  {
    id: 'fitness_2',
    actionType: 'fitness_logged',
    tone: 'caring',
    titleBn: 'সুস্থ শরীরই বড় সম্পদ, ভালো করেছ ❤️',
    titleEn: 'Your health is your wealth ❤️',
    bodyBn: 'পরিশ্রম করার পর শরীর থেকে বিষাক্ত অলসতা উধাও হয়ে গেল। প্রচুর পানি খেয়ে নাও, শরীরটার যত্ন নিয়ো সোনা!',
    bodyEn: 'With sweat, toxic laziness left your body. Please drink some fresh water and treat your body with love!'
  },
  {
    id: 'fitness_3',
    actionType: 'fitness_logged',
    tone: 'motivation_progress',
    titleBn: 'ফিটনেস লেভেল ১০০% আনলকড! ⚡🐆',
    titleEn: 'Fitness Level 100% Unlocked! ⚡🐆',
    bodyBn: 'আজকের ব্যায়াম তোমার আলসেমি রোগকে চিরতরে দূরে ঠেলে দিলো। তোমার এই এনার্জি এখন পড়াশোনাতেও আগুন জ্বালাবে!',
    bodyEn: 'Today\'s physical workout eradicated all sluggishness. This high energy will fuel your focus to supreme heights!'
  },

  // --- BAD HABITS RESISTED OR LOGGED ---
  {
    id: 'bad_habit_1',
    actionType: 'bad_habit_logged',
    tone: 'hooked',
    titleBn: 'টক্সিক ডোপামিন আজ পরাস্ত! 📵🚫',
    titleEn: 'Toxic Dopamine defeated! 📵🚫',
    bodyBn: 'তুমি আজ রিলস স্ক্রলিং বা টক্সিক অভ্যাসকে না বলে দিয়েছ! তুমি সাধারণ নও দোস্ত, তোমার এই ইচ্ছাশক্তি তোমাকে একদিন বিজয়ী বানাবেই!',
    bodyEn: 'You said NO to infinite scrolling or toxic triggers today! You are not average; this willpower is destined for success!'
  },
  {
    id: 'bad_habit_2',
    actionType: 'bad_habit_logged',
    tone: 'emotional',
    titleBn: 'আপনার উপর আমার অনেক ভরসা বন্ধু... ❤️',
    titleEn: 'I have absolute faith in you... ❤️',
    bodyBn: 'খারাপ আসক্তি থেকে লড়াই করা সবচেয়ে কঠিন জিহাদ। তুমি আজ যে সংযম দেখিয়েছ, তার জন্য সৃষ্টিকর্তা নিশ্চয়ই তোমাকে পুরস্কৃত করবেন।',
    bodyEn: 'Resisting harmful addiction is the ultimate inner struggle. Your self-control today is highly noble.'
  },
  {
    id: 'bad_habit_3',
    actionType: 'bad_habit_logged',
    tone: 'funny',
    titleBn: 'রিলস আর শর্টসের মালিকরা আজ কান্নায় ভাসছে! 📱😭',
    titleEn: 'TikTok & Insta owners are crying today! 📱😭',
    bodyBn: 'ওরা চেয়েছিল তোমার ব্রেইনটা চুষে খেতে, কিন্তু তুমি মোবাইলটা পাশে রেখে নিজের কাজে মেতে থাকলে! চরম প্রতিশোধ নিয়েছ দোস্ত!',
    bodyEn: 'They wanted to hijack your attention span, but you slammed the phone shut and focused on your goals! Epic revenge!'
  },

  // --- DIARY/REFLECTION LOGGED ---
  {
    id: 'reflection_1',
    actionType: 'reflection_diary_logged',
    tone: 'caring',
    titleBn: 'মনের ডায়েরিতে এক টুকরো শান্তি 📖💕',
    titleEn: 'A piece of peace in your diary 📖💕',
    bodyBn: 'আজকের দিনের ভালো-মন্দ অনুভূতি লিখে মনটা হালকা করেছ। সত্যিই তুমি দিন দিন কতো পরিণত ও সুন্দর মনের মানুষে পরিণত হচ্ছো!',
    bodyEn: 'By logging your highs and lows, you released mental fog. You are growing into such a matured, elegant person!'
  },
  {
    id: 'reflection_2',
    actionType: 'reflection_diary_logged',
    tone: 'emotional',
    titleBn: 'আপনার প্রতিটি কদম আমি সযত্নে মনে রাখছি... 🤝',
    titleEn: 'I remember every step you take... 🤝',
    bodyBn: 'আজকের ডায়েরির প্রতিটি লাইন তোমার সংগ্রামের দলিল। একদিন এই সংগ্রামের গল্পগুলোই তোমাকে অনন্য করে তুলবে। আমি সবসময় আছি পাশে।',
    bodyEn: 'Every sentence in your diary today is a testament to your battle. One day this exact story will inspire millions.'
  },

  // --- EXAM TARGETS LOGGED ---
  {
    id: 'exam_1',
    actionType: 'exam_target_logged',
    tone: 'motivation_progress',
    titleBn: 'গোল্ডেন এ+ মিশন এখন পূর্ণ গতিতে! 🏆📚',
    titleEn: 'Golden A+ Mission at warp speed! 🏆📚',
    bodyBn: 'পরীক্ষার প্রস্তুতি আপডেট করেছ? চমৎকার! প্রতিটি ছোট চ্যাপ্টার শেষ হওয়া মানে জিপিএ ৫ এর রাস্তা অনেক সহজ হওয়া। লড়াই চলবে!',
    bodyEn: 'Updated your exam syllabus prep? Excellent! Getting a chapter done makes your GPA 5 dream almost a reality. Let\'s fight!'
  },
  {
    id: 'exam_2',
    actionType: 'exam_target_logged',
    tone: 'love',
    titleBn: 'তোমার রেজাল্ট দেখে মা-বাবা যেদিন হাসবে... 🥹❤️',
    titleEn: 'The day your parents see your A+... 🥹❤️',
    bodyBn: 'একটু ভাবো তো দোস্ত, যেদিন তোমার গোল্ডেন এ+ আসবে, মা-বাবার চোখ খুশিতে ভিজে যাবে! সেই সোনালী দিনের জন্য আজকের এই কষ্টটুকু হাসিমুখে সয়ে নাও!',
    bodyEn: 'Imagine the moment you get that sweet A+ and your parents hold you with tears of joy! Bear today\'s struggle for that golden smile!'
  },

  // --- SCREEN TIME WARNINGS ---
  {
    id: 'screen_1',
    actionType: 'screen_time_high',
    tone: 'funny',
    titleBn: 'মোবাইলের ডিসপ্লেটা তো এবার গলে যাবে! 📱🔥',
    titleEn: 'Your mobile screen is about to melt! 📱🔥',
    bodyBn: 'অনেক তো হলো! রিলস স্ক্রল করতে করতে আঙুল ক্ষয়ে যাওয়ার দশা! এখনই ফোনটা দূরে রেখে ১ গ্লাস পানি খেয়ে পড়তে বোসো তো!',
    bodyEn: 'That is enough scrolling! Your thumb needs a vacation. Put the phone down, drink a glass of water and study!'
  },
  {
    id: 'screen_2',
    actionType: 'screen_time_high',
    tone: 'emotional',
    titleBn: 'প্লিজ দোস্ত, নিজের জীবনের সোনালী সময় নষ্ট কোরো না 🥺💔',
    titleEn: 'Please, do not waste your beautiful life 🥺💔',
    bodyBn: 'স্ক্রিন টাইমের এই টক্সিক ফাঁদ আমাদের অলস বানিয়ে দিচ্ছে। আজ তোমার পড়াশোনার গুরুত্বপূর্ণ কাজ ছিল না? এসো, ফোন বন্ধ করে ৫ মিনিট ওযু বা নামাজ পড়ি!',
    bodyEn: 'This digital trap is sucking away your brilliance. Didn\'t you have important things to achieve today? Let\'s shut it off!'
  }
];
