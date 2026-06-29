import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle, Trophy, User, Users, Send, X } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, Timestamp } from 'firebase/firestore';

export function SocialDashboard({ userId, onClose }: { userId: string, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'community' | 'messenger' | 'leaderboard' | 'profile'>('community');

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Header - Only shown if not in Profile tab */}
      {activeTab !== 'profile' && (
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <h1 className="text-lg font-semibold capitalize">{activeTab}</h1>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900">
        <button onClick={() => setActiveTab('community')} className={`flex-1 p-4 ${activeTab === 'community' ? 'border-b-2 border-emerald-500 bg-slate-900 text-emerald-400' : 'text-slate-500'}`}><Users size={20}/></button>
        <button onClick={() => setActiveTab('messenger')} className={`flex-1 p-4 ${activeTab === 'messenger' ? 'border-b-2 border-emerald-500 bg-slate-900 text-emerald-400' : 'text-slate-500'}`}><MessageCircle size={20}/></button>
        <button onClick={() => setActiveTab('leaderboard')} className={`flex-1 p-4 ${activeTab === 'leaderboard' ? 'border-b-2 border-emerald-500 bg-slate-900 text-emerald-400' : 'text-slate-500'}`}><Trophy size={20}/></button>
        <button onClick={() => setActiveTab('profile')} className={`flex-1 p-4 ${activeTab === 'profile' ? 'border-b-2 border-emerald-500 bg-slate-900 text-emerald-400' : 'text-slate-500'}`}><User size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'community' && <div className="p-4">Community Content</div>}
        {activeTab === 'messenger' && <div className="p-4">Messenger Content</div>}
        {activeTab === 'leaderboard' && <div className="p-4">Leaderboard Content</div>}
        {activeTab === 'profile' && (
          <div className="p-6 relative flex flex-col items-center">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700">
              <X size={20} />
            </button>
            <div className="w-24 h-24 rounded-full bg-slate-700 mb-4 border-4 border-slate-800 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} alt="Profile" className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-white">Your Profile</h2>
            <p className="text-slate-400 mb-8">Passionate learner & consistent achiever</p>
            
            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-500 uppercase">Points</p>
                    <p className="text-xl font-bold text-emerald-400">1,240</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-500 uppercase">Streak</p>
                    <p className="text-xl font-bold text-amber-400">12 Days</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-500 uppercase">Score</p>
                    <p className="text-xl font-bold text-blue-400">98%</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
