import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { 
  TrendingUp, Sparkles, Share2, Award, Zap, Calendar, Mail, Mic, Play, 
  RefreshCw, Layers, BookOpen, AlertCircle, HelpCircle, CheckCircle, 
  ChevronRight, Compass, Target, Smartphone, Bell, Eye, EyeOff, Globe,
  Briefcase, MessageSquare, Shield, Server, Terminal, Copy, Clock, Video
} from 'lucide-react';

interface PremiumIntelHubProps {
  state: AppState;
  onSaveState: (updated: AppState) => void;
  triggerCustomAlert: (msg: string, type?: 'success' | 'warning' | 'error') => void;
  aiThemeInfo: any;
}

export const PremiumIntelHub: React.FC<PremiumIntelHubProps> = ({
  state,
  onSaveState,
  triggerCustomAlert,
  aiThemeInfo
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'presence' | 'career' | 'automation'>('analytics');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');

  // 1. Predictive Analytics states
  const [lastScanResult, setLastScanResult] = useState<any>(null);

  // 2. Presence states
  const [platform, setPlatform] = useState<string>('LinkedIn');
  const [presenceTopic, setPresenceTopic] = useState<string>('');
  const [presenceTone, setPresenceTone] = useState<string>('Professional');

  // 3. Career states
  const [careerSkill, setCareerSkill] = useState<string>('Fullstack Coding in TypeScript');
  const [careerGoal, setCareerGoal] = useState<string>('Job Ready & High-ticket Freelancing');

  // 4. Automation states
  const [calendarSync, setCalendarSync] = useState<boolean>(true);
  const [smartAlerts, setSmartAlerts] = useState<boolean>(true);
  const [voiceControl, setVoiceControl] = useState<boolean>(false);
  const [meetBridge, setMeetBridge] = useState<boolean>(false);

  // Terminal log emulation
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] MridhaX Executive Co-Pilot Subsystem active...',
    '[INTEL] Loaded historical user performance vector.',
    '[SYSTEM] Google Workspace synchronization daemon listening...'
  ]);

  const addTerminalLog = (log: string) => {
    setTerminalLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  // Helper to trigger API request to Gemini Chat Proxy
  const generateIntel = async (prompt: string, trackingMsg: string) => {
    setLoading(true);
    setResultText('');
    addTerminalLog(`[API_REQ] Sending task payload to Gemini Engine...`);
    
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          language: state.language
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error status');
      }

      const data = await response.json();
      const outputText = data.text || '';
      
      // Filter out any JSON structures that model could return
      const cleanOutput = outputText.replace(/```json\s*[\s\S]*?\s*```/g, '').trim();
      setResultText(cleanOutput);
      addTerminalLog(`[API_RES] Payload processed successfully.`);
      triggerCustomAlert(
        state.language === 'bn' ? 'মৃধাক্স ইন্টেলিজেন্স রিপোর্ট জেনারেট হয়েছে!' : 'MridhaX Intelligence Report generated!',
        'success'
      );
      
      return cleanOutput;
    } catch (err) {
      console.error(err);
      addTerminalLog(`[ERROR] Engine handshake failed.`);
      triggerCustomAlert(
        state.language === 'bn' ? 'ইন্টেলিজেন্স জেনারেট করতে সমস্যা হয়েছে!' : 'Handshake error with AI Engine!',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Run Proactive predictive scan
  const runPredictiveScan = async () => {
    const totalHabits = state.habits.length;
    const completedHabits = state.completedHabitsToday?.length || 0;
    const totalSubjects = state.subjects.length;
    const studySessions = state.studyHistory?.length || 0;
    const mobileLimit = state.mobileLimitMinutes || 120;
    
    addTerminalLog(`[SCAN] Parsing study logs, routines, and prayer compliances...`);

    const prompt = `
      You are the Proactive Intelligence module of MridhaX AI. 
      Analyze the user's current productivity parameters:
      - Total Good Habits Tracked: ${totalHabits} (Completed today: ${completedHabits})
      - Total Registered Study Subjects: ${totalSubjects}
      - Historic Study Sessions Logged: ${studySessions}
      - Set Mobile Screen Limit: ${mobileLimit} minutes
      
      Provide a highly professional and predictive performance report in ${state.language === 'bn' ? 'Bengali' : 'English'}.
      Include:
      1. **Predicted Focus Score** (A percentage with a short analytical justification).
      2. **Predictive Performance Bottlenecks & Vulnerabilities** (Predict which times or topics they might struggle with, e.g. late afternoon energy dip, or a subject needing quick revision).
      3. **Proactive Personalised Action Plan (স্বয়ংক্রিয় সমাধান প্রস্তাবনা)**: Present a targeted strategy or customized 1-day sprint plan.
      4. **Motivational Caring Encouragement**: A powerful, executive, inspirational message tailored to their stats.
      
      Keep the formatting highly professional, clean, using bullet points, and do NOT include any raw JSON tags.
    `;

    const cleanResult = await generateIntel(prompt, 'Predictive Scan');
    if (cleanResult) {
      // Formulate mock structure for visualization
      const predictedScore = Math.min(Math.max(55 + completedHabits * 10 + (studySessions * 5) - (mobileLimit > 150 ? 15 : 0), 40), 98);
      setLastScanResult({
        score: predictedScore,
        date: new Date().toLocaleDateString(),
        level: predictedScore > 85 ? 'OPTIMAL' : predictedScore > 70 ? 'STABLE' : 'CRITICAL'
      });
      addTerminalLog(`[SCAN_COMPLETED] Focus capacity is predicted at ${predictedScore}%!`);
    }
  };

  // Run Media Campaign Architect
  const runPresenceArchitect = async () => {
    if (!presenceTopic.trim()) {
      triggerCustomAlert(
        state.language === 'bn' ? 'দয়া করে একটি টপিক বা লক্ষ্যের বিবরণ দিন!' : 'Please describe a topic or objective first!',
        'warning'
      );
      return;
    }

    addTerminalLog(`[PRESENCE] Architecting multi-platform cohesive content campaign...`);

    const prompt = `
      You are the Multi-Platform Digital Presence Architect module of MridhaX AI.
      The user wants to establish a powerful, unified personal brand on ${platform}.
      - Core Topic: "${presenceTopic}"
      - Selected Tone: "${presenceTone}"
      
      Provide a high-fidelity Campaign and Content Architecture in ${state.language === 'bn' ? 'Bengali' : 'English'}:
      1. **Viral Post Hook & Script**: Draft a fully-written, premium, engaging post customized for ${platform}. Include relevant hooks, key takeaways, professional spacing, and precise hashtags.
      2. **Unified Brand Voice Blueprint**: A short strategic plan to align this topic across other platforms (Facebook, Instagram, LinkedIn, YouTube, Personal Portfolio) to guarantee cohesive visual and intellectual voice unity.
      3. **Engagement Optimization Tactics**: 3 actionable, premium Growth hacks specific to ${platform} to double their reach.
      
      Formatting: Beautiful headings, clean layouts, and copyable text blocks. Do NOT output raw JSON code.
    `;

    await generateIntel(prompt, 'Presence Architect');
  };

  // Run Career development roadmap
  const runCareerRoadmap = async () => {
    addTerminalLog(`[CAREER] Formulating step-by-step career acceleration roadmap...`);

    const prompt = `
      You are the Personalized Skill & Career Development mentor module of MridhaX AI.
      The user seeks to master a new skill and elevate their professional trajectory.
      - Target Skill: "${careerSkill}"
      - Career Goal: "${careerGoal}"
      
      Formulate a masterfully detailed, professional plan in ${state.language === 'bn' ? 'Bengali' : 'English'}:
      1. **4-Week Interactive Progression Calendar**: Break down the study curriculum into concrete step-by-step weekly tasks, daily habits, and practical project builds.
      2. **Elite Mentorship & Networking Hack**: Describe specific, high-probability outreach techniques (such as LinkedIn message drafts) to connect with target mentors or developers in this field.
      3. **Industry Integration Pipeline**: Outline the top portfolio projects to build and networking channels to secure client contracts or premium job offers.
      
      Formatting: Clean sections, tabular progress indicators, and elite mentor email templates. No raw JSON.
    `;

    await generateIntel(prompt, 'Career Roadmap');
  };

  // Toggle sync automation
  const handleToggleAutomation = (type: 'calendar' | 'alerts' | 'voice' | 'meet') => {
    playAudioClick();
    if (type === 'calendar') {
      const next = !calendarSync;
      setCalendarSync(next);
      addTerminalLog(`[AUTO] Google Calendar Auto-Sync turned ${next ? 'ON' : 'OFF'}.`);
      triggerCustomAlert(
        state.language === 'bn' ? `গুগল ক্যালেন্ডার সিঙ্ক ${next ? 'চালু' : 'বন্ধ'} হয়েছে` : `Google Calendar Sync ${next ? 'Enabled' : 'Disabled'}`,
        'success'
      );
    } else if (type === 'alerts') {
      const next = !smartAlerts;
      setSmartAlerts(next);
      addTerminalLog(`[AUTO] Proactive Smart Alert Dispatcher turned ${next ? 'ON' : 'OFF'}.`);
      triggerCustomAlert(
        state.language === 'bn' ? `স্মার্ট নোটিফিকেশন অ্যালার্টস ${next ? 'চালু' : 'বন্ধ'} হয়েছে` : `Smart Proactive Alerts ${next ? 'Enabled' : 'Disabled'}`,
        'success'
      );
    } else if (type === 'voice') {
      const next = !voiceControl;
      setVoiceControl(next);
      addTerminalLog(`[AUTO] Voice Assistant Engine listening in background...`);
      triggerCustomAlert(
        state.language === 'bn' ? 'ভয়েস কন্ট্রোল ব্যাকগ্রাউন্ড ইঞ্জিন একটিভ!' : 'Voice command listener activated in background!',
        'success'
      );
    } else if (type === 'meet') {
      const next = !meetBridge;
      setMeetBridge(next);
      addTerminalLog(`[AUTO] Zoom & Google Meet API sync daemon launched.`);
      triggerCustomAlert(
        state.language === 'bn' ? 'জুম ও গুগল মিট এপিআই ব্রিজ চালু!' : 'Zoom & Meet API bridge online!',
        'success'
      );
    }
  };

  const playAudioClick = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerCustomAlert(
      state.language === 'bn' ? 'সফলভাবে ক্লিপবোর্ডে কপি হয়েছে!' : 'Successfully copied to clipboard!',
      'success'
    );
  };

  return (
    <div className={`mt-2 mb-6 rounded-3xl border ${aiThemeInfo.border} bg-slate-950/60 backdrop-blur-xl p-4 sm:p-6 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 text-left`}>
      {/* Decorative neon linear top-bar */}
      <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${aiThemeInfo.titleGradient}`}></div>

      {/* Header containing title and sub-tag */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${aiThemeInfo.titleGradient} flex items-center justify-center text-slate-950`}>
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>{state.language === 'bn' ? 'মৃধাক্স প্রিমিয়ার ইন্টেলিজেন্স ও অটোমেশন হাব' : 'MridhaX Elite Intelligence Hub'}</span>
              <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">PREMIUM V1.8</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {state.language === 'bn' 
                ? 'প্রেডিক্টিভ অ্যানালাইসিস, ডিজিটাল ব্র্যান্ড আর্কিটেকচার, স্কিল রোডম্যাপ এবং গুগল ক্যালেন্ডার সিঙ্ক অটোমেশন' 
                : 'Predictive analytics, digital brand architecture, custom roadmap engine and productivity automations'}
            </p>
          </div>
        </div>

        {/* Real-time system state telemetry */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-xl self-start sm:self-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-slate-300 font-bold tracking-wider">
            {state.language === 'bn' ? 'সিস্টেম: অপ্টিমাল' : 'CO-PILOT ACTIVE'}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 relative z-10">
        {[
          { id: 'analytics', labelBn: 'প্রেডিক্টিভ স্ক্যান', labelEn: 'Predictive Scan', icon: TrendingUp, color: 'text-blue-400 bg-blue-500/5' },
          { id: 'presence', labelBn: 'ব্র্যান্ড আর্কিটেক্ট', labelEn: 'Brand Architect', icon: Share2, color: 'text-pink-400 bg-pink-500/5' },
          { id: 'career', labelBn: 'ক্যারিয়ার রোডম্যাপ', labelEn: 'Career Roadmap', icon: Briefcase, color: 'text-emerald-400 bg-emerald-500/5' },
          { id: 'automation', labelBn: 'রিয়েল-ওয়ার্ল্ড সিঙ্ক', labelEn: 'Smart Automation', icon: Zap, color: 'text-amber-400 bg-amber-500/5' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { playAudioClick(); setActiveTab(tab.id as any); }}
            className={`py-3 px-2 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2.5 cursor-pointer border ${
              activeTab === tab.id 
                ? `bg-slate-900 border-slate-700 text-white shadow-lg shadow-black/40` 
                : `bg-slate-900/30 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60`
            }`}
          >
            <tab.icon className={`w-4 h-4 ${tab.color}`} />
            <span className="font-semibold">{state.language === 'bn' ? tab.labelBn : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Core Dynamic Screen Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Side: Controls & Input Parameters */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* TAB 1: PREDICTIVE ANALYTICS CONTROLS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-850 p-4 rounded-2xl space-y-3 shadow-md">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>{state.language === 'bn' ? 'অতীত ও বর্তমান ডেটা ইন্টিগ্রেশন' : 'Historical Data Context'}</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {state.language === 'bn' 
                    ? 'আপনার অভ্যাসের ধারাবাহিকতা, পড়ার সাবজেক্ট ও স্ক্রিনটাইম ট্র্যাক ডেটা এনালাইসিস করে আপনার দুর্বলতা ও পরবর্তী রিভিশন পরিকল্পনা তৈরি করা হবে।' 
                    : 'Analyze your habit trends, prayer logs, subject progress, and screen activity to predict target vulnerabilities and optimal scheduling.'}
                </p>

                {/* Simulated Stats Board */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-slate-950/80 border border-slate-900 p-2.5 rounded-xl">
                    <p className="text-[9px] font-mono text-slate-500 uppercase font-black">{state.language === 'bn' ? 'সুঅভ্যাস কমপ্লিট' : 'HABITS COMPLETED'}</p>
                    <p className="text-base font-black text-blue-400 mt-1">{state.completedHabitsToday?.length || 0} / {state.habits.length}</p>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-900 p-2.5 rounded-xl">
                    <p className="text-[9px] font-mono text-slate-500 uppercase font-black">{state.language === 'bn' ? 'নিবন্ধিত বিষয়' : 'STUDY TOPICS'}</p>
                    <p className="text-base font-black text-emerald-400 mt-1">{state.subjects.length} Subjects</p>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-900 p-2.5 rounded-xl col-span-2">
                    <p className="text-[9px] font-mono text-slate-500 uppercase font-black">{state.language === 'bn' ? 'মোবাইল ইউজেজ লিমিট' : 'SCREEN TIME LIMIT'}</p>
                    <p className="text-xs font-bold text-amber-400 mt-1">{state.mobileLimitMinutes || 120} Minutes / Day</p>
                  </div>
                </div>

                {/* Score badge indicator if scan has run */}
                {lastScanResult && (
                  <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-900/30 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{state.language === 'bn' ? 'প্রেডিক্টিভ ফোকাস রেটিং' : 'PREDICTED FOCUS RATING'}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">Scanned: {lastScanResult.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">{lastScanResult.score}%</span>
                      <span className={`block text-[8px] font-extrabold px-1.5 py-0.5 rounded ml-auto mt-1 w-max ${
                        lastScanResult.level === 'OPTIMAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {lastScanResult.level}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={runPredictiveScan}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition ${
                  loading 
                    ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/15'
                }`}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4 animate-pulse" />}
                <span>{state.language === 'bn' ? 'প্রেডিক্টিভ এনালিটিক্স স্ক্যান রান করুন ⚡' : 'Execute Predictive Analytics Scan ⚡'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: MULTI-PLATFORM PRESENCE ARCHITECT */}
          {activeTab === 'presence' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-850 p-4 rounded-2xl space-y-3.5 shadow-md">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-pink-400" />
                  <span>{state.language === 'bn' ? 'ডিজিটাল কন্টেন্ট স্ট্র্যাটেজি' : 'Platform & Identity Control'}</span>
                </h4>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{state.language === 'bn' ? 'টার্গেট সোশ্যাল মিডিয়া' : 'Target Platform'}</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-pink-500 transition"
                  >
                    <option value="LinkedIn">LinkedIn (Professional Content)</option>
                    <option value="YouTube">YouTube (Script/Hook Structure)</option>
                    <option value="Facebook">Facebook (Engagement Campaign)</option>
                    <option value="Instagram">Instagram (Aesthetic Visual Plan)</option>
                    <option value="Personal Portfolio">Personal Portfolio (Brand Statement)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{state.language === 'bn' ? 'কন্টেন্ট আইডিয়া / গোল' : 'Campaign Topic / Objective'}</label>
                  <textarea
                    placeholder={state.language === 'bn' ? 'উদা: আইটি সেক্টরে ফ্রিল্যান্সিং ক্যারিয়ার গড়ার উপায় অথবা আমার নতুন কোডিং প্রজেক্টের আপডেট' : 'e.g. My study schedule, scaling an engineering portfolio, or learning React...'}
                    value={presenceTopic}
                    onChange={(e) => setPresenceTopic(e.target.value)}
                    className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-pink-500 transition resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{state.language === 'bn' ? 'ব্র্যান্ড ভয়েস ও টোন' : 'Brand Voice & Tone'}</label>
                  <select
                    value={presenceTone}
                    onChange={(e) => setPresenceTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-pink-500 transition"
                  >
                    <option value="Professional & Decisive">Professional & Decisive (Corporate standard)</option>
                    <option value="Inspirational & Caring">Inspirational & Caring (Motivating story-driven)</option>
                    <option value="Tech Geek & Analytical">Tech Geek & Analytical (Highly technical)</option>
                    <option value="Bold & Brutalist">Bold & Brutalist (High contrast statement)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={runPresenceArchitect}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition ${
                  loading 
                    ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg hover:shadow-pink-500/15'
                }`}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4 animate-pulse" />}
                <span>{state.language === 'bn' ? 'কন্টেন্ট ইকোসিস্টেম ড্রাফট করুন ✨' : 'Architect Unified Campaign ✨'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: PERSONALIZED SKILL DEVELOPMENT */}
          {activeTab === 'career' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-850 p-4 rounded-2xl space-y-3.5 shadow-md">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>{state.language === 'bn' ? 'ক্যারিয়ার ট্র্যাজেক্টরি ও মেন্টরশিপ' : 'Skill Path Blueprint'}</span>
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{state.language === 'bn' ? 'যে স্কিলটি অর্জন করতে চান' : 'Target Skill Area'}</label>
                  <input
                    type="text"
                    value={careerSkill}
                    onChange={(e) => setCareerSkill(e.target.value)}
                    placeholder="e.g. Public Speaking, Data Analysis, SQL Database design..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{state.language === 'bn' ? 'আপনার শেষ লক্ষ্য' : 'Ultimate Career Goal'}</label>
                  <input
                    type="text"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="e.g. Crack Google interview, Start freelancing, Launch a startup..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                onClick={runCareerRoadmap}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition ${
                  loading 
                    ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-emerald-500/15'
                }`}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4 animate-pulse" />}
                <span>{state.language === 'bn' ? 'ক্যারিয়ার ডেভেলপমেন্ট রোডম্যাপ রোডম্যাপ' : 'Generate Skill Path & Hacks 🚀'}</span>
              </button>
            </div>
          )}

          {/* TAB 4: SEAMLESS AUTOMATION & WORKSPACE SYNC */}
          {activeTab === 'automation' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-850 p-4 rounded-2xl space-y-3 shadow-md text-slate-300">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{state.language === 'bn' ? 'রিয়েল-ওয়ার্ল্ড ইন্টিগ্রেশন' : 'Integration Framework'}</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-1">
                  {state.language === 'bn' 
                    ? 'গুগল ক্যালেন্ডার, জুম এবং আপনার রুটিনের সাথে মৃধাক্স এআই কে ইন্টিগ্রেট করে অটোমেটিক ব্যাকগ্রাউন্ড টাস্ক রান করুন।' 
                    : 'Establish direct pipelines with productivity frameworks and real-time alerts to sync habits, calendar events, and audio feedback.'}
                </p>

                {/* Automation Toggles */}
                <div className="space-y-2 pt-1">
                  
                  {/* Google Calendar Toggle */}
                  <div className="flex justify-between items-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{state.language === 'bn' ? 'গুগল ক্যালেন্ডার সিঙ্ক' : 'Google Calendar Auto-Sync'}</p>
                        <p className="text-[9px] text-slate-500 font-medium">Auto-sync study milestones & exams</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleAutomation('calendar')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${calendarSync ? 'bg-emerald-600' : 'bg-slate-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${calendarSync ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Proactive Notification Toggle */}
                  <div className="flex justify-between items-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{state.language === 'bn' ? 'প্রেডিক্টিভ স্মার্ট অ্যালার্ট' : 'Proactive Smart Alerts'}</p>
                        <p className="text-[9px] text-slate-500 font-medium">Predict bottlenecks & suggest alerts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleAutomation('alerts')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${smartAlerts ? 'bg-emerald-600' : 'bg-slate-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${smartAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Voice Control Daemon Toggle */}
                  <div className="flex justify-between items-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                    <div className="flex items-center gap-2.5">
                      <Mic className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{state.language === 'bn' ? 'ভয়েস কন্ট্রোল ব্যাকগ্রাউন্ড' : 'Background Voice Agent'}</p>
                        <p className="text-[9px] text-slate-500 font-medium">Allows triggering commands via hotword</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleAutomation('voice')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${voiceControl ? 'bg-emerald-600' : 'bg-slate-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${voiceControl ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Zoom/Meet Automation Bridge */}
                  <div className="flex justify-between items-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{state.language === 'bn' ? 'জুম ও মিট কোলাবোরেশন' : 'Zoom & Meet Smart Bridge'}</p>
                        <p className="text-[9px] text-slate-500 font-medium">Auto-book rooms for focused studies</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleAutomation('meet')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${meetBridge ? 'bg-emerald-600' : 'bg-slate-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${meetBridge ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Telemetry Console (Simulated Command Line) */}
          <div className="bg-slate-950 border border-slate-900 p-3 rounded-2xl space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">MridhaX Live Telemetry System Logs</p>
            </div>
            <div className="font-mono text-[9px] space-y-1 text-slate-400 h-24 overflow-y-auto">
              {terminalLogs.map((log, i) => (
                <div key={i} className="truncate">
                  <span className="text-blue-500 font-bold">&gt;&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Output Report Screen Panel */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[300px]">
          <div className="bg-slate-900/60 border border-slate-850 rounded-2xl flex-1 flex flex-col overflow-hidden relative shadow-md">
            
            {/* Report Header */}
            <div className="bg-slate-900/90 border-b border-slate-850/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className={`w-4 h-4 ${aiThemeInfo.accentColor}`} />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {state.language === 'bn' ? 'মৃধাক্স ইন্টেলিজেন্স ইন্টারেক্টিভ রিপোর্ট' : 'MridhaX Strategic Action Output'}
                </span>
              </div>
              
              {resultText && (
                <button
                  onClick={() => copyToClipboard(resultText)}
                  className="px-2.5 py-1 text-[10px] font-black text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                  title="Copy output to clipboard"
                >
                  <Copy className="w-3 h-3" />
                  <span>{state.language === 'bn' ? 'কপি করুন' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Simulated Live status scanning screen */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar relative">
              
              {loading ? (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                  <div className={`w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin`}></div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-200 animate-pulse">{state.language === 'bn' ? 'ডাটা প্রসেসিং চলছে...' : 'Processing historical analytics parameters...'}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Contacting Gemini 1.5 Pro deep analyzer...</p>
                  </div>
                </div>
              ) : null}

              {/* Text Area Report Display */}
              {resultText ? (
                <div className="space-y-4 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text animate-fade-in">
                  {resultText}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-600">
                    <Compass className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-350 uppercase tracking-wider">{state.language === 'bn' ? 'কোনো একটি অপশন সিলেক্ট করুন' : 'No report compiled yet'}</h5>
                    <p className="text-[10px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                      {state.language === 'bn' 
                        ? 'বাম পাশের কন্ট্রোল প্যানেল থেকে যেকোনো একটি অপশন বেছে নিয়ে অ্যাকশন বাটন ক্লিক করুন। মৃধাক্স এআই আপনার জন্য একটি সম্পূর্ণ প্রিমিয়াম কৌশল সাজিয়ে দেবে।' 
                        : 'Choose any of the tactical tabs on the left and trigger the action engine. MridhaX AI will produce an elite tailored strategy report instantly.'}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Embedded helpful prompt suggestions */}
            <div className="bg-slate-950/80 border-t border-slate-900 p-3 flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider self-center mr-1">{state.language === 'bn' ? 'স্মার্ট প্রম্পটস:' : 'Suggested Tags:'}</span>
              {[
                state.language === 'bn' ? 'আমার দুর্বলতা কি কি?' : 'Analyze my weakness',
                state.language === 'bn' ? 'কালকের রিভিশন রুটিন' : '1-day study sprint',
                state.language === 'bn' ? 'লিঙ্কডইন ব্র্যান্ডিং ট্রিকস' : 'LinkedIn growth hacks',
                state.language === 'bn' ? 'পাবলিক স্পিকিং গাইড' : 'Public speaking outline'
              ].map((pText, index) => (
                <button
                  key={index}
                  onClick={() => {
                    playAudioClick();
                    if (activeTab === 'analytics') {
                      runPredictiveScan();
                    } else if (activeTab === 'presence') {
                      setPresenceTopic(pText);
                    } else if (activeTab === 'career') {
                      setCareerSkill(pText);
                    }
                  }}
                  className="text-[9px] font-semibold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-850 px-2 py-1 rounded-lg hover:bg-slate-850 cursor-pointer transition"
                >
                  {pText}
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
