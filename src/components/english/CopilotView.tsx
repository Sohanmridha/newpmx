import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Download, 
  Trash2, 
  Copy, 
  Check, 
  BookOpen, 
  Calculator, 
  MapPin, 
  Sliders, 
  Award,
  RefreshCw
} from 'lucide-react';
import { UserProgressState } from '../../types/englishCare';
import { soundFX } from '../../utils/audioFeedback';

interface CopilotViewProps {
  progress: UserProgressState;
  onEarnXp: (amount: number, reason: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  uiActions?: Array<{ label: string; action: 'add' | 'remove' | 'customize' }>;
}

const STORAGE_KEY = 'englishcare_copilot_chat_history_v1';

export const CopilotView: React.FC<CopilotViewProps> = ({ progress, onEarnXp }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'initial_msg',
        role: 'model',
        text: `**স্বাগতম! আমি MridhaX AI (PIEA)** — তোমার চিফ এক্সিকিউটিভ অ্যাসিস্ট্যান্ট, পার্সোনাল ইন্টেলিজেন্ট এক্সিকিউটিভ অ্যাসিস্ট্যান্ট এবং অল-ইন-ওয়ান স্টাডি কো-পাইলট।

জাতীয় বিশ্ববিদ্যালয় অনার্স ২য় বর্ষের নন-ক্রেডিট কম্পালসরি ইংলিশ (বিষয় কোড: ২২১১০৯) পরীক্ষায় সর্বোচ্চ প্রস্তুতি, পাস ও A+ পাওয়ার সার্বিক দিকনির্দেশনায় আমি সবসময় তোমার পাশে আছি।

তুমি যেকোনো প্রশ্ন করতে পারো:
- গ্রামার রুল ও শর্টকাট টেকনিক (Right form of verbs, Wh-questions, Rearrange ইত্যাদি)
- পোস্টার ৬-বক্স ফরম্যাট, নোটিশ বোর্ড বা সিভির কাঠামো
- ৩০ দিনের সম্পূর্ণ স্টাডি রোডম্যাপ ও পিডিএফ গাইড
- ধাপে ধাপে গণিত সমাধান ও নির্ভুল লজিক বিশ্লেষণ

আমি তোমার বন্ধু MridhaX`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);
    soundFX.playCardSwipe();

    try {
      // Build history for endpoint
      const historyPayload = messages.slice(-8).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      historyPayload.push({
        role: 'user',
        parts: [{ text: query }]
      });

      const res = await fetch('/api/ai/english-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          studentName: progress.studentName,
          targetGoal: progress.targetGoal,
          todayStudyMinutes: progress.todayStudyMinutes,
          syllabusCoveragePercent: progress.syllabusCoveragePercent,
          language: 'bn'
        })
      });

      const data = await res.json();
      const replyText = data.text || 'দুঃখিত, কোনো প্রতিক্রিয়া পাওয়া যায়নি। আবার চেষ্টা করুন।';

      const modelMessage: ChatMessage = {
        id: `mod_${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMessage]);
      soundFX.playSuccess();
      onEarnXp(15, 'Interacted with MridhaX AI');
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `mod_err_${Date.now()}`,
        role: 'model',
        text: `**[MridhaX অফলাইন রেসপন্স]**\n\nসার্ভার সংযোগে কিছুটা বিলম্ব হলেও তোমার পড়াশোনা থামবে না বন্ধু! প্রতিদিন গ্রামারের রাইট ফর্ম অফ ভার্বস এবং পোস্টার লেখার ৬-বক্স ফরম্যাট চর্চা করো।\n\nআমি তোমার বন্ধু MridhaX`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('আপনি কি চ্যাট হিস্ট্রি মুছে ফেলতে চান?')) {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([
        {
          id: 'initial_msg',
          role: 'model',
          text: 'চ্যাট হিস্ট্রি রিসেট করা হয়েছে। আমি MridhaX AI, তোমার নতুন যেকোনো নির্দেশনার অপেক্ষায় আছি।\n\nআমি তোমার বন্ধু MridhaX',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      soundFX.playCardSwipe();
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadRoadmap = (text: string) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MridhaX_EnglishCare_Roadmap_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    soundFX.playSuccess();
  };

  const quickPrompts = [
    { label: 'NU ২য় বর্ষ পাস করার গোপন শর্টকাট কৌশল', text: 'জাতীয় বিশ্ববিদ্যালয় অনার্স ২য় বর্ষের নন-ক্রেডিট কম্পালসরি ইংলিশে নিশ্চিত পাস এবং ভালো নম্বর পাওয়ার জন্য কোন কোন টপিক সবচেয়ে সহজ এবং কীভাবে খাতায় উপস্থাপন করতে হবে বিস্তারিত বলো।' },
    { label: 'পোস্টার ৬-বক্স লেখার নিয়ম ও ডেমো', text: 'পোস্টার রাইটিং এ ৪ এ ৪ পাওয়ার ৬-বক্স ফরম্যাটটি বিস্তারিত বুঝিয়ে দাও এবং যেকোনো সামাজিক সমস্যার ওপর একটি নির্ভুল ডেমো পোস্টার লিখে দাও।' },
    { label: 'Right Form of Verbs এর ৫টি সুপার রুল', text: 'Right form of verbs এর বিগত ৫ বছরের বোর্ড প্রশ্নে বারবার আসা শীর্ষ ৫টি নিয়ম বাংলা নোট ও উদাহরণসহ ধাপে ধাপে বুঝিয়ে দাও।' },
    { label: '৩০ দিনের স্টাডি রোডম্যাপ ও পিডিএফ', text: 'অনার্স ২য় বর্ষের কম্পালসরি ইংরেজির জন্য একটি ৩০ দিনের সম্পূর্ণ ডে-বাই-ডে স্টাডি রোডম্যাপ তৈরি করো যা আমি পিডিএফ আকারে সংরক্ষণ করতে পারি।' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-500 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Bot className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">MridhaX AI (PIEA)</h1>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Chief Executive Assistant
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                Personal Intelligent Executive Assistant & All-in-One Study Co-Pilot for NU Honours English.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
              title="চ্যাট হিস্ট্রি রিসেট"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Frame */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[640px]">
        {/* Chat Messages Scrollable Box */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 space-y-2 text-sm sm:text-base leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                }`}>
                  <div className="whitespace-pre-line font-sans">
                    {m.text}
                  </div>

                  {/* Actions for Model message */}
                  {!isUser && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <span>{m.timestamp}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopyText(m.text, m.id)}
                          className="flex items-center gap-1 hover:text-slate-800 transition"
                          title="কপি করুন"
                        >
                          {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        {m.text.toLowerCase().includes('roadmap') || m.text.includes('রোডম্যাপ') ? (
                          <button
                            onClick={() => handleDownloadRoadmap(m.text)}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                            title="রোডম্যাপ ডাউনলোড করুন"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF/MD</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {isUser && (
                    <div className="text-[10px] text-slate-400 text-right">
                      {m.timestamp}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start items-center"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                <span>MridhaX AI বিশ্লেষণ করছে এবং লিখছে...</span>
              </div>
            </motion.div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-3 bg-slate-100/70 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.text)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap transition"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="copilot-user-input"
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="MridhaX AI কে যেকোনো প্রশ্ন করুন বা রোডম্যাপ চান..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium text-slate-800"
              disabled={isLoading}
            />
            <button
              id="copilot-send-btn"
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
