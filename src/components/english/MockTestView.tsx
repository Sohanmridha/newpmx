import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Printer, 
  FileText, 
  Award, 
  AlertCircle, 
  Check, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark
} from 'lucide-react';
import { FULL_MODEL_TESTS } from '../../data/mockTestsData';
import { ModelTestFull, ModelTestQuestion } from '../../types/englishCare';
import { soundFX } from '../../utils/audioFeedback';

interface MockTestViewProps {
  onEarnXp: (amount: number, reason: string) => void;
  onRecordTestResult: (result: {
    testId: string;
    testNumber: number;
    score: number;
    totalMarks: number;
    date: string;
    timeTakenSeconds: number;
  }) => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({ onEarnXp, onRecordTestResult }) => {
  const [currentTest, setCurrentTest] = useState<ModelTestFull>(FULL_MODEL_TESTS[0]);
  const [selectedSection, setSelectedSection] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  
  // Timer State (180 mins default)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(180 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);
  
  // Solutions Toggle
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  
  // Self Evaluation Score
  const [userScores, setUserScores] = useState<Record<string, number>>({});
  const [isSubmittingScores, setIsSubmittingScores] = useState<boolean>(false);
  const [finalCalculatedResult, setFinalCalculatedResult] = useState<{
    totalScore: number;
    passed: boolean;
    isAplus: boolean;
  } | null>(null);

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsExamFinished(true);
            soundFX.playLevelUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemainingSeconds]);

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
    soundFX.playCardSwipe();
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemainingSeconds(currentTest.totalTimeMinutes * 60);
    setIsExamFinished(false);
    soundFX.playCardSwipe();
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSolution = (questionId: string) => {
    setRevealedSolutions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
    soundFX.playCardSwipe();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFinishAndEvaluate = () => {
    setIsTimerRunning(false);
    setIsExamFinished(true);
    soundFX.playLevelUp();

    // Calculate score
    const totalScore = Object.values(userScores).reduce<number>((acc, curr) => acc + (Number(curr) || 0), 0);
    const passed = totalScore >= currentTest.passMarks;
    const isAplus = totalScore >= 80;

    setFinalCalculatedResult({
      totalScore,
      passed,
      isAplus
    });

    const timeSpent = (currentTest.totalTimeMinutes * 60) - timeRemainingSeconds;

    onRecordTestResult({
      testId: currentTest.id,
      testNumber: currentTest.testNumber,
      score: totalScore,
      totalMarks: currentTest.totalMarks,
      date: new Date().toISOString().split('T')[0],
      timeTakenSeconds: timeSpent
    });

    onEarnXp(passed ? 150 : 50, `Completed 100-Mark Model Test #${currentTest.testNumber}`);
  };

  const filteredQuestions = selectedSection === 'ALL'
    ? currentTest.questions
    : currentTest.questions.filter(q => q.section === selectedSection);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              National University Examination Simulator (100 Marks)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {currentTest.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
              Subject Code: <strong>{currentTest.code}</strong> | Total Time: <strong>{currentTest.totalTimeMinutes} Minutes (3 Hours)</strong> | Pass Marks: <strong>{currentTest.passMarks}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              Print Question Paper
            </button>
          </div>
        </div>

        {/* Live Exam Timer Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl flex items-center gap-3 border ${
              timeRemainingSeconds < 1800 
                ? 'bg-rose-950/70 border-rose-600/50 text-rose-300 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-indigo-200'
            }`}>
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Exam Countdown Timer</div>
                <div className="text-xl sm:text-2xl font-mono font-black text-white">
                  {formatTime(timeRemainingSeconds)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="exam-timer-toggle-btn"
                onClick={toggleTimer}
                className={`p-3 rounded-xl flex items-center justify-center font-bold text-sm transition shadow-sm ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
                title={isTimerRunning ? 'পরীক্ষা থামান (Pause)' : 'পরীক্ষা শুরু করুন (Start)'}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
                title="রিসেট করুন"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="finish-exam-evaluate-btn"
              onClick={handleFinishAndEvaluate}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Exam & Self-Evaluate
            </button>
          </div>
        </div>
      </div>

      {/* Result Card if Finished */}
      {finalCalculatedResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 sm:p-8 rounded-2xl border ${
            finalCalculatedResult.passed
              ? 'bg-emerald-950 text-white border-emerald-500/40'
              : 'bg-rose-950 text-white border-rose-500/40'
          } shadow-xl`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Exam Evaluation Result
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {finalCalculatedResult.passed ? '🎉 Congratulations! You Passed!' : 'Needs Improvement! Keep Practicing!'}
              </h2>
              <p className="text-sm text-slate-300">
                Your Estimated Score: <strong>{finalCalculatedResult.totalScore} / 100</strong> (Pass Marks: 40)
              </p>
            </div>
            <div className="text-center bg-white/10 px-6 py-4 rounded-xl border border-white/20">
              <span className="text-xs uppercase tracking-wider block text-slate-300">Grade Equivalent</span>
              <span className="text-3xl font-black text-amber-300">
                {finalCalculatedResult.isAplus ? 'A+ (Distinction)' : finalCalculatedResult.passed ? 'Passed (Satisfactory)' : 'Fail'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Sections (100 Marks)' },
            { id: 'A', label: 'Part A: Reading (20m)' },
            { id: 'B', label: 'Part B: Grammar (45m)' },
            { id: 'C', label: 'Part C: Writing (35m)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedSection(tab.id as any);
                soundFX.playCardSwipe();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                selectedSection === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredQuestions.length} Questions
        </div>
      </div>

      {/* Question Paper View */}
      <div className="space-y-6">
        {filteredQuestions.map((q, qIndex) => {
          const isRevealed = revealedSolutions[q.id];
          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* Question Header */}
              <div className="bg-slate-50/80 p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      Section {q.section}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Question #{qIndex + 1}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{q.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-black text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                    {q.marks} Marks
                  </span>
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    {isRevealed ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Hide Solution</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Show Model Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="text-xs font-semibold text-slate-500 italic">
                  Instruction: {q.instruction}
                </div>
                <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-800 font-serif bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                  {q.content}
                </div>

                {/* Optional Score entry for self-assessment */}
                <div className="pt-2 flex items-center gap-3 text-xs">
                  <label className="font-bold text-slate-700">Self Evaluation Marks (out of {q.marks}):</label>
                  <input
                    type="number"
                    min="0"
                    max={q.marks}
                    value={userScores[q.id] !== undefined ? userScores[q.id] : ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setUserScores(prev => ({
                        ...prev,
                        [q.id]: Math.min(q.marks, Math.max(0, val))
                      }));
                    }}
                    placeholder={`0 - ${q.marks}`}
                    className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Model Solution Dropdown */}
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-slate-200 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        Official Model Answer & Marking Guidelines:
                      </div>
                      <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 text-sm sm:text-base whitespace-pre-line font-serif text-slate-900 leading-relaxed">
                        {q.solution}
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900">
                        <strong>Teacher's Tip:</strong> {q.explanationBn}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
