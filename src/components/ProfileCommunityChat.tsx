import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCircle, 
  MessageSquare, 
  Send, 
  Loader2, 
  Sparkles, 
  Globe, 
  Zap, 
  Activity, 
  Award, 
  ChevronRight, 
  Sparkle,
  LogIn,
  Search,
  MessageCircle,
  Hash,
  User,
  Heart,
  Smile,
  Trophy,
  Clock,
  BookOpen
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where 
} from 'firebase/firestore';
import { db, auth, loginWithGoogle } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { AppState } from '../types';

interface ProfileCommunityChatProps {
  state: AppState;
  saveState: (s: AppState) => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: any;
  avatarUrl?: string;
  grade?: string;
  userRank?: string;
}

interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  text: string;
  timestamp: any;
}

interface UserListItem {
  userId: string;
  name: string;
  avatarUrl?: string;
  age?: string;
  grade?: string;
  favSubjects?: string;
  interests?: string;
  isOnline?: boolean;
  currentActivity?: string;
  totalFocusMinutes?: number;
  prayerConsistency?: number;
  habitConsistency?: number;
  userRank?: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Community Chat Error: ', JSON.stringify(errInfo));
}

export const ProfileCommunityChat: React.FC<ProfileCommunityChatProps> = ({ state, saveState }) => {
  const isBn = state.language === 'bn';
  const [activeTab, setActiveTab] = useState<'public' | 'direct'>('public');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  
  // Public Chat States
  const [publicMessages, setPublicMessages] = useState<ChatMessage[]>([]);
  const [publicInput, setPublicInput] = useState('');
  const [isSendingPublic, setIsSendingPublic] = useState(false);
  
  // Direct Chat States
  const [usersList, setUsersList] = useState<UserListItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [directInput, setDirectInput] = useState('');
  const [isSendingDirect, setIsSendingDirect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showStudentCard, setShowStudentCard] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const directEndRef = useRef<HTMLDivElement>(null);

  // Fallback states for guest/offline users (simulated active companions for demonstration)
  const [guestName] = useState(() => {
    return localStorage.getItem('mridhax_guest_name') || (isBn ? 'ভিজিটর বন্ধু' : 'Guest Student');
  });
  const [guestAvatar] = useState(() => {
    return localStorage.getItem('mridhax_guest_avatar') || `https://api.dicebear.com/7.x/avataaars/svg?seed=guest_${Date.now()}`;
  });
  
  const [fallbackPublicMessages, setFallbackPublicMessages] = useState<ChatMessage[]>([
    {
      id: 'f1',
      userId: 'sohan_coach',
      userName: 'Coach Sohan Mridha',
      text: isBn 
        ? 'আসসালামু আলাইকুম চ্যামস! পড়াশোনায় ধারাবাহিকতা রাখতে প্রতিদিন গোল ট্র্যাকিং মিস করবে না। ফোকাসড থাকো! 🔥🚀'
        : 'Assalamu Alaikum Champs! To stay consistent, do not miss daily goal tracking. Stay focused! 🔥🚀',
      timestamp: new Date(Date.now() - 3600000 * 2),
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=sohan',
      grade: isBn ? 'মেন্টর' : 'Academic Mentor',
      userRank: 'Pro'
    },
    {
      id: 'f2',
      userId: 'mim_s',
      userName: 'Mim S',
      text: isBn 
        ? 'আজকে আমি ৪ ঘণ্টা ফোকাস সেশন কমপ্লিট করেছি। দারুণ ভালো লাগছে!'
        : 'I completed a 4-hour focus study session today. Feeling absolutely amazing!',
      timestamp: new Date(Date.now() - 3600000),
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mim',
      grade: isBn ? '১০ম শ্রেণী' : 'Grade 10',
      userRank: 'Gold'
    },
    {
      id: 'f3',
      userId: 'robin_rahman',
      userName: 'Robin Rahman',
      text: isBn 
        ? 'গণিত চ্যাপ্টার ২ এর সূত্রগুলো রিভিশন করছি। কার কার এক্সাম সামনে?'
        : 'Revising Math Chapter 2 formulae. Who has exams coming up soon?',
      timestamp: new Date(Date.now() - 1800000),
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robin',
      grade: isBn ? '১২শ শ্রেণী' : 'Grade 12',
      userRank: 'Platinum'
    }
  ]);

  const [fallbackDirectMessages, setFallbackDirectMessages] = useState<Record<string, DirectMessage[]>>({});

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Real-time Public Messages
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          userId: data.userId || 'unknown',
          userName: data.userName || 'MridhaX Learner',
          text: data.text || '',
          timestamp: data.timestamp || { toDate: () => new Date() },
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.userId}`,
          grade: data.grade || (isBn ? 'শিক্ষার্থী' : 'Student'),
          userRank: data.userRank || 'Bronze'
        });
      });
      setPublicMessages(msgs.reverse());
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'messages');
    });

    return () => unsubscribe();
  }, [isBn]);

  // Fetch registered users for Direct Messaging list
  useEffect(() => {
    if (!currentUser) return;
    setLoadingUsers(true);

    const q = query(
      collection(db, 'users'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: UserListItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId !== currentUser.uid) { // Exclude self
          const mins = data.totalFocusMinutes || 0;
          let calculatedRank = 'Bronze';
          if (mins >= 1500) calculatedRank = 'Legend';
          else if (mins >= 1000) calculatedRank = 'Pro';
          else if (mins >= 500) calculatedRank = 'Platinum';
          else if (mins >= 200) calculatedRank = 'Gold';
          else if (mins >= 50) calculatedRank = 'Silver';

          list.push({
            userId: data.userId,
            name: data.name || 'Anonymous Student',
            avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.userId}`,
            age: data.age || '',
            grade: data.grade || (isBn ? '১১শ শ্রেণী' : 'Grade 11'),
            favSubjects: data.favSubjects || '',
            interests: data.interests || '',
            isOnline: data.isOnline !== undefined ? data.isOnline : false,
            currentActivity: data.currentActivity || (isBn ? 'পড়াশোনা করছেন' : 'Studying'),
            totalFocusMinutes: mins,
            prayerConsistency: data.prayerConsistency || 0,
            habitConsistency: data.habitConsistency || 0,
            userRank: calculatedRank
          });
        }
      });
      setUsersList(list);
      setLoadingUsers(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
      setLoadingUsers(false);
    });

    return () => unsubscribe();
  }, [currentUser, isBn]);

  // Subscribe to Real-time Direct Messages for selected contact
  useEffect(() => {
    if (!currentUser || !selectedUser) {
      setDirectMessages([]);
      return;
    }

    const roomId = [currentUser.uid, selectedUser.userId].sort().join('_');
    const q = query(
      collection(db, 'direct_messages'),
      where('roomId', '==', roomId),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: DirectMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          roomId: data.roomId,
          text: data.text,
          timestamp: data.timestamp || { toDate: () => new Date() }
        });
      });
      setDirectMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'direct_messages');
    });

    return () => unsubscribe();
  }, [currentUser, selectedUser]);

  // Scroll views to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [publicMessages, fallbackPublicMessages, activeTab]);

  useEffect(() => {
    directEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages, selectedUser]);

  // Handle Send Public Message
  const handleSendPublic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicInput.trim()) return;

    const messageText = publicInput.trim();
    setPublicInput('');
    setIsSendingPublic(true);

    if (currentUser) {
      try {
        const path = 'messages';
        await addDoc(collection(db, path), {
          userId: currentUser.uid,
          userName: currentUser.displayName || state.userProfile?.name || 'MridhaX Learner',
          text: messageText,
          timestamp: serverTimestamp(),
          avatarUrl: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
          grade: state.userProfile?.grade || (isBn ? '১১শ শ্রেণী' : 'Grade 11'),
          userRank: state.totalStudyMinutes && state.totalStudyMinutes > 1000 ? 'Pro' : 'Bronze'
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'messages');
      } finally {
        setIsSendingPublic(false);
      }
    } else {
      // Guest User offline local append simulation
      const guestMsg: ChatMessage = {
        id: `g_${Date.now()}`,
        userId: 'guest_uid',
        userName: guestName,
        text: messageText,
        timestamp: new Date(),
        avatarUrl: guestAvatar,
        grade: isBn ? 'গেস্ট' : 'Guest Student',
        userRank: 'Novice'
      };
      const updated = [...fallbackPublicMessages, guestMsg];
      setFallbackPublicMessages(updated);
      setIsSendingPublic(false);

      // Simple mock peer replies to make guest mode feel interactive!
      setTimeout(() => {
        const peers = [
          { name: 'Mim S', text: isBn ? 'খুব সুন্দর কথা বলেছেন ভাইয়া! চলেন পড়ার টেবিলে ফেরা যাক।' : 'Very well said! Let\'s get back to the studying desk.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mim', grade: isBn ? '১০ম শ্রেণী' : 'Grade 10', rank: 'Gold' },
          { name: 'Robin Rahman', text: isBn ? 'আসুন আজকে সর্বোচ্চ গোল অর্জন করি!' : 'Let\'s achieve the daily micro-goals with maximum consistency!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robin', grade: isBn ? '১২শ শ্রেণী' : 'Grade 12', rank: 'Platinum' }
        ];
        const randomPeer = peers[Math.floor(Math.random() * peers.length)];
        const peerMsg: ChatMessage = {
          id: `peer_${Date.now()}`,
          userId: randomPeer.name.toLowerCase().replace(' ', '_'),
          userName: randomPeer.name,
          text: randomPeer.text,
          timestamp: new Date(),
          avatarUrl: randomPeer.avatar,
          grade: randomPeer.grade,
          userRank: randomPeer.rank
        };
        setFallbackPublicMessages([...updated, peerMsg]);
      }, 1500);
    }
  };

  // Handle Send Direct Message
  const handleSendDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directInput.trim() || !selectedUser) return;

    const messageText = directInput.trim();
    setDirectInput('');
    setIsSendingDirect(true);

    if (currentUser) {
      try {
        const roomId = [currentUser.uid, selectedUser.userId].sort().join('_');
        await addDoc(collection(db, 'direct_messages'), {
          senderId: currentUser.uid,
          receiverId: selectedUser.userId,
          roomId: roomId,
          text: messageText,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'direct_messages');
      } finally {
        setIsSendingDirect(false);
      }
    } else {
      // Offline/Guest fallback simulation
      const roomId = `guest_${selectedUser.userId}`;
      const newMsg: DirectMessage = {
        id: `dm_${Date.now()}`,
        senderId: 'guest_uid',
        receiverId: selectedUser.userId,
        roomId: roomId,
        text: messageText,
        timestamp: new Date()
      };
      
      const currentRoomMsgs = fallbackDirectMessages[roomId] || [];
      const updatedRoomMsgs = [...currentRoomMsgs, newMsg];
      
      setFallbackDirectMessages({
        ...fallbackDirectMessages,
        [roomId]: updatedRoomMsgs
      });
      setIsSendingDirect(false);

      // Simulated auto reply from peer
      setTimeout(() => {
        const replyMsg: DirectMessage = {
          id: `dm_reply_${Date.now()}`,
          senderId: selectedUser.userId,
          receiverId: 'guest_uid',
          roomId: roomId,
          text: isBn 
            ? `দারুণ কথা দোস্ত! চলো একসাথে পড়ার টেবিলে সর্বোচ্চ ফোকাস দিয়ে আজকের সেশনটি শেষ করি। ⚡💪` 
            : `Absolutely great! Let's complete today's session together with ultimate focus. ⚡💪`,
          timestamp: new Date()
        };
        setFallbackDirectMessages(prev => ({
          ...prev,
          [roomId]: [...updatedRoomMsgs, replyMsg]
        }));
      }, 1200);
    }
  };

  // Mock Active Offline Buddies when guest is active
  const fallbackBuddies: UserListItem[] = [
    {
      userId: 'coach_sohan_coach',
      name: 'Coach Sohan Mridha',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=sohan',
      age: '32',
      grade: isBn ? 'সিনিয়র মেন্টর' : 'Senior Mentor',
      favSubjects: isBn ? 'ক্যারিয়ার গাইডেন্স, সেলফ-ডেভেলপমেন্ট' : 'Career Planning, High-Performance Motivation',
      interests: isBn ? 'শিক্ষার্থীদের সফলতা, বই পড়া, কোডিং' : 'Student Success, Leadership, Philosophy',
      isOnline: true,
      currentActivity: isBn ? 'গাইডেন্স প্রদান করছেন' : 'Conducting live mentorship',
      totalFocusMinutes: 12450,
      prayerConsistency: 100,
      habitConsistency: 98,
      userRank: 'Legend'
    },
    {
      userId: 'mim_buddy',
      name: 'Mim S',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mim',
      age: '16',
      grade: isBn ? '১০ম শ্রেণী' : 'Grade 10',
      favSubjects: isBn ? 'উচ্চতর গণিত, কম্পিউটার বিজ্ঞান' : 'Higher Mathematics, General Science',
      interests: isBn ? 'প্রোগ্রামিং, দাবা খেলা, রোবোটিক্স' : 'Competitive Programming, Chess, Tech Blogging',
      isOnline: true,
      currentActivity: isBn ? 'গণিত সমাধান করছেন' : 'Solving Mathematics',
      totalFocusMinutes: 4890,
      prayerConsistency: 85,
      habitConsistency: 90,
      userRank: 'Gold'
    },
    {
      userId: 'robin_buddy',
      name: 'Robin Rahman',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robin',
      age: '18',
      grade: isBn ? '১২শ শ্রেণী' : 'Grade 12',
      favSubjects: isBn ? 'পদার্থবিজ্ঞান, ইংরেজি, রসায়ন' : 'Physics, English, Organic Chemistry',
      interests: isBn ? 'ফিজিক্স অলিম্পিয়াড, সাইক্লিং' : 'Physics Olympiad, Cycling, Astronomy',
      isOnline: true,
      currentActivity: isBn ? 'ফিজিক্স সেশনে আছেন' : 'Revising Physics',
      totalFocusMinutes: 3240,
      prayerConsistency: 92,
      habitConsistency: 80,
      userRank: 'Platinum'
    }
  ];

  const currentBuddiesList = currentUser ? usersList : fallbackBuddies;
  const filteredBuddies = currentBuddiesList.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayPublicMessages = currentUser ? publicMessages : fallbackPublicMessages;
  const displayDirectMessages = currentUser 
    ? directMessages 
    : (selectedUser ? (fallbackDirectMessages[`guest_${selectedUser.userId}`] || []) : []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95 border border-slate-800/80 p-5 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.05)] text-slate-100"
    >
      {/* Absolute Cosmic Background Floating Lights */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[12s]" />
      
      {/* Background Micro Cosmic Star Particles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Cinematic Glowing Interactive Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800/80 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-emerald-400/20">
              <MessageSquare className="w-6 h-6 text-emerald-400 animate-[pulse_3s_infinite]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight uppercase bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {isBn ? 'মৃধাক্স স্টুডেন্ট চ্যাট হাব' : 'MridhaX Chat Hub'}
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              {isBn ? 'অন্যান্য শিক্ষার্থীদের সাথে বাস্তব সময়ে জ্ঞান শেয়ার করুন ও চ্যাট করুন' : 'Engage with fellow learners in high-performance real-time conversations'}
            </p>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 self-start lg:self-auto shadow-inner">
          <button 
            onClick={() => setActiveTab('public')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
              activeTab === 'public' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isBn ? 'পাবলিক আড্ডা' : 'Public Lobby'}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('direct')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
              activeTab === 'direct' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <UserCircle className="w-3.5 h-3.5" />
            <span>{isBn ? 'ব্যক্তিগত চ্যাট' : 'Direct Message'}</span>
          </button>
        </div>
      </div>

      {/* Guest Mode Prompt Card */}
      {!currentUser && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl z-10 group"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-110 transition duration-1000" />
          <div className="flex items-center gap-4 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 shadow-inner">
              <Sparkle className="w-5 h-5 animate-spin-slow text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">
                {isBn ? 'গেস্ট চ্যাট অ্যাক্সেস সক্রিয়' : 'Guest Chat Access Active'}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-lg leading-relaxed">
                {isBn 
                  ? 'আপনি গেস্ট হিসেবে চ্যাট লবিতে যুক্ত আছেন। বাস্তব সময়ে সারা বিশ্বের শিক্ষার্থীদের সাথে সরাসরি যুক্ত হতে গুগল অ্যাকাউন্ট দিয়ে ১ ক্লিকে লগইন করুন!' 
                  : 'You are viewing the community chat. To join real-time sync with other students worldwide, sign in securely with Google!'}
              </p>
            </div>
          </div>
          <button 
            onClick={loginWithGoogle}
            className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95 shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>{isBn ? 'গুগল দিয়ে লগইন করুন' : 'Login with Google'}</span>
          </button>
        </motion.div>
      )}

      {/* Primary Tab Workspace Content */}
      <div className="relative z-10 h-[650px] flex flex-col md:flex-row gap-5">
        
        {/* ==================== TAB 1: PUBLIC CHAT ROOM ==================== */}
        <AnimatePresence mode="wait">
          {activeTab === 'public' && (
            <motion.div 
              key="public-panel"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex flex-col h-full bg-slate-950/40 border border-slate-800/60 rounded-[2rem] overflow-hidden backdrop-blur-md"
            >
              {/* Room Statistics Banner */}
              <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-200 uppercase tracking-widest">#global_studylounge</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {currentUser ? `${usersList.length + 1} online` : '4 online'}
                  </span>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-400 uppercase tracking-widest font-black">
                    {isBn ? 'সক্রিয়' : 'LIVE'}
                  </span>
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {displayPublicMessages.map((m, index) => {
                  const isCurrentUser = m.userId === (currentUser?.uid || 'guest_uid');
                  
                  // Rank badge colors
                  const getRankBadge = (rank?: string) => {
                    if (rank === 'Pro' || rank === 'Mentor') {
                      return 'bg-gradient-to-r from-amber-500 to-rose-500 text-white';
                    }
                    if (rank === 'Platinum') {
                      return 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400';
                    }
                    if (rank === 'Gold') {
                      return 'bg-amber-500/10 border border-amber-500/20 text-amber-400';
                    }
                    return 'bg-slate-800 border border-slate-700 text-slate-400';
                  };

                  return (
                    <motion.div 
                      key={m.id} 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.3) }}
                      className={`flex items-start gap-3.5 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Interactive Avatar Container */}
                      <div className="relative group/avatar">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-hover/avatar:opacity-40 transition" />
                        <div className="relative w-8.5 h-8.5 rounded-xl shrink-0 overflow-hidden border border-slate-800 bg-slate-950">
                          <img src={m.avatarUrl} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Message Bubble Structure */}
                      <div className={`max-w-[75%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} space-y-1`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black text-slate-200 tracking-tight">{m.userName}</span>
                          
                          {/* Grade Tag */}
                          {m.grade && (
                            <span className="text-[7.5px] font-semibold bg-slate-900 border border-slate-800/80 px-1.5 py-0.2 rounded text-slate-500">
                              {m.grade}
                            </span>
                          )}

                          {/* Dynamic Badge */}
                          <span className={`text-[7px] font-black uppercase tracking-wider px-1 py-0.2 rounded ${getRankBadge(m.userRank)}`}>
                            {m.userRank || 'Novice'}
                          </span>

                          <span className="text-[7.5px] text-slate-600 font-mono tracking-tight">
                            {new Date(m.timestamp?.toDate ? m.timestamp.toDate() : m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Speech Bubble with unique design */}
                        <div className={`px-4 py-3 rounded-2xl text-[11.5px] leading-relaxed font-sans shadow-lg border relative ${
                          isCurrentUser
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold border-emerald-400/20 rounded-tr-none' 
                            : 'bg-slate-900/90 border-slate-800/80 text-slate-100 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {displayPublicMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
                    <Globe className="w-10 h-10 mb-2 opacity-25 animate-bounce text-emerald-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest">{isBn ? 'পাবলিক আড্ডায় এখনো কোনো মেসেজ নেই' : 'No global messages yet'}</p>
                    <p className="text-[9px] mt-1">{isBn ? 'প্রথম বার্তাটি পাঠিয়ে আড্ডা শুরু করুন!' : 'Be the first to say hello to the hub!'}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form Panel */}
              <form onSubmit={handleSendPublic} className="p-4 bg-slate-950/80 border-t border-slate-850 flex gap-2 relative z-20">
                <input 
                  type="text"
                  value={publicInput}
                  onChange={(e) => setPublicInput(e.target.value)}
                  placeholder={isBn ? 'পাবলিক আড্ডায় মেসেজ লিখুন...' : 'Broadcast something to the lounge...'}
                  className="flex-1 bg-slate-900/50 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-xs text-white outline-none placeholder-slate-600 transition duration-300"
                  disabled={isSendingPublic}
                />
                <button
                  type="submit"
                  disabled={isSendingPublic || !publicInput.trim()}
                  className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 disabled:bg-slate-800 disabled:text-slate-600 transition shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-95 cursor-pointer shrink-0"
                >
                  {isSendingPublic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 stroke-[2.5]" />}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== TAB 2: DIRECT USER-TO-USER CHAT ==================== */}
        <AnimatePresence mode="wait">
          {activeTab === 'direct' && (
            <motion.div 
              key="direct-panel"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex flex-col md:flex-row h-full gap-4"
            >
              
              {/* Users Directory Left List (Sidebar) */}
              <div className="w-full md:w-5/12 bg-slate-950/40 border border-slate-800/60 rounded-[2rem] flex flex-col h-full overflow-hidden backdrop-blur-md">
                
                {/* Custom Search Box */}
                <div className="p-4 border-b border-slate-850/80 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-7 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isBn ? 'সহপাঠী বা বন্ধু খুঁজুন...' : 'Search study companions...'}
                    className="w-full bg-slate-900/30 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-[10px] text-white outline-none focus:border-emerald-500/40 placeholder-slate-600 font-medium transition duration-300"
                  />
                </div>

                {/* Companions Scroll Directory */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                  {filteredBuddies.map((buddy) => {
                    const isSelected = selectedUser?.userId === buddy.userId;
                    
                    return (
                      <button
                        key={buddy.userId}
                        onClick={() => setSelectedUser(buddy)}
                        className={`w-full p-3 rounded-2xl flex items-center gap-3.5 transition-all duration-300 border text-left ${
                          isSelected 
                            ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.06)]' 
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                        }`}
                      >
                        {/* Avatar and status dots */}
                        <div className="relative shrink-0">
                          <div className={`w-9.5 h-9.5 rounded-xl overflow-hidden bg-slate-950 border transition duration-500 ${
                            isSelected ? 'border-emerald-500 scale-105' : 'border-slate-850'
                          }`}>
                            <img src={buddy.avatarUrl} alt={buddy.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          {buddy.isOnline && (
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
                          )}
                        </div>

                        {/* Name and metadata */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-[11px] font-black truncate text-slate-100">{buddy.name}</h4>
                            <span className="text-[7.5px] bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded text-slate-500 select-none">
                              {buddy.userRank || 'Gold'}
                            </span>
                          </div>
                          
                          <p className="text-[8.5px] font-semibold text-slate-400 truncate mt-1 flex items-center gap-1">
                            {buddy.isOnline ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                {buddy.currentActivity || (isBn ? 'সক্রিয়' : 'Active')}
                              </span>
                            ) : (
                              <>
                                <span className="text-amber-500 shrink-0">⚡</span>
                                <span>{buddy.totalFocusMinutes ? `${buddy.totalFocusMinutes}m` : buddy.grade}</span>
                              </>
                            )}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      </button>
                    );
                  })}

                  {filteredBuddies.length === 0 && (
                    <div className="text-center py-10 text-slate-600">
                      <UserCircle className="w-8 h-8 mx-auto mb-2 opacity-25" />
                      <p className="text-[10px] font-black uppercase tracking-widest">{isBn ? 'কোনো বন্ধু পাওয়া হয়নি' : 'No companions found'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat View Area Right Panel */}
              <div className="flex-1 bg-slate-950/40 border border-slate-800/60 rounded-[2rem] flex h-full overflow-hidden backdrop-blur-md relative">
                {selectedUser ? (
                  <>
                    {/* Main Chat Interface */}
                    <div className="flex-1 flex flex-col h-full min-w-0">
                      {/* Active Chat Target Header Info */}
                      <div className="p-4 border-b border-slate-850/80 bg-slate-950/20 flex items-center gap-3.5 justify-between">
                        <div 
                          className="flex items-center gap-3 min-w-0 cursor-pointer group"
                          onClick={() => setShowStudentCard(!showStudentCard)}
                        >
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group-hover:border-emerald-500 transition-all shrink-0 relative">
                            <img src={selectedUser.avatarUrl} alt={selectedUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-emerald-400" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-100 truncate group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                              {selectedUser.name}
                              <Sparkle className="w-2.5 h-2.5 text-emerald-400 animate-pulse shrink-0" />
                            </h4>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest truncate mt-0.5 flex items-center gap-1">
                              {selectedUser.isOnline ? (
                                <span className="text-emerald-400 font-black flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                  {selectedUser.currentActivity || (isBn ? 'অনলাইন' : 'Active Now')}
                                </span>
                              ) : (
                                <span>{isBn ? 'অফলাইন' : 'Offline'}</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Toggle Profile Card Button */}
                          <button 
                            type="button"
                            onClick={() => setShowStudentCard(!showStudentCard)}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 flex items-center gap-1.5 ${
                              showStudentCard 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)]' 
                                : 'bg-slate-900/80 hover:bg-slate-850 text-emerald-400 hover:text-emerald-300 border-emerald-500/20 hover:border-emerald-500/40'
                            }`}
                          >
                            <Trophy className={`w-3.5 h-3.5 ${showStudentCard ? 'animate-bounce' : 'animate-pulse'}`} />
                            <span>{isBn ? 'প্রোফাইল কার্ড' : 'Student Card'}</span>
                          </button>

                          {/* Focus status tag */}
                          <div className="text-right hidden md:block">
                            <span className="text-[8px] font-black uppercase tracking-widest bg-slate-900 text-emerald-400 border border-slate-800 px-2.5 py-1.5 rounded-xl">
                              ⚡ {selectedUser.totalFocusMinutes || 0} {isBn ? 'মিনিট' : 'Mins'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages Log view */}
                      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                        {displayDirectMessages.map((msg, index) => {
                          const isOwn = msg.senderId === (currentUser?.uid || 'guest_uid');
                          
                          return (
                            <motion.div 
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(index * 0.03, 0.35) }}
                              className={`flex items-start gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}
                            >
                              <div className="w-7 h-7 rounded-lg shrink-0 overflow-hidden border border-slate-800 shadow bg-slate-950">
                                <img 
                                  src={isOwn 
                                    ? (currentUser?.photoURL || guestAvatar) 
                                    : selectedUser.avatarUrl
                                  } 
                                  alt="Avatar" 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              
                              <div className={`max-w-[75%] space-y-0.5 flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest">
                                    {isOwn ? (isBn ? 'আমি' : 'Me') : selectedUser.name}
                                  </span>
                                  <span className="text-[7.5px] text-slate-600 font-mono">
                                    {new Date(msg.timestamp?.toDate ? msg.timestamp.toDate() : msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <div className={`px-4 py-2.5 rounded-2xl text-[11.5px] leading-relaxed font-sans shadow-lg relative border ${
                                  isOwn 
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold border-emerald-400/20 rounded-tr-none' 
                                    : 'bg-slate-900/90 border-slate-800/80 text-slate-100 rounded-tl-none'
                                }`}>
                                  {msg.text}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}

                        {displayDirectMessages.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
                            <MessageCircle className="w-8 h-8 mb-2 opacity-30 animate-pulse text-emerald-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{isBn ? 'কোনো বার্তা নেই' : 'No messages yet'}</p>
                            <p className="text-[9px] mt-1">{isBn ? 'মেসেজ পাঠিয়ে সরাসরি চ্যাট শুরু করুন!' : 'Start the peer-to-peer discussion!'}</p>
                          </div>
                        )}
                        <div ref={directEndRef} />
                      </div>

                      {/* Direct message Input Panel */}
                      <form onSubmit={handleSendDirect} className="p-3 bg-slate-950/80 border-t border-slate-850 flex gap-2">
                        <input 
                          type="text"
                          value={directInput}
                          onChange={(e) => setDirectInput(e.target.value)}
                          placeholder={isBn ? `${selectedUser.name} কে চ্যাট মেসেজ পাঠান...` : `Send direct message to ${selectedUser.name}...`}
                          className="flex-1 bg-slate-900/50 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none placeholder-slate-600 transition"
                          disabled={isSendingDirect}
                        />
                        <button
                          type="submit"
                          disabled={isSendingDirect || !directInput.trim()}
                          className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 disabled:bg-slate-800 disabled:text-slate-600 transition shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 cursor-pointer shrink-0"
                        >
                          {isSendingDirect ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 stroke-[2.5]" />}
                        </button>
                      </form>
                    </div>

                    {/* Cinematic Student Profile Card Side Drawer */}
                    <AnimatePresence>
                      {showStudentCard && (
                        <motion.div
                          initial={{ opacity: 0, x: 80 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 80 }}
                          transition={{ type: 'spring', damping: 22, stiffness: 120 }}
                          className="absolute md:relative inset-y-0 right-0 w-full md:w-80 bg-slate-950/95 md:bg-slate-950/50 border-l border-slate-800/80 flex flex-col h-full z-20 backdrop-blur-xl"
                        >
                          {/* Close Button & Header */}
                          <div className="p-4 border-b border-slate-850 bg-slate-950/40 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                {isBn ? 'স্টুডেন্ট আইডি কার্ড' : 'STUDENT CARD'}
                              </span>
                            </div>
                            <button 
                              onClick={() => setShowStudentCard(false)}
                              className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                            >
                              {isBn ? 'বন্ধ করুন' : 'Close'}
                            </button>
                          </div>

                          {/* Student Card Content (Scrollable with premium custom styling) */}
                          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar relative">
                            {/* Ambient background glows */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                            
                            {/* Card Hero Section */}
                            <div className="flex flex-col items-center text-center relative z-10">
                              {/* Avatar in double glowing rings */}
                              <div className="relative group">
                                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse"></div>
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950">
                                  <img 
                                    src={selectedUser.avatarUrl} 
                                    alt={selectedUser.name} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div className={`absolute -bottom-2 -right-2 text-[8px] font-black px-2 py-0.5 rounded-md border border-slate-900 shadow ${
                                  selectedUser.isOnline 
                                    ? 'bg-emerald-400 text-slate-950 animate-bounce' 
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {selectedUser.isOnline ? 'LIVE' : 'IDLE'}
                                </div>
                              </div>

                              <h3 className="text-sm font-black text-white mt-5 tracking-tight flex items-center justify-center gap-1">
                                {selectedUser.name}
                              </h3>
                              
                              {/* Academic Rank Badge */}
                              <div className="mt-2.5 flex items-center gap-1.5 justify-center flex-wrap">
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider border shadow-md ${
                                  selectedUser.userRank === 'Legend' 
                                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-pink-400/30'
                                    : selectedUser.userRank === 'Pro' 
                                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 border-amber-400/40'
                                    : selectedUser.userRank === 'Platinum' 
                                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 border-cyan-400/40'
                                    : selectedUser.userRank === 'Gold' 
                                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 border-yellow-300/40'
                                    : selectedUser.userRank === 'Silver'
                                    ? 'bg-slate-700 text-slate-100 border-slate-600'
                                    : 'bg-slate-900 text-slate-400 border-slate-800'
                                }`}>
                                  🏆 {selectedUser.userRank || 'Bronze'}
                                </span>
                                
                                <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                                  {selectedUser.grade}
                                </span>
                              </div>
                            </div>

                            {/* Focus Progress Meter */}
                            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  {isBn ? 'মোট ফোকাস সময়' : 'Total Focus Time'}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-400 font-mono">
                                  {selectedUser.totalFocusMinutes || 0} {isBn ? 'মি.' : 'Min'}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                                  style={{ width: `${Math.min(((selectedUser.totalFocusMinutes || 0) / 1500) * 100, 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[8px] text-slate-600 font-black tracking-widest uppercase">
                                <span>Level {Math.floor((selectedUser.totalFocusMinutes || 0) / 200) + 1}</span>
                                <span>{isBn ? 'পরবর্তী লেভেল' : 'Next level'}: {((Math.floor((selectedUser.totalFocusMinutes || 0) / 200) + 1) * 200)}m</span>
                              </div>
                            </div>

                            {/* Academics: Favourite Subjects */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                {isBn ? 'প্রিয় বিষয়সমূহ' : 'Fav Subjects'}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedUser.favSubjects ? (
                                  selectedUser.favSubjects.split(/[,，|;]/).map((subj, i) => (
                                    <span key={i} className="text-[9px] px-2.5 py-1 rounded-lg bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 font-bold">
                                      {subj.trim()}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[9.5px] text-slate-600 italic">
                                    {isBn ? 'কোনো বিষয় সেট করা হয়নি' : 'No subjects specified'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Interests */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                {isBn ? 'অন্যান্য আগ্রহ' : 'Interests'}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedUser.interests ? (
                                  selectedUser.interests.split(/[,，|;]/).map((interest, i) => (
                                    <span key={i} className="text-[9px] px-2.5 py-1 rounded-lg bg-teal-500/5 text-teal-400 border border-teal-500/10 font-bold">
                                      {interest.trim()}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[9.5px] text-slate-600 italic">
                                    {isBn ? 'কোনো আগ্রহ সেট করা হয়নি' : 'No interests specified'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stats Trackers: Prayer and Habits */}
                            <div className="grid grid-cols-2 gap-3">
                              {/* Prayer Consistency */}
                              <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-3 text-center space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block leading-tight">
                                  {isBn ? 'নামাজের স্কোর' : 'Prayer Score'}
                                </span>
                                <span className="text-[11px] font-black text-slate-200 block">
                                  {selectedUser.prayerConsistency || 0}%
                                </span>
                                <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500" 
                                    style={{ width: `${selectedUser.prayerConsistency || 0}%` }}
                                  />
                                </div>
                              </div>

                              {/* Habit Consistency */}
                              <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-3 text-center space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block leading-tight">
                                  {isBn ? 'অভ্যাসের স্কোর' : 'Habit Score'}
                                </span>
                                <span className="text-[11px] font-black text-slate-200 block">
                                  {selectedUser.habitConsistency || 0}%
                                </span>
                                <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500" 
                                    style={{ width: `${selectedUser.habitConsistency || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Metadata / Age */}
                            {selectedUser.age && (
                              <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-850/50 pt-3">
                                <span>{isBn ? 'বয়স' : 'Age'}</span>
                                <span className="font-bold text-slate-300">{selectedUser.age} {isBn ? 'বছর' : 'years'}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-600">
                    <UserCircle className="w-12 h-12 mb-3 text-slate-800 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isBn ? 'ব্যক্তিগত চ্যাট নির্বাচন করুন' : 'Select study companion'}</p>
                    <p className="text-[9px] text-slate-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
                      {isBn ? 'সরাসরি চ্যাট করতে বাম পাশের তালিকা থেকে যেকোনো বন্ধু বা সহপাঠীকে নির্বাচন করুন।' : 'Select a user from the directory on the left to start a cinematic direct chat!'}
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
