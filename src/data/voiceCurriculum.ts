import { DayCurriculum, ExerciseStep, SessionPlan } from '../types/voice';

// Base exercise templates that get dynamically calibrated
export const MORNING_BREATHING_STEP: ExerciseStep = {
  id: 'm_breath',
  nameBn: 'ডায়াফ্রাম্যাটিক শ্বাস-প্রশ্বাস',
  nameEn: 'Diaphragmatic Breathing',
  category: 'breath',
  durationSec: 120, // 2 minutes
  instructionBn: 'নাক দিয়ে ৪ সেকেন্ডে ধীরে শ্বাস নিন। ২ সেকেন্ড ধরে রাখুন। মুখ দিয়ে ৬ সেকেন্ডে ধীরে শ্বাস ছাড়ুন।',
  instructionEn: 'Inhale gently through nose for 4s. Pause for 2s. Exhale slowly through mouth for 6s.',
  subInstructionBn: 'বুক ফুলিয়ে নয়, পেটের নিম্নাংশ ফুলিয়ে শ্বাস নিন। কাঁধ সম্পূর্ণ শিথিল রাখুন।',
  subInstructionEn: 'Expand your lower abdomen, not your chest. Keep shoulders relaxed.',
  breathingPattern: { inhaleSec: 4, holdSec: 2, exhaleSec: 6 },
  animationType: 'breathing'
};

export const MORNING_NECK_SHOULDER_STEP: ExerciseStep = {
  id: 'm_neck_relax',
  nameBn: 'ঘাড় ও কাঁধের মৃদু রিলাক্সেশন',
  nameEn: 'Neck & Shoulder Relaxation',
  category: 'relaxation',
  durationSec: 120, // 2 minutes
  instructionBn: 'ঘাড় ধীরে ধীরে ডানে ও বামে ঘোরান। এরপর কাঁধকে বৃত্তাকারে পেছনের দিকে ৪ বার ও সামনের দিকে ৪ বার ঘোরান।',
  instructionEn: 'Slowly rotate neck side-to-side. Gently roll shoulders backward 4 times, then forward 4 times.',
  subInstructionBn: 'কোনো ঝাঁকুনি বা জোর করবেন না। কেবল টান অনুভব করে পেশী শিথিল করুন।',
  subInstructionEn: 'Avoid sudden jerks. Simply release tension gently.',
  animationType: 'neck_stretch'
};

export const MORNING_JAW_RELAX_STEP: ExerciseStep = {
  id: 'm_jaw_relax',
  nameBn: 'চোয়াল ও ল্যারিংক্স রিলাক্সেশন',
  nameEn: 'Jaw & Larynx Relaxation',
  category: 'relaxation',
  durationSec: 60, // 1 minute
  instructionBn: 'হালকা হাই তোলার মতো করে চোয়াল নামিয়ে রাখুন। হাত দিয়ে গালের পেশীতে মৃদু ম্যাসাজ দিন।',
  instructionEn: 'Drop your jaw loosely like a gentle yawn. Lightly massage cheek and jaw joints.',
  subInstructionBn: 'চোয়াল শিথিল থাকলে গলার ভেতর উন্মুক্ত স্পেস তৈরি হয়।',
  subInstructionEn: 'A relaxed jaw creates open acoustic resonance space.',
  animationType: 'jaw_relax'
};

export const MORNING_HUMMING_STEP: ExerciseStep = {
  id: 'm_humming',
  nameBn: 'জেন্টল হামিং (ম্মম্ম)',
  nameEn: 'Gentle Humming (Mmmm)',
  category: 'humming',
  durationSec: 180, // 3 minutes
  instructionBn: 'মুখ বন্ধ রেখে খুব হালকা ও আরামদায়ক স্কেলে "ম্মম্ম" শব্দ তৈরি করুন। ঠোঁট ও নাকের পাতায় কম্পন অনুভব করুন।',
  instructionEn: 'With lips gently closed, produce a soft, effortless "Mmmm" sound. Feel the vibration on your lips and nasal bridge.',
  subInstructionBn: 'কখনো গলা চিপে ভারী করবেন না। যেন একটি মৌমাছির মতো মৃদু গুঞ্জন হয়।',
  subInstructionEn: 'Never squeeze or force depth. Let it buzz softly like a bee.',
  audioToneFrequency: 130, // C3 gentle low-mid
  animationType: 'humming'
};

export const MORNING_LIP_TRILL_STEP: ExerciseStep = {
  id: 'm_lip_trill',
  nameBn: 'লিপ ট্রিল (ব্র্র্র্র)',
  nameEn: 'Lip Trill (Brrrrr)',
  category: 'lip_trill',
  durationSec: 180, // 3 minutes
  instructionBn: 'ঠোঁট শিথিল রেখে বাতাস ছেড়ে ঠোঁটে কম্পন তৈরি করুন — "ব্র্র্র্র"।',
  instructionEn: 'Keep lips loose and blow steady air to create lip vibration — "Brrrrr".',
  subInstructionBn: 'এটি আপনার ভোকাল কর্ডের ক্লান্তি দূর করে রক্ত সঞ্চালন বাড়ায়।',
  subInstructionEn: 'This balances subglottic air pressure and warms vocal folds safely.',
  audioToneFrequency: 150,
  animationType: 'lip_trill'
};

export const MORNING_RESONANCE_STEP: ExerciseStep = {
  id: 'm_resonance',
  nameBn: 'মাস্ক ও চেস্ট রেজোন্যান্স',
  nameEn: 'Mask & Chest Resonance',
  category: 'resonance',
  durationSec: 240, // 4 minutes
  instructionBn: '"ম্ম্ম–আ", "ম্ম্ম–ই", "ম্ম্ম–উ" শব্দগুলো ধীরে ধীরে উচ্চারণ করুন। মুখের সামনের অংশে স্বরের বিস্তার আনুন।',
  instructionEn: 'Chant "Mmm-Aaa", "Mmm-Eee", "Mmm-Ooo" slowly. Focus vibration on facial mask.',
  subInstructionBn: 'শব্দটি যেন গলার ভেতরে আটকে না থেকে মুখের সামনে থেকে প্রতিধ্বনিত হয়।',
  subInstructionEn: 'Project the sound effortlessly into the room without throat tension.',
  audioToneFrequency: 140,
  animationType: 'resonance'
};

// Afternoon Articulation & Reading Drills
export const ARTICULATION_DRILLS = [
  { bn: 'মা — মে — মি — মো — মু', en: 'Ma — Me — Mi — Mo — Mu' },
  { bn: 'না — নে — নি — নো — নু', en: 'Na — Ne — Ni — No — Nu' },
  { bn: 'লা — লে — লি — লো — লু', en: 'La — Le — Li — Lo — Lu' },
  { bn: 'বা — বে — বি — বো — বু', en: 'Ba — Be — Bi — Bo — Bu' },
  { bn: 'গা — গে — গি — গো — গু', en: 'Ga — Ge — Gi — Go — Gu' },
  { bn: 'কা — কে — কি — কো — কু', en: 'Ka — Ke — Ki — Ko — Ku' },
  { bn: 'তা — তে — তি — তো — তু', en: 'Ta — Te — Ti — To — Tu' },
  { bn: 'পা — পে — পি — পো — পু', en: 'Pa — Pe — Pi — Po — Pu' }
];

export const SLOW_READING_SCRIPTS = [
  {
    day: 1,
    titleBn: 'শান্ত সকালের আত্মবিশ্বাস',
    titleEn: 'Morning Serenity',
    textBn: 'একটি স্থির মন এবং গভীর শ্বাস আমাদের কণ্ঠকে দেয় অনন্য শক্তি। যখন আপনি তাড়াহুড়ো না করে প্রতিটি শব্দের শেষ পর্যন্ত স্পষ্ট করে উচ্চারণ করবেন, আপনার কথা মানুষের মনে গভীরভাবে প্রভাব ফেলবে।',
    textEn: 'A calm mind and deep breath give our voice profound strength. When you speak without rushing and articulate each ending consonant clearly, your message resonates deeply.'
  },
  {
    day: 7,
    titleBn: 'কণ্ঠের নিজস্ব সৌন্দর্য',
    titleEn: 'The Natural Resonance',
    textBn: 'কণ্ঠ ভারী করার চেয়ে কণ্ঠকে স্বচ্ছ এবং স্বাচ্ছন্দ্যময় রাখা বেশি জরুরি। আপনার স্বাভাবিক সুরেই লুকিয়ে আছে সবচেয়ে মুগ্ধকর ব্যক্তিত্ব।',
    textEn: 'Keeping your voice clear and relaxed is far more powerful than forcing artificial depth. Your natural resonance carries the most captivating presence.'
  },
  {
    day: 15,
    titleBn: 'শ্রোতার সাথে সংযোগ',
    titleEn: 'Connecting with Listeners',
    textBn: 'শব্দের চেয়ে শব্দের মাঝের নীরবতা বা পজ অনেক সময় বেশি কথা বলে। একজন ভালো কথক জানেন কখন থামতে হয় এবং কখন স্বরের গতি পরিবর্তন করতে হয়।',
    textEn: 'Often, the pause between words speaks louder than the words themselves. A master speaker knows precisely when to pause and modulate vocal pacing.'
  },
  {
    day: 30,
    titleBn: 'ভয়েস ট্রান্সফরমেশন মাস্টারপিস',
    titleEn: 'Mastery & Confidence',
    textBn: '৩০ দিনের এই ধারাবাহিক যাত্রা আমার কণ্ঠকে করেছে স্পষ্ট, সুদৃঢ় এবং আত্মবিশ্বাসী। আজ আমি যেকোনো মঞ্চে কিংবা মাইক্রোফোনে কথা বলতে প্রস্তুত—শান্তভাবে, স্পষ্ট উচ্চারণে এবং সম্পূর্ণ সাবলীলতায়।',
    textEn: 'This 30-day journey has cultivated clarity, resonance, and unshakeable confidence in my speech. Today, I speak with effortless power, crisp articulation, and authentic presence.'
  }
];

export const RJ_BROADCAST_SCRIPTS = [
  {
    day: 1,
    titleBn: 'হৃদয়ের সাথে কথা বলা (RJ Intro)',
    titleEn: 'Late Night RJ Warmup',
    textBn: `হ্যালো সবাই, কেমন আছেন?
আশা করি আজকের দিনটা আপনার জন্য সুন্দর ছিল।

জীবনে প্রতিদিন সবকিছু আমাদের পরিকল্পনা অনুযায়ী হয় না।
কিন্তু তাই বলে আমাদের থেমে যাওয়ার দরকার নেই।

একটি দীর্ঘ শ্বাস নিন, আর এই চমৎকার মুহূর্তটিকে অনুভব করুন।`,
    textEn: `Hello everyone, hope you are having a peaceful evening.

Not every day goes exactly according to our plan.
Yet, every sunset brings the quiet promise of a fresh dawn.

Take a deep, relaxed breath, and let the calmness settle in.`
  },
  {
    day: 7,
    titleBn: 'গল্পের সুরে রেডিও সম্প্রচার',
    titleEn: 'Storytelling Resonance',
    textBn: `রাত তখন নিঝুম, শহরের ব্যস্ত রাজপথগুলো এখন শান্ত।
আপনি হয়তো শুনছেন আপনার পছন্দের কোনো গান, কিংবা ভাবছেন ফেলে আসা কোনো স্মৃতি নিয়ে।

মনে রাখবেন, প্রতিটি ছোট প্রচেষ্টাই একদিন বিশাল সফলতায় রূপ নেয়।
সঙ্গে আছি আমি, আপনার বিশ্বস্ত রেডিও সহযাত্রী।`,
    textEn: `As midnight settles over the sleeping city, the busy streets grow quiet.
Perhaps you are listening to your favorite melody, reflecting on memories.

Remember, quiet daily persistence always creates lasting transformation.
Stay tuned, you are listening to the sound of calm confidence.`
  },
  {
    day: 15,
    titleBn: 'রেডিও স্টুডিও ড্রাইভ শো',
    titleEn: 'Drive-Time Broadcast Host',
    textBn: `গুড ইভনিং শহরবাসী! ট্রাফিকের ক্লান্তি ভুলে সুরের ভেলায় ভাসতে প্রস্তুত তো?
আজ আমরা কথা বলব আত্মবিশ্বাস এবং স্বপ্নের কথা নিয়ে।

আপনি যখন নিজের প্রতি বিশ্বাস রাখবেন, পুরো পৃথিবী আপনার জন্য পথ তৈরি করে দেবে।
চলুন উপভোগ করি আজকের বিশেষ সুর।`,
    textEn: `Good evening listeners! Ready to leave behind the workday fatigue?
Tonight we talk about resilience, passion, and holding on to your highest aspirations.

When you trust your inner voice, the world stops to listen.
Stay relaxed, stay tuned.`
  },
  {
    day: 21,
    titleBn: 'ইমোশনাল ভয়েস ন্যারেটিভ',
    titleEn: 'Midnight Reflections',
    textBn: `মাঝে মাঝে কিছু কথা নিঃশব্দেই সবচেয়ে সুন্দরভাবে বলা যায়।
আপনার কণ্ঠের প্রতিটি ভাঁজে থাকুক আন্তরিকতা এবং মমতা।

যখন আপনি হৃদয়ের গভীর থেকে বলবেন, প্রতিটি শব্দ অপরজনের হৃদয়ে গিয়ে স্পর্শ করবে।
শুভরাত্রি প্রিয় শ্রোতা।`,
    textEn: `Sometimes the most powerful truths are spoken in the softest tone.
Let sincerity and warmth resonate through every single word.

Speak with heart, breathe with freedom, and let your authentic resonance shine.`
  },
  {
    day: 30,
    titleBn: 'গ্র্যাজুয়েশন গ্র্যান্ড শো (Day 30)',
    titleEn: 'Master Graduation Broadcast',
    textBn: `শুভ সকাল এবং অভিনন্দন সবাইকে!
আজ আমাদের ৩০ দিনের এই রূপান্তর যাত্রা পূর্ণতা পেল।

যে কণ্ঠটি ৩০ দিন আগে ছিল হয়তো কিছুটা সংকুচিত বা অস্পষ্ট,
আজ সেই কণ্ঠ প্রবাহিত হচ্ছে পূর্ণ আত্মবিশ্বাস, স্পষ্ট উচ্চারণ এবং জাদুকরী রেজোন্যান্সে।

নিজের কণ্ঠকে ভালোবাসুন, এবং বিশ্বকে শোনান আপনার আত্মবিশ্বাসী স্বর।`,
    textEn: `Welcome to the grand milestone show!
Today marks the triumphant completion of our 30-Day Voice Transformation Journey.

The voice that began as a small seed 30 days ago has now grown into a flourishing, resonant tree.
Speak with pride, articulate with precision, and inspire everyone around you.`
  }
];

// Physical voice-supportive routine
export const BODY_VOICE_ROUTINE: ExerciseStep[] = [
  {
    id: 'body_neck_roll',
    nameBn: 'ঘাড়ের নিরাপদ স্ট্রেচ',
    nameEn: 'Gentle Neck Release',
    category: 'body',
    durationSec: 90,
    instructionBn: 'মাথা একপাশে আলতোভাবে হেলিয়ে ১৫ সেকেন্ড ধরে রাখুন। এরপর অপরপাশে। কখনোই ঘাড় জোর করে চাপবেন না।',
    instructionEn: 'Tilt head gently to one side for 15s, then switch. Never force neck muscles.',
    animationType: 'neck_stretch'
  },
  {
    id: 'body_shoulder_rolls',
    nameBn: 'শোল্ডার রোলস ও ট্র্যাপেজিয়াস রিলাক্স',
    nameEn: 'Shoulder Rolls & Trap Release',
    category: 'body',
    durationSec: 90,
    instructionBn: 'কাঁধ দুটি কানের দিকে উঁচু করে পেছনের দিকে ঘুরিয়ে নিচে নামিয়ে দিন। বুক প্রশস্ত হবে।',
    instructionEn: 'Lift shoulders toward ears, roll them backward and down to open the ribcage.',
    animationType: 'body_posture'
  },
  {
    id: 'body_chest_open',
    nameBn: 'চেস্ট ওপেনিং ও পোস্টার অ্যালাইনমেন্ট',
    nameEn: 'Chest Opening & Posture Alignment',
    category: 'body',
    durationSec: 90,
    instructionBn: 'মেরুদণ্ড সোজা রেখে দুই হাত পেছনের দিকে নিয়ে বুক কিছুটা প্রসারিত করুন। ফুসফুসে বাতাস নেওয়ার ক্ষমতা বাড়বে।',
    instructionEn: 'Keep spine tall and gently draw shoulder blades together to maximize thoracic breath capacity.',
    animationType: 'body_posture'
  },
  {
    id: 'body_diaphragm_stretch',
    nameBn: 'ডায়াফ্রাম প্রসারণ ও মৃদু ওয়াক',
    nameEn: 'Diaphragmatic Lateral Stretch',
    category: 'body',
    durationSec: 90,
    instructionBn: 'এক হাত উঁচুতে তুলে শরীরের একপাশ আলতোভাবে বাঁকিয়ে পাশের পাঁজরে গভীর শ্বাস নিন।',
    instructionEn: 'Raise one arm and gently bend sideways, breathing deeply into the intercostal ribs.',
    animationType: 'breathing'
  }
];

// Night recovery exercises
export const NIGHT_RECOVERY_STEPS: ExerciseStep[] = [
  {
    id: 'night_hum_soothe',
    nameBn: 'শান্ত রিকভারি হামিং',
    nameEn: 'Calming Recovery Hum',
    category: 'humming',
    durationSec: 120,
    instructionBn: 'দিনের সমস্ত কথা বলার চাপ দূর করতে খুব ধীর লয়ে একটি নরম "ম্মম্ম" গুঞ্জন করুন।',
    instructionEn: 'Release all daily vocal fatigue with an ultra-soft, warm recovery hum.',
    audioToneFrequency: 110,
    animationType: 'humming'
  },
  {
    id: 'night_breath_slow',
    nameBn: '৪-৭-৮ স্লিপ ব্রিদিং',
    nameEn: '4-7-8 Deep Sleep Breathing',
    category: 'breath',
    durationSec: 180,
    instructionBn: 'নাক দিয়ে ৪ সেকেন্ড শ্বাস নিন। ৭ সেকেন্ড ধরে রাখুন। ৮ সেকেন্ডে মুখ দিয়ে হালকা বাতাস ছাড়ুন।',
    instructionEn: 'Inhale for 4s. Hold for 7s. Exhale slowly through mouth for 8s to calm the nervous system.',
    breathingPattern: { inhaleSec: 4, holdSec: 7, exhaleSec: 8 },
    animationType: 'sleep_prep'
  },
  {
    id: 'night_vocal_rest',
    nameBn: 'ভয়েস রেস্ট ও হাইহাইড্রেশন',
    nameEn: 'Vocal Rest & Sleep Hydration',
    category: 'sleep',
    durationSec: 120,
    instructionBn: 'এক গ্লাস সাধারণ তাপমাত্রার পানি পান করুন। ঘুমানোর আগে আর জোরে কথা বলা বা চিৎকার থেকে বিরত থাকুন।',
    instructionEn: 'Sip room-temperature water. Maintain complete vocal rest before restorative sleep.',
    animationType: 'sleep_prep'
  }
];

// Generate dynamic curriculum for all 30 days
export function getCurriculumForDay(day: number): DayCurriculum {
  const d = Math.max(1, Math.min(30, Math.round(day)));

  // Tree stage mapping
  let treeStage: 1 | 2 | 3 | 4 | 5 | 6 = 1;
  let stageNameBn = 'লেভেল ১: বীজ স্তর (Seed Stage)';
  let stageNameEn = 'Level 1: Seed Foundation';
  if (d >= 30) {
    treeStage = 6;
    stageNameBn = 'লেভেল ৬: পূর্ণাঙ্গ রূপান্তর বৃক্ষ (Master Tree)';
    stageNameEn = 'Level 6: Full Transformation Tree';
  } else if (d >= 21) {
    treeStage = 5;
    stageNameBn = 'লেভেল ৫: সুদৃঢ় বৃক্ষ (Strong Resonant Tree)';
    stageNameEn = 'Level 5: Strong Resonant Tree';
  } else if (d >= 14) {
    treeStage = 4;
    stageNameBn = 'লেভেল ৪: বর্ধনশীল বৃক্ষ (Growing Tree)';
    stageNameEn = 'Level 4: Growing Tree';
  } else if (d >= 7) {
    treeStage = 3;
    stageNameBn = 'লেভেল ৩: তরুণ বৃক্ষ (Young Tree)';
    stageNameEn = 'Level 3: Young Tree';
  } else if (d >= 3) {
    treeStage = 2;
    stageNameBn = 'লেভেল ২: অঙ্কুরোদগম (Sprout Stage)';
    stageNameEn = 'Level 2: Sprout Awakening';
  }

  // Dynamic theme & focus
  let themeBn = 'কণ্ঠের শিথিলতা ও প্রাথমিক শ্বাস নিয়ন্ত্রণ';
  let themeEn = 'Vocal Relaxation & Diaphragmatic Breath';
  let focusPointBn = 'কোনো জোর না দিয়ে পেটের পেশী ব্যবহার করে শ্বাস নেওয়া এবং গলা আরামদায়ক রাখা।';
  let focusPointEn = 'Expand lower abdomen without throat constriction or chest tension.';

  if (d > 20) {
    themeBn = 'মাস্টার আরজে ডেলিভারি ও ডায়নামিক রেজোন্যান্স';
    themeEn = 'Master RJ Broadcast Delivery & Rich Resonance';
    focusPointBn = 'পজ কন্ট্রোল, গল্পের আবহ তৈরি এবং পূর্ণ আত্মবিশ্বাসী স্বর বিস্তার।';
    focusPointEn = 'Pacing control, narrative pauses, and projecting full chest resonance.';
  } else if (d > 10) {
    themeBn = 'উচ্চারণের স্পষ্টতা ও পিচ কন্ট্রোল';
    themeEn = 'Articulation Precision & Natural Pitch Glide';
    focusPointBn = 'শব্দের শেষ বর্ণ স্পষ্ট উচ্চারণ এবং সুরের স্বাভাবিক ওঠা-নামা।';
    focusPointEn = 'Crisp consonant endings and smooth, effortless pitch gliding.';
  } else if (d > 3) {
    themeBn = 'লিপ ট্রিল ও মাস্ক রেজোন্যান্স জাগরণ';
    themeEn = 'Lip Trills & Mask Resonance Awakening';
    focusPointBn = 'ঠোঁটের কম্পন এবং মুখের সামনের অংশে স্বরের প্রতিধ্বনি বাড়ানো।';
    focusPointEn = 'Vocal fold decompression and facial mask acoustic projection.';
  }

  // Pick script matching day or closest
  const slowScript = SLOW_READING_SCRIPTS.find(s => s.day === d) || SLOW_READING_SCRIPTS[d % SLOW_READING_SCRIPTS.length];
  const rjScript = RJ_BROADCAST_SCRIPTS.find(s => s.day === d) || RJ_BROADCAST_SCRIPTS[d % RJ_BROADCAST_SCRIPTS.length];

  // Afternoon articulation dynamic drill
  const drillA = ARTICULATION_DRILLS[(d - 1) % ARTICULATION_DRILLS.length];
  const drillB = ARTICULATION_DRILLS[d % ARTICULATION_DRILLS.length];

  const afternoonExercises: ExerciseStep[] = [
    {
      id: `aft_artic_${d}`,
      nameBn: 'স্পিচ ও আর্টিকুলেশন ড্রিল',
      nameEn: 'Phonetic Articulation Drill',
      category: 'articulation',
      durationSec: 180, // 3 minutes
      instructionBn: `নিচের স্বরগুলো ছন্দে ছন্দে স্পষ্ট করে উচ্চারণ করুন:\n${drillA.bn}\n${drillB.bn}`,
      instructionEn: `Articulate cleanly with steady rhythm:\n${drillA.en}\n${drillB.en}`,
      subInstructionBn: 'জিহ্বা এবং ঠোঁটের স্পষ্ট সঞ্চালন নিশ্চিত করুন।',
      subInstructionEn: 'Enunciate each vowel clearly without slurring.',
      rhythmBpm: 65 + Math.min(25, d),
      animationType: 'articulation'
    },
    {
      id: `aft_read_${d}`,
      nameBn: 'ধীরগতির পঠন ও স্পষ্টতা মূল্যায়ন',
      nameEn: 'Slow Reading & Clarity Test',
      category: 'reading',
      durationSec: 240, // 4 minutes
      instructionBn: `নিচের অনুচ্ছেদটি ধীরে ধীরে প্রতিটি শব্দ বুঝে পাঠ করুন।`,
      instructionEn: `Read the paragraph slowly with steady breath support.`,
      subInstructionBn: slowScript.titleBn,
      subInstructionEn: slowScript.titleEn,
      scriptTextBn: slowScript.textBn,
      scriptTextEn: slowScript.textEn,
      animationType: 'rj_reading'
    }
  ];

  const eveningExercises: ExerciseStep[] = [
    {
      ...MORNING_HUMMING_STEP,
      id: `eve_hum_${d}`,
      nameBn: 'ইভনিং রেজোন্যান্স হামিং',
      nameEn: 'Evening Resonance Hum',
      durationSec: 120
    },
    {
      ...MORNING_LIP_TRILL_STEP,
      id: `eve_trill_${d}`,
      nameBn: 'ইভনিং লিপ ট্রিল গ্লাইড',
      nameEn: 'Lip Trill Pitch Glide',
      durationSec: 120
    },
    {
      id: `eve_pitch_${d}`,
      nameBn: 'জেন্টল পিচ গ্লাইড (আ—উ)',
      nameEn: 'Gentle Pitch Glide (Ah-Oo)',
      category: 'pitch',
      durationSec: 120,
      instructionBn: 'নিচের সুর থেকে ওপরের সুরে নরমভাবে স্বরকে গ্লাইড করান, তারপর আবার নিচে নামান।',
      instructionEn: 'Gently slide your pitch from low to medium-high, then glide back down smoothly.',
      audioToneFrequency: 140,
      animationType: 'pitch_glide'
    },
    {
      id: `eve_rj_${d}`,
      nameBn: 'আরজে ব্রডকাস্ট রিডিং ও এআই বিশ্লেষণ',
      nameEn: 'RJ Studio Reading & AI Voice Score',
      category: 'rj_delivery',
      durationSec: 360, // 6 minutes
      instructionBn: 'মাইক্রোফোন অন করে রেডিও উপস্থাপকের মতো প্রাণবন্ত ও শান্ত কণ্ঠে স্ক্রিপ্টটি পাঠ করুন।',
      instructionEn: 'Turn on mic and read like a relaxed radio host. Pauses after key lines.',
      subInstructionBn: rjScript.titleBn,
      subInstructionEn: rjScript.titleEn,
      scriptTextBn: rjScript.textBn,
      scriptTextEn: rjScript.textEn,
      animationType: 'rj_reading'
    }
  ];

  return {
    dayNumber: d,
    stageNameBn,
    stageNameEn,
    themeBn,
    themeEn,
    focusPointBn,
    focusPointEn,
    treeStage,
    sessions: {
      morning: {
        id: 'morning',
        titleBn: 'মর্নিং ভয়েস অ্যাক্টিভেশন',
        titleEn: 'Morning Voice Activation',
        timeDefault: '08:00 AM',
        time24: '08:00',
        durationMinutes: 15,
        descriptionBn: 'শ্বাস, কাঁধ ও ল্যারিংক্স শিথিলতা এবং মৃদু হামিং দিয়ে কণ্ঠ জাগিয়ে তুলুন।',
        descriptionEn: 'Gentle breathing, neck relaxation, humming and resonance warmup.',
        icon: 'Sun',
        exercises: [
          MORNING_BREATHING_STEP,
          MORNING_NECK_SHOULDER_STEP,
          MORNING_JAW_RELAX_STEP,
          MORNING_HUMMING_STEP,
          MORNING_LIP_TRILL_STEP,
          MORNING_RESONANCE_STEP
        ]
      },
      afternoon: {
        id: 'afternoon',
        titleBn: 'আর্টিকুলেশন ও স্পষ্টতা ট্রেনিং',
        titleEn: 'Articulation & Speech Clarity',
        timeDefault: '01:00 PM',
        time24: '13:00',
        durationMinutes: 10,
        descriptionBn: 'স্বরধ্বনি অনুশীলন এবং ধীরগতির পাঠ মূল্যায়নের মাধ্যমে উচ্চারণের স্পষ্টতা বৃদ্ধি।',
        descriptionEn: 'Phonetic articulation drills and paced reading evaluation.',
        icon: 'Sparkles',
        exercises: afternoonExercises
      },
      evening: {
        id: 'evening',
        titleBn: 'আরজে ট্রেনিং ও ভয়েস স্টুডিও',
        titleEn: 'RJ Training & Voice Studio',
        timeDefault: '05:00 PM',
        time24: '17:00',
        durationMinutes: 15,
        descriptionBn: 'রেডিও স্টাইল স্ক্রিপ্ট রিডিং, পিচ গ্লাইড এবং এআই ভয়েস স্কোর অ্যানালাইসিস।',
        descriptionEn: 'Broadcast reading, emotional pauses, pitch stability & AI feedback.',
        icon: 'Mic',
        exercises: eveningExercises
      },
      night: {
        id: 'night',
        titleBn: 'নাইট রিকভারি ও স্লিপ কেয়ার',
        titleEn: 'Night Recovery & Sleep Care',
        timeDefault: '09:00 PM',
        time24: '21:00',
        durationMinutes: 10,
        descriptionBn: 'ভয়েস রেস্ট, ৪-৭-৮ স্লিপ ব্রিদিং এবং কণ্ঠের স্থায়ী সুরক্ষায় গভীর ঘুম।',
        descriptionEn: 'Vocal cords rest, 4-7-8 relaxing breath, and restorative sleep hygiene.',
        icon: 'Moon',
        exercises: NIGHT_RECOVERY_STEPS
      }
    }
  };
}
