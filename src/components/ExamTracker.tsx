import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Plus, 
  Trophy, 
  Trash2, 
  Calendar, 
  Edit2, 
  X, 
  Flame, 
  AlertTriangle, 
  Bell, 
  Clock, 
  Compass, 
  Layers, 
  CheckSquare,
  Award,
  BookOpen,
  TrendingUp,
  FolderOpen,
  MessageCircle
} from 'lucide-react';
import { AppState, ExamSubject, ExamPrepInfo } from '../types';

interface Props {
  state: AppState;
  onSaveState: (newState: AppState) => void;
  triggerCustomAlert?: (title: string, body: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  playCompletionBeep?: () => void;
  openSocialDashboard: () => void;
  triggerActionNotification?: (
    actionType: 'study_session_saved' | 'habit_toggled' | 'prayer_logged' | 'fitness_logged' | 'bad_habit_logged' | 'reflection_diary_logged' | 'exam_target_logged' | 'screen_time_high',
    meta?: any
  ) => void;
}

export const ExamTracker: React.FC<Props> = ({ 
  state, 
  onSaveState,
  triggerCustomAlert,
  playCompletionBeep,
  openSocialDashboard,
  triggerActionNotification
}) => {
  // Navigation View modes: 'live' | 'hub' | 'manage'
  const [viewMode, setViewMode] = useState<'live' | 'hub' | 'manage'>('live');

  // Multi-exam filtering categories: 'All' | 'Final' | 'Midterm' | 'Mock'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'All' | 'Final' | 'Midterm' | 'Mock'>('All');

  // Input States for adding exams
  const [newExamName, setNewExamName] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [newExamCategory, setNewExamCategory] = useState<'Final' | 'Midterm' | 'Mock'>('Final');

  // Input States for Subjects
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDate, setNewSubjectDate] = useState('');
  const [newChapterNames, setNewChapterNames] = useState<Record<string, string>>({});

  // Slide-over Drawer visibility state
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  // Active Exam editing details
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState<'Final' | 'Midterm' | 'Mock'>('Final');

  // Ticking time for countdowns
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Set local state values when active exam changes
  useEffect(() => {
    if (state.examPrep) {
      setEditName(state.examPrep.examName || '');
      setEditDate(state.examPrep.targetDate || '');
      setEditCategory(state.examPrep.category || 'Final');
    }
  }, [state.activeExamId, state.examPrep]);

  // Dynamic ticking clock for countdown precision
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. BACKWARD COMPATIBILITY MIGRATION SYSTEM
  // Migrates existing state.examPrep into multiple state.examPreps if missing
  useEffect(() => {
    const single = state.examPrep;
    const multiple = state.examPreps;
    if (single && (!multiple || multiple.length === 0)) {
      const initialId = single.id || crypto.randomUUID();
      const migratedExam = { ...single, id: initialId, category: single.category || 'Final' };
      onSaveState({
        ...state,
        examPrep: migratedExam,
        examPreps: [migratedExam],
        activeExamId: initialId
      });
    }
  }, [state.examPrep, state.examPreps]);

  // Auto-activate first exam if list exists but no active id is set
  useEffect(() => {
    const preps = state.examPreps || [];
    if (preps.length > 0 && !state.activeExamId) {
      const target = preps[0];
      onSaveState({
        ...state,
        examPrep: target,
        activeExamId: target.id || 'default'
      });
    }
  }, [state.examPreps, state.activeExamId]);

  // Helper: Parse safely
  const parseExamDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d;
  };

  // Aggregated Metrics Calculations across ALL categories
  const examPrepsList = state.examPreps || [];
  
  // 1. Total Exams Remaining (Future exams across all categories)
  const remainingExams = examPrepsList.filter(e => {
    if (!e.targetDate) return false;
    const time = new Date(e.targetDate).getTime();
    return !isNaN(time) && time > currentTime;
  });
  const totalExamsRemainingCount = remainingExams.length;

  // 2. Average Days Until Exam
  let avgDaysUntilExam = 0;
  if (totalExamsRemainingCount > 0) {
    const totalRemainingDays = remainingExams.reduce((acc, e) => {
      const time = new Date(e.targetDate).getTime();
      const diffMs = time - currentTime;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return acc + diffDays;
    }, 0);
    avgDaysUntilExam = Math.round(totalRemainingDays / totalExamsRemainingCount);
  }

  // Category counts
  const categoryCounts = {
    Final: examPrepsList.filter(e => e.category === 'Final').length,
    Midterm: examPrepsList.filter(e => e.category === 'Midterm').length,
    Mock: examPrepsList.filter(e => e.category === 'Mock').length,
  };

  // 2. EXAM URGENCY AND COLOR-CODE ALIGNMENT FUNCTION
  const getUrgencyState = (examDateStr?: string) => {
    if (!examDateStr) {
      return {
        color: 'indigo',
        text: state.language === 'bn' ? 'তারিখ নির্ধারণ করা হয়নি' : 'No target date',
        code: 'neutral',
        bg: 'bg-slate-900 border-slate-800 text-slate-400',
        progressBg: 'from-slate-500 to-slate-400'
      };
    }
    const examDate = new Date(examDateStr);
    if (isNaN(examDate.getTime())) {
      return {
        color: 'indigo',
        text: state.language === 'bn' ? 'ভুল তারিখ' : 'Invalid target date',
        code: 'neutral',
        bg: 'bg-slate-900 border-slate-800 text-slate-400',
        progressBg: 'from-slate-500 to-slate-400'
      };
    }

    const remainingMs = examDate.getTime() - currentTime;
    if (remainingMs <= 0) {
      return {
        color: 'gray',
        text: state.language === 'bn' ? 'সম্পন্ন' : 'Completed',
        code: 'past',
        bg: 'bg-slate-950/50 border-slate-900 text-slate-500',
        progressBg: 'from-slate-700 to-slate-600'
      };
    }

    const hoursRemaining = remainingMs / (1000 * 3600);
    const daysRemaining = hoursRemaining / 24;

    if (hoursRemaining < 48) {
      return {
        color: 'red',
        text: state.language === 'bn' ? 'জরুরি (< ৪৮ ঘণ্টা)' : 'Urgent (< 48 Hours)',
        code: 'danger',
        bg: 'bg-red-950/30 border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
        progressBg: 'from-red-500 via-rose-500 to-orange-500 shadow-red-500/50'
      };
    } else if (daysRemaining < 7) {
      return {
        color: 'yellow',
        text: state.language === 'bn' ? 'সতর্ক (< ৭ দিন)' : 'Warning (< 7 Days)',
        code: 'warning',
        bg: 'bg-amber-950/20 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
        progressBg: 'from-amber-500 via-orange-500 to-red-400 shadow-amber-500/30'
      };
    } else {
      return {
        color: 'green',
        text: state.language === 'bn' ? 'নিরাপদ (> ৭ দিন)' : 'Safe (> 7 Days)',
        code: 'safe',
        bg: 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400',
        progressBg: 'from-emerald-500 via-teal-500 to-indigo-500 shadow-emerald-500/20'
      };
    }
  };

  const formatDuration = (ms: number) => {
    if (ms <= 0) return state.language === 'bn' ? 'সম্পন্ন বা অতিবাহিত' : 'Completed';
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (state.language === 'bn') {
      return `${days} দিন ${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড`;
    }
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDurationShort = (ms: number) => {
    if (ms <= 0) return state.language === 'bn' ? 'অতিবাহিত' : 'Passed';
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Local notification trigger
  const triggerExamNotification = (subjectName: string, timeLeftStr: string) => {
    const title = state.language === 'bn' 
      ? `পরীক্ষা আসন্ন! 🚨` 
      : `Exam Approaching! 🚨`;
    const body = state.language === 'bn'
      ? `${subjectName} পরীক্ষা শুরু হতে আর মাত্র ${timeLeftStr} বাকি আছে! ভালো করে রিভিশন দাও!`
      : `Less than ${timeLeftStr} left for your ${subjectName} exam! Perfect time to review!`;

    if (triggerCustomAlert) {
      triggerCustomAlert(title, body, 'warning');
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: '/pwa_icon.jpg' });
        } catch (err) {
          console.warn('Native notification failed:', err);
        }
      }
    }
  };

  // Check and trigger notifications for upcoming exams within 24 hours
  useEffect(() => {
    const active = state.examPrep;
    if (!active || !active.subjects || active.subjects.length === 0) return;
    const now = currentTime;
    const notifiedMap = JSON.parse(localStorage.getItem('mridhax_notified_exams') || '{}');
    let updated = false;

    active.subjects.forEach(s => {
      if (!s.examDate) return;
      const examDate = parseExamDate(s.examDate);
      if (!examDate) return;

      const remainingMs = examDate.getTime() - now;
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (remainingMs > 0 && remainingMs <= oneDayMs && !notifiedMap[s.id]) {
        triggerExamNotification(s.name, formatDurationShort(remainingMs));
        notifiedMap[s.id] = true;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('mridhax_notified_exams', JSON.stringify(notifiedMap));
    }
  }, [state.examPrep, currentTime]);

  // Multiple Exams creation with automatic chronological target date sorting
  const createExam = (name: string, date: string, category: 'Final' | 'Midterm' | 'Mock') => {
    if (!name || !date) return;
    const newId = crypto.randomUUID();
    const newExam: ExamPrepInfo = {
      id: newId,
      examName: name,
      targetDate: date,
      subjects: [],
      badges: [],
      category
    };

    const currentPreps = state.examPreps || [];
    const updatedPreps = [...currentPreps, newExam];

    // Automatically re-sort routine by target date chronological ascending
    updatedPreps.sort((a, b) => {
      const timeA = new Date(a.targetDate).getTime();
      const timeB = new Date(b.targetDate).getTime();
      return timeA - timeB;
    });

    // Check if the currently active exam was deleted or we should set the new one
    const updatedActive = state.examPrep ? state.examPrep : newExam;
    const updatedActiveId = state.activeExamId ? state.activeExamId : newId;

    onSaveState({
      ...state,
      examPreps: updatedPreps,
      examPrep: updatedActive,
      activeExamId: updatedActiveId
    });

    if (triggerActionNotification) {
      triggerActionNotification('exam_target_logged', { subject: name });
    }

    if (triggerCustomAlert) {
      triggerCustomAlert(
        state.language === 'bn' ? 'পরীক্ষা তৈরি সফল!' : 'Exam Added!',
        state.language === 'bn' 
          ? `"${name}" (${category}) সফলভাবে যোগ হয়েছে এবং সময় অনুযায়ী সাজানো হয়েছে।` 
          : `"${name}" (${category}) has been added and scheduled successfully.`,
        'success'
      );
    }
    if (playCompletionBeep) playCompletionBeep();
  };

  // Set Active Exam selection
  const selectActiveExam = (examId: string) => {
    const list = state.examPreps || [];
    const found = list.find(e => e.id === examId);
    if (found) {
      onSaveState({
        ...state,
        examPrep: found,
        activeExamId: examId
      });
    }
  };

  // Delete Exam from Hub
  const deleteExam = (examId: string) => {
    const list = state.examPreps ? [...state.examPreps] : [];
    const updatedList = list.filter(e => e.id !== examId);
    
    let nextActive = state.examPrep;
    let nextActiveId = state.activeExamId;

    if (state.activeExamId === examId) {
      if (updatedList.length > 0) {
        nextActive = updatedList[0];
        nextActiveId = updatedList[0].id || 'default';
      } else {
        nextActive = undefined;
        nextActiveId = undefined;
      }
    }

    onSaveState({
      ...state,
      examPreps: updatedList,
      examPrep: nextActive,
      activeExamId: nextActiveId
    });
  };

  // Synchronized state updates for chapters / subjects
  const updateActiveExamData = (updatedActiveExam: ExamPrepInfo) => {
    const currentId = updatedActiveExam.id || state.activeExamId || 'default';
    const ensuredActive = { ...updatedActiveExam, id: currentId };

    let list = state.examPreps ? [...state.examPreps] : [];
    const index = list.findIndex(e => e.id === currentId);

    if (index !== -1) {
      list[index] = ensuredActive;
    } else {
      list.push(ensuredActive);
    }

    // Always keep lists chronological by targetDate
    list.sort((a, b) => {
      const timeA = new Date(a.targetDate).getTime();
      const timeB = new Date(b.targetDate).getTime();
      return timeA - timeB;
    });

    onSaveState({
      ...state,
      examPrep: ensuredActive,
      examPreps: list,
      activeExamId: currentId
    });
  };

  // Subject management
  const addSubject = () => {
    if (!newSubjectName || !state.examPrep) return;
    const updated = {
      ...state.examPrep,
      subjects: [
        ...(state.examPrep.subjects || []),
        { id: crypto.randomUUID(), name: newSubjectName, chapters: [], examDate: newSubjectDate }
      ]
    };
    updateActiveExamData(updated);

    if (triggerActionNotification) {
      triggerActionNotification('exam_target_logged', { subject: newSubjectName });
    }

    setNewSubjectName('');
    setNewSubjectDate('');
  };

  const deleteSubject = (subjectId: string) => {
    if (!state.examPrep) return;
    const updated = {
      ...state.examPrep,
      subjects: (state.examPrep.subjects || []).filter(s => s.id !== subjectId)
    };
    updateActiveExamData(updated);
  };

  const addChapter = (subjectId: string) => {
    if (!state.examPrep) return;
    const name = newChapterNames[subjectId];
    if (!name) return;
    const updatedSubjects = (state.examPrep.subjects || []).map(s => 
      s.id === subjectId ? { ...s, chapters: [...(s.chapters || []), { id: crypto.randomUUID(), name, isCompleted: false }] } : s
    );
    updateActiveExamData({
      ...state.examPrep,
      subjects: updatedSubjects
    });
    setNewChapterNames(prev => ({ ...prev, [subjectId]: '' }));
  };

  const toggleChapter = (subjectId: string, chapterId: string) => {
    if (!state.examPrep) return;
    const updatedSubjects = (state.examPrep.subjects || []).map(s => 
      s.id === subjectId ? { 
        ...s, 
        chapters: (s.chapters || []).map(c => c.id === chapterId ? { ...c, isCompleted: !c.isCompleted } : c) 
      } : s
    );
    const totalChapters = updatedSubjects.flatMap(s => s.chapters || []).length;
    const completedChapters = updatedSubjects.flatMap(s => s.chapters || []).filter(c => c.isCompleted).length;
    let newBadges = [...(state.examPrep.badges || [])];
    if (totalChapters > 0 && completedChapters === totalChapters && !newBadges.includes('Master')) {
      newBadges.push('Master');
    }
    updateActiveExamData({
      ...state.examPrep,
      subjects: updatedSubjects,
      badges: newBadges
    });
  };

  const saveExamDetails = () => {
    if (!state.examPrep) return;
    updateActiveExamData({ 
      ...state.examPrep, 
      examName: editName, 
      targetDate: editDate,
      category: editCategory
    });
    setIsEditing(false);
  };

  // Active exam variables
  const activeExam = state.examPrep;
  const subjects = activeExam?.subjects || [];
  
  const totalRemainingMs = activeExam ? Math.max(0, new Date(activeExam.targetDate).getTime() - currentTime) : 0;
  const uncompletedChapters = subjects.flatMap(s => s.chapters || []).filter(c => !c.isCompleted);
  const uncompletedSubjects = subjects.filter(s => (s.chapters || []).some(c => !c.isCompleted));
  const avgTimePerChapterMs = uncompletedChapters.length > 0 ? totalRemainingMs / uncompletedChapters.length : 0;
  const avgTimePerSubjectMs = uncompletedSubjects.length > 0 ? totalRemainingMs / uncompletedSubjects.length : 0;

  // Closest upcoming subject exam
  const sortedSubjects = [...subjects].sort((a, b) => {
    if (!a.examDate && !b.examDate) return 0;
    if (!a.examDate) return 1;
    if (!b.examDate) return -1;
    
    const timeA = new Date(a.examDate).getTime();
    const timeB = new Date(b.examDate).getTime();
    
    const remainingA = timeA - currentTime;
    const remainingB = timeB - currentTime;
    
    if (remainingA > 0 && remainingB > 0) {
      return remainingA - remainingB;
    }
    if (remainingA <= 0 && remainingB > 0) return 1;
    if (remainingB <= 0 && remainingA > 0) return -1;
    return timeB - timeA;
  });

  const closestExamMs = sortedSubjects
    .map(s => s.examDate ? new Date(s.examDate).getTime() - currentTime : null)
    .filter((ms): ms is number => ms !== null && ms > 0);
  
  const hasUrgentExam = closestExamMs.length > 0 && Math.min(...closestExamMs) <= 2 * 24 * 3600 * 1000;

  // Filter exams in Hub view by selectedCategoryFilter
  const filteredExamPreps = examPrepsList.filter(e => {
    if (selectedCategoryFilter === 'All') return true;
    return e.category === selectedCategoryFilter;
  });

  // Handle direct creation via Hub quick form
  const handleHubQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName || !newExamDate) return;
    createExam(newExamName, newExamDate, newExamCategory);
    setNewExamName('');
    setNewExamDate('');
  };

  // Handle direct creation via Slide-over drawer form
  const handleSlideOverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName || !newExamDate) return;
    createExam(newExamName, newExamDate, newExamCategory);
    setNewExamName('');
    setNewExamDate('');
    setIsSlideOverOpen(false);
  };

  return (
    <div className="space-y-8 p-1 text-slate-100 font-sans relative">
      
      <div className="flex justify-end">
         <button onClick={openSocialDashboard} className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-700 transition">
            <MessageCircle size={14} /> {state.language === 'bn' ? 'কমিউনিটি চ্যাট' : 'Community Chat'}
         </button>
      </div>

      {/* ========================================================= */}
      {/* SUMMARY CARDS SECTION (AGGREGATED METRICS ACROSS ALL EXAMS) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Exams Remaining */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              {state.language === 'bn' ? 'মোট পরীক্ষা বাকি' : 'Exams Left'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-3xl font-mono font-black text-indigo-400">
              {totalExamsRemainingCount}
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              {state.language === 'bn' ? 'সব ক্যাটাগরি মিলিয়ে' : 'Across all categories'}
            </p>
          </div>
        </motion.div>

        {/* Avg Days Until Exam */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              {state.language === 'bn' ? 'গড় দিন বাকি' : 'Avg. Days Left'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-3xl font-mono font-black text-emerald-400">
              {avgDaysUntilExam} <span className="text-xs text-slate-500">{state.language === 'bn' ? 'দিন' : 'days'}</span>
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              {state.language === 'bn' ? 'আসন্ন পরীক্ষার গড় হিসাব' : 'Aggregated countdown'}
            </p>
          </div>
        </motion.div>

        {/* Final & Midterms Count */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              {state.language === 'bn' ? 'ফাইনাল ও মিডটার্ম' : 'Final & Midterm'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-mono font-black text-amber-400">
              {categoryCounts.Final} <span className="text-xs text-slate-500">F</span> / {categoryCounts.Midterm} <span className="text-xs text-slate-500">M</span>
            </h4>
            <p className="text-[10px] text-slate-500 mt-2">
              {state.language === 'bn' ? 'প্রস্তুতি ট্র্যাকের সংখ্যা' : 'Active preparation tracks'}
            </p>
          </div>
        </motion.div>

        {/* Mock Tests Count */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
              {state.language === 'bn' ? 'মক টেস্টসমূহ' : 'Mock Tests'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-3xl font-mono font-black text-purple-400">
              {categoryCounts.Mock}
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              {state.language === 'bn' ? 'অনুশীলন ও মডেল টেস্ট' : 'Model tests logged'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3-Tab Beautiful View Navigation Panel */}
      <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
        <button 
          onClick={() => setViewMode('live')} 
          className={`flex-grow py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition ${
            viewMode === 'live' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/10' 
              : 'text-slate-500 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{state.language === 'bn' ? 'লাইভ রুটিন' : 'Live Routine'}</span>
        </button>
        <button 
          onClick={() => setViewMode('hub')} 
          className={`flex-grow py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition ${
            viewMode === 'hub' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/10' 
              : 'text-slate-500 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{state.language === 'bn' ? 'এক্সাম হাব (মাল্টিপল)' : 'Exams Hub (All)'}</span>
        </button>
        <button 
          onClick={() => setViewMode('manage')} 
          disabled={!activeExam}
          className={`flex-grow py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition disabled:opacity-30 ${
            viewMode === 'manage' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/10' 
              : 'text-slate-500 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>{state.language === 'bn' ? 'বিষয় ও সিলেবাস সাজানো' : 'Syllabus & Routine'}</span>
        </button>
      </div>

      {/* 1. LIVE DASHBOARD TAB */}
      {viewMode === 'live' && (
        <div className="space-y-8">
          {activeExam ? (
            <>
              {/* Overall Ticking Header Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[ 
                  { label: state.language === 'bn' ? `${activeExam.examName} (${activeExam.category || 'Final'}) কাউন্টডাউন` : `${activeExam.examName} (${activeExam.category || 'Final'}) Countdown`, value: formatDuration(totalRemainingMs), isCountdown: true }, 
                  { label: state.language === 'bn' ? 'গড় সময় / বিষয়' : 'Avg. Time / Subject', value: formatDuration(avgTimePerSubjectMs) }, 
                  { label: state.language === 'bn' ? 'গড় সময় / অধ্যায়' : 'Avg. Time / Chapter', value: formatDuration(avgTimePerChapterMs) } 
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ y: -4 }} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className="flex items-center gap-2 mb-1">
                      {item.isCountdown && <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />}
                      {item.isCountdown && <div className="absolute w-2.5 h-2.5 rounded-full bg-red-600" />}
                      <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">{item.label}</p>
                    </div>
                    <p className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Subject routines sorted with Urgency, Progress bars, and Urgency States */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative p-6 rounded-3xl border transition-all duration-700 bg-slate-950 overflow-hidden ${
                  hasUrgentExam 
                    ? 'border-red-500/40 shadow-[0_0_40px_-5px_rgba(239,68,68,0.2)]' 
                    : 'border-indigo-500/20 shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)]'
                }`}
              >
                {/* Fire Backdrop & Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${
                  hasUrgentExam 
                    ? 'from-red-500/5 via-transparent to-transparent' 
                    : 'from-indigo-500/5 via-transparent to-transparent'
                }`} />

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${hasUrgentExam ? 'bg-red-500/20 text-red-500 animate-bounce' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      <Flame className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        {activeExam.examName} : {state.language === 'bn' ? 'রুটিন ও প্রিপারেশন' : 'Routine & Prep'}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {state.language === 'bn' ? 'সবচেয়ে জরুরি পরীক্ষাগুলো রঙ-কোডসহ সাজানো হয়েছে' : 'Urgent papers highlighted with color-coded countdowns'}
                      </p>
                    </div>
                  </div>

                  {hasUrgentExam && (
                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-500/30 text-xs font-bold text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{state.language === 'bn' ? 'পরীক্ষা আসন্ন!' : 'EXAMS APPROACHING!'}</span>
                    </motion.div>
                  )}
                </div>

                {sortedSubjects.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    {state.language === 'bn' ? 'এই পরীক্ষায় কোনো বিষয় যোগ করা হয়নি। বিষয় সাজাতে "বিষয় ও অধ্যায় সাজানো" ট্যাবে যাও!' : 'No subjects added to this exam yet. Head over to the "Manage Subjects" tab!'}
                  </div>
                ) : (
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {sortedSubjects.map((s, index) => {
                        const examDate = parseExamDate(s.examDate);
                        const remainingMs = examDate ? examDate.getTime() - currentTime : 0;
                        const isPast = remainingMs <= 0;
                        
                        // Urgency calculation mapping to color state (Red/Yellow/Green)
                        const urgency = getUrgencyState(s.examDate);

                        // Progress metric based on chapters
                        const totalCh = s.chapters?.length || 0;
                        const completedCh = s.chapters?.filter(c => c.isCompleted).length || 0;
                        const progressPercent = totalCh > 0 ? (completedCh / totalCh) * 100 : 0;

                        return (
                          <motion.div 
                            key={s.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col bg-slate-900/30 p-5 rounded-2xl border border-slate-800 transition-all hover:border-slate-700 shadow-md"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-base md:text-lg tracking-tight">{s.name}</span>
                                  
                                  {/* Color coded Urgency state badge */}
                                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 border ${urgency.bg}`}>
                                    {urgency.code === 'danger' && <Flame className="w-2.5 h-2.5 fill-current text-red-400" />}
                                    {urgency.text}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-2 font-mono">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{s.examDate ? s.examDate : (state.language === 'bn' ? 'তারিখ নির্ধারণ করা হয়নি' : 'No date set')}</span>
                                </div>
                              </div>

                              {examDate && !isPast && (
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                                    {state.language === 'bn' ? 'বাকি সময়' : 'Time Left'}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-indigo-400">
                                    {formatDurationShort(remainingMs)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Chapters completion progress bar */}
                            <div className="mt-4 pt-3 border-t border-slate-900/50">
                              <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                                <span>{state.language === 'bn' ? `অধ্যায় প্রস্তুতি: ${completedCh}/${totalCh}` : `Chapters: ${completedCh}/${totalCh}`}</span>
                                <span className="font-mono">{Math.round(progressPercent)}%</span>
                              </div>
                              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden relative border border-slate-900">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPercent}%` }}
                                  transition={{ duration: 0.8 }}
                                  className={`h-full rounded-full bg-gradient-to-r ${urgency.progressBg}`}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            <div className="text-center p-12 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
              <Compass className="w-12 h-12 text-slate-600 mx-auto" />
              <h2 className="text-xl font-bold text-white">{state.language === 'bn' ? 'কোনো সক্রিয় পরীক্ষা নেই' : 'No Active Exam Selected'}</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                {state.language === 'bn' ? 'নতুন কোনো পরীক্ষা যোগ করার জন্য অথবা সক্রিয় করতে এক্সাম হাব ট্যাবে যাও।' : 'To create multiple exams and track your progress across all courses, visit the Exams Hub.'}
              </p>
              <button 
                onClick={() => setViewMode('hub')} 
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all shadow-lg hover:shadow-indigo-500/10"
              >
                {state.language === 'bn' ? 'এক্সাম হাব খুলুন' : 'Open Exams Hub'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. EXAMS HUB (MULTIPLE EXAMS DASHBOARD) */}
      {viewMode === 'hub' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Header */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {state.language === 'bn' ? 'এক্সাম হাব (মাল্টিপল এক্সাম ম্যানেজার)' : 'Exams Hub (All Exams)'}
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              {state.language === 'bn' ? 'ফাইনাল পরীক্ষা, মিডটার্ম, টেস্ট অথবা যেকোনো বিশেষ পরীক্ষা আলাদাভাবে যোগ করো এবং রুটিন তৈরি করো।' : 'Add and schedule multiple exams separately. Switch active tracks easily to manage individual preparations.'}
            </p>
          </div>

          {/* Quick-add form directly in Hub */}
          <form onSubmit={handleHubQuickAdd} className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {state.language === 'bn' ? 'নতুন পরীক্ষা দ্রুত যোগ করুন' : 'Quick Add New Exam'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input 
                type="text" 
                required
                value={newExamName} 
                onChange={(e) => setNewExamName(e.target.value)} 
                placeholder={state.language === 'bn' ? "পরীক্ষার নাম (উদাঃ ফাইনাল পরীক্ষা, টেস্ট ৩)" : "Exam Name (e.g., Final Exam, Term 1)"} 
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm sm:col-span-2" 
              />
              
              <select 
                value={newExamCategory} 
                onChange={(e) => setNewExamCategory(e.target.value as any)} 
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-sans"
              >
                <option value="Final">{state.language === 'bn' ? 'ফাইনাল পরীক্ষা (Final)' : 'Final Exam'}</option>
                <option value="Midterm">{state.language === 'bn' ? 'মিডটার্ম (Midterm)' : 'Midterm'}</option>
                <option value="Mock">{state.language === 'bn' ? 'মক টেস্ট (Mock)' : 'Mock Test'}</option>
              </select>

              <input 
                type="date" 
                required
                value={newExamDate} 
                onChange={(e) => setNewExamDate(e.target.value)} 
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-mono" 
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/10 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{state.language === 'bn' ? 'পরীক্ষা যোগ করুন' : 'Create Exam Track'}</span>
              </button>
            </div>
          </form>

          {/* Category Filtering Tab Bar for Multiple Exams */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/50 rounded-xl border border-slate-800/80 w-fit max-w-full overflow-x-auto">
            {(['All', 'Final', 'Midterm', 'Mock'] as const).map((cat) => {
              const count = cat === 'All' ? examPrepsList.length : examPrepsList.filter(e => e.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    selectedCategoryFilter === cat 
                      ? 'bg-slate-800 text-indigo-400 border border-indigo-500/20 shadow-md' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span>
                    {cat === 'All' && (state.language === 'bn' ? 'সব পরীক্ষা' : 'All')}
                    {cat === 'Final' && (state.language === 'bn' ? 'ফাইনাল' : 'Finals')}
                    {cat === 'Midterm' && (state.language === 'bn' ? 'মিডটার্ম' : 'Midterms')}
                    {cat === 'Mock' && (state.language === 'bn' ? 'মক টেস্ট' : 'Mocks')}
                  </span>
                  <span className="bg-slate-900 text-[10px] px-1.5 py-0.5 rounded-full text-slate-400 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* List of custom added Exams filtered by category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExamPreps.length === 0 ? (
              <div className="md:col-span-2 text-center py-16 bg-slate-950 rounded-3xl border border-slate-800/50 text-slate-500 text-sm">
                {state.language === 'bn' 
                  ? `"${selectedCategoryFilter}" ক্যাটাগরিতে কোনো পরীক্ষা তৈরি করা হয়নি।` 
                  : `No exams registered under the "${selectedCategoryFilter}" category.`}
              </div>
            ) : (
              <AnimatePresence>
                {filteredExamPreps.map((e) => {
                  const isActive = state.activeExamId === e.id;
                  const subjectsCount = e.subjects?.length || 0;
                  const totalCh = e.subjects?.flatMap(s => s.chapters || []).length || 0;
                  const completedCh = e.subjects?.flatMap(s => s.chapters || []).filter(c => c.isCompleted).length || 0;
                  const percent = totalCh > 0 ? (completedCh / totalCh) * 100 : 0;
                  
                  const urgency = getUrgencyState(e.targetDate);
                  const remMs = Math.max(0, new Date(e.targetDate).getTime() - currentTime);

                  return (
                    <motion.div 
                      key={e.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`bg-slate-950 p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isActive 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/10' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Title & Category Badge */}
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="font-bold text-white text-lg tracking-tight block leading-tight">{e.examName}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-indigo-400 font-bold uppercase tracking-wider">
                                {e.category || 'Final'}
                              </span>
                              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{e.targetDate}</span>
                              </span>
                            </div>
                          </div>
                          
                          {isActive ? (
                            <span className="text-[10px] font-black bg-indigo-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 tracking-wider uppercase animate-pulse shadow-md shadow-indigo-500/20 shrink-0">
                              Active
                            </span>
                          ) : (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${urgency.bg}`}>
                              {urgency.text}
                            </span>
                          )}
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-900/50 p-2.5 rounded-xl text-center border border-slate-900">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block font-bold">{state.language === 'bn' ? 'বিষয়' : 'Subjects'}</span>
                            <span className="text-sm font-mono font-bold text-slate-300">{subjectsCount}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block font-bold">{state.language === 'bn' ? 'অধ্যায়' : 'Chapters'}</span>
                            <span className="text-sm font-mono font-bold text-slate-300">{totalCh}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block font-bold">{state.language === 'bn' ? 'সম্পন্ন' : 'Completed'}</span>
                            <span className="text-sm font-mono font-bold text-emerald-400">{completedCh}</span>
                          </div>
                        </div>

                        {/* Overall Completion Progress bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
                            <span>{state.language === 'bn' ? 'মোট সিলেবাস সমাপ্তি' : 'Syllabus Coverage'}</span>
                            <span className="text-slate-300 font-mono">{Math.round(percent)}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                          </div>
                        </div>

                        {/* Countdown */}
                        {remMs > 0 && (
                          <div className="mt-3.5 p-2 bg-indigo-950/20 border border-indigo-900/20 rounded-xl flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{formatDuration(remMs)}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-5 pt-4 border-t border-slate-900">
                        {!isActive ? (
                          <button 
                            onClick={() => selectActiveExam(e.id || '')}
                            className="flex-grow bg-slate-900 hover:bg-indigo-650 hover:text-white border border-slate-800 text-slate-400 p-2.5 rounded-xl font-semibold text-xs transition"
                          >
                            {state.language === 'bn' ? 'সক্রিয় করুন' : 'Set Active'}
                          </button>
                        ) : (
                          <div className="flex-grow bg-indigo-950/25 border border-indigo-500/20 text-indigo-400 p-2.5 rounded-xl font-black text-center text-xs">
                            {state.language === 'bn' ? '✓ বর্তমান সক্রিয় পরীক্ষা' : '✓ Current Target Track'}
                          </div>
                        )}
                        <button 
                          onClick={() => deleteExam(e.id || '')}
                          className="bg-slate-900 hover:bg-red-950/40 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-500/20 p-2.5 rounded-xl transition shrink-0"
                          title="Delete Exam Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      )}

      {/* 3. MANAGE SUBJECTS TAB */}
      {viewMode === 'manage' && activeExam && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Active Exam details and editing */}
          <div className="flex justify-between items-center bg-slate-950 p-6 rounded-3xl border border-slate-800">
            {isEditing ? (
              <div className="flex flex-col gap-3 w-full">
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
                <select 
                  value={editCategory} 
                  onChange={(e) => setEditCategory(e.target.value as any)} 
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="Final">Final Exam</option>
                  <option value="Midterm">Midterm</option>
                  <option value="Mock">Mock Test</option>
                </select>
                <input 
                  type="date" 
                  value={editDate} 
                  onChange={(e) => setEditDate(e.target.value)} 
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
                <div className='flex gap-2'>
                  <button onClick={saveExamDetails} className="flex-1 bg-emerald-600 p-2 rounded-xl text-white font-bold hover:bg-emerald-700 transition">Save</button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-800 p-2 rounded-xl text-white font-bold hover:bg-slate-700 transition">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{state.language === 'bn' ? 'সম্পাদনা সক্রিয় ট্র্যাক' : 'Editing Active Target'}</span>
                  <h2 className="text-2xl font-bold text-white mt-0.5">{activeExam.examName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-indigo-400 font-bold uppercase tracking-wider">
                      {activeExam.category || 'Final'}
                    </span>
                    <p className="text-xs text-indigo-400 font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{activeExam.targetDate}</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsEditing(true)} className="p-3 text-slate-500 hover:text-indigo-400 hover:bg-slate-900 rounded-xl transition">
                  <Edit2 className='w-5 h-5'/>
                </button>
              </>
            )}
          </div>

          {/* Form to Add Subject to currently active exam */}
          <div className="flex flex-col md:flex-row gap-2 bg-slate-950 p-4 rounded-3xl border border-slate-800">
            <input 
              type="text" 
              value={newSubjectName} 
              onChange={(e) => setNewSubjectName(e.target.value)} 
              placeholder={state.language === 'bn' ? "বিষয়ের নাম (উদাঃ ফিজিক্স, ম্যাথ)" : "Subject Name (e.g., Physics, Chemistry)"} 
              className="flex-grow bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 text-sm" 
            />
            <input 
              type="date" 
              value={newSubjectDate} 
              onChange={(e) => setNewSubjectDate(e.target.value)} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono" 
            />
            <button onClick={addSubject} className="bg-indigo-600 hover:bg-indigo-700 px-5 rounded-xl text-white transition flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* List of Subjects under Active Exam */}
          <div className="space-y-4">
            {subjects.length === 0 ? (
              <div className="text-center py-12 bg-slate-950 rounded-3xl border border-slate-800/40 text-slate-500 text-sm">
                {state.language === 'bn' ? 'কোনো বিষয় যোগ করা হয়নি। উপরে বিষয়ের নাম লিখে যোগ করো!' : 'No subjects added to this track. Use the form above to add subjects!'}
              </div>
            ) : (
              subjects.map(subject => (
                <div key={subject.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
                  
                  {/* Subject Header with date and actions */}
                  <div className="p-5 flex justify-between items-center bg-slate-900/50 border-b border-slate-900">
                    <div>
                      <h3 className="font-bold text-white text-lg">{subject.name}</h3>
                      {subject.examDate && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-mono">
                          <Calendar className='w-3.5 h-3.5 text-indigo-400'/> 
                          <span>{subject.examDate}</span>
                        </p>
                      )}
                    </div>
                    <button onClick={() => deleteSubject(subject.id)} className="text-slate-500 hover:text-red-400 hover:bg-red-950/10 p-2.5 rounded-xl transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Chapters List and Inputs */}
                  <div className="p-6 space-y-3 bg-slate-950">
                    {(!subject.chapters || subject.chapters.length === 0) ? (
                      <p className="text-xs text-slate-600 text-center py-2">
                        {state.language === 'bn' ? 'কোনো অধ্যায় যোগ করা হয়নি।' : 'No chapters added to this subject.'}
                      </p>
                    ) : (
                      subject.chapters.map(chapter => (
                        <button 
                          key={chapter.id} 
                          onClick={() => toggleChapter(subject.id, chapter.id)} 
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                            chapter.isCompleted 
                              ? 'bg-emerald-950/10 border-emerald-900/40' 
                              : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <span className={`${chapter.isCompleted ? 'text-emerald-400 font-semibold' : 'text-slate-300'} text-sm`}>
                            {chapter.name}
                          </span>
                          {chapter.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                          )}
                        </button>
                      ))
                    )}

                    {/* Inline form to add Chapter */}
                    <div className="flex gap-2 pt-2">
                      <input 
                        type="text" 
                        value={newChapterNames[subject.id] || ''} 
                        onChange={(e) => setNewChapterNames(prev => ({ ...prev, [subject.id]: e.target.value }))} 
                        placeholder={state.language === 'bn' ? "অধ্যায়ের নাম..." : "Add chapter name..."} 
                        className="flex-grow bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500" 
                      />
                      <button onClick={() => addChapter(subject.id)} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-white transition">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* FLOATING ACTION BUTTON (FAB) & SLIDE-OVER DRAWER FORM */}
      {/* ========================================================= */}
      
      {/* 1. Floating Action Button (FAB) */}
      <div className="fixed bottom-24 right-6 z-40">
        <motion.button
          onClick={() => setIsSlideOverOpen(true)}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-5 py-4 rounded-full font-black text-sm shadow-[0_4px_25px_rgba(245,158,11,0.4)] tracking-wider uppercase cursor-pointer border border-amber-400"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span className="hidden md:inline">
            {state.language === 'bn' ? 'নতুন পরীক্ষা' : 'New Exam'}
          </span>
        </motion.button>
      </div>

      {/* 2. Slide-Over Drawer Overlay & Form */}
      <AnimatePresence>
        {isSlideOverOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop click behavior */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSlideOverOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-md"
              >
                <div className="h-full flex flex-col bg-slate-950 border-l border-slate-800 shadow-2xl relative overflow-hidden">
                  
                  {/* Decorative glowing background line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
                  
                  {/* Drawer Header */}
                  <div className="p-6 border-b border-slate-900 flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {state.language === 'bn' ? 'নতুন পরীক্ষা তৈরি' : 'Create New Exam'}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {state.language === 'bn' ? 'সব পরীক্ষা সময় অনুযায়ী ক্রমানুসারে সাজানো হবে' : 'Exams will be automatically sorted chronologically'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsSlideOverOpen(false)}
                      className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Drawer Content (Form) */}
                  <form onSubmit={handleSlideOverSubmit} className="flex-grow p-6 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-6">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-black text-slate-400">
                          {state.language === 'bn' ? 'পরীক্ষার নাম' : 'Exam Name'}
                        </label>
                        <input 
                          type="text"
                          required
                          value={newExamName}
                          onChange={(e) => setNewExamName(e.target.value)}
                          placeholder={state.language === 'bn' ? 'উদাঃ ফাইন্যাল পরীক্ষা, টেস্ট ২' : 'e.g., Final Exam 2026, Sem 2 Midterm'}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      </div>

                      {/* Category input */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-black text-slate-400">
                          {state.language === 'bn' ? 'ক্যাটাগরি নির্ধারণ করুন' : 'Exam Category'}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Final', 'Midterm', 'Mock'] as const).map((cat) => {
                            const isSelected = newExamCategory === cat;
                            return (
                              <button
                                type="button"
                                key={cat}
                                onClick={() => setNewExamCategory(cat)}
                                className={`py-3 px-1 rounded-xl text-xs font-bold border transition ${
                                  isSelected 
                                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                {cat === 'Final' && (state.language === 'bn' ? 'ফাইনাল' : 'Final')}
                                {cat === 'Midterm' && (state.language === 'bn' ? 'মিডটার্ম' : 'Midterm')}
                                {cat === 'Mock' && (state.language === 'bn' ? 'মক টেস্ট' : 'Mock')}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Date input */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-black text-slate-400">
                          {state.language === 'bn' ? 'টার্গেট শেষ তারিখ' : 'Target Target Date'}
                        </label>
                        <div className="relative">
                          <input 
                            type="date"
                            required
                            value={newExamDate}
                            onChange={(e) => setNewExamDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions inside Drawer */}
                    <div className="pt-6 border-t border-slate-900 flex gap-3 mt-8">
                      <button 
                        type="button"
                        onClick={() => setIsSlideOverOpen(false)}
                        className="flex-grow bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3.5 rounded-xl text-sm transition text-center"
                      >
                        {state.language === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button 
                        type="submit"
                        className="flex-grow bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 text-center"
                      >
                        {state.language === 'bn' ? 'সংরক্ষণ' : 'Add Schedule'}
                      </button>
                    </div>
                  </form>

                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
