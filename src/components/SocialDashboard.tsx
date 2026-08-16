import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';
import { 
  Bot, 
  MessageCircle, 
  Trophy, 
  User, 
  Users, 
  Send, 
  X, 
  Heart, 
  MessageSquare, 
  Sparkles, 
  Flame, 
  Plus, 
  Globe, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Loader2, 
  Share2, 
  BookOpen, 
  Smile, 
  BellRing,
  Dot
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where, 
  limit, 
  doc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  increment,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaderboard } from './Leaderboard';

// Interfaces for our types
interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likesCount: number;
  likedBy: string[];
  timestamp: any;
  commentsCount: number;
}

interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: any;
}

interface BuddyContact {
  userId: string;
  name: string;
  avatarUrl?: string;
  isOnline: boolean;
  currentActivity?: string;
  isAI?: boolean;
}

interface DirectMsg {
  id: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  text: string;
  timestamp: any;
}

export function SocialDashboard({ state, userId, onClose }: { state: AppState; userId: string; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'community' | 'messenger' | 'leaderboard' | 'profile'>('community');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currentUser, setCurrentUser] = useState<any>(auth.currentUser);

  // Helper to calculate the real study streak
  const getStudyStreak = () => {
    let currentStreak = 0;
    const history = state.history || {};
    const sortedDates = Object.keys(history).sort();
    if (sortedDates.length === 0) return 0;

    let checkDate = new Date();
    const getDateString = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    let todayStr = getDateString(checkDate);
    const todayLog = history[todayStr];
    let todayQualifies = todayLog && todayLog.study && Object.values(todayLog.study).some(s => Number(s) > 0);

    if (!todayQualifies) {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = getDateString(checkDate);
      const yesterdayLog = history[yesterdayStr];
      const yesterdayQualifies = yesterdayLog && yesterdayLog.study && Object.values(yesterdayLog.study).some(s => Number(s) > 0);

      if (yesterdayQualifies) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const dStr = getDateString(checkDate);
          const log = history[dStr];
          const qualifies = log && log.study && Object.values(log.study).some(s => Number(s) > 0);
          if (qualifies) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    } else {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const dStr = getDateString(checkDate);
        const log = history[dStr];
        const qualifies = log && log.study && Object.values(log.study).some(s => Number(s) > 0);
        if (qualifies) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    return currentStreak;
  };

  // Helper to calculate real-time score
  const getRealTimeScore = () => {
    const history = state.history || {};
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = history[todayStr];
    
    let score = 98; // Fallback default
    
    if (todayLog) {
      const todayHabits = todayLog.habits || {};
      const totalHabitsCount = Object.keys(todayHabits).length;
      if (totalHabitsCount > 0) {
        const completedHabitsCount = Object.values(todayHabits).filter(v => v === true).length;
        score = Math.round((completedHabitsCount / totalHabitsCount) * 100);
      } else {
        score = (state.focusLevel || 9) * 10 + 8;
      }
    } else {
      score = (state.focusLevel || 9) * 10 + 8;
    }
    
    return Math.max(0, Math.min(100, score));
  };

  const realPoints = state.focusPoints !== undefined ? state.focusPoints : 0;
  const realStreak = getStudyStreak();
  const realScore = getRealTimeScore();

  // Community Feed State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedPostComments, setSelectedPostComments] = useState<PostComment[]>([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // Messenger State
  const [contacts, setContacts] = useState<BuddyContact[]>([]);
  const [activeContact, setActiveContact] = useState<BuddyContact | null>(null);
  const [directMessages, setDirectMessages] = useState<DirectMsg[]>([]);
  const [newDirectMsgText, setNewDirectMsgText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Local Fallback states in case Firebase reads/writes fails or guest mode is active
  const [fallbackPosts, setFallbackPosts] = useState<CommunityPost[]>([
    {
      id: 'fallback_1',
      userId: 'coach_sohan',
      userName: 'Coach Sohan Mridha',
      userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sohan',
      content: 'পড়াশোনা ও সাফল্যের মূল চাবিকাঠি হলো ধারাবাহিকতা। আজ কে কে ৫ ঘণ্টা ফোকাস সেশন কমপ্লিট করেছ কমেন্ট করো! 🚀🔥',
      likesCount: 18,
      likedBy: [],
      timestamp: { toDate: () => new Date(Date.now() - 3600000 * 2) },
      commentsCount: 3
    },
    {
      id: 'fallback_2',
      userId: 'mim_s',
      userName: 'Mim S',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mim',
      content: 'আমার রসায়ন অধ্যায় ২ শেষ করলাম। অলসতা ঝেড়ে ফেলে আমাদের প্রতিদিনের গোল পূরণ করতেই হবে। ইনশাআল্লাহ! 📚💪',
      likesCount: 12,
      likedBy: [],
      timestamp: { toDate: () => new Date(Date.now() - 3600000 * 5) },
      commentsCount: 1
    },
    {
      id: 'fallback_3',
      userId: 'robin_r',
      userName: 'Robin Rahman',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robin',
      content: 'MridhaX এর সালাত ট্র্যাকারটা জাস্ট অসাধারণ। আজকে জামায়াতে পাঁচ ওয়াক্ত নামাজ পড়ার পর আত্মিক প্রশান্তিই আলাদা। 🥰🕌',
      likesCount: 24,
      likedBy: [],
      timestamp: { toDate: () => new Date(Date.now() - 3600000 * 12) },
      commentsCount: 4
    }
  ]);

  const [fallbackComments, setFallbackComments] = useState<Record<string, PostComment[]>>({
    'fallback_1': [
      { id: 'c1', userId: 'mim_s', userName: 'Mim S', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mim', text: 'আমি করেছি ভাইয়া! আজকে পুরো ৫ ঘণ্টা ১০ মিনিট পড়তে পেরেছি।', timestamp: new Date(Date.now() - 3600000 * 1.5) },
      { id: 'c2', userId: 'robin_r', userName: 'Robin Rahman', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robin', text: 'আমার ৩ ঘণ্টা হয়েছে। বাকি টার্গেট রাতে পূরণ করব।', timestamp: new Date(Date.now() - 3600000 * 1) }
    ],
    'fallback_2': [
      { id: 'c3', userId: 'coach_sohan', userName: 'Coach Sohan Mridha', userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sohan', text: 'দারুণ কাজ করেছ মিম! ধারাবাহিকতা ধরে রাখো।', timestamp: new Date(Date.now() - 3600000 * 4) }
    ]
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync user state & load settings
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    try {
      const raw = localStorage.getItem('mridhax-state');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.language) setLanguage(parsed.language);
      }
    } catch (err) {
      console.error(err);
    }

    return () => unsubAuth();
  }, []);

  // Set up Contacts (AI + Fallback active users)
  useEffect(() => {
    const defaultContacts: BuddyContact[] = [
      {
        userId: 'mridhax_ai_piea',
        name: language === 'bn' ? 'মৃধাক্স এআই (PIEA)' : 'MridhaX AI (PIEA)',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=mridhax_core',
        isOnline: true,
        currentActivity: language === 'bn' ? 'মস্তিষ্ক টিউনিং সক্রিয়' : 'Brain Tuning Active',
        isAI: true
      },
      {
        userId: 'coach_sohan_coach',
        name: 'Coach Sohan Mridha',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=sohan',
        isOnline: true,
        currentActivity: language === 'bn' ? 'স্টুডেন্টদের মেন্টরিং করছেন' : 'Mentoring Students',
        isAI: false
      },
      {
        userId: 'mim_buddy',
        name: 'Mim S',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mim',
        isOnline: true,
        currentActivity: language === 'bn' ? 'রসায়ন অধ্যায় ৩ পড়ছে' : 'Studying Chemistry Ch 3',
        isAI: false
      },
      {
        userId: 'robin_buddy',
        name: 'Robin Rahman',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robin',
        isOnline: false,
        currentActivity: language === 'bn' ? 'অফলাইন' : 'Offline',
        isAI: false
      }
    ];

    setContacts(defaultContacts);
    // By default, select MridhaX AI as active contact so the user gets instant chat experience!
    setActiveContact(defaultContacts[0]);
  }, [language]);

  // Load posts from Firebase with snapshot
  useEffect(() => {
    if (!currentUser) {
      setPosts(fallbackPosts);
      return;
    }

    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setPosts(fallbackPosts);
      } else {
        const postsData: CommunityPost[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          postsData.push({
            id: doc.id,
            userId: data.userId || '',
            userName: data.userName || 'MridhaX Member',
            userAvatar: data.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
            content: data.content || '',
            likesCount: data.likesCount || 0,
            likedBy: data.likedBy || [],
            timestamp: data.timestamp || { toDate: () => new Date() },
            commentsCount: data.commentsCount || 0
          });
        });
        setPosts(postsData);
      }
    }, (error) => {
      console.warn("Firestore Social Posts Read failed, falling back safely:", error);
      setPosts(fallbackPosts);
    });

    return () => unsubscribe();
  }, [currentUser, fallbackPosts]);

  // Auto scroll messenger to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages, isAiTyping]);

  // Load comments for active comment post
  useEffect(() => {
    if (!activeCommentPostId) return;

    if (!currentUser || activeCommentPostId.startsWith('fallback_')) {
      const localComments = fallbackComments[activeCommentPostId] || [];
      setSelectedPostComments(localComments);
      return;
    }

    const commentsRef = collection(db, 'posts', activeCommentPostId, 'comments');
    const q = query(commentsRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData: PostComment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        commentsData.push({
          id: doc.id,
          userId: data.userId || '',
          userName: data.userName || 'MridhaX Buddy',
          userAvatar: data.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
          text: data.text || '',
          timestamp: data.timestamp || { toDate: () => new Date() }
        });
      });
      setSelectedPostComments(commentsData);
    }, (error) => {
      console.warn("Firestore Comments load failed:", error);
      setSelectedPostComments(fallbackComments[activeCommentPostId] || []);
    });

    return () => unsubscribe();
  }, [activeCommentPostId, currentUser, fallbackComments]);

  // Handle Publishing a New Post
  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setIsPublishing(true);
    const postContent = newPostText.trim();

    if (!currentUser) {
      // Local fallback append
      const newPost: CommunityPost = {
        id: `fallback_${Date.now()}`,
        userId: 'guest_user',
        userName: language === 'bn' ? 'ভিজিটর বন্ধু' : 'Guest Friend',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
        content: postContent,
        likesCount: 0,
        likedBy: [],
        timestamp: { toDate: () => new Date() },
        commentsCount: 0
      };
      setFallbackPosts([newPost, ...fallbackPosts]);
      setNewPostText('');
      setIsPublishing(false);
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'MridhaX Achiever',
        userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        content: postContent,
        likesCount: 0,
        likedBy: [],
        timestamp: serverTimestamp(),
        commentsCount: 0
      });
      setNewPostText('');
    } catch (err) {
      console.error("Firestore Publish Post error:", err);
      // fallback
      const newPost: CommunityPost = {
        id: `fallback_${Date.now()}`,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'MridhaX Achiever',
        userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        content: postContent,
        likesCount: 0,
        likedBy: [],
        timestamp: { toDate: () => new Date() },
        commentsCount: 0
      };
      setFallbackPosts([newPost, ...fallbackPosts]);
      setNewPostText('');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Liking a Post
  const handleLikePost = async (post: CommunityPost) => {
    const userUid = currentUser ? currentUser.uid : 'guest_user';
    const isLiked = post.likedBy.includes(userUid);

    if (!currentUser || post.id.startsWith('fallback_')) {
      const updatedFallback = fallbackPosts.map(p => {
        if (p.id === post.id) {
          const likedBy = isLiked ? p.likedBy.filter(uid => uid !== userUid) : [...p.likedBy, userUid];
          const likesCount = isLiked ? p.likesCount - 1 : p.likesCount + 1;
          return { ...p, likedBy, likesCount };
        }
        return p;
      });
      setFallbackPosts(updatedFallback);
      return;
    }

    try {
      const postRef = doc(db, 'posts', post.id);
      if (isLiked) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(userUid),
          likesCount: increment(-1)
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayUnion(userUid),
          likesCount: increment(1)
        });
      }
    } catch (err) {
      console.error("Like post failed, doing local fallback update:", err);
      // fallback
      const updatedFallback = fallbackPosts.map(p => {
        if (p.id === post.id) {
          const likedBy = isLiked ? p.likedBy.filter(uid => uid !== userUid) : [...p.likedBy, userUid];
          const likesCount = isLiked ? p.likesCount - 1 : p.likesCount + 1;
          return { ...p, likedBy, likesCount };
        }
        return p;
      });
      setFallbackPosts(updatedFallback);
    }
  };

  // Handle Submitting a Comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentPostId) return;

    setIsCommenting(true);
    const text = newCommentText.trim();
    const commentUser = currentUser || {
      uid: 'guest_user',
      displayName: language === 'bn' ? 'ভিজিটর বন্ধু' : 'Guest Friend',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
    };

    if (!currentUser || activeCommentPostId.startsWith('fallback_')) {
      const newComment: PostComment = {
        id: `c_${Date.now()}`,
        userId: commentUser.uid,
        userName: commentUser.displayName,
        userAvatar: commentUser.photoURL,
        text: text,
        timestamp: new Date()
      };

      const existingComments = fallbackComments[activeCommentPostId] || [];
      setFallbackComments({
        ...fallbackComments,
        [activeCommentPostId]: [...existingComments, newComment]
      });

      // Update comment count in parent post
      const updatedFallback = fallbackPosts.map(p => {
        if (p.id === activeCommentPostId) {
          return { ...p, commentsCount: p.commentsCount + 1 };
        }
        return p;
      });
      setFallbackPosts(updatedFallback);
      setNewCommentText('');
      setIsCommenting(false);
      return;
    }

    try {
      const commentsRef = collection(db, 'posts', activeCommentPostId, 'comments');
      await addDoc(commentsRef, {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'MridhaX Student',
        userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        text: text,
        timestamp: serverTimestamp()
      });

      const postRef = doc(db, 'posts', activeCommentPostId);
      await updateDoc(postRef, {
        commentsCount: increment(1)
      });

      setNewCommentText('');
    } catch (err) {
      console.error("Add comment failed, using fallback:", err);
      // fallback
      const newComment: PostComment = {
        id: `c_${Date.now()}`,
        userId: commentUser.uid,
        userName: commentUser.displayName,
        userAvatar: commentUser.photoURL,
        text: text,
        timestamp: new Date()
      };

      const existingComments = fallbackComments[activeCommentPostId] || [];
      setFallbackComments({
        ...fallbackComments,
        [activeCommentPostId]: [...existingComments, newComment]
      });

      // Update count
      const updatedFallback = fallbackPosts.map(p => {
        if (p.id === activeCommentPostId) {
          return { ...p, commentsCount: p.commentsCount + 1 };
        }
        return p;
      });
      setFallbackPosts(updatedFallback);
      setNewCommentText('');
    } finally {
      setIsCommenting(false);
    }
  };

  // Handle Messenger - Load private messages
  useEffect(() => {
    if (!activeContact) {
      setDirectMessages([]);
      return;
    }

    // AI chat is fully local/server-driven, load its previous history if any
    if (activeContact.isAI) {
      const historyKey = `mridhax_ai_chat_history_${currentUser?.uid || 'guest'}`;
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        setDirectMessages(JSON.parse(savedHistory));
      } else {
        // Welcome message from MridhaX AI
        const welcomeMsgs: DirectMsg[] = [
          {
            id: 'welcome_1',
            senderId: 'mridhax_ai_piea',
            receiverId: currentUser?.uid || 'guest',
            roomId: 'ai_room',
            text: language === 'bn' 
              ? 'আসসালামু আলাইকুম বন্ধু! আমি মৃধাক্স এআই (PIEA), তোমার চিফ এক্সিকিউティブ অ্যাসিস্ট্যান্ট। তোমার পড়াশোনার রুটিন অ্যাডজাস্ট করা, অভ্যাস ট্র্যাক করা বা কন্টেন্ট অ্যানালাইসিস করতে আমি রেডি। আজকে কীভাবে তোমার স্টাডি বুস্ট করতে পারি?'
              : 'Hello buddy! I am MridhaX AI (PIEA), your Chief Executive Assistant. I am ready to optimize your study routines, analyze your progress diagnostics, and manage your lifestyle habits. How can I accelerate your learning journey today?',
            timestamp: new Date()
          }
        ];
        setDirectMessages(welcomeMsgs);
        localStorage.setItem(historyKey, JSON.stringify(welcomeMsgs));
      }
      return;
    }

    // Peer contact: Coach Sohan has interactive prompts
    if (activeContact.userId === 'coach_sohan_coach') {
      const coachMsgs: DirectMsg[] = [
        {
          id: 'coach_1',
          senderId: 'coach_sohan_coach',
          receiverId: currentUser?.uid || 'guest',
          roomId: 'coach_room',
          text: language === 'bn' 
            ? 'হ্যালো চ্যাম! আমি সোহান মৃধাক্স। কেমন চলছে তোমার পড়াশোনার গোল ও লাইফস্টাইল ট্র্যাকিং? মনে রাখবে, ধারাবাহিকতাই হচ্ছে প্রথম শক্তি। কোনো গাইডেন্স বা রুটিন বুস্টার লাগলে নির্দ্বিধায় মেসেজ দাও!'
            : 'Hey Champ! Coach Sohan here. How is your study focus and habit alignment progressing? Remember, discipline outclasses talent any day. Let me know if you need any performance blueprint!',
          timestamp: new Date()
        }
      ];
      setDirectMessages(coachMsgs);
      return;
    }

    // Other peers: read from firestore
    if (!currentUser) {
      // Offline fallback buddy chat
      setDirectMessages([
        {
          id: 'buddy_msg_1',
          senderId: activeContact.userId,
          receiverId: 'guest_user',
          roomId: 'buddy_room',
          text: language === 'bn' ? 'হাই দোস্ত! আমি রসায়ন অধ্যায় শেষ করেছি। লিডারবোর্ডে কিন্তু জোর টক্কর হবে আজকে!' : 'Hey buddy! I finished my study sprint. Let\'s battle on the leaderboard today!',
          timestamp: new Date(Date.now() - 1200000)
        }
      ]);
      return;
    }

    const currentUserId = currentUser.uid;
    const roomId = [currentUserId, activeContact.userId].sort().join('_');

    const q = query(
      collection(db, 'direct_messages'),
      where('roomId', '==', roomId),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: DirectMsg[] = [];
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
      console.warn("Peer chat load failed, using local mockup room:", error);
      setDirectMessages([
        {
          id: 'buddy_msg_1',
          senderId: activeContact.userId,
          receiverId: currentUserId,
          roomId: roomId,
          text: language === 'bn' ? 'হাই দোস্ত! আমি রসায়ন অধ্যায় শেষ করেছি। লিডারবোর্ডে কিন্তু জোর টক্কর হবে আজকে!' : 'Hey buddy! I finished my study sprint. Let\'s battle on the leaderboard today!',
          timestamp: new Date(Date.now() - 1200000)
        }
      ]);
    });

    return () => unsubscribe();
  }, [activeContact, currentUser, language]);

  // Handle Send Direct Message (including AI/Coach automation)
  const handleSendDirectMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirectMsgText.trim() || !activeContact) return;

    const messageText = newDirectMsgText.trim();
    setNewDirectMsgText('');
    setIsSendingMessage(true);

    const currentUserId = currentUser?.uid || 'guest_user';
    const timestamp = new Date();

    const newMsg: DirectMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUserId,
      receiverId: activeContact.userId,
      roomId: activeContact.isAI ? 'ai_room' : (activeContact.userId === 'coach_sohan_coach' ? 'coach_room' : 'peer_room'),
      text: messageText,
      timestamp: { toDate: () => timestamp }
    };

    // If it's AI chat, handle locally via server API proxy and persist
    if (activeContact.isAI) {
      const updatedHistory = [...directMessages, newMsg];
      setDirectMessages(updatedHistory);
      setIsAiTyping(true);

      // Save to local storage instantly
      const historyKey = `mridhax_ai_chat_history_${currentUserId}`;
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));

      try {
        // Build api context
        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedHistory.map(m => ({
              role: m.senderId === 'mridhax_ai_piea' ? 'model' : 'user',
              parts: [{ text: m.text }]
            })),
            language: language,
            image: null
          })
        });

        const data = await response.json();
        
        const aiResponseText = data.text || (language === 'bn' 
          ? 'দুঃখিত বন্ধু, সংযোগ ত্রুটি হয়েছে। তবে আমি তোমার সাথে আছি!' 
          : 'Sorry buddy, connection error. But I am always here to guide you!');

        const aiMsg: DirectMsg = {
          id: `ai_${Date.now()}`,
          senderId: 'mridhax_ai_piea',
          receiverId: currentUserId,
          roomId: 'ai_room',
          text: aiResponseText,
          timestamp: { toDate: () => new Date() }
        };

        const finalHistory = [...updatedHistory, aiMsg];
        setDirectMessages(finalHistory);
        localStorage.setItem(historyKey, JSON.stringify(finalHistory));

      } catch (err) {
        console.error("AI chat API Error:", err);
        const aiMsg: DirectMsg = {
          id: `ai_${Date.now()}`,
          senderId: 'mridhax_ai_piea',
          receiverId: currentUserId,
          roomId: 'ai_room',
          text: language === 'bn' 
            ? 'সার্ভার বিজি থাকার কারণে অফলাইন প্রসেস সক্রিয় হয়েছে। পড়াশোনায় ফোকাস বজায় রাখো, আমি রুটিন সিঙ্ক করে নিচ্ছি!'
            : 'Server busy. Keep studying while I take care of syncing your offline records!',
          timestamp: { toDate: () => new Date() }
        };
        const finalHistory = [...updatedHistory, aiMsg];
        setDirectMessages(finalHistory);
        localStorage.setItem(historyKey, JSON.stringify(finalHistory));
      } finally {
        setIsAiTyping(false);
        setIsSendingMessage(false);
      }
      return;
    }

    // Coach Sohan custom auto-reply logic
    if (activeContact.userId === 'coach_sohan_coach') {
      const updatedHistory = [...directMessages, newMsg];
      setDirectMessages(updatedHistory);
      setIsAiTyping(true);

      setTimeout(() => {
        let coachReply = "";
        const query = messageText.toLowerCase();

        if (language === 'bn') {
          if (query.includes('অলস') || query.includes('ঘুম') || query.includes('খারাপ')) {
            coachReply = "আমি জানি অলসতা আমাদের অনেক বড় শত্রু। অলসতা ট্র্যাকার এ গোল সেট করো, আর দিনে অন্তত ২৫ মিনিট কোনো সোশ্যাল মিডিয়া না ছুঁয়ে ফোকাস সেশন করার টার্গেট নাও। তুমি পারবেই, আমার বিশ্বাস আছে! 🔥";
          } else if (query.includes('রুটিন') || query.includes('পড়াশোনা') || query.includes('পড়া')) {
            coachReply = "রুটিন মেনে চলাই হলো সাফল্যের গোপন সূত্র। প্রতিটি বিষয়ের প্রোগ্রেস পারসেন্টেজ নিয়মিত ট্র্যাক করো। আজ এখনই পড়ার রুটিন অপশনে গিয়ে তোমার পড়া শুরু করো!";
          } else {
            coachReply = "চমৎকার কথা বলেছ! নিজেকে প্রতিদিন ১% উন্নত করতে থাকো। কোনো বাধা এলেই ফোকাসড হয়ে পড়াশোনায় কামব্যাক করো। সবসময় পাশে আছি চ্যাম! — Coach Sohan Mridha";
          }
        } else {
          if (query.includes('lazy') || query.includes('sleep') || query.includes('procrastinate')) {
            coachReply = "Procrastination is the thief of dreams. Break your goals into micro-tasks, and start a 25-minute Pomodoro focus session now. I believe in you, champ! 🔥";
          } else if (query.includes('routine') || query.includes('schedule') || query.includes('study')) {
            coachReply = "Structure equals freedom! Fill out your study roadmap blocks, stick to your hourly alarms, and adjust backlog deficit hours diligently. Let's conquer today's goals!";
          } else {
            coachReply = "Outstanding insight! Keep grinding and maintain your streak. One percent better every single day. I'm always routing for you! — Coach Sohan Mridha";
          }
        }

        const coachReplyMsg: DirectMsg = {
          id: `coach_reply_${Date.now()}`,
          senderId: 'coach_sohan_coach',
          receiverId: currentUserId,
          roomId: 'coach_room',
          text: coachReply,
          timestamp: { toDate: () => new Date() }
        };

        setDirectMessages([...updatedHistory, coachReplyMsg]);
        setIsAiTyping(false);
        setIsSendingMessage(false);
      }, 1500);
      return;
    }

    // Peer message - write to Firestore
    if (!currentUser) {
      // offline fallback peer echo
      const updatedHistory = [...directMessages, newMsg];
      setDirectMessages(updatedHistory);
      setIsSendingMessage(false);

      // Auto-reply echo from buddy
      setTimeout(() => {
        const buddyEcho: DirectMsg = {
          id: `buddy_echo_${Date.now()}`,
          senderId: activeContact.userId,
          receiverId: 'guest_user',
          roomId: 'buddy_room',
          text: language === 'bn' 
            ? 'দারুণ দোস্ত! চলো একসাথে পড়তে বসি।' 
            : 'Awesome buddy! Let\'s start our study sprint together.',
          timestamp: { toDate: () => new Date() }
        };
        setDirectMessages([...updatedHistory, buddyEcho]);
      }, 1200);
      return;
    }

    try {
      const roomId = [currentUserId, activeContact.userId].sort().join('_');
      await addDoc(collection(db, 'direct_messages'), {
        senderId: currentUserId,
        receiverId: activeContact.userId,
        roomId: roomId,
        text: messageText,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Firestore message send error:", err);
      // fallback local append
      const updatedHistory = [...directMessages, newMsg];
      setDirectMessages(updatedHistory);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans relative overflow-hidden select-none">
      
      {/* Background Cyber Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[130px] pointer-events-none" />
      
      {/* Upper Header Nav */}
      <div className="flex items-center justify-between p-5 border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-slate-100 flex items-center gap-1.5">
              MridhaX <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse">Hologram Hub</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {language === 'bn' ? 'স্মার্ট সোশ্যাল প্ল্যাটফর্ম' : 'Personal Intelligent Cyber Lounge'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClose} 
          className="p-3 bg-slate-900/60 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-800/80 hover:border-rose-500/20 rounded-2xl text-slate-400 transition-all duration-300 active:scale-90"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="px-5 py-3 border-b border-slate-900 bg-slate-950/40 backdrop-blur-lg z-10 flex gap-1.5 overflow-x-auto scrollbar-none">
        <button 
          onClick={() => setActiveTab('community')} 
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border ${
            activeTab === 'community' 
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
              : 'border-slate-900 bg-slate-950/20 text-slate-500 hover:text-slate-300 hover:border-slate-800'
          }`}
        >
          <Users size={14} className={activeTab === 'community' ? 'animate-pulse' : ''} /> 
          <span>{language === 'bn' ? 'কমিউনিটি' : 'Community'}</span>
        </button>

        <button 
          onClick={() => setActiveTab('messenger')} 
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border ${
            activeTab === 'messenger' 
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
              : 'border-slate-900 bg-slate-950/20 text-slate-500 hover:text-slate-300 hover:border-slate-800'
          }`}
        >
          <MessageCircle size={14} className={activeTab === 'messenger' ? 'animate-pulse' : ''} />
          <span>{language === 'bn' ? 'মেসেঞ্জার' : 'Messenger'}</span>
        </button>

        <button 
          onClick={() => setActiveTab('leaderboard')} 
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border ${
            activeTab === 'leaderboard' 
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
              : 'border-slate-900 bg-slate-950/20 text-slate-500 hover:text-slate-300 hover:border-slate-800'
          }`}
        >
          <Trophy size={14} className={activeTab === 'leaderboard' ? 'animate-pulse' : ''} />
          <span>{language === 'bn' ? 'লিডারবোর্ড' : 'Leaderboard'}</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')} 
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border ${
            activeTab === 'profile' 
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
              : 'border-slate-900 bg-slate-950/20 text-slate-500 hover:text-slate-300 hover:border-slate-800'
          }`}
        >
          <User size={14} className={activeTab === 'profile' ? 'animate-pulse' : ''} />
          <span>{language === 'bn' ? 'কার্ড' : 'Identity'}</span>
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 z-10 pb-20">
        <AnimatePresence mode="wait">
          
          {/* COMMUNITY TAB */}
          {activeTab === 'community' && (
            <motion.div 
              key="community"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Custom Post creation */}
              <form onSubmit={handlePublishPost} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full border border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center text-xs text-slate-500 font-bold">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      currentUser?.displayName?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-100">{language === 'bn' ? 'স্টাডি ফিড পাবলিশ করুন' : 'Broadcast to Hub'}</h3>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{language === 'bn' ? 'আপনার সাকসেস বা অগ্রগতি শেয়ার করুন' : 'Share study habits and positive loops'}</p>
                  </div>
                </div>
                
                <textarea 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={language === 'bn' ? 'আজ আপনার পড়াশোনার গোল কী? সবার সাথে শেয়ার করে মোটিভেটেড থাকুন...' : 'Post daily micro-goals, completed study sessions, or habit victories...'}
                  rows={3}
                  className="w-full bg-slate-950/60 border border-slate-900 focus:border-emerald-500/40 rounded-2xl p-4 text-xs text-slate-200 outline-none placeholder-slate-600 transition-all duration-300 resize-none mb-3"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                    {!currentUser && (language === 'bn' ? '⚠️ গেস্ট মোড সক্রিয় (লোকালি পোস্ট হবে)' : '⚠️ Guest mode active (Posts in memory)')}
                  </span>
                  <button 
                    type="submit" 
                    disabled={isPublishing || !newPostText.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-[9px] uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{language === 'bn' ? 'পোস্ট হচ্ছে...' : 'Posting...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'পাবলিশ করুন' : 'Publish'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Feed Lists */}
              <div className="space-y-4">
                {posts.map((post) => {
                  const liked = post.likedBy.includes(currentUser?.uid || 'guest_user');
                  return (
                    <motion.div 
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-900/20 border border-slate-900 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full border border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center shadow-lg">
                            {post.userAvatar ? (
                              <img src={post.userAvatar} alt={post.userName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[11px] font-black text-slate-500">{post.userName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-200 tracking-tight flex items-center gap-1.5">
                              {post.userName}
                              {post.userId === 'coach_sohan' && <span className="text-[7px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black tracking-widest uppercase">COACH</span>}
                            </h4>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest tabular-nums block mt-0.5">
                              {new Date(post.timestamp?.toDate ? post.timestamp.toDate() : post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleLikePost(post)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                              liked 
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
                                : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-rose-400 hover:border-rose-500/10'
                            }`}
                          >
                            <Heart size={11} className={liked ? 'fill-rose-400 text-rose-400' : ''} />
                            <span>{post.likesCount}</span>
                          </button>
                          
                          <button 
                            onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                              activeCommentPostId === post.id
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/10'
                            }`}
                          >
                            <MessageSquare size={11} />
                            <span>{post.commentsCount}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-4 leading-relaxed whitespace-pre-wrap pl-1 font-sans">
                        {post.content}
                      </p>

                      {/* Expandable Comments Section */}
                      <AnimatePresence>
                        {activeCommentPostId === post.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-5 border-t border-slate-900 pt-4 space-y-4 overflow-hidden"
                          >
                            <h5 className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">{language === 'bn' ? 'মন্তব্যসমূহ' : 'Comments Thread'}</h5>
                            
                            {/* Comments list */}
                            <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                              {selectedPostComments.map((comment) => (
                                <div key={comment.id} className="bg-slate-950/40 border border-slate-900 p-3 rounded-2xl flex items-start gap-2.5">
                                  <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                                    {comment.userAvatar ? (
                                      <img src={comment.userAvatar} alt="Commentor" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-slate-500">{comment.userName.charAt(0).toUpperCase()}</div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-[9px] font-black text-slate-300">{comment.userName}</span>
                                      <span className="text-[7px] text-slate-600 tabular-nums">
                                        {new Date(comment.timestamp?.toDate ? comment.timestamp.toDate() : comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{comment.text}</p>
                                  </div>
                                </div>
                              ))}

                              {selectedPostComments.length === 0 && (
                                <div className="text-center py-6">
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 italic">{language === 'bn' ? 'কোনো মন্তব্য নেই, প্রথম মন্তব্যটি করুন!' : 'No comments yet. Write the first loop...'}</p>
                                </div>
                              )}
                            </div>

                            {/* Comment Form */}
                            <form onSubmit={handleSubmitComment} className="flex gap-2 mt-3">
                              <input 
                                type="text"
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder={language === 'bn' ? 'সুন্দর মন্তব্য লিখুন...' : 'Write supportive feedback...'}
                                className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl px-3 py-2 text-[11px] text-slate-200 outline-none focus:border-emerald-500/30 placeholder-slate-700 transition"
                              />
                              <button 
                                type="submit"
                                disabled={isCommenting || !newCommentText.trim()}
                                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 text-[9px] uppercase tracking-widest transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                              >
                                {isCommenting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send size={10} />}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* MESSENGER TAB */}
          {activeTab === 'messenger' && (
            <motion.div 
              key="messenger"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-slate-900/20 border border-slate-900 rounded-[2.5rem] h-[65vh] flex relative overflow-hidden backdrop-blur-xl shadow-2xl"
            >
              {/* Contacts sidebar - Left pane on desktop, collapsible on mobile */}
              <div className="w-1/3 border-r border-slate-900 flex flex-col bg-slate-950/40 shrink-0">
                <div className="p-4 border-b border-slate-900 bg-slate-950/80">
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">{language === 'bn' ? 'অ্যাক্টিভ ফ্রেন্ডস' : 'Cyber Lobby Contacts'}</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
                  {contacts.map((contact) => (
                    <button 
                      key={contact.userId}
                      onClick={() => setActiveContact(contact)}
                      className={`w-full p-3 rounded-2xl flex items-center gap-2.5 transition-all duration-300 relative ${
                        activeContact?.userId === contact.userId 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-8 h-8 rounded-full overflow-hidden bg-slate-950 border ${
                          activeContact?.userId === contact.userId ? 'border-emerald-500' : 'border-slate-800'
                        }`}>
                          <img src={contact.avatarUrl} alt={contact.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        {contact.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse shadow-lg" />
                        )}
                      </div>
                      
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="text-[10px] font-black truncate">{contact.name}</h4>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate mt-0.5 flex items-center gap-0.5">
                          {contact.isAI ? (
                            <span className="text-emerald-500 uppercase tracking-widest font-black animate-pulse flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> AI COPILOT
                            </span>
                          ) : (
                            contact.currentActivity
                          )}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Window Pane - Right side */}
              <div className="flex-1 flex flex-col bg-slate-950/20">
                {activeContact ? (
                  <>
                    {/* Active Contact Header */}
                    <div className="p-4 border-b border-slate-900 bg-slate-950/60 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img src={activeContact.avatarUrl} alt={activeContact.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                          {activeContact.name}
                          {activeContact.isAI && <span className="text-[7px] px-1 bg-emerald-500 text-slate-950 font-black rounded uppercase tracking-widest">Active</span>}
                        </h3>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate mt-0.5">
                          {activeContact.isOnline ? (
                            <span className="text-emerald-400 flex items-center gap-0.5 font-black">
                              <Dot className="w-3.5 h-3.5 scale-150 animate-pulse text-emerald-400" /> {activeContact.currentActivity}
                            </span>
                          ) : (
                            (language === 'bn' ? 'অফলাইন' : 'Offline')
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Message Bubble Feed */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/10">
                      {directMessages.map((msg) => {
                        const isOwn = msg.senderId === (currentUser?.uid || 'guest_user');
                        return (
                          <div key={msg.id} className={`flex items-start gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                            <div className="w-6 h-6 rounded-full bg-slate-900 shrink-0 overflow-hidden border border-slate-800 shadow">
                              <img 
                                src={isOwn 
                                  ? (currentUser?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest') 
                                  : activeContact.avatarUrl
                                } 
                                alt="Avatar" 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className={`max-w-[75%] space-y-0.5 ${isOwn ? 'items-end' : ''}`}>
                              <div className={`flex items-center gap-1.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                                  {isOwn ? (language === 'bn' ? 'আমি' : 'Me') : activeContact.name}
                                </span>
                                <span className="text-[7px] text-slate-700 tabular-nums">
                                  {new Date(msg.timestamp?.toDate ? msg.timestamp.toDate() : msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className={`px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed font-sans shadow-xl ${
                                isOwn 
                                  ? 'bg-emerald-500 text-slate-950 font-bold rounded-tr-none' 
                                  : 'bg-slate-900/60 text-slate-100 border border-slate-800/60 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {isAiTyping && (
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                            <img src={activeContact.avatarUrl} alt="Typing avatar" referrerPolicy="no-referrer" className="w-full h-full" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{activeContact.name}</span>
                            <div className="bg-slate-900/40 border border-slate-800/50 px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center justify-center gap-1 shadow-md w-14">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>

                    {/* Send Message Form */}
                    <form onSubmit={handleSendDirectMsg} className="p-3 bg-slate-950 border-t border-slate-900 flex gap-2">
                      <input 
                        type="text" 
                        value={newDirectMsgText}
                        onChange={(e) => setNewDirectMsgText(e.target.value)}
                        placeholder={
                          activeContact.isAI 
                            ? (language === 'bn' ? 'মৃধাক্স এআই এর সাথে পার্সোনাল চ্যাট করুন...' : 'Command MridhaX AI or query study state...') 
                            : (language === 'bn' ? 'মেসেজ লিখুন...' : 'Type study feedback or chat...')
                        }
                        className="flex-1 bg-slate-900/60 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-emerald-500/50 placeholder-slate-600 font-sans"
                      />
                      <button 
                        type="submit" 
                        disabled={isSendingMessage || !newDirectMsgText.trim()}
                        className="p-3 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center disabled:opacity-40"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <MessageCircle className="w-10 h-10 text-slate-700 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{language === 'bn' ? 'শুরু করতে একটি চ্যাট চুজ করুন' : 'Initiate Private Cyber Conversation'}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="pb-16"
            >
              <Leaderboard language={language} />
            </motion.div>
          )}

          {/* IDENTITY PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-w-md mx-auto space-y-6"
            >
              {/* Premium holographic profile card */}
              <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/60 border border-slate-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
                
                {/* Cybernetic decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
                <div className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">PUBLIC ID</div>
                
                {/* Avatar with emerald glow */}
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-lg animate-pulse" />
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 opacity-60 blur-xs" />
                  <div className="relative w-full h-full rounded-full bg-slate-950 border-4 border-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (state.userProfile?.name || currentUser?.displayName) ? (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black text-4xl">
                        {(state.userProfile?.name || currentUser?.displayName || 'G').charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=guest" alt="Holo Avatar" className="w-full h-full" />
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                  {state.userProfile?.name || currentUser?.displayName || (language === 'bn' ? 'গেস্ট চ্যাম' : 'Guest Champ')}
                </h2>
                
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-2 font-mono flex items-center justify-center gap-1.5">
                  <Flame size={12} className="text-amber-500 animate-pulse" /> 
                  <span>{language === 'bn' ? `লেভেল ${state.focusLevel || 1} স্টাডি পাথফাইন্ডার` : `LEVEL ${state.focusLevel || 1} STUDY PATHFINDER`}</span>
                </p>

                <p className="text-xs text-slate-500 leading-relaxed mt-4 max-w-xs mx-auto">
                  {language === 'bn' 
                    ? '"সাফল্যের একমাত্র সূত্র হলো নিজের ফোকাসকে ধরে রাখা এবং প্রতিদিনের রুটিন মেনে চলা।"'
                    : '"Success comes from persistent focus sprints and aligning everyday habits with your bigger purpose."'
                  }
                </p>

                {/* Grid of stats */}
                <div className="grid grid-cols-3 gap-3.5 w-full mt-8">
                  <div className="bg-slate-950/60 p-4 rounded-3xl border border-slate-900/60 text-center shadow-lg relative group overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">{language === 'bn' ? 'পয়েন্টস' : 'POINTS'}</p>
                    <p className="text-lg font-black text-emerald-400 font-mono tracking-tight">{realPoints.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-slate-950/60 p-4 rounded-3xl border border-slate-900/60 text-center shadow-lg relative group overflow-hidden">
                    <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">{language === 'bn' ? 'সাপ্তাহিক স্ট্রাক' : 'STREAK'}</p>
                    <p className="text-lg font-black text-amber-500 font-mono tracking-tight">
                      {language === 'bn' ? `${realStreak} দিন` : `${realStreak} ${realStreak === 1 ? 'Day' : 'Days'}`}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-3xl border border-slate-900/60 text-center shadow-lg relative group overflow-hidden">
                    <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">{language === 'bn' ? 'স্কোর' : 'SCORE'}</p>
                    <p className="text-lg font-black text-teal-400 font-mono tracking-tight">{realScore}%</p>
                  </div>
                </div>

                {/* Google Sync CTA */}
                {!currentUser && (
                  <div className="mt-8 bg-slate-950/40 p-5 rounded-3xl border border-dashed border-slate-900/80 space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                      {language === 'bn' 
                        ? 'আপনার অ্যাকাউন্ট ক্লাউডে সিঙ্ক করতে এবং লিডারবোর্ডে যোগ দিতে গুগল দিয়ে সাইন-ইন করুন।' 
                        : 'Connect your secure Google account to publish goals and secure global rank.'
                      }
                    </p>
                    <button 
                      onClick={onClose} 
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-[9px] uppercase tracking-widest font-black transition duration-300"
                    >
                      🚀 {language === 'bn' ? 'প্রোফাইল ট্যাব থেকে লগ-ইন করুন' : 'Sign In via Profile'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
