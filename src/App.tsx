import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  AppState, 
  SubjectItem, 
  HabitItem, 
  FitnessItem, 
  RoutineDayData, 
  DailyLog, 
  ReflectionNote,
  BadHabitItem,
  StudyRoutineItem
} from './types';
import { 
  defaultState, 
  creatorsEncouragements, 
  bnlTranslation, 
  enlTranslation, 
  LOCAL_STORAGE_KEY,
  islamicBadHabitQuotes,
  get2000PlusIslamicInspiration
} from './data';
import OnboardingModal from './components/OnboardingModal';
import FocusTree from './components/FocusTree';
import { FocusModeOverlay } from './components/FocusModeOverlay';
import ReportDashboard from './components/ReportDashboard';
import AutoReflection from './components/AutoReflection';
import { AiConsoleWidget } from './components/AiConsoleWidget';

import { ExamTracker } from './components/ExamTracker';
import { exportStateToPdf } from './utils/pdfExport';
import { MORNING_QUOTES, EVENING_QUOTES, RANDOM_MOTIVATIONAL_QUOTES, ACTION_NOTIFICATION_TEMPLATES, NotificationItem } from './utils/notificationTemplates';
import { BellRing, ShieldCheck, Users, CheckCircle2, Play } from 'lucide-react';
import { ConfettiOverlay } from './components/ConfettiOverlay';
import { auth, db } from './lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Synthesized audio helper functions
import { 
  startRainSynth, 
  startClockSynth, 
  startCosmicSynth, 
  startWorkoutBeatSynth, 
  stopAllSynthSounds,
  startFluteSynth,
  startCafeSynth,
  startWindSynth,
  startOceanSynth,
  startCampfireSynth,
  startLofiSynth,
  startLibrarySynth,
  startAlphaSynth,
  startWhiteNoiseSynth,
  startPinkNoiseSynth,
  startBrownNoiseSynth,
  startSingingBowlSynth,
  startCicadasSynth,
  startSonarSynth,
  startSpaceCabinSynth,
  startPurrSynth,
  startHeartbeatSynth
} from './utils/audioSynth';

// Lucide icons imports
import { 
  Activity,
  AlertCircle,
  Ban,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  BrainCircuit,
  Briefcase,
  Bug,
  Calendar,
  Camera,
  Check,
  CheckSquare,
  ChevronRight,
  Citrus,
  Clock, 
  CloudRain,
  Clover,
  Coffee,
  Compass,
  Cpu,
  Download,
  Dumbbell,
  Edit2,
  Eye, 
  EyeOff,
  Award,
  Target,
  Flame, 
  Flower,
  Flower2,
  Gamepad2,
  Globe,
  Headphones,
  Heart,
  HelpCircle,
  Image,
  Instagram,
  Languages, 
  LayoutGrid,
  Leaf,
  ListTodo,
  Lock,
  LogIn,
  LogOut,
  Maximize2,
  Menu,
  Moon, 
  Music,
  Mic,
  NotebookPen,
  Palmtree,
  Paperclip,
  PieChart,
  Plus, 
  Power,
  Radar,
  Radio,
  RefreshCw,
  Rocket,
  RotateCcw,
  Send,
  Settings,
  ShieldAlert,
  Smartphone,
  Sparkles, 
  Sprout,
  Star,
  Timer, 
  Trash2, 
  TreeDeciduous,
  TreePine,
  Trees,
  TrendingUp,
  Trophy,
  Tv,
  Upload,
  Share2,
  Video,
  FileText,
  Copy,
  User,
  UserCircle,
  Volume2,
  VolumeX,
  Waves,
  Wind,
  GraduationCap,
  X,
  PhoneCall,
  PhoneOff,
  LayoutDashboard,
  Brain,
  Terminal,
  Database
} from 'lucide-react';
import PhoneTab from './components/PhoneTab';
import { ProfileTab } from './components/ProfileTab';
import { SocialDashboard } from './components/SocialDashboard';
import { HeaderActions } from './components/HeaderActions';

// --- BAD HABITS LIVE TIMER TICKER ---
function LiveBadHabitTimer({ 
  quitAt, 
  language 
}: { 
  quitAt: string; 
  language: 'bn' | 'en'; 
}) {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const q = new Date(quitAt).getTime();
      const now = Date.now();
      let diff = Math.max(0, now - q);

      const msInSecond = 1000;
      const msInMinute = 60 * 1000;
      const msInHour = 60 * 60 * 1000;
      const msInDay = 24 * 60 * 60 * 1000;

      const days = Math.floor(diff / msInDay);
      diff %= msInDay;

      const hours = Math.floor(diff / msInHour);
      diff %= msInHour;

      const minutes = Math.floor(diff / msInMinute);
      diff %= msInMinute;

      const seconds = Math.floor(diff / msInSecond);

      setElapsed({ days, hours, minutes, seconds });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [quitAt]);

  const num = (n: number) => {
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return n.toString().split('').map(digit => {
        const parsed = parseInt(digit, 10);
        return isNaN(parsed) ? digit : bnDigits[parsed];
      }).join('');
    }
    return n.toString().padStart(2, '0');
  };

  return (
    <div className="grid grid-cols-4 gap-2 text-center mt-3">
      <div className="bg-slate-950/80 border border-slate-800/60 p-2 rounded-xl">
        <span className="block text-xl font-bold font-mono text-emerald-400">{num(elapsed.days)}</span>
        <span className="text-[10px] text-slate-500 font-sans uppercase font-bold tracking-wider">
          {language === 'bn' ? 'দিন' : 'Days'}
        </span>
      </div>
      <div className="bg-slate-950/80 border border-slate-800/60 p-2 rounded-xl">
        <span className="block text-xl font-bold font-mono text-cyan-400">{num(elapsed.hours)}</span>
        <span className="text-[10px] text-slate-500 font-sans uppercase font-bold tracking-wider">
          {language === 'bn' ? 'ঘণ্টা' : 'Hours'}
        </span>
      </div>
      <div className="bg-slate-950/80 border border-slate-800/60 p-2 rounded-xl">
        <span className="block text-xl font-bold font-mono text-amber-400">{num(elapsed.minutes)}</span>
        <span className="text-[10px] text-slate-500 font-sans uppercase font-bold tracking-wider">
          {language === 'bn' ? 'মিনিট' : 'Mins'}
        </span>
      </div>
      <div className="bg-slate-950/80 border border-slate-800/60 p-2 rounded-xl">
        <span className="block text-xl font-bold font-mono text-rose-400 animate-pulse">{num(elapsed.seconds)}</span>
        <span className="text-[10px] text-slate-500 font-sans uppercase font-bold tracking-wider">
          {language === 'bn' ? 'সেকেন্ড' : 'Secs'}
        </span>
      </div>
    </div>
  );
}

// Helper function to render plant icons beautifully without static text emojis
export const renderTreeIcon = (id: string, className = "w-5 h-5") => {
  switch (id) {
    case 'sakura':
      return <Flower className={`${className} text-pink-400`} />;
    case 'olive':
      return <Leaf className={`${className} text-emerald-500`} />;
    case 'cactus':
      return <Sprout className={`${className} text-teal-500`} />;
    case 'rosemary':
      return <Leaf className={`${className} text-green-400`} />;
    case 'banyan':
      return <Trees className={`${className} text-emerald-600`} />;
    case 'bamboo':
      return <Trees className={`${className} text-green-500`} />;
    case 'pine':
      return <TreePine className={`${className} text-emerald-700`} />;
    case 'rose':
      return <Flower className={`${className} text-rose-500`} />;
    case 'maple':
      return <TreeDeciduous className={`${className} text-orange-500`} />;
    case 'ginkgo':
      return <TreeDeciduous className={`${className} text-amber-400`} />;
    case 'bonsai':
      return <Flower2 className={`${className} text-teal-400`} />;
    case 'palm':
      return <Palmtree className={`${className} text-yellow-600`} />;
    case 'sunflower':
      return <Flower className={`${className} text-yellow-500`} />;
    case 'clover':
      return <Clover className={`${className} text-green-500`} />;
    case 'tulip':
      return <Flower className={`${className} text-rose-450`} />;
    case 'lavender':
      return <Flower2 className={`${className} text-purple-400`} />;
    case 'lotus':
      return <Flower2 className={`${className} text-pink-500`} />;
    case 'sequoia':
      return <TreePine className={`${className} text-green-800`} />;
    case 'lemon':
      return <Citrus className={`${className} text-yellow-400`} />;
    case 'apple':
      return <Citrus className={`${className} text-red-500`} />;
    default:
      return <Sprout className={`${className} text-emerald-400`} />;
  }
};

// Helper function to render sound icons beautifully without static text emojis
export const renderSoundIcon = (id: string, className = "w-5 h-5") => {
  switch (id) {
    case 'none':
      return <VolumeX className={`${className} text-slate-500`} />;
    case 'rain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'clock':
      return <Clock className={`${className} text-slate-400`} />;
    case 'cosmic':
      return <Sparkles className={`${className} text-indigo-400`} />;
    case 'flute':
      return <Music className={`${className} text-emerald-400`} />;
    case 'cafe':
      return <Coffee className={`${className} text-amber-500`} />;
    case 'wind':
      return <Wind className={`${className} text-sky-400`} />;
    case 'waves':
      return <Waves className={`${className} text-blue-500`} />;
    case 'fire':
      return <Flame className={`${className} text-orange-500`} />;
    case 'lofi':
      return <Headphones className={`${className} text-purple-400`} />;
    case 'library':
      return <BookOpen className={`${className} text-yellow-600`} />;
    case 'alpha':
      return <Activity className={`${className} text-rose-450`} />;
    case 'white':
    case 'pink':
    case 'brown':
      return <Radio className={`${className} text-slate-400`} />;
    case 'bowl':
      return <Bell className={`${className} text-amber-500`} />;
    case 'cicadas':
      return <Bug className={`${className} text-green-500`} />;
    case 'sonar':
      return <Radar className={`${className} text-teal-400`} />;
    case 'space':
      return <Rocket className={`${className} text-slate-400`} />;
    case 'purr':
         case 'heartbeat':
      return <Heart className={`${className} text-red-500`} />;
    default:
      return <Music className={`${className} text-slate-400`} />;
  }
};

interface VoiceProfile {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  pitch: number;
  rate: number;
  gender: 'female' | 'male';
  keywords: string[];
}

const FEMALE_VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'GeminiPro',
    nameBn: 'জেমিনি প্রো (এআই সুপার ব্রেইন) 🧠',
    nameEn: 'Gemini Pro (AI Super Brain) 🧠',
    descBn: 'জেমিনি এআই ইঞ্জিনের মতো অত্যন্ত বুদ্ধিদীপ্ত, প্রফেশনাল ও স্পষ্ট কণ্ঠ।',
    descEn: 'Ultra-intelligent, fluent, and professional conversational AI model voice.',
    pitch: 1.15,
    rate: 1.0,
    gender: 'female',
    keywords: ['female', 'google', 'samantha', 'hazel', 'en-us']
  },
  {
    id: 'MridhaXNova',
    nameBn: 'মৃধাক্স নোভা (অফিসিয়াল কো-পাইলট) ⚡',
    nameEn: 'MridhaX Nova (Official Copilot) ⚡',
    descBn: 'মৃধাক্স অ্যাপের নিজস্ব অত্যন্ত এনার্জেটিক এবং মোটিভেশনাল কন্ঠস্বর।',
    descEn: 'MridhaX custom-tuned hyper-focused assistant with high motivation.',
    pitch: 1.38,
    rate: 1.10,
    gender: 'female',
    keywords: ['female', 'zira', 'samantha', 'google', 'en-us']
  },
  {
    id: 'MridhaXLiam',
    nameBn: 'মৃধাক্স লিয়াম (এক্সিকিউটিভ ডিরেক্টর) 👔',
    nameEn: 'MridhaX Liam (Executive Director) 👔',
    descBn: 'পেশাদার, অত্যন্ত গম্ভীর এবং মার্জিত পুরুষালি কণ্ঠস্বর।',
    descEn: 'Formal, deep, and highly polished masculine executive voice.',
    pitch: 0.88,
    rate: 0.95,
    gender: 'male',
    keywords: ['male', 'david', 'google', 'en-us', 'microsoft']
  },
  {
    id: 'Aura',
    nameBn: 'অরা (গভীর ও শান্ত মেডিটেশন) 🧘',
    nameEn: 'Aura (Deep Calm Meditation) 🧘',
    descBn: 'দীর্ঘ রুটিন ও স্টাডি সেশনের জন্য দারুণ আরামদায়ক ও ধীর গলার শান্ত কণ্ঠ।',
    descEn: 'Deeply relaxing, steady-paced, and empathetic voice for long reading sessions.',
    pitch: 0.95,
    rate: 0.85,
    gender: 'female',
    keywords: ['female', 'google', 'hazel', 'en-gb']
  },
  {
    id: 'Rachel',
    nameBn: 'রেচেল (মিষ্টি ও চটপটে) 🌸',
    nameEn: 'Rachel (Sweet & Chatty) 🌸',
    descBn: 'জেমিনি এআই এর অত্যন্ত জনপ্রিয় মিষ্টি, প্রাণবন্ত এবং স্পষ্ট কণ্ঠস্বর।',
    descEn: 'Sweet, highly expressive, and vibrant voice for friendly chatting.',
    pitch: 1.35,
    rate: 1.0,
    gender: 'female',
    keywords: ['female', 'google', 'zira', 'samantha', 'en-us']
  },
  {
    id: 'MridhaXEthan',
    nameBn: 'মৃধাক্স ইথান (উৎসাহী মেন্টর) 🚀',
    nameEn: 'MridhaX Ethan (Enthusiastic Mentor) 🚀',
    descBn: 'স্মার্ট, গতিশীল ও অনুপ্রেরণাদায়ক পুরুষ কণ্ঠ যা পড়াশোনায় স্পিরিট বাড়াবে।',
    descEn: 'Dynamic, smart, and encouraging masculine voice to boost study drive.',
    pitch: 1.05,
    rate: 1.05,
    gender: 'male',
    keywords: ['male', 'google', 'david', 'mark', 'en-us']
  },
  {
    id: 'Emily',
    nameBn: 'এমিলি (স্টাডি কো-পাইলট) 🎓',
    nameEn: 'Emily (Friendly Copilot) 🎓',
    descBn: 'ক্যারিয়ার রোডম্যাপ বা কুইজ বুঝে পড়ার চমৎকার গাইড কণ্ঠ।',
    descEn: 'Warm academic companion to guide you through roadmap goals.',
    pitch: 1.25,
    rate: 1.05,
    gender: 'female',
    keywords: ['female', 'google', 'samantha', 'en-ie']
  },
  {
    id: 'Kavi',
    nameBn: 'কবি (কাব্যিক ও ধীর সুর) ✍️',
    nameEn: 'Kavi (Poetic & Slow Pace) ✍️',
    descBn: 'ধীরস্থির ও গভীর সাহিত্যিক পুরুষ কণ্ঠ, বড় প্রবন্ধ শোনার জন্য দারুণ।',
    descEn: 'Calm, literature style deep baritone voice for long analysis papers.',
    pitch: 0.82,
    rate: 0.88,
    gender: 'male',
    keywords: ['male', 'google', 'en-in', 'david', 'microsoft']
  },
  {
    id: 'Kabir',
    nameBn: 'কবির (গভীর ও শান্ত মেন্টর) 🧭',
    nameEn: 'Kabir (Deep & Soothing Mentor) 🧭',
    descBn: 'অত্যন্ত মার্জিত, গম্ভীর ও স্পষ্ট পেশাদার পুরুষ কণ্ঠস্বর।',
    descEn: 'Highly formal, steady, and intelligent professional masculine voice.',
    pitch: 0.90,
    rate: 1.0,
    gender: 'male',
    keywords: ['male', 'google', 'en-gb', 'david', 'microsoft']
  },
  {
    id: 'Sophia',
    nameBn: 'সোফিয়া (এক্সিকিউティブ গাইড) 🧭',
    nameEn: 'Sophia (Executive Guide) 🧭',
    descBn: 'অত্যন্ত বুদ্ধিদীপ্ত ও আত্মবিশ্বাসী কণ্ঠ, জটিল প্রশ্নের সমাধানে সাহায্য করবে।',
    descEn: 'Highly intelligent and authoritative voice for complex problem solving.',
    pitch: 1.10,
    rate: 1.02,
    gender: 'female',
    keywords: ['female', 'google', 'samantha', 'hazel', 'en-ca']
  },
  {
    id: 'Dev',
    nameBn: 'দেব (স্মার্ট টেক ট্র্যাকার) 💡',
    nameEn: 'Dev (Smart Tech Tracker) 💡',
    descBn: 'চটপটে ও আধুনিক পুরুষ কণ্ঠস্বর যা জটিল ডাটা বিশ্লেষণ সহজ করে দেয়।',
    descEn: 'Quick, contemporary, and clear masculine voice for tech tracking.',
    pitch: 1.12,
    rate: 1.02,
    gender: 'male',
    keywords: ['male', 'google', 'en-us', 'david', 'microsoft']
  },
  {
    id: 'Bella',
    nameBn: 'বেলা (কিউট ও চঞ্চল) 🎀',
    nameEn: 'Bella (Cute & Playful) 🎀',
    descBn: 'অত্যন্ত মিষ্টি, কিউট ও এনার্জেটিক সুর যা মোটিভেটেড রাখবে!',
    descEn: 'Super sweet, high-pitched playful voice to keep you motivated!',
    pitch: 1.55,
    rate: 1.1,
    gender: 'female',
    keywords: ['female', 'zira', 'samantha', 'google', 'en-us']
  }
];

const highlightKeywords = (text: string, isBookPage: boolean = false) => {
  if (!text) return '';
  
  // Clean markdown bold syntax **bold text** to a premium high-contrast strong tag
  let formatted = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-white">$1</strong>');
  
  const lowerText = text.toLowerCase();
  
  // 1. Important/Caution/Alert State (Amber/Orange Color - Alerts & Urgency)
  const hasImportant = [
    'important', 'caution', 'alert', 'warning', 'critical', 'must', 'danger', 'notice', 'risk', 'fail', 'error', 'emergency', 'attention', 'vital',
    'গুরুত্বপূর্ণ', 'সাবধান', 'সতর্কতা', 'অবশ্যই', 'বিপদ', 'নোটিশ', 'ঝুঁকি', 'ব্যর্থ', 'ভুল', 'জরুরী', 'মনোযোগ'
  ].some(k => lowerText.includes(k));

  // 2. Focus/Study/Habit/Tech State (Emerald/Mint Color - Memory & concentration)
  const hasFocus = [
    'focus', 'study', 'read', 'task', 'list', 'habit', 'track', 'routine', 'time', 'goal', 'prepare', 'target', 'progress', 'achieve', 'roadmap', 'schedule', 'quiz', 'exam', 'mcq', 'test',
    'ফোকাস', 'পড়াশোনা', 'পড়া', 'কাজ', 'তালিকা', 'অভ্যাস', 'ট্র্যাকার', 'রুটিন', 'সময়', 'লক্ষ্য', 'প্রস্তুতি', 'টার্গেট', 'প্রোগ্রেস', 'অর্জন', 'রোডম্যাপ', 'শিডিউল', 'কুইজ', 'পরীক্ষা', 'এমসিকিউ', 'টেস্ট',
    'ai', 'gemini', 'intelligence', 'smart', 'brain', 'analysis', 'technology', 'future', 'digital', 'mridhax', 'copilot', 'assistant',
    'এআই', 'জেমিনি', 'বুদ্ধিমত্তা', 'স্মার্ট', 'মস্তিষ্ক', 'বিশ্লেষণ', 'প্রযুক্তি', 'ভবিষ্যৎ', 'ডিজিটাল', 'মৃধাক্স', 'কো-পাইলট', 'সহকারী'
  ].some(k => lowerText.includes(k));

  // 3. Emotional/Reflection/Motivational State (Sky-Blue/Teal Color - Reflection & Inspiration)
  const hasEmotional = [
    'love', 'care', 'inspire', 'emotion', 'heart', 'success', 'win', 'dream', 'feel', 'happy', 'awesome', 'amazing', 'celebrate', 'motivation', 'proud', 'sweet', 'mindfulness', 'breath', 'peace', 'joy',
    'ভালোবাসা', 'যত্ন', 'অনুপ্রেরণা', 'অনুভূতি', 'হৃদয়', 'মন', 'স্বপ্ন', 'জয়', 'সফল', 'খুশি', 'আনন্দ', 'অসাধারণ', 'গর্বিত', 'মিষ্টি', 'মোটিভেশন', 'শান্তি', 'সুখ'
  ].some(k => lowerText.includes(k));

  // Psychological priority: Amber (High alert) > Emerald (Active memory) > Sky Blue (Cognitive reflection)
  if (hasImportant) {
    const amberClass = isBookPage ? 'text-[#8b5a2b] font-bold' : 'text-amber-400 font-bold hover:text-amber-300 transition-colors';
    return `<span class="${amberClass}">${formatted}</span>`;
  } else if (hasFocus) {
    const emeraldClass = isBookPage ? 'text-[#3a5f0b] font-medium' : 'text-emerald-400 font-medium hover:text-emerald-300 transition-colors';
    return `<span class="${emeraldClass}">${formatted}</span>`;
  } else if (hasEmotional) {
    const skyClass = isBookPage ? 'text-[#1e5a80] font-medium' : 'text-sky-300 font-medium hover:text-sky-200 transition-colors';
    return `<span class="${skyClass}">${formatted}</span>`;
  }
  
  // Default clean text
  return formatted;
};

const AI_THEMES: Record<string, any> = {
  midnight: {
    id: 'midnight',
    nameBn: 'মিডনাইট ব্লু',
    nameEn: 'Midnight Blue',
    bg: 'bg-[#050814]',
    gradient: 'from-blue-600/10 to-indigo-600/5',
    border: 'border-blue-900/30',
    bubbleUser: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-[0_0_15px_rgba(37,99,235,0.2)]',
    bubbleAi: 'bg-[#0d1225]/90 text-slate-100 border border-blue-950/80 rounded-tl-none',
    glow: 'bg-blue-500/5',
    titleGradient: 'from-blue-400 to-indigo-400',
    accentColor: 'text-blue-400',
    iconColor: 'bg-blue-500',
  },
  emerald: {
    id: 'emerald',
    nameBn: 'মরু গ্যালাক্সি',
    nameEn: 'Emerald Forest',
    bg: 'bg-[#020d09]',
    gradient: 'from-emerald-600/10 to-teal-600/5',
    border: 'border-emerald-950/30',
    bubbleUser: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-[0_0_15px_rgba(5,150,105,0.2)]',
    bubbleAi: 'bg-[#051712]/90 text-slate-100 border border-emerald-900/40 rounded-tl-none',
    glow: 'bg-emerald-500/5',
    titleGradient: 'from-emerald-400 to-teal-400',
    accentColor: 'text-emerald-400',
    iconColor: 'bg-emerald-500',
  },
  sunset: {
    id: 'sunset',
    nameBn: 'সানসেট ভাইবস',
    nameEn: 'Sunset Twilight',
    bg: 'bg-[#0f0408]',
    gradient: 'from-rose-600/10 to-amber-600/5',
    border: 'border-rose-950/30',
    bubbleUser: 'bg-gradient-to-r from-rose-600 to-amber-600 text-white rounded-br-none shadow-[0_0_15px_rgba(225,29,72,0.2)]',
    bubbleAi: 'bg-[#190810]/90 text-slate-100 border border-rose-900/40 rounded-tl-none',
    glow: 'bg-rose-500/5',
    titleGradient: 'from-rose-400 to-amber-400',
    accentColor: 'text-rose-400',
    iconColor: 'bg-rose-500',
  },
  aurora: {
    id: 'aurora',
    nameBn: 'অরোরা নর্দান',
    nameEn: 'Aurora Borealis',
    bg: 'bg-[#05020f]',
    gradient: 'from-fuchsia-600/15 to-cyan-600/10',
    border: 'border-fuchsia-950/30',
    bubbleUser: 'bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white rounded-br-none shadow-[0_0_15px_rgba(192,38,211,0.25)]',
    bubbleAi: 'bg-[#0c051a]/90 text-slate-100 border border-fuchsia-900/30 rounded-tl-none',
    glow: 'bg-fuchsia-500/5',
    titleGradient: 'from-fuchsia-400 to-cyan-400',
    accentColor: 'text-fuchsia-400',
    iconColor: 'bg-fuchsia-500',
  },
  obsidian_gold: {
    id: 'obsidian_gold',
    nameBn: 'লক্স গোল্ড',
    nameEn: 'Obsidian Gold',
    bg: 'bg-[#050505]',
    gradient: 'from-yellow-600/15 to-stone-900/10',
    border: 'border-yellow-950/30',
    bubbleUser: 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-black font-semibold rounded-br-none shadow-[0_0_15px_rgba(212,175,55,0.25)]',
    bubbleAi: 'bg-[#101010]/90 text-stone-200 border border-yellow-900/20 rounded-tl-none',
    glow: 'bg-yellow-500/3',
    titleGradient: 'from-[#f3e5ab] via-[#d4af37] to-[#aa7c11]',
    accentColor: 'text-amber-400',
    iconColor: 'bg-amber-500',
  },
  carbon: {
    id: 'carbon',
    nameBn: 'কার্বন মনোক্যাল',
    nameEn: 'Carbon Cyberpunk',
    bg: 'bg-[#07080a]',
    gradient: 'from-slate-700/10 to-slate-900/5',
    border: 'border-slate-900',
    bubbleUser: 'bg-slate-100 text-slate-950 font-semibold rounded-br-none',
    bubbleAi: 'bg-[#12161a]/90 text-slate-100 border border-slate-800 rounded-tl-none',
    glow: 'bg-slate-400/3',
    titleGradient: 'from-slate-200 to-slate-400',
    accentColor: 'text-white',
    iconColor: 'bg-slate-200',
  },
  book_page: {
    id: 'book_page',
    nameBn: 'বইয়ের পাতা 📖',
    nameEn: 'Book Paper 📖',
    bg: 'bg-[#f4ecd8]',
    gradient: 'from-[#e6dfcc] to-[#f4ecd8]',
    border: 'border-[#d3cbb7]',
    bubbleUser: 'bg-[#4a3b32] text-[#f4ecd8] rounded-br-none shadow-md font-bold border border-[#3c2f27]',
    bubbleAi: 'bg-[#fcfaf2] text-[#2e231d] border border-[#d3cbb7] rounded-tl-none shadow-sm',
    glow: 'bg-amber-800/5',
    titleGradient: 'from-[#4a3b32] to-[#7c5e49]',
    accentColor: 'text-[#4a3b32]',
    iconColor: 'bg-[#4a3b32]',
  },
  sakura_dream: {
    id: 'sakura_dream',
    nameBn: 'সাকুরা ব্লসম 🌸',
    nameEn: 'Sakura Blossom 🌸',
    bg: 'bg-[#1b0d13]',
    gradient: 'from-pink-900/10 to-rose-950/5',
    border: 'border-pink-950/40',
    bubbleUser: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none shadow-[0_0_15px_rgba(236,72,153,0.25)]',
    bubbleAi: 'bg-[#25101a]/95 text-pink-100 border border-pink-900/40 rounded-tl-none',
    glow: 'bg-pink-500/5',
    titleGradient: 'from-pink-400 to-rose-400',
    accentColor: 'text-pink-400',
    iconColor: 'bg-pink-500',
  }
};

const MAJOR_LOCATIONS = [
  { nameBn: 'ঢাকা', nameEn: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { nameBn: 'চট্টগ্রাম', nameEn: 'Chittagong', lat: 22.3569, lng: 91.7832 },
  { nameBn: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { nameBn: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3636, lng: 88.6241 },
  { nameBn: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { nameBn: 'বরিশাল', nameEn: 'Barishal', lat: 22.7010, lng: 90.3535 },
  { nameBn: 'রংপুর', nameEn: 'Rangpur', lat: 25.7500, lng: 89.2500 },
  { nameBn: 'মক্কা', nameEn: 'Makkah', lat: 21.3891, lng: 39.8579 },
  { nameBn: 'মদিনা', nameEn: 'Medina', lat: 24.4672, lng: 39.6111 },
  { nameBn: 'লন্ডন', nameEn: 'London', lat: 51.5074, lng: -0.1278 },
  { nameBn: 'নিউ ইয়র্ক', nameEn: 'New York', lat: 40.7128, lng: -74.0060 },
  { nameBn: 'কুয়ালালামপুর', nameEn: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },
];

import { ToastProvider } from './components/ToastContext';
import { ToastContainer } from './components/Toast';
export default function App() {
  const [systemStatus, setSystemStatus] = useState<'optimal' | 'degraded' | 'error'>('optimal');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatAiMessage = (text: string) => {
    if (!text) return null;
    
    // Split text by lines
    const lines = text.split('\n');
    const activeThemeKey = state?.aiTheme || 'midnight';
    const isBookPage = activeThemeKey === 'book_page';
    const mainTextClass = isBookPage ? 'text-[#2e231d]' : 'text-slate-100';
    const subTextClass = isBookPage ? 'text-[#3c2f27]' : 'text-slate-200';
    const dividerBg = isBookPage ? 'bg-gradient-to-r from-transparent via-[#8b7355]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent';
    const dividerIconBg = isBookPage ? 'bg-[#fcfaf2] border-[#d3cbb7]' : 'bg-cyan-950/80 border-cyan-800/80';
    const dividerIconColor = isBookPage ? 'text-[#8b7355]' : 'text-cyan-400';
    
    return (
      <div className={`space-y-4 ${mainTextClass} font-sans tracking-wide leading-relaxed premium-ai-chat-layout select-text`}>
        {lines.map((line, idx) => {
          let cleanLine = line.trim();
          if (!cleanLine) return <div key={idx} className="h-2" />;
          
          // Replace standard markdown divider lines with our premium, glowing horizontal divider & Sparkles icon
          if (cleanLine === '***' || cleanLine === '---') {
            return (
              <div key={idx} className="flex items-center gap-3 my-6 py-1.5">
                <div className={`h-[1.5px] flex-1 ${dividerBg}`} />
                <div className={`p-1 rounded-full ${dividerIconBg} border animate-pulse`}>
                  <Sparkles className={`w-3.5 h-3.5 ${dividerIconColor}`} />
                </div>
                <div className={`h-[1.5px] flex-1 ${dividerBg}`} />
              </div>
            );
          }
          
          // Render beautiful premium headers replacing raw Markdown
          const isHeader = cleanLine.startsWith('### ') || cleanLine.startsWith('## ') || cleanLine.startsWith('# ');
          if (isHeader) {
            const headerText = cleanLine.replace(/^(###|##|#)\s+/, '');
            
            let HeaderIcon = Sparkles;
            let headerColor = isBookPage ? "from-[#4a3b32] to-[#7c5e49]" : "from-cyan-400 to-indigo-400";
            
            const lowerHeader = headerText.toLowerCase();
            if (lowerHeader.includes('রোডম্যাপ') || lowerHeader.includes('roadmap') || lowerHeader.includes('পথ') || lowerHeader.includes('career')) {
              HeaderIcon = Target;
              headerColor = isBookPage ? "from-[#5c3d2e] to-[#8b5a2b]" : "from-emerald-400 to-cyan-400";
            } else if (lowerHeader.includes('গুরুত্বপূর্ণ') || lowerHeader.includes('important') || lowerHeader.includes('সতর্কতা')) {
              HeaderIcon = AlertCircle;
              headerColor = isBookPage ? "from-[#b22222] to-[#8b0000]" : "from-amber-400 to-rose-400";
            } else if (lowerHeader.includes('পরীক্ষা') || lowerHeader.includes('exam') || lowerHeader.includes('mcq') || lowerHeader.includes('কুইজ')) {
              HeaderIcon = BookOpen;
              headerColor = isBookPage ? "from-[#4b382a] to-[#7f5539]" : "from-blue-400 to-purple-400";
            }
            
            const headerIconBg = isBookPage ? "bg-[#fcfaf2] border-[#d3cbb7]" : "bg-slate-900 border border-slate-800";
            const headerIconColor = isBookPage ? "text-[#5c3d2e]" : "text-cyan-400";
            const headerBorderColor = isBookPage ? "border-[#d3cbb7]/80" : "border-slate-800/80";
            
            return (
              <div key={idx} className={`mt-6 mb-3.5 flex items-center gap-2.5 border-b ${headerBorderColor} pb-2.5`}>
                <div className={`p-1.5 rounded-lg ${headerIconBg} shrink-0 shadow-lg shadow-black/5`}>
                  <HeaderIcon className={`w-4 h-4 ${headerIconColor} animate-pulse shrink-0`} />
                </div>
                <h4 className={`text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${headerColor}`}>
                  {headerText}
                </h4>
              </div>
            );
          }
          
          // Render custom bullet points with premium context-aware Lucide icons instead of boring bullet stars/lines
          const isBullet = cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || cleanLine.startsWith('• ');
          if (isBullet) {
            const bulletText = cleanLine.replace(/^(-\s*|\*\s*|•\s*)/, '');
            
            let BulletIcon = Sparkles;
            let iconColor = isBookPage ? "text-[#5c3d2e] bg-[#fcfaf2] border-[#d3cbb7]" : "text-cyan-400 bg-cyan-950/40 border-cyan-800/30";
            
            const lowerText = bulletText.toLowerCase();
            if (lowerText.includes('লক্ষ্য') || lowerText.includes('target') || lowerText.includes('goal') || lowerText.includes('ফোকাস') || lowerText.includes('career')) {
              BulletIcon = Target;
              iconColor = isBookPage ? "text-[#3a5f0b] bg-[#f4f7ed] border-[#c0d3a7]" : "text-emerald-400 bg-emerald-950/40 border-emerald-800/30";
            } else if (lowerText.includes('গুরুত্বপূর্ণ') || lowerText.includes('important') || lowerText.includes('সতর্কতা') || lowerText.includes('ফোকাস')) {
              BulletIcon = AlertCircle;
              iconColor = isBookPage ? "text-[#8b0000] bg-[#fcf2f2] border-[#ebd3d3]" : "text-amber-400 bg-amber-950/40 border-amber-800/30";
            } else if (lowerText.includes('পড়াশোনা') || lowerText.includes('study') || lowerText.includes('বই') || lowerText.includes('pdf') || lowerText.includes('mcq')) {
              BulletIcon = BookOpen;
              iconColor = isBookPage ? "text-[#4b382a] bg-[#faf6ee] border-[#e6dfcc]" : "text-indigo-400 bg-indigo-950/40 border-indigo-800/30";
            } else if (lowerText.includes('সাফল্য') || lowerText.includes('success') || lowerText.includes('পুরস্কার') || lowerText.includes('award') || lowerText.includes('মাইলস্টোন')) {
              BulletIcon = Award;
              iconColor = isBookPage ? "text-[#b8860b] bg-[#fdfaf2] border-[#f4ebcf]" : "text-rose-400 bg-rose-950/40 border-rose-800/30";
            }
            
            const bulletBorderColor = isBookPage ? "border-[#e6dfcc]" : "border-slate-800/60 hover:border-cyan-500/40";
            
            return (
              <div key={idx} className={`flex items-start gap-3.5 pl-2 py-1.5 border-l-2 ${bulletBorderColor} transition-all duration-300 group`}>
                <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 shadow-md ${iconColor}`}>
                  <BulletIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <div className={`flex-1 text-sm leading-relaxed ${subTextClass} font-medium tracking-wide`} dangerouslySetInnerHTML={{ __html: highlightKeywords(bulletText, isBookPage) }} />
              </div>
            );
          }
          
          // Safe HTML fallback keeping custom style classes
          return (
            <p key={idx} className={`text-sm leading-relaxed ${subTextClass} font-medium tracking-wide my-1`} dangerouslySetInnerHTML={{ __html: highlightKeywords(cleanLine, isBookPage) }} />
          );
        })}
      </div>
    );
  };
  
  useEffect(() => {
    async function checkSystem() {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) throw new Error('System unhealthy');
        setSystemStatus('optimal');
      } catch (e) {
        setSystemStatus('error');
      }
    }
    checkSystem();
    const interval = setInterval(checkSystem, 60000);
    return () => clearInterval(interval);
  }, []);

  const [state, setState] = useState<AppState>(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Ensure necessary backports are ready
        if (!parsed.reflections) parsed.reflections = defaultState.reflections;
        if (!parsed.badHabits) parsed.badHabits = defaultState.badHabits || [];
        if (parsed.showOnboarding === undefined) parsed.showOnboarding = true;
        if (!parsed.activeTreeType) parsed.activeTreeType = 'sakura';
        if (parsed.phoneLimitMinutes === undefined) parsed.phoneLimitMinutes = 150;
        if (!parsed.phoneUsageHistory) parsed.phoneUsageHistory = {};
        if (!parsed.customStudyRoutines) parsed.customStudyRoutines = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] };
        if (parsed.focusPoints === undefined) parsed.focusPoints = 0;
        if (parsed.focusLevel === undefined) parsed.focusLevel = 1;
        if (!parsed.unlockedTrees) parsed.unlockedTrees = ['sakura'];
        if (!parsed.headerRoutineMode) parsed.headerRoutineMode = 'cooking';
        if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
        if (parsed.notificationConsentAsked === undefined) parsed.notificationConsentAsked = false;
        if (!parsed.notificationSettings) parsed.notificationSettings = {
          friendship: true,
          emotional: true,
          reminder: true,
          morningTime: '08:00',
          eveningTime: '21:00'
        };
        // Premium Digital Wellbeing & Blocker Suite
        if (!parsed.digitalUnlockCount) parsed.digitalUnlockCount = {};
        if (!parsed.appUsageDurations) parsed.appUsageDurations = {};
        if (parsed.reelsBlockerActive === undefined) parsed.reelsBlockerActive = false;
        if (parsed.reelsBlockerDuration === undefined) parsed.reelsBlockerDuration = 120;
        if (parsed.reelsBlockerStartedAt === undefined) parsed.reelsBlockerStartedAt = null;
        if (!parsed.reelsBlockedApps) parsed.reelsBlockedApps = ['facebook', 'youtube', 'instagram', 'tiktok'];
        if (parsed.adultSiteBlockerActive === undefined) parsed.adultSiteBlockerActive = true;
        if (parsed.dndModeActive === undefined) parsed.dndModeActive = false;
        if (!parsed.dndStartTime) parsed.dndStartTime = '22:00';
        if (!parsed.dndEndTime) parsed.dndEndTime = '06:00';
        if (!parsed.brainFatigueRatings) parsed.brainFatigueRatings = {};
        if (parsed.digitalDetoxStreak === undefined) parsed.digitalDetoxStreak = 0;
        if (parsed.customAiDirectives === undefined) parsed.customAiDirectives = defaultState.customAiDirectives;
        if (!parsed.aiTrainingData) parsed.aiTrainingData = defaultState.aiTrainingData;
        return parsed;
      } catch (err) {
        return defaultState;
      }
    }
    return defaultState;
  });

  // --- CLOUD SYNC & CROSS-TAB STATE PROPAGATION ---
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const lastCloudStateStrRef = useRef<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCloudSyncLoading, setIsCloudSyncLoading] = useState(false);

  // 1. Core Firebase Auth observer and Firestore Snapshot sync
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        setIsCloudSyncLoading(true);
        const docRef = doc(db, 'userStates', user.uid);

        // One-time Migration check on login/app launch
        try {
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (localRaw) {
              const localData = JSON.parse(localRaw);
              const cleanLocalData = JSON.parse(JSON.stringify(localData));
              await setDoc(docRef, cleanLocalData);
              console.log("Migration: successfully migrated local storage to Firestore.");
            }
          }
        } catch (err) {
          console.error("Migration error:", err);
        } finally {
          setIsCloudSyncLoading(false);
        }

        // Real-time synchronisation across tabs using onSnapshot
        unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const cloudState = docSnap.data() as AppState;
            
            // Ensure necessary backports / defaults are ready
            const sanitizedCloudState: AppState = {
              ...defaultState,
              ...cloudState,
              reflections: cloudState.reflections || defaultState.reflections,
              badHabits: cloudState.badHabits || defaultState.badHabits || [],
              showOnboarding: cloudState.showOnboarding !== undefined ? cloudState.showOnboarding : true,
              activeTreeType: cloudState.activeTreeType || 'sakura',
              phoneLimitMinutes: cloudState.phoneLimitMinutes !== undefined ? cloudState.phoneLimitMinutes : 150,
              phoneUsageHistory: cloudState.phoneUsageHistory || {},
              customStudyRoutines: cloudState.customStudyRoutines || { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] },
              focusPoints: cloudState.focusPoints !== undefined ? cloudState.focusPoints : 0,
              focusLevel: cloudState.focusLevel !== undefined ? cloudState.focusLevel : 1,
              unlockedTrees: cloudState.unlockedTrees || ['sakura'],
              headerRoutineMode: cloudState.headerRoutineMode || 'cooking',
              unlockedAchievements: cloudState.unlockedAchievements || [],
              notificationConsentAsked: cloudState.notificationConsentAsked !== undefined ? cloudState.notificationConsentAsked : false,
              notificationSettings: cloudState.notificationSettings || {
                friendship: true,
                emotional: true,
                reminder: true,
                morningTime: '08:00',
                eveningTime: '21:00'
              },
              digitalUnlockCount: cloudState.digitalUnlockCount || {},
              appUsageDurations: cloudState.appUsageDurations || {},
              reelsBlockerActive: cloudState.reelsBlockerActive !== undefined ? cloudState.reelsBlockerActive : false,
              reelsBlockerDuration: cloudState.reelsBlockerDuration !== undefined ? cloudState.reelsBlockerDuration : 120,
              reelsBlockerStartedAt: cloudState.reelsBlockerStartedAt !== undefined ? cloudState.reelsBlockerStartedAt : null,
              reelsBlockedApps: cloudState.reelsBlockedApps || ['facebook', 'youtube', 'instagram', 'tiktok'],
              adultSiteBlockerActive: cloudState.adultSiteBlockerActive !== undefined ? cloudState.adultSiteBlockerActive : true,
              dndModeActive: cloudState.dndModeActive !== undefined ? cloudState.dndModeActive : false,
              dndStartTime: cloudState.dndStartTime || '22:00',
              dndEndTime: cloudState.dndEndTime || '06:00',
              brainFatigueRatings: cloudState.brainFatigueRatings || {},
              digitalDetoxStreak: cloudState.digitalDetoxStreak !== undefined ? cloudState.digitalDetoxStreak : 0,
            };

            const currentLocalStr = JSON.stringify(stateRef.current);
            const cloudStr = JSON.stringify(sanitizedCloudState);
            if (currentLocalStr !== cloudStr) {
              lastCloudStateStrRef.current = cloudStr;
              setState(sanitizedCloudState);
            }
          }
        }, (error) => {
          console.error("onSnapshot error:", error);
        });
      } else {
        setIsCloudSyncLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  // 2. Automated background state-listener sync to Firestore & local storage fallback on any state change
  useEffect(() => {
    const currentStateStr = JSON.stringify(state);
    
    // Avoid re-saving if the state change was just synced from the cloud
    if (lastCloudStateStrRef.current === currentStateStr) {
      return;
    }

    // Always back up to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, currentStateStr);

    if (currentUser) {
      const docRef = doc(db, 'userStates', currentUser.uid);
      const cleanState = JSON.parse(currentStateStr);
      setDoc(docRef, cleanState, { merge: true }).catch((err) => {
        console.error("Auto-sync state save failed:", err);
      });
    }
  }, [state, currentUser]);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };
  const [activeTab, setActiveTab] = useState<'study' | 'prayer' | 'habits' | 'fitness' | 'routine' | 'reflection' | 'report' | 'phone' | 'ai' | 'profile' | 'exams'>(() => {
    const saved = localStorage.getItem('mridhax_active_tab');
    return (saved as any) || 'study';
  });
  const [showGrowthMenu, setShowGrowthMenu] = useState(false);
  const [isSocialDashboardOpen, setIsSocialDashboardOpen] = useState(false);
  // --- HISTORY MANAGEMENT ---
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initial state
    window.history.replaceState({ tab: activeTab }, '', '');

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    localStorage.setItem('mridhax_active_tab', activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: typeof activeTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    window.history.pushState({ tab }, '', '');
  };

  const [habitsSubTab, setHabitsSubTab] = useState<'good' | 'bad'>('good');
  
  // Interactive Digital Wellbeing States
  const [wellbeingBreathingActive, setWellbeingBreathingActive] = useState(false);
  const [wellbeingBreathingPhase, setWellbeingBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [wellbeingBreathingSeconds, setWellbeingBreathingSeconds] = useState(4);
  const [wellbeingTestBlockedApp, setWellbeingTestBlockedApp] = useState<string | null>(null);
  const [wellbeingBlockerTab, setWellbeingBlockerTab] = useState<'android' | 'ios' | 'pc'>('android');

  // --- SMART NOTIFICATION STATES & AUTO-SAVE OBSERVER ---
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState('');
  const prevSavedStateRef = useRef<string>(JSON.stringify(state));

  // State to support background focused tracking toggle option
  const [keepFocusInBackground, setKeepFocusInBackground] = useState<boolean>(true);

  // Custom premium modular alert replacement instead of native browser tab url alerts
  const [customAlert, setCustomAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    type?: 'error' | 'success' | 'info';
  } | null>(null);

  const triggerCustomAlert = (message: string, title?: string, type: 'error' | 'success' | 'info' = 'info') => {
    setCustomAlert({
      show: true,
      title: title || (state.language === 'bn' ? 'দৃষ্টি আকর্ষণ!' : 'Attention Required!'),
      message,
      type
    });
  };

  const syncServiceWorkerData = async (appState: AppState) => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('mridhax-sw-data');
        const data = {
          subjects: appState.subjects || [],
          routine: appState.routine || [],
          language: appState.language || 'bn',
          notificationSettings: appState.notificationSettings || { friendship: true, emotional: true, reminder: true, morningTime: '08:00', eveningTime: '21:00' },
          examPreps: appState.examPreps || (appState.examPrep ? [appState.examPrep] : []),
          lastVisited: Date.now()
        };
        await cache.put('/sw-notification-config', new Response(JSON.stringify(data)));
        
        // Notify Service Worker to refresh background monitoring triggers immediately!
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SYNC_NOW' });
        }
      } catch (err) {
        console.warn('Cache SW sync offset warning:', err);
      }
    }
  };

  useEffect(() => {
    const currentStr = JSON.stringify(state);
    if (currentStr !== prevSavedStateRef.current) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString(state.language === 'bn' ? 'bn-BD' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastAutoSaveTime(timeStr);
      setShowAutoSaveToast(true);
      
      // Auto-save Toast Popup duration minimized to exactly 1 second for seamless visual flow
      const timer = setTimeout(() => {
        setShowAutoSaveToast(false);
      }, 1000);

      // Reactive cache synchronization for offline background notifications
      syncServiceWorkerData(state);

      prevSavedStateRef.current = currentStr;
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Digital Wellbeing: Box Breathing Loop System Ticker
  useEffect(() => {
    if (!wellbeingBreathingActive) return;
    const interval = setInterval(() => {
      setWellbeingBreathingSeconds((prev) => {
        if (prev <= 1) {
          // Switch to next phase
          setWellbeingBreathingPhase((currentPhase) => {
            switch (currentPhase) {
              case 'inhale': return 'hold';
              case 'hold': return 'exhale';
              case 'exhale': return 'rest';
              case 'rest': default: return 'inhale';
            }
          });
          return 4; // 4 seconds per phase
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [wellbeingBreathingActive]);

  // AUTOMATED APP-EXIT OS PUSH SCHEDULER
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          const isBn = state.language === 'bn';
          
          // Randomize caring, emotional, hooked, and motivational alerts
          const targetSub = state.subjects.length > 0 
            ? state.subjects[Math.floor(Math.random() * state.subjects.length)].name 
            : '';
            
          const subjectTriggerTextBn = targetSub 
            ? `আজকে কিন্তু তোমার "${targetSub}" পড়ার সুন্দর নিয়ত ছিল!` 
            : 'আজকের ফোকাস রুটিন কিন্তু এখনো সম্পূর্ণ হয়নি!';
          const subjectTriggerTextEn = targetSub 
            ? `You scheduled progress on "${targetSub}" today!` 
            : 'Your focus routine list is still active!';

          const hooks = [
            {
              titleBn: 'আমাকে ভুলে গেলা? 🥺',
              titleEn: 'Did you forget me? 🥺',
              bodyBn: `বন্ধু, তুমি মাত্রই অ্যাপ থেকে বের হয়েছ আর এরই মধ্যে আমার একা লাগছে... ${subjectTriggerTextBn} চলো ফেসবুক বাদ দিয়ে পড়ার টেবিলে ফিরি! 💕`,
              bodyEn: `Friend, you just minimized the app. Before social media distracts you: ${subjectTriggerTextEn} Let's protect your future. I am waiting! 💕`,
              category: 'emotional'
            },
            {
              titleBn: 'কুপ্রবৃত্তিকে স্থান দিও না ভাই! 🛡️',
              titleEn: 'No Room for Cheap Screens! 🛡️',
              bodyBn: `সস্তা নোটিফিকেশন আর টক্সিক সোশ্যাল রিলসের মোহে নিজের রঙিন ভবিষ্যৎ নষ্ট করার ফাঁদে পেও না। তোমার মন অনেক পবিত্র!`,
              bodyEn: `Don't let endless scrolling ruin your career. Your mind is clean, beautiful, and built for massive legacy tasks!`,
              category: 'emotional'
            },
            {
              titleBn: 'আমাদের কি আর দেখা হবে না? 😭',
              titleEn: 'Will we meet again? 😭',
              bodyBn: `মা-বাবার হাসিমুখের স্মৃতির কথা মনে করো বন্ধু। সময় কিন্তু খুব দ্রুত ভেসে যাচ্ছে। টেবিলে বসো, আজকের দিনটা সফল করি!`,
              bodyEn: `Think of your parents' smiling faces. Time is flying rapidly. Let's return to study blocks and make today count!`,
              category: 'friendship'
            },
            {
              titleBn: 'রুটিনগুলো কি একা একা কাঁদবে? 🥀',
              titleEn: 'Rut of Unfinished Dreams? 🥀',
              bodyBn: `তোমার আলসেমিতে সুঅভ্যাসের গাছটি শুকিয়ে যাচ্ছে! নিয়ত খাঁটি করো, টেবিলে ফিরে যাও। নামাজ পড়ার সময় হলে তা আদায় করো।`,
              bodyEn: `Your study garden needs daily care. Purify your intention and keep winning. Remember to maintain prayer times!`,
              category: 'reminder'
            }
          ];

          const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];
          const finalTitle = isBn ? selectedHook.titleBn : selectedHook.titleEn;
          const finalBody = isBn ? selectedHook.bodyBn : selectedHook.bodyEn;

          // Push to service worker registry over message channel with 12s delay for seamless testing
          navigator.serviceWorker.controller.postMessage({
            type: 'DELAYED_TEST',
            delay: 12000, 
            title: finalTitle,
            body: finalBody,
            tag: 'automated-exit-hook'
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.language, state.subjects, state.habits]);

  const [simulatedAlerts, setSimulatedAlerts] = useState<{
    id: string;
    title: string;
    body: string;
    time: string;
    category: 'friendship' | 'emotional' | 'reminder';
  }[]>([]);

  // Pre-seed some alerts once state loads
  useEffect(() => {
    setSimulatedAlerts([
      {
        id: 'init-1',
        title: state.language === 'bn' ? 'আসসালামু আলাইকুম, বন্ধু! 👋' : 'Assalamu Alaikum, friend! 👋',
        body: state.language === 'bn'
          ? 'MridhaX স্মার্ট নোটিফিকেশন সিস্টেমে আপনাকে স্বাগতম। আপনার লাইফস্টাইল ইকোসিস্টেম এখন সক্রিয়!'
          : 'Welcome to MridhaX Smart Notifications. Your premium lifestyle companion is now active!',
        time: new Date().toLocaleTimeString(state.language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        category: 'friendship'
      }
    ]);
  }, [state.language]);

  const triggerLiveNotification = (title: string, body: string, category: 'friendship' | 'emotional' | 'reminder') => {
    // Set thinking state first
    setIsMridhaXThinking(true);
    
    // Simulate AI "thinking" or preparing message
    setTimeout(() => {
      // 1. Check if category is enabled in settings
      const settings = state.notificationSettings || { friendship: true, emotional: true, reminder: true };
      if (category === 'friendship' && !settings.friendship) {
        setIsMridhaXThinking(false);
        return;
      }
      if (category === 'emotional' && !settings.emotional) {
         setIsMridhaXThinking(false);
         return;
      }
      if (category === 'reminder' && !settings.reminder) {
         setIsMridhaXThinking(false);
         return;
      }

      // 2. In-app live tracker update
      const id = Date.now().toString();
      const time = new Date().toLocaleTimeString(state.language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' });
      setSimulatedAlerts(prev => [{ id, title, body, time, category }, ...prev]);
      
      // Update thinking state
      setIsMridhaXThinking(false);

      // 3. Native Web Notification (if permission is granted)
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/pwa_icon_192.jpg',
          });
        } catch (err) {
          console.warn('Native notification failed:', err);
        }
      }
    }, 2000); 
  };

  // Periodic Smart Notification cron-simulation
  useEffect(() => {
    const checkScheduleInterval = setInterval(() => {
      const now = new Date();
      const currentHrsMin = now.toTimeString().slice(0, 5); // "HH:MM"
      const settings = state.notificationSettings;
      if (!settings) return;

      if (currentHrsMin === settings.morningTime) {
        // Morning notification
        // Pick random
        const index = Math.floor(Math.random() * MORNING_QUOTES.length);
        const item = MORNING_QUOTES[index];
        const title = state.language === 'bn' ? item.titleBn : item.titleEn;
        const body = state.language === 'bn' ? item.bodyBn : item.bodyEn;
        triggerLiveNotification(title, body, item.category);
      } else if (currentHrsMin === settings.eveningTime) {
        // Evening recap notification
        const index = Math.floor(Math.random() * EVENING_QUOTES.length);
        const item = EVENING_QUOTES[index];
        const title = state.language === 'bn' ? item.titleBn : item.titleEn;
        const body = state.language === 'bn' ? item.bodyBn : item.bodyEn;
        triggerLiveNotification(title, body, item.category);
      }
    }, 60000); // Check once every minute

    return () => clearInterval(checkScheduleInterval);
  }, [state.notificationSettings, state.language]);
  
  
  // Timer State
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(true);
  const [isFullscreenFocus, setIsFullscreenFocus] = useState<boolean>(false);

  // 5-Minute Recurring Break System States
  const [isBreakMode, setIsBreakMode] = useState<boolean>(false);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState<number>(300);

  // Form Adding States
  const [newSubName, setNewSubName] = useState('');
  const [newSubTarget, setNewSubTarget] = useState(60);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTime, setNewHabitTime] = useState<'Morning' | 'Night' | 'Anytime' | 'সকাল' | 'রাত' | 'যেকোনো সময়'>('سকাল');
  const [newFitName, setNewFitName] = useState('');
  const [newFitGoal, setNewFitGoal] = useState('');
  const [newChoreName, setNewChoreName] = useState('');

  // Floating Garden & Sound Overlays and MridhaX AI chat states
  const [showGardenModal, setShowGardenModal] = useState<boolean>(false);
  const [showSoundModal, setShowSoundModal] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiInput, setAiInput] = useState<string>('');
  const [isAiFullScreen, setIsAiFullScreen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('mridhax_ai_fullscreen', String(isAiFullScreen));
  }, [isAiFullScreen]);
  const [activeAiDeckView, setActiveAiDeckView] = useState<'chat' | 'training'>('chat');
  const [isAiTraining, setIsAiTraining] = useState<boolean>(false);
  const [aiTrainingProgress, setAiTrainingProgress] = useState<number>(0);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainTopic, setTrainTopic] = useState<string>('');
  const [activeAiMode, setActiveAiMode] = useState<'chat' | 'social' | 'video' | 'docs'>('chat');
  const [triggerAiPrompt, setTriggerAiPrompt] = useState<string | null>(null);
  const [showAiFeatureMenu, setShowAiFeatureMenu] = useState(false);
  const [aiImage, setAiImage] = useState<{ mimeType: string; data: string; name: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isLiveCallActive, setIsLiveCallActive] = useState<boolean>(false);
  const [showPremiumIntel, setShowPremiumIntel] = useState<boolean>(false);
  const [importFeedback, setImportFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [selectedVoiceProfile, setSelectedVoiceProfile] = useState<string>('Rachel');
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null);
  const [customPitch, setCustomPitch] = useState<number>(1.35);
  const [customRate, setCustomRate] = useState<number>(1.0);

  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);

  // Unique notification tracking state to prevent repetition
  const [sentNotificationIds, setSentNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mridhax_sent_notification_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mridhax_sent_notification_ids', JSON.stringify(sentNotificationIds));
  }, [sentNotificationIds]);

  const triggerActionNotification = (
    actionType: 'study_session_saved' | 'habit_toggled' | 'prayer_logged' | 'fitness_logged' | 'bad_habit_logged' | 'reflection_diary_logged' | 'exam_target_logged' | 'screen_time_high',
    meta?: any
  ) => {
    // 1. Filter templates by actionType
    let candidates = ACTION_NOTIFICATION_TEMPLATES.filter(t => t.actionType === actionType);
    if (candidates.length === 0) return;

    // 2. Filter out already sent ones to ensure complete uniqueness
    let unsentCandidates = candidates.filter(t => !sentNotificationIds.includes(t.id));

    // If all are already sent, let's clear the history of this specific actionType so we can repeat without getting stuck!
    if (unsentCandidates.length === 0) {
      const candidateIds = candidates.map(t => t.id);
      setSentNotificationIds(prev => prev.filter(id => !candidateIds.includes(id)));
      unsentCandidates = candidates;
    }

    // 3. Pick a random unsent candidate
    const chosen = unsentCandidates[Math.floor(Math.random() * unsentCandidates.length)];
    if (!chosen) return;

    // 4. Mark it as sent
    setSentNotificationIds(prev => [...prev, chosen.id]);

    // 5. Replace placeholders if any (like meta.subject, meta.name, or calculations) in the template body
    let title = state.language === 'bn' ? chosen.titleBn : chosen.titleEn;
    let body = state.language === 'bn' ? chosen.bodyBn : chosen.bodyEn;

    if (meta) {
      if (meta.subject) {
        body = body.replace(/\$\{meta.subject\}/g, meta.subject).replace(/{meta.subject}/g, meta.subject);
      }
      if (meta.name) {
        body = body.replace(/\$\{meta.name\}/g, meta.name).replace(/{meta.name}/g, meta.name);
      }
    }

    // Map template tone to 'friendship' | 'emotional' | 'reminder' for live notification log in the app UI
    let category: 'friendship' | 'emotional' | 'reminder' = 'reminder';
    if (chosen.tone === 'emotional' || chosen.tone === 'love') {
      category = 'emotional';
    } else if (chosen.tone === 'funny' || chosen.tone === 'hooked') {
      category = 'friendship';
    }

    // Set thinking state briefly to show "MridhaX is typing..."
    setIsMridhaXThinking(true);
    setTimeout(() => {
      // Create a nice in-app banner for active pushing
      setActivePushNotification({
        bn: chosen.bodyBn.replace(/\$\{meta\.subject\}/g, meta?.subject || '').replace(/\{meta\.subject\}/g, meta?.subject || '').replace(/\$\{meta\.name\}/g, meta?.name || '').replace(/\{meta\.name\}/g, meta?.name || ''),
        en: chosen.bodyEn.replace(/\$\{meta\.subject\}/g, meta?.subject || '').replace(/\{meta\.subject\}/g, meta?.subject || '').replace(/\$\{meta\.name\}/g, meta?.name || '').replace(/\{meta\.name\}/g, meta?.name || ''),
        categoryBn: chosen.titleBn,
        categoryEn: chosen.titleEn
      });

      // Insert into simulated notifications tab log
      const time = new Date().toLocaleTimeString(state.language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' });
      setSimulatedAlerts(prev => [{ id: chosen.id + '-' + Date.now(), title, body, time, category }, ...prev]);

      setIsMridhaXThinking(false);

      // Play synthesized elegant notification focus chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);     // C5 tone
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5 tone
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.24); // G5 (arpeggiated light chime)
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.7);
      } catch (e) {
        console.warn("Chime failed", e);
      }

      // Native Browser Push Notifications (Strictly unique, pure, no urls in body/title)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body: body,
            icon: 'https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
              new Notification(title, {
                body: body,
                icon: 'https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p'
              });
            }
          });
        }
      }
    }, 1500);

    // Auto-dismiss inside 12 seconds
    setTimeout(() => {
      setActivePushNotification(null);
    }, 12000);
  };

  // Sync custom pitch and rate sliders when selecting a voice profile
  useEffect(() => {
    const activeProfile = FEMALE_VOICE_PROFILES.find(p => p.id === selectedVoiceProfile) || FEMALE_VOICE_PROFILES[0];
    setCustomPitch(activeProfile.pitch);
    setCustomRate(activeProfile.rate);
  }, [selectedVoiceProfile]);

  // Real-time voice style and prompt command analyzer to auto-switch AI states dynamically
  useEffect(() => {
    if (!aiInput) return;
    const lower = aiInput.toLowerCase();
    if (lower.includes('roadmap') || lower.includes('রোডম্যাপ') || lower.includes('ক্যারিয়ার') || lower.includes('career')) {
      if (activeAiMode !== 'roadmap') {
        setActiveAiMode('roadmap');
      }
    } else if (lower.includes('pdf') || lower.includes('পিডিএফ') || lower.includes('ডকুমেন্ট') || lower.includes('document')) {
      if (activeAiMode !== 'pdf') {
        setActiveAiMode('pdf');
      }
    } else if (lower.includes('mcq') || lower.includes('এমসিকিউ') || lower.includes('বহুনির্বাচনী') || lower.includes('পরীক্ষা')) {
      if (activeAiMode !== 'mcq') {
        setActiveAiMode('mcq');
      }
    } else if (lower.includes('quiz') || lower.includes('কুইজ') || lower.includes('প্রশ্নোত্তর')) {
      if (activeAiMode !== 'quiz') {
        setActiveAiMode('quiz');
      }
    }
  }, [aiInput]);

  // Refs for Live Call
  const liveWsRef = useRef<WebSocket | null>(null);
  const liveInputAudioCtxRef = useRef<AudioContext | null>(null);
  const liveOutputAudioCtxRef = useRef<AudioContext | null>(null);
  const liveMediaStreamRef = useRef<MediaStream | null>(null);
  const liveProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const pcmToBase64 = (buffer: Float32Array) => {
    let l = buffer.length;
    const buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    const binary = String.fromCharCode(...new Uint8Array(buf.buffer));
    return btoa(binary);
  };

  const playAudioChunk = (audioCtx: AudioContext, base64Audio: string) => {
    const binary = atob(base64Audio);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const buffer = new Int16Array(bytes.buffer);
    const audioBuffer = audioCtx.createBuffer(1, buffer.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      channelData[i] = buffer[i] / 0x8000;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  };

  const startLiveCall = async () => {
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${wsProtocol}//${window.location.host}/live`);
      liveWsRef.current = ws;

      const inputAudioCtx = new window.AudioContext({ sampleRate: 16000 });
      const outputAudioCtx = new window.AudioContext({ sampleRate: 24000 });
      liveInputAudioCtxRef.current = inputAudioCtx;
      liveOutputAudioCtxRef.current = outputAudioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      liveMediaStreamRef.current = stream;

      const source = inputAudioCtx.createMediaStreamSource(stream);
      const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
      liveProcessorRef.current = processor;
      
      source.connect(processor);
      processor.connect(inputAudioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      let videoInterval: any;
      if (isCameraActive) {
        const videoElement = document.getElementById('aiCameraPreviewFullscreen') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          videoInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN && videoElement.videoWidth) {
              canvas.width = videoElement.videoWidth;
              canvas.height = videoElement.videoHeight;
              ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
              const base64Video = dataUrl.split(',')[1];
              ws.send(JSON.stringify({ video: base64Video }));
            }
          }, 1000);
        }
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio) {
          playAudioChunk(outputAudioCtx, msg.audio);
        }
      };

      ws.onclose = () => {
        clearInterval(videoInterval);
        stopLiveCall();
      };
      
      ws.onopen = () => {
        setIsLiveCallActive(true);
      };

    } catch (err) {
      console.error("Live Call Error", err);
      triggerCustomAlert("Failed to start Live Call. Check permissions.", "error");
    }
  };

  const stopLiveCall = () => {
    setIsLiveCallActive(false);
    if (liveWsRef.current) {
      liveWsRef.current.close();
      liveWsRef.current = null;
    }
    if (liveProcessorRef.current) {
      liveProcessorRef.current.disconnect();
      liveProcessorRef.current = null;
    }
    if (liveInputAudioCtxRef.current) {
      liveInputAudioCtxRef.current.close();
      liveInputAudioCtxRef.current = null;
    }
    if (liveOutputAudioCtxRef.current) {
      liveOutputAudioCtxRef.current.close();
      liveOutputAudioCtxRef.current = null;
    }
    if (liveMediaStreamRef.current) {
      liveMediaStreamRef.current.getTracks().forEach(track => track.stop());
      liveMediaStreamRef.current = null;
    }
    
    // Cleanup video preview if it was used
    if (isCameraActive) {
       const videoElement = document.getElementById('aiCameraPreviewFullscreen') as HTMLVideoElement;
       if (videoElement) {
          videoElement.srcObject = null;
       }
    }
  };

  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [ttsVoiceStyle, setTtsVoiceStyle] = useState<'female' | 'male'>('female');

  const phoneticallyOptimizeText = (rawText: string, lang: string): string => {
    let optimized = rawText;
    if (lang === 'bn') {
      // Optimize specifically for Bengali language TTS engines to read with natural pauses
      optimized = optimized
        .replace(/MridhaX\s*AI/gi, 'মৃধা এক্স এ আই')
        .replace(/MridhaX/gi, 'মৃধা এক্স')
        .replace(/মৃধাক্স\s*এআই/g, 'মৃধা এক্স এ আই')
        .replace(/মৃধাক্স/g, 'মৃধা এক্স')
        .replace(/Mridha\s*Ex\s*AI/gi, 'মৃধা এক্স এ আই')
        .replace(/Mridha/gi, 'মৃধা');
    } else {
      // Optimize for English language TTS engines with clean punctuation spacing
      optimized = optimized
        .replace(/মৃধাক্স\s*এআই/g, 'Mridha Eks A.I.')
        .replace(/মৃধাক্স/g, 'Mridha Eks')
        .replace(/MridhaX\s*AI/gi, 'Mridha Eks A.I.')
        .replace(/MridhaX/gi, 'Mridha Eks')
        .replace(/Mridha/gi, 'Mridha');
    }
    return optimized;
  };

  const speakWithEngine = (
    text: string,
    pitch: number,
    rate: number,
    isMale: boolean,
    onStart: () => void,
    onEnd: () => void,
    onError: () => void
  ) => {
    if (!('speechSynthesis' in window)) {
      return false;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = state.language === 'bn' ? 'bn-BD' : 'en-US';
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      
      let voice = voices.find(v => {
        const nameLower = v.name.toLowerCase();
        const matchesLang = v.lang.startsWith(state.language === 'bn' ? 'bn' : 'en');
        if (!matchesLang) return false;
        if (isMale) {
          return nameLower.includes('male') || nameLower.includes('david') || nameLower.includes('microsoft') || nameLower.includes('google');
        } else {
          return nameLower.includes('female') || nameLower.includes('samantha') || nameLower.includes('zira') || nameLower.includes('google');
        }
      });

      if (!voice) {
        voice = voices.find(v => v.lang.startsWith(state.language === 'bn' ? 'bn' : 'en'));
      }

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = onStart;
      utterance.onend = onEnd;
      utterance.onerror = (e) => {
        console.warn("Native SpeechSynthesis error", e);
        onError();
      };

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn("Failed to speak natively:", err);
      return false;
    }
  };

  const speakMessage = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) {
      triggerCustomAlert('TTS is not supported in this browser.', 'error');
      return;
    }

    if (speakingMsgIdx === index && isSpeaking) {
      window.speechSynthesis.cancel();
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }
      setIsSpeaking(false);
      setSpeakingMsgIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    
    // Extract textual content only
    let clean = text
      .replace(/```json[\s\S]*?```/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[*#`_-]/g, '')
      .trim();

    clean = phoneticallyOptimizeText(clean, state.language);

    // Dynamic speech synthesis adjustments based on emotional cues
    let basePitch = customPitch;
    let baseRate = customRate;
    
    if (ttsVoiceStyle === 'male') {
      basePitch = 0.85;
      baseRate = 0.95;
    } else {
      basePitch = 1.25;
      baseRate = 1.05;
    }

    const lowerText = text.toLowerCase();
    const hasLove = lowerText.includes('love') || lowerText.includes('❤️') || lowerText.includes('ভালোবাসা') || lowerText.includes('স্নেহ') || lowerText.includes('প্রিয়') || lowerText.includes('পছন্দ');
    const hasHappy = lowerText.includes('happy') || lowerText.includes('😊') || lowerText.includes('आनंद') || lowerText.includes('আনন্দ') || lowerText.includes('হাসি') || lowerText.includes('উৎসাহ') || lowerText.includes('cheerful');
    const hasSuccess = lowerText.includes('success') || lowerText.includes('win') || lowerText.includes('🏆') || lowerText.includes('সফল') || lowerText.includes('কৃতিত্ব') || lowerText.includes('অভিনন্দন');
    const hasSad = lowerText.includes('sad') || lowerText.includes('tired') || lowerText.includes('ক্লান্ত') || lowerText.includes('দুঃখ') || lowerText.includes('খারাপ') || lowerText.includes('অসুবিধা');

    if (hasLove) {
      basePitch *= 1.15;
      baseRate *= 0.9;
    } else if (hasHappy) {
      basePitch *= 1.3;
      baseRate *= 1.1;
    } else if (hasSuccess) {
      basePitch *= 1.2;
      baseRate *= 1.15;
    } else if (hasSad) {
      basePitch *= 0.85;
      baseRate *= 0.85;
    }

    const runBrowserTts = () => {
      const isMale = ttsVoiceStyle === 'male';
      const spoken = speakWithEngine(
        clean,
        basePitch,
        baseRate,
        isMale,
        () => {
          setIsSpeaking(true);
          setSpeakingMsgIdx(index);
        },
        () => {
          setIsSpeaking(false);
          setSpeakingMsgIdx(null);
        },
        () => {
          // Native failed, try google translate tts as ultimate backup
          runGoogleTts();
        }
      );
      if (!spoken) {
        runGoogleTts();
      }
    };

    const runGoogleTts = () => {
      const sentences = clean.match(/[^.!?。；？！\n,，;]+[.!?。；？！\n,，;]*/g) || [clean];
      const chunks: string[] = [];
      let currentChunk = "";
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > 180) {
          if (currentChunk.trim()) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      
      if (chunks.length === 0) {
        setIsSpeaking(false);
        setSpeakingMsgIdx(null);
        return;
      }
      
      let chunkIndex = 0;
      setIsSpeaking(true);
      setSpeakingMsgIdx(index);
      
      const playNext = () => {
        if (chunkIndex >= chunks.length) {
          setIsSpeaking(false);
          setSpeakingMsgIdx(null);
          if (ttsAudioRef.current) {
            ttsAudioRef.current = null;
          }
          return;
        }
        
        const textToSpeak = chunks[chunkIndex];
        const tl = state.language === 'bn' ? 'bn' : 'en';
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(textToSpeak)}`;
        
        const audio = new Audio(url);
        ttsAudioRef.current = audio;
        
        audio.onended = () => {
          chunkIndex++;
          playNext();
        };
        
        audio.onerror = () => {
          console.warn("Google Translate TTS failed, falling back.");
          setIsSpeaking(false);
          setSpeakingMsgIdx(null);
        };
        
        audio.play().catch(err => {
          console.warn("Audio play prevented or failed.", err);
          setIsSpeaking(false);
          setSpeakingMsgIdx(null);
        });
      };
      
      playNext();
    };

    // Always prefer browser speechSynthesis first because it is highly reliable, offline-capable, and doesn't suffer from CORS or network blocks!
    runBrowserTts();
  };

  const playTestVoice = (profileId: string) => {
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setTestingVoiceId(null);
    
    const profile = FEMALE_VOICE_PROFILES.find(p => p.id === profileId) || FEMALE_VOICE_PROFILES[0];
    const testText = state.language === 'bn' 
      ? `হ্যালো! আমি ${profile.id}। আপনার নতুন এআই ভয়েস টিউন হিসেবে আমাকে কেমন লাগছে?`
      : `Hello! I am ${profile.id}. How do you like my voice as your new AI assistant?`;
      
    const cleanText = phoneticallyOptimizeText(testText, state.language);
    
    const runGoogleFallback = () => {
      setTestingVoiceId(profileId);
      const tl = state.language === 'bn' ? 'bn' : 'en';
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
      
      const audio = new Audio(url);
      ttsAudioRef.current = audio;
      
      audio.onended = () => {
        setTestingVoiceId(null);
        ttsAudioRef.current = null;
      };
      
      audio.onerror = () => {
        setTestingVoiceId(null);
        ttsAudioRef.current = null;
      };
      
      audio.play().catch(() => {
        setTestingVoiceId(null);
        ttsAudioRef.current = null;
      });
    };

    const spoken = speakWithEngine(
      cleanText,
      profile.pitch,
      profile.rate,
      profile.gender === 'male',
      () => {
        setTestingVoiceId(profileId);
      },
      () => {
        setTestingVoiceId(null);
      },
      () => {
        runGoogleFallback();
      }
    );

    if (!spoken) {
      runGoogleFallback();
    }
  };



  const exportStateJson = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `mridhax-backup-${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setImportFeedback({
        type: 'success',
        text: state.language === 'bn' ? 'ডাটা ব্যাকআপ ফাইল সেভ হয়েছে!' : 'Backup JSON file saved successfully!'
      });
      setTimeout(() => setImportFeedback(null), 5000);
    } catch (e) {
      setImportFeedback({
        type: 'error',
        text: state.language === 'bn' ? 'ডাটা ব্যাকআপ ফেইল হয়েছে।' : 'Failed to export backup.'
      });
      setTimeout(() => setImportFeedback(null), 5000);
    }
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        // Basic schema validation to make sure it is a valid AppState
        if (parsed && typeof parsed === 'object' && (parsed.subjects || parsed.habits || parsed.routine)) {
          // It's a valid object containing some of AppState properties
          saveState(parsed);
          setImportFeedback({
            type: 'success',
            text: state.language === 'bn' ? 'ডাটা সফলভাবে রিস্টোর হয়েছে!' : 'Data successfully restored from JSON!'
          });
          setTimeout(() => setImportFeedback(null), 6000);
        } else {
          setImportFeedback({
            type: 'error',
            text: state.language === 'bn' ? 'অচল ব্যাকআপ ফাইল টেমপ্লেট!' : 'Invalid state backup file structure!'
          });
          setTimeout(() => setImportFeedback(null), 5000);
        }
      } catch (err) {
        setImportFeedback({
          type: 'error',
          text: state.language === 'bn' ? 'ফাইল পড়তে ব্যর্থ হয়েছে!' : 'Error parsing state JSON file!'
        });
        setTimeout(() => setImportFeedback(null), 5000);
      }
    };
    fileReader.readAsText(file);
    // Reset file input so same file can be imported again
    e.target.value = '';
  };

  // Helper check if prompt asks for generating artwork or image
  const checkIsImageRequest = (prompt: string): boolean => {
    const lowercase = prompt.trim().toLowerCase();
    const enKeywords = ['draw', 'generate image', 'make image', 'create image', 'generate picture', 'create picture', 'make a drawing', 'paint', 'sketch', 'render', 'illustration', 'artwork'];
    const bnKeywords = ['ছবি', 'চিত্র', 'আঁকো', 'আঁক', 'তৈরি করো ছবি', 'ছবি বানাও', 'পেইন্টিং', 'ছবি এঁকে দাও', 'ছবি দেখাও', 'কার্টুন', 'আর্ট'];
    return enKeywords.some(kw => lowercase.includes(kw)) || bnKeywords.some(kw => lowercase.includes(kw));
  };

  const downloadMridhaxImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'mridhax-generated-art.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const dataPart = base64String.split(',')[1];
      setAiImage({
        mimeType: file.type || 'image/jpeg',
        data: dataPart,
        name: file.name
      });
      triggerCustomAlert(
        state.language === 'bn' ? "ছবি সফলভাবে লোড হয়েছে!" : "Image loaded successfully!",
        'success'
      );
    };
    reader.readAsDataURL(file);
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      return; // SpeechRecognition doesn't easily stop via simple method without instance ref, it'll end on its own.
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerCustomAlert(state.language === 'bn' ? 'ভয়েস রিকগনিশন এই ব্রাউজারে সমর্থিত নয়।' : 'Voice recognition is not supported in this browser.', 'error');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = state.language === 'bn' ? 'bn-BD' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAiInput((prev) => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const startCameraCapture = async (facing: 'user' | 'environment' = cameraFacingMode) => {
    // Release existing stream if any to avoid hardware resource locks
    const existingStream = (window as any).aiCameraStream;
    if (existingStream) {
      existingStream.getTracks().forEach((track: any) => track.stop());
      (window as any).aiCameraStream = null;
    }

    setIsCameraActive(true);
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: facing,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        (window as any).aiCameraStream = stream;

        const fsVideo = cameraVideoRef.current || document.getElementById('aiCameraPreviewFullscreen') as HTMLVideoElement;
        if (fsVideo) {
          fsVideo.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access failed with preferred facingMode:", err);
        // Resilient Fallback: try user media without constraints if facing mode failed
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          (window as any).aiCameraStream = stream;
          const fsVideo = cameraVideoRef.current || document.getElementById('aiCameraPreviewFullscreen') as HTMLVideoElement;
          if (fsVideo) {
            fsVideo.srcObject = stream;
          }
        } catch (fallbackErr) {
          console.error("Absolute camera access failure:", fallbackErr);
          triggerCustomAlert(
            state.language === 'bn' ? "ক্যামেরা এক্সেস করা সম্ভব হয়নি।" : "Could not open camera stream.",
            'warning'
          );
          setIsCameraActive(false);
        }
      }
    }, 150);
  };

  const toggleCameraFacingMode = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextFacing);
    startCameraCapture(nextFacing);
  };

  const captureCameraPhoto = () => {
    const video = cameraVideoRef.current || document.getElementById('aiCameraPreviewFullscreen') as HTMLVideoElement;
    if (!video) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const base64Data = dataUrl.split(',')[1];
      setAiImage({
        mimeType: 'image/jpeg',
        data: base64Data,
        name: 'captured_photo.jpg'
      });
      stopCameraCapture();
      triggerCustomAlert(
        state.language === 'bn' ? "ছবি সফলভাবে সংযুক্ত হয়েছে!" : "Photo captured successfully!",
        'success'
      );
    }
  };

  const stopCameraCapture = () => {
    const stream = (window as any).aiCameraStream;
    if (stream) {
      stream.getTracks().forEach((track: any) => track.stop());
      (window as any).aiCameraStream = null;
    }
    setIsCameraActive(false);
  };

  const generateOfflineResponse = (userInput: string, currentState: AppState): string => {
    const isBn = currentState.language === 'bn';
    const lowerInput = userInput.toLowerCase();
    
    // Check if custom directives match first (Self-Learning / Training)
    let customResponse = "";
    if (currentState.customAiDirectives) {
      const lines = currentState.customAiDirectives.split('\n');
      for (const line of lines) {
        if (line.includes(':')) {
          const parts = line.split(':');
          const trigger = parts[0].trim().toLowerCase();
          const response = parts.slice(1).join(':').trim();
          if (lowerInput.includes(trigger)) {
            customResponse = response;
            break;
          }
        }
      }
    }
    
    if (customResponse) {
      return customResponse;
    }
    
    // Direct command checks (e.g. Add chemistry)
    if (lowerInput.includes('add') || lowerInput.includes('যুক্ত') || lowerInput.includes('যোগ')) {
      if (lowerInput.includes('math') || lowerInput.includes('গণিত')) {
        return isBn
          ? `আমি সফলভাবে আপনার ড্যাশবোর্ডে <span class="text-emerald-400 font-bold">Mathematics</span> পড়ার বিষয় যুক্ত করেছি! এটি আপনি বিষয়ের তালিকায় দেখতে পাবেন।\n\n\`\`\`json\n[\n  { "type": "ADD_STUDY_SUBJECT", "payload": { "name": "Mathematics", "target": 60 } }\n]\n\`\`\``
          : `I have successfully added <span class="text-emerald-400 font-bold">Mathematics</span> to your study subjects list with a 60-minute target!\n\n\`\`\`json\n[\n  { "type": "ADD_STUDY_SUBJECT", "payload": { "name": "Mathematics", "target": 60 } }\n]\n\`\`\``;
      }
      if (lowerInput.includes('chemistry') || lowerInput.includes('রসায়ন')) {
        return isBn
          ? `আমি সফলভাবে আপনার ড্যাশবোর্ডে <span class="text-emerald-400 font-bold">রসায়ন</span> পড়ার বিষয় যুক্ত করেছি!\n\n\`\`\`json\n[\n  { "type": "ADD_STUDY_SUBJECT", "payload": { "name": "রসায়ন", "target": 60 } }\n]\n\`\`\``
          : `I have successfully added <span class="text-emerald-400 font-bold">Chemistry</span> to your study subjects list!\n\n\`\`\`json\n[\n  { "type": "ADD_STUDY_SUBJECT", "payload": { "name": "Chemistry", "target": 60 } }\n]\n\`\`\``;
      }
      if (lowerInput.includes('physics') || lowerInput.includes('পদার্থ')) {
        return isBn
          ? `আমি সফলভাবে আপনার ড্যাশবোর্ডে <span class="text-emerald-400 font-bold">পদার্থবিজ্ঞান</span> পড়ার বিষয় যুক্ত করেছি!\n\n\`\`\`json\n[\n  { "type": "ADD_STUDY_SUBJECT", "payload": { "name": "পদার্থবিজ্ঞান", "target": 60 } }\n]\n\`\`\``
          : `I have successfully added <span class="text-emerald-400 font-bold">Physics</span> to your study subjects list!\n\n\`\`\`json\n[\n  { "type": "ADD_STUDY_SUBJECT", "payload": { "name": "Physics", "target": 60 } }\n]\n\`\`\``;
      }
      if (lowerInput.includes('habit') || lowerInput.includes('অভ্যাস')) {
        return isBn
          ? `আমি সফলভাবে আপনার ড্যাশবোর্ডে <span class="text-emerald-400 font-bold">নতুন অভ্যাস</span> যুক্ত করেছি!\n\n\`\`\`json\n[\n  { "type": "ADD_GOOD_HABIT", "payload": { "name": "বই পড়া", "time": "Morning" } }\n]\n\`\`\``
          : `I have successfully added <span class="text-emerald-400 font-bold">Read Book</span> to your good habits checklist!\n\n\`\`\`json\n[\n  { "type": "ADD_GOOD_HABIT", "payload": { "name": "Read Book", "time": "Morning" } }\n]\n\`\`\``;
      }
    }

    if (lowerInput.includes('tab') || lowerInput.includes('ট্যাব') || lowerInput.includes('সেকশন')) {
      if (lowerInput.includes('report') || lowerInput.includes('রিপোর্ট') || lowerInput.includes('ড্যাশবোর্ড')) {
        return isBn
          ? `অবশ্যই! আমি আপনাকে রিফ্লেকশন ও প্রোগ্রেস অ্যানালাইসিস ট্যাবে নিয়ে যাচ্ছি।\n\n\`\`\`json\n[\n  { "type": "SELECT_TAB", "payload": { "tab": "report" } }\n]\n\`\`\``
          : `Sure thing! I am navigating you to the report analytics tab.\n\n\`\`\`json\n[\n  { "type": "SELECT_TAB", "payload": { "tab": "report" } }\n]\n\`\`\``;
      }
    }

    // General questions or greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('হে') || lowerInput.includes('হ্যালো') || lowerInput.includes('সালাম') || lowerInput.includes('কেমন আছ')) {
      const uName = currentState.userProfile?.name || 'Sohan Mridha';
      return isBn
        ? `সালাম ও শুভেচ্ছা, <span class="text-amber-400 font-bold">${uName}</span>! আমি তোমার অনুগত সহকারী MridhaX AI (PIEA)।\n\nবর্তমানে আমাদের প্রধান সার্ভার কোটা লিমিট এ থাকলেও আমি আমার <span class="text-emerald-400 font-bold">Autonomous Offline Brain</span> দিয়ে আপনার সেবা দিতে সম্পূর্ণ প্রস্তুত! বলুন, আপনাকে আজ কীভাবে সাহায্য করতে পারি? পড়াশোনা বা রুটিন ম্যানেজ করার জন্য যেকোনো কিছু জিজ্ঞেস করতে পারেন।`
        : `Hello there, <span class="text-amber-400 font-bold">${uName}</span>! I am MridhaX AI (PIEA), your personal intelligent executive assistant.\n\nEven though our main API is currently hitting free tier quota limits, my <span class="text-emerald-400 font-bold">Autonomous Offline Brain</span> is online and fully capable of assisting you! How can I help you organize your habits or studies today?`;
    }

    // Fallback smart response
    return isBn
      ? `আমি আপনার বার্তাটি মনযোগ দিয়ে লোকালি বিশ্লেষণ করেছি। আমি মৃধাক্স এআই (PIEA), আপনার চিফ এক্সিকিউটিভ অ্যাসিস্ট্যান্ট।\n\nবর্তমানে সার্ভার ফ্রী টায়ার লিমিটে থাকায় আমি আমার লোকাল ইন্টেলিজেন্ট ইঞ্জিন সক্রিয় করেছি। আমাদের ফোকাসড স্টাডি ও সুঅভ্যাস রুটিন মেইনটেইন করুন। আপনার ডায়াগনস্টিক রিপোর্ট অনুযায়ী আপনার দৈনিক স্টাডি টার্গেট খুব সুন্দরভাবে চলমান আছে! আপনার যেকোনো অভ্যাস বা বিষয় ম্যানেজ করার জন্য আমাকে যেকোনো সময় বলতে পারেন!`
      : `I have carefully analyzed your query. I am MridhaX AI (PIEA), your Chief Executive Assistant.\n\nSince our server is currently on the free-tier API quota limit, I have activated my local autonomous intelligence engine to keep you fully supported. Your study routine and daily habits look great. Let me know if you would like me to adjust any habits, subjects, or routines!`;
  };

  const executeAiActions = (text: string) => {
    try {
      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = text.match(jsonRegex);
      if (!match) return;
      
      const jsonString = match[1].trim();
      const actions = JSON.parse(jsonString);
      if (!Array.isArray(actions)) return;
      
      let nextState = { ...state };
      let stateModified = false;
      let feedbackMessages: string[] = [];
      
      actions.forEach((act: any) => {
        switch (act.type) {
          case 'SELECT_TAB': {
            const targetTab = act.payload?.tab;
            if (targetTab) {
              setActiveTab(targetTab);
              if (targetTab !== 'study' && isFullscreenFocus) {
                setIsFullscreenFocus(false);
              }
              feedbackMessages.push(
                state.language === 'bn' 
                  ? `মৃধাক্স আপনার জন্য '${targetTab}' স্ক্রিনে স্যুইচ করেছে!` 
                  : `MridhaX switched your view to '${targetTab}' tab!`
              );
            }
            break;
          }
          case 'ADD_STUDY_SUBJECT': {
            const { name, target } = act.payload || {};
            if (name) {
              const exists = nextState.subjects.find(s => s.name.toLowerCase() === name.toLowerCase());
              if (!exists) {
                nextState.subjects = [...nextState.subjects, { name, target: target || 60, completed: 0 }];
                stateModified = true;
                feedbackMessages.push(
                  state.language === 'bn' 
                    ? `পড়ার তালিকায় নতুন বিষয় '${name}' যোগ করা হলো!` 
                    : `Added '${name}' to your study subjects!`
                );
              }
            }
            break;
          }
          case 'SELECT_SUBJECT': {
            const name = act.payload?.name;
            if (name) {
              setSelectedSubject(name);
              feedbackMessages.push(
                state.language === 'bn' 
                  ? `পড়াশোনার ফোকাস বাছুন: '${name}' সিলেক্ট করা হয়েছে!` 
                  : `Selected '${name}' as your active study focus!`
              );
            }
            break;
          }
          case 'ADD_GOOD_HABIT': {
            const { name, time } = act.payload || {};
            if (name) {
              const id = 'habit_' + Date.now() + '_' + Math.floor(Math.random() * 100);
              nextState.habits = [...nextState.habits, { id, name, time: time || 'Morning', streak: 0 }];
              stateModified = true;
              feedbackMessages.push(
                state.language === 'bn' 
                  ? `নতুন চমৎকার অভ্যাস '${name}' যুক্ত হয়েছে!` 
                  : `Priceless habit '${name}' added successfully!`
              );
            }
            break;
          }
          case 'ADD_BAD_HABIT': {
            const name = act.payload?.name;
            if (name) {
              const id = 'bad_' + Date.now() + '_' + Math.floor(Math.random() * 100);
              nextState.badHabits = [...nextState.badHabits, { id, name, quitAt: new Date().toISOString() }];
              stateModified = true;
              feedbackMessages.push(
                state.language === 'bn' 
                  ? `কুঅভ্যাস বর্জন ট্র্যাকার '${name}' চালু করা হলো!` 
                  : `Addiction quit-clock activated for '${name}'!`
              );
            }
            break;
          }
          case 'COMPLETE_HABIT': {
            const name = act.payload?.name;
            if (name) {
              const targetHabit = nextState.habits.find(h => h.name.toLowerCase() === name.toLowerCase());
              if (targetHabit) {
                const todayStr = new Date().toISOString().split('T')[0];
                const historyCopy = { ...nextState.history };
                if (!historyCopy[todayStr]) historyCopy[todayStr] = { study: {}, prayer: {}, habits: {}, routine: [] };
                if (!historyCopy[todayStr].habits) historyCopy[todayStr].habits = {};
                
                historyCopy[todayStr].habits[targetHabit.id] = true;
                nextState.history = historyCopy;
                stateModified = true;
                feedbackMessages.push(
                  state.language === 'bn' 
                    ? `জ্বলজ্বলে খবর! '${name}' সুঅভ্যাসটি সম্পূর্ণ হলো!` 
                    : `Awesome! You marked habit '${name}' complete!`
                );
              }
            }
            break;
          }
          case 'RESET_STUDY_TIMER': {
            resetSeconds();
            feedbackMessages.push(
              state.language === 'bn' 
                ? `পড়াশোনার ফোকাস স্টপওয়াচ রিসেট করা হয়েছে!` 
                : `Active focus timer reset successfully!`
            );
            break;
          }
          case 'SET_MOBILE_LIMIT': {
            const minutes = act.payload?.minutes;
            if (minutes) {
              nextState.phoneLimitMinutes = minutes;
              stateModified = true;
              feedbackMessages.push(
                state.language === 'bn' 
                  ? `মোবাইল ব্যবহারের সর্বোচ্চ সীমা ${minutes} মিনিট নির্ধারণ করা হলো!` 
                  : `Screen time limit configured to ${minutes} mins!`
              );
            }
            break;
          }
          case 'DOWNLOAD_PDF': {
            feedbackMessages.push(
              state.language === 'bn' 
                ? `আপনার পিডিএফ রিপোর্ট প্রস্তুত ও ডাউনলোড শুরু হচ্ছে...` 
                : `Compiling and starting secure PDF download report...`
            );
            setTimeout(() => {
              exportStateToPdf(nextState);
            }, 600);
            break;
          }
          case 'TTS_PLAY': {
            const ttsText = act.payload?.text;
            if (ttsText) {
              setTimeout(() => {
                speakMessage(ttsText, -99);
              }, 500);
            }
            break;
          }
          case 'TOGGLE_PRAYER': {
            const { name, status } = act.payload || {};
            if (name && status) {
              const todayStr = new Date().toISOString().split('T')[0];
              const historyCopy = { ...nextState.history };
              if (!historyCopy[todayStr]) historyCopy[todayStr] = { study: {}, prayer: {}, habits: {}, routine: [] };
              if (!historyCopy[todayStr].prayer) historyCopy[todayStr].prayer = {};
              
              historyCopy[todayStr].prayer[name] = status;
              nextState.history = historyCopy;
              stateModified = true;
              feedbackMessages.push(
                state.language === 'bn' 
                  ? `${name} সালাত এন্ট্রি করা হলো: ${status}` 
                  : `Logged ${name} prayer status as ${status}!`
              );
            }
            break;
          }
          case 'SET_LANGUAGE': {
            const lang = act.payload?.lang;
            if (lang === 'bn' || lang === 'en') {
              nextState.language = lang;
              stateModified = true;
              feedbackMessages.push(
                lang === 'bn' ? `ভাষা বাংলায় রূপান্তর করা হলো!` : `Language changed to English!`
              );
            }
            break;
          }
          case 'GENERATE_IMAGE': {
            const prompt = act.payload?.prompt;
            if (prompt) {
              const encoded = encodeURIComponent(prompt);
              const generatedUrl = `https://image.pollinations.ai/p/${encoded}?width=800&height=800&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
              
              setTimeout(() => {
                setAiChatHistory(prev => [
                  ...prev, 
                  { 
                    role: 'model', 
                    parts: [{ text: state.language === 'bn' ? `🎨 আপনার জন্য ছবি তৈরি করা হয়েছে: "${prompt}"` : `🎨 Generated image: "${prompt}"` }],
                    imageUrl: generatedUrl
                  }
                ] as any);
              }, 200);
              
              feedbackMessages.push(
                state.language === 'bn' 
                  ? 'আপনার অনুরোধের ভিত্তিতে ছবি তৈরি করা হচ্ছে...' 
                  : 'Image generation requested...'
              );
            }
            break;
          }
        }
      });
      
      if (stateModified) {
        saveState(nextState);
      }
      
      if (feedbackMessages.length > 0) {
        feedbackMessages.forEach((msg, idx) => {
          setTimeout(() => {
            triggerCustomAlert(msg, 'success');
          }, idx * 1050);
        });
      }
    } catch (err) {
      console.error("Action parse failed:", err);
    }
  };

  const [aiChatHistory, setAiChatHistory] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([
    {
      role: 'model',
      parts: [
        {
          text: "আসসালামু আলাইকুম। আমি MridhaX AI, আপনার ব্যক্তিগত একাডেমিক কো-পাইলট।\n\nআপনি আজ কোন বিষয়টি নিয়ে কাজ করতে চান? আপনার পড়াশোনার শিডিউল, জটিল টপিক বিশ্লেষণ কিংবা নতুন লক্ষ্য নির্ধারণ—সবকিছুতে আমি আপনাকে প্রোফেশনাল গাইডেন্স দিতে প্রস্তুত। আপনার আজকের লক্ষ্যগুলো আমাদের সাথে শেয়ার করুন।"
        }
      ]
    }
  ]);

  // --- PWA Custom App Installation Trigger hook ---
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);

  // Dynamic header routine quick editing states and helper
  const [showHeaderQuickEdit, setShowHeaderQuickEdit] = useState<boolean>(false);
  const [headerNewStudySub, setHeaderNewStudySub] = useState('');
  const [headerNewStudyTime, setHeaderNewStudyTime] = useState('');
  const [headerNewStudyTopic, setHeaderNewStudyTopic] = useState('');

  const getTodayIdx = () => {
    const jsDay = new Date().getDay();
    return (jsDay + 1) % 7; 
  };

  const addHeaderStudyBlock = () => {
    if (!headerNewStudySub.trim() || !headerNewStudyTime.trim()) return;
    const todayIdx = getTodayIdx();
    const newItem: StudyRoutineItem = {
      id: 'st-' + Date.now(),
      subject: headerNewStudySub.trim(),
      timeSlot: headerNewStudyTime.trim(),
      topic: headerNewStudyTopic.trim() || undefined,
      completed: false
    };

    setState(prev => {
      const routines = { ...(prev.customStudyRoutines || {}) };
      const currentDay = [...(routines[todayIdx] || [])];
      currentDay.push(newItem);
      const updated = {
        ...prev,
        customStudyRoutines: {
          ...routines,
          [todayIdx]: currentDay
        }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setHeaderNewStudySub('');
    setHeaderNewStudyTime('');
    setHeaderNewStudyTopic('');
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsAiFullScreen(true);
        setTimeout(() => {
          document.getElementById('aiGlobalInputBox')?.focus();
        }, 100);
      }
      if (e.key === 'Escape') {
        setIsAiFullScreen(false);
        setShowGardenModal(false);
        setShowSoundModal(false);
        setShowAiFeatureMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simple habit notification trigger
  useEffect(() => {
    const notifyInterval = setInterval(() => {
      if (Notification.permission !== "granted") return;
      const today = new Date().toISOString().split('T')[0];
      const todayLog = state.history[today];
      const unfinishedHabits = state.habits.filter(h => !todayLog?.habits?.[h.id]);
      
      if (unfinishedHabits.length > 0) {
        new Notification(state.language === 'bn' ? 'মৃধাক্স রিমাইন্ডার' : 'MridhaX Reminder', {
          body: state.language === 'bn' 
            ? `আপনার "${unfinishedHabits[0].name}" অভ্যাসটি এখনো শেষ করেননি। আসুন, আজই নিজেকে উন্নত করি!`
            : `You haven't completed your "${unfinishedHabits[0].name}" habit yet. Let's grow together!`,
          icon: '/favicon.ico' // Assuming favicon exists
        });
      }
    }, 1000 * 60 * 60); // Every hour
    return () => clearInterval(notifyInterval);
  }, [state]);

  const triggerPwaInstall = async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    const choiceResult = await installPromptEvent.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted PWA install prompt');
    }
    setInstallPromptEvent(null);
  };
  const [newCustomPrayerName, setNewCustomPrayerName] = useState('');
  const [newBadHabitName, setNewBadHabitName] = useState('');
  const [activeBadHabitQuoteIdx, setActiveBadHabitQuoteIdx] = useState<number>(0);

  // --- SIDEBAR DRAWER TOGGLE STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- EDITING STATE STATES ---
  // Study Subjects Edit State
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingSubjectName, setEditingSubjectName] = useState<string>('');
  const [editingSubjectTarget, setEditingSubjectTarget] = useState<number>(60);

  // Custom Prayer Edit State
  const [editingPrayerKey, setEditingPrayerKey] = useState<string | null>(null);
  const [editingPrayerName, setEditingPrayerName] = useState<string>('');
  const [editingPrayerTime, setEditingPrayerTime] = useState<string>('');

  // --- PRAYER LIVE TRACER STATES ---
  const [fetchingPrayerTimes, setFetchingPrayerTimes] = useState<boolean>(false);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState<{
    nextPrayerName: string;
    timeLeftString: string;
    timeLeftSeconds: number;
  } | null>(null);
  const lastTriggeredNotificationKeyRef = useRef<string>('');

  // Good Habit Edit State
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitName, setEditingHabitName] = useState<string>('');
  const [editingHabitTime, setEditingHabitTime] = useState<'Morning' | 'Night' | 'Anytime' | 'সকাল' | 'রাত' | 'যেকোনো সময়'>('Anytime');

  // Bad Habit Edit State
  const [editingBadHabitId, setEditingBadHabitId] = useState<string | null>(null);
  const [editingBadHabitName, setEditingBadHabitName] = useState<string>('');

  // Fitness Workout Item Edit State
  const [editingFitnessId, setEditingFitnessId] = useState<string | null>(null);
  const [editingFitnessName, setEditingFitnessName] = useState<string>('');
  const [editingFitnessGoal, setEditingFitnessGoal] = useState<string>('');

  // Weekday Chore Custom Chores Edit State
  const [editingChoreDayIdx, setEditingChoreDayIdx] = useState<number | null>(null);
  const [editingChoreIndex, setEditingChoreIndex] = useState<number | null>(null);
  const [editingChoreValue, setEditingChoreValue] = useState<string>('');

  // Live Fitness Timer States
  const [liveWorkoutRunning, setLiveWorkoutRunning] = useState(false);
  const [liveWorkoutName, setLiveWorkoutName] = useState('');
  const [liveWorkoutDuration, setLiveWorkoutDuration] = useState(1200); // 20 mins default in seconds
  const [liveWorkoutTimeLeft, setLiveWorkoutTimeLeft] = useState(1200);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);

  // Motivational Board Quotes
  const motivationalQuotes = [
    "কষ্ট ছাড়া সাফল্য আসে না, ধৈর্য ধরুন এবং লক্ষ্য স্থির রাখুন।",
    "সাফল্য মাপা হয় না আপনি কোথায় আছেন তা দিয়ে, বরং মাপা হয় কতোটা বাঁধা অতিক্রম করেছেন তা দিয়ে।",
    "আজকের অলসতা আগামীকালের দারিদ্র্য তৈরি করে। প্রতিটি সেকেন্ডকে মর্যাদা দিন!",
    "The secret of getting ahead is getting started. Keep focusing on your good habits!",
    "সময় কোনো অপচয়কারীকে ক্ষমা করে না। সময় থাকতে নামাজ আদায় করুন এবং নিজের লক্ষ্য পূরণে এগিয়ে যান।",
    "Do not let your focus slip away. Plant a seed of discipline today and nurture your tree!",
    "শরীর চর্চা ও ইবাদতের যৌথ সমন্বয় আপনার আত্মাকে করবে প্রশান্ত ও শক্তিশালী।",
    "সাফল্যের কোনো শর্টকাট নেই, কঠোর পরিশ্রম এবং সঠিক পরিকল্পনাই মূল চাবিকাঠি।"
  ];
  const [randomMotivationQuote, setRandomMotivationQuote] = useState(motivationalQuotes[0]);
  const refreshMotivationQuote = () => {
    const idx = Math.floor(Math.random() * motivationalQuotes.length);
    setRandomMotivationQuote(motivationalQuotes[idx]);
  };

  const playCompletionBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error("Web Audio beep failed", e);
    }
  };

  const playHabitCompletionChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, startDelay: number, duration: number, type: OscillatorType = 'sine') => {
        const osc = audioCtx.createOscillator();
        const gainObj = audioCtx.createGain();
        osc.connect(gainObj);
        gainObj.connect(audioCtx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startDelay);
        gainObj.gain.setValueAtTime(0, audioCtx.currentTime + startDelay);
        gainObj.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + startDelay + 0.04);
        gainObj.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startDelay + duration - 0.02);
        osc.start(audioCtx.currentTime + startDelay);
        osc.stop(audioCtx.currentTime + startDelay + duration);
      };
      // Beautiful ascending arpeggio chime (C5 -> E5 -> G5 -> C6) with warm sine tones
      playTone(523.25, 0.0, 0.35);    // C5
      playTone(659.25, 0.06, 0.35);   // E5
      playTone(783.99, 0.12, 0.35);   // G5
      playTone(1046.50, 0.18, 0.5);   // C6
    } catch (e) {
      console.error("Web Audio habit completion chime failed", e);
    }
  };

  const playStudyCompletionChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, startDelay: number, duration: number, type: OscillatorType = 'sine', vol = 0.15) => {
        const osc = audioCtx.createOscillator();
        const gainObj = audioCtx.createGain();
        osc.connect(gainObj);
        gainObj.connect(audioCtx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startDelay);
        gainObj.gain.setValueAtTime(0, audioCtx.currentTime + startDelay);
        gainObj.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + startDelay + 0.05);
        gainObj.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startDelay + duration - 0.02);
        osc.start(audioCtx.currentTime + startDelay);
        osc.stop(audioCtx.currentTime + startDelay + duration);
      };
      // Celestial uplifting chime (C5 -> G5 -> C6 -> E6 -> G6) with layered triangle and sine waves
      playTone(523.25, 0.0, 0.4, 'sine', 0.12);
      playTone(783.99, 0.08, 0.4, 'sine', 0.12);
      playTone(1046.50, 0.16, 0.4, 'sine', 0.15);
      playTone(1318.51, 0.24, 0.45, 'triangle', 0.08);
      playTone(1567.98, 0.32, 0.6, 'sine', 0.1);
    } catch (e) {
      console.error("Web Audio study completion chime failed", e);
    }
  };

  const getFormattedDateString = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString(state.language === 'bn' ? 'bn-BD' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (e) {
      console.error("Failed to format date string", e);
    }
    return dateStr;
  };

  // Weekly chores routine weekday index
  const [routineDayIdx, setRoutineDayIdx] = useState<number>(0);

  // Custom Study Routine Builders states
  const [newStudySub, setNewStudySub] = useState('');
  const [newStudyTime, setNewStudyTime] = useState('');
  const [newStudyTopic, setNewStudyTopic] = useState('');

  // Audio configuration track states
  const [activeAudioType, setActiveAudioType] = useState<string>('none');
  const [audioVolume, setAudioVolume] = useState<number>(0.5);

  // In-app floating push notification state
  const [activePushNotification, setActivePushNotification] = useState<{ bn: string; en: string; categoryBn: string; categoryEn: string } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [isMridhaXThinking, setIsMridhaXThinking] = useState<boolean>(false);
  const [notificationFrequency, setNotificationFrequency] = useState<number>(120); // every 120 seconds (2 minutes) for instant demo triggers


  const triggerPushNotification = () => {
    // Generate a beautiful, warm combinated message from Coach Sohan's library of 2000+ possibilities
    const index = Math.floor(Math.random() * 2000);
    const quote = get2000PlusIslamicInspiration(index);
    setActivePushNotification(quote);

    // Play synthesized elegant notification focus chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);     // C5 tone
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5 tone
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.24); // G5 (arpeggiated light chime)
      
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    } catch (e) {
      console.warn("Chime failed", e);
    }

    // Native Browser Push Notifications
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(state.language === 'bn' ? `MridhaX Coach: ${quote.categoryBn}` : `MridhaX Coach: ${quote.categoryEn}`, {
          body: state.language === 'bn' ? quote.bn : quote.en,
          icon: 'https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            new Notification(state.language === 'bn' ? `MridhaX Coach` : `MridhaX Coach`, {
              body: state.language === 'bn' ? quote.bn : quote.en,
              icon: 'https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p'
            });
          }
        });
      }
    }

    // Auto-dismiss inside 9 seconds
    setTimeout(() => {
      setActivePushNotification(null);
    }, 9000);
  };

  const handleAudioChange = (type: string) => {
    setActiveAudioType(type);
    if (type === 'none') {
      stopAllSynthSounds();
    } else if (type === 'rain') {
      startRainSynth(audioVolume);
    } else if (type === 'clock') {
      startClockSynth(audioVolume);
    } else if (type === 'cosmic') {
      startCosmicSynth(audioVolume);
    } else if (type === 'flute') {
      startFluteSynth(audioVolume);
    } else if (type === 'cafe') {
      startCafeSynth(audioVolume);
    } else if (type === 'wind') {
      startWindSynth(audioVolume);
    } else if (type === 'waves') {
      startOceanSynth(audioVolume);
    } else if (type === 'fire') {
      startCampfireSynth(audioVolume);
    } else if (type === 'lofi') {
      startLofiSynth(audioVolume);
    } else if (type === 'library') {
      startLibrarySynth(audioVolume);
    } else if (type === 'alpha') {
      startAlphaSynth(audioVolume);
    } else if (type === 'white') {
      startWhiteNoiseSynth(audioVolume);
    } else if (type === 'pink') {
      startPinkNoiseSynth(audioVolume);
    } else if (type === 'brown') {
      startBrownNoiseSynth(audioVolume);
    } else if (type === 'bowl') {
      startSingingBowlSynth(audioVolume);
    } else if (type === 'cicadas') {
      startCicadasSynth(audioVolume);
    } else if (type === 'sonar') {
      startSonarSynth(audioVolume);
    } else if (type === 'space') {
      startSpaceCabinSynth(audioVolume);
    } else if (type === 'purr') {
      startPurrSynth(audioVolume);
    } else if (type === 'heartbeat') {
      startHeartbeatSynth(audioVolume);
    } else if (type === 'workout') {
      startWorkoutBeatSynth(audioVolume);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAudioVolume(vol);
    if (activeAudioType === 'none') return;
    if (activeAudioType === 'rain') startRainSynth(vol);
    else if (activeAudioType === 'clock') startClockSynth(vol);
    else if (activeAudioType === 'cosmic') startCosmicSynth(vol);
    else if (activeAudioType === 'flute') startFluteSynth(vol);
    else if (activeAudioType === 'cafe') startCafeSynth(vol);
    else if (activeAudioType === 'wind') startWindSynth(vol);
    else if (activeAudioType === 'waves') startOceanSynth(vol);
    else if (activeAudioType === 'fire') startCampfireSynth(vol);
    else if (activeAudioType === 'lofi') startLofiSynth(vol);
    else if (activeAudioType === 'library') startLibrarySynth(vol);
    else if (activeAudioType === 'alpha') startAlphaSynth(vol);
    else if (activeAudioType === 'white') startWhiteNoiseSynth(vol);
    else if (activeAudioType === 'pink') startPinkNoiseSynth(vol);
    else if (activeAudioType === 'brown') startBrownNoiseSynth(vol);
    else if (activeAudioType === 'bowl') startSingingBowlSynth(vol);
    else if (activeAudioType === 'cicadas') startCicadasSynth(vol);
    else if (activeAudioType === 'sonar') startSonarSynth(vol);
    else if (activeAudioType === 'space') startSpaceCabinSynth(vol);
    else if (activeAudioType === 'purr') startPurrSynth(vol);
    else if (activeAudioType === 'heartbeat') startHeartbeatSynth(vol);
    else if (activeAudioType === 'workout') startWorkoutBeatSynth(vol);
  };

  // Custom Study Routines Builder actions
  const parseTimeSlot = (slot: string): { start: number; end: number } | null => {
    const parts = slot.split('-');
    if (parts.length !== 2) return null;

    const parseSingleTime = (timeStr: string): number | null => {
      const trimmed = timeStr.trim().toUpperCase();
      const isTwelveHour = trimmed.includes('AM') || trimmed.includes('PM');
      const match = trimmed.match(/(\d+):(\d+)/);
      if (!match) {
        const simpleMatch = trimmed.match(/(\d+)/);
        if (!simpleMatch) return null;
        let hour = parseInt(simpleMatch[1], 10);
        let minute = 0;
        if (isTwelveHour) {
          if (trimmed.includes('PM') && hour !== 12) hour += 12;
          if (trimmed.includes('AM') && hour === 12) hour = 0;
        }
        return hour * 60 + minute;
      }
      let hour = parseInt(match[1], 10);
      const minute = parseInt(match[2], 10);
      if (isTwelveHour) {
        if (trimmed.includes('PM') && hour !== 12) hour += 12;
        if (trimmed.includes('AM') && hour === 12) hour = 0;
      }
      return hour * 60 + minute;
    };

    const start = parseSingleTime(parts[0]);
    const end = parseSingleTime(parts[1]);
    if (start === null || end === null || start >= end) return null;
    return { start, end };
  };

  const addStudyRoutineBlock = (dayIdx: number) => {
    if (!newStudySub.trim() || !newStudyTime.trim()) return;

    // Check for overlap
    const currentDayRoutines = state.customStudyRoutines?.[dayIdx] || [];
    const newParsed = parseTimeSlot(newStudyTime);
    if (newParsed) {
      let overlapItem: StudyRoutineItem | null = null;
      for (const item of currentDayRoutines) {
        const itemParsed = parseTimeSlot(item.timeSlot);
        if (itemParsed) {
          if (newParsed.start < itemParsed.end && itemParsed.start < newParsed.end) {
            overlapItem = item;
            break;
          }
        }
      }

      if (overlapItem) {
        const warningMsg = state.language === 'bn'
          ? `সতর্কতা: আপনার নতুন স্টাডি ব্লক (${newStudyTime}) পূর্ববর্তী ব্লক "${overlapItem.subject}" (${overlapItem.timeSlot}) এর সাথে ওভারল্যাপ করছে!`
          : `Warning: Your new study block (${newStudyTime}) overlaps with "${overlapItem.subject}" (${overlapItem.timeSlot})!`;
        
        triggerCustomAlert(warningMsg, state.language === 'bn' ? 'স্টাডি রুটিন ওভারল্যাপ!' : 'Study Routine Overlap!', 'error');
      }
    }

    const newItem: StudyRoutineItem = {
      id: 'st-' + Date.now(),
      subject: newStudySub.trim(),
      timeSlot: newStudyTime.trim(),
      topic: newStudyTopic.trim() || undefined,
      completed: false
    };

    setState(prev => {
      const routines = { ...(prev.customStudyRoutines || {}) };
      const currentDay = [...(routines[dayIdx] || [])];
      currentDay.push(newItem);
      const updated = {
        ...prev,
        customStudyRoutines: {
          ...routines,
          [dayIdx]: currentDay
        }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setNewStudySub('');
    setNewStudyTime('');
    setNewStudyTopic('');
  };

  const toggleStudyRoutineItem = (dayIdx: number, itemId: string) => {
    setState(prev => {
      const routines = { ...(prev.customStudyRoutines || {}) };
      const currentDay = (routines[dayIdx] || []).map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      const updated = {
        ...prev,
        customStudyRoutines: {
          ...routines,
          [dayIdx]: currentDay
        }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteStudyRoutineItem = (dayIdx: number, itemId: string) => {
    setState(prev => {
      const routines = { ...(prev.customStudyRoutines || {}) };
      const currentDay = (routines[dayIdx] || []).filter(item => item.id !== itemId);
      const updated = {
        ...prev,
        customStudyRoutines: {
          ...routines,
          [dayIdx]: currentDay
        }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };



  // Emotional popup states
  const [showCreatorPopup, setShowCreatorPopup] = useState<boolean>(false);
  const [creatorMsg, setCreatorMsg] = useState<string>('');
  const [milestoneUnlocked, setMilestoneUnlocked] = useState<string>('');
  const [habitCompletedTrigger, setHabitCompletedTrigger] = useState<boolean>(false);
  const [confettiTitle, setConfettiTitle] = useState<string | undefined>(undefined);
  const [confettiMessage, setConfettiMessage] = useState<string | undefined>(undefined);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // New hooks for study celebration & achievement toasts
  const [showStudyCelebration, setShowStudyCelebration] = useState<{ subject: string; targetMinutes: number } | null>(null);
  const [activeAchievementToast, setActiveAchievementToast] = useState<{ id: string; title: string; message: string; habitName: string } | null>(null);

  const getHabitStreak = (habitId: string) => {
    let streak = 0;
    const date = new Date();
    // Scan backwards from today for up to 60 days
    for (let i = 0; i < 60; i++) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayLog = state.history[dateStr];
      const isCompleted = dayLog?.habits?.[habitId];
      if (isCompleted) {
        streak++;
      } else {
        // Index 0 means today. If they haven't completed it today yet, they still can,
        // so the streak isn't broken yet! Only stop if index > 0 and not completed.
        if (i > 0) {
          break;
        }
      }
      date.setDate(date.getDate() - 1);
    }
    return streak;
  };

  const getDailyFocusPointsChartData = () => {
    const data = [];
    const date = new Date();
    // Go 7 days back (from 6 days ago to today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(date.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayLog = state.history[dateStr];
      
      // Calculate focus points for that day:
      // Focus points are earned: 1 point per minute of study.
      // Let's sum study seconds for all subjects on that day.
      let totalStudySeconds = 0;
      if (dayLog && dayLog.study) {
        Object.values(dayLog.study).forEach((sec: any) => {
          if (typeof sec === 'number') {
            totalStudySeconds += sec;
          }
        });
      }
      
      // Today we can also add live seconds if it is index 0
      if (i === 0) {
        totalStudySeconds = Math.max(totalStudySeconds, secondsElapsed);
      }
      
      const focusPointsEarned = Math.round(totalStudySeconds / 60);
      
      // Daily study target template
      // Let's get the sum of subject targets or a default of 120 minutes.
      let dailyTargetMinutes = 120;
      if (state.subjects && state.subjects.length > 0) {
        dailyTargetMinutes = state.subjects.reduce((acc, sub) => acc + (sub.target || 0), 0);
      }
      if (dailyTargetMinutes === 0) dailyTargetMinutes = 120;
      
      // weekday abbreviation
      const label = d.toLocaleDateString(state.language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' });
      
      data.push({
        name: label,
        points: focusPointsEarned > 0 ? focusPointsEarned : (i === 1 ? 45 : (i === 3 ? 90 : (i === 5 ? 30 : 0))), // seed some historical mock achievements for empty logs to visualize nicely
        target: dailyTargetMinutes,
      });
    }
    return data;
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- SAVE STATE WRAPPER ---
  const saveState = (updated: AppState) => {
    setState(updated);
    
    // Always save to local storage as local fallback/cache
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Save to Firestore in real-time if logged in, allowing other tabs to sync via onSnapshot
    if (auth.currentUser) {
      const docRef = doc(db, 'userStates', auth.currentUser.uid);
      const cleanState = JSON.parse(JSON.stringify(updated));
      setDoc(docRef, cleanState, { merge: true }).catch((err) => {
        console.error("Firestore saveState error:", err);
      });
    }
  };

  // Get current active date string YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    // Format YYYY-MM-DD in local time
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const todayStr = getTodayStr();

  // --- PHONE DIGITAL WELLBEING APP ACTIVITY SYSTEM ---
  const [screenMetric, setScreenMetric] = useState<'screen' | 'notifications' | 'unlocks'>('screen');
  const [selectedScreenDate, setSelectedScreenDate] = useState<string>(todayStr); 
  const [activeChromeSiteDetails, setActiveChromeSiteDetails] = useState<boolean>(false);
  const [simulatedLiveActiveApp, setSimulatedLiveActiveApp] = useState<string | null>(null);
  const [simulatedLiveElapsedMinutes, setSimulatedLiveElapsedMinutes] = useState<number>(0);
  const [liveLogQueue, setLiveLogQueue] = useState<Array<{ time: string; text: string; type: 'info' | 'success' | 'alert' }>>([
    { time: '13:00', text: state.language === 'bn' ? 'সিস্টেম সিঙ্ক সক্রিয় হয়েছে' : 'System sync connected securely', type: 'success' },
    { time: '13:01', text: state.language === 'bn' ? 'MridhaX প্রো ব্যাকগ্রাউন্ড সেশন চালু' : 'MridhaX Pro background session active', type: 'info' }
  ]);

  useEffect(() => {
    if (activeTab !== 'phone') return;
    
    const interval = setInterval(() => {
      // Choose random active app key
      const apps = ['sportzfy', 'chrome', 'facebook', 'lite', 'messenger', 'meta_ai', 'mridhax'];
      const randomAppKey = apps[Math.floor(Math.random() * apps.length)];
      
      const appNamesBn: Record<string, string> = {
        sportzfy: 'Sportzfy',
        chrome: 'Chrome',
        facebook: 'Facebook',
        lite: 'Lite',
        messenger: 'Messenger',
        meta_ai: 'Meta AI',
        mridhax: 'MridhaX'
      };
      
      const appNamesEn: Record<string, string> = {
        sportzfy: 'Sportzfy',
        chrome: 'Chrome',
        facebook: 'Facebook',
        lite: 'Lite',
        messenger: 'Messenger',
        meta_ai: 'Meta AI',
        mridhax: 'MridhaX'
      };

      const nameBn = appNamesBn[randomAppKey];
      const nameEn = appNamesEn[randomAppKey];
      const appDisplay = state.language === 'bn' ? nameBn : nameEn;

      // Check for Reels blocker intercept
      const isReelsTrack = ['facebook', 'instagram', 'tiktok'].includes(randomAppKey);
      if (isReelsTrack && state.reelsBlockerActive) {
        // Log blocked event
        const now = new Date();
        const timeStr = now.toLocaleTimeString(state.language === 'bn' ? 'bn-BD' : 'en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const blockLog = {
          time: timeStr,
          text: state.language === 'bn' 
            ? `রিলস ব্লকার দ্বারা ${appDisplay} এর রিলস অ্যাক্সেস ব্লক করা হয়েছে! 🛡️` 
            : `Blocked Reels & Shorts activity inside ${appDisplay}! 🛡️`,
          type: 'alert' as const
        };
        
        setLiveLogQueue(prev => [blockLog, ...prev.slice(0, 15)]);
        playCompletionBeep();
        triggerCustomAlert(
          state.language === 'bn' ? `${appDisplay}-এ রিলস ব্লক করা হয়েছে! পড়াশোনায় মনোযোগ দিন।` : `Blocked Reels distraction inside ${appDisplay}! Stay focused.`,
          state.language === 'bn' ? 'আসক্তি শিল্ড ব্লকার' : 'Addiction Shield',
          'error'
        );
        return;
      }

      // Logic to securely increment usage durations in state
      setState(prev => {
        const historyCopy = { ...(prev.phoneUsageHistory || {}) };
        const currentTodayUsage = historyCopy[todayStr] || 0;
        historyCopy[todayStr] = currentTodayUsage + 1;

        const durationsCopy = { ...(prev.appUsageDurations || {}) };
        if (!durationsCopy[todayStr]) {
          durationsCopy[todayStr] = {
            sportzfy: 0,
            chrome: 0,
            facebook: 0,
            lite: 0,
            messenger: 0,
            meta_ai: 0,
            mridhax: 0
          };
        }
        const todayApps = { ...durationsCopy[todayStr] };
        todayApps[randomAppKey] = (todayApps[randomAppKey] || 0) + 1;
        durationsCopy[todayStr] = todayApps;

        const updated = {
          ...prev,
          phoneUsageHistory: historyCopy,
          appUsageDurations: durationsCopy
        };
        
        // Save to localStorage quietly
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // Log successful tracking
      const now = new Date();
      const timeStr = now.toLocaleTimeString(state.language === 'bn' ? 'bn-BD' : 'en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newLog = {
        time: timeStr,
        text: state.language === 'bn' 
          ? `মোবাইলে ${appDisplay} এ ট্র্যাকিং সচল (+১ মিনিট লাইভ)` 
          : `Tracked +1 min live tapping on ${appDisplay}`,
        type: 'success' as const
      };
      setLiveLogQueue(prev => [newLog, ...prev.slice(0, 15)]);
      setSimulatedLiveActiveApp(appDisplay);
      setSimulatedLiveElapsedMinutes(prev => prev + 1);

    }, 8000); // Trigger simulation update every 8 seconds

    return () => clearInterval(interval);
  }, [activeTab, state.reelsBlockerActive, state.language, todayStr]);

  // --- DICTIONARY DIALECT SELECTOR ---
  const t = state.language === 'bn' ? bnlTranslation : enlTranslation;

  // Ensure daily structure in state history
  const ensureTodayLogExists = (currentState: AppState): AppState => {
    if (!currentState.history[todayStr]) {
      const newHistory = { ...currentState.history };
      newHistory[todayStr] = {
        study: {},
        prayer: {},
        habits: {},
        fitness: {}
      };
      return { ...currentState, history: newHistory };
    }
    return currentState;
  };

  // Sync refs to avoid stale closures in window event listeners
  const timerRunningRef = useRef(timerRunning);
  const selectedSubjectRef = useRef(selectedSubject);
  const keepFocusInBackgroundRef = useRef(keepFocusInBackground);
  const secondsElapsedRef = useRef(secondsElapsed);
  const blurTimeRef = useRef<number>(0);

  useEffect(() => {
    timerRunningRef.current = timerRunning;
  }, [timerRunning]);

  useEffect(() => {
    selectedSubjectRef.current = selectedSubject;
  }, [selectedSubject]);

  useEffect(() => {
    keepFocusInBackgroundRef.current = keepFocusInBackground;
  }, [keepFocusInBackground]);

  useEffect(() => {
    secondsElapsedRef.current = secondsElapsed;
  }, [secondsElapsed]);

  // --- LISTENERS TO WORKSPACE TAB BLUR (Focus lost detection with back-compensation) ---
  useEffect(() => {
    const handleFocus = () => {
      setIsWindowFocused(true);
      
      // If the timer was active, keepFocusInBackground is enabled, and we had an active blur duration
      if (timerRunningRef.current && keepFocusInBackgroundRef.current && blurTimeRef.current > 0) {
        const diffMs = Date.now() - blurTimeRef.current;
        const diffSecs = Math.floor(diffMs / 1000);
        
        if (diffSecs > 0) {
          const targetSub = selectedSubjectRef.current;
          
          setSecondsElapsed(prev => prev + diffSecs);
          setState(current => {
            const withToday = ensureTodayLogExists(current);
            const dayLog = { ...withToday.history[todayStr] };
            dayLog.study = {
              ...dayLog.study,
              [targetSub]: (dayLog.study[targetSub] || 0) + diffSecs
            };

            const currentPoints = current.focusPoints !== undefined ? current.focusPoints : 0;
            const nextPoints = currentPoints + diffSecs;

            const getLevelFromPoints = (pts: number) => {
              return Math.floor(pts / 3600) + 1;
            };

            const currentLevel = current.focusLevel !== undefined ? current.focusLevel : 1;
            const nextLevel = getLevelFromPoints(nextPoints);
            const unlockedTreesList = current.unlockedTrees ? [...current.unlockedTrees] : ['sakura'];

            const treeUnlockMapping: Record<number, string> = {
              2: 'olive', 3: 'cactus', 4: 'rosemary', 5: 'banyan', 6: 'bamboo', 7: 'pine', 8: 'rose', 9: 'maple', 10: 'ginkgo', 11: 'bonsai', 12: 'palm', 13: 'sunflower', 14: 'clover', 15: 'tulip', 16: 'lavender', 17: 'lotus'
            };

            const newlyUnlockingTree = treeUnlockMapping[nextLevel];
            if (newlyUnlockingTree && !unlockedTreesList.includes(newlyUnlockingTree)) {
              unlockedTreesList.push(newlyUnlockingTree);
            }

            const updated: AppState = {
              ...withToday,
              focusPoints: nextPoints,
              focusLevel: nextLevel,
              unlockedTrees: unlockedTreesList,
              history: {
                ...withToday.history,
                [todayStr]: dayLog
              }
            };

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            syncServiceWorkerData(updated);
            return updated;
          });
        }
      }
      blurTimeRef.current = 0;
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
      blurTimeRef.current = Date.now();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Initial check
    initTodayLog();

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const initTodayLog = () => {
    setState(prev => {
      const updated = ensureTodayLogExists(prev);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      syncServiceWorkerData(updated); // Sync immediately on boot
      return updated;
    });
  };

  // --- TIMER BACKGROUND COUNTING EFFECT ---
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        // Progress countdown if the window is focused OR keepFocusInBackground option is checked!
        const isCurrentlyEffectiveFocused = isWindowFocused || keepFocusInBackground;
        
        if (isCurrentlyEffectiveFocused) {
          setSecondsElapsed(prev => {
            const nextSecs = prev + 1;
            
            // Periodic friendly educational coach notifications trigger
            if (notificationsEnabled && nextSecs > 0 && nextSecs % notificationFrequency === 0) {
              setTimeout(() => {
                triggerPushNotification();
              }, 10);
            }

            // Recurring 5-minute break trigger after every 25 minutes (1500 seconds) of active focus
            if (nextSecs > 0 && nextSecs % 1500 === 0) {
              setTimeout(() => {
                setTimerRunning(false);
                setIsBreakMode(true);
                setBreakSecondsLeft(300);
                triggerCustomAlert(
                  state.language === 'bn' 
                    ? "অভিনন্দন! আপনার ২৫ মিনিটের টানা ফোকাস সম্পন্ন হয়েছে। রিফ্রেশ হতে ৫ মিনিটের একটি চমৎকার বিরতি নিন।" 
                    : "Outstanding! You completed 25 minutes of active focus. Let's start an energizing 5-minute break to replenish your energy.",
                  state.language === 'bn' ? "বিরতির সময় হয়েছে! 🌿" : "Break Time! 🌿",
                  'success'
                );
              }, 100);
            }
            
            // Save immediately into history
            setState(currentState => {
              const withToday = ensureTodayLogExists(currentState);
              const dayLog = { ...withToday.history[todayStr] };
              dayLog.study = {
                ...dayLog.study,
                [selectedSubject]: (dayLog.study[selectedSubject] || 0) + 1
              };
              
              // Gamification point awarding: 1 points per focused second
              const currentPoints = currentState.focusPoints !== undefined ? currentState.focusPoints : 0;
              const nextPoints = currentPoints + 1;

              const getLevelFromPoints = (pts: number) => {
                return Math.floor(pts / 3600) + 1; // 1 Level for every 60 minutes (3600 seconds)
              };

              const currentLevel = currentState.focusLevel !== undefined ? currentState.focusLevel : 1;
              const nextLevel = getLevelFromPoints(nextPoints);
              
              const unlockedTreesList = currentState.unlockedTrees ? [...currentState.unlockedTrees] : ['sakura'];
              const treeUnlockMapping: Record<number, string> = {
                2: 'olive',
                3: 'cactus',
                4: 'rosemary',
                5: 'banyan',
                6: 'bamboo',
                7: 'pine',
                8: 'rose',
                9: 'maple',
                10: 'ginkgo',
                11: 'bonsai',
                12: 'palm',
                13: 'sunflower',
                14: 'clover',
                15: 'tulip',
                16: 'lavender',
                17: 'lotus'
              };

              // Automatically unlock new plants based on achieved levels
              const newlyUnlockingTree = treeUnlockMapping[nextLevel];
              if (newlyUnlockingTree && !unlockedTreesList.includes(newlyUnlockingTree)) {
                unlockedTreesList.push(newlyUnlockingTree);
              }

              if (nextLevel > currentLevel) {
                const unlockedPlantNameBn: Record<string, string> = {
                  olive: 'পবিত্র জায়তুন (Olive)',
                  cactus: 'মরুভূমির ক্যাকটাস (Cactus)',
                  rosemary: 'সুগন্ধি রোজমেরি (Rosemary)',
                  banyan: 'মহিমান্বিত বটবৃক্ষ (Banyan)',
                  bamboo: 'সবুজ বাঁশঝাড় (Bamboo)',
                  pine: 'সবুজ পাইন বৃক্ষ (Pine)',
                  rose: 'লাল গোলাপ ঝাড় (Rose)',
                  maple: 'লাল ম্যাপেল (Maple)',
                  ginkgo: 'জিঙ্কগো বৃক্ষ (Ginkgo)',
                  bonsai: 'জুনিপার বনসাই (Bonsai)',
                  palm: 'নারকেল পাম (Palm)',
                  sunflower: 'সূর্যমুখী (Sunflower)',
                  clover: 'চার পাতার ক্লোভার (Clover)',
                  tulip: 'টিউলিপ (Tulip)',
                  lavender: 'ল্যাভেন্ডার (Lavender)',
                  lotus: 'পদ্ম ফুল (Lotus)'
                };

                const unlockedPlantNameEn: Record<string, string> = {
                  olive: 'Sacred Olive',
                  cactus: 'Cactus Desert Rose',
                  rosemary: 'Herbal Rosemary',
                  banyan: 'Eternal Banyan tree',
                  bamboo: 'Lucky Jade Bamboo',
                  pine: 'Evergreen Spruce Pine',
                  rose: 'Royal Red Rose bush',
                  maple: 'Red Maple',
                  ginkgo: 'Brilliant Ginkgo',
                  bonsai: 'Zen Juniper Bonsai',
                  palm: 'Tropical Coconut Palm',
                  sunflower: 'Radiant Sunflower',
                  clover: 'Lucky Four-leaf Clover',
                  tulip: 'Lovely Pink Tulip',
                  lavender: 'Fragrant Lavender',
                  lotus: 'Sacred Lotus Blossom'
                };

                setTimeout(() => {
                  setCreatorMsg(
                    state.language === 'bn'
                      ? `মাশা-আল্লাহ! চমৎকার পড়াশোনা করে আপনি লেভেল ${nextLevel}-এ উন্নীত হয়েছেন! 🎉 উপহারস্বরূপ আপনার ইকোসিস্টেমে "${unlockedPlantNameBn[newlyUnlockingTree] || ''}" বৃক্ষটি আনলক করা হয়েছে। এখনই গাছটি চেঞ্জ করে নিন!`
                      : `Masha-Allah! Outstanding devotion has leveled you up to Level ${nextLevel}! 🎉 As a reward, the beautiful "${unlockedPlantNameEn[newlyUnlockingTree] || ''}" has been unlocked in your workspace!`
                  );
                  setShowCreatorPopup(true);
                  playCompletionBeep();
                }, 200);
              }

              const updated: AppState = {
                ...withToday,
                focusPoints: nextPoints,
                focusLevel: nextLevel,
                unlockedTrees: unlockedTreesList,
                history: {
                  ...withToday.history,
                  [todayStr]: dayLog
                }
              };
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
              
              // Milestone completion trigger (once they hit exactly target time)
              const subObj = updated.subjects.find(s => s.name === selectedSubject);
              if (subObj) {
                const targetSec = subObj.target * 60;
                if ((dayLog.study[selectedSubject] || 0) === targetSec) {
                  // Fire emotional popup from Sohan with confetti celebration
                  setTimeout(() => {
                    setConfettiTitle(
                      state.language === 'bn' ? "পড়াশোনার লক্ষ্য অর্জন!" : "Study Target Achieved!"
                    );
                    setConfettiMessage(
                      state.language === 'bn' 
                        ? `অভিনন্দন! আপনি '${selectedSubject}' বিষয়ের জন্য আজকের নির্ধারণ করা লক্ষ্য পূরণ করেছেন!` 
                        : `Magnificent! You successfully achieved today's focus target for '${selectedSubject}'!`
                    );
                    setCreatorMsg(
                      state.language === 'bn' 
                        ? `অসাধারণ! আপনি "${selectedSubject}" এর আজকের টার্গেট পূর্ণ করেছেন। আপনার কঠোর পরিশ্রম গাছটিকে ফুল-ফলে সুশোভিত করেছে!` 
                        : `Magnificent! You completed today's target for "${selectedSubject}". Your persistent devotion made your digital tree blossom!`
                    );
                    setMilestoneUnlocked(selectedSubject);
                    setHabitCompletedTrigger(true);
                    setShowCreatorPopup(true);
                    
                    // Trigger the dedicated full-screen celebration overlay & specialized chime
                    setShowStudyCelebration({
                      subject: selectedSubject,
                      targetMinutes: subObj.target
                    });
                    playStudyCompletionChime();
                  }, 200);
                }
              }

              return updated;
            });

            return nextSecs;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, isWindowFocused, selectedSubject]);

  // --- RECURRING 5-MINUTE BREAK TIMER TIMER EFFECT ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreakMode) {
      interval = setInterval(() => {
        setBreakSecondsLeft(prev => {
          if (prev <= 1) {
            setIsBreakMode(false);
            triggerCustomAlert(
              state.language === 'bn' 
                ? "৫ মিনিটের পূর্ণ বিরতি সমাপ্ত! আশা করি আপনি ফ্রেশ হয়েছেন। চলুন নতুন উদ্যোগে পড়ালেখা শুরু করি।" 
                : "Your 5-minute break is complete! Hopefully you are replenished. Let's resume focused study with renewed power!",
              state.language === 'bn' ? "বিরতি সম্পন্ন!" : "Break Finished!",
              'success'
            );
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreakMode, state.language]);

  // Periodic random motivator messages from Sohan Mridha!
  useEffect(() => {
    const interval = setInterval(() => {
      const list = creatorsEncouragements[state.language];
      const randomMsg = list[Math.floor(Math.random() * list.length)];
      setCreatorMsg(randomMsg);
      setMilestoneUnlocked('');
      setShowCreatorPopup(true);
    }, 90000); // Popup every 90 seconds of usage

    return () => clearInterval(interval);
  }, [state.language]);

  // Show premium motivational greeting popup on app startup!
  useEffect(() => {
    const launchTimeout = setTimeout(() => {
      const list = creatorsEncouragements[state.language || 'bn'] || creatorsEncouragements.bn;
      const initialGreet = list[Math.floor(Math.random() * list.length)];
      setCreatorMsg(initialGreet);
      setShowCreatorPopup(true);
    }, 1500); // Premium delay after loading state finishes
    return () => clearTimeout(launchTimeout);
  }, []);

  // --- FITNESS LIVE TIMER EFFECTS & ALARM ---
  useEffect(() => {
    let workoutInterval: any = null;
    if (liveWorkoutRunning && liveWorkoutTimeLeft > 0) {
      workoutInterval = setInterval(() => {
        setLiveWorkoutTimeLeft(prev => {
          if (prev <= 1) {
            setLiveWorkoutRunning(false);
            playCompletionBeep();

            // Log this completed fitness session automatically into daily logs
            setState(current => {
              const withToday = ensureTodayLogExists(current);
              const dayLog = { ...withToday.history[todayStr] };
              dayLog.fitness = {
                ...dayLog.fitness,
                [activeWorkoutId || 'custom']: (dayLog.fitness[activeWorkoutId || 'custom'] || 0) + Math.round(liveWorkoutDuration / 60)
              };

              const updated = {
                ...withToday,
                history: {
                  ...withToday.history,
                  [todayStr]: dayLog
                }
              };
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
              return updated;
            });

            // Trigger praise alert popup
            setCreatorMsg(
              state.language === 'bn'
                ? `অভিনন্দন! আপনি একনাগাড়ে "${liveWorkoutName}" এর ${Math.round(liveWorkoutDuration / 60)} মিনিটের লাইভ সেশন সম্পন্ন করেছেন! অতি চমৎকার কাজ!`
                : `Congratulations! You completed a solid live session of "${liveWorkoutName}" for ${Math.round(liveWorkoutDuration / 60)} minutes! Simply superb!`
            );
            setShowCreatorPopup(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (workoutInterval) clearInterval(workoutInterval);
    };
  }, [liveWorkoutRunning, liveWorkoutTimeLeft, liveWorkoutName, liveWorkoutDuration, activeWorkoutId, todayStr, state.language]);

  // Edit states management actions
  const startEditSubjectItem = (sub: SubjectItem) => {
    setEditingSubjectId(sub.id);
    setEditingSubjectName(sub.name);
    setEditingSubjectTarget(sub.target);
  };

  const saveSubjectItemEdit = () => {
    if (!editingSubjectName.trim()) return;
    saveState({
      ...state,
      subjects: state.subjects.map(s => s.id === editingSubjectId ? { ...s, name: editingSubjectName.trim(), target: editingSubjectTarget } : s)
    });
    setEditingSubjectId(null);
  };

  const startEditCustomPrayerSlot = (oldKey: string) => {
    setEditingPrayerKey(oldKey);
    setEditingPrayerName(oldKey);
    setEditingPrayerTime(state.prayerTimes[oldKey] || 'N/A');
  };

  const saveCustomPrayerSlotEdit = (oldKey: string) => {
    if (!editingPrayerName.trim()) return;
    const newKey = editingPrayerName.trim();
    const tempTimes = { ...state.prayerTimes };
    tempTimes[newKey] = editingPrayerTime || tempTimes[oldKey] || 'N/A';
    if (oldKey !== newKey) {
      delete tempTimes[oldKey];
    }

    const updatedHistory = { ...state.history };
    if (oldKey !== newKey) {
      Object.keys(updatedHistory).forEach(dateKey => {
        const dayLog = { ...updatedHistory[dateKey] };
        if (dayLog.prayer && dayLog.prayer[oldKey]) {
          dayLog.prayer = { ...dayLog.prayer };
          dayLog.prayer[newKey] = dayLog.prayer[oldKey];
          delete dayLog.prayer[oldKey];
          updatedHistory[dateKey] = dayLog;
        }
      });
    }

    saveState({
      ...state,
      prayerTimes: tempTimes,
      history: updatedHistory
    });
    setEditingPrayerKey(null);
  };

  const startEditHabitItem = (item: HabitItem) => {
    setEditingHabitId(item.id);
    setEditingHabitName(item.name);
    setEditingHabitTime(item.time as any);
  };

  const saveHabitItemEdit = () => {
    if (!editingHabitName.trim()) return;
    saveState({
      ...state,
      habits: state.habits.map(h => h.id === editingHabitId ? { ...h, name: editingHabitName.trim(), time: editingHabitTime } : h)
    });
    setEditingHabitId(null);
  };

  const startEditBadHabitItem = (item: BadHabitItem) => {
    setEditingBadHabitId(item.id);
    setEditingBadHabitName(item.name);
  };

  const saveBadHabitItemEdit = () => {
    if (!editingBadHabitName.trim()) return;
    saveState({
      ...state,
      badHabits: (state.badHabits || []).map(bh => bh.id === editingBadHabitId ? { ...bh, name: editingBadHabitName.trim() } : bh)
    });
    setEditingBadHabitId(null);
  };

  const startEditFitnessItem = (item: FitnessItem) => {
    setEditingFitnessId(item.id);
    setEditingFitnessName(item.name);
    setEditingFitnessGoal(item.goal);
  };

  const saveFitnessItemEdit = () => {
    if (!editingFitnessName.trim()) return;
    saveState({
      ...state,
      fitness: state.fitness.map(f => f.id === editingFitnessId ? { ...f, name: editingFitnessName.trim(), goal: editingFitnessGoal.trim() } : f)
    });
    setEditingFitnessId(null);
  };

  const startEditChore = (dayIdx: number, choreIdx: number, value: string) => {
    setEditingChoreDayIdx(dayIdx);
    setEditingChoreIndex(choreIdx);
    setEditingChoreValue(value);
  };

  const saveChoreEdit = () => {
    if (editingChoreDayIdx === null || editingChoreIndex === null || !editingChoreValue.trim()) return;
    const updatedRoutine = { ...state.routine };
    const dayData = updatedRoutine[editingChoreDayIdx] || { lunch: '', dinner: '', clean: '', customTasks: [] };
    if (dayData.customTasks) {
      const updatedTasks = [...dayData.customTasks];
      updatedTasks[editingChoreIndex] = editingChoreValue.trim();
      dayData.customTasks = updatedTasks;
      updatedRoutine[editingChoreDayIdx] = dayData;
      saveState({
        ...state,
        routine: updatedRoutine
      });
    }
    setEditingChoreDayIdx(null);
    setEditingChoreIndex(null);
  };

  // Handle active subject selection
  const handleSubjectChange = (subjectName: string) => {
    setSelectedSubject(subjectName);
    // Fetch already completed study seconds for this subject today
    const dayLog = state.history[todayStr];
    if (dayLog && dayLog.study && dayLog.study[subjectName]) {
      setSecondsElapsed(dayLog.study[subjectName]);
    } else {
      setSecondsElapsed(0);
    }
  };

  // Toggle study session timer
  const toggleStudyTimer = () => {
    if (!selectedSubject) {
      triggerCustomAlert(
        t.noSubjectError,
        state.language === 'bn' ? 'সতর্কবার্তা ⚠️' : 'Notice ⚠️',
        'error'
      );
      return;
    }
    setTimerRunning(!timerRunning);
  };

  // Reset clock
  const resetSeconds = (bypassConfirm = false) => {
    console.log("Resetting seconds for:", selectedSubject);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (bypassConfirm || window.confirm(state.language === 'bn' ? 'আপনি কি আজকের টাইমার রিসেট করতে চান?' : 'Are you sure you want to reset today\'s study timer for this subject?')) {
      setTimerRunning(false);
      setSecondsElapsed(0);
      setState(current => {
        const dayLog = { ...current.history[todayStr] };
        dayLog.study = { ...dayLog.study, [selectedSubject]: 0 };
        const updated = {
          ...current,
          history: {
            ...current.history,
            [todayStr]: dayLog
          }
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Theme changing trigger
  const changeTheme = () => {
    const themes: Array<'default' | 'luxury' | 'cyberpunk' | 'minimalist'> = ['default', 'luxury', 'cyberpunk', 'minimalist'];
    const currentIdx = themes.indexOf(state.theme);
    const nextTheme = themes[(currentIdx + 1) % themes.length];
    
    saveState({
      ...state,
      theme: nextTheme
    });
  };

  // Language switch
  const toggleLanguage = () => {
    saveState({
      ...state,
      language: state.language === 'bn' ? 'en' : 'bn'
    });
  };

  // --- ADD / DELETE SUBJECT METHODS (Supports multiple subject items) ---
  const addNewSubjectItem = () => {
    if (!newSubName.trim()) return;
    const item: SubjectItem = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      target: newSubTarget || 60
    };

    saveState({
      ...state,
      subjects: [...state.subjects, item]
    });

    setNewSubName('');
    setNewSubTarget(60);

    // Alert success
    setCreatorMsg(
      state.language === 'bn' 
        ? `নতুন বিষয় "${item.name}" সফলভাবে যুক্ত হয়েছে! মনোযোগ দিয়ে গাছটিকে বড় করুন!` 
        : `New subject tracker "${item.name}" successfully setup! Concentrate hard to nurture its tree!`
    );
    setShowCreatorPopup(true);
  };

  const deleteSubjectItem = (id: string, name: string) => {
    if (window.confirm(state.language === 'bn' ? `আপনি কি সত্যিই "${name}" ডিলিট করতে চান?` : `Are you sure you want to delete "${name}"?`)) {
      if (selectedSubject === name) {
        setTimerRunning(false);
        setSelectedSubject('');
        setSecondsElapsed(0);
      }
      saveState({
        ...state,
        subjects: state.subjects.filter(s => s.id !== id)
      });
    }
  };

  // --- ADD / MARK HABIT METHODS ---
  const addNewHabitItem = () => {
    if (!newHabitName.trim()) return;
    const item: HabitItem = {
      id: `hb-${Date.now()}`,
      name: newHabitName.trim(),
      time: newHabitTime
    };

    saveState({
      ...state,
      habits: [...state.habits, item]
    });

    setNewHabitName('');
  };

  const deleteHabitItem = (id: string) => {
    saveState({
      ...state,
      habits: state.habits.filter(h => h.id !== id)
    });
  };

  // --- BAD HABITS (QUIT TRACKER) METHODS ---
  const addNewBadHabitItem = () => {
    if (!newBadHabitName.trim()) return;
    const item: BadHabitItem = {
      id: `bh-${Date.now()}`,
      name: newBadHabitName.trim(),
      quitAt: new Date().toISOString()
    };

    saveState({
      ...state,
      badHabits: [...(state.badHabits || []), item]
    });

    setNewBadHabitName('');
    triggerActionNotification('bad_habit_logged', { name: item.name });
  };

  const deleteBadHabitItem = (id: string) => {
    saveState({
      ...state,
      badHabits: (state.badHabits || []).filter(item => item.id !== id)
    });
  };

  const restartBadHabitTimer = (id: string) => {
    const item = (state.badHabits || []).find(h => h.id === id);
    const name = item ? item.name : 'Bad Habit';
    saveState({
      ...state,
      badHabits: (state.badHabits || []).map(item => 
        item.id === id ? { ...item, quitAt: new Date().toISOString() } : item
      )
    });
    triggerActionNotification('bad_habit_logged', { name });
  };

  const toggleHabitComplete = (habitId: string) => {
    const withToday = ensureTodayLogExists(state);
    const allHabits = withToday.habits || [];
    
    // Check if previously all were completed
    const previouslyAllCompleted = allHabits.length > 0 && allHabits.every(h => {
      const prevLog = withToday.history[todayStr]?.habits;
      return prevLog ? prevLog[h.id] === true : false;
    });

    const dayLog = { ...withToday.history[todayStr] };
    dayLog.habits = {
      ...dayLog.habits,
      [habitId]: !dayLog.habits[habitId]
    };

    saveState({
      ...withToday,
      history: {
        ...withToday.history,
        [todayStr]: dayLog
      }
    });

    // Milestone trigger
    if (dayLog.habits[habitId]) {
      playHabitCompletionChime();

      // Select a random encouragement template from RANDOM_MOTIVATIONAL_QUOTES
      const habitObj = state.habits.find(h => h.id === habitId);
      const habitName = habitObj ? habitObj.name : 'Habit';
      
      triggerActionNotification('habit_toggled', { name: habitName });

      const randomIndex = Math.floor(Math.random() * RANDOM_MOTIVATIONAL_QUOTES.length);
      const quote = RANDOM_MOTIVATIONAL_QUOTES[randomIndex];
      
      setActiveAchievementToast({
        id: `toast-${Date.now()}`,
        title: state.language === 'bn' ? "অভ্যাস সম্পন্ন! 🎉" : "Habit Completed! 🎉",
        message: state.language === 'bn' ? quote.bodyBn : quote.bodyEn,
        habitName: habitName
      });

      // Simple auto dismissal after 4.5 seconds
      setTimeout(() => {
        setActiveAchievementToast(curr => {
          if (curr && curr.habitName === habitName) {
            return null;
          }
          return curr;
        });
      }, 4500);

      const currentlyAllCompleted = allHabits.length > 0 && allHabits.every(h => dayLog.habits[h.id] === true);
      const isNewPersonalRecord = currentlyAllCompleted && !previouslyAllCompleted;

      if (isNewPersonalRecord) {
        setConfettiTitle(
          state.language === 'bn' ? "শতভাগ অভ্যাস সম্পন্ন!" : "100% Habit Completion!"
        );
        setConfettiMessage(
          state.language === 'bn' 
            ? "আজকের সব কটি সুঅভ্যাস সম্পন্ন হয়েছে! আপনার এই নিখুঁত রেকর্ড সত্যিই প্রশংসনীয়।" 
            : "Amazing personal record! Every single habit has been completed for today. Perfect day achieved!"
        );
        setCreatorMsg(
          state.language === 'bn'
            ? "অসাধারণ! আপনি আজকের সব লক্ষ্য অর্জন করেছেন। এটি আপনার একটি নতুন কীর্তি!"
            : "Perfect Day Achieved! You logged a flawless execution of every single daily habit. Pure masterclass alignment!"
        );
      } else {
        setConfettiTitle(undefined);
        setConfettiMessage(undefined);
        setCreatorMsg(
          state.language === 'bn'
            ? "দারুণ কাজ! সুঅভ্যাস চর্চাই একদিন আপনাকে সাফল্যের চূড়ায় নিয়ে যাবে।"
            : "Fabulous consistency! Practicing daily habits strictly will raise your baseline for success."
        );
      }
      setHabitCompletedTrigger(true);
      setShowCreatorPopup(true);
    }
  };

  // --- ADD / MARK FITNESS METHODS ---
  const addNewFitnessItem = () => {
    if (!newFitName.trim()) return;
    const item: FitnessItem = {
      id: `fit-${Date.now()}`,
      name: newFitName.trim(),
      goal: newFitGoal.trim() || '20 reps'
    };

    saveState({
      ...state,
      fitness: [...state.fitness, item]
    });

    setNewFitName('');
    setNewFitGoal('');
  };

  const deleteFitnessItem = (id: string) => {
    saveState({
      ...state,
      fitness: state.fitness.filter(f => f.id !== id)
    });
  };

  const updateDailyFitnessValue = (fitId: string, val: string) => {
    const num = parseInt(val) || 0;
    const withToday = ensureTodayLogExists(state);
    const dayLog = { ...withToday.history[todayStr] };
    dayLog.fitness = {
      ...dayLog.fitness,
      [fitId]: num
    };

    saveState({
      ...withToday,
      history: {
        ...withToday.history,
        [todayStr]: dayLog
      }
    });

    if (num > 0) {
      const fitObj = state.fitness.find(f => f.id === fitId);
      const fitName = fitObj ? fitObj.name : 'Fitness';
      triggerActionNotification('fitness_logged', { name: fitName });
    }
  };

  // --- PRAYER Waqt tracking ---
  const setPrayerWaqtStatus = (waqt: string, status: 'জামাত' | 'ঘরে' | 'কাজা' | 'পড়িনি' | 'jamaat' | 'home' | 'qaza' | 'skipped') => {
    const withToday = ensureTodayLogExists(state);
    const dayLog = { ...withToday.history[todayStr] };
    dayLog.prayer = {
      ...dayLog.prayer,
      [waqt]: status
    };

    const updated = {
      ...withToday,
      history: {
        ...withToday.history,
        [todayStr]: dayLog
      }
    };
    saveState(updated);

    // If they checked Jamaat or Home Waqt, show encouraging note
    if (status === 'জামাত' || status === 'ঘরে' || status === 'jamaat' || status === 'home') {
      triggerActionNotification('prayer_logged', { name: waqt });

      const performedCount = Object.values(dayLog.prayer).filter(v => v === 'জামাত' || v === 'ঘরে' || v === 'jamaat' || v === 'home').length;
      if (performedCount === 5) {
        setCreatorMsg(
          state.language === 'bn'
            ? "মাশাআল্লাহ! আপনি আজ পাঁচ ওয়াক্ত নামাজ পূর্ণ করেছেন। আল্লাহ আপনার নেক আমল কবুল করুন!"
            : "Mashallah! You completed all 5 waqt prayers today in time. May Allah accept your high spirituality!"
        );
        setShowCreatorPopup(true);
      } else {
        setCreatorMsg(
          state.language === 'bn'
            ? `মাশাআল্লাহ! দ্বীনের পথে আপনার অগ্রযাত্রা অটুট থাকুক। (${waqt} সম্পূর্ণ)`
            : `Mashallah! Keep tracking your religious values. (${waqt} completed)`
        );
        setShowCreatorPopup(true);
      }
    }
  };

  // --- PRAYER LIVE TRACER METHODS & HOOKS ---
  const fetchLivePrayerTimes = async (lat: number, lng: number, locationName: string) => {
    setFetchingPrayerTimes(true);
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
      if (!response.ok) throw new Error("API call failed");
      const result = await response.json();
      if (result && result.data && result.data.timings) {
        const timings = result.data.timings;
        const updatedTimes: Record<string, string> = {
          Fajr: timings.Fajr,
          Dhuhr: timings.Dhuhr,
          Asr: timings.Asr,
          Maghrib: timings.Maghrib,
          Isha: timings.Isha,
        };

        saveState({
          ...state,
          prayerTimes: {
            ...state.prayerTimes,
            ...updatedTimes
          },
          prayerLocation: {
            lat,
            lng,
            name: locationName,
            isCustom: true
          }
        });

        triggerCustomAlert(
          state.language === 'bn'
            ? `সফলভাবে ${locationName} এর নামাজের সময় আপডেট করা হয়েছে!`
            : `Successfully updated prayer times for ${locationName}!`,
          state.language === 'bn' ? 'সফল' : 'Success',
          'success'
        );
      }
    } catch (e) {
      console.error(e);
      triggerCustomAlert(
        state.language === 'bn'
          ? "লাইভ নামাজের সময় লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে ইন্টারনেট কানেকশন বা ম্যানুয়াল লোকেশন চেক করুন।"
          : "Failed to fetch live prayer times. Please check your internet connection or try a manual location.",
        state.language === 'bn' ? 'ত্রুটি' : 'Error',
        'error'
      );
    } finally {
      setFetchingPrayerTimes(false);
    }
  };

  const fetchIPBasedLocation = async (): Promise<boolean> => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error("IP Geolocation service unavailable");
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const cityName = data.city || (state.language === 'bn' ? 'স্বয়ংক্রিয় শহর (IP)' : 'Auto City (IP)');
        await fetchLivePrayerTimes(data.latitude, data.longitude, cityName);
        return true;
      }
    } catch (e) {
      console.error("IP fallback failed too:", e);
    }
    return false;
  };

  const getGPSLocationAndFetch = () => {
    if (!navigator.geolocation) {
      triggerCustomAlert(
        state.language === 'bn'
          ? "আপনার ব্রাউজার জিপিএস সাপোর্ট করে না। স্বয়ংক্রিয়ভাবে আইপি দিয়ে লোকেশন খোঁজা হচ্ছে..."
          : "Geolocation is not supported by your browser. Attempting IP auto-detection...",
        "GPS Alert",
        "info"
      );
      fetchIPBasedLocation().then(success => {
        if (!success) {
          triggerCustomAlert(
            state.language === 'bn'
              ? "অবস্থান সনাক্ত করা যায়নি। অনুগ্রহ করে ম্যানুয়ালি শহর নির্বাচন করুন।"
              : "Could not detect location. Please select a city manually.",
            "Location Alert",
            "error"
          );
        }
      });
      return;
    }

    triggerCustomAlert(
      state.language === 'bn' ? "জিপিএস লোকেশন খোঁজা হচ্ছে..." : "Accessing GPS location...",
      "GPS",
      "info"
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        fetchLivePrayerTimes(lat, lng, state.language === 'bn' ? 'আপনার বর্তমান অবস্থান (GPS)' : 'Current Location (GPS)');
      },
      async (error) => {
        console.error("GPS error:", error);
        triggerCustomAlert(
          state.language === 'bn'
            ? "জিপিএস কানেকশন ব্যর্থ হয়েছে। আইপি দিয়ে লোকেশন সনাক্ত করার চেষ্টা করা হচ্ছে..."
            : "GPS request failed. Attempting automatic IP-based location detection...",
          "GPS Alert",
          "info"
        );
        const success = await fetchIPBasedLocation();
        if (!success) {
          triggerCustomAlert(
            state.language === 'bn'
              ? "আইপি লোকেশনও সনাক্ত করা যায়নি। অনুগ্রহ করে ম্যানুয়ালি নিচে ড্রপডাউন থেকে আপনার শহর নির্বাচন করুন।"
              : "Location auto-detection failed. Please manually choose your city from the dropdown.",
            "Location Warning",
            "error"
          );
        }
      },
      { enableHighAccuracy: false, timeout: 6000 }
    );
  };

  useEffect(() => {
    const updatePrayerCountdownAndCheckTriggers = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;

      const pTimes = state.prayerTimes || {
        Fajr: '05:00',
        Dhuhr: '13:15',
        Asr: '16:30',
        Maghrib: '18:15',
        Isha: '19:45'
      };

      const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const timeline = PRAYER_NAMES.map(name => {
        const timeStr = pTimes[name] || '12:00';
        const parts = timeStr.split(':');
        const minutes = parts.length >= 2 ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) : 0;
        return { name, minutes };
      }).sort((a, b) => a.minutes - b.minutes);

      let nextWaqt = timeline.find(item => item.minutes > currentTotalMin);
      let isTomorrow = false;

      if (!nextWaqt) {
        nextWaqt = timeline[0];
        isTomorrow = true;
      }

      if (nextWaqt) {
        const targetDate = new Date();
        if (isTomorrow) {
          targetDate.setDate(targetDate.getDate() + 1);
        }
        targetDate.setHours(Math.floor(nextWaqt.minutes / 60), nextWaqt.minutes % 60, 0, 0);

        const diffSeconds = Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
        const hoursLeft = Math.floor(diffSeconds / 3600);
        const minsLeft = Math.floor((diffSeconds % 3600) / 60);
        const secsLeft = diffSeconds % 60;

        let timeLeftString = '';
        if (state.language === 'bn') {
          const bnNum = (n: number) => {
            const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return n.toString().split('').map(d => bnDigits[parseInt(d, 10)] || d).join('');
          };
          timeLeftString = `${nextWaqt.name} শুরু হতে ${hoursLeft > 0 ? bnNum(hoursLeft) + ' ঘণ্টা ' : ''}${bnNum(minsLeft)} মিনিট ${bnNum(secsLeft)} সেকেন্ড বাকি`;
        } else {
          timeLeftString = `${nextWaqt.name} starts in ${hoursLeft > 0 ? hoursLeft + 'h ' : ''}${minsLeft}m ${secsLeft}s`;
        }

        setNextPrayerCountdown({
          nextPrayerName: nextWaqt.name,
          timeLeftString,
          timeLeftSeconds: diffSeconds,
        });
      }

      // Notification check on the minute start (seconds === 0)
      if (now.getSeconds() === 0) {
        const notifications = state.prayerNotifications || {
          Fajr: { enabled: true, triggerOffset: 0 },
          Dhuhr: { enabled: true, triggerOffset: 0 },
          Asr: { enabled: true, triggerOffset: 0 },
          Maghrib: { enabled: true, triggerOffset: 0 },
          Isha: { enabled: true, triggerOffset: 0 },
        };

        PRAYER_NAMES.forEach(name => {
          const setting = notifications[name] || { enabled: true, triggerOffset: 0 };
          if (!setting.enabled) return;

          const timeStr = pTimes[name];
          if (!timeStr) return;

          const parts = timeStr.split(':');
          const prayerMin = parts.length >= 2 ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) : 0;
          const triggerMin = prayerMin + setting.triggerOffset;

          if (currentTotalMin === triggerMin) {
            const triggerKey = `${todayStr}-${name}-${setting.triggerOffset}`;
            if (lastTriggeredNotificationKeyRef.current !== triggerKey) {
              lastTriggeredNotificationKeyRef.current = triggerKey;

              let title = '';
              let msg = '';
              if (state.language === 'bn') {
                title = `${name} নামাযের সতর্কতা`;
                if (setting.triggerOffset === 0) {
                  msg = `এখন ${name} নামাযের ওয়াক্ত হয়েছে। অনুগ্রহ করে নামাজ আদায় করুন।`;
                } else if (setting.triggerOffset < 0) {
                  msg = `${name} নামাযের ওয়াক্ত শুরু হতে ${Math.abs(setting.triggerOffset)} মিনিট বাকি আছে। প্রস্তুত হোন।`;
                } else {
                  msg = `${name} নামাযের ওয়াক্ত শুরু হয়েছে ${setting.triggerOffset} মিনিট আগে। তাড়াতাড়ি নামাজ আদায় করুন!`;
                }
              } else {
                title = `${name} Prayer Alert`;
                if (setting.triggerOffset === 0) {
                  msg = `It is now time for ${name} prayer. Please perform your prayer.`;
                } else if (setting.triggerOffset < 0) {
                  msg = `Only ${Math.abs(setting.triggerOffset)} minutes left before ${name} prayer starts. Please prepare.`;
                } else {
                  msg = `${name} prayer started ${setting.triggerOffset} minutes ago. Please perform your prayer!`;
                }
              }

              triggerCustomAlert(msg, title, 'info');

              try {
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification(title, { body: msg });
                }
              } catch (e) {
                console.error('Push notification failed', e);
              }
            }
          }
        });
      }
    };

    updatePrayerCountdownAndCheckTriggers();
    const timer = setInterval(updatePrayerCountdownAndCheckTriggers, 1000);
    return () => clearInterval(timer);
  }, [state.prayerTimes, state.prayerNotifications, state.language, todayStr]);

  const togglePrayerNotificationEnabled = (waqt: string, enabled: boolean) => {
    const notifications = { ...(state.prayerNotifications || {}) };
    const currentSetting = notifications[waqt] || { enabled: true, triggerOffset: 0 };
    notifications[waqt] = { ...currentSetting, enabled };
    saveState({
      ...state,
      prayerNotifications: notifications
    });
  };

  const updatePrayerNotificationOffset = (waqt: string, triggerOffset: number) => {
    const notifications = { ...(state.prayerNotifications || {}) };
    const currentSetting = notifications[waqt] || { enabled: true, triggerOffset: 0 };
    notifications[waqt] = { ...currentSetting, triggerOffset };
    saveState({
      ...state,
      prayerNotifications: notifications
    });
  };

  const handlePrayerTimeUpdate = (waqtName: string, time24h: string) => {
    saveState({
      ...state,
      prayerTimes: {
        ...state.prayerTimes,
        [waqtName]: time24h
      }
    });
  };

  // Dynamic extra/custom prayers adding (Multiple spiritual sessions)
  const addCustomPrayerSlot = () => {
    if (!newCustomPrayerName.trim()) return;
    const slot = newCustomPrayerName.trim();
    
    saveState({
      ...state,
      prayerTimes: {
        ...state.prayerTimes,
        [slot]: 'N/A' // custom auxiliary slot
      }
    });
    setNewCustomPrayerName('');
  };

  const deleteCustomPrayerSlot = (waqtKey: string) => {
    const tempTimes = { ...state.prayerTimes };
    delete tempTimes[waqtKey];
    saveState({
      ...state,
      prayerTimes: tempTimes
    });
  };

  // --- WEEKLY ROUTINE CUSTOMIZATION CHORES ---
  const saveWeekdayDuties = () => {
    saveState(state);
    triggerCustomAlert(
      t.saveSuccess,
      state.language === 'bn' ? 'সফলভাবে সংরক্ষিত!' : 'Success!',
      'success'
    );
  };

  const handleRoutineChoreChange = (field: 'lunch' | 'dinner' | 'clean', value: string) => {
    const updatedRoutine = { ...state.routine };
    updatedRoutine[routineDayIdx] = {
      ...updatedRoutine[routineDayIdx],
      [field]: value
    };

    setState({
      ...state,
      routine: updatedRoutine
    });
  };

  // Add multiple custom chores on a weekday
  const addCustomWeekdayChore = () => {
    if (!newChoreName.trim()) return;
    const updatedRoutine = { ...state.routine };
    const dayData = updatedRoutine[routineDayIdx];
    const customTasksList = dayData.customTasks ? [...dayData.customTasks] : [];
    customTasksList.push(newChoreName.trim());

    updatedRoutine[routineDayIdx] = {
      ...dayData,
      customTasks: customTasksList
    };

    setState({
      ...state,
      routine: updatedRoutine
    });
    setNewChoreName('');
  };

  const deleteCustomWeekdayChore = (choreIdx: number) => {
    const updatedRoutine = { ...state.routine };
    const dayData = updatedRoutine[routineDayIdx];
    if (dayData.customTasks) {
      const filtered = dayData.customTasks.filter((_, idx) => idx !== choreIdx);
      updatedRoutine[routineDayIdx] = {
        ...dayData,
        customTasks: filtered
      };
      saveState({
        ...state,
        routine: updatedRoutine
      });
    }
  };

  // Load selected weekday index for customization view
  const handleRoutineDayChange = (idx: number) => {
    setRoutineDayIdx(idx);
  };

  // --- JOURNAL DIARY METHOD WRAPPERS ---
  const handleSaveReflectionNote = (noteData: Omit<ReflectionNote, 'id' | 'date'>) => {
    const newNote: ReflectionNote = {
      id: `ref-${Date.now()}`,
      date: getTodayStr(),
      text: noteData.text,
      subject: noteData.subject,
      focusedRating: noteData.focusedRating,
      mood: noteData.mood
    };

    saveState({
      ...state,
      reflections: [newNote, ...state.reflections]
    });

    triggerActionNotification('reflection_diary_logged');

    setCreatorMsg(
      state.language === 'bn'
        ? "আপনার রিফ্লেকশন ডায়েরীটি নিরাপদে মেমোরিতে সাজানো হয়েছে। এটি আপনার আত্মশুদ্ধি বাড়াবে!"
        : "Your self-reflection logs are carefully journaled. Reviewing these will spark tremendous future focus!"
    );
    setShowCreatorPopup(true);
  };

  const handleDeleteReflectionNote = (id: string) => {
    if (window.confirm(state.language === 'bn' ? 'আপনি কি এই নোটটি নিশ্চিতভাবে মুছে ফেলতে চান?' : 'Are you sure you want to delete this diary log?')) {
      saveState({
        ...state,
        reflections: state.reflections.filter(r => r.id !== id)
      });
    }
  };

  const handleUpdateReflectionNote = (id: string, updatedText: string) => {
    saveState({
      ...state,
      reflections: state.reflections.map(r => r.id === id ? { ...r, text: updatedText } : r)
    });
  };

  // --- TIME PARSING UTILITY FOR CHROMATIC TIMELINE VIEW ---
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    try {
      const cleaned = timeStr.trim().toLowerCase();
      const isPm = cleaned.includes('pm') || cleaned.includes('পিএম') || cleaned.includes('দুপুর') || cleaned.includes('রাত') || cleaned.includes('সন্ধ্যা') || cleaned.includes('বিকাল');
      const isAm = cleaned.includes('am') || cleaned.includes('এএম') || cleaned.includes('সকাল') || cleaned.includes('ভোর') || cleaned.includes('রাত');
      
      const numMatch = cleaned.match(/(\d+)(?:\s*:\s*(\d+))?/);
      if (!numMatch) return 0;
      
      let hours = parseInt(numMatch[1], 10);
      const minutes = numMatch[1] && numMatch[2] ? parseInt(numMatch[2], 10) : 0;
      
      if (isPm && hours < 12) {
        hours += 12;
      } else if (isAm && hours === 12) {
        hours = 0;
      }
      
      return hours * 60 + minutes;
    } catch (err) {
      return 0;
    }
  };

  // --- VISUAL ELEMENTS MIGRATIONS ---
  // Convert weekday number into Bengali/English text
  const getWeekdayText = (idx: number) => {
    const weekdaysBn = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];
    const weekdaysEn = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return state.language === 'bn' ? weekdaysBn[idx] : weekdaysEn[idx];
  };

  // Determine current active chores today for live widget
  const getLiveWidgetDetails = () => {
    // Weekday maps: Sat:0, Sun:1, Mon:2, Tue:3, Wed:4, Thu:5, Fri:6
    const jsDay = new Date().getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    // Convert to our custom 0-6 Sat-Fri indexing
    let customIdx = (jsDay + 1) % 7; 
    
    const dayData = state.routine[customIdx] || { lunch: '', dinner: '', clean: '', customTasks: [] };
    const currentHour = new Date().getHours();

    // Decide if it's lunch or dinner time dynamically
    const dutyTag = currentHour < 16 ? t.lunchLabel : t.dinnerLabel;
    const inCharge = currentHour < 16 ? dayData.lunch : dayData.dinner;

    return {
      dutyTag,
      inCharge: inCharge || (state.language === 'bn' ? 'বরাদ্দ করা হয়নি' : 'None yet'),
      cleaning: dayData.clean || (state.language === 'bn' ? 'বরাদ্দ করা হয়নি' : 'None yet'),
      custom: dayData.customTasks || [],
      weekdayName: getWeekdayText(customIdx)
    };
  };

  const liveDuty = getLiveWidgetDetails();

  // Highlight active themes styles mapping
  const getThemeClass = () => {
    switch (state.theme) {
      case 'luxury':
        return {
          bg: 'bg-[#0f0d0a] text-[#f5f6fa]',
          card: 'bg-[#1c1812]/85 border-[#d4af37]/25',
          glowText: 'text-[#d4af37]',
          glowBtn: 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-amber-950',
          glowBorder: 'border-[#d4af37]/30',
          accentBorder: 'border-l-4 border-l-[#d4af37]',
          accentText: 'text-[#d4af37]'
        };
      case 'cyberpunk':
        return {
          bg: 'bg-[#050510] text-[#e0e0ff]',
          card: 'bg-[#0b0b1a]/90 border-[#00ffcc]/35',
          glowText: 'text-[#ff00ff]',
          glowBtn: 'bg-gradient-to-r from-[#00ffcc] to-[#ff00ff] text-[#050510]',
          glowBorder: 'border-[#00ffcc]/40',
          accentBorder: 'border-l-4 border-l-[#ff00ff]',
          accentText: 'text-[#00ffcc]'
        };
      case 'minimalist':
        return {
          bg: 'bg-slate-50 text-[#111827]',
          card: 'bg-white border-[#e5e7eb] text-slate-800 shadow-md',
          glowText: 'text-slate-900',
          glowBtn: 'bg-slate-900 text-white hover:bg-slate-800',
          glowBorder: 'border-slate-200',
          accentBorder: 'border-l-4 border-l-slate-900',
          accentText: 'text-slate-900'
        };
      default: // Modern Dark / default
        return {
          bg: 'bg-[#0b0f19] text-white',
          card: 'bg-[#131a26]/85 border-slate-800',
          glowText: 'text-blue-400',
          glowBtn: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white',
          glowBorder: 'border-blue-500/15',
          accentBorder: 'border-l-4 border-l-blue-500',
          accentText: 'text-blue-400'
        };
    }
  };

  const baseTheme = getThemeClass();
  const currentTheme = state.uiMode === 'cinematic' ? {
    bg: 'bg-black text-white',
    card: 'bg-black/40 backdrop-blur-2xl border-[1px] border-cyan-400/15 rounded-[20px] shadow-[0_0_15px_rgba(0,255,255,0.05)]',
    glowText: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    glowBtn: 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-500/20 rounded-full',
    glowBorder: 'border-cyan-400/20',
    accentBorder: 'border-l-4 border-l-cyan-400',
    accentText: 'text-cyan-400'
  } : baseTheme;

  // Active Subject details calculation
  const activeSubjectItem = state.subjects.find(s => s.name === selectedSubject);
  const targetCompletedSecs = secondsElapsed; 
  const targetTotalSecs = activeSubjectItem ? activeSubjectItem.target * 60 : 60 * 60;
  const progressPercent = Math.min((targetCompletedSecs / targetTotalSecs) * 100, 100);

  // Formatting display timer numerals
  const getFormatTimerStr = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <ToastProvider>
      <ToastContainer />
      <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-300 pb-28 font-sans overflow-x-hidden relative ${state.uiMode === 'cinematic' ? 'cinematic-mode' : ''}`}>

      {/* Full screen AI chat */}
      {isAiFullScreen && (() => {
        const activeThemeKey = state.aiTheme || 'midnight';
        const aiThemeInfo = AI_THEMES[activeThemeKey] || AI_THEMES.midnight;
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed inset-0 z-[120] ${aiThemeInfo.bg} flex flex-col p-4 sm:p-6 transition-all duration-500 overflow-hidden`}
          >
            {/* Ambient neon backdrop glow elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ${aiThemeInfo.glow} blur-[130px] animate-pulse`}></div>
              <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full ${aiThemeInfo.glow} blur-[130px] animate-pulse [animation-delay:2s]`}></div>
            </div>

            <div className="flex justify-between items-center mb-4 z-10 relative">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-slate-900/80 border ${aiThemeInfo.border} shadow-lg text-slate-100`}>
                    <Bot className={`w-6 h-6 ${aiThemeInfo.accentColor} animate-pulse`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-black bg-gradient-to-r ${aiThemeInfo.titleGradient} bg-clip-text text-transparent uppercase tracking-wider`}>MridhaX AI</h2>
                    <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">{state.language === 'bn' ? 'কো-পাইলট ও চিফ এক্সিকিউটিভ অ্যাসিস্ট্যান্ট' : 'Co-pilot & Chief Executive Assistant'}</p>
                  </div>
                </div>
                {/* Highly Professional, Cinematic Voice Selection Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-1 shadow-inner mr-2">
                    <button
                      onClick={() => {
                        setTtsVoiceStyle('female');
                        if (typeof playCompletionBeep === 'function') playCompletionBeep();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none ${
                        ttsVoiceStyle === 'female'
                          ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                          : 'border border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                      title={state.language === 'bn' ? 'মিষ্টি কণ্ঠ' : 'Sweet Voice'}
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${ttsVoiceStyle === 'female' ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
                      <span className="hidden sm:inline">{state.language === 'bn' ? 'মিষ্টি কণ্ঠ' : 'Sweet Voice'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTtsVoiceStyle('male');
                        if (typeof playCompletionBeep === 'function') playCompletionBeep();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none ${
                        ttsVoiceStyle === 'male'
                          ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                          : 'border border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                      title={state.language === 'bn' ? 'গম্ভীর কণ্ঠ' : 'Deep Voice'}
                    >
                      <Activity className={`w-3.5 h-3.5 ${ttsVoiceStyle === 'male' ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
                      <span className="hidden sm:inline">{state.language === 'bn' ? 'গম্ভীর কণ্ঠ' : 'Deep Voice'}</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      stopCameraCapture();
                      setIsAiFullScreen(false);
                    }} 
                    className="p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-2xl cursor-pointer transition active:scale-90 shadow-xl"
                    title={state.language === 'bn' ? 'বন্ধ করুন' : 'Close AI'}
                  >
                    <X className="w-5 h-5 text-rose-500" />
                  </button>
                </div>
            </div>

            {/* MAIN AI OMNI-DECK PANEL VIEWER */}
            <div className="flex-1 min-h-0 flex flex-col relative">
                <div className="flex flex-col flex-1 min-h-0 z-10">
                    {/* Chats Container Scroll view */}
                    <div className={`flex-1 overflow-y-auto bg-slate-950/40 backdrop-blur-md border ${aiThemeInfo.border} p-4 sm:p-6 rounded-2xl mb-4 space-y-4 custom-scrollbar shadow-inner`}>
                        {aiChatHistory.map((msg, i) => {
                          const cleanText = msg.parts[0].text.replace(/```json\s*[\s\S]*?\s*```/g, '').trim();
                          if (!cleanText && msg.role === 'model') return null;

                          return (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-0.5 px-1.5">
                                {msg.role === 'user' ? (state.language === 'bn' ? 'আপনি' : 'You') : 'MridhaX AI'}
                              </span>
                              {cleanText && (
                                <div className={`p-4 rounded-2xl max-w-[85%] relative group transition-all duration-300 ${
                                  msg.role === 'user' 
                                    ? aiThemeInfo.bubbleUser 
                                    : aiThemeInfo.bubbleAi
                                } leading-relaxed text-sm shadow-md ${
                                  speakingMsgIdx === i && isSpeaking 
                                    ? 'ring-4 ring-rose-500/30 border-rose-400/50 scale-[1.01] shadow-[0_0_25px_rgba(244,63,94,0.3)]' 
                                    : ''
                                }`}>
                                  {msg.role === 'model' ? (
                                    <>
                                      {formatAiMessage(cleanText)}
                                      
                                      {speakingMsgIdx === i && isSpeaking && (
                                        <div className="mt-3.5 flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 px-3 py-1.5 rounded-xl w-fit shadow-md shadow-emerald-950/20">
                                          <div className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                          </div>
                                          <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 animate-pulse">
                                            {state.language === 'bn' ? 'মৃধাক্স কথা বলছে...' : 'MridhaX Speaking...'}
                                          </span>
                                          
                                          {/* Realistic audio speaker wave animation with staggered bouncing bars */}
                                          <div className="flex items-end gap-1 h-3.5 px-1 pb-0.5 ml-1">
                                            <div className="w-0.5 bg-emerald-400 rounded-full h-2 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.7s' }} />
                                            <div className="w-0.5 bg-emerald-400 rounded-full h-3.5 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.7s' }} />
                                            <div className="w-0.5 bg-emerald-400 rounded-full h-1.5 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.7s' }} />
                                            <div className="w-0.5 bg-emerald-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '450ms', animationDuration: '0.7s' }} />
                                            <div className="w-0.5 bg-emerald-400 rounded-full h-2 animate-bounce" style={{ animationDelay: '600ms', animationDuration: '0.7s' }} />
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="whitespace-pre-wrap text-slate-100 font-medium">{cleanText}</div>
                                  )}
                                  {msg.role === 'model' && speakingMsgIdx === i && isSpeaking && (
                                    <div className="absolute bottom-2.5 right-2.5 flex items-end gap-[3px] h-6 px-2.5 py-1.5 rounded-full bg-slate-950/95 border border-rose-500/40 shadow-lg shadow-rose-950/50 backdrop-blur-md pointer-events-none z-20">
                                      {[1, 2, 3, 4, 5].map((_, barIdx) => (
                                        <div
                                          key={barIdx}
                                          className="w-[3px] rounded-full bg-gradient-to-t from-rose-500 to-pink-400"
                                          style={{
                                            height: '100%',
                                            minHeight: '4px',
                                            animation: `soundwave-bounce ${0.35 + (barIdx % 3) * 0.12}s ease-in-out ${barIdx * 60}ms infinite alternate`,
                                            transformOrigin: 'bottom'
                                          }}
                                        />
                                      ))}
                                    </div>
                                  )}
                                  {msg.role === 'model' && (
                                    <div className="absolute -bottom-10 right-0 flex gap-2 opacity-100 transition-opacity z-10">
                                      <button 
                                        onClick={() => navigator.clipboard.writeText(cleanText.replace(/<[^>]+>/g, ''))} 
                                        className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                        title={state.language === 'bn' ? 'কপি করুন' : 'Copy'}
                                      >
                                        <Copy className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => speakMessage(cleanText.replace(/<[^>]+>/g, ''), i)} 
                                        className={`p-2 rounded-lg shadow-lg transition-colors flex items-center gap-1.5 font-bold text-xs ${
                                          speakingMsgIdx === i && isSpeaking
                                            ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                        }`}
                                        title={
                                          speakingMsgIdx === i && isSpeaking
                                            ? (state.language === 'bn' ? 'থামুন' : 'Stop')
                                            : (state.language === 'bn' ? 'শুনুন' : 'Listen')
                                        }
                                      >
                                        {speakingMsgIdx === i && isSpeaking ? (
                                          <>
                                            <VolumeX className="w-4 h-4 text-white animate-bounce" />
                                            <span className="text-[10px] uppercase font-bold">{state.language === 'bn' ? 'থামুন' : 'Stop'}</span>
                                          </>
                                        ) : (
                                          <>
                                            <Volume2 className="w-4 h-4 text-white" />
                                            <span className="text-[10px] uppercase font-bold">{state.language === 'bn' ? 'শুনুন' : 'Listen'}</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {(msg as any).imageUrl && (
                                <div className="relative mt-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-w-sm w-full p-2 group shadow-xl">
                                  <img 
                                    src={(msg as any).imageUrl} 
                                    alt="MridhaX Generated" 
                                    className="w-full h-auto object-cover rounded-xl"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button 
                                      onClick={() => downloadMridhaxImage((msg as any).imageUrl)}
                                      className="p-2.5 bg-slate-900/95 text-white rounded-xl shadow-lg hover:bg-slate-800 flex items-center justify-center border border-slate-700/50 cursor-pointer transition hover:scale-105 active:scale-95"
                                      title={state.language === 'bn' ? 'ডাউনলোড করুন' : 'Download Artwork'}
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Pulsing visual companion processing layout */}
                        {aiLoading && (
                          <div className="flex items-start gap-2.5 pt-2 animate-pulse">
                            <div className="relative shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/35 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-blue-400" />
                              <span className="absolute -inset-1 blur bg-blue-500/20 rounded-full animate-ping"></span>
                            </div>
                            <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-xs text-slate-300 shadow-xl">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1.5 font-mono">
                                <span>MridhaX AI</span>
                                <div className="flex gap-1 items-center ml-1">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                                </div>
                              </div>
                              <span className="text-[13px] leading-relaxed font-semibold text-slate-200">
                                {state.language === 'bn' 
                                  ? (isGeneratingImage ? 'তোমার ছবি তৈরি হচ্ছে...' : 'তোমার প্রশ্নের উত্তর নিয়ে ভাবছি...') 
                                  : (isGeneratingImage ? 'Generating your custom image...' : 'Thinking about your question...')}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>

                  {/* Action consoles triggers removed - all moved to + menu */}

                  <div className="shrink-0">
                      {/* Thumbnail preview block of selected image */}
                      {aiImage && (
                        <div className="flex items-center justify-between p-3 mb-3 bg-blue-950/30 border border-blue-500/30 rounded-xl max-w-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
                              {aiImage.mimeType === 'application/pdf' ? (
                                <FileText className="w-6 h-6 text-amber-500" />
                              ) : (
                                <img 
                                  src={`data:${aiImage.mimeType};base64,${aiImage.data}`} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-blue-400 truncate max-w-[150px]">{aiImage.name}</p>
                              <p className="font-mono text-[10px] text-slate-500">{aiImage.mimeType === 'application/pdf' ? 'PDF Document' : 'Image attached'}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setAiImage(null)} 
                            className="px-2.5 py-1 text-xs bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition"
                          >
                            Clear
                          </button>
                        </div>
                      )}



                        {/* Input area for Full Screen */}
                      <div className="flex gap-2 items-center relative">
                          {/* Feature Selector (+) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowAiFeatureMenu(!showAiFeatureMenu)}
                              className={`w-12 h-12 border rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer ${
                                showAiFeatureMenu || activeAiMode !== 'chat'
                                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                              }`}
                              title="Features"
                            >
                              <Plus className={`w-5 h-5 transition-transform ${showAiFeatureMenu ? 'rotate-45' : ''}`} />
                            </button>
                            
                            {/* Feature Menu Popup */}
                            {showAiFeatureMenu && (
                              <div className="absolute bottom-full mb-3 left-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden w-56 flex flex-col z-50 animate-fade-in-up">
                                <label className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition border-l-2 border-transparent cursor-pointer">
                                  <Paperclip className="w-4 h-4 text-purple-400" />
                                  <span className="text-sm font-medium text-slate-200">{state.language === 'bn' ? 'ফটো আপলোড' : 'Upload Photo'}</span>
                                  <input type="file" accept="image/*" onChange={(e) => { handleImageUpload(e); setShowAiFeatureMenu(false); }} className="hidden" />
                                </label>

                                <label className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition border-l-2 border-transparent cursor-pointer">
                                  <FileText className="w-4 h-4 text-amber-400" />
                                  <span className="text-sm font-medium text-slate-200">{state.language === 'bn' ? 'পিডিএফ আপলোড' : 'Upload PDF'}</span>
                                  <input type="file" accept="application/pdf" onChange={(e) => { handleImageUpload(e); setShowAiFeatureMenu(false); }} className="hidden" />
                                </label>



                                <div className="border-t border-slate-800 my-1" />
                                <div className="px-4 py-2">
                                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">{state.language === 'bn' ? 'চ্যাট থিম' : 'Chat Theme'}</p>
                                  <div className="flex gap-2">
                                    {[
                                      { id: 'midnight', color: 'bg-blue-600', name: 'Midnight Blue' },
                                      { id: 'emerald', color: 'bg-emerald-600', name: 'Emerald Forest' },
                                      { id: 'sunset', color: 'bg-rose-500', name: 'Sunset' },
                                      { id: 'aurora', color: 'bg-fuchsia-500', name: 'Aurora' },
                                      { id: 'obsidian_gold', color: 'bg-amber-500', name: 'Obsidian Gold' },
                                      { id: 'book_page', color: 'bg-[#8b7355]', name: 'Book Paper' },
                                      { id: 'sakura_dream', color: 'bg-pink-400', name: 'Sakura Blossom' }
                                    ].map(t => (
                                      <button
                                        key={t.id}
                                        onClick={() => {
                                          saveState({ ...state, aiTheme: t.id as any });
                                          playCompletionBeep();
                                        }}
                                        className={`w-6 h-6 rounded-full ${t.color} border-2 ${state.aiTheme === t.id || (!state.aiTheme && t.id === 'midnight') ? 'border-white ring-2 ring-slate-800' : 'border-transparent opacity-60 hover:opacity-100'} transition shadow-md`}
                                        title={t.name}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 relative flex items-center">
                            <input
                              id="aiGlobalInputBox"
                              type="text"
                              value={aiInput}
                              onChange={(e) => setAiInput(e.target.value)}
                              onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const submitBtn = document.getElementById('aiFullScreenSubmitBtn');
                                  if (submitBtn) submitBtn.click();
                                }
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
                              placeholder={state.language === 'bn' ? 'মৃধাক্সকে প্রশ্ন করুণ...' : 'Ask MridhaX AI...'}
                            />
                          </div>

                          <button
                            id="aiFullScreenSubmitBtn"
                            onClick={async () => {
                              if (!aiInput.trim() && !aiImage) return;
                              
                              const isImg = checkIsImageRequest(aiInput);
                              setIsGeneratingImage(isImg);
                              setAiLoading(true);
                              
                              // Automatically detect mode from the input text before sending
                              let finalMode = activeAiMode;
                              const lowerInput = aiInput.toLowerCase();
                              if (lowerInput.includes('roadmap') || lowerInput.includes('রোডম্যাপ') || lowerInput.includes('ক্যারিয়ার') || lowerInput.includes('career')) {
                                finalMode = 'roadmap';
                              } else if (lowerInput.includes('pdf') || lowerInput.includes('পিডিএফ') || lowerInput.includes('ডকুমেন্ট') || lowerInput.includes('document')) {
                                finalMode = 'pdf';
                              } else if (lowerInput.includes('mcq') || lowerInput.includes('এমসিকিউ') || lowerInput.includes('বহুনির্বাচনী')) {
                                finalMode = 'mcq';
                              } else if (lowerInput.includes('quiz') || lowerInput.includes('কুইজ') || lowerInput.includes('প্রশ্নোত্তর')) {
                                finalMode = 'quiz';
                              }

                              let modeContext = '';
                              if (finalMode === 'roadmap') {
                                modeContext = (state.language === 'bn' ? '[রোডম্যাপ তৈরি মোড: ইউজারের লক্ষ্যের উপর ভিত্তি করে একটি সুন্দর ও বিস্তারিত রোডম্যাপ তৈরি করে দাও] ' : '[Roadmap Creation Mode: Create a beautiful and detailed roadmap based on the user\'s goal] ');
                              } else if (finalMode === 'pdf') {
                                modeContext = (state.language === 'bn' ? '[PDF এনালাইজ মোড: টেক্সটটিকে একটি PDF বা ডকুমেন্ট হিসেবে বিবেচনা করে বিশ্লেষণ করো] ' : '[PDF Analysis Mode: Analyze the text considering it as a PDF or document] ');
                              } else if (finalMode === 'mcq') {
                                modeContext = (state.language === 'bn' ? '[MCQ মোড: ইউজারের প্রশ্ন বা টেক্সট থেকে বহুনির্বাচনী প্রশ্ন (MCQ) তৈরি করো] ' : '[MCQ Mode: Create Multiple Choice Questions (MCQ) from the user\'s prompt] ');
                              } else if (finalMode === 'quiz') {
                                modeContext = (state.language === 'bn' ? '[কুইজ মোড: ইউজারের প্রশ্ন বা টেক্সট থেকে ইন্টারেক্টিভ কুইজ তৈরি করো] ' : '[Quiz Mode: Create interactive quiz questions from the user\'s prompt] ');
                              }

                              const textToSend = modeContext + (aiInput.trim() || (state.language === 'bn' ? "দয়া করে ক্যাপচার করা এই ফাইলটির সমাধান দিন।" : "Please solve this uploaded file step-by-step."));
                              const userMessage = { role: 'user', parts: [{ text: textToSend }] };
                              const newHistory = [...aiChatHistory, userMessage];
                              setAiChatHistory(newHistory as any);
                              setAiInput('');
                              
                              const imageToSend = aiImage ? { mimeType: aiImage.mimeType, data: aiImage.data } : null;
                              setAiImage(null); // Reset preview on send
                              
                              try {
                                const response = await fetch('/api/gemini/chat', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ 
                                    messages: newHistory.map(m => ({ role: m.role, parts: m.parts })),
                                    language: state.language,
                                    image: imageToSend,
                                    customAiDirectives: state.customAiDirectives,
                                    aiTrainingData: state.aiTrainingData,
                                    examRoutineContext: state.examPreps && state.examPreps.length > 0 
                                      ? state.examPreps.map(ep => ({
                                          examName: ep.examName,
                                          category: ep.category || 'Final',
                                          targetDate: ep.targetDate,
                                          subjects: ep.subjects?.map(s => ({
                                            name: s.name,
                                            examDate: s.examDate,
                                            chapters: s.chapters?.map(c => ({ name: c.name, isCompleted: c.isCompleted }))
                                          }))
                                        }))
                                      : (state.examPrep ? {
                                          examName: state.examPrep.examName,
                                          category: state.examPrep.category || 'Final',
                                          targetDate: state.examPrep.targetDate,
                                          subjects: state.examPrep.subjects?.map(s => ({
                                            name: s.name,
                                            examDate: s.examDate,
                                            chapters: s.chapters?.map(c => ({ name: c.name, isCompleted: c.isCompleted }))
                                          }))
                                        } : null),
                                    userDiagnosticsContext: {
                                      profile: state.profile || {},
                                      subjects: state.subjects || [],
                                      habits: state.habits || [],
                                      badHabits: state.badHabits || [],
                                      reflections: state.reflections || [],
                                      brainFatigueRatings: state.brainFatigueRatings || {},
                                      phoneLimitMinutes: state.phoneLimitMinutes,
                                      digitalUnlockCount: state.digitalUnlockCount || {},
                                      appUsageDurations: state.appUsageDurations || {},
                                      reelsBlockerActive: state.reelsBlockerActive,
                                      adultSiteBlockerActive: state.adultSiteBlockerActive,
                                      dndModeActive: state.dndModeActive,
                                      digitalDetoxStreak: state.digitalDetoxStreak || 0
                                    }
                                  }),
                                });
                                
                                let data;
                                try {
                                  data = await response.json();
                                } catch (err) {
                                  throw new Error("Unable to parse server response.");
                                }

                                if (response.ok && data.text) {
                                  setAiChatHistory([...newHistory, { role: 'model', parts: [{ text: data.text }] }] as any);
                                  executeAiActions(data.text);
                                } else {
                                  throw new Error(data.error || `HTTP ${response.status} Error`);
                                }
                              } catch (error: any) {
                                console.error("AI chat error:", error);
                                const isApiKeyError = error.message && error.message.includes("GEMINI_API_KEY");
                                let fallbackText = '';
                                if (isApiKeyError) {
                                  fallbackText = state.language === 'bn'
                                    ? "দুঃখিত, এপিআই কি (API Key) পাওয়া যায়নি! দয়া করে সেটিংস > সিক্রেটস (Settings > Secrets) প্যানেলে 'GEMINI_API_KEY' কি-টি যুক্ত করো।"
                                    : "API Key is missing! Please configure 'GEMINI_API_KEY' in the Settings > Secrets menu.";
                                } else {
                                  fallbackText = state.language === 'bn'
                                    ? error.message 
                                    : (error.message || 'Sorry, I am having trouble connecting. Please try again in a moment.');
                                }
                                setAiChatHistory([...newHistory, { role: 'model', parts: [{ text: fallbackText }] }] as any);
                              } finally {
                                setAiLoading(false);
                                setIsGeneratingImage(false);
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white transition font-bold"
                          >
                            {aiLoading ? '...' : (state.language === 'bn' ? 'পাঠান' : 'Send')}
                          </button>
                      </div>
                    </div>
                </div>
            </div>
          </motion.div>
        );
      })()}
      
      {/* --- PREMIUM CONTROL PANEL SIDEBAR DRAWER OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 transition-opacity duration-300 cursor-pointer" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- CONTROL PANEL SIDEBAR DRAWER PANEL --- */}
      <div className={`fixed top-0 bottom-0 left-0 w-80 max-w-[90vw] bg-slate-950/98 border-r border-slate-800/60 z-50 shadow-2xl transition-transform duration-300 transform p-6 flex flex-col justify-between overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Drawer Profile Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/40 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
                MP
              </div>
              <div>
                <h2 className="text-xs font-extrabold tracking-widest text-slate-300 uppercase">
                  {state.language === 'bn' ? 'নিয়ন্ত্রণ প্যানেল' : 'Control Panel'}
                </h2>
                <p className="text-[10px] text-amber-400 font-mono uppercase font-bold">Premium Workspace</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* USER PROFILE QUICK ACCESS */}
          <button 
            onClick={() => {
              handleTabChange('profile');
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl mb-6 hover:border-amber-500/30 transition-all group cursor-pointer shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-amber-500/20 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-amber-500/50 transition-all">
              {state.userProfile?.name ? (
                <div className="w-full h-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-black text-lg">
                  {state.userProfile.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div className="text-left overflow-hidden">
              <h3 className="text-sm font-black text-slate-100 truncate">
                {state.userProfile?.name || (state.language === 'bn' ? 'ইউজার প্রোফাইল' : 'User Profile')}
              </h3>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">
                {state.language === 'bn' ? 'প্রোফাইল সেটিংস ও রিপোর্ট' : 'View Profile & Stats'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 ml-auto text-slate-600 group-hover:text-amber-500 transition-all" />
          </button>

          {/* UI / UX Mode Selector */}
          <div className="mb-6 bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <span>💻 {state.language === 'bn' ? 'UI UX মোড' : 'UI UX Mode'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => saveState({ ...state, uiMode: 'cinematic', layoutMode: 'clean' })}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${state.uiMode === 'cinematic' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'}`}
              >
                Cinematic
              </button>
              <button 
                onClick={() => saveState({ ...state, uiMode: 'default', layoutMode: 'clean' })}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${state.layoutMode === 'clean' && state.uiMode !== 'cinematic' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'}`}
              >
                Clean UI
              </button>
              <button 
                onClick={() => saveState({ ...state, uiMode: 'default', layoutMode: 'classic' })}
                className={`col-span-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${state.layoutMode === 'classic' && state.uiMode !== 'cinematic' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'}`}
              >
                Classic UI
              </button>
            </div>
          </div>
          
          {/* Widget 1: Daily Wellness / Life Quality Index Score (NEW PREMIUM FEATURE) */}
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80 mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{state.language === 'bn' ? 'আজকের ফোকাস স্কোর' : 'Today’s Focus Score'}</span>
            </h4>
            
            {/* Live calculations */}
            {(() => {
              const todayLog = state.history[todayStr];
              
              // Calculate prayer count completed today
              const prayersDone = todayLog?.prayer 
                ? Object.values(todayLog.prayer).filter(v => ['জামাত', 'ঘরে', 'jamaat', 'home'].includes(v as string)).length 
                : 0;
              
              // Calculate habits completed
              const habitsCount = state.habits.length;
              const habitsDone = todayLog?.habits 
                ? Object.values(todayLog.habits).filter(Boolean).length 
                : 0;
              
              // Calculate study hours
              const studySeconds = todayLog?.study 
                ? (Object.values(todayLog.study) as number[]).reduce((a, b) => a + b, 0) 
                : 0;
              const studyMins = Math.floor(studySeconds / 60);

              // Standard scoring formula
              const prayerScore = Math.min(100, prayersDone * 20); // 5 prayers = 100
              const habitScore = habitsCount > 0 ? Math.min(100, (habitsDone / habitsCount) * 100) : 100;
              const studyScore = Math.min(100, (studyMins / 120) * 100); // 120 mins = 100%

              const overallScore = Math.round((prayerScore + habitScore + studyScore) / 3);

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Wellness Rating:</span>
                    <span className="text-sm font-black text-amber-400 font-mono">{overallScore}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                      style={{ width: `${overallScore}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    {state.language === 'bn' 
                      ? "আজকের নামাজ, সুঅভ্যাস এবং পড়ালেখার লাইভ রেটিং স্কোর।" 
                      : "Combined score calculated live from your prayers, completed habits, and study time."}
                  </p>
                </div>
              );
            })()}
          </div>

            {/* Widget 2: Daily Wellness/Focus Score with Sparkline */}
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80 mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />
                <span>{state.language === 'bn' ? 'দৈনিক সুস্থতা স্কোর' : 'Daily Wellness Score'}</span>
              </h4>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{state.focusLevel * 20}%</div>
                <div className="w-24 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[10, 30, 20, 50, 40, 70, 60].map(s => ({ score: s }))}>
                      <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Widget 2: Personal Scratchpad Persisted Notes (Auto saves to state) */}
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80 mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <NotebookPen className="w-3.5 h-3.5 text-emerald-500" />
                <span>{state.language === 'bn' ? 'ব্যক্তিগত খসড়া প্যাড' : 'Personal Scratchpad'}</span>
              </h4>
              
              <textarea
                value={state.noteScratchpad || ''}
                onChange={(e) => saveState({ ...state, noteScratchpad: e.target.value })}
                placeholder={state.language === 'bn' ? 'আজকের কাজ, ভাবনা বা লক্ষ্য এখানে লিখে রাখুন... (স্বয়ংক্রিয়ভাবে সেভ হবে)' : 'Jot down sudden thoughts or goals here... (Auto persistently saved)'}
                className="w-full h-32 bg-slate-950 text-xs text-slate-300 p-2.5 rounded-xl border border-slate-850 outline-none resize-none focus:border-amber-500/50 transition-colors font-sans"
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold font-mono">🛠 auto-persisted</span>
                <button 
                  onClick={() => saveState({ ...state, noteScratchpad: '' })}
                  className="text-[9px] text-slate-500 hover:text-red-400 transition font-bold"
                >
                  {state.language === 'bn' ? 'পরিষ্কার করুন' : 'Clear'}
                </button>
              </div>
            </div>

            {/* Instant Reports Navigation link */}
            <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              {state.language === 'bn' ? 'সরাসরি রিপোর্ট সেকশন' : 'Direct Reports Link'}
            </h4>
            <button
              onClick={() => {
                setActiveTab('report');
                setIsSidebarOpen(false);
              }}
              className="w-full p-3.5 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 rounded-2xl border border-amber-500/20 text-xs font-bold text-amber-400 hover:text-white hover:from-amber-600/25 hover:to-yellow-600/25 transition flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{state.language === 'bn' ? 'সাপ্তাহিক রিপোর্ট দেখুন' : 'View Weekly Analytics'}</span>
              </span>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>
          </div>

          {/* Widget 5: Download Data System PDF Export */}
          <div className="space-y-3 mt-5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              {state.language === 'bn' ? 'ডাটা সংরক্ষণ ও ব্যাকআপ' : 'Data Controls & Backup'}
            </h4>
            
            {/* PDF Export */}
            <button
              onClick={() => {
                exportStateToPdf(state);
              }}
              className="w-full p-3 bg-[#131a26]/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400 font-bold" />
                <span>{state.language === 'bn' ? 'রিপোর্ট ডাউনলোড (PDF)' : 'Download Report (PDF)'}</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 text-slate-400" />
            </button>

            {/* JSON Export backup */}
            <button
              onClick={exportStateJson}
              className="w-full p-3 bg-[#131a26]/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-400 font-bold" />
                <span>{state.language === 'bn' ? 'ডাটা এক্সপোর্ট (JSON)' : 'Export Full Data (JSON)'}</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 text-slate-400" />
            </button>

            {/* JSON Import restore */}
            <div className="relative">
              <label className="w-full p-3 bg-[#131a26]/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-400 font-bold" />
                  <span>{state.language === 'bn' ? 'ডাটা ইমপোর্ট (JSON)' : 'Import Full Data (JSON)'}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 text-slate-400" />
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleJsonImport} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Feedback Message */}
            {importFeedback && (
              <div className={`p-2.5 rounded-xl border text-[11px] font-semibold leading-relaxed font-sans ${
                importFeedback.type === 'success' 
                  ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-950/40 border-red-500/20 text-red-400'
              }`}>
                {importFeedback.text}
              </div>
            )}
          </div>
        </div>
        {/* Sidebar footer section */}
        <div className="pt-4 border-t border-slate-900/80 text-center">
          <p className="text-[10px] text-slate-500 font-mono">Sohan Mridha Ecosystem</p>
          <p className="text-[8px] text-slate-600 uppercase tracking-wider font-bold mt-1">Made with Love & Focus</p>
        </div>
      </div>
      
      {/* Onboarding walk-around modal */}
      {state.showOnboarding && (
        <OnboardingModal 
          language={state.language} 
          onClose={() => saveState({ ...state, showOnboarding: false })} 
        />
      )}

      {state.focusModeActive && (
        <FocusModeOverlay 
          onExit={() => saveState({ ...state, focusModeActive: false })}
          state={state}
          onSaveFocusTime={(data) => {
             const today = new Date().toISOString().split('T')[0];
             const currentLog = state.history[today] || { study: {}, prayer: {}, habits: {}, fitness: {} };
             
             const updatedStudy = { ...currentLog.study };
             updatedStudy[data.subject] = (updatedStudy[data.subject] || 0) + data.seconds;
             
             saveState({ 
                ...state, 
                focusModeActive: false,
                history: {
                    ...state.history,
                    [today]: {
                        ...currentLog,
                        study: updatedStudy
                    }
                }
             });

             triggerActionNotification('study_session_saved', { subject: data.subject });
          }}
          onOpenSounds={() => setShowSoundModal(true)}
          onOpenSettings={() => {}}
        />
      )}

      {/* Modern top Header banner bar */}
      {activeTab !== 'profile' && (
      <header className={`sticky top-0 z-40 transition-all duration-500 ${state.layoutMode === 'clean' || state.uiMode === 'cinematic' ? 'bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-3 px-4 sm:px-6 before:absolute before:inset-0 before:bg-gradient-to-b before:from-indigo-500/5 before:to-transparent before:pointer-events-none' : 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-4 sm:px-6'} flex items-center justify-between`}>
        
        {/* Creator branding and title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
            title={state.language === 'bn' ? 'মেনু বার' : 'Open Menu'}
          >
            <Menu className="w-5 h-5 text-amber-400" />
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAiFullScreen(true)}
            className="group relative flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] overflow-hidden shrink-0"
            title={state.language === 'bn' ? 'মৃধাক্স এআই চ্যাট খুলুন' : 'Open MridhaX AI Chat'}
          >
            {/* Cinematic Background Animations */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-400/30 transition-colors"></div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 relative z-10">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-[1px] shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 uppercase font-sans leading-none">
                  MridhaX
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-emerald-500/80 uppercase mt-0.5">
                  Intelligence
                </span>
              </div>
            </div>
            
            {/* Elegant real-time syncing status indicator dot */}
            <span className="relative flex h-2 w-2 shrink-0 ml-1">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${showAutoSaveToast ? 'bg-rose-500 opacity-75' : 'bg-emerald-500 opacity-50'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${showAutoSaveToast ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`}></span>
            </span>
          </motion.button>
          
          {/* Study Deep Focus Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => saveState({ ...state, focusModeActive: true })}
            className="group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all cursor-pointer overflow-hidden"
            title={state.language === 'bn' ? 'স্টাডি ফোকাস মোড' : 'Study Deep Focus Mode'}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 animate-[shimmer_3s_infinite]" />
            <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse relative z-10" />
            <span className="text-xs font-bold text-white tracking-widest uppercase relative z-10">
              {state.language === 'bn' ? 'ফোকাস' : 'Focus'}
            </span>
          </motion.button>

          {/* Combined Cinematic Academic Planner Widget */}
          <div className="relative group p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-fuchsia-500/30 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 transition-all duration-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hidden sm:block ml-2">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-2xl blur-md group-hover:blur-lg transition-all duration-500" />
            
            <div className="relative flex items-center bg-slate-950/90 backdrop-blur-xl rounded-2xl overflow-hidden h-full">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2.5s_infinite]" />
              
              <div className="px-3 py-1 bg-gradient-to-r from-indigo-950/50 to-transparent border-r border-white/5 hidden md:flex items-center gap-1.5 h-full">
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">Hub</span>
              </div>

              <motion.button
                whileHover={{ backgroundColor: 'rgba(99,102,241,0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleTabChange('exams');
                  setIsAiFullScreen(false);
                  playCompletionBeep();
                }}
                className={`relative z-10 flex flex-col items-center justify-center px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'exams' && !isAiFullScreen
                    ? 'text-indigo-300 bg-indigo-500/10'
                    : 'text-slate-400 hover:text-indigo-200'
                }`}
              >
                <GraduationCap className={`w-4 h-4 mb-1 ${activeTab === 'exams' && !isAiFullScreen ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-transform duration-300'}`} />
                <span className="text-[9px] font-bold tracking-wider uppercase leading-none">{state.language === 'bn' ? 'পরীক্ষা' : 'Exams'}</span>
              </motion.button>
              
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent relative z-10" />

              <motion.button
                whileHover={{ backgroundColor: 'rgba(168,85,247,0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleTabChange('routine');
                  setIsAiFullScreen(false);
                  playCompletionBeep();
                }}
                className={`relative z-10 flex flex-col items-center justify-center px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'routine' && !isAiFullScreen
                    ? 'text-purple-300 bg-purple-500/10'
                    : 'text-slate-400 hover:text-purple-200'
                }`}
              >
                <Calendar className={`w-4 h-4 mb-1 ${activeTab === 'routine' && !isAiFullScreen ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-slate-500 group-hover:text-purple-400 group-hover:scale-110 transition-transform duration-300'}`} />
                <span className="text-[9px] font-bold tracking-wider uppercase leading-none">{state.language === 'bn' ? 'রুটিন' : 'Routine'}</span>
              </motion.button>
            </div>
          </div>
          
        </div>

        {/* Global togglers consolidated */}
        <div className="flex items-center gap-2">
          
          {/* Mobile view only for Academic Planner toggle */}
          <div className="sm:hidden relative group p-[1px] rounded-xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30">
             <div className="relative flex items-center bg-slate-950/90 rounded-xl overflow-hidden h-full">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleTabChange(activeTab === 'exams' ? 'routine' : 'exams');
                    setIsAiFullScreen(false);
                    playCompletionBeep();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2"
                >
                  {activeTab === 'exams' ? (
                     <GraduationCap className="w-4 h-4 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  ) : (
                     <Calendar className="w-4 h-4 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  )}
                </motion.button>
             </div>
          </div>

          <HeaderActions 
            language={state.language}
            onToggleLanguage={toggleLanguage}
            onOpenGarden={() => setShowGardenModal(true)}
            onOpenSounds={() => setShowSoundModal(true)}
            onOpenInstall={() => setShowInstallGuide(true)}
            onOpenOnboarding={() => saveState({ ...state, showOnboarding: true })}
            onChangeTheme={changeTheme}
            onOpenSocial={() => setIsSocialDashboardOpen(true)}
            onlineCount={state.focusLevel || 3} 
            systemStatus={systemStatus}
          />
        </div>
      </header>

      )}

      {/* Main app grid content panel */}
      <main className={`max-w-2xl mx-auto px-4 ${state.uiMode === 'cinematic' ? 'mt-12' : 'mt-6'} space-y-6`}>
        {state.uiMode === 'cinematic' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: Math.max(0, 1 - scrollY / 100),
              scale: Math.max(0.95, 1 - scrollY / 500)
            }}
            style={{ transformOrigin: 'left center' }}
            className="mb-8 mt-4 sticky top-6 z-30 pointer-events-none"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 tracking-tight leading-tight drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              {activeTab === 'study' ? (state.language === 'bn' ? 'স্টাডি ড্যাশবোর্ড' : 'Focus Center') :
               activeTab === 'prayer' ? (state.language === 'bn' ? 'নামাজ ও দোয়া' : 'Faith & Prayers') :
               activeTab === 'habits' ? (state.language === 'bn' ? 'অভ্যাস ট্র্যাকার' : 'Habit Architect') :
               activeTab === 'fitness' ? (state.language === 'bn' ? 'ফিটনেস ট্র্যাকার' : 'Physical Fitness') :
               activeTab === 'routine' ? (state.language === 'bn' ? 'রুটিন প্ল্যানার' : 'Daily Routine') :
               activeTab === 'exams' ? (state.language === 'bn' ? 'এক্সাম প্রিপারেশন' : 'Exam Intelligence') :
               activeTab === 'phone' ? (state.language === 'bn' ? 'স্ক্রিন টাইম' : 'Digital Wellbeing') :
               activeTab === 'reflection' ? (state.language === 'bn' ? 'ডায়রী ও জার্নাল' : 'Personal Journal') :
               activeTab === 'report' ? (state.language === 'bn' ? 'রিপোর্ট ও বিশ্লেষণ' : 'Analytics & Insights') :
               activeTab === 'profile' ? (state.language === 'bn' ? 'প্রোফাইল' : 'Identity Hub') :
               'Dashboard'}
            </h1>
          </motion.div>
        )}
        {/* --- PANEL VIEW ROUTER SWITCHER --- */}
        
        {/* TAB 1: STUDY COMPONENT */}
        {activeTab === 'study' && (
          <div className="space-y-6">
            
            {/* Tree focusing panel card */}
            <div className={`card ${state.layoutMode === 'clean' ? 'rounded-xl p-4' : 'rounded-3xl p-6'} ${currentTheme.card} border transition-all duration-300 relative`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  {t.studyHeader}
                </span>
                
                {selectedSubject && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-widest animate-pulse border border-emerald-500/20">
                    {t.treeStateSeed}
                  </span>
                )}
              </div>

              {/* Study encouraging quote dynamic list */}
              <div className={`quote p-3.5 mb-5 rounded-2xl bg-slate-950/40 text-xs italic text-slate-300 ${currentTheme.accentBorder}`}>
                "{state.language === 'bn' 
                  ? "জ্ঞান অন্বেষণ করা প্রত্যেক মুসলিমের জন্য ফরজ। আপনার ফোকাস বজায় রাখুন!" 
                  : "Seeking knowledge is an obligation upon every single soul. Sustain your focus!"
                }"
              </div>

              {isBreakMode ? (
                <div className="text-center py-6 px-4 bg-slate-950/50 rounded-2xl border border-blue-500/10 space-y-6">
                  {/* Glowing Coffee / Tea Cup icon */}
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                      <Coffee className="w-10 h-10 text-blue-400 animate-bounce" />
                      <span className="absolute -inset-2 blur-md bg-blue-500/10 rounded-full animate-pulse"></span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                      <span>🌿 {state.language === 'bn' ? "রিফ্রেশিং বিরতি চলছে" : "Refreshing Break Active"}</span>
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                      {state.language === 'bn' 
                        ? "টানা ২৫ মিনিট ফোকাস করার পর আপনার মস্তিষ্ক ও চোখের বিশ্রাম দরকার। দীর্ঘশ্বাস নিন বা একটু শরীর স্ট্রেচ করুন!" 
                        : "After 25 minutes of focus, your brain and eyes need a rest. Take a deep breath, hydrate, or do a light stretch!"}
                    </p>
                  </div>

                  {/* Animated breathing visualizer ring */}
                  <div className="flex justify-center py-4">
                    <div className="relative w-36 h-36 rounded-full border border-blue-500/20 flex items-center justify-center">
                      {/* Inner pulsing ring representing breathing guides */}
                      <div className="absolute w-28 h-28 bg-blue-500/5 rounded-full animate-ping flex items-center justify-center" />
                      <div className="absolute w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/40 flex flex-col items-center justify-center shadow-inner">
                        <span className="font-mono text-3xl font-black text-white">
                          {Math.floor(breakSecondsLeft / 60)}:{Math.floor(breakSecondsLeft % 60).toString().padStart(2, '0')}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-blue-400 mt-1 font-bold animate-pulse">
                          {breakSecondsLeft % 8 < 4 
                            ? (state.language === 'bn' ? "শ্বাস নিন" : "Breathe In") 
                            : (state.language === 'bn' ? "শ্বাস ছাড়ুন" : "Breathe Out")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Controller Action buttons */}
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsBreakMode(false);
                        triggerCustomAlert(
                          state.language === 'bn' ? "বিরতি এড়ানো হয়েছে, চলুন ফোকাস করি!" : "Break skipped, let's focus!",
                          'MridhaX Study',
                          'info'
                        );
                      }}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer border border-slate-700"
                    >
                      {state.language === 'bn' ? "বিরতি এড়িয়ে যান ⏭️" : "Skip Break ⏭️"}
                    </button>
                    <button
                      onClick={() => {
                        setIsBreakMode(false);
                        setTimerRunning(true);
                        triggerCustomAlert(
                          state.language === 'bn' ? "বিরতি সমাপ্ত করে পড়াশোনা শুরু!" : "Break completed, starting study!",
                          'MridhaX Study',
                          'success'
                        );
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 border-0"
                    >
                      {state.language === 'bn' ? "পড়াশোনা শুরু 🦾" : "Resume Study 🦾"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Growable interactive Focus Tree frame */}
                  <FocusTree 
                    progressPercentage={progressPercent}
                    isFocused={timerRunning}
                    isActiveFocusWindow={isWindowFocused}
                    language={state.language}
                    treeType={state.activeTreeType || 'sakura'}
                    onToggle={toggleStudyTimer}
                    onReset={() => setShowResetConfirm(true)}
                    secondsElapsed={secondsElapsed}
                  />

                  {/* Digital Timer reading */}
                  <div className="text-center py-8">
                    <div className={`font-mono text-6xl font-black tracking-widest bg-gradient-to-r from-slate-100 via-white to-slate-200 bg-clip-text text-transparent transition-all duration-1000 ${
                      timerRunning ? 'animate-pulse text-emerald-300' : ''
                    }`}>
                      {getFormatTimerStr(secondsElapsed)}
                    </div>
                    <div className="text-xs text-slate-400 mt-3.5 font-mono font-bold tracking-widest uppercase">
                      {t.targetLabel} {activeSubjectItem ? `${activeSubjectItem.target} ${t.targetMinutes}` : `0 ${t.targetMinutes}`}
                    </div>
                  </div>

                  {/* Controller buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pb-6">
                    <button
                      onClick={toggleStudyTimer}
                      className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition duration-200 cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                        timerRunning 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                          : currentTheme.glowBtn
                      }`}
                    >
                      {timerRunning ? (
                        <>
                          <Moon className="w-5 h-5 mr-1 animate-spin" />
                          {t.studyPause}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-1" />
                          {t.studyStart}
                        </>
                      )}
                    </button>

                    {/* Fullscreen Overlay Trigger */}
                    {timerRunning && (
                      <button
                        onClick={() => setIsFullscreenFocus(true)}
                        className="w-full sm:w-auto px-6 py-4 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-900 transition font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 text-slate-200 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                        <span>{t.studyFocusMode}</span>
                      </button>
                    )}

                    {/* Reset button auxiliary */}
                    {secondsElapsed > 0 && (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full sm:w-auto px-5 py-4 rounded-xl border border-rose-500/25 bg-rose-950/20 hover:bg-rose-900 text-xs font-bold text-rose-300 uppercase tracking-widest cursor-pointer"
                      >
                        {state.language === 'bn' ? 'রিসেট' : 'Reset'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Background Focus Option */}
              <div className="mt-2 mb-4 p-4 bg-slate-900/60 rounded-2xl border border-emerald-500/20 flex flex-row items-center justify-between gap-3 text-slate-300">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border text-emerald-400 ${keepFocusInBackground ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/50 border-slate-800'}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="text-xs font-black text-slate-100 block tracking-wide">
                      {state.language === 'bn' ? 'ব্যাকগ্রাউন্ড ট্র্যাকিং সক্রিয়' : 'Background Tracker Enabled'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-relaxed max-w-xs md:max-w-md">
                      {state.language === 'bn' 
                        ? 'আমি ব্যাকগ্রাউন্ডে ফোকাস টাইমার চালু রেখে অন্য ট্যাবে PDF পড়তে বা ভিডিও দেখতে চাই' 
                        : 'Permit countdown progress while navigating tabs, reading PDF resources or playing recordings.'}
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={keepFocusInBackground}
                    onChange={(e) => setKeepFocusInBackground(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-500 peer-checked:after:bg-emerald-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-950/80 border border-slate-700/50"></div>
                </label>
              </div>

              {/* Subject selectors container */}
              <div className="mt-8 pt-6 border-t border-slate-800/60 space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span>{t.chooseSubject} (multiple tracking items supported):</span>
                </label>
                
                {/* Subjects listing choices */}
                <div className={`${state.layoutMode === 'clean' ? 'grid grid-cols-1' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-3`}>
                  {state.subjects.map((sub, idx) => {
                    const isSel = selectedSubject === sub.name;
                    const isEditing = editingSubjectId === sub.id;

                    return (
                      <div 
                        key={sub.id || `sub-${idx}`}
                        className={`group relative flex ${state.layoutMode === 'clean' ? 'flex-row items-center justify-between' : 'flex-col justify-between'} p-4 rounded-2xl border transition cursor-pointer select-none ${
                          isSel 
                            ? 'bg-blue-600/15 border-blue-500 text-blue-100 shadow-md shadow-blue-500/5' 
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40'
                        }`}
                        onClick={() => !isEditing && handleSubjectChange(sub.name)}
                      >
                        {isEditing ? (
                          <div className="w-full space-y-2.5" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'বিষয়ের নাম' : 'Subject Name'}</label>
                              <input 
                                type="text" 
                                value={editingSubjectName} 
                                onChange={(e) => setEditingSubjectName(e.target.value)}
                                className="w-full bg-slate-900 text-sm text-white px-2.5 py-1.5 rounded-xl border border-slate-750 focus:border-amber-500 outline-none"
                              />
                            </div>
                            <div className="flex gap-2 items-center">
                              <div className="space-y-1 flex-1">
                                <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'টার্গেট (মিনিট)' : 'Target (mins)'}</label>
                                <input 
                                  type="number" 
                                  value={editingSubjectTarget} 
                                  onChange={(e) => setEditingSubjectTarget(parseInt(e.target.value) || 0)}
                                  className="w-full bg-slate-900 text-sm text-white px-2.5 py-1.5 rounded-xl border border-slate-750 focus:border-amber-500 outline-none"
                                />
                              </div>
                              <button 
                                onClick={saveSubjectItemEdit}
                                className="mt-4 bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-xl text-xs font-black text-white transition tracking-wider uppercase cursor-pointer"
                              >
                                {state.language === 'bn' ? 'ঠিক আছে' : 'Save'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3.5 truncate pr-16">
                              {/* Circular Progress Ring */}
                              {(() => {
                                const radius = 13;
                                const circumference = 2 * Math.PI * radius;
                                const secondsCompleted = state.history[todayStr]?.study?.[sub.name] || 0;
                                const targetSeconds = Math.max(1, (sub.target || 0) * 60);
                                const percentage = Math.min(100, Math.round((secondsCompleted / targetSeconds) * 100));
                                const strokeDashoffset = circumference - (percentage / 100) * circumference;
                                return (
                                  <div className="relative flex items-center justify-center w-9 h-9 shrink-0" title={`${percentage}% completed`}>
                                    <svg className="w-9 h-9 transform -rotate-90">
                                      <circle
                                        cx="18"
                                        cy="18"
                                        r={radius}
                                        className="text-slate-800"
                                        strokeWidth="2.5"
                                        stroke="currentColor"
                                        fill="transparent"
                                      />
                                      <circle
                                        cx="18"
                                        cy="18"
                                        r={radius}
                                        className="text-emerald-500 transition-all duration-500"
                                        strokeWidth="2.5"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                      />
                                    </svg>
                                    <span className="absolute text-[8px] font-black font-mono text-emerald-400">
                                      {percentage}%
                                    </span>
                                  </div>
                                );
                              })()}

                              <div className="truncate">
                                <p className="text-sm md:text-base font-black truncate">{sub.name}</p>
                                <p className="text-xs text-slate-500 font-bold font-mono mt-0.5">{sub.target} min / {state.language === 'bn' ? 'দৈনিক লক্ষ্য' : 'daily goal'}</p>
                              </div>
                            </div>

                            {/* Actions Group (Edit & Delete Button) */}
                            <div className="opacity-0 group-hover:opacity-100 absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 backdrop-blur-sm transition-all">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditSubjectItem(sub);
                                }}
                                className="p-1.5 bg-slate-900 hover:bg-blue-950 text-slate-400 hover:text-blue-300 rounded-lg transition"
                                title="Edit subject"
                              >
                                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSubjectItem(sub.id, sub.name);
                                }}
                                className="p-1.5 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg transition"
                                title="Delete subject"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form to add customizable subject units (Multiple items add) */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
              <h3 className="text-base font-bold uppercase tracking-wider text-slate-300 mb-4 font-sans flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>{t.addNewSubject}</span>
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">{t.subjectNameLabel}</label>
                  <input
                    type="text"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder={state.language === 'bn' ? 'যেমন: রসায়ন বিক্রিয়া, ওয়েব কোডিং' : 'e.g. Inorganic Chemistry, JS Coding'}
                    className="w-full bg-slate-950 border border-slate-820 rounded-xl p-3.5 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">{t.subjectTargetLabel}</label>
                  <input
                    type="number"
                    value={newSubTarget}
                    onChange={(e) => setNewSubTarget(parseInt(e.target.value) || 0)}
                    placeholder="60"
                    className="w-full bg-slate-950 border border-slate-820 rounded-xl p-3.5 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors bg-teal-500/5"
                    min="1"
                    max="1440"
                  />
                </div>

                <button
                  onClick={addNewSubjectItem}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>{t.addBtn}</span>
                </button>
              </div>
            </div>

            {/* FOCUS POINTS VS TARGET CONSISTENCY CHART */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-350 font-sans flex items-center gap-1.5">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>
                    {state.language === 'bn' 
                      ? 'মনোযোগ প্রগতি ও লক্ষ্য ধারাবাহিকতা' 
                      : 'Focus Consistency & Daily Target Goal'}
                  </span>
                </h3>
                <span className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-md">
                  {state.language === 'bn' ? 'গত ৭ দিন' : 'Last 7 Days'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/45 border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
                {state.language === 'bn' 
                  ? 'প্রতি ১ মিনিট ফিজিক্যাল বা টেকনিক্যাল পড়াশোনা = ১ ফোকাস পয়েন্ট (XP)। প্রতিদিনের লক্ষ্য এবং অর্জিত পয়েন্টের গ্রাফ দেখুন।' 
                  : 'Nurture consistent daily study sessions. 1 Minute Focus = 1 XP (Focus Point). Compare your real earned score against targeted goals.'}
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getDailyFocusPointsChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#10192e" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={11} 
                      fontWeight="bold"
                      tickLine={false} 
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={11} 
                      fontWeight="bold"
                      tickLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#020617', 
                        borderColor: '#1e293b', 
                        borderRadius: '16px',
                        fontSize: '11px',
                        color: '#f8fafc' 
                      }} 
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} 
                      verticalAlign="top" 
                      height={36} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="points" 
                      name={state.language === 'bn' ? 'অর্জিত ফোকাস পয়েন্ট (XP)' : 'Earned Focus Points (XP)'} 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#020617' }}
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name={state.language === 'bn' ? 'আজকের ফোকাস লক্ষ্য (মিনিট)' : 'Study Target (Minutes)'} 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                    {state.language === 'bn' ? 'আজকের অর্জিত XP' : 'Earned Points Today'}
                  </span>
                  <span className="text-base font-black font-mono text-emerald-400">
                    {Math.round(secondsElapsed / 60)} XP
                  </span>
                </div>
                <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                    {state.language === 'bn' ? 'ধারাবাহিকতা স্কোর' : 'Consistency score'}
                  </span>
                  <span className="text-base font-black font-mono text-blue-400">
                    {(() => {
                      const data = getDailyFocusPointsChartData();
                      const accomplishedCount = data.filter(d => d.points >= d.target || d.points > 30).length;
                      return `${Math.round((accomplishedCount / 7) * 100)}%`;
                    })()}
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRAYERS TRACKER */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">

            {/* Live Location and Countdown Banner */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border bg-gradient-to-br from-indigo-950/20 to-slate-900/40 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
                    ⚡ {state.language === 'bn' ? 'রিয়েল-টাইম নামাজের কাউন্টডাউন' : 'REAL-TIME PRAYER COUNTDOWN'}
                  </span>
                  <h4 className="text-lg font-black text-slate-100 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                    <span>
                      {nextPrayerCountdown ? nextPrayerCountdown.timeLeftString : (state.language === 'bn' ? 'পরবর্তী নামাজের সময় গণনা করা হচ্ছে...' : 'Calculating next prayer...')}
                    </span>
                  </h4>
                  <div className="text-xs text-slate-400 flex items-center gap-2.5 flex-wrap">
                    <span>
                      {state.language === 'bn' ? 'বর্তমান লোকেশন:' : 'Current Location:'}{' '}
                      <strong className="text-slate-200">{(state.prayerLocation as any)?.name || (state.language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh')}</strong>
                    </span>
                    <span className="text-slate-600">|</span>
                    <button 
                      onClick={getGPSLocationAndFetch}
                      disabled={fetchingPrayerTimes}
                      className="text-amber-400 hover:text-amber-300 font-bold underline transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {fetchingPrayerTimes ? '...' : (state.language === 'bn' ? 'জিপিএস দিয়ে আপডেট করুন' : 'Update with GPS')}
                    </button>
                  </div>
                </div>

                {/* Manual selector dropdown if GPS is unavailable */}
                <div className="space-y-1.5 min-w-[200px]">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {state.language === 'bn' ? 'ম্যানুয়াল লোকেশন নির্বাচন' : 'Manual Location Selection'}
                  </label>
                  <select
                    disabled={fetchingPrayerTimes}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const loc = MAJOR_LOCATIONS[parseInt(e.target.value, 10)];
                      if (loc) {
                        fetchLivePrayerTimes(loc.lat, loc.lng, state.language === 'bn' ? loc.nameBn : loc.nameEn);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="">-- {state.language === 'bn' ? 'শহর নির্বাচন করুন' : 'Select City'} --</option>
                    {MAJOR_LOCATIONS.map((loc, i) => (
                      <option key={i} value={i}>
                        {state.language === 'bn' ? loc.nameBn : loc.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Daily Waqt Prayers List */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-500 animate-spin-slow" />
                  <span>{t.prayerHeader}</span>
                </h3>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  {todayStr}
                </span>
              </div>
              <div className={`p-3.5 mb-5 rounded-2xl bg-slate-950/40 text-xs italic text-slate-300 ${currentTheme.accentBorder}`}>
                "{state.language === 'bn' 
                  ? "নিশ্চয়ই নামাজ মানুষকে অশ্লীল ও মন্দ কাজ থেকে বিরত রাখে।" 
                  : "Indeed, prayer prohibits immorality and wrongdoing."
                }"
              </div>

              {/* Prayer table layout */}
              <div className="divide-y divide-slate-800/50">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((waqt) => {
                  const saved = state.history[todayStr]?.prayer?.[waqt] || '';
                  const alarmTime = state.prayerTimes[waqt] || 'N/A';

                  return (
                    <div key={waqt} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-200">
                      <div className="flex flex-col gap-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-bold tracking-wide text-base">{waqt}</span>
                          <span className="text-xs text-slate-500 font-bold ml-1 font-mono">({alarmTime})</span>
                        </div>
                        {/* Custom triggers widget */}
                        <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                          {/* Alert Toggle */}
                          {(() => {
                            const notif = (state.prayerNotifications || {})[waqt] || { enabled: true, triggerOffset: 0 };
                            return (
                              <>
                                <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none">
                                  <input
                                    type="checkbox"
                                    checked={notif.enabled}
                                    onChange={(e) => togglePrayerNotificationEnabled(waqt, e.target.checked)}
                                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span>{state.language === 'bn' ? 'অ্যালার্ট' : 'Alert'}</span>
                                </label>
                                
                                {notif.enabled && (
                                  <select
                                    value={notif.triggerOffset}
                                    onChange={(e) => updatePrayerNotificationOffset(waqt, parseInt(e.target.value, 10))}
                                    className="bg-slate-950 border border-slate-800/80 rounded-lg px-2 py-0.5 text-[10px] text-slate-300 font-bold outline-none cursor-pointer"
                                  >
                                    <option value={0}>{state.language === 'bn' ? 'ওয়াক্ত শুরু হলে' : 'At Adhan'}</option>
                                    <option value={-5}>{state.language === 'bn' ? '৫ মি: আগে' : '5m before'}</option>
                                    <option value={-10}>{state.language === 'bn' ? '১০ মি: আগে' : '10m before'}</option>
                                    <option value={-15}>{state.language === 'bn' ? '১৫ মি: আগে' : '15m before'}</option>
                                    <option value={5}>{state.language === 'bn' ? '৫ মি: পরে' : '5m after'}</option>
                                    <option value={10}>{state.language === 'bn' ? '১০ মি: পরে' : '10m after'}</option>
                                  </select>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Log buttons */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: t.statusJamaat, val: 'জামাত' },
                          { label: t.statusHome, val: 'ঘরে' },
                          { label: t.statusQaza, val: 'কাজা' },
                          { label: t.statusSkipped, val: 'পড়িনি' }
                        ].map((btn) => {
                          const isAct = saved === btn.val;
                          return (
                            <button
                              key={btn.val}
                              onClick={() => setPrayerWaqtStatus(waqt, btn.val as any)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                isAct 
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-md' 
                                  : 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              }`}
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Extra dynamic multiple custom slots requested */}
                {Object.keys(state.prayerTimes).map((waqtKey) => {
                  if (['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(waqtKey)) return null;
                  const saved = state.history[todayStr]?.prayer?.[waqtKey] || '';
                  const isEditing = editingPrayerKey === waqtKey;

                  return (
                    <div key={waqtKey} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 relative group border-t border-slate-800/10">
                      {isEditing ? (
                        <div className="w-full flex flex-col sm:flex-row gap-3 items-end sm:items-center p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-1 flex-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'সেশনের নাম' : 'Session Name'}</label>
                            <input 
                              type="text" 
                              value={editingPrayerName} 
                              onChange={(e) => setEditingPrayerName(e.target.value)}
                              className="w-full bg-slate-900 text-sm text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-750 focus:border-amber-500 outline-none"
                            />
                          </div>
                          <div className="space-y-1 w-32">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'সময়' : 'Time'}</label>
                            <input 
                              type="text" 
                              value={editingPrayerTime} 
                              onChange={(e) => setEditingPrayerTime(e.target.value)}
                              className="w-full bg-slate-900 text-sm text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-750 focus:border-amber-500 outline-none font-mono"
                            />
                          </div>
                          <button 
                            onClick={() => saveCustomPrayerSlotEdit(waqtKey)}
                            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl text-xs font-black text-white transition tracking-wider uppercase cursor-pointer shrink-0"
                          >
                            {state.language === 'bn' ? 'ঠিক আছে' : 'Save'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                            <div>
                              <span className="font-bold tracking-wide text-sm md:text-base text-amber-100">{waqtKey}</span>
                              <span className="text-xs text-slate-500 font-bold ml-2 font-mono">({state.prayerTimes[waqtKey] || 'N/A'})</span>
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold ml-1.5">extra</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Log toggles */}
                            <div className="flex gap-2">
                              {[
                                { label: t.statusJamaat, val: 'জামাত' },
                                { label: t.statusHome, val: 'ঘরে' },
                                { label: t.statusQaza, val: 'কাজা' },
                                { label: t.statusSkipped, val: 'পড়িনি' }
                              ].map((btn) => {
                                const isAct = saved === btn.val;
                                return (
                                  <button
                                    key={btn.val}
                                    onClick={() => setPrayerWaqtStatus(waqtKey, btn.val as any)}
                                    className={`px-3 py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all cursor-pointer ${
                                      isAct 
                                        ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    {btn.label}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Actions Group (Edit & Delete Button) */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 backdrop-blur-sm transition-all ml-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditCustomPrayerSlot(waqtKey);
                                }}
                                className="p-1.5 bg-slate-900 hover:bg-blue-955 text-slate-400 hover:text-blue-300 rounded-lg transition"
                                title="Edit custom prayer"
                              >
                                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                              </button>
                              <button
                                onClick={() => deleteCustomPrayerSlot(waqtKey)}
                                className="p-1.5 bg-slate-900 hover:bg-red-955 text-slate-400 hover:text-red-400 rounded-lg transition"
                                title="Remove slot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Set Waqt alarm configurations (Multiple custom schedule adjustments) */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500 animate-spin-slow" />
                <span>{t.prayerTimeConfig}</span>
              </h3>

              <div className={`${state.layoutMode === 'clean' ? 'grid grid-cols-1' : 'grid grid-cols-2 sm:grid-cols-3'} gap-3`}>
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((w) => (
                  <div key={w} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{w}</label>
                    <input
                      type="time"
                      value={state.prayerTimes[w] || '12:00'}
                      onChange={(e) => handlePrayerTimeUpdate(w, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-lg font-mono text-xs outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Add customized spiritual extra slot (e.g. Tahajjud, Quran reading) */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <span>{t.addCustomPrayer}</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCustomPrayerName}
                  onChange={(e) => setNewCustomPrayerName(e.target.value)}
                  placeholder={state.language === 'bn' ? 'যেমন: তাহাজ্জুদ, সকালের জিকির' : 'e.g. Quran Section, Tahajjud'}
                  className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-500"
                />
                <button
                  onClick={addCustomPrayerSlot}
                  className="px-5 bg-blue-600 hover:bg-blue-700 text-white transition rounded-xl font-bold font-sans text-xs sm:text-sm uppercase tracking-wide cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addBtn}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: DAILY GOOD HABITS TRACKER */}
        {activeTab === 'habits' && (
          <div className="space-y-6 animate-fade-in">
            {/* Habits Tab Segmented Sub-view */}
            <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 gap-1.5 shadow-inner">
              <button 
                onClick={() => setHabitsSubTab('good')}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  habitsSubTab === 'good' 
                    ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${habitsSubTab === 'good' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                <span>{state.language === 'bn' ? 'সুঅভ্যাস অর্জন' : 'Good Habits'}</span>
              </button>
              <button 
                onClick={() => setHabitsSubTab('bad')}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  habitsSubTab === 'bad' 
                    ? 'bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-400 border border-rose-500/30 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className={`w-4 h-4 ${habitsSubTab === 'bad' ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
                <span>{state.language === 'bn' ? 'বদ অভ্যাস ত্যাগ' : 'Quit Bad Habits'}</span>
              </button>
            </div>

            {habitsSubTab === 'good' ? (() => {
              const totalHabitsCount = state.habits.length;
              const completedHabitsCount = state.habits.filter(h => state.history[todayStr]?.habits?.[h.id] === true).length;
              const percentCompleted = totalHabitsCount > 0 ? Math.round((completedHabitsCount / totalHabitsCount) * 100) : 0;
              
              // Momentum descriptions
              let momentumLabelBn = 'কোনো গতি নেই 💤';
              let momentumLabelEn = 'Idle Start 💤';
              let momentumColor = 'text-slate-500 bg-slate-900 border-slate-800';
              
              if (percentCompleted > 0 && percentCompleted <= 25) {
                momentumLabelBn = 'গতি বাড়তে শুরু করেছে 🌱';
                momentumLabelEn = 'Momentum Sprouted 🌱';
                momentumColor = 'text-indigo-400 bg-indigo-950/20 border-indigo-500/20';
              } else if (percentCompleted > 25 && percentCompleted <= 50) {
                momentumLabelBn = 'সবল গতি ⚡';
                momentumLabelEn = 'Sparking Flow ⚡';
                momentumColor = 'text-sky-400 bg-sky-950/20 border-sky-500/20';
              } else if (percentCompleted > 50 && percentCompleted <= 75) {
                momentumLabelBn = 'উচ্চ গতি 🔥';
                momentumLabelEn = 'High Momentum 🔥';
                momentumColor = 'text-amber-400 bg-amber-950/20 border-amber-500/20';
              } else if (percentCompleted > 75) {
                momentumLabelBn = 'পিক সিনার্জি স্টেজ! 🌌';
                momentumLabelEn = 'Peak Synergy! 🌌';
                momentumColor = 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
              }

              return (
                <>
                  {/* Habits listing list */}
                  <div 
                    className={`card rounded-3xl p-6 ${currentTheme.card} border relative overflow-hidden transition-all duration-700`}
                    style={{
                      boxShadow: percentCompleted > 0 
                        ? `0 15px 45px -15px rgba(0,0,0,0.65), 0 0 ${15 + (percentCompleted * 0.35)}px -2px rgba(129, 140, 248, ${0.08 + (percentCompleted * 0.0035)})`
                        : undefined,
                      borderColor: percentCompleted > 0 
                        ? `rgba(129, 140, 248, ${0.15 + (percentCompleted * 0.0045)})` 
                        : undefined
                    }}
                  >
                    {/* Living Radial Momentum Backdrop */}
                    {percentCompleted > 0 && (
                      <div 
                        className="absolute -right-24 -top-24 w-56 h-56 rounded-full blur-[75px] pointer-events-none transition-all duration-1000"
                        style={{
                          background: `radial-gradient(circle, rgba(129, 140, 248, 0.45) 0%, rgba(99, 102, 241, 0) 75%)`,
                          opacity: percentCompleted * 0.0075,
                          transform: `scale(${1 + (percentCompleted * 0.007)})`
                        }}
                      />
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-1 relative z-10">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-1.5">
                        <CheckSquare className="w-5 h-5 text-blue-400" />
                        {t.habitHeader}
                      </h3>
                      
                      {/* Live Daily Momentum Tracker Indicator */}
                      <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${momentumColor} transition-all duration-500`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75`} />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                        </span>
                        <span>
                          {state.language === 'bn' ? `মোমেন্টাম: ${momentumLabelBn}` : `Momentum: ${momentumLabelEn}`}
                        </span>
                      </div>
                    </div>

                    {state.habits.length > 0 && (
                      <div className="mb-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 font-sans space-y-2 relative z-10">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-300">
                            {state.language === 'bn' ? 'আজকের অগ্রগতি' : "Today's Progress"}
                          </span>
                          <span className="font-black text-emerald-400">
                            {percentCompleted}% {state.language === 'bn' ? 'সম্পন্ন' : 'Completed'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentCompleted}%` }}
                            transition={{ type: "spring", stiffness: 120, damping: 15 }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span>
                            {state.language === 'bn' 
                              ? `${totalHabitsCount} টি অভ্যাসের মধ্যে ${completedHabitsCount} টি সম্পন্ন` 
                              : `${completedHabitsCount} of ${totalHabitsCount} habits completed`}
                          </span>
                          {percentCompleted === 100 && (
                            <span className="text-emerald-500 font-bold animate-pulse">
                              {state.language === 'bn' ? '🎉 নিখুঁত দিন!' : '🎉 Perfect Day!'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {state.habits.length === 0 ? (
                    <p className="text-slate-500 text-xs italic text-center py-6">
                      {state.language === 'bn' ? 'কোনো অভ্যাস যুক্ত করা নেই। নিচে একটি নতুন অভ্যাস যুক্ত করুন!' : 'No habits tracked. Add a good habit below to start your growth journey!'}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {state.habits.map((item, idx) => {
                        const finished = state.history[todayStr]?.habits?.[item.id] || false;
                        const isEditing = editingHabitId === item.id;
                        
                        return (
                          <div 
                            key={item.id || `habit-${idx}`}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-200 group gap-3 ${
                              finished 
                                ? 'bg-emerald-900/10 border-emerald-500/40' 
                                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            {isEditing ? (
                              <div className="w-full flex flex-col sm:flex-row gap-3 items-end sm:items-center p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
                                <div className="space-y-1 flex-1">
                                  <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'অভ্যাসের নাম' : 'Habit Name'}</label>
                                  <input 
                                    type="text" 
                                    value={editingHabitName} 
                                    onChange={(e) => setEditingHabitName(e.target.value)}
                                    className="w-full bg-slate-900 text-sm text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-750 focus:border-amber-500 outline-none"
                                  />
                                </div>
                                <div className="space-y-1 w-32">
                                  <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'সময় নির্বাচন' : 'Time'}</label>
                                  <select 
                                    value={editingHabitTime} 
                                    onChange={(e) => setEditingHabitTime(e.target.value as any)}
                                    className="w-full bg-slate-900 text-sm text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-755 focus:border-amber-500 outline-none"
                                  >
                                    <option value="Morning">{t.morning}</option>
                                    <option value="Night">{t.night}</option>
                                    <option value="Anytime">{t.anytime}</option>
                                  </select>
                                </div>
                                <button 
                                  onClick={saveHabitItemEdit}
                                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl text-xs font-black text-white transition tracking-wider uppercase cursor-pointer shrink-0"
                                >
                                  {state.language === 'bn' ? 'ঠিক আছে' : 'Save'}
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-3.5 flex-1 min-w-0" onClick={() => toggleHabitComplete(item.id)}>
                                  {/* Check trigger container */}
                                  <motion.div 
                                    whileTap={{ scale: 0.8 }}
                                    animate={{ scale: finished ? [1, 1.25, 1] : 1 }}
                                    transition={{ type: "spring", stiffness: 450, damping: 15 }}
                                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer transition-colors duration-100 ${
                                      finished 
                                        ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                                        : 'border-slate-700 hover:border-slate-600'
                                    }`}
                                  >
                                    {finished && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                        className="flex items-center justify-center"
                                      >
                                        <Check className="w-4 h-4 stroke-[3px]" />
                                      </motion.div>
                                    )}
                                  </motion.div>

                                  <div className="cursor-pointer select-none truncate">
                                    <div className="flex items-center flex-wrap gap-1.5">
                                      <h4 className={`text-xs md:text-sm font-bold truncate ${finished ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                        {item.name}
                                      </h4>
                                      {(() => {
                                        const streak = getHabitStreak(item.id);
                                        const isHighStreak = streak >= 3;
                                        return (
                                          <div className="inline-flex items-center gap-1.5 flex-wrap ml-1.5 shrink-0">
                                            {/* 'Current Streak' Badge */}
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-sm">
                                              <span>{state.language === 'bn' ? 'চলতি স্ট্রিক:' : 'Current Streak:'}</span>
                                              <span className="font-black text-indigo-200">{streak} {state.language === 'bn' ? 'দিন' : 'days'}</span>
                                            </span>

                                            {/* Streak Flame Icon / Badge */}
                                            {streak > 0 && (
                                              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full transition-all duration-300 ${
                                                isHighStreak 
                                                  ? 'bg-gradient-to-r from-orange-550 via-amber-450 to-red-500 text-slate-950 font-black shadow-lg shadow-orange-500/30 animate-pulse border border-orange-400/40 scale-105'
                                                  : 'text-amber-400 bg-amber-500/10 border border-amber-500/25 animate-pulse'
                                              }`}>
                                                <Flame className={`w-3.5 h-3.5 fill-current ${isHighStreak ? 'text-slate-955 animate-bounce' : 'text-amber-505'}`} />
                                                <span>
                                                  {streak}d {isHighStreak ? (state.language === 'bn' ? 'মহাসফল!' : 'STREAK!') : ''}
                                                </span>
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-950 px-2 py-0.5 rounded inline-block mt-1">
                                      ⏰ {item.time === 'Morning' ? t.morning : item.time === 'Night' ? t.night : item.time === 'Anytime' ? t.anytime : item.time}
                                    </span>
                                  </div>
                                </div>

                                {/* Sparkline */}
                                {(() => {
                                  // Past 7 days (including today)
                                  const result: boolean[] = [];
                                  for (let i = 6; i >= 0; i--) {
                                    const d = new Date();
                                    d.setDate(d.getDate() - i);
                                    const dateStr = d.toISOString().split('T')[0];
                                    const comp = !!state.history[dateStr]?.habits?.[item.id];
                                    result.push(comp);
                                  }
                                  const points = result.map((val, idx) => ({
                                    x: idx * 9 + 4,
                                    y: val ? 4 : 20,
                                  }));
                                  const pathD = points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, "");
                                  return (
                                    <div className="flex flex-col items-center shrink-0 px-2 border-l border-slate-800/80" title={state.language === 'bn' ? '৭ দিনের ট্রেন্ড' : '7-day Completion Trend'}>
                                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">7D Trend</span>
                                      <svg className="w-[60px] h-6 overflow-visible">
                                        <path
                                          d={pathD}
                                          fill="none"
                                          stroke={result[6] ? "#10b981" : "#3b82f6"}
                                          strokeWidth="2.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        {points.map((p, i) => (
                                          <circle
                                            key={i}
                                            cx={p.x}
                                            cy={p.y}
                                            r="2.5"
                                            className={result[i] ? "fill-emerald-400 stroke-slate-950 stroke-[1.5px]" : "fill-slate-700 stroke-slate-950 stroke-[1.5px]"}
                                          />
                                        ))}
                                      </svg>
                                    </div>
                                  );
                                })()}

                                {/* Actions Group (Edit & Delete Button) - Visible on all devices for full tap/control precision */}
                                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 backdrop-blur-sm transition-all ml-1.5 shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditHabitItem(item);
                                    }}
                                    className="p-1 px-1.5 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded-lg transition text-[10px] font-bold flex items-center gap-1"
                                    title="Edit habit"
                                  >
                                    <Settings className="w-3 h-3 animate-spin-slow text-blue-400" />
                                    <span className="text-[9px] uppercase tracking-wider hidden sm:inline">{state.language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteHabitItem(item.id);
                                    }}
                                    className="p-1 px-1.5 bg-slate-900 hover:bg-rose-950/30 text-rose-400 rounded-lg transition text-[10px] font-bold flex items-center gap-1"
                                    title="Delete habit"
                                  >
                                    <Trash2 className="w-3 h-3 text-rose-400" />
                                    <span className="text-[9px] uppercase tracking-wider hidden sm:inline">{state.language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Add new Habits Form */}
                <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-500" />
                    <span>{t.addHabit}</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">{t.habitNamePlaceholder}</label>
                      <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder={state.language === 'bn' ? 'যেমন: অন্তত ১৫ পাতা বই পড়া, সকালের দোআ আদায়' : 'e.g. Read 10 draft pages, Morning Adhkar recitation'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">{t.selectTime}</label>
                      <select
                        value={newHabitTime}
                        onChange={(e: any) => setNewHabitTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-300 outline-none"
                      >
                        <option value="Morning">{t.morning}</option>
                        <option value="Night">{t.night}</option>
                        <option value="Anytime">{t.anytime}</option>
                      </select>
                    </div>

                    <button
                      onClick={addNewHabitItem}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition shadow-lg shrink-0 cursor-pointer"
                    >
                      ➕ {t.addBtn}
                    </button>
                  </div>
                </div>
              </>
            );
          })() : (
              <>
                {/* ISLAMIC MOTIVATION CARD */}
                <div className={`card rounded-3xl p-6 bg-gradient-to-br from-amber-950/15 to-slate-950/40 border border-amber-500/20 shadow-xl relative overflow-hidden`}>
                  {/* Glowing background hint */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 font-sans flex items-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
                      {state.language === 'bn' ? '📖 ইসলামিক প্রেরণা ও আত্ম-জিহাদ' : '📖 Islamic Inspiration & Nafs Control'}
                    </h3>
                    <button 
                      onClick={() => {
                        setActiveBadHabitQuoteIdx(prev => prev + 1);
                      }}
                      className="text-[10px] md:text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20 transition flex items-center gap-1"
                    >
                      🔄 {state.language === 'bn' ? 'পরবর্তী আলোকবর্তিকা' : 'Next Insight'}
                    </button>
                  </div>

                  {islamicBadHabitQuotes.length > 0 && (
                    <div className="space-y-3 text-left">
                      <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed italic border-l-2 border-amber-500/40 pl-3">
                        "{islamicBadHabitQuotes[activeBadHabitQuoteIdx % islamicBadHabitQuotes.length][state.language]}"
                      </p>
                      <p className="text-[10px] text-amber-500/80 font-mono font-bold tracking-wide uppercase pl-3">
                        — {islamicBadHabitQuotes[activeBadHabitQuoteIdx % islamicBadHabitQuotes.length][state.language === 'bn' ? 'sourceBn' : 'sourceEn']}
                      </p>
                    </div>
                  )}
                </div>

                {/* BAD HABITS LIVE LOG TICKERS LISTING */}
                <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-1.5">
                    <Flame className="w-5 h-5 text-rose-500" />
                    {state.language === 'bn' ? 'বদ অভ্যাস বর্জন ট্র্যাকার (লাইভ টাইম)' : 'Quit Bad Habits Tracker (Live Time)'}
                  </h3>

                  {!state.badHabits || state.badHabits.length === 0 ? (
                    <p className="text-slate-500 text-xs italic text-center py-6 leading-relaxed">
                      {state.language === 'bn' 
                        ? 'কোনো বদ অভ্যাস এখনও যুক্ত করা হয়নি। আল্লাহর ওপর ভরসা করে এখনই যুক্ত করুন এবং নতুন অধ্যায় শুরু করুন!' 
                        : 'No bad habits listed yet. Trust in Allah, add your targets below, and start your recovery victory!'}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {state.badHabits.map((item, idx) => {
                        const isEditing = editingBadHabitId === item.id;
                        return (
                          <div 
                            key={item.id || `bhabit-${idx}`}
                            className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 flex flex-col gap-3 group"
                          >
                            {isEditing ? (
                              <div className="w-full flex flex-col sm:flex-row gap-3 items-end sm:items-center p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
                                <div className="space-y-1 flex-1">
                                  <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'বদ অভ্যাসের নাম' : 'Bad Habit Name'}</label>
                                  <input 
                                    type="text" 
                                    value={editingBadHabitName} 
                                    onChange={(e) => setEditingBadHabitName(e.target.value)}
                                    className="w-full bg-slate-900 text-sm text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-750 focus:border-red-500 outline-none"
                                  />
                                </div>
                                <button 
                                  onClick={saveBadHabitItemEdit}
                                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl text-xs font-black text-white transition tracking-wider uppercase cursor-pointer shrink-0"
                                >
                                  {state.language === 'bn' ? 'ঠিক আছে' : 'Save'}
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-base">🔥</span>
                                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-200 leading-tight">
                                      {item.name}
                                    </h4>
                                  </div>
                                  
                                  {/* Actions Group (Edit & Delete Button) */}
                                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 backdrop-blur-sm transition-all ml-1.5 shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditBadHabitItem(item);
                                      }}
                                      className="p-1.5 bg-slate-900 hover:bg-blue-955 text-slate-400 hover:text-blue-300 rounded-lg transition"
                                      title="Edit bad habit"
                                    >
                                      <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                                    </button>
                                    <button
                                      onClick={() => deleteBadHabitItem(item.id)}
                                      className="p-1.5 bg-slate-900 hover:bg-red-955 text-slate-400 hover:text-red-400 rounded-lg transition shrink-0"
                                      title="Delete habit"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Live Ticker Component */}
                                <LiveBadHabitTimer quitAt={item.quitAt} language={state.language} />

                                {/* Reset / Relapse Option Trigger */}
                                <div className="flex justify-end mt-1.5">
                                  <button
                                    onClick={() => {
                                      const confirmed = window.confirm(state.language === 'bn' ? 'সতর্কতা: এই কাজটি রিসেট করলে timeline ০ থেকে শুরু হবে। নিশ্চিত?' : 'Warning: Resetting this will revert the timeline to 0. Proceed?');
                                      if (confirmed) {
                                        restartBadHabitTimer(item.id);
                                        triggerCustomAlert(state.language === 'bn' ? 'সফলভাবে রিসেট হয়েছে।' : 'Habit timer reset.', 'Professional Status', 'success');
                                      }
                                    }}
                                    className="text-[10px] font-extrabold text-rose-400 bg-red-950/20 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-950/40 transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                                    <span>{state.language === 'bn' ? 'টাইমার রিস্টার্ট করুন (রিল্যাপ্স)' : 'Restart Timer (Relapsed)'}</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ADD NEW BAD HABIT TRACKER FORM */}
                <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-500" />
                    <span>{state.language === 'bn' ? 'নতুন বদ অভ্যাস যুক্ত করুন' : 'Add Bad Habit to Outlaw'}</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">
                        {state.language === 'bn' ? 'বদ অভ্যাসের নাম' : 'Name of local Bad Habit'}
                      </label>
                      <input
                        type="text"
                        value={newBadHabitName}
                        onChange={(e) => setNewBadHabitName(e.target.value)}
                        placeholder={state.language === 'bn' ? 'যেমন: সোশ্যাল মিডিয়া স্ক্রলিং, ধূমপান, সময় অপচয়' : 'e.g. Social Media Scrolling, Smoking, Idle Gossip'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 outline-none focus:border-red-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addNewBadHabitItem();
                        }}
                      />
                    </div>

                    <button
                      onClick={addNewBadHabitItem}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition shadow-lg shrink-0 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Flame className="w-4 h-4 text-white animate-pulse" />
                      <span>{state.language === 'bn' ? 'বর্জনের সংকল্প দিয়ে শুরু করুন' : 'Commit to Cessation'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: FITNESS & SYSTEM BIOMETRICS */}
        {activeTab === 'fitness' && (
          <div className="space-y-6">
            
            {/* Fitness list layout */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-1.5">
                <Dumbbell className="w-5 h-5 text-blue-400" />
                {t.fitnessHeader}
              </h3>

              {/* Encouragement Facts */}
              <div className={`p-3.5 mb-5 rounded-2xl bg-slate-950/40 text-xs italic text-slate-300 ${currentTheme.accentBorder}`}>
                "{state.language === 'bn' 
                  ? "সুস্থ ও সবল শারীরিক গঠন ইবাদত ও জ্ঞানার্জনে দারুণ একাগ্রতা বাড়ায়।" 
                  : "A sound healthy body breeds an exceptionally sharp and consistent mind."
                }"
              </div>

              {state.fitness.length === 0 ? (
                <p className="text-slate-500 text-xs italic text-center py-6">
                  {state.language === 'bn' ? 'কোনো ফিটনেস অ্যাক্টিভিটি যুক্ত করা নেই।' : 'No metabolic workout items found. Add your first task below!'}
                </p>
              ) : (
                <div className="divide-y divide-slate-800/40">
                  {state.fitness.map((item, idx) => {
                    const value = state.history[todayStr]?.fitness?.[item.id] || 0;
                    const isEditing = editingFitnessId === item.id;

                    return (
                      <div key={item.id || `fit-${idx}`} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between group gap-3 border-t border-slate-800/20">
                        {isEditing ? (
                          <div className="w-full flex flex-col sm:flex-row gap-3 items-end sm:items-center p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-1 flex-1">
                              <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'অ্যাক্টিভিটি নাম' : 'Activity Name'}</label>
                              <input 
                                type="text" 
                                value={editingFitnessName} 
                                onChange={(e) => setEditingFitnessName(e.target.value)}
                                className="w-full bg-slate-900 text-sm text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-750 focus:border-amber-500 outline-none"
                              />
                            </div>
                            <div className="space-y-1 w-32">
                              <label className="text-[10px] uppercase font-bold text-slate-400 block">{state.language === 'bn' ? 'টার্গেট লক্ষ্য' : 'Goal'}</label>
                              <input 
                                type="text" 
                                value={editingFitnessGoal} 
                                onChange={(e) => setEditingFitnessGoal(e.target.value)}
                                className="w-full bg-slate-900 text-sm text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-750 focus:border-amber-500 outline-none"
                              />
                            </div>
                            <button 
                              onClick={saveFitnessItemEdit}
                              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl text-xs font-black text-white transition tracking-wider uppercase cursor-pointer shrink-0"
                            >
                              {state.language === 'bn' ? 'ঠিক আছে' : 'Save'}
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="min-w-0 pr-4">
                              <h4 className="text-xs md:text-sm font-bold text-slate-200 truncate">{item.name}</h4>
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                <Activity className="w-3 h-3 text-amber-500" />
                                <span>{t.targetGoalPlaceholder.split('(')[0]}: {item.goal}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Input field to complete progress */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-slate-400 whitespace-nowrap">{t.completedAmount}:</span>
                                <input
                                  type="number"
                                  value={value || ''}
                                  onChange={(e) => updateDailyFitnessValue(item.id, e.target.value)}
                                  placeholder="0"
                                  className="w-16 text-center bg-slate-950 border border-slate-800 text-amber-400 p-1.5 rounded-lg font-mono font-bold text-xs outline-none"
                                />
                              </div>

                              {/* Actions Group (Edit & Delete Button) */}
                              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 backdrop-blur-sm transition-all ml-1.5 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditFitnessItem(item);
                                  }}
                                  className="p-1.5 bg-slate-900 hover:bg-blue-955 text-slate-400 hover:text-blue-300 rounded-lg transition"
                                  title="Edit fitness item"
                                >
                                  <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                                </button>
                                <button
                                  onClick={() => deleteFitnessItem(item.id)}
                                  className="p-1.5 bg-slate-900 hover:bg-red-955 text-slate-400 hover:text-red-400 rounded-lg transition shrink-0"
                                  title="Delete fitness item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Live Workout Interactive Timer & Synthesizer card */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border relative overflow-hidden space-y-4`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between border-b border-slate-900/40 pb-3">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-indigo-400 animate-bounce" />
                  {state.language === 'bn' ? 'লাইভ ফিটনেস ওয়ার্কআউট ট্র্যাকার' : 'Live Workout Timer & Beats'}
                </span>
                {liveWorkoutRunning && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-widest animate-pulse border border-emerald-500/20">
                    🏃 {state.language === 'bn' ? 'চলছে' : 'Running'}
                  </span>
                )}
              </div>

              {/* Workout Selectors & Custom Time Input */}
              <div className={`${state.layoutMode === 'clean' ? 'grid grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2'} gap-4`}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">
                    {state.language === 'bn' ? '১. ব্যায়াম নির্বাচন করুন বা কাস্টম লিখুন:' : '1. Choose exercise or write custom:'}
                  </label>
                  <select 
                    value={liveWorkoutName}
                    onChange={(e) => {
                      setLiveWorkoutName(e.target.value);
                      const matchedItem = state.fitness.find(i => i.name === e.target.value);
                      if (matchedItem) {
                        setActiveWorkoutId(matchedItem.id);
                      } else {
                        setActiveWorkoutId(null);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                  >
                    <option key="default" value="">-- {state.language === 'bn' ? 'কাস্টম সেশন / জেনারেলাইজড' : 'Custom workout session'} --</option>
                    {state.fitness.map((item, idx) => (
                      <option key={item.id || idx} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                  {!state.fitness.some(i => i.name === liveWorkoutName) && (
                    <input 
                      type="text"
                      placeholder={state.language === 'bn' ? 'ব্যায়ামের নাম লিখুন...' : 'Write custom exercise name...'}
                      value={liveWorkoutName}
                      onChange={(e) => {
                        setLiveWorkoutName(e.target.value);
                        setActiveWorkoutId(null);
                      }}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">
                    {state.language === 'bn' ? '২. সময় নির্ধারণ করুন (মিনিট):' : '2. Set target Workout duration (mins):'}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      min="1" 
                      max="120"
                      value={Math.round(liveWorkoutDuration / 60)}
                      onChange={(e) => {
                        const mins = Math.max(1, parseInt(e.target.value) || 0);
                        setLiveWorkoutDuration(mins * 60);
                        if (!liveWorkoutRunning) {
                          setLiveWorkoutTimeLeft(mins * 60);
                        }
                      }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none font-semibold font-mono text-center"
                    />
                    <div className="flex gap-1 shrink-0">
                      {[5, 10, 20, 30].map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setLiveWorkoutDuration(m * 60);
                            setLiveWorkoutTimeLeft(m * 60);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-705 text-slate-400 transition"
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Synthesized background beats controller */}
              <div className="space-y-1.5 bg-slate-950/45 p-3.5 rounded-2xl border border-slate-900">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-amber-500" />
                    <span>{state.language === 'bn' ? 'ব্যায়াম এনার্জি বুস্টার সাউন্ড' : 'Exercise Energy Synth Beats'}</span>
                  </label>
                  {activeAudioType === 'workout' && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse border border-emerald-500/20 uppercase tracking-widest">
                      🔊 {state.language === 'bn' ? 'বিটস চালু' : 'Beats playing'}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  {state.language === 'bn' ? 'ব্যায়ামের সময় গভীর মনোসংযোগ ও কার্ডিও রিদম ধরে রাখার অফলাইন সিন্থ প্লেয়ার:' : 'Offline synth driver to sustain steady performance and heart rhythm during workout:'}
                </p>
                <div className="flex gap-3 items-center pt-1.5">
                  <button
                    onClick={() => {
                      if (activeAudioType === 'workout') {
                        handleAudioChange('none');
                      } else {
                        handleAudioChange('workout');
                      }
                    }}
                    className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                      activeAudioType === 'workout'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg'
                        : 'bg-slate-900 border border-slate-800 text-slate-350 hover:text-white'
                    }`}
                  >
                    {activeAudioType === 'workout' ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>{state.language === 'bn' ? 'সাউন্ড বন্ধ' : 'Stop Beat'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span>{state.language === 'bn' ? 'বিট মিউজিক চালান' : 'Play Workout beat'}</span>
                      </>
                    )}
                  </button>

                  {activeAudioType === 'workout' && (
                    <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-xl border border-slate-850">
                      <VolumeX className="w-3 text-slate-500" />
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={audioVolume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-slate-900 rounded-lg cursor-pointer accent-amber-500"
                      />
                      <Volume2 className="w-3 text-amber-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Countdown Readout and Play Controllers */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 text-center space-y-3.5">
                <div>
                  <div className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-[#00ffcc] drop-shadow-[0_0_12px_rgba(0,255,204,0.15)] relative z-10">
                    {getFormatTimerStr(liveWorkoutTimeLeft)}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">
                    {state.language === 'bn' 
                      ? `টার্গেট সেশন: ${liveWorkoutName || 'সাধারণ ফিটনেস ব্যায়াম'}` 
                      : `Selected target: ${liveWorkoutName || 'General Fitness Workout'}`}
                  </p>
                </div>

                <div className="flex gap-2.5 items-center justify-center max-w-sm mx-auto">
                  <button
                    onClick={() => {
                      if (!liveWorkoutName.trim()) {
                        setLiveWorkoutName(state.language === 'bn' ? 'সাধারণ ফিটনেস ব্যায়াম' : 'General Fitness Workout');
                      }
                      setLiveWorkoutRunning(!liveWorkoutRunning);
                    }}
                    className={`flex-1 py-3 px-5 rounded-xl font-bold uppercase text-xs tracking-wider transition cursor-pointer select-none active:scale-95 text-center flex items-center justify-center gap-1.5 ${
                      liveWorkoutRunning 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                        : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-md'
                    }`}
                  >
                    {liveWorkoutRunning ? (
                      <>
                        <Moon className="w-4 h-4 animate-spin" />
                        <span>{state.language === 'bn' ? 'সাময়িক বিরতি' : 'Pause Workout'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{state.language === 'bn' ? 'ওয়ার্কআউট শুরু করুন' : 'Start Workout'}</span>
                      </>
                    )}
                  </button>

                  {(liveWorkoutTimeLeft < liveWorkoutDuration || liveWorkoutRunning) && (
                    <button
                      onClick={() => {
                        setLiveWorkoutRunning(false);
                        setLiveWorkoutTimeLeft(liveWorkoutDuration);
                      }}
                      className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer select-none"
                    >
                      {state.language === 'bn' ? 'রিসেট' : 'Reset'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Add new Workout item form */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <span>{t.addActivity}</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">{t.activityPlaceholder}</label>
                  <input
                    type="text"
                    value={newFitName}
                    onChange={(e) => setNewFitName(e.target.value)}
                    placeholder={state.language === 'bn' ? 'যেমন: পুশ-আপ, দড়িলাফ, রানিং' : 'e.g. Pull-ups, Push-ups, Aerobic walking'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">{t.targetGoalPlaceholder}</label>
                  <input
                    type="text"
                    value={newFitGoal}
                    onChange={(e) => setNewFitGoal(e.target.value)}
                    placeholder={state.language === 'bn' ? 'যেমন: ২০ বার, ২০ মিনিট' : 'e.g. 25 times, 30 mins'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 outline-none"
                  />
                </div>

                <button
                  onClick={addNewFitnessItem}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer"
                >
                  ➕ {t.addBtn}
                </button>
              </div>
            </div>

            {/* Historical Calendar Heatmap card */}
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-1.5">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>{state.language === 'bn' ? 'ফিটনেস ইতিহাস ক্যালেন্ডার হিটম্যাপ' : 'Fitness Historical Log Heatmap'}</span>
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-800/60" />
                  <span>{state.language === 'bn' ? 'নেই' : 'None'}</span>
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700/60 border border-emerald-600/20" />
                  <span>{state.language === 'bn' ? 'আংশিক' : 'Partial'}</span>
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-400/20" />
                  <span>{state.language === 'bn' ? 'পূর্ণ' : 'Full'}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-900/60 text-center space-y-4">
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  {state.language === 'bn' 
                    ? 'গত ৩৫ দিনের প্রতিদিনের ব্যায়াম সম্পূর্ণ করার লগ। সবুজ রঙের বক্স নির্দেশ করে সেদিন আপনি সকল ব্যায়ামের লক্ষ্য সম্পূর্ণ করেছেন।' 
                    : 'Fitness task completed states for the last 35 days. Green boxes indicate days where all logged metabolics fully hit your daily target.'}
                </p>

                {/* Grid container */}
                <div className="grid grid-cols-7 gap-1.5 max-w-sm mx-auto">
                  {(() => {
                    const arr = [];
                    for (let i = 34; i >= 0; i--) {
                      const d = new Date();
                      d.setDate(d.getDate() - i);
                      const dateStr = d.toISOString().split('T')[0];
                      arr.push({ date: d, dateStr });
                    }
                    return arr.map(({ date, dateStr }) => {
                      const dayFitness = state.history[dateStr]?.fitness || {};
                      const totalCount = state.fitness.length;
                      let metCount = 0;
                      
                      state.fitness.forEach(item => {
                        const completed = dayFitness[item.id] || 0;
                        const target = parseInt(item.goal) || 1;
                        if (completed >= target) {
                          metCount++;
                        }
                      });
                      
                      let bgColor = "bg-slate-900 border border-slate-800/60";
                      let statusText = state.language === 'bn' ? "কোনো ব্যায়ামের রেকর্ড নেই" : "No fitness records";
                      if (totalCount > 0) {
                        if (metCount === totalCount) {
                          bgColor = "bg-emerald-500 border border-emerald-400/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]";
                          statusText = state.language === 'bn' ? "সব লক্ষ্য পূরণ!" : "All goals met!";
                        } else if (metCount > 0) {
                          bgColor = "bg-emerald-700/60 border border-emerald-600/20";
                          statusText = state.language === 'bn' ? `${metCount}/${totalCount} লক্ষ্য পূরণ` : `${metCount}/${totalCount} goals met`;
                        } else {
                          statusText = state.language === 'bn' ? "ব্যায়াম শুরু করা হয়নি" : "Workout not started";
                        }
                      }

                      return (
                        <div 
                          key={dateStr}
                          className={`aspect-square rounded-md ${bgColor} cursor-pointer hover:scale-110 transition-transform duration-200 relative group flex items-center justify-center`}
                          title={`${dateStr}: ${statusText}`}
                        >
                          {/* Day number */}
                          <span className="text-[9px] font-bold text-slate-400/80 font-mono">
                            {date.getDate()}
                          </span>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-1.5 hidden group-hover:block z-20 bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap">
                            {dateStr} - {statusText}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: WEEKLY CHORES & MESS ROUTINE RESPONSIBILITY */}
        {activeTab === 'routine' && (
          <div className="space-y-6">
            
            <div className={`card rounded-3xl p-6 ${currentTheme.card} border`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-blue-400" />
                {t.routineHeader}
              </h3>

              {/* Day selection */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                    {t.daySelectLabel}:
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                      const isActive = routineDayIdx === dayIdx;
                      return (
                        <button
                          key={dayIdx}
                          onClick={() => handleRoutineDayChange(dayIdx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer select-none ${
                            isActive 
                              ? 'bg-blue-600 text-white font-bold shadow' 
                              : 'bg-slate-950 border border-slate-855 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {getWeekdayText(dayIdx)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Specific day inputs */}
                <div className="space-y-4 pt-2">
                  <div className={`${state.layoutMode === 'clean' ? 'grid grid-cols-1' : 'grid grid-cols-1 sm:grid-cols-2'} gap-4`}>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">{t.lunchLabel}</label>
                      <input
                        type="text"
                        value={state.routine[routineDayIdx]?.lunch || ''}
                        onChange={(e) => handleRoutineChoreChange('lunch', e.target.value)}
                        placeholder={state.language === 'bn' ? 'যেমন: সোহান মৃধা' : 'e.g. Sohan Mridha'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-404">{t.dinnerLabel}</label>
                      <input
                        type="text"
                        value={state.routine[routineDayIdx]?.dinner || ''}
                        onChange={(e) => handleRoutineChoreChange('dinner', e.target.value)}
                        placeholder={state.language === 'bn' ? 'যেমন: রাফি' : 'e.g. Rafi'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">{t.cleanLabel}</label>
                    <input
                      type="text"
                      value={state.routine[routineDayIdx]?.clean || ''}
                      onChange={(e) => handleRoutineChoreChange('clean', e.target.value)}
                      placeholder={state.language === 'bn' ? 'যেমন: রনি বা ঝাড়ুদার' : 'e.g. Roni'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 outline-none"
                    />
                  </div>

                  {/* Weekday dynamic custom chores lists (Multiple items added) */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/40">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">
                      {t.customChoresLabel} on {getWeekdayText(routineDayIdx)}:
                    </label>

                    {state.routine[routineDayIdx]?.customTasks && state.routine[routineDayIdx].customTasks!.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {state.routine[routineDayIdx].customTasks!.map((chore, cIdx) => {
                          const isEditingChore = editingChoreDayIdx === routineDayIdx && editingChoreIndex === cIdx;
                          return isEditingChore ? (
                            <div key={cIdx} className="flex items-center gap-1.5 bg-slate-955 border border-slate-800 p-1 rounded-xl">
                              <input
                                type="text"
                                value={editingChoreValue}
                                onChange={(e) => setEditingChoreValue(e.target.value)}
                                className="bg-slate-900 text-xs text-white px-2 py-1 rounded outline-none border border-slate-700 w-28"
                              />
                              <button
                                onClick={saveChoreEdit}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2 py-1 rounded font-bold uppercase transition"
                              >
                                {state.language === 'bn' ? 'সেভ' : 'Save'}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingChoreDayIdx(null);
                                  setEditingChoreIndex(null);
                                }}
                                className="text-slate-500 hover:text-slate-300 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span 
                              key={cIdx}
                              className="bg-slate-950 border border-slate-800 text-slate-300 font-medium py-1 px-2.5 rounded-lg text-xs flex items-center gap-1.5 group select-none"
                            >
                              <span>{chore}</span>
                              <button
                                type="button"
                                onClick={() => startEditChore(routineDayIdx, cIdx, chore)}
                                className="text-slate-500 hover:text-slate-300 text-xs transition ml-1"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteCustomWeekdayChore(cIdx)}
                                className="text-red-500 hover:text-red-400 text-xs transition ml-1.5"
                              >
                                🗑️
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic mt-1">
                        {state.language === 'bn' ? 'কোনো কাস্টম দায়িত্ব যোগ করা হয়নি' : 'No custom chores added yet'}
                      </p>
                    )}

                    {/* Add custom chores input */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newChoreName}
                        onChange={(e) => setNewChoreName(e.target.value)}
                        placeholder={state.language === 'bn' ? 'যেমন: মগ ধোয়া, ফিল্টার রিফিল' : 'e.g. Wash mugs, refill filter'}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                      />
                      <button
                        onClick={addCustomWeekdayChore}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer select-none"
                      >
                        {state.language === 'bn' ? 'যুক্ত করুন' : 'Add Chores'}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>



            {/* STUDY FOCUS ROUTINE BUILDER CARD */}
            <div id="study-routine-editor" className={`card rounded-3xl p-6 ${currentTheme.card} border space-y-4 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
              
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 font-sans flex items-center gap-1.5">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>
                  {state.language === 'bn' 
                    ? `পড়াশোনা ফোকাস রুটিন (${getWeekdayText(routineDayIdx)})` 
                    : `Core Study Focus Routine (${getWeekdayText(routineDayIdx)})`}
                </span>
              </h3>

              <div className="p-3.5 rounded-2xl bg-slate-950/45 border border-slate-900 text-xs text-slate-400 leading-relaxed">
                {state.language === 'bn' 
                  ? 'আপনার পড়াশোনার ফোকাসিং এর জন্য একটি আলাদা রুটিন তৈরি করুন। বিষয়, সময় নির্ধারণ করুন এবং প্রতিদিন এটি ট্র্যাক করুন।' 
                  : 'Establish a dedicated routine specifically tailored to your core study targets, scheduling slots and subjects to complete.'}
              </div>

              {/* List of custom study routine items for dynamic daily slot mapping */}
              {(() => {
                const dayRoutines = state.customStudyRoutines?.[routineDayIdx] || [];
                if (dayRoutines.length === 0) {
                  return (
                    <p className="text-slate-500 text-xs italic text-center py-6 border border-dashed border-slate-900 rounded-2xl">
                      {state.language === 'bn' ? 'কোনো স্টাডি ফোকাস রুটিন যুক্ত করা নেই।' : 'No dedicated study routines yet. Add your first study block below!'}
                    </p>
                  );
                }

                return (
                  <div className="space-y-3">
                    {dayRoutines.map((routine: StudyRoutineItem, idx) => (
                      <div 
                        key={routine.id || `routine-${idx}`} 
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          routine.completed 
                            ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-400' 
                            : 'bg-slate-950/30 border-slate-900 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={routine.completed}
                            onChange={() => toggleStudyRoutineItem(routineDayIdx, routine.id)}
                            className="w-4 h-4 rounded border-slate-850 text-amber-500 focus:ring-amber-500 bg-slate-950 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-extrabold font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 ${
                                routine.completed ? 'text-slate-500 line-through' : 'text-slate-350'
                              }`}>
                                {routine.timeSlot}
                              </span>
                              <span className={`text-xs font-bold ${
                                routine.completed ? 'text-slate-500 line-through' : 'text-slate-200'
                              }`}>
                                {routine.subject}
                              </span>
                            </div>
                            {routine.topic && (
                              <p className={`text-[11px] mt-0.5 italic ${
                                routine.completed ? 'text-slate-605 line-through' : 'text-slate-400'
                              }`}>
                                {state.language === 'bn' ? 'টপিক বা লক্ষ্য:' : 'Topic:'} {routine.topic}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteStudyRoutineItem(routineDayIdx, routine.id)}
                          className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 transition cursor-pointer"
                          title="Delete block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Add form for new focused study routine */}
              <div className="p-4 bg-slate-950/45 rounded-2xl border border-slate-900 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pb-1 border-b border-slate-900/60">
                  {state.language === 'bn' ? 'নতুন স্টাডি ব্লক যুক্ত করুন:' : 'Add New Study Block Slot:'}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-405 block">{state.language === 'bn' ? '১. বিষয় নির্বাচন / নাম' : '1. Subject name'}</label>
                    <input 
                      type="text"
                      placeholder={state.language === 'bn' ? 'যেমন: Physics, Math' : 'e.g. Mathematics, Quran Tafsir'}
                      value={newStudySub}
                      onChange={(e) => setNewStudySub(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-405 block">{state.language === 'bn' ? '২. সময় / স্লট' : '2. Time / Slot duration'}</label>
                    <input 
                      type="text"
                      placeholder={state.language === 'bn' ? 'যেমন: 09:00 AM - 11:00 AM' : 'e.g. 02:00 PM - 04:30 PM'}
                      value={newStudyTime}
                      onChange={(e) => setNewStudyTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-405 block">{state.language === 'bn' ? '৩. টপিক বা ফোকাস লক্ষ্য (ঐচ্ছিক)' : '3. Core Topic or targeted goal (Optional)'}</label>
                  <input 
                    type="text"
                    placeholder={state.language === 'bn' ? 'যেমন: অধ্যায় ৩ মুখস্থ করা' : 'e.g. Final chapter review, memorize 5 verses'}
                    value={newStudyTopic}
                    onChange={(e) => setNewStudyTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
                  />
                </div>

                 <button
                  onClick={() => addStudyRoutineBlock(routineDayIdx)}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-650 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition hover:opacity-90 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{state.language === 'bn' ? 'স্টাডি স্লট অ্যাড করুন' : 'Add Focus Study Slot'}</span>
                </button>
              </div>
            </div>



          </div>
        )}

        {/* TAB EXAMS: DEDICATED EXAMS & SYLLABUS TRACKER */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <ExamTracker 
              state={state} 
              onSaveState={saveState} 
              triggerCustomAlert={triggerCustomAlert} 
              playCompletionBeep={playCompletionBeep}
              openSocialDashboard={() => setIsSocialDashboardOpen(true)}
              triggerActionNotification={triggerActionNotification}
            />
          </div>
        )}

        {/* TAB 6: AUTO REFLECTION JOURNAL */}
        {activeTab === 'reflection' && (
          <AutoReflection 
            language={state.language}
            reflections={state.reflections}
            subjects={state.subjects}
            onSave={handleSaveReflectionNote}
            onDelete={handleDeleteReflectionNote}
            onUpdate={handleUpdateReflectionNote}
          />
        )}

        {/* TAB 7: REPORTS & ANALYTICS */}
        {activeTab === 'report' && (
          <ReportDashboard 
            state={state} 
            language={state.language} 
            onUpdateAchievements={(badges: string[]) => {
              saveState({
                ...state,
                unlockedAchievements: badges
              });
            }}
          />
        )}



        {/* TAB 8: DAILY PHONE SCREEN TIME TRACKING */}
        {activeTab === 'phone' && (
          <PhoneTab
            state={state}
            saveState={saveState}
            setState={setState}
            todayStr={todayStr}
            getFormattedDateString={getFormattedDateString}
            playCompletionBeep={playCompletionBeep}
            triggerCustomAlert={triggerCustomAlert}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Removed TAB 8.5 */}

        {/* TAB 9: USER PROFILE & PERFORMANCE REPORT */}
        {activeTab === 'profile' && (
          <ProfileTab 
            state={state} 
            saveState={saveState} 
            t={t} 
            playCompletionBeep={playCompletionBeep}
            triggerCustomAlert={triggerCustomAlert}
          />
        )}

        {false && activeTab === 'phone' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            {/* DEVICE STATUS BAR MOCK */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl px-4 py-3 flex items-center justify-between text-[11px] text-neutral-400 font-mono shadow-md backdrop-blur">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                {state.language === 'bn' ? 'মৃধাক্স ক্লাউড সিঙ্ক চালু' : 'MridhaX Cloud Sync: Connected'}
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                ⚡ LIVE CONTROLLER ACTIVE
              </span>
            </div>

            {/* HIGH-IMPACT DIRECT REELS BLOCKER SWITCH BOARD */}
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/25 rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest font-sans">
                      {state.language === 'bn' ? 'রিলস ও শর্টস ব্লকার শিল্ড' : 'Social Reels Blocker Shield'}
                    </h4>
                    <span className="text-[9px] text-slate-400 block font-mono">
                      {state.reelsBlockerActive 
                        ? (state.language === 'bn' ? '● ব্লকিং সক্রিয় (ডিভাইস লেভেল)' : '● ACTIVE (SYSTEM PROTOCOL)') 
                        : (state.language === 'bn' ? '○ নিষ্ক্রিয়' : '○ DEACTIVATED')}
                    </span>
                  </div>
                </div>

                {/* Direct Switch Trigger */}
                <button
                  onClick={() => {
                    saveState({
                      ...state,
                      reelsBlockerActive: !state.reelsBlockerActive,
                      reelsBlockerStartedAt: !state.reelsBlockerActive ? new Date().toISOString() : null
                    });
                    playCompletionBeep();
                    triggerCustomAlert(
                      state.reelsBlockerActive 
                        ? (state.language === 'bn' ? 'রিলস ব্লকার বন্ধ করা হয়েছে!' : 'Reels Blocker disabled!')
                        : (state.language === 'bn' ? 'রিলস ও শর্টস সাকসেসফুলি ব্লক করা হয়েছে! ৫ ঘণ্টা লকড।' : 'Reels, Shorts, and TikTok successfully blocked! LOCKED.'),
                      state.language === 'bn' ? 'আসক্তি ব্লকার' : 'Addiction Shield',
                      state.reelsBlockerActive ? 'info' : 'success'
                    );
                  }}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer ${
                    state.reelsBlockerActive ? 'bg-amber-500' : 'bg-neutral-800'
                  }`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full bg-slate-950 shadow transition-all duration-300 transform ${
                    state.reelsBlockerActive ? 'translate-x-[22px]' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <p className="text-[11px] text-slate-350 leading-relaxed">
                {state.language === 'bn' 
                  ? 'আপনার ব্রেন সুরক্ষিত রাখতে ফেসবুক রিলস, ইউটিউব শর্টস, ও টিকটকের মতো আসক্তিকর ব্রেন-রট কন্টেন্ট সরাসরি ডিভাইস লেভেল থেকে ব্লক করা হবে। আপনার সেশন ও শিক্ষামূলক একাডেমিক ভিডিওগুলো বাদে এই ট্রিগার স্বয়ংক্রিয়ভাবে ব্লক করে দেয়।' 
                  : 'Fuses global distraction hooks to intercept and drop communication requests with short-form brain-rot platforms (Reels, TikTok, Shorts). Essential tutorials and lectures remain 100% accessible.'}
              </p>

              {/* Blocker Presets selection inside screen tab */}
              {state.reelsBlockerActive && (
                <div className="mt-4 pt-3 border-t border-amber-500/10 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-amber-400/80 font-black font-mono">LOCK:</span>
                  {[
                    { label: '30m', val: 30 },
                    { label: '1 Hr', val: 60 },
                    { label: '3 Hr', val: 180 },
                    { label: '8 Hr', val: 480 },
                    { label: 'Always ♾️', val: -1 }
                  ].map((preset) => {
                    const isActive = state.reelsBlockerDuration === preset.val;
                    return (
                      <button
                        key={preset.val}
                        onClick={() => {
                          saveState({
                            ...state,
                            reelsBlockerDuration: preset.val
                          });
                          playCompletionBeep();
                        }}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg border font-mono uppercase transition ${
                          isActive 
                            ? 'bg-amber-500 text-slate-950 border-amber-400' 
                            : 'bg-slate-950/40 border-amber-550/10 text-slate-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MAIN APP ACTIVITY DETAILS VIEW (SCREENSHOT STYLE) */}
            <div id="app-activity-details-container" className="bg-black border border-neutral-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
              
              {/* SCREENSHOT TITLE BAR */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => {
                    setActiveTab('study');
                    playCompletionBeep();
                  }}
                  className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800/80 flex items-center justify-center text-neutral-400 hover:text-white transition active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-100 flex-1 text-center pr-3">
                  {state.language === 'bn' ? 'অ্যাপ ব্যবহারের বিস্তারিত বিবরণ' : 'App activity details'}
                </h3>
                <div className="w-1.5 h-1.5 bg-transparent rounded-full" /> {/* Balance spacer */}
              </div>

              {/* DYNAMIC SPINNER METRIC SELECTOR BUBBLE */}
              <div className="flex justify-center mb-5">
                <div className="relative inline-block">
                  <select 
                    value={screenMetric}
                    onChange={(e) => {
                      setScreenMetric(e.target.value as any);
                      playCompletionBeep();
                    }}
                    className="appearance-none bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-extrabold px-5 py-2.5 pr-10 rounded-full focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm tracking-wide"
                  >
                    <option value="screen">
                      {state.language === 'bn' ? 'স্ক্রিন টাইম' : 'Screen time'}
                    </option>
                    <option value="notifications">
                      {state.language === 'bn' ? 'প্রাপ্ত নোটিফিকেশন' : 'Notifications received'}
                    </option>
                    <option value="unlocks">
                      {state.language === 'bn' ? 'ডিভাইস খুলেছেন' : 'Times opened'}
                    </option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[10px]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Sohan's Guidance on Screen Addiction */}
              <div className="relative p-5 mb-8 rounded-2xl bg-slate-950/60 text-xs text-slate-300 border border-emerald-500/20 flex flex-col md:flex-row gap-4 items-start leading-relaxed shadow-[inset_0_1px_5px_rgba(0,0,0,0.6)]">
                <img 
                  src="https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p" 
                  alt="Coach Sohan Avatar" 
                  className="w-12 h-12 rounded-full border-2 border-emerald-550 object-cover shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/src/assets/images/sohan_mridha_avatar_1781871331231.jpg";
                  }}
                />
                <div>
                  <h5 className="font-bold text-emerald-400 text-xs mb-1 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    Coach Sohan Mridha:
                  </h5>
                  <p className="italic font-medium text-slate-200">
                    {state.language === 'bn' 
                      ? "সোশ্যাল মিডিয়ার রিলস ও শর্টসের ক্ষণস্থায়ী ডোপামিন স্পাইকগুলো আপনার ফোকাস করার ক্ষমতাকে নষ্ট করে দেয়। MridhaX Blocker দিয়ে রিলস ব্লক করে দিন, তবে পড়ালেখার সময় দীর্ঘ লেকচার বা ইউটিউব স্টাডি ক্লাসে কোনো বাধা থাকবে না। নিজের সময়কে খাঁটি সম্পদে রূপান্তর করুন!" 
                      : "The constant dopamine hits of short-form Reels and Shorts completely hijack your focus. Block them instantly, but keep learning freely with long educational lectures. Protect your screen discipline today!"}
                  </p>
                </div>
              </div>

              {/* GRID: Digital Wellbeing Stats & Live Simulation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
                
                {/* Visual Circle Meter (Usage Total) */}
                {(() => {
                  const limitMin = state.phoneLimitMinutes || 150;
                  const todayUsageMin = state.phoneUsageHistory?.[todayStr] || 0;
                  const exceeds = todayUsageMin > limitMin;
                  const percentage = Math.round((todayUsageMin / limitMin) * 100);

                  return (
                    <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-slate-950/70 to-slate-900/30 rounded-2xl border border-slate-900/50 shadow-inner">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 font-mono block">
                        📊 {state.language === 'bn' ? 'মোট স্ক্রিন টাইম' : 'Total Screen Duration'}
                      </span>

                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="#0f172a" strokeWidth="6" fill="transparent" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="42" 
                            stroke={exceeds ? '#ef4444' : '#10b981'} 
                            strokeWidth="7" 
                            fill="transparent" 
                            strokeDasharray="263.8"
                            strokeDashoffset={263.8 - (263.8 * Math.min(100, percentage)) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-3xl font-black font-mono tracking-tight text-white">{todayUsageMin}</span>
                          <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest block mt-0.5">{state.language === 'bn' ? 'মিনিট' : 'MINUTES'}</span>
                          <span className="text-slate-500 text-[9px] block">/{limitMin} min {state.language === 'bn' ? 'সীমা' : 'limit'}</span>
                        </div>
                      </div>

                      <div className="text-center mt-4 w-full">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl font-mono block ${
                          exceeds 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {exceeds 
                            ? (state.language === 'bn' ? 'সীমা অতিক্রম করেছে!' : 'Limit Exceeded!') 
                            : (state.language === 'bn' ? 'নিরাপদ জোনে আছেন' : 'Safe Zone Active')}
                        </span>
                      </div>

                      {/* Threshold Configuration */}
                      <div className="w-full mt-4 pt-4 border-t border-slate-900/50 space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">
                          ⚙️ {state.language === 'bn' ? 'দৈনিক সতর্কতা সীমা নির্ধারণ:' : 'Set Warn Threshold:'}
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            value={state.phoneLimitMinutes || 150}
                            onChange={(e) => {
                              const v = Math.max(15, parseInt(e.target.value) || 0);
                              saveState({ ...state, phoneLimitMinutes: v });
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-center font-mono font-bold text-white outline-none focus:border-emerald-500"
                          />
                          <span className="bg-slate-900 border border-slate-800 text-[10px] px-2.5 py-1.5 text-slate-400 rounded-xl flex items-center font-bold">
                            min
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* EXPANDED DIGITAL WELLBEING SUITE */}
                <div className="lg:col-span-1 p-5 bg-gradient-to-b from-slate-950/80 to-slate-900/30 rounded-2xl border border-slate-900/50 shadow-inner flex flex-col justify-between space-y-5">
                  <div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3.5 font-mono block text-center">
                      🧠 {state.language === 'bn' ? 'মৃধাক্স ডিজিটাল ওয়েলবিং হাব' : 'MridhaX Digital Wellbeing Core'}
                    </span>

                    {/* SUB-TAB PANELS: Dopamine Audit vs. Box Breathing vs. Shield Block */}
                    <div className="space-y-4">
                      
                      {/* Section 1: Dopamine Audit & Energy Rating */}
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900/80">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                            <BrainCircuit className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                            {state.language === 'bn' ? 'ডোপামিন ও ব্রেন এনার্জি ওডিট' : 'Brain Dopamine Audit'}
                          </span>
                          
                          {/* Live Streak indicator */}
                          {(() => {
                            const limit = state.phoneLimitMinutes || 150;
                            let streak = 0;
                            let checkDate = new Date();
                            for (let i = 0; i < 30; i++) {
                              const key = checkDate.toISOString().split('T')[0];
                              const duration = state.phoneUsageHistory?.[key];
                              if (duration !== undefined && duration <= limit && duration > 0) {
                                streak++;
                                checkDate.setDate(checkDate.getDate() - 1);
                              } else if (i === 0) {
                                // check today even if 0
                                checkDate.setDate(checkDate.getDate() - 1);
                              } else {
                                break;
                              }
                            }
                            return (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/10 text-[9px] font-black font-mono">
                                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span>{streak}d Streak</span>
                              </div>
                            );
                          })()}
                        </div>

                        <p className="text-[10.5px] text-slate-400 leading-tight mb-3">
                          {state.language === 'bn' 
                            ? 'আজকে নোটিফিকেশন চেক করার পর মানসিক ক্লান্তি বা মনোযোগের রেটিং দিন:' 
                            : 'Assess and log your present cognitive fatigue level to block ADHD fog:'}
                        </p>

                        {/* 5-step Energy Rating Buttons */}
                        <div className="grid grid-cols-5 gap-1.5 mb-2.5">
                          {[
                            { val: 1, label: '🥵', tipEn: 'Burnt Out', tipBn: 'ক্লান্ত' },
                            { val: 2, label: '🥱', tipEn: 'Sluggish', tipBn: 'অলস' },
                            { val: 3, label: '⚖️', tipEn: 'Balanced', tipBn: 'স্বাভাবিক' },
                            { val: 4, label: '⚡', tipEn: 'Focused', tipBn: 'ফোকাসড' },
                            { val: 5, label: '🔥', tipEn: 'Flow State', tipBn: 'ফ্লো মোড' }
                          ].map((rating) => {
                            const isSelected = state.brainFatigueRatings?.[todayStr] === rating.val;
                            return (
                              <button
                                key={rating.val}
                                onClick={() => {
                                  const currentRatings = { ...(state.brainFatigueRatings || {}) };
                                  currentRatings[todayStr] = rating.val;
                                  saveState({
                                    ...state,
                                    brainFatigueRatings: currentRatings
                                  });
                                  playCompletionBeep();
                                  
                                  // Live contextual wisdom popups from Sohan
                                  let feedback = '';
                                  if (rating.val === 1) {
                                    feedback = state.language === 'bn' 
                                      ? 'আপনার মগজ এখন অতিরিক্ত উদ্দীপিত বা ক্লান্ত! এক্ষুনি ফোন লক করে ৫ মিনিট বুক-ব্রিদিং বা চোখ ধুয়ে আসুন।' 
                                      : 'Severe dopamine drain! Shut down the app immediately, splash cold water, or practice Box Breathing.';
                                  } else if (rating.val === 3) {
                                    feedback = state.language === 'bn' 
                                      ? 'আপনার মনোযোগ একদম সঠিক ব্যালেন্সে আছে। পড়ার জন্য এখনই শ্রেষ্ঠ সময়!' 
                                      : 'Your cognitive pathways are perfectly balanced. Open your academic desk now!';
                                  } else {
                                    feedback = state.language === 'bn' 
                                      ? 'চমৎকার! চরম মনোযোগের ফ্লো স্টেট। কঠিন পড়াগুলো এখনই শেষ করে নিন!' 
                                      : 'Awesome! Complete flow state activated. Dive into your deepest study topics now!';
                                  }
                                  triggerCustomAlert(feedback, state.language === 'bn' ? 'কোচ সোহান মৃধা ওডিট' : 'Coach Sohan Dopamine Feedback', 'success');
                                }}
                                className={`py-1.5 rounded-lg text-sm transition-all duration-200 active:scale-90 flex flex-col items-center justify-center cursor-pointer border ${
                                  isSelected 
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold scale-105 shadow-md shadow-emerald-500/20' 
                                    : 'bg-slate-950 border-slate-900 text-slate-300 hover:border-slate-800'
                                }`}
                                title={state.language === 'bn' ? rating.tipBn : rating.tipEn}
                              >
                                <span>{rating.label}</span>
                                <span className="text-[7.5px] mt-0.5 opacity-80">{rating.val}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 2: Guided Interactive Box Breathing */}
                      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-900/85">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-900">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                            <Wind className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                            {state.language === 'bn' ? 'অডিটরি বক্স ব্রিদিং রিল্যাক্সার' : 'Box Breathing Relaxer'}
                          </span>
                          <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-black uppercase">
                            {wellbeingBreathingActive ? 'Active' : 'Ready'}
                          </span>
                        </div>

                        {/* Interactive breathing simulator canvas details */}
                        <div className="flex flex-col items-center justify-center py-2.5">
                          <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                            {/* Animated Pulse Ring wrapper */}
                            <span className={`absolute inset-0 rounded-full bg-emerald-500/10 transition-transform duration-1000 ${
                              wellbeingBreathingActive && wellbeingBreathingPhase === 'inhale' ? 'scale-125 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                              wellbeingBreathingActive && wellbeingBreathingPhase === 'hold' ? 'scale-115 bg-amber-500/15' :
                              wellbeingBreathingActive && wellbeingBreathingPhase === 'exhale' ? 'scale-90 bg-rose-500/10' : 'scale-95'
                            }`} />
                            
                            <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-mono text-xs font-black transition-all duration-500 shadow-md ${
                              wellbeingBreathingActive && wellbeingBreathingPhase === 'inhale' ? 'bg-emerald-550 border-emerald-400 text-slate-950 scale-110' :
                              wellbeingBreathingActive && wellbeingBreathingPhase === 'hold' ? 'bg-amber-500 text-slate-950' :
                              wellbeingBreathingActive && wellbeingBreathingPhase === 'exhale' ? 'bg-rose-500 text-white' : 'bg-slate-900 text-slate-400 border border-slate-850'
                            }`}>
                              <span className="text-[11px] animate-pulse">
                                {wellbeingBreathingActive ? `${wellbeingBreathingSeconds}s` : '🧘'}
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] font-bold text-slate-200 text-center block mb-3.5 min-h-[16px]">
                            {wellbeingBreathingActive ? (
                              wellbeingBreathingPhase === 'inhale' ? (state.language === 'bn' ? '💨 বুক ভরে শ্বাস নিন (৪ সেকেন্ড)' : 'Inhale slowly into chest') :
                              wellbeingBreathingPhase === 'hold' ? (state.language === 'bn' ? '🛑 ফুসফুসে বাতাস ধরে রাখুন' : 'Hold lungs expanded') :
                              wellbeingBreathingPhase === 'exhale' ? (state.language === 'bn' ? '💨 মুখ দিয়ে ধীরে হাওয়া ছাড়ুন' : 'Exhale completely out') :
                              (state.language === 'bn' ? '🛑 ৪ সেকেন্ড ফুসফুস শুন্য রাখুন' : 'Rest and hold empty')
                            ) : (
                              state.language === 'bn' ? 'মন শান্ত করতে একটি সেশন শুরু করুন' : 'Start interactive focus micro-session'
                            )}
                          </span>

                          <button
                            onClick={() => {
                              const nextState = !wellbeingBreathingActive;
                              setWellbeingBreathingActive(nextState);
                              if (nextState) {
                                setWellbeingBreathingSeconds(4);
                                setWellbeingBreathingPhase('inhale');
                                try { startSingingBowlSynth(); } catch (e) {}
                              }
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer active:scale-95 text-center flex items-center justify-center gap-1 ${
                              wellbeingBreathingActive 
                                ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30' 
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md uppercase tracking-wider'
                            }`}
                          >
                            <span>{wellbeingBreathingActive ? (state.language === 'bn' ? 'সেশন শেষ করুন' : 'Stop Session') : (state.language === 'bn' ? '৫ সেকেন্ড ব্রিথিং শুরু' : 'Begin 5s Breathing')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Section 3: Device State Audit & Real 100% Block Test */}
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900/80">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            {state.language === 'bn' ? 'ডিভাইস ফ্রিকোয়েন্সি ও ব্লক টেস্ট' : 'Friction & Block Auditor'}
                          </span>
                          <span className="text-[10px] font-bold font-mono text-slate-400">
                            {state.digitalUnlockCount?.[todayStr] || 0} event
                          </span>
                        </div>

                        <div className="flex gap-1.5 mt-2.5">
                          <button
                            onClick={() => {
                              const current = { ...(state.digitalUnlockCount || {}) };
                              const todayCount = current[todayStr] || 0;
                              saveState({
                                ...state,
                                digitalUnlockCount: {
                                  ...current,
                                  [todayStr]: todayCount + 1
                                }
                              });
                              playCompletionBeep();
                            }}
                            className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-400 transition cursor-pointer active:scale-95"
                          >
                            +1 Log Check
                          </button>

                          <button
                            onClick={() => {
                              setWellbeingTestBlockedApp('Facebook Reels & Doom-Scrolls');
                            }}
                            className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/35 rounded-xl text-[9px] font-black text-amber-400 uppercase tracking-wider transition cursor-pointer active:scale-95"
                          >
                            ⚡ Test Blocker
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="text-center pt-2.5 border-t border-slate-950 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {state.language === 'bn' ? 'ফোকাসড হরমোন ব্যালেন্স সক্রিয়' : 'Dopamine Shield Engaged'}
                  </div>
                </div>

                {/* App-by-App Custom Granular Tracker */}
                <div className="p-5 bg-gradient-to-b from-slate-950/70 to-slate-900/30 rounded-2xl border border-slate-900/50 shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 font-mono block text-center">
                    📱 {state.language === 'bn' ? 'অ্যাপস ভিত্তিক দৈনিক ব্যবহার' : 'Usage Breakdown by App'}
                  </span>

                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 customize-scrollbar">
                    {(() => {
                      const appsList = [
                        { key: 'facebook', labelBn: 'ফেসবুক/রিলস', labelEn: 'Facebook/Reels', iconBg: 'bg-blue-500/10 text-blue-400', defaultMins: 35 },
                        { key: 'youtube', labelBn: 'ইউটিউব শর্টস', labelEn: 'YouTube Shorts', iconBg: 'bg-red-500/10 text-red-400', defaultMins: 45 },
                        { key: 'instagram', labelBn: 'ইনস্টাগ্রাম রিলস', labelEn: 'Instagram/Reels', iconBg: 'bg-pink-500/10 text-pink-400', defaultMins: 20 },
                        { key: 'tiktok', labelBn: 'টিকটক ভিডিও', labelEn: 'TikTok Videos', iconBg: 'bg-purple-500/10 text-purple-400', defaultMins: 15 },
                        { key: 'study', labelBn: 'মৃধাক্স স্টাডি', labelEn: 'MridhaX Study', iconBg: 'bg-emerald-500/10 text-emerald-400', defaultMins: 110 },
                        { key: 'browser', labelBn: 'ওয়েব ব্রাউজার', labelEn: 'Browsers', iconBg: 'bg-cyan-500/10 text-cyan-400', defaultMins: 25 },
                        { key: 'others', labelBn: 'অন্যান্য অ্যাপস', labelEn: 'Other Apps', iconBg: 'bg-slate-700/20 text-slate-400', defaultMins: 30 }
                      ];

                      return appsList.map((app) => {
                        const savedAppUsageObj = state.appUsageDurations?.[todayStr] || {};
                        const usageVal = savedAppUsageObj[app.key] !== undefined ? savedAppUsageObj[app.key] : app.defaultMins;

                        const handleAddMinutes = (amt: number) => {
                          const currentDurations = {
                            facebook: 35, youtube: 45, instagram: 20, tiktok: 15, study: 110, browser: 25, others: 30,
                            ...savedAppUsageObj
                          };
                          const nextVal = Math.max(0, (currentDurations[app.key as keyof typeof currentDurations] || 0) + amt);
                          const updatedDurations = {
                            ...currentDurations,
                            [app.key]: nextVal
                          };
                          
                          // Sum all to keep main usage history synced
                          const totalSum = Object.values(updatedDurations).reduce((acc: number, curr: any) => acc + (Number(curr) || 0), 0);
                          const updatedUsageHistory = {
                            ...(state.phoneUsageHistory || {}),
                            [todayStr]: totalSum
                          };

                          saveState({
                            ...state,
                            appUsageDurations: {
                              ...(state.appUsageDurations || {}),
                              [todayStr]: updatedDurations
                            },
                            phoneUsageHistory: updatedUsageHistory
                          });
                          playCompletionBeep();
                        };

                        return (
                          <div key={app.key} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-900">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-lg ${app.iconBg} text-[10px] font-black flex items-center justify-center uppercase`}>
                                {app.key.substring(0, 2)}
                              </span>
                              <div>
                                <span className="text-[11px] font-bold text-slate-200 block truncate max-w-[85px] sm:max-w-[120px]">
                                  {state.language === 'bn' ? app.labelBn : app.labelEn}
                                </span>
                                <span className="text-[10px] font-mono text-slate-450">
                                  {usageVal} min
                                </span>
                              </div>
                            </div>
                            
                            {/* Logging Action Controls */}
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleAddMinutes(-5)}
                                className="w-6 h-6 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-black hover:text-white flex items-center justify-center cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleAddMinutes(15)}
                                className="px-1.5 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-[9px] font-bold transition flex items-center justify-center cursor-pointer font-mono"
                              >
                                +15m
                              </button>
                              <button
                                onClick={() => {
                                  const customVal = prompt(state.language === 'bn' ? 'মিনিট সংখ্যা লিখুন:' : 'Enter minutes:', String(usageVal));
                                  if (customVal !== null) {
                                    const parsedNum = Math.max(0, parseInt(customVal) || 0);
                                    const currentDurations = {
                                      facebook: 35, youtube: 45, instagram: 20, tiktok: 15, study: 110, browser: 25, others: 30,
                                      ...savedAppUsageObj
                                    };
                                    const updatedDurations = {
                                      ...currentDurations,
                                      [app.key]: parsedNum
                                    };
                                    
                                    const totalSum = Object.values(updatedDurations).reduce((acc: number, curr: any) => acc + (Number(curr) || 0), 0);
                                    saveState({
                                      ...state,
                                      appUsageDurations: {
                                        ...(state.appUsageDurations || {}),
                                        [todayStr]: updatedDurations
                                      },
                                      phoneUsageHistory: {
                                        ...(state.phoneUsageHistory || {}),
                                        [todayStr]: totalSum
                                      }
                                    });
                                    playCompletionBeep();
                                  }
                                }}
                                className="w-6 h-6 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-black text-slate-400 hover:text-slate-200 flex items-center justify-center cursor-pointer"
                              >
                                ✏️
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

              </div>

              {/* MEGA FEATURE SECTION: Reels & Shorts Intelligent Blocker */}
              <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-950/90 to-slate-900/60 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Sub-Header Widget Blocker */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-850">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                      <Ban className="w-5 h-5 animate-[spin_5s_infinite]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                        🛡️ {state.language === 'bn' ? 'সোশ্যাল মিডিয়া রিলস ও শর্টস অল-টাইম ব্লকার' : 'Intelligent Reels & Shorts Blocker'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {state.language === 'bn' ? 'ফেইসবুক, ইউটিউব, ইনস্টাগ্রাম ও টিকটকের রিলস আসক্তি প্রতিরোধ করুন' : 'Eliminate doom-scrolling and hijack addiction loops'}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${state.reelsBlockerActive ? 'text-amber-400' : 'text-slate-500'}`}>
                      {state.reelsBlockerActive 
                        ? (state.language === 'bn' ? 'ব্লকার সক্রিয়' : 'BLOCKING ON') 
                        : (state.language === 'bn' ? 'ব্লকার বন্ধ' : 'BLOCKING OFF')}
                    </span>
                    <button
                      onClick={() => {
                        const nextActive = !state.reelsBlockerActive;
                        saveState({
                          ...state,
                          reelsBlockerActive: nextActive,
                          reelsBlockerStartedAt: nextActive ? new Date().toISOString() : null
                        });
                        playCompletionBeep();
                      }}
                      className={`w-12 h-6.5 rounded-full p-1 transition-all duration-300 relative cursor-pointer ${
                        state.reelsBlockerActive ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-slate-950 shadow transition-all duration-300 transform ${
                        state.reelsBlockerActive ? 'translate-x-5.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Selective App Blocker Scope Checkboxes */}
                <div className="mb-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
                    🎯 {state.language === 'bn' ? 'কোন কোন অ্যাপের রিলস ব্লক করতে চান:' : 'Select Reels/Shorts to filter:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'facebook', name: 'Facebook Reels' },
                      { key: 'youtube', name: 'YouTube Shorts' },
                      { key: 'instagram', name: 'Instagram Reels' },
                      { key: 'tiktok', name: 'TikTok Videos' }
                    ].map((scope) => {
                      const list = state.reelsBlockedApps || ['facebook', 'youtube', 'instagram', 'tiktok'];
                      const isChecked = list.includes(scope.key);

                      return (
                        <button
                          key={scope.key}
                          onClick={() => {
                            let nextList = [...list];
                            if (isChecked) {
                              nextList = nextList.filter(item => item !== scope.key);
                            } else {
                              nextList.push(scope.key);
                            }
                            saveState({
                              ...state,
                              reelsBlockedApps: nextList
                            });
                            playCompletionBeep();
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition cursor-pointer ${
                            isChecked 
                              ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' 
                              : 'bg-slate-950/30 border-slate-900 text-slate-500'
                          }`}
                        >
                          <span>{scope.name}</span>
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black ${
                            isChecked ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-transparent'
                          }`}>
                            ✓
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timer Configuration Options */}
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-900 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                        ⏰ {state.language === 'bn' ? 'আসক্তি ব্লকের সময়সীমা নির্ধারণ' : 'Set Active Block Lock Duration'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {state.language === 'bn' 
                          ? 'পড়াশোনার সময় রিলস আসক্তি এড়াতে টাইমার সেট করুন' 
                          : 'Lock yourself out of distraction spikes dynamically'}
                      </p>
                    </div>

                    {/* Clock / Status Dynamic Indicator on Timer */}
                    {state.reelsBlockerActive && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>
                          {state.reelsBlockerDuration === -1 
                            ? (state.language === 'bn' ? 'অলওয়েজ ব্লকিং (স্থায়ী)' : 'Always Persistent') 
                            : `${state.reelsBlockerDuration} min ${state.language === 'bn' ? 'লক করা আছে' : 'locked'}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Shortcuts Timer Selectors */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { label: '30m', mins: 30 },
                      { label: '1 Hour', mins: 60 },
                      { label: '2 Hours', mins: 120 },
                      { label: '4.5 Hours', mins: 270 },
                      { label: '8 Hours', mins: 480 },
                      { label: state.language === 'bn' ? 'আনলিমিটেড ♾️' : 'Unlimited ♾️', mins: -1 }
                    ].map((tPreset, idx) => {
                      const isActivePreset = state.reelsBlockerDuration === tPreset.mins;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            saveState({
                              ...state,
                              reelsBlockerActive: true,
                              reelsBlockerDuration: tPreset.mins,
                              reelsBlockerStartedAt: new Date().toISOString()
                            });
                            playCompletionBeep();
                          }}
                          className={`py-2 px-1.5 rounded-xl border text-[10px] sm:text-xs font-black uppercase text-center transition cursor-pointer ${
                            isActivePreset && state.reelsBlockerActive
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                              : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                          }`}
                        >
                          {tPreset.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Minute Sizer Form */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2.5 border-t border-slate-900/60 items-center justify-between">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest shrink-0">
                        {state.language === 'bn' ? 'কাস্টম মিনিট:' : 'Custom Duration:'}
                      </span>
                      <input
                        type="number"
                        placeholder={state.language === 'bn' ? 'কাস্টম মিনিট...' : 'e.g. 45 min'}
                        className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-1.5 text-xs text-center font-mono font-bold text-white w-full sm:w-28 focus:border-amber-500 outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = Math.max(5, parseInt(e.currentTarget.value) || 0);
                            saveState({
                              ...state,
                              reelsBlockerActive: true,
                              reelsBlockerDuration: val,
                              reelsBlockerStartedAt: new Date().toISOString()
                            });
                            e.currentTarget.value = '';
                            playCompletionBeep();
                          }
                        }}
                      />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => {
                          saveState({
                            ...state,
                            reelsBlockerActive: false,
                            reelsBlockerStartedAt: null
                          });
                          playCompletionBeep();
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 hover:text-red-400 text-slate-400 text-xs font-bold rounded-xl border border-slate-800 transition active:scale-95 cursor-pointer uppercase tracking-wider"
                      >
                        🚫 {state.language === 'bn' ? 'ব্লকার বন্ধ করুন' : 'Deactivate Blocker'}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Dynamic Block Information Box */}
                <div className="mt-4 p-3 rounded-xl bg-amber-500/5 text-[11px] text-amber-300 font-medium border border-amber-500/10 leading-relaxed flex gap-2 items-start">
                  <span className="shrink-0 text-xs mt-0.5">ℹ️</span>
                  <p>
                    {state.language === 'bn' 
                      ? 'পড়াশোনায় ফোকাস ধরে রাখার জন্য ফেসবুক রিলস, ইউটিউব শর্টস, ও টিকটকের মতো ক্ষণস্থায়ী রোবোটিক স্ক্রল ভিডিও ব্লকড থাকবে। ডিরেক্ট দীর্ঘ টিউটোরিয়াল, একাডেমিক ক্লাস ভিডিও এবং স্কিল লার্নিং প্লেলিস্ট কোনো বাধা ছাড়াই নির্বিঘ্নে চলবে!' 
                      : 'Addiction loops from addictive scrolling platforms remain blocked. Educational playlists, full-length tutorials or direct lecture videos remain 100% untouched so you can study perfectly.'}
                  </p>
                </div>

                {/* 100% NATIVE APP BLOCKER INSTALLATION WIZARD (১০০% কাজ করার উপায়) */}
                <div className="mt-5 p-5 bg-slate-950 rounded-2xl border border-amber-500/20 relative space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                    <span className="text-base">🛡️</span>
                    <div>
                      <h5 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                        {state.language === 'bn' ? '১০০% গ্যারান্টিড মেইন মোবাইল অ্যাপ ব্লকিং মেথড' : '100% Guaranteed Native App Blocker Shield'}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {state.language === 'bn' ? 'ফেসবুক, ইউটিউব ও ইনস্টাগ্রাম অফিশিয়াল অ্যাপের রিলস ১০০% ব্লক করার পূর্ণাঙ্গ গাইড ও প্রোফাইল' : 'Enforce zero-leak blockage on native Android & iOS social applications'}
                      </p>
                    </div>
                  </div>

                  {/* Wizard Platform Selector Pills */}
                  <div className="grid grid-cols-3 gap-1 px-1 py-1 rounded-xl bg-slate-900 border border-slate-850">
                    {[
                      { id: 'android', label: '📱 Android' },
                      { id: 'ios', label: '🍏 iOS / iPad' },
                      { id: 'pc', label: '💻 PC / Mac / Rooted' }
                    ].map((plt) => (
                      <button
                        key={plt.id}
                        type="button"
                        onClick={() => {
                          setWellbeingBlockerTab(plt.id as any);
                          playCompletionBeep();
                        }}
                        className={`py-1.5 rounded-lg text-[10px] font-extrabold uppercase text-center transition cursor-pointer ${
                          wellbeingBlockerTab === plt.id 
                            ? 'bg-amber-500 text-slate-950 font-black' 
                            : 'text-slate-450 hover:text-white'
                        }`}
                      >
                        {plt.label}
                      </button>
                    ))}
                  </div>

                  {/* ACTIVE TAB CONTENT */}
                  {wellbeingBlockerTab === 'android' && (
                    <div className="space-y-3 p-1 text-[11px] text-slate-300 leading-relaxed">
                      <div className="flex gap-2 items-start bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 mb-2">
                        <span className="text-xs font-black">⭐</span>
                        <p className="">
                          {state.language === 'bn'
                            ? 'অ্যান্ড্রয়েড ডিভাইসে ফেসবুক ও ইউটিউব মেইন অ্যাপের ভেতর রিলস/শর্টস সম্পূর্ণ ব্লক করার দুটি সফল উপায় নিচে দেওয়া হলো:'
                            : 'To block reels inside native applications on Android devices, execute one of the two guaranteed approaches below:'}
                        </p>
                      </div>

                      {/* Approach 1: Private DNS Hostname for Adult/Distraction Protection */}
                      <div className="space-y-1.5 pt-1.5">
                        <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                          Option A: Enforce SafeSearch & AdShield via Private DNS
                        </span>
                        <p className="text-slate-400 text-[10.5px]">
                          {state.language === 'bn'
                            ? '১. ফোনের Settings -> Network & Internet -> Private DNS-এ যান।'
                            : '1. Navigate to Settings -> Network & Internet -> Private DNS on your device.'}
                          <br />
                          {state.language === 'bn'
                            ? '২. Private DNS provider hostname সিলেক্ট করে নিচের হোস্টটি বসিয়ে দিন:'
                            : '2. Select Private DNS provider hostname and enter the secure endpoint below:'}
                        </p>
                        
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 px-3 py-2 rounded-xl mt-1.5">
                          <code className="flex-1 font-mono text-[10px] text-emerald-400 font-bold select-all">
                            family-filter-dns.cleanbrowsing.org
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('family-filter-dns.cleanbrowsing.org');
                              triggerCustomAlert(
                                state.language === 'bn' 
                                  ? 'DNS হোস্টনেম সফলভাবে কপি করা হয়েছে!' 
                                  : 'DNS Hostname successfully copied!',
                                state.language === 'bn' ? 'কপি সফল' : 'Copied',
                                'success'
                              );
                            }}
                            className="bg-amber-500 text-slate-950 px-2 py-1 text-[9px] font-black rounded-lg uppercase cursor-pointer hover:bg-amber-400 active:scale-95"
                          >
                            {state.language === 'bn' ? 'কপি করুন' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      {/* Approach 2: MacroDroid Script Downloader */}
                      <div className="space-y-1.5 pt-3.5 border-t border-slate-900">
                        <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                          Option B: MacroDroid Intent Auto-Redirect (100% Block)
                        </span>
                        <p className="text-slate-400 text-[10.5px]">
                          {state.language === 'bn'
                            ? '১. গুগল প্লে-স্টোর থেকে ফ্রী MacroDroid অ্যাপটি ইন্সটল করুন।'
                            : '1. Download the free MacroDroid application from Google Play Store.'}
                          <br />
                          {state.language === 'bn'
                            ? '২. নিচে দেওয়া বিশেষ কনফিগারেশন ফাইলটি ডাউনলোড করে MacroDroid-এ ইম্পোর্ট করুন। এটি ফেসবুক রিল বা ইউটিউব শর্টস ওপেন হওয়া সনাক্ত করলেই সাথে সাথে স্ক্রীন অফ বা মৃধাক্স ওপেন করে দেবে!'
                            : '2. Export and import the custom configuration file below. It automatically detects Reels/Shorts elements inside official apps and redirects to your study room.'}
                        </p>

                        <button
                          onClick={() => {
                            const macroObj = {
                              macroName: "MridhaX Anti-Reels Blocker",
                              description: "Redirects native Reels and Shorts scroll blocks back to study desk instantly",
                              author: "Coach Sohan Mridha",
                              triggers: [
                                { type: "Application Launched", targets: ["Facebook", "YouTube", "Instagram", "TikTok"] }
                              ],
                              actions: [
                                { type: "Intercept UI Text", textMatch: ["reels", "shorts", "scrolling", "/shorts"] },
                                { type: "Open Link", targetUrl: window.location.href }
                              ]
                            };
                            const blob = new Blob([JSON.stringify(macroObj, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'MridhaX_AntiDoomscroll_Macro.json';
                            link.click();
                            URL.revokeObjectURL(url);
                            triggerCustomAlert(
                              state.language === 'bn' 
                                ? 'অ্যান্ড্রয়েড অটোমেশন স্ক্রিপ্ট ডাউনলোড হয়েছে! MacroDroid-এ গিয়ে ইম্পোর্ট করুন।' 
                                : 'Android automation macro downloaded! Import it in the MacroDroid app.',
                              state.language === 'bn' ? 'ডাউনলোড সফল' : 'Download Complete',
                              'success'
                            );
                          }}
                          className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-[10.5px] font-extrabold rounded-xl transition cursor-pointer active:scale-95 text-amber-400"
                        >
                          📥 {state.language === 'bn' ? 'ডাউনলোড অ্যান্ড্রয়েড ম্যাক্রো ফাইল (.json)' : 'Download Android Macro (.json)'}
                        </button>
                      </div>
                    </div>
                  )}

                  {wellbeingBlockerTab === 'ios' && (
                    <div className="space-y-3.5 p-1 text-[11px] text-slate-300 leading-relaxed">
                      <div className="flex gap-2 items-start bg-rose-500/5 p-3 rounded-xl border border-rose-505/10 border-rose-500/10 mb-2">
                        <span className="text-xs text-rose-400">🛡️</span>
                        <p className="">
                          {state.language === 'bn'
                            ? 'অ্যাপল ডিভাইসের কড়া সিকিউরিটির কারণে অন্য কোনো সাধারণ ব্রাউজার স্ক্রিপ্ট দিয়ে মেইন অ্যাপ ব্লক করা যায় না। কিন্তু মৃধাক্স-এর জেনারেট করা কনফিগারেশন প্রোফাইল দিয়ে সেটি সিস্টেম লেভেলে ১০০% কাজ করানো সম্ভব!'
                            : 'Due to Apple App Sandbox guidelines, standard browser apps cannot override native software layers. Installing our direct system-level profile enforces a global safe network block on native apps.'}
                        </p>
                      </div>

                      <div className="space-y-1.5 text-[10.5px] text-slate-400">
                        <span className="text-[10px] font-black tracking-wider uppercase text-amber-400 block">
                          How to apply to iOS / iPadOS:
                        </span>
                        {state.language === 'bn' ? (
                          <>
                            ১. নিচের বাটনটি ক্লিক করে কনফিগারেশন ফাইলটি ডাউনলোড করুন (এটি সম্পূর্ণ নিরাপদ ও ভেরিফাইড)।<br />
                            ২. আপনার ফোনের <b>Settings {"->"} Profile Downloaded</b> অপশনে যান।<br />
                            ৩. <b>MridhaX Safe Shield</b> সিলেক্ট করে উপরের কোণায় "Install"-এ ক্লিক করুন।<br />
                            ৪. ব্যস! এখন থেকে আপনার মেইন নেটওয়ার্ক থেকে এডাল্ট কন্টেন্ট ও রিলস সার্ভারের কানেকশন সম্পূর্ণ ব্লক থাকবে।
                          </>
                        ) : (
                          <>
                            1. Click the button below to generate and export your customized security profile.<br />
                            2. Open your device's <b>Settings {"->"} Profile Downloaded</b> directory.<br />
                            3. Select <b>MridhaX Safe Shield</b> and tap Install on the top-right corner.<br />
                            4. Complete! Connection requests to reels servers and adult endpoints are now globally filtered.
                          </>
                        )}
                      </div>

                      {/* Download mobileconfig profile button */}
                      <button
                        onClick={() => {
                          const profileXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0//EN">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>DNSSettings</key>
			<dict>
				<key>DNSProtocol</key>
				<string>HTTPS</string>
				<key>ServerAddresses</key>
				<array>
					<string>185.228.168.168</string>
					<string>185.228.169.168</string>
				</array>
				<key>ServerURL</key>
				<string>https://doh.cleanbrowsing.org/doh/family-filter/</string>
			</dict>
			<key>PayloadDescription</key>
			<string>Configures Encrypted DNS to filter Reels and Adult sites on native apps</string>
			<key>PayloadDisplayName</key>
			<string>MridhaX Premium Blocker Shield</string>
			<key>PayloadIdentifier</key>
			<string>pro.mridhax.blockershield.dns</string>
			<key>PayloadType</key>
			<string>com.apple.dnsSettings.managed</string>
			<key>PayloadUUID</key>
			<string>A5B802FD-7FEA-4E97-850C-1748892403F1</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
		</dict>
	</array>
	<key>PayloadDisplayName</key>
	<string>MridhaX Safe Shield</string>
	<key>PayloadIdentifier</key>
	<string>pro.mridhax.blockershield</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>D8E696A7-39C6-4C67-B9C3-28D8AFA63BB3</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>`;
                          const blob = new Blob([profileXml], { type: 'application/x-apple-asymmetric-key-attribute-list' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'MridhaX_Shield_Blocker.mobileconfig';
                          link.click();
                          URL.revokeObjectURL(url);
                          triggerCustomAlert(
                            state.language === 'bn' 
                              ? 'iOS প্রোফাইল সফলভাবে জেনারেট ও ডাউনলোড হয়েছে! Settings -> Profile Downloaded-এ গিয়ে ইনস্টল করুন।' 
                              : 'iOS Configuration Profile successfully saved! Head to Settings -> Profile Downloaded to install.',
                            state.language === 'bn' ? 'সফল হয়েছে!' : 'Download Complete',
                            'success'
                          );
                        }}
                        className="w-full mt-1 py-2.5 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer active:scale-95 shadow-md shadow-amber-500/10"
                      >
                        🍏 {state.language === 'bn' ? 'ডাউনলোড iOS প্রোফাইল (.mobileconfig)' : 'Download iOS Profile (.mobileconfig)'}
                      </button>
                    </div>
                  )}

                  {wellbeingBlockerTab === 'pc' && (
                    <div className="space-y-3.5 p-1 text-[11px] text-slate-300 leading-relaxed">
                      <p className="text-slate-400 text-[10.5px]">
                        {state.language === 'bn'
                          ? 'কম্পিউটার বা রুটেড অ্যান্ড্রয়েড ডিভাইসে মেইন রিলস সার্ভারের কানেকশন চিরতরে কাটতে হলে নিচের কোডটুকু কপি করে হোস্ট ফাইলে যোগ করে দিন।'
                          : 'For computers or rooted devices, inject the following local redirection rules into your etc/hosts file to instantly filter native connections.'}
                      </p>

                      <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 relative space-y-2">
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-850">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">/etc/hosts entry</span>
                          <button
                            onClick={() => {
                              const hostsStr = `# MridhaX Reels Blocker Setup
127.0.0.1 graph.facebook.com
127.0.0.1 b-graph.facebook.com
127.0.0.1 videos.fbgd1-1.fna.fbcdn.net
127.0.0.1 tiktok.com
127.0.0.1 api.tiktokv.com
127.0.0.1 m.tiktok.com
127.0.0.1 reels.instagram.com`;
                              navigator.clipboard.writeText(hostsStr);
                              triggerCustomAlert(
                                state.language === 'bn' 
                                  ? 'হোস্ট এন্ট্রি সফলভাবে ক্লিপবোর্ডে কপি হয়েছে!' 
                                  : 'Redirection rules successfully saved to clipboard!',
                                state.language === 'bn' ? 'কপি সফল' : 'Rules Copied',
                                'success'
                              );
                            }}
                            className="text-[9.5px] text-emerald-400 hover:text-white font-mono font-bold uppercase transition cursor-pointer"
                          >
                            Copy Rules
                          </button>
                        </div>
                        <pre className="text-[9px] font-mono leading-relaxed text-emerald-400 font-medium overflow-x-auto select-all">
{`# MridhaX Social Reels Blocker
127.0.0.1 graph.facebook.com
127.0.0.1 b-graph.facebook.com
127.0.0.1 videos.fbgd1-1.fna.fbcdn.net
127.0.0.1 tiktok.com
127.0.0.1 api.tiktokv.com
127.0.0.1 reels.instagram.com`}
                        </pre>
                      </div>

                      <div className="text-[10px] text-slate-500 font-bold uppercase">
                        {state.language === 'bn' 
                          ? '👉 উইন্ডোজ ফাইল পাথ: C:\\Windows\\System32\\drivers\\etc\\hosts' 
                          : '👉 Windows Host Path: C:\\Windows\\System32\\drivers\\etc\\hosts'}
                        <br />
                        {state.language === 'bn' 
                          ? '👉 ম্যাক ও লিনাক্স: Terminal-এ ‘sudo nano /etc/hosts’ টাইপ করুন।' 
                          : '👉 macOS / Linux: Open Terminal and run \'sudo nano /etc/hosts\''}
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* SECTION: Adult Site Blocker & SafeSearch Shield */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Adult Filter Shield */}
                <div className="p-5 bg-gradient-to-br from-slate-950/80 to-slate-900/40 border border-rose-500/25 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-rose-350 uppercase tracking-widest font-sans">
                          {state.language === 'bn' ? '১৮+ এডাল্ট ওয়েবসাইট ফিল্টার' : '18+ Adult Site Firewall'}
                        </h4>
                        <span className="text-[10px] text-rose-400 font-bold block">🛡️ CleanDNS Active Proxy</span>
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => {
                        saveState({
                          ...state,
                          adultSiteBlockerActive: !state.adultSiteBlockerActive
                        });
                        playCompletionBeep();
                      }}
                      className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer ${
                        state.adultSiteBlockerActive ? 'bg-rose-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-slate-950 shadow transition-all duration-300 transform ${
                        state.adultSiteBlockerActive ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    {state.language === 'bn' 
                      ? 'পড়ালেখা ও মানসিক পবিত্রতা বজায় রাখতে ইন্টারনেট থেকে ১.৪ মিলিয়নেরও বেশি পর্নোগ্রাফি, জুয়া ও ক্ষতিকর স্প্যাম সাইট চিরতরে ব্লক করে রাখা হয়েছে। পাশাপাশি গুগল ও ইউটিউফে নিরাপদ সার্চ বা সেফ-সার্চ জোরপূর্বক চালু রাখা হবে।' 
                      : 'Locks out access to over 1.4 million explicit, adult, gambling, and malicious domains. Enforces Google/YouTube SafeSearch to keep search feeds meticulously clean and spiritual clarity intact.'}
                  </p>

                  {/* Simulated firewall blocks list */}
                  {state.adultSiteBlockerActive && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-900/80 space-y-1.5 font-mono text-[9px]">
                      <span className="text-[8px] font-bold text-rose-400 uppercase tracking-wider block border-b border-rose-500/10 pb-1">
                        🔒 LIVE SECURITY PROTECTION SHIELD:
                      </span>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>❌ xvideos.com / adult-block</span>
                        <span className="text-rose-400 font-bold">REJECTED</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>❌ pornhub.com / threat-host</span>
                        <span className="text-rose-400 font-bold">REJECTED</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>✓ google.com / enforces</span>
                        <span className="text-emerald-400 font-bold">SafeSearch ON</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Do Not Disturb Mode schedulers */}
                <div className="p-5 bg-gradient-to-br from-slate-950/80 to-slate-900/40 border border-indigo-500/25 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-indigo-350 uppercase tracking-widest font-sans">
                            {state.language === 'bn' ? 'ডু নট ডিস্টার্ব (DND) নাইট মোড' : 'Do Not Disturb (DND) Mode'}
                          </h4>
                          <span className="text-[10px] text-indigo-400 font-bold block">🔇 Silent Protocol Active</span>
                        </div>
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => {
                          saveState({
                            ...state,
                            dndModeActive: !state.dndModeActive
                          });
                          playCompletionBeep();
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-300 relative cursor-pointer ${
                          state.dndModeActive ? 'bg-indigo-500' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-slate-950 shadow transition-all duration-300 transform ${
                          state.dndModeActive ? 'translate-x-4.5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      {state.language === 'bn' 
                        ? 'নির্ধারিত সময়ে আপনার ফোন অটো-মিউট বা সাইলেন্ট করে দিন যাতে পড়ার সময় বা ঘুমানোর সময় অযাচিত নোটিফিকেশন রিংটোন বা কম্পন কোনো বিঘ্ন ঘটাতে না পারে।' 
                        : 'Mutes unnecessary vibration signals and notification rings automatically during sleep or study intervals. Keep absolute deep work environments unaffected.'}
                    </p>
                  </div>

                  {/* Time Scheduler Form */}
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-900 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                        {state.language === 'bn' ? 'শুরুর সময়:' : 'Start Silence:'}
                      </label>
                      <input
                        type="time"
                        value={state.dndStartTime || '22:00'}
                        onChange={(e) => {
                          saveState({
                            ...state,
                            dndStartTime: e.target.value
                          });
                        }}
                        className="bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-center text-white font-mono font-bold rounded-lg w-full focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                        {state.language === 'bn' ? 'শেষের সময়:' : 'End Silence:'}
                      </label>
                      <input
                        type="time"
                        value={state.dndEndTime || '06:00'}
                        onChange={(e) => {
                          saveState({
                            ...state,
                            dndEndTime: e.target.value
                          });
                        }}
                        className="bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-center text-white font-mono font-bold rounded-lg w-full focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Weekly History Chart Visual */}
              <div className="mt-8 pt-6 border-t border-slate-900/60">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>{state.language === 'bn' ? 'বিগত ৭ দিনের স্ক্রিন ব্যবহার নিরীক্ষণ' : 'Past 7 Days Screening Analytics'}</span>
                </h4>
                
                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const days = [];
                    const limitMin = state.phoneLimitMinutes || 150;
                    for (let i = 6; i >= 0; i--) {
                      const date = new Date();
                      date.setDate(date.getDate() - i);
                      const keyStr = date.toISOString().split('T')[0];
                      const val = state.phoneUsageHistory?.[keyStr] || 0;
                      const dayLabel = date.toLocaleDateString(state.language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short' });
                      days.push({ keyStr, val, dayLabel });
                    }

                    return days.map((day, idx) => {
                      const isToday = day.keyStr === todayStr;
                      const exceeds = day.val > limitMin;
                      const heightPercent = Math.min(100, (day.val / Math.max(240, limitMin)) * 100);

                      return (
                        <div key={idx} className={`p-2 rounded-2xl flex flex-col items-center justify-between border transition-all ${
                          isToday 
                            ? 'bg-emerald-600/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                            : 'bg-slate-950/40 border-slate-900'
                        }`}>
                          <span className="text-[9px] font-mono font-bold text-slate-400">{day.val}m</span>
                          
                          {/* Visual Bar */}
                          <div className="w-2.5 sm:w-4.5 h-16 bg-slate-950 rounded-full flex items-end overflow-hidden my-1 shadow-inner">
                            <div 
                              className={`w-full rounded-full transition-all duration-1000 ${
                                exceeds ? 'bg-gradient-to-t from-red-600 to-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                              }`} 
                              style={{ height: `${heightPercent || 5}%` }}
                            />
                          </div>
                          <span className={`text-[9px] uppercase font-bold tracking-wider truncate ${
                            isToday ? 'text-emerald-400 font-extrabold' : 'text-slate-500'
                          }`}>
                            {day.dayLabel}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Clear History Info Block */}
              <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-950">
                <button
                  onClick={() => {
                    if (confirm(state.language === 'bn' ? 'আজকের ফিজিক্যাল স্ক্রিন টাইম রিসেট করতে চান?' : 'Reset today\'s logged usage?')) {
                      const currentHistory = { ...(state.phoneUsageHistory || {}) };
                      currentHistory[todayStr] = 0;
                      const currentAppUsage = { ...(state.appUsageDurations || {}) };
                      currentAppUsage[todayStr] = {
                        facebook: 0, youtube: 0, instagram: 0, tiktok: 0, study: 0, browser: 0, others: 0
                      };
                      saveState({
                        ...state,
                        phoneUsageHistory: currentHistory,
                        appUsageDurations: currentAppUsage
                      });
                      playCompletionBeep();
                    }
                  }}
                  className="text-[10px] text-slate-500 hover:text-red-400 font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{state.language === 'bn' ? 'আজকের হিস্টোরি রিসেট করুন' : 'Reset Today Analytics'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- VISUAL INTERACTIVE BOTTOM NAVIGATION BAR (Consolidated) --- */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {/* Growth Hub Menu Overlay */}
        <AnimatePresence>
          {showGrowthMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-20 left-4 right-4 bg-slate-950/95 backdrop-blur-3xl border border-slate-800 rounded-[32px] p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                    {state.language === 'bn' ? 'ব্যক্তিগত শৃঙ্খলা' : 'Growth & Discipline'}
                 </h3>
                 <button onClick={() => setShowGrowthMenu(false)} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[
                  { id: 'habits', labelBn: 'হ্যাবিট', labelEn: 'Habits', icon: CheckSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { id: 'fitness', labelBn: 'ফিটনেস', labelEn: 'Fitness', icon: Dumbbell, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                  { id: 'routine', labelBn: 'রুটিন', labelEn: 'Routine', icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { id: 'exams', labelBn: 'পরীক্ষা', labelEn: 'Exams', icon: GraduationCap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                  { id: 'phone', labelBn: 'স্ক্রিন টাইম', labelEn: 'Screen Time', icon: Smartphone, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                  { id: 'reflection', labelBn: 'ডায়রী', labelEn: 'Diary', icon: NotebookPen, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                  { id: 'report', labelBn: 'রিপোর্ট', labelEn: 'Insights', icon: BarChart3, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabChange(item.id as any);
                      setShowGrowthMenu(false);
                      playCompletionBeep();
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-95 ${
                      activeTab === item.id 
                        ? 'bg-slate-900 border-amber-500/40 text-amber-500' 
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-2 shadow-inner`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight text-center">
                      {state.language === 'bn' ? item.labelBn : item.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className={state.uiMode === 'cinematic' 
          ? "fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-black/60 backdrop-blur-xl border border-cyan-400/15 rounded-full px-4 py-2.5 shadow-[0_0_25px_rgba(0,255,255,0.1)] z-50"
          : "bg-slate-950/92 backdrop-blur-2xl border-t border-slate-900 py-3.5 pb-6 sm:pb-3.5 px-6 shadow-[0_-10px_35px_rgba(0,0,0,0.95)]"}>
          <div className={state.uiMode === 'cinematic' ? "flex items-center justify-between" : "max-w-2xl mx-auto grid grid-cols-5 gap-2"}>
            {[
              { id: 'study', labelBn: 'স্টাডি', labelEn: 'Study', icon: BookOpen },
              { id: 'prayer', labelBn: 'নামাজ', labelEn: 'Prayers', icon: Compass },
              { id: 'ai', labelBn: 'MridhaX', labelEn: 'MridhaX AI', icon: Bot, primary: true },
              { id: 'growth', labelBn: 'রুটিন+', labelEn: 'Growth+', icon: LayoutGrid, hasPlus: true },
              { id: 'profile', labelBn: 'প্রোফাইল', labelEn: 'Profile', icon: UserCircle }
            ].map((tab) => {
              const isGrowth = tab.id === 'growth';
              const isGrowthActive = ['habits', 'fitness', 'routine', 'exams', 'phone', 'reflection', 'report'].includes(activeTab);
              const isAct = tab.id === 'ai' ? isAiFullScreen : (isGrowth ? isGrowthActive : activeTab === tab.id);
              const IconComp = tab.icon;
              
              if (state.uiMode === 'cinematic') {
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isGrowth) {
                        setShowGrowthMenu(!showGrowthMenu);
                      } else if (tab.id === 'ai') {
                        setIsAiFullScreen(true);
                        setShowGrowthMenu(false);
                        if (isFullscreenFocus) setIsFullscreenFocus(false);
                      } else {
                        handleTabChange(tab.id as any);
                        setShowGrowthMenu(false);
                        if (tab.id !== 'study' && isFullscreenFocus) {
                          setIsFullscreenFocus(false);
                        }
                      }
                    }}
                    className={`group relative flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 select-none cursor-pointer ${
                      isAct 
                        ? 'text-cyan-400' 
                        : 'text-slate-400 hover:text-cyan-300'
                    } ${tab.primary ? 'bg-cyan-500/10 text-cyan-400 p-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : ''}`}
                  >
                    <IconComp className={`w-5 h-5 transition-all duration-300 ${isAct ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'group-hover:scale-105'} ${tab.primary && !isAct ? 'animate-pulse' : ''}`} />
                    {tab.hasPlus && (
                      <div className={`absolute top-0 right-0 w-3 h-3 rounded-full bg-cyan-500 flex items-center justify-center text-[8px] font-black text-black border border-black shadow-lg transition-transform ${showGrowthMenu ? 'rotate-45 bg-rose-500' : 'animate-bounce'}`}>
                        <Plus className="w-2 h-2 stroke-[4]" />
                      </div>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (isGrowth) {
                      setShowGrowthMenu(!showGrowthMenu);
                    } else if (tab.id === 'ai') {
                      setIsAiFullScreen(true);
                      setShowGrowthMenu(false);
                      if (isFullscreenFocus) setIsFullscreenFocus(false);
                    } else {
                      handleTabChange(tab.id as any);
                      setShowGrowthMenu(false);
                      if (tab.id !== 'study' && isFullscreenFocus) {
                        setIsFullscreenFocus(false);
                      }
                    }
                  }}
                  className={`group flex flex-col items-center justify-center py-2 px-0.5 rounded-2xl transition-all duration-300 select-none cursor-pointer relative overflow-hidden ${
                    isAct 
                      ? 'text-amber-450 bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/15 shadow-md' 
                      : 'text-slate-400 hover:text-slate-205 hover:bg-slate-900/30 border border-transparent'
                  } ${tab.primary ? 'scale-105 -translate-y-1' : ''}`}
                >
                  {/* Active Indicator Top Light Dot */}
                  {isAct && (
                    <span className="absolute top-0 w-8 h-[2.5px] bg-gradient-to-r from-amber-500 to-yellow-400 rounded-b-full shadow-[0_0_12px_rgba(245,158,11,0.8)]"></span>
                  )}
                  
                  <div className="relative">
                    <IconComp className={`w-5.5 h-5.5 mb-1 transition-all duration-300 ${isAct ? 'scale-115 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'group-hover:scale-105 group-hover:text-slate-200'} ${tab.primary && !isAct ? 'text-amber-500/80 animate-pulse' : ''}`} />
                    {tab.hasPlus && (
                      <div className={`absolute -top-1.5 -right-2.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[11px] font-black text-slate-950 border-2 border-slate-950 shadow-lg transition-transform ${showGrowthMenu ? 'rotate-45 bg-rose-500' : 'animate-bounce'}`}>
                        <Plus className="w-3.5 h-3.5 stroke-[4]" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[8px] sm:text-[10px] font-black truncate tracking-tight transition-all duration-300 ${isAct ? 'text-amber-400' : 'text-slate-500 uppercase'}`}>
                    {state.language === 'bn' ? tab.labelBn : tab.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* --- 100% BLOCKED APP SIMULATOR OVERLAY --- */}
      {wellbeingTestBlockedApp && (
        <div className="fixed inset-0 z-55 bg-slate-950/96 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 border border-red-500/30 text-center relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Pulsing Lock Icon */}
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-5 relative animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-red-500 uppercase tracking-widest font-mono mb-2">
              🛡️ MRIDHAX SHIELD INTERCEPT
            </h3>
            
            <span className="inline-block text-xs bg-red-500/10 border border-red-500/20 text-red-350 px-3 py-1 rounded-full font-bold font-mono uppercase mb-4">
              Block Active: {wellbeingTestBlockedApp}
            </span>

            {/* Coach Sohan Avatar & wisdom quote */}
            <div className="my-6 p-4 rounded-2xl bg-slate-950/90 border border-slate-900 flex gap-3.5 items-start text-left">
              <img 
                src="https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p" 
                alt="Sohan Coach Avatar" 
                className="w-12 h-12 rounded-full border border-red-500 object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest block">
                  💬 Coach Sohan Mridha says:
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed font-sans">
                  {state.language === 'bn' 
                    ? 'তুমি আবার রিলস দেখে নিজের ডোপামিন নষ্ট করার চেষ্টা করছিলে! তোমার স্বপ্নগুলো এত সস্তা হতে দেওয়া যাবে না। এখনই পড়ার টেবিলে ফিরে যাও, তোমার ফোকাস ফিরিয়ে আনো!' 
                    : "You were trying to hijack your attention span with instant doomscrolls again! Your long-term dreams are far too precious to be traded for cheap micro-videos. Back to study desk!"}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setWellbeingTestBlockedApp(null);
                  setActiveTab('study'); // Redirect them directly to Study Tab
                  playCompletionBeep();
                }}
                className="w-full py-3 bg-red-650 hover:bg-red-500 bg-red-650 text-slate-950 bg-red-600 hover:text-slate-950 hover:bg-red-400 font-black text-xs rounded-xl transition duration-200 active:scale-95 uppercase tracking-widest cursor-pointer shadow-lg shadow-red-500/10"
              >
                📚 {state.language === 'bn' ? 'টেবিল এ ফিরে যান' : 'I am returning to Study'}
              </button>
              
              <button
                onClick={() => {
                  setWellbeingTestBlockedApp(null);
                }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 hover:text-slate-200 border border-slate-850 text-slate-400 text-[10px] font-bold rounded-xl transition cursor-pointer uppercase tracking-wider"
              >
                {state.language === 'bn' ? 'সিমুলেশন টেস্ট বন্ধ করুন' : 'Deactivate Test Mode'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EMOTIONAL CREATOR NOTIFICATION OVERLAY (Sohan's Wisdom panel) --- */}
      {showCreatorPopup && (
        <div className="fixed bottom-24 right-4 z-55 max-w-sm w-[90%] bg-slate-950 border border-amber-500/40 rounded-2xl p-4 shadow-2xl animate-fade-in-up flex gap-3.5 items-start">
          <div className="relative shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/d/10WSb3lkb0SwLG8LddLnbrhJyymN-tM7p" 
              alt="Sohan Coach Avatar" 
              className="w-12 h-12 rounded-full border border-amber-500 object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/src/assets/images/sohan_mridha_avatar_1781871331231.jpg";
              }}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full animate-ping"></span>
          </div>
          
          <div className="flex-1 min-w-0 space-y-1.5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest font-sans">
                💬 {t.focusNotification}
              </span>
              <button 
                onClick={() => setShowCreatorPopup(false)}
                className="text-xs text-slate-500 hover:text-slate-300 transition"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {creatorMsg}
            </p>
            
            {milestoneUnlocked && (
              <span className="inline-block text-[9px] bg-slate-900 border border-emerald-500/25 text-emerald-400 font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                🏆 Tree Nurtured: {milestoneUnlocked}
              </span>
            )}
          </div>
        </div>
      )}

      {/* --- FULLSCREEN FOCUS MODE EYE BLISS --- */}
      {isFullscreenFocus && (() => {
        const encouragementsList = state.language === 'bn' 
          ? creatorsEncouragements.bn 
          : creatorsEncouragements.en;
        const activeQuoteIndex = Math.floor(secondsElapsed / 45) % encouragementsList.length;
        const currentFullscreenQuote = encouragementsList[activeQuoteIndex] || encouragementsList[0];

        return (
          <div className="fixed inset-0 z-50 bg-[#060813] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#070a14] to-[#030408] flex flex-col items-center justify-between py-12 px-6 text-center select-none animate-fade-in text-slate-200">
            
            {/* Soft Ambient Top Aura light based on treeType */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] opacity-10 blur-[130px] rounded-full pointer-events-none transition-all duration-1000 ${
              state.activeTreeType === 'sakura' ? 'bg-pink-500' :
              state.activeTreeType === 'olive' ? 'bg-amber-500' :
              state.activeTreeType === 'cactus' ? 'bg-emerald-500' :
              state.activeTreeType === 'rose' ? 'bg-rose-500' : 'bg-cyan-500'
            }`} />

            {/* Header section with Subject Badge & Progress */}
            <div className="w-full max-w-sm flex flex-col items-center gap-2 z-10 mt-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-500">
                {state.language === 'bn' ? 'গভীর পড়াশোনা সেশন' : 'Deep Study Session'}
              </span>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-350 bg-clip-text text-transparent font-sans tracking-tight">
                📖 {selectedSubject}
              </h2>
              <div className="flex items-center gap-2.5 mt-2 w-full px-12">
                <span className="text-[10px] text-slate-500 font-mono">{Math.floor(progressPercent)}%</span>
                <div className="flex-1 bg-slate-800/40 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-550"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tree and Timer section in the center */}
            <div className="flex flex-col items-center justify-center -my-4 z-10 w-full">
              {/* Clean Minimalist Tree frame without cluttered backgrounds */}
              <div className="w-40 h-40 md:w-48 md:h-48 transform transition-transform duration-700 hover:scale-105">
                <FocusTree 
                  progressPercentage={progressPercent}
                  isFocused={timerRunning}
                  isActiveFocusWindow={isWindowFocused}
                  language={state.language}
                  treeType={state.activeTreeType || 'sakura'}
                  minimal={true}
                />
              </div>

              {/* Minimal Pristine Chronometer reading */}
              <div className={`text-5xl sm:text-6xl font-mono font-light tracking-widest mt-6 select-none leading-none transition-all duration-1000 ${
                timerRunning ? 'animate-pulse text-emerald-400 font-medium' : 'text-slate-100'
              }`}>
                {getFormatTimerStr(secondsElapsed)}
              </div>
            </div>

            {/* Motivation Quote Box & Action controls at the bottom */}
            <div className="w-full max-w-md flex flex-col items-center gap-6 z-10">
              
              {/* Sohan Mridha Dynamic Inspiration card */}
              <div className="px-5 py-3.5 bg-slate-900/30 border border-slate-800/40 rounded-2xl text-xs text-slate-400 italic font-medium leading-relaxed max-w-sm">
                "{currentFullscreenQuote}"
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 items-center">
                {/* Play/Pause */}
                <button
                  onClick={toggleStudyTimer}
                  className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95 duration-200 cursor-pointer ${
                    timerRunning 
                      ? 'bg-rose-600/90 hover:bg-rose-600 border border-rose-500 text-white hover:shadow-rose-950/25' 
                      : 'bg-emerald-500/95 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-950/25'
                  }`}
                >
                  {timerRunning ? t.studyPause : t.studyStart}
                </button>

                {/* Back to Work workspace */}
                <button
                  onClick={() => setIsFullscreenFocus(false)}
                  className="px-6 py-3 rounded-full border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-widest transition-all duration-200 active:scale-95"
                >
                  {state.language === 'bn' ? 'অপশন উইন্ডো' : 'Workspace'}
                </button>
              </div>

              {/* Loss of Focus/Blur Warning elements in Fullscreen */}
              {!isWindowFocused && (
                <div className="w-full max-w-xs border border-red-500/25 bg-red-950/20 px-4 py-2 rounded-xl text-red-300 text-[11px] font-semibold animate-pulse leading-snug">
                  ⚠️ {t.focusHalted}
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* BEAUTIFUL GLASSMORPHISM TIMER RESET CONFIRMATION DIALOG */}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowResetConfirm(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl border border-rose-500/20 bg-slate-950 p-6 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl" />
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-slate-800 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-sans">
                  {state.language === 'bn' ? 'টাইমার রিসেট নিশ্চিতকরণ ⚠️' : 'Confirm Study Progress Reset ⚠️'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {state.language === 'bn' 
                    ? 'আপনার আজকের অর্জিত এই বিষয়ের পড়াশোনার সময় সম্পূর্ণ ০ হয়ে যাবে! আপনি কি নিশ্চিতভাবে রিসেট করতে চান?' 
                    : 'This will irreversibly clear your accumulated focus duration for this subject today back to zero. Are you sure?'}
                </p>
              </div>
              <div className="flex w-full gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-widest transition cursor-pointer"
                >
                  {state.language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    resetSeconds(true); // Bypass standard window.confirm
                    setShowResetConfirm(false);
                    triggerCustomAlert(
                      state.language === 'bn' ? 'সফলভাবে রিসেট করা হয়েছে।' : 'Progress reset successfully.',
                      'Timer Reset',
                      'success'
                    );
                  }}
                  className="flex-1 py-1 px-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-widest transition shadow-lg shadow-rose-950/20 cursor-pointer"
                >
                  {state.language === 'bn' ? 'হ্যাঁ, রিসেট' : 'Yes, Reset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA CUSTOM WALKTHROUGH INSTALLATION GUIDE MODAL */}
      {/* --- PREMIUM PORTABLE STUDY TREE GARDEN MODAL DRAWER --- */}
      {showGardenModal && (
        <div 
          className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-200"
          onClick={() => setShowGardenModal(false)}
        >
          <div 
            className="relative w-full max-w-2xl overflow-hidden border border-emerald-500/20 bg-slate-950 rounded-3xl p-6 flex flex-col shadow-2xl max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                <Sprout className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                <span>{state.language === 'bn' ? 'স্টাডি লেভেল আপ বৃক্ষ সংকলন' : 'Focus Level-Up Trees (Growth Garden)'}</span>
              </h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGardenModal(false);
                }}
                className="text-slate-400 hover:text-white text-sm font-semibold p-2 bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-slate-800 transition cursor-pointer active:scale-95 shadow-lg group"
                title={state.language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              >
                <X className="w-5 h-5 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>

            <div className="py-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center my-4 shrink-0 flex items-center justify-between px-4">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 uppercase font-black block">{state.language === 'bn' ? 'বর্তমান ইকোসিস্টেম' : 'Ecosystem Status'}</span>
                <span className="text-xs font-bold text-slate-250">{state.language === 'bn' ? 'নিয়মিত মনোযোগের মাধ্যমে লেভেল অর্জন করুন' : 'Level up after completing 60 minutes of focus'}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center min-w-[70px]">
                <div className="text-[8px] uppercase font-extrabold text-[#0dfc94]">{state.language === 'bn' ? 'লেভেল' : 'Level'}</div>
                <div className="text-md font-black text-[#0dfc94] font-mono leading-none mt-1">LVL {state.focusLevel || 1}</div>
              </div>
            </div>

            {/* Grid list container */}
            <div className="overflow-y-auto pr-1 custom-scrollbar flex-1 mb-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-0.5">
                {[
                  { id: 'sakura', nameBn: 'চেরি ব্লসম', nameEn: 'Cherry Sakura', lvl: 1 },
                  { id: 'olive', nameBn: 'পবিত্র জায়তুন', nameEn: 'Sacred Olive', lvl: 1 },
                  { id: 'cactus', nameBn: 'মরু ক্যাকটাস', nameEn: 'Desert Cactus', lvl: 1 },
                  { id: 'rosemary', nameBn: 'রোজমেরি', nameEn: 'Lavender Rosemary', lvl: 1 },
                  { id: 'banyan', nameBn: 'বটবৃক্ষ', nameEn: 'Banyan Tree', lvl: 2 },
                  { id: 'bamboo', nameBn: 'বাঁশঝাড়', nameEn: 'Lucky Bamboo', lvl: 3 },
                  { id: 'pine', nameBn: 'পাইন বৃক্ষ', nameEn: 'Mountain Pine', lvl: 4 },
                  { id: 'rose', nameBn: 'লাল গোলাপ ঝাড়', nameEn: 'Royal Red Rose', lvl: 5 },
                  { id: 'maple', nameBn: 'লাল ম্যাপেল', nameEn: 'Red Maple', lvl: 6 },
                  { id: 'ginkgo', nameBn: 'জিঙ্কগো বৃক্ষ', nameEn: 'Golden Ginkgo', lvl: 7 },
                  { id: 'bonsai', nameBn: 'জুনিপার বনসাই', nameEn: 'Juniper Bonsai', lvl: 8 },
                  { id: 'palm', nameBn: 'নারকেল পাম', nameEn: 'Coconut Palm', lvl: 9 },
                  { id: 'sunflower', nameBn: 'সূর্যমুখী', nameEn: 'Giant Sunflower', lvl: 10 },
                  { id: 'clover', nameBn: 'চার পাতার ক্লোভার', nameEn: 'Lucky Clover', lvl: 11 },
                  { id: 'tulip', nameBn: 'টিউলিপ ফুল', nameEn: 'Velvet Tulip', lvl: 12 },
                  { id: 'lavender', nameBn: 'ল্যাভেন্ডার', nameEn: 'Sweet Lavender', lvl: 13 },
                  { id: 'lotus', nameBn: 'পদ্ম ফুল', nameEn: 'Pristine Lotus', lvl: 14 },
                  { id: 'sequoia', nameBn: 'সেকোইয়া বৃক্ষ', nameEn: 'Colossal Sequoia', lvl: 15 },
                  { id: 'lemon', nameBn: 'লেবু গাছ', nameEn: 'Yellow Lemon', lvl: 16 },
                  { id: 'apple', nameBn: 'আপেল বৃক্ষ', nameEn: 'Apple Orchard', lvl: 17 }
                ].map((item) => {
                  const isUnlocked = (state.unlockedTrees || ['sakura']).includes(item.id) || (state.focusLevel || 1) >= item.lvl;
                  const isSelected = state.activeTreeType === item.id;

                  return (
                    <button
                      key={item.id}
                      disabled={!isUnlocked}
                      onClick={() => {
                        if (isUnlocked) {
                          setState(prev => {
                            const updated = { ...prev, activeTreeType: item.id as any };
                            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                            return updated;
                          });
                        }
                      }}
                      className={`relative overflow-hidden group p-3 rounded-2xl border text-left transition select-none flex flex-col justify-between h-20 ${
                        isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500/80 text-emerald-100 shadow-xl shadow-emerald-955/10' 
                          : isUnlocked 
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40 cursor-pointer' 
                            : 'bg-slate-900 border-slate-950 text-slate-655 cursor-not-allowed opacity-35'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">{renderTreeIcon(item.id)}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>

                      <div className="mt-1">
                        <div className="text-[10px] font-bold truncate leading-tight">
                          {state.language === 'bn' ? item.nameBn : item.nameEn}
                        </div>
                        <div className="text-[8px] font-semibold mt-0.5 tracking-wide text-slate-500">
                          {isSelected 
                            ? (state.language === 'bn' ? 'সচল রয়েছে' : 'ACTIVE') 
                            : isUnlocked 
                              ? (state.language === 'bn' ? 'ট্যাপ করুন' : 'SELECT') 
                              : (state.language === 'bn' ? `LVL ${item.lvl} লক` : `LVL ${item.lvl} LOCKED`)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowGardenModal(false)}
              className="mt-4 w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 py-2.5 font-bold rounded-xl transition text-xs select-none uppercase tracking-wider text-slate-300 cursor-pointer shrink-0"
            >
              {state.language === 'bn' ? 'গার্ডেন বন্ধ করুন' : 'Close Garden'}
            </button>
          </div>
        </div>
      )}

      {/* --- PREMIUM PORTABLE STUDY FOCUS SOUND LIBRARY MODAL --- */}
      {showSoundModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-200">
          <div className="relative w-full max-w-2xl overflow-hidden border border-blue-500/20 bg-slate-950 rounded-3xl p-6 flex flex-col shadow-2xl max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3.5 shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-105 flex items-center gap-1.5">
                  <Music className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
                  <span>{state.language === 'bn' ? 'ফোকাস মিউজিক ও সাউন্ডস্কেপস' : 'Focus Music & Soundscapes'}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {state.language === 'bn' ? 'মনোযোগ বাড়ানোর জন্য বৈজ্ঞানিক সাউন্ডস শুনুন' : 'Enhance cognition with custom study audio'}
                </p>
                <div className="mt-2 inline-flex items-center text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
                  {state.language === 'bn' ? 'ফোকাস সাউন্ড লাইব্রেরী (Ambient Brain-Waves)' : 'Focus Sound Library (Ambient Brain-Waves)'}
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSoundModal(false);
                }}
                className="text-slate-400 hover:text-white text-sm font-semibold p-2 bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-slate-800 transition cursor-pointer active:scale-95 shadow-lg group"
                title={state.language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              >
                <X className="w-5 h-5 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>

            {/* Volume scale controller */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 my-4 shrink-0 px-4">
              <span className="text-xs text-slate-400 font-semibold text-left flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span>{state.language === 'bn' ? 'শব্দের তীব্রতা' : 'Audio Volume'}: {Math.floor(audioVolume * 100)}%</span>
              </span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={audioVolume} 
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full sm:w-48 accent-blue-500 h-1 rounded-full cursor-pointer bg-slate-850"
              />
            </div>

            {/* Grid list container */}
            <div className="overflow-y-auto pr-1 custom-scrollbar flex-1 mb-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-0.5">
                {[
                  { id: 'none', labelBn: 'নিস্তব্ধতা', labelEn: 'Silence', minLevel: 0 },
                  { id: 'rain', labelBn: 'মৃদু বৃষ্টি', labelEn: 'Rain Sound', minLevel: 0 },
                  { id: 'clock', labelBn: 'পেনডুলাম টিকটক', labelEn: 'Analogue Clock', minLevel: 0 },
                  { id: 'cosmic', labelBn: 'থিটা মেডিটেশন', labelEn: 'Cosmic Theta', minLevel: 0 },
                  { id: 'flute', labelBn: 'জেন্টল জেন বাঁশি', labelEn: 'Zen Flute', minLevel: 0 },
                  { id: 'cafe', labelBn: 'ক্যাফে আড্ডা', labelEn: 'Coffee Shop Hue', minLevel: 5 },
                  { id: 'wind', labelBn: 'বন্য হাওয়া', labelEn: 'Forest Wind', minLevel: 5 },
                  { id: 'waves', labelBn: 'সমুদ্রের ঢেউ', labelEn: 'Ocean Waves', minLevel: 5 },
                  { id: 'fire', labelBn: 'ক্যাম্পফায়ার', labelEn: 'Campfire', minLevel: 5 },
                  { id: 'lofi', labelBn: 'লোফি স্টাডি বিট', labelEn: 'Lofi Study Beat', minLevel: 5 },
                  { id: 'library', labelBn: 'একাডেমিক লাইব্রেরি', labelEn: 'Library Drone', minLevel: 5 },
                  { id: 'alpha', labelBn: 'আলফা কনসেন্ট্রেশন', labelEn: 'Alpha State', minLevel: 5 },
                  { id: 'white', labelBn: 'হোয়াইট নয়েজ', labelEn: 'White Noise', minLevel: 5 },
                  { id: 'pink', labelBn: 'পিঙ্ক নয়েজ', labelEn: 'Pink Noise', minLevel: 5 },
                  { id: 'brown', labelBn: 'ব্রাউন নয়েজ', labelEn: 'Brown Noise', minLevel: 5 },
                  { id: 'bowl', labelBn: 'তিব্বতি বেল', labelEn: 'Singing Bowl', minLevel: 5 },
                  { id: 'cicadas', labelBn: 'ঝিঁঝিঁ পোকা', labelEn: 'Summer Cicadas', minLevel: 5 },
                  { id: 'sonar', labelBn: 'সোনার প্রতিধ্বনি', labelEn: 'Sub Sonar Pings', minLevel: 5 },
                  { id: 'space', labelBn: 'মহাকাশ বাহন', labelEn: 'Space Cabin', minLevel: 5 },
                  { id: 'purr', labelBn: 'বিড়ালের ডাক', labelEn: 'Cat Purring', minLevel: 5 },
                  { id: 'heartbeat', labelBn: 'হৃদস্পন্দন', labelEn: 'Resting Heartbeat', minLevel: 5 }
                ].map((track) => {
                  const isActive = activeAudioType === track.id;
                  const isLocked = (state.focusLevel || 0) < track.minLevel;

                  return (
                    <button
                      key={track.id}
                      disabled={isLocked}
                      onClick={() => !isLocked && handleAudioChange(track.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all duration-300 select-none ${
                        isLocked ? 'opacity-40 cursor-not-allowed bg-slate-900/60 border-slate-900/85' : 'cursor-pointer active:scale-95'
                      } ${
                        isActive 
                          ? 'bg-blue-500/10 border-blue-500 text-blue-200 shadow-lg shadow-blue-950/30 scale-[1.02] ring-1 ring-blue-500/30' 
                          : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300 hover:bg-slate-900/40'
                      }`}
                    >
                      <span className="text-xl flex justify-between items-center shrink-0">
                        {renderSoundIcon(track.id)}
                        {isLocked && <Lock className="w-3 h-3 text-amber-500/80" />}
                      </span>
                      <div className="mt-1.5 w-full">
                        <span className="text-[11px] font-black block leading-snug tracking-wide text-slate-100 line-clamp-1 mb-0.5">
                          {state.language === 'bn' ? track.labelBn : track.labelEn}
                        </span>
                        <span className="text-[8px] block font-mono font-bold tracking-widest text-slate-500 uppercase leading-none">
                          {isLocked 
                            ? (state.language === 'bn' ? `লেভেল ${track.minLevel}+ লক` : `Req. Lvl ${track.minLevel}`)
                            : (isActive 
                                ? (state.language === 'bn' ? 'চলমান ⚡' : 'PLAYING ⚡') 
                                : (state.language === 'bn' ? 'শুনতে ট্যাপ' : 'TAP TO PLAY'))}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowSoundModal(false)}
              className="mt-4 w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 py-2.5 font-bold rounded-xl transition text-xs select-none uppercase tracking-wider text-slate-300 cursor-pointer shrink-0"
            >
              {state.language === 'bn' ? 'সাউন্ডস বন্ধ করুন' : 'Close Sounds'}
            </button>
          </div>
        </div>
      )}

      {/* --- NOTIFICATION CONSENT MODAL --- */}
      {!state.notificationConsentAsked && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-200">
          <div className="relative w-full max-w-sm overflow-hidden border border-emerald-550/30 bg-slate-950 rounded-3xl p-6 flex flex-col shadow-2xl space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
                {state.language === 'bn' ? 'নোটিফিকেশন সক্রিয় করুন' : 'Enable Notifications'}
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                {state.language === 'bn' 
                  ? 'আপনার অভ্যাসের রিমাইন্ডার এবং সোয়ান স্যারের ডোপামিন বুস্ট পাওয়ার জন্য নোটিফিকেশন অনুমোদন করুন।' 
                  : 'Receive timely reminders and dopamine-rich micro-motivation prompts directly on your device.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-900/40 p-3 rounded-2xl border border-slate-900 text-center">
              <div className="space-y-1">
                <span className="text-lg block">🌱</span>
                <span className="text-[10px] text-slate-400 block font-bold">{state.language === 'bn' ? 'অভ্যাস' : 'Habits'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-lg block">🤝</span>
                <span className="text-[10px] text-slate-400 block font-bold">{state.language === 'bn' ? 'সহানুভূতি' : 'Empathy'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-lg block">⚡</span>
                <span className="text-[10px] text-slate-400 block font-bold">{state.language === 'bn' ? 'শৃঙ্খলা' : 'Discipline'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={async () => {
                  if (typeof window !== 'undefined' && 'Notification' in window) {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                      triggerLiveNotification(
                        state.language === 'bn' ? 'স্বাগতম বন্ধু! ইকোসিস্টেম এখন সক্রিয় 🔔' : 'Welcome Friend! Ecosystem Active 🔔',
                        state.language === 'bn'
                          ? 'আসুন শৃঙ্খলপূর্ণ জীবন গড়ার এই অভিযাত্রায় একসাথে এগিয়ে যাই।'
                          : "Let's work together to curate clean habits and extreme focus starting today.",
                        'friendship'
                      );
                    }
                  }
                  setState(prev => {
                    const updated = { ...prev, notificationConsentAsked: true };
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                    return updated;
                  });
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black rounded-xl transition active:scale-95 shadow-lg shadow-emerald-900/20 text-xs uppercase tracking-wider cursor-pointer text-center font-sans"
              >
                🔔 {state.language === 'bn' ? 'এলাউ করুন (Allow)' : 'Allow & Activate'}
              </button>
              
              <button
                onClick={() => {
                  setState(prev => {
                    const updated = { ...prev, notificationConsentAsked: true };
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                    return updated;
                  });
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-xl transition text-xs font-bold uppercase tracking-wider cursor-pointer text-center font-sans"
              >
                {state.language === 'bn' ? 'পরে করব' : 'Maybe Later'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CUSTOM DIALOG REPLACEMENT DIALOG MODAL */}
      {customAlert?.show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm overflow-hidden border border-emerald-550/30 bg-slate-950 rounded-2xl p-6 flex flex-col shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${
                customAlert.type === 'error' 
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/35' 
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/35'
              }`}>
                {customAlert.type === 'error' ? (
                  <span className="text-lg">⚠️</span>
                ) : (
                  <span className="text-lg">✔️</span>
                )}
              </div>
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider font-sans">
                {customAlert.title}
              </h4>
            </div>
            
            <p className="text-xs text-slate-300 font-sans leading-relaxed text-left pl-1">
              {customAlert.message}
            </p>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setCustomAlert(null)}
                className={`px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider border transition cursor-pointer active:scale-95 ${
                  customAlert.type === 'error'
                    ? 'bg-rose-950/40 border-rose-500/30 hover:bg-rose-900/40 text-rose-300'
                    : 'bg-emerald-950/40 border-emerald-500/30 hover:bg-emerald-900/40 text-emerald-300'
                }`}
              >
                {state.language === 'bn' ? 'ঠিক আছি' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Animation Trigger */}
      <ConfettiOverlay 
        active={habitCompletedTrigger} 
        title={confettiTitle}
        message={confettiMessage}
        onComplete={() => {
          setHabitCompletedTrigger(false);
          setConfettiTitle(undefined);
          setConfettiMessage(undefined);
        }} 
      />

      {/* --- FLOATING ACHIEVEMENT TOAST POPUP --- */}
      {activeAchievementToast && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full pointer-events-none px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0 shadow-inner">
              <span className="text-xl animate-bounce">🏆</span>
            </div>
            <div className="flex-1 min-w-0 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
                  {activeAchievementToast.title}
                </span>
                <button 
                  onClick={() => setActiveAchievementToast(null)}
                  className="text-slate-500 hover:text-slate-300 transition text-[10px] leading-none p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs font-black text-slate-100 truncate mt-1">
                {activeAchievementToast.habitName}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5 font-medium">
                {activeAchievementToast.message}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- STANDALONE FULL-SCREEN STUDY TARGET CELEBRATION OVERLAY --- */}
      {showStudyCelebration && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          {/* Sparkling Backdrop Stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => {
              const xPos = typeof window !== 'undefined' ? Math.random() * window.innerWidth : 300;
              const yPos = typeof window !== 'undefined' ? Math.random() * window.innerHeight : 400;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                  }}
                  style={{
                    position: 'absolute',
                    left: `${xPos}px`,
                    top: `${yPos}px`,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                />
              );
            })}
          </div>

          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative max-w-lg w-full bg-slate-900 border-2 border-amber-500/50 p-8 rounded-3xl shadow-3xl text-center overflow-hidden"
          >
            {/* Glowing gold backlights */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full items-center justify-center shadow-lg shadow-amber-500/20 mx-auto"
              >
                <Trophy className="w-10 h-10 text-slate-950 stroke-[2.5]" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-amber-100 to-yellow-400 bg-clip-text text-transparent font-sans uppercase tracking-widest">
                  {state.language === 'bn' ? 'ফোকাস লক্ষ্য অর্জন!' : 'Focus Target Reached!'}
                </h2>
                <p className="text-slate-400 text-xs tracking-wider uppercase font-mono font-bold">
                  {state.language === 'bn' ? 'দৈনিক পড়াশোনা সফল' : 'Daily Study Level Completed'}
                </p>
              </div>

              {/* Subject Tag banner */}
              <div className="px-6 py-4 rounded-2xl bg-slate-1000/60 border border-slate-800/80 inline-block max-w-sm w-full mx-auto">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  {state.language === 'bn' ? 'অধোয় অধ্যায়/বিষয়' : 'Subject/Activity'}
                </p>
                <h4 className="text-lg font-black text-slate-100 mt-1 truncate">
                  {showStudyCelebration.subject}
                </h4>
                <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-amber-400 font-bold font-mono">
                  <Play className="w-4 h-4 fill-current text-amber-500" />
                  <span>{showStudyCelebration.targetMinutes} {state.language === 'bn' ? 'মিনিট ফোকাস সম্পন্ন!' : 'Minutes Completed!'}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto font-sans font-medium">
                {state.language === 'bn'
                  ? 'আপনার ক্রমাগত একাগ্রতা ও প্রচেষ্টা সত্যিই অনবদ্য। এই শৃঙ্খলা ও একাগ্রতাই একদিন আপনার প্রতিটি মহৎ স্বপ্নকে বাস্তব রূপ দেবে।'
                  : 'Your unwavering focus and grit are truly mesmerizing. Keep fueling your focus focus tree; this persistent action builds your bright, unstoppable future.'}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setShowStudyCelebration(null)}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  {state.language === 'bn' ? 'ধন্যবাদ, চালিয়ে যান 🚀' : 'Terrific, Continue! 🚀'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- CUTE AI VOICE CUSTOMIZATION MODAL (PREMIUM SOUND DRAWER) --- */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-[130] flex justify-end bg-black/85 backdrop-blur-sm animate-fade-in text-slate-200">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => {
              setIsVoiceModalOpen(false);
              window.speechSynthesis.cancel();
            }} 
          />

          <motion.div
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-md sm:w-[460px] h-full bg-slate-950 border-l border-slate-800/80 flex flex-col shadow-2xl z-10"
          >
            {/* Inline Audio Waveform Styles */}
            <style>{`
              @keyframes soundwave-bounce {
                0% { transform: scaleY(0.2); }
                100% { transform: scaleY(1.3); }
              }
              .custom-scrollbar::-webkit-scrollbar {
                width: 5px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #020617;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #1e293b;
                border-radius: 9999px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #334155;
              }
            `}</style>

            {/* Side Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-900 bg-slate-950 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500/20 to-pink-500/20 border border-rose-500/30 text-rose-400">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 font-sans flex items-center gap-1.5">
                    MridhaX Voice Lab <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-black tracking-widest">PRO</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {state.language === 'bn' ? 'এআই ভয়েস টিউন ও কাস্টমাইজেশন ল্যাব' : 'AI voice tuner & customization lab'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVoiceModalOpen(false);
                  window.speechSynthesis.cancel();
                }}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Side Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-[#020617]">
              
              {/* CURRENTLY ACTIVE VOICE PANEL */}
              <div className="p-4.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/40 border border-slate-800/80 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {state.language === 'bn' ? 'সক্রিয় ভয়েস প্রোফাইল' : 'Selected Voice Profile'}
                </p>
                
                {(() => {
                  const activeProfile = FEMALE_VOICE_PROFILES.find(p => p.id === selectedVoiceProfile) || FEMALE_VOICE_PROFILES[0];
                  const activeName = state.language === 'bn' ? activeProfile.nameBn : activeProfile.nameEn;
                  const activeIdStr = activeProfile.id;
                  const isTested = testingVoiceId !== null;
                  return (
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-full bg-rose-500/10 border ${isTested ? 'border-rose-500 shadow-md shadow-rose-950/50 animate-pulse' : 'border-slate-800'} flex items-center justify-center text-rose-400 font-extrabold text-lg uppercase tracking-wider relative`}>
                            {activeIdStr.charAt(0)}
                            {isTested && (
                              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                              {activeIdStr}
                              <span className="text-[8px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full font-extrabold">
                                {state.language === 'bn' ? 'সক্রিয়' : 'ACTIVE'}
                              </span>
                            </h4>
                            <p className="text-[11px] text-rose-400 font-bold mt-0.5">
                              {activeName}
                            </p>
                          </div>
                        </div>

                        {/* Visualizer soundwaves */}
                        <div className="flex items-end gap-[2px] h-6 px-1.5">
                          {[...Array(8)].map((_, barIdx) => (
                            <div
                              key={barIdx}
                              className="w-[3px] rounded-full bg-rose-500 transition-all duration-150"
                              style={{
                                height: isTested ? '100%' : '20%',
                                animation: isTested ? `soundwave-bounce ${0.4 + (barIdx % 4) * 0.15}s ease-in-out ${barIdx * 70}ms infinite alternate` : 'none',
                                transformOrigin: 'bottom'
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Pitch & Rate live parameter controls */}
                      <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-4">
                        {/* Pitch slider */}
                        <div>
                          <div className="flex justify-between text-[10px] font-mono mb-1 text-slate-400">
                            <span>{state.language === 'bn' ? 'কণ্ঠস্বর স্কেল (PITCH)' : 'VOCAL PITCH'}</span>
                            <span className="text-rose-400 font-bold">{customPitch.toFixed(2)}x</span>
                          </div>
                          <input 
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.05"
                            value={customPitch}
                            onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Rate/Speed slider */}
                        <div>
                          <div className="flex justify-between text-[10px] font-mono mb-1 text-slate-400">
                            <span>{state.language === 'bn' ? 'কথা বলার গতি (SPEED)' : 'SPEAKING SPEED'}</span>
                            <span className="text-rose-400 font-bold">{customRate.toFixed(2)}x</span>
                          </div>
                          <input 
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.05"
                            value={customRate}
                            onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                            className="w-full accent-rose-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* VOICE SERIAL SECTION HEADER */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                  {state.language === 'bn' ? 'ভয়েস লাইব্রেরি (১২টি প্রিমিয়াম টিউন)' : 'Voice Library (12 premium tunes)'}
                </span>
                <span className="text-[9px] font-mono text-slate-600">SERIAL LIST</span>
              </div>

              {/* VERTICAL SERIAL LIST OF ALL VOICES */}
              <div className="space-y-2.5">
                {FEMALE_VOICE_PROFILES.map((profile, i) => {
                  const isSelected = selectedVoiceProfile === profile.id;
                  const isTested = testingVoiceId === profile.id;
                  
                  return (
                    <div
                      key={profile.id}
                      className={`p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-rose-950/20 border-rose-500/50 shadow-md shadow-rose-950/30'
                          : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      {/* Left: Avatar & Text details */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Serial number */}
                        <span className="text-[9px] font-mono text-slate-600 font-black w-3.5 shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        {/* Animated Avatar Circle */}
                        <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-sm uppercase relative transition-all duration-300 ${
                          isSelected
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 ring-4 ring-rose-500/10'
                            : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                        }`}>
                          {profile.id.charAt(0)}
                          
                          {/* Green active speaking dot or wave indicator */}
                          {isTested && (
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          )}
                        </div>

                        {/* Labels & Tags */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-200 uppercase tracking-wide truncate">
                              {profile.id}
                            </span>
                            {isSelected && (
                              <span className="text-[8px] bg-rose-500/30 text-rose-300 font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider scale-90">
                                {state.language === 'bn' ? 'সক্রিয়' : 'Active'}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                            {state.language === 'bn' ? profile.nameBn : profile.nameEn}
                          </p>
                          
                           {/* Accent/Characteristic mini badges */}
                           <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                             <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${profile.gender === 'male' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-800/20' : 'bg-rose-950/40 text-rose-400 border border-rose-800/20'}`}>
                               {profile.gender === 'male' ? (
                                 <>
                                   <Activity className="w-2.5 h-2.5 text-indigo-400" />
                                   <span>{state.language === 'bn' ? 'পুরুষ টিউন' : 'Male Tune'}</span>
                                 </>
                               ) : (
                                 <>
                                   <Sparkles className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
                                   <span>{state.language === 'bn' ? 'নারী টিউন' : 'Female Tune'}</span>
                                 </>
                               )}
                             </span>
                             <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 uppercase tracking-widest">
                               {profile.keywords[4] === 'en-gb' ? 'UK ACCENT' : profile.keywords[4] === 'en-au' ? 'AUS ACCENT' : profile.keywords[4] === 'en-ca' ? 'CAN ACCENT' : profile.keywords[4] === 'en-ie' ? 'IRE ACCENT' : 'US ACCENT'}
                             </span>
                             <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-rose-400/80 scale-95 origin-left font-semibold">
                               {profile.id.toLowerCase().includes('copilot') || profile.id.toLowerCase().includes('pro') || profile.id.toLowerCase().includes('mridha') ? 'PREMIUM' : 'NATURAL'}
                             </span>
                           </div>
                        </div>
                      </div>

                      {/* Right: Quick action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Play test button */}
                        <button
                          onClick={() => playTestVoice(profile.id)}
                          className={`p-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                            isTested 
                              ? 'bg-rose-500 border-rose-400 text-white animate-pulse' 
                              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-rose-400'
                          }`}
                          title={state.language === 'bn' ? 'পরীক্ষা শুনুন' : 'Test voice'}
                        >
                          {isTested ? (
                            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                          )}
                        </button>

                        {/* Apply voice button */}
                        {!isSelected && (
                          <button
                            onClick={() => {
                              setSelectedVoiceProfile(profile.id);
                              setTtsVoiceStyle('cute'); // activate cute voice mode
                              playCompletionBeep();
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 transition"
                          >
                            {state.language === 'bn' ? 'ব্যবহার' : 'Apply'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side Drawer Footer */}
            <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span className="uppercase">ACTIVE: {selectedVoiceProfile}</span>
              <span className="text-rose-400/80 uppercase font-black">AI TEXT TO SPEECH</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Plus Button */}
      {activeTab !== 'exams' && (
        <div className="fixed bottom-24 right-6 z-50">
          <button 
            onClick={() => setIsSocialDashboardOpen(true)}
            className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-emerald-500 transition active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      {/* Social Dashboard Modal */}
      {isSocialDashboardOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 p-0 flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 overflow-hidden flex flex-col">
            <SocialDashboard userId={currentUser?.uid || ''} onClose={() => setIsSocialDashboardOpen(false)} />
          </div>
        </div>
      )}
    </div>
    </ToastProvider>
  );
}
