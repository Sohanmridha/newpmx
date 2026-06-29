import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  X, 
  Dot, 
  Timer,
  ChevronRight,
  Search
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  Timestamp,
  where
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface OnlineUser {
  userId: string;
  name: string;
  avatarUrl?: string;
  currentActivity?: string;
  lastUpdated: Timestamp;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Timestamp;
}

export const SocialSidebar: React.FC<{ 
  language: 'bn' | 'en';
  isOpenOverride?: boolean;
  onToggle?: (val: boolean) => void;
}> = ({ language, isOpenOverride, onToggle }) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [activeChat, setActiveChat] = useState<OnlineUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = isOpenOverride !== undefined ? isOpenOverride : internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  useEffect(() => {
    // Fetch online users active in the last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const q = query(
      collection(db, 'users'),
      where('lastUpdated', '>=', Timestamp.fromDate(tenMinutesAgo)),
      orderBy('lastUpdated', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: OnlineUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as OnlineUser;
        if (data.userId !== auth.currentUser?.uid) {
           users.push(data);
        }
      });
      setOnlineUsers(users);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeChat || !auth.currentUser) return;

    // Fetch messages between current user and activeChat user
    // For simplicity in this demo, we'll use a shared room ID: min(uid1, uid2) + max(uid1, uid2)
    const roomId = [auth.currentUser.uid, activeChat.userId].sort().join('_');
    const q = query(
      collection(db, 'direct_messages'),
      where('roomId', '==', roomId),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !auth.currentUser) return;

    const roomId = [auth.currentUser.uid, activeChat.userId].sort().join('_');
    try {
      await addDoc(collection(db, 'direct_messages'), {
        roomId,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || 'Me',
        text: newMessage,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Msg Error:", err);
    }
  };

  return (
    <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-[260px]'}`}>
      <div className="flex items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 border border-slate-800 p-2.5 rounded-l-2xl shadow-2xl text-amber-500 hover:text-amber-400 transition"
        >
          {isOpen ? <ChevronRight className="w-5 h-5" /> : <Users className="w-5 h-5" />}
        </button>

        <div className="w-[280px] h-[550px] bg-slate-900 border-l border-y border-slate-800 rounded-l-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-100 flex items-center gap-2">
               <Dot className="w-4 h-4 text-emerald-500 animate-pulse scale-150" />
               {language === 'bn' ? 'অনলাইন স্ট্যাটাস' : 'Live Partners'}
            </h3>
            <span className="text-[9px] font-black text-slate-500 px-2 py-0.5 rounded-lg bg-slate-800">{onlineUsers.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {onlineUsers.length > 0 ? (
              onlineUsers.map(user => (
                <div 
                  key={user.userId} 
                  className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3 hover:border-amber-500/30 transition group cursor-pointer"
                  onClick={() => setActiveChat(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs overflow-hidden border border-slate-700">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-black text-slate-500">{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-200 truncate">{user.name}</p>
                      <p className="text-[9px] font-bold text-amber-500/80 uppercase truncate flex items-center gap-1">
                        <Timer className="w-2.5 h-2.5" /> {user.currentActivity || 'Active'}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg bg-slate-800 text-slate-500 group-hover:text-amber-500 transition opacity-0 group-hover:opacity-100">
                       <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                 <Users className="w-10 h-10 text-slate-700" />
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">No active study partners</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-slate-800">
             <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">
                <Search className="w-2.5 h-2.5" /> Recent Direct Messages
             </div>
             <div className="w-full h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center px-3 opacity-50 cursor-not-allowed">
                <span className="text-[9px] font-bold">Search Partners...</span>
             </div>
          </div>
        </div>
      </div>

      {/* Private Chat Overlay */}
      <AnimatePresence>
        {activeChat && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-0 right-[300px] w-[320px] h-[400px] bg-slate-900 border border-slate-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                    {activeChat.avatarUrl ? <img src={activeChat.avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-[10px] font-black">{activeChat.name.charAt(0)}</span>}
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-100 leading-none">{activeChat.name}</p>
                    <p className="text-[8px] text-emerald-500 font-bold uppercase mt-1">Live Chat</p>
                 </div>
              </div>
              <button 
                onClick={() => setActiveChat(null)}
                className="p-2 rounded-xl text-slate-500 hover:text-white transition hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {messages.length > 0 ? messages.map(msg => (
                 <div key={msg.id} className={`flex flex-col ${msg.senderId === auth.currentUser?.uid ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3 py-2 rounded-2xl text-[11px] max-w-[85%] ${msg.senderId === auth.currentUser?.uid ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}`}>
                       {msg.text}
                    </div>
                    <span className="text-[7px] text-slate-600 font-bold mt-1 tabular-nums">
                       {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
               )) : (
                 <div className="h-full flex items-center justify-center text-center p-10">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-loose italic">Start a conversation with {activeChat.name}</p>
                 </div>
               )}
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
               <input 
                 type="text" 
                 autoFocus
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 placeholder="Message..."
                 className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-amber-500/50"
               />
               <button type="submit" className="p-2.5 rounded-xl bg-amber-500 text-slate-950 transition hover:scale-105 active:scale-95 shadow-xl">
                  <Send className="w-4 h-4" />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
