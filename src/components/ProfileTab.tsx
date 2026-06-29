import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Timer, 
  CheckCircle2, 
  Trophy, 
  PieChart, 
  Quote, 
  UserCircle,
  LogIn,
  LogOut,
  Globe,
  Cloud,
  Medal,
  Mail,
  Calendar as CalendarIcon,
  Link,
  Plus,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  MonitorSmartphone
} from 'lucide-react';
import { AppState, UserProfile } from '../types';
import ReportDashboard from './ReportDashboard';
import { auth, loginWithGoogle, logout, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Leaderboard } from './Leaderboard';
import { AchievementSystem } from './AchievementSystem';

interface ProfileTabProps {
  state: AppState;
  saveState: (s: AppState) => void;
  t: any;
  playCompletionBeep?: () => void;
  triggerCustomAlert?: (text: string, title?: string, type?: 'info' | 'success' | 'error') => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ 
  state, 
  saveState, 
  t,
  playCompletionBeep,
  triggerCustomAlert
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'report' | 'social' | 'integrations'>('details');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [gmailEmails, setGmailEmails] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserProfile>(state.userProfile || {
    name: '',
    age: '',
    grade: '',
    favSubjects: '',
    interests: '',
    isSocialPublic: false,
    isPrayerPublic: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // If logged in, ensure cloud profile is up to date with local state if local state has data
        if (state.userProfile?.name) {
          syncProfileToCloud(user.uid, state.userProfile);
        }
      }
    });

    // Handle sync success/error from URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sync') === 'success') {
      setActiveSubTab('integrations');
      window.history.replaceState({}, '', '/profile');
    }

    return () => unsubscribe();
  }, [state.userProfile]);

  useEffect(() => {
    if (activeSubTab === 'integrations' && currentUser) {
      fetchWorkspaceData();
    }
  }, [activeSubTab, currentUser]);

  const fetchWorkspaceData = async () => {
    setIsWorkspaceLoading(true);
    setWorkspaceError(null);
    try {
      const [emailsRes, eventsRes] = await Promise.all([
        fetch('/api/gmail/unread'),
        fetch('/api/calendar/upcoming')
      ]);

      if (emailsRes.status === 401) {
        setWorkspaceError("NOT_CONNECTED");
        return;
      }

      const emails = await emailsRes.json();
      const events = await eventsRes.json();

      setGmailEmails(Array.isArray(emails) ? emails : []);
      setCalendarEvents(Array.isArray(events) ? events : []);
    } catch (err) {
      console.error("Workspace Fetch Error:", err);
      setWorkspaceError("FETCH_FAILED");
    } finally {
      setIsWorkspaceLoading(false);
    }
  };

  const handleConnectWorkspace = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error("Auth URL Error:", err);
    }
  };

  const handleDisconnectWorkspace = async () => {
    try {
      await fetch('/api/auth/google/logout', { method: 'POST' });
      setGmailEmails([]);
      setCalendarEvents([]);
      setWorkspaceError("NOT_CONNECTED");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const convertToTask = (email: any) => {
    const newTask = {
      id: Date.now().toString(),
      item: `Email: ${email.subject}`,
      completed: false,
      priority: 'high' as const,
      timestamp: Date.now()
    };
    saveState({
      ...state,
      habits: [...(state.habits || []), newTask]
    });
    alert(state.language === 'bn' ? 'টাস্ক হিসেবে যোগ করা হয়েছে!' : 'Added as a task!');
  };

  const convertToSubject = (email: any) => {
    const newSubject = {
      id: Date.now().toString(),
      name: email.subject.substring(0, 20),
      target: 60
    };
    saveState({
      ...state,
      subjects: [...(state.subjects || []), newSubject]
    });
    alert(state.language === 'bn' ? 'স্টাডি সাবজেক্ট হিসেবে যোগ করা হয়েছে!' : 'Added as a study subject!');
  };

  const totalStudyMinutes: number = Object.values(state.history || {}).reduce<number>((acc: number, log: any) => {
    if (log && log.study) {
      return acc + Object.values(log.study as Record<string, number>).reduce((a, b) => a + (Math.floor(Number(b) / 60) || 0), 0);
    }
    return acc;
  }, 0);

  // Calculate prayer consistency
  const prayerCount = Object.values(state.history || {}).reduce((acc: number, log: any) => {
    if (log && log.prayer) {
      return acc + Object.values(log.prayer).filter(v => v === 'jamaat' || v === 'home' || v === 'জামাত' || v === 'ঘরে').length;
    }
    return acc;
  }, 0);

  const handleFirestoreError = (error: any, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    // throw new Error(JSON.stringify(errInfo)); // Don't throw to avoid crashing
  };

  const syncProfileToCloud = async (uid: string, profileData: UserProfile, activity: string = 'Browsing') => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        userId: uid,
        name: profileData.name || auth.currentUser?.displayName || 'MridhaX User',
        age: profileData.age || '',
        grade: profileData.grade || '',
        favSubjects: profileData.favSubjects || '',
        interests: profileData.interests || '',
        isSocialPublic: profileData.isSocialPublic ?? false,
        isPrayerPublic: profileData.isPrayerPublic ?? false,
        totalFocusMinutes: totalStudyMinutes,
        prayerConsistency: prayerCount,
        habitConsistency: (state.focusLevel || 0) * 10,
        currentActivity: activity,
        isOnline: true,
        lastUpdated: serverTimestamp(),
        avatarUrl: auth.currentUser?.photoURL || null
      }, { merge: true });
      console.log("Cloud sync successful");
    } catch (e) {
      handleFirestoreError(e, 'write', 'users/' + uid);
      console.error("Cloud sync failed", e);
    } finally {
       setIsSyncing(false);
    }
  };

  // Track live activity and presence
  useEffect(() => {
    if (!currentUser) return;

    const activityTimer = setInterval(() => {
      let currentLabel = 'Active';
      if (activeSubTab === 'report') currentLabel = 'Analyzing Reports';
      if (activeSubTab === 'social') currentLabel = 'Socializing';
      if (activeSubTab === 'integrations') currentLabel = 'Syncing Workspace';
      
      syncProfileToCloud(currentUser.uid, state.userProfile, currentLabel);
    }, 60000); // Pulse every minute

    // Update immediately on tab change
    let instantLabel = 'Active';
    if (activeSubTab === 'report') instantLabel = 'Analyzing Reports';
    if (activeSubTab === 'social') instantLabel = 'Socializing';
    syncProfileToCloud(currentUser.uid, state.userProfile, instantLabel);

    return () => clearInterval(activityTimer);
  }, [currentUser, activeSubTab]);

  const handleSave = () => {
    saveState({
      ...state,
      userProfile: formData
    });
    setIsEditing(false);
    if (currentUser) {
      syncProfileToCloud(currentUser.uid, formData);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        const userName = user.displayName || '';
        const newProfile = { 
          ...formData, 
          name: formData.name || userName 
        };
        setFormData(newProfile);
        saveState({ ...state, userProfile: newProfile });
        await syncProfileToCloud(user.uid, newProfile);
      }
    } catch (e: any) {
      console.error("Login Error:", e.message);
    }
  };

  const stats = [
    { 
      label: t.totalFocusTime, 
      value: `${Math.floor(totalStudyMinutes / 60)}h ${totalStudyMinutes % 60}m`, 
      icon: <Timer className="w-5 h-5 text-amber-500" /> 
    },
    { 
      label: t.habitConsistency, 
      value: `${(state.focusLevel || 0) * 10}%`, 
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
    },
    { 
      label: t.fitnessMilestones, 
      value: state.unlockedAchievements?.length || 0, 
      icon: <Trophy className="w-5 h-5 text-blue-500" /> 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto px-4 sm:px-0"
    >
      {currentUser && (
        <div className="flex justify-end -mb-4">
          <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${isSyncing ? 'text-amber-500 animate-pulse' : 'text-emerald-500 bg-emerald-500/5 border border-emerald-500/20'}`}>
            <Cloud className="w-3 h-3" />
            {isSyncing ? (state.language === 'bn' ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (state.language === 'bn' ? 'ক্লাউড কানেক্টেড' : 'Cloud Connected')}
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl opacity-50" />
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-slate-805 border-4 border-slate-800 flex items-center justify-center text-3xl shadow-xl overflow-hidden">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : formData.name ? (
              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black">
                {formData.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <UserCircle className="w-full h-full text-slate-700 p-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-slate-100 truncate tracking-tight">{formData.name || (state.language === 'bn' ? 'গেস্ট ইউজার' : 'Guest Member')}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-widest leading-none">
                {formData.grade || (state.language === 'bn' ? 'স্টুডেন্ট' : 'Student')}
              </span>
              {currentUser && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest flex items-center gap-1 leading-none">
                  <Medal className="w-2.5 h-2.5" /> PRO
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {currentUser ? (
              <button onClick={logout} className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-rose-400 transition active:scale-95 shadow-lg">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2.5 px-5 py-3 bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-slate-100 transition active:scale-95 text-[10px] uppercase tracking-widest">
                <LogIn className="w-4 h-4" />
                {state.language === 'bn' ? 'লগ-ইন' : 'Sign In'}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-10 p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
          <button onClick={() => setActiveSubTab('details')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'details' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            {state.language === 'bn' ? 'প্রোফাইল' : 'Profile'}
          </button>
          <button onClick={() => setActiveSubTab('report')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'report' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            {state.language === 'bn' ? 'রিপোর্ট' : 'Insights'}
          </button>
          <button onClick={() => setActiveSubTab('social')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'social' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            {state.language === 'bn' ? 'লিডারবোর্ড' : 'Global'}
          </button>
          <button onClick={() => setActiveSubTab('integrations')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'integrations' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            {state.language === 'bn' ? 'সিঙ্ক' : 'Sync'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'details' && (
          <motion.div 
            key="details" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }} 
            className="space-y-6 pb-28"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-3xl p-8 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {state.language === 'bn' ? 'তথ্য পরিবর্তন করুন' : 'Identity Details'}
                  </h3>
                  <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition border ${isEditing ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
                    {isEditing ? (state.language === 'bn' ? 'সেভ' : 'Save') : (state.language === 'bn' ? 'এডিট' : 'Edit')}
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.nameLabel}</label>
                    <input type="text" disabled={!isEditing} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-slate-600 disabled:bg-slate-900/30 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.ageLabel}</label>
                      <input type="text" disabled={!isEditing} value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-slate-600 disabled:bg-slate-900/30 transition" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.gradeLabel}</label>
                      <input type="text" disabled={!isEditing} value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-slate-600 disabled:bg-slate-900/30 transition" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.favSubjectsLabel}</label>
                    <input type="text" disabled={!isEditing} value={formData.favSubjects} onChange={(e) => setFormData({...formData, favSubjects: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-slate-600 disabled:bg-slate-900/30 transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.interestsLabel}</label>
                    <textarea disabled={!isEditing} value={formData.interests} onChange={(e) => setFormData({...formData, interests: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-slate-600 h-24 resize-none disabled:bg-slate-900/30 transition" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/50 rounded-3xl p-8 transition-all mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                      <MonitorSmartphone className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-200">
                        {state.language === 'bn' ? 'সিনেমাটিক ইউআই' : 'Cinematic UI'}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {state.language === 'bn' ? 'নতুন আল্ট্রা-মডার্ন ডিজাইন চালু করুন' : 'Enable new ultra-modern, headerless design'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newMode = state.uiMode === 'cinematic' ? 'standard' : 'cinematic';
                      saveState({ ...state, uiMode: newMode });
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      state.uiMode === 'cinematic' ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      state.uiMode === 'cinematic' ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-3xl p-8 shadow-inner">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                    {t.myStats}
                  </h3>
                  <div className="space-y-4">
                    {stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">{stat.icon}</div>
                          <span className="text-xs font-bold text-slate-300 tracking-wide">{stat.label}</span>
                        </div>
                        <span className="text-sm font-black text-white italic">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group shadow-2xl">
                   <Quote className="absolute -top-2 -right-2 w-16 h-16 text-indigo-500/10 group-hover:scale-110 transition-transform" />
                   <p className="text-xs italic text-indigo-200 leading-relaxed relative z-10 font-medium">"{state.language === 'bn' ? 'সফলতা কোনো দুর্ঘটনা নয়, এটি কঠোর পরিশ্রমে, অধ্যবসায়ে, শেখার মাধ্যমে অর্জিত হয়।' : 'Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing or learning to do.'}"</p>
                   <div className="mt-4 flex items-center gap-2"><div className="w-6 h-0.5 bg-indigo-500/30" /><span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Sohan Mridha</span></div>
                </div>
              </div>
            </div>

            {/* NEW: Interactive Achievement System with Badges & Progress */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <AchievementSystem 
                state={state} 
                saveState={saveState} 
                playCompletionBeep={playCompletionBeep}
                triggerCustomAlert={triggerCustomAlert}
              />
            </div>
          </motion.div>
        )}
        {activeSubTab === 'report' && (
          <motion.div key="report" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pb-28">
            <ReportDashboard state={state} language={state.language} onUpdateAchievements={(badges) => saveState({ ...state, unlockedAchievements: badges })} />
          </motion.div>
        )}
        {activeSubTab === 'social' && (
          <motion.div key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pb-28">
            {currentUser ? <Leaderboard language={state.language} /> : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto shadow-2xl"><Globe className="w-10 h-10 text-slate-700 animate-pulse" /></div>
                <div className="space-y-2"><h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">{state.language === 'bn' ? 'কমিউনিটি ড্যাশবোর্ড' : 'Global Community'}</h3><p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">{state.language === 'bn' ? 'লিডারবোর্ডে অংশ নিতে এবং অন্য স্টাডি পার্টনারদের প্রোগ্রেস দেখতে গুগল দিয়ে সাইন-ইন করুন।' : 'Sign in with Google to join the leaderboard, view study partners, and sync your data across devices.'}</p></div>
                <button onClick={handleLogin} className="px-8 py-3.5 bg-white text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-slate-100">🚀 {state.language === 'bn' ? 'গুগল দিয়ে শুরু করুন' : 'Connect with Google'}</button>
              </div>
            )}
          </motion.div>
        )}
        {activeSubTab === 'integrations' && (
          <motion.div key="integrations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pb-28 space-y-6">
             {!currentUser ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto shadow-2xl"><ShieldCheck className="w-10 h-10 text-slate-700" /></div>
                  <div className="space-y-2"><h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">{state.language === 'bn' ? 'আগে সাইন-ইন করুন' : 'Sign In Required'}</h3><p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">{state.language === 'bn' ? 'ইন্টিগ্রেশন ব্যবহার করতে হলে আগে অ্যাপে লগ-ইন করতে হবে।' : 'Please sign in to your MridhaX account first to manage external workspace integrations.'}</p></div>
                  <button onClick={handleLogin} className="px-8 py-3.5 bg-white text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl transition-all">🚀 {state.language === 'bn' ? 'লগ-ইন করুন' : 'Sign In Now'}</button>
                </div>
             ) : workspaceError === 'NOT_CONNECTED' ? (
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Link className="w-32 h-32" /></div>
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto"><Mail className="w-8 h-8 text-amber-500" /></div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-100 tracking-tight">{state.language === 'bn' ? 'গুগল ওয়ার্কস্পেস কানেক্ট করুন' : 'Connect Google Workspace'}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">{state.language === 'bn' ? 'আপনার জিমেইল এবং ক্যালেন্ডার সিঙ্ক করুন প্রোডাক্টিভিটি বাড়াতে।' : 'Sync your unread Gmail messages and upcoming calendar events directly into your MridhaX dashboard.'}</p>
                  </div>
                  <button onClick={handleConnectWorkspace} className="w-full sm:w-auto px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 mx-auto">
                    <Link className="w-4 h-4" /> {state.language === 'bn' ? 'কানেক্ট করুন' : 'Authorize Sync'}
                  </button>
                </div>
             ) : (
                <div className="space-y-6">
                  {/* Google Workspace Dashboard */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                         </div>
                         <div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-100">{state.language === 'bn' ? 'ওয়ার্কস্পেস সিঙ্কড' : 'Workspace Synced'}</h3>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest leading-none mt-1">Google API v1 Active</p>
                         </div>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={fetchWorkspaceData} disabled={isWorkspaceLoading} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition shadow-lg">
                           <RefreshCw className={`w-4 h-4 ${isWorkspaceLoading ? 'animate-spin' : ''}`} />
                         </button>
                         <button onClick={handleDisconnectWorkspace} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-400 transition">
                           {state.language === 'bn' ? 'ডিসকানেক্ট' : 'Log Out Sync'}
                         </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Gmail Section */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
                          <Mail className="w-3.5 h-3.5 text-amber-500" /> {state.language === 'bn' ? 'ইমার্জেন্সি ইমেইল' : 'Urgent Inbox'}
                        </h4>
                        
                        {isWorkspaceLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-950/50 border border-slate-800 rounded-2xl animate-pulse" />)}
                          </div>
                        ) : gmailEmails.length > 0 ? (
                          <div className="space-y-3">
                            {gmailEmails.map(email => (
                              <div key={email.id} className="bg-slate-950/60 border border-slate-800/50 rounded-2xl p-4 hover:border-amber-500/30 transition group">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest truncate max-w-[150px]">{email.from.split('<')[0]}</p>
                                  <span className="text-[8px] font-bold text-slate-600 uppercase tabular-nums">{new Date(email.date).toLocaleDateString()}</span>
                                </div>
                                <h5 className="text-xs font-black text-slate-200 mb-1 line-clamp-1">{email.subject}</h5>
                                <p className="text-[10px] text-slate-500 line-clamp-1 mb-4 italic">"{email.snippet}"</p>
                                
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => convertToTask(email)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-[8px] font-black uppercase tracking-widest text-slate-300 rounded-lg flex items-center justify-center gap-1.5 transition">
                                    <Plus className="w-3 h-3" /> {state.language === 'bn' ? 'টাস্ক করুন' : 'Make Task'}
                                  </button>
                                  <button onClick={() => convertToSubject(email)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-[8px] font-black uppercase tracking-widest text-slate-300 rounded-lg flex items-center justify-center gap-1.5 transition">
                                    <BookOpen className="w-3 h-3" /> {state.language === 'bn' ? 'স্টাডি করুন' : 'Study This'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-10 text-center bg-slate-950/40 rounded-3xl border border-dashed border-slate-800">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">{state.language === 'bn' ? 'কোনো নতুন ইমেইল নেই' : 'Inbox is Clean'}</p>
                          </div>
                        )}
                      </div>

                      {/* Calendar Section */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-blue-500" /> {state.language === 'bn' ? 'পরবর্তী ইভেন্ট' : 'Upcoming Schedule'}
                        </h4>

                        {isWorkspaceLoading ? (
                          <div className="space-y-3">
                            {[1, 2].map(i => <div key={i} className="h-24 bg-slate-950/50 border border-slate-800 rounded-2xl animate-pulse" />)}
                          </div>
                        ) : calendarEvents.length > 0 ? (
                          <div className="space-y-3">
                            {calendarEvents.map(event => (
                              <div key={event.id} className="bg-slate-950/60 border border-slate-800/50 rounded-2xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400">
                                    <span className="text-[10px] font-black italic">{new Date(event.start).getDate()}</span>
                                    <span className="text-[7px] font-bold uppercase">{new Date(event.start).toLocaleString('default', { month: 'short' })}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-black text-slate-200 truncate">{event.summary}</h5>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                      {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                                {event.location && (
                                  <p className="text-[9px] text-slate-600 truncate flex items-center gap-1">
                                    <Globe className="w-2.5 h-2.5" /> {event.location}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-10 text-center bg-slate-950/40 rounded-3xl border border-dashed border-slate-800">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">{state.language === 'bn' ? 'কোনো ইভেন্ট নেই' : 'Free Schedule'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
