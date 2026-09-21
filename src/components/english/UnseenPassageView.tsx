import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  ListOrdered, 
  Award, 
  Languages, 
  Copy, 
  Check,
  ChevronRight
} from 'lucide-react';
import { UNSEEN_PASSAGES_LIST } from '../../data/unseenPassagesData';
import { UnseenPassageData } from '../../types/englishCare';
import { soundFX } from '../../utils/audioFeedback';

interface UnseenPassageViewProps {
  onEarnXp: (amount: number, reason: string) => void;
  onUpdateCoverage: (percent: number) => void;
}

export const UnseenPassageView: React.FC<UnseenPassageViewProps> = ({ onEarnXp, onUpdateCoverage }) => {
  const [selectedPassage, setSelectedPassage] = useState<UnseenPassageData>(UNSEEN_PASSAGES_LIST[0]);
  const [showBangla, setShowBangla] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'reading' | 'questions' | 'ideas' | 'vocab' | 'summary'>('reading');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [completedPassages, setCompletedPassages] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleRevealAnswer = (index: number) => {
    setRevealedAnswers(prev => ({ ...prev, [index]: !prev[index] }));
    soundFX.playCardSwipe();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMarkCompleted = (passageId: string) => {
    if (!completedPassages.includes(passageId)) {
      setCompletedPassages(prev => [...prev, passageId]);
      soundFX.playLevelUp();
      onEarnXp(50, 'Completed Unseen Passage study');
      onUpdateCoverage(5);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Part A: Reading Comprehension (20 Marks)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Unseen Passage Master
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
              জাতীয় বিশ্ববিদ্যালয়ের বিগত বছরের আনসিন প্যাসেজ, Wh-প্রশ্নের নির্ভুল উত্তর, Main & Supporting Ideas এবং ৪-ধাপ সামারি লেখার টেকনিক।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleMarkCompleted(selectedPassage.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition ${
                completedPassages.includes(selectedPassage.id)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completedPassages.includes(selectedPassage.id) ? 'পড়া সম্পন্ন (+50 XP)' : 'Mark as Practiced (+50 XP)'}
            </button>
          </div>
        </div>

        {/* Passage Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 no-scrollbar border-t border-slate-800/80 mt-6">
          {UNSEEN_PASSAGES_LIST.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPassage(p);
                setRevealedAnswers({});
                soundFX.playCardSwipe();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                selectedPassage.id === p.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>Passage {p.passageNumber}: {p.title}</span>
              {completedPassages.includes(p.id) && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Passage Text Reader */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Passage #{selectedPassage.passageNumber}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">{selectedPassage.title}</h2>
              </div>
              <button
                id="toggle-unseen-bangla-btn"
                onClick={() => {
                  setShowBangla(!showBangla);
                  soundFX.playCardSwipe();
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                  showBangla
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                {showBangla ? 'বাংলা অনুবাদ লুকান' : 'সহজ বাংলা অনুবাদ দেখুন'}
              </button>
            </div>

            {/* Passage Text */}
            <div className="space-y-4 font-serif text-slate-800 text-base sm:text-lg leading-relaxed text-justify">
              <p className="bg-slate-50/70 p-5 rounded-xl border border-slate-100">
                {selectedPassage.passageEnglish}
              </p>
            </div>

            {/* Bangla Translation Slide */}
            <AnimatePresence>
              {showBangla && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 text-sm sm:text-base leading-relaxed text-emerald-950 font-sans"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5" />
                    বাংলা ভাবার্থ:
                  </div>
                  <p>{selectedPassage.passageBangla}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sub-Section Tabs for Answering NU Questions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3 no-scrollbar">
              {[
                { id: 'questions', label: '1(a) Wh-Questions (6m)', icon: HelpCircle },
                { id: 'ideas', label: '1(b) Main & Supporting Ideas (4m)', icon: ListOrdered },
                { id: 'vocab', label: '1(c) Word & Sentences (4m)', icon: BookOpen },
                { id: 'summary', label: '1(e) Summary Formula (4m)', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      soundFX.playCardSwipe();
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Question Sub-view contents */}
            <div>
              {/* Part A: Questions */}
              {activeTab === 'questions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Answer all 3 questions (2 marks each = 6 marks)</span>
                    <span>Click 'Reveal Model Answer' to self-test</span>
                  </div>
                  {selectedPassage.questions.partA.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          <span className="text-emerald-700 mr-2">Q{idx + 1}.</span>
                          {q.question}
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          {q.marks} Marks
                        </span>
                      </div>

                      {revealedAnswers[idx] ? (
                        <div className="bg-white p-3.5 rounded-lg border border-emerald-200 text-sm text-slate-800 space-y-1">
                          <span className="text-xs font-bold uppercase text-emerald-700 block">Model Answer:</span>
                          <p className="font-serif leading-relaxed text-slate-900">{q.answer}</p>
                          <button
                            onClick={() => toggleRevealAnswer(idx)}
                            className="text-xs text-slate-500 hover:text-slate-700 mt-2 block"
                          >
                            Hide Answer
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleRevealAnswer(idx)}
                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Reveal Model Answer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Part B: Main & Supporting Ideas */}
              {activeTab === 'ideas' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">৪ নম্বরের জন্য ১টি মেইন আইডিয়া এবং ৩টি সাপোর্টিং আইডিয়া লেখা নিয়ম</span>
                    <button
                      onClick={() => handleCopy(`Main Idea:\n${selectedPassage.questions.partB.mainIdea}\n\nSupporting Ideas:\n${selectedPassage.questions.partB.supportingIdeas.join('\n')}`, 'ideas')}
                      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      {copiedId === 'ideas' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Table
                    </button>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                      Main Idea (মূল ভাব):
                    </span>
                    <p className="font-serif text-slate-900 text-sm sm:text-base font-semibold">
                      {selectedPassage.questions.partB.mainIdea}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                      Supporting Ideas (সমর্থনকারী বাক্যসমূহ):
                    </span>
                    <div className="space-y-2">
                      {selectedPassage.questions.partB.supportingIdeas.map((idea, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-serif leading-relaxed">{idea}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Part C: Vocab & Sentences */}
              {activeTab === 'vocab' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 font-medium">
                    Write meanings of the words and make sentences using them (৪ মার্ক)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm border-collapse border border-slate-200 text-slate-700">
                      <thead className="bg-slate-100 text-slate-900 font-bold">
                        <tr>
                          <th className="border border-slate-300 p-2 text-left">Given Word</th>
                          <th className="border border-slate-300 p-2 text-left">Meaning in English</th>
                          <th className="border border-slate-300 p-2 text-left">Make Sentence (NU Model)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPassage.questions.partC.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="border border-slate-300 p-2 font-bold text-slate-900">{item.word}</td>
                            <td className="border border-slate-300 p-2 text-slate-600">{item.meaning}</td>
                            <td className="border border-slate-300 p-2 font-serif text-slate-800">{item.sentence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Part E: Summary */}
              {activeTab === 'summary' && (
                <div className="space-y-5">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950 text-sm">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      জাতীয় বিশ্ববিদ্যালয়ের সামারি লেখার ৪টি গোল্ডেন রুল:
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>প্যাসেজের হুবহু কোনো লাইন সরাসরি কপি করবেন না, নিজের ভাষায় লিখবেন।</li>
                      <li>সামারির দৈর্ঘ্য মূল প্যাসেজের ৩ ভাগের ১ ভাগ (১/৩) হবে (৪ থেকে ৫ লাইন)।</li>
                      <li>সামারিতে কোনো উদাহরণ, উদ্ধৃতি (Quotation) বা উপমা ব্যবহার করবেন না।</li>
                      <li>একটি প্যারাগ্রাফেই সম্পূর্ণ সামারি শেষ করতে হবে।</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        NU Model Summary (৪ এ ৪ মার্ক উত্তর):
                      </span>
                      <button
                        onClick={() => handleCopy(selectedPassage.questions.partE.summary, 'summary')}
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        {copiedId === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy Summary
                      </button>
                    </div>
                    <p className="font-serif text-sm sm:text-base leading-relaxed text-slate-800 p-4 bg-slate-50 rounded-lg border border-slate-100 text-justify">
                      {selectedPassage.questions.partE.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Vocabulary and Strategy Checklist */}
        <div className="lg:col-span-1 space-y-5">
          {/* Passage Quick Vocab Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Key Words in this Passage
            </h3>
            <div className="space-y-2">
              {selectedPassage.vocabularyList.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{item.word}</span>
                    <span className="text-xs text-slate-500">{item.meaningEn}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-serif italic">{item.sentence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Marks Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              NU Marks Distribution (20m):
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">1(a) Wh-Questions (3x2)</span>
                <span className="font-bold text-slate-900">06 Marks</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">1(b) Main & Supporting Ideas</span>
                <span className="font-bold text-slate-900">04 Marks</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">1(c) Word Meaning & Sentence</span>
                <span className="font-bold text-slate-900">04 Marks</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">1(d) Keywords Analysis</span>
                <span className="font-bold text-slate-900">02 Marks</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">1(e) Passage Summary</span>
                <span className="font-bold text-slate-900">04 Marks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
