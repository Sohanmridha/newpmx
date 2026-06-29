import React, { useEffect, useState, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  Trophy, 
  Users, 
  Flame, 
  Timer, 
  Medal, 
  X, 
  MessageSquare, 
  Send, 
  Clock, 
  Dot,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardUser {
  userId: string;
  name: string;
  totalFocusMinutes: number;
  prayerConsistency?: number;
  isSocialPublic?: boolean;
  isPrayerPublic?: boolean;
  avatarUrl?: string;
  grade?: string;
  isOnline?: boolean;
  currentActivity?: string;
  lastUpdated?: Timestamp;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Timestamp;
  avatarUrl?: string;
}

export const Leaderboard: React.FC<{ language: 'bn' | 'en' }> = ({ language }) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [activeTab, setActiveTab] = useState<'study' | 'prayer' | 'chat'>('study');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We'll fetch all top users and filter client-side for privacy flags 
    // (Ideally we'd filter in Firestore query, but flags are inside doc)
    const q = query(
      collection(db, 'users'),
      orderBy('totalFocusMinutes', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: LeaderboardUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as LeaderboardUser;
        usersData.push(data);
      });
      setUsers(usersData);
      setLoading(false);
    });

    const chatQ = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribeChat = onSnapshot(chatQ, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(msgs.reverse());
    });

    return () => {
      unsubscribe();
      unsubscribeChat();
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'messages'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'MridhaX User',
        text: newMessage,
        timestamp: serverTimestamp(),
        avatarUrl: auth.currentUser.photoURL
      });
      setNewMessage('');
    } catch (err) {
      console.error("Chat Error:", err);
    }
  };

  const isUserOnline = (user: LeaderboardUser) => {
    if (!user.lastUpdated) return false;
    const lastSeen = user.lastUpdated.toDate().getTime();
    const now = new Date().getTime();
    return (now - lastSeen) < 300000; // 5 minutes threshold
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 animate-pulse">
          {language === 'bn' ? 'লিডারবোর্ড লোড হচ্ছে...' : 'Connecting to Server...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative min-h-[600px] flex flex-col">
      <div className="flex gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button 
          onClick={() => setActiveTab('study')}
          className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'study' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Timer className="w-3.5 h-3.5" /> {language === 'bn' ? 'স্টাডি' : 'Study'}
        </button>
        <button 
          onClick={() => setActiveTab('prayer')}
          className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'prayer' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'bn' ? 'সালাত' : 'Prayers'}
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-sky-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> {language === 'bn' ? 'চ্যাট' : 'Chat'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {(activeTab === 'study' || activeTab === 'prayer') ? (
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] custom-scrollbar pr-1">
            <div className={`bg-gradient-to-r p-4 rounded-2xl flex items-center justify-between border ${activeTab === 'study' ? 'from-amber-500/10 border-amber-500/20' : 'from-emerald-500/10 border-emerald-500/20'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === 'study' ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
                  {activeTab === 'study' ? <Flame className="w-5 h-5 text-amber-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-100 uppercase tracking-tight">
                    {activeTab === 'study' ? (language === 'bn' ? 'স্টাডি পার্টনারস' : 'Study Focus Board') : (language === 'bn' ? 'সালাত শৃঙ্খলা' : 'Prayer Discipline')}
                  </h3>
                  <p className={`text-[9px] font-bold uppercase ${activeTab === 'study' ? 'text-amber-500/70' : 'text-emerald-500/70'}`}>
                    {activeTab === 'study' ? (language === 'bn' ? 'সেরা ফোকাস সময়' : 'Time Spent Focused') : (language === 'bn' ? 'সফল সালাত আদায়' : 'Successful Prayers Logged')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{users.filter(isUserOnline).length} Online</span>
              </div>
            </div>

            <div className="space-y-2">
              {users
                .filter(u => activeTab === 'study' ? u.isSocialPublic !== false : u.isPrayerPublic !== false)
                .sort((a, b) => activeTab === 'study' ? b.totalFocusMinutes - a.totalFocusMinutes : (b.prayerConsistency || 0) - (a.prayerConsistency || 0))
                .map((user, index) => {
                const online = isUserOnline(user);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    key={user.userId}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer group hover:bg-slate-900/50 ${
                      index < 3 ? (activeTab === 'study' ? 'bg-slate-900/80 border-amber-500/30' : 'bg-slate-900/80 border-emerald-500/30') : 'bg-slate-950/40 border-slate-900'
                    }`}
                  >
                    <div className="w-8 text-center">
                      {index === 0 ? <Trophy className="w-5 h-5 text-yellow-400 mx-auto" /> : 
                       index === 1 ? <Medal className="w-5 h-5 text-slate-300 mx-auto" /> :
                       index === 2 ? <Medal className="w-5 h-5 text-amber-600 mx-auto" /> :
                       <span className="text-xs font-black text-slate-600 font-mono italic">#{index + 1}</span>}
                    </div>

                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg overflow-hidden">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span className={`${activeTab === 'study' ? 'text-amber-500/50' : 'text-emerald-500/50'} font-black`}>{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      {online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse shadow-lg" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-200 truncate flex items-center gap-1.5">
                        {user.name}
                        {index === 0 && <span className={`text-[8px] px-1 rounded font-black italic ${activeTab === 'study' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}`}>CHAMP</span>}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                        {online ? (
                          <span className="text-emerald-500 flex items-center gap-0.5">
                             <Dot className="w-4 h-4 scale-150" /> {user.currentActivity || 'Active'}
                          </span>
                        ) : (
                          user.grade || (language === 'bn' ? 'স্টুডেন্ট' : 'Student')
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      {activeTab === 'study' ? (
                        <div className="flex items-center justify-end gap-1 text-xs font-black text-amber-400 font-mono leading-none">
                          <Timer className="w-3.5 h-3.5" />
                          {Math.floor(user.totalFocusMinutes / 60)}h {user.totalFocusMinutes % 60}m
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 text-xs font-black text-emerald-400 font-mono leading-none">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {user.prayerConsistency || 0}
                        </div>
                      )}
                      <div className="text-[8px] font-bold text-slate-600 uppercase mt-1 leading-none tracking-tighter">
                         {activeTab === 'study' ? (language === 'bn' ? 'ফোকাস সময়' : 'TOTAL FOCUS') : (language === 'bn' ? 'মোট সালাত' : 'TOTAL PRAYERS')}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="chat" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col h-[60vh] relative overflow-hidden">
             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, i) => {
                  const isSync = msg.userId === auth.currentUser?.uid;
                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 ${isSync ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-slate-800 shrink-0 overflow-hidden border border-slate-700">
                        {msg.avatarUrl ? (
                          <img src={msg.avatarUrl} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-500">
                            {msg.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className={`max-w-[75%] space-y-1 ${isSync ? 'items-end' : ''}`}>
                        <div className={`flex items-center gap-1.5 ${isSync ? 'flex-row-reverse' : ''}`}>
                           <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{msg.userName}</span>
                           <span className="text-[7px] text-slate-700 tabular-nums">
                              {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed shadow-lg ${isSync ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
             </div>

             <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/80 border-t border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={language === 'bn' ? 'কিছু লিখুন...' : 'Write message...'}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition shadow-xl active:scale-95">
                  <Send className="w-4 h-4" />
                </button>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-500/20 to-transparent pointer-none" />
              
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4">
                   <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-800 flex items-center justify-center text-3xl shadow-2xl overflow-hidden">
                      {selectedUser.avatarUrl ? (
                        <img src={selectedUser.avatarUrl} alt={selectedUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-amber-500 font-black">{selectedUser.name.charAt(0).toUpperCase()}</span>
                      )}
                   </div>
                   {isUserOnline(selectedUser) && (
                     <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[7px] font-black uppercase tracking-widest rounded-full border-2 border-slate-900">Online</div>
                   )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-100 tracking-tight">{selectedUser.name}</h3>
                  <div className="flex gap-2 justify-center">
                    <span className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 uppercase tracking-widest">
                      {selectedUser.grade || 'MridhaX Partner'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mt-8">
                  <div className="bg-slate-950/60 p-4 rounded-3xl border border-slate-800/50 flex flex-col items-center justify-center">
                    <Timer className="w-4 h-4 text-amber-500 mb-2" />
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Focus Capacity</p>
                    <p className="text-sm font-black text-slate-100 font-mono">
                      {Math.floor(selectedUser.totalFocusMinutes / 60)}h {selectedUser.totalFocusMinutes % 60}m
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-3xl border border-slate-800/50 flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-2" />
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Spirit Stats</p>
                    <p className="text-sm font-black text-slate-100 font-mono">
                       {selectedUser.prayerConsistency || 0} <span className="text-[9px] text-slate-500 uppercase">Times</span>
                    </p>
                  </div>
                </div>

                <div className="w-full mt-6 scale-90 opacity-60">
                   <div className="flex items-center gap-2 mb-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Growth Progress: {selectedUser.habitConsistency}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-amber-500" style={{ width: `${selectedUser.habitConsistency}%` }} />
                   </div>
                </div>

                {isUserOnline(selectedUser) && (
                   <div className="w-full mt-6 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-3xl flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="text-left">
                         <p className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest leading-none">Live Now</p>
                         <p className="text-[11px] font-black text-emerald-500 tracking-tight mt-1 truncate">{selectedUser.currentActivity || 'Active in App'}</p>
                      </div>
                   </div>
                )}

                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all mt-8"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
