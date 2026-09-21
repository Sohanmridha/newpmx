import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  FileText, 
  Shuffle, 
  Type, 
  Languages,
  Check,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { RIGHT_FORM_OF_VERBS_RULES } from '../../data/rightFormOfVerbsData';
import { WH_QUESTIONS_RULES, WH_DRAG_DROP_EXERCISES } from '../../data/whQuestionsData';
import { SENTENCE_CORRECTION_RULES, TOP_CORRECTION_DRILLS } from '../../data/sentenceCorrectionData';
import { ARTICLE_PASSAGES, PUNCTUATION_PASSAGES } from '../../data/articlesAndPunctuationData';
import { BOOSTER_REARRANGEMENTS, CHANGING_WORDS_LIST, TOP_TRANSLATIONS } from '../../data/rearrangeAndWordsData';
import { GrammarCategory } from '../../types/englishCare';
import { soundFX } from '../../utils/audioFeedback';
import confetti from 'canvas-confetti';

interface GrammarMasterViewProps {
  onEarnXp: (amount: number, reason: string) => void;
  completedRules: string[];
  onCompleteRule: (ruleId: string) => void;
}

export const GrammarMasterView: React.FC<GrammarMasterViewProps> = ({
  onEarnXp,
  completedRules,
  onCompleteRule
}) => {
  const [activeCategory, setActiveCategory] = useState<GrammarCategory>('right_form_of_verbs');
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number>(0);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});

  // Wh Builder interactive state
  const [whExerciseIndex, setWhExerciseIndex] = useState<number>(0);
  const [whCurrentTokens, setWhCurrentTokens] = useState<string[]>([]);
  const [whAvailableTokens, setWhAvailableTokens] = useState<string[]>(
    WH_DRAG_DROP_EXERCISES[0]?.scrambledWords || []
  );
  const [whFeedback, setWhFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Rearrange interactive state
  const [rearrangeIndex, setRearrangeIndex] = useState<number>(0);
  const [rearrangeTokens, setRearrangeTokens] = useState<string[]>([]);
  const [rearrangePool, setRearrangePool] = useState<string[]>(
    BOOSTER_REARRANGEMENTS[0]?.tokens ? [...BOOSTER_REARRANGEMENTS[0].tokens].sort(() => Math.random() - 0.5) : []
  );
  const [rearrangeFeedback, setRearrangeFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Articles & Punctuation revealed state
  const [revealedArticles, setRevealedArticles] = useState<Record<string, boolean>>({});
  const [revealedPunctuation, setRevealedPunctuation] = useState<Record<string, boolean>>({});

  // Changing words filter
  const [changingPosFilter, setChangingPosFilter] = useState<'all' | 'noun' | 'verb' | 'adj' | 'adv'>('all');

  const categories = [
    { id: 'right_form_of_verbs', name: 'Right Form of Verbs', icon: BookOpen, count: '23 Rules' },
    { id: 'wh_questions', name: 'Wh-Questions Builder', icon: HelpCircle, count: '25 Rules & Builder' },
    { id: 'sentence_correction', name: 'Sentence Correction', icon: CheckCircle2, count: 'Common Traps' },
    { id: 'articles', name: 'Articles Passages', icon: FileText, count: '10 Sets' },
    { id: 'punctuation', name: 'Punctuation & Caps', icon: Type, count: 'Board Solved' },
    { id: 'rearrange', name: 'Booster Rearrange', icon: Shuffle, count: '50 Booster Sentences' },
    { id: 'changing_words', name: 'Changing Words', icon: Sparkles, count: '100 NU Words' },
    { id: 'translation', name: 'Board Translations', icon: Languages, count: '10 NU Papers' }
  ];

  // Handle quiz option click
  const handleSelectQuizAnswer = (qId: string, selectedOption: string, correctAns: string) => {
    setUserQuizAnswers(prev => ({ ...prev, [qId]: selectedOption }));
    const isCorrect = selectedOption.trim().toLowerCase() === correctAns.trim().toLowerCase();
    setQuizResults(prev => ({ ...prev, [qId]: isCorrect }));

    if (isCorrect) {
      soundFX.playSuccess();
      onEarnXp(10, 'Grammar Quiz Correct');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } else {
      soundFX.playError();
    }
  };

  // Wh Drag & Drop Builder Helpers
  const currentWhEx = WH_DRAG_DROP_EXERCISES[whExerciseIndex];
  const handleAddWhToken = (word: string, index: number) => {
    setWhCurrentTokens([...whCurrentTokens, word]);
    const updated = [...whAvailableTokens];
    updated.splice(index, 1);
    setWhAvailableTokens(updated);
  };

  const handleRemoveWhToken = (word: string, index: number) => {
    setWhAvailableTokens([...whAvailableTokens, word]);
    const updated = [...whCurrentTokens];
    updated.splice(index, 1);
    setWhCurrentTokens(updated);
  };

  const handleCheckWhAnswer = () => {
    const userBuilt = whCurrentTokens.join(' ').trim().toLowerCase();
    const correctNormalized = currentWhEx.correctQuestion.trim().toLowerCase();
    if (userBuilt === correctNormalized) {
      setWhFeedback('correct');
      soundFX.playSuccess();
      onEarnXp(15, 'Wh-Question Sentence Built');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setWhFeedback('wrong');
      soundFX.playError();
    }
  };

  const handleResetWh = () => {
    setWhCurrentTokens([]);
    setWhAvailableTokens(currentWhEx.scrambledWords);
    setWhFeedback('idle');
  };

  const handleNextWh = () => {
    const nextIdx = (whExerciseIndex + 1) % WH_DRAG_DROP_EXERCISES.length;
    setWhExerciseIndex(nextIdx);
    setWhCurrentTokens([]);
    setWhAvailableTokens(WH_DRAG_DROP_EXERCISES[nextIdx].scrambledWords);
    setWhFeedback('idle');
  };

  // Rearrange helpers
  const currentRearrange = BOOSTER_REARRANGEMENTS[rearrangeIndex];
  const handleAddRearrangeToken = (tok: string, idx: number) => {
    setRearrangeTokens([...rearrangeTokens, tok]);
    const p = [...rearrangePool];
    p.splice(idx, 1);
    setRearrangePool(p);
  };

  const handleRemoveRearrangeToken = (tok: string, idx: number) => {
    setRearrangePool([...rearrangePool, tok]);
    const t = [...rearrangeTokens];
    t.splice(idx, 1);
    setRearrangeTokens(t);
  };

  const handleCheckRearrange = () => {
    const userSentence = rearrangeTokens.join(' ').trim();
    if (userSentence.toLowerCase() === currentRearrange.correctSentence.toLowerCase()) {
      setRearrangeFeedback('correct');
      soundFX.playSuccess();
      onEarnXp(15, 'Rearrange Solved');
      confetti({ particleCount: 45, spread: 60 });
    } else {
      setRearrangeFeedback('wrong');
      soundFX.playError();
    }
  };

  const handleNextRearrange = () => {
    const nxt = (rearrangeIndex + 1) % BOOSTER_REARRANGEMENTS.length;
    setRearrangeIndex(nxt);
    setRearrangeTokens([]);
    setRearrangePool([...BOOSTER_REARRANGEMENTS[nxt].tokens].sort(() => Math.random() - 0.5));
    setRearrangeFeedback('idle');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Category Pills Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1A237E]" />
              <span>Grammar Master (৪৫ নম্বর কনফার্মেশন জোন)</span>
            </h2>
            <p className="text-xs text-slate-500">
              জাতীয় বিশ্ববিদ্যালয়ের নন-ক্রেডিট ইংরেজির সমস্ত সংক্ষিপ্ত টেকনিক, শর্টকাট সূত্র ও লাইভ ড্রিল।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id as GrammarCategory);
                  setSelectedRuleIndex(0);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1A237E] text-amber-300 shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-indigo-900 text-amber-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. RIGHT FORM OF VERBS SECTION */}
      {activeCategory === 'right_form_of_verbs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rules Sidebar Selector (1 to 23) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 h-[640px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                সবগুলো ২৩টি শর্ট রুলস
              </span>
              <span className="text-xs font-bold text-indigo-700">
                {completedRules.filter(r => r.startsWith('rfv_')).length} / 23 সমাপ্ত
              </span>
            </div>

            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 scrollbar-thin">
              {RIGHT_FORM_OF_VERBS_RULES.map((rule, idx) => {
                const isSelected = selectedRuleIndex === idx;
                const isDone = completedRules.includes(rule.id);
                return (
                  <button
                    key={rule.id}
                    onClick={() => setSelectedRuleIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1A237E] text-white shadow font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isSelected ? 'bg-amber-400 text-indigo-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {rule.ruleNumber}
                      </span>
                      <span className="truncate">{rule.title}</span>
                    </div>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Rule Details & Practice Quiz */}
          <div className="lg:col-span-8 space-y-5">
            {(() => {
              const rule = RIGHT_FORM_OF_VERBS_RULES[selectedRuleIndex];
              const isRuleDone = completedRules.includes(rule.id);

              return (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
                  {/* Rule Header */}
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-indigo-100 text-indigo-900">
                          RULE {rule.ruleNumber}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">Right Form of Verbs</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">{rule.title}</h3>
                    </div>

                    <button
                      onClick={() => {
                        onCompleteRule(rule.id);
                        onEarnXp(20, `Completed Rule ${rule.ruleNumber}`);
                        soundFX.playSuccess();
                        confetti({ particleCount: 30, spread: 45 });
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isRuleDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-400 text-indigo-950 hover:bg-amber-300 shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isRuleDone ? 'পড়া সম্পন্ন হয়েছে' : 'পড়া শেষ হিসেবে মার্ক করুন'}</span>
                    </button>
                  </div>

                  {/* Super Shortcut Magic Formula Box */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 rounded-xl p-4 border border-amber-300">
                    <span className="text-[11px] font-black uppercase text-amber-900 block mb-1">
                      ⚡ সুপার-শর্টকাট ম্যাজিক সূত্র
                    </span>
                    <p className="text-sm sm:text-base font-extrabold text-amber-950 leading-relaxed">
                      {rule.shortcutFormula}
                    </p>
                  </div>

                  {/* Explanation in Bengali */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-700 block mb-1">সহজ বাংলা ব্যাখ্যা:</span>
                    <p className="text-sm text-slate-800 leading-relaxed">{rule.noteBn}</p>
                    {rule.warningBn && (
                      <div className="mt-3 flex items-start gap-2 text-xs font-semibold text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                        <span>{rule.warningBn}</span>
                      </div>
                    )}
                  </div>

                  {/* Board Examples */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      বোর্ড ও টেস্ট পরীক্ষার উদাহরণসমূহ
                    </h4>
                    <div className="space-y-2">
                      {rule.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <span className="text-slate-800 font-mono font-medium">{ex.sentence}</span>
                          <span className="font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 shrink-0">
                            উঃ {ex.answer}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Practice Quiz */}
                  {rule.practiceQuestions && rule.practiceQuestions.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h4 className="text-sm font-bold text-slate-900">
                          ইনস্ট্যান্ট কুইজ ড্রিল (সঠিক উত্তরে +১০ XP)
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {rule.practiceQuestions.map((q) => {
                          const selected = userQuizAnswers[q.id];
                          const hasAnswered = selected !== undefined;
                          const isCorrect = quizResults[q.id];

                          return (
                            <div key={q.id} className="bg-indigo-950 text-white rounded-xl p-4 space-y-3">
                              <p className="text-sm font-bold text-indigo-100">{q.question}</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {q.options?.map((opt) => {
                                  const isThisSelected = selected === opt;
                                  let btnColor = 'bg-indigo-900 text-indigo-100 hover:bg-indigo-800';
                                  if (hasAnswered) {
                                    if (opt.toLowerCase() === q.correctAnswer.toLowerCase()) {
                                      btnColor = 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-300';
                                    } else if (isThisSelected && !isCorrect) {
                                      btnColor = 'bg-rose-600 text-white font-bold';
                                    } else {
                                      btnColor = 'bg-indigo-900/40 text-indigo-300 opacity-60';
                                    }
                                  }

                                  return (
                                    <button
                                      key={opt}
                                      disabled={hasAnswered}
                                      onClick={() => handleSelectQuizAnswer(q.id, opt, q.correctAnswer)}
                                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-center ${btnColor}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {hasAnswered && (
                                <div className={`text-xs p-2.5 rounded-lg font-medium flex items-center justify-between ${
                                  isCorrect ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700' : 'bg-rose-900/60 text-rose-200 border border-rose-700'
                                }`}>
                                  <span>{isCorrect ? 'অসাধারণ! সঠিক উত্তর!' : `ভুল হয়েছে। সঠিক উত্তর: "${q.correctAnswer}"`}</span>
                                  <span className="text-[11px] text-indigo-200">{q.explanation}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 2. WH-QUESTIONS BUILDER SECTION */}
      {activeCategory === 'wh_questions' && (
        <div className="space-y-6">
          {/* Interactive Drag & Drop Builder Game */}
          <div className="bg-gradient-to-br from-[#1A237E] to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-indigo-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-700/60">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  ইন্টারেক্টিভ ড্র্যাগ অ্যান্ড ড্রপ চ্যালেঞ্জ
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Wh-Question সেন্টেন্স বিল্ডার
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-indigo-200">
                  চ্যালেঞ্জ {whExerciseIndex + 1} / {WH_DRAG_DROP_EXERCISES.length}
                </span>
                <button
                  onClick={handleNextWh}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-indigo-950 hover:bg-amber-300 transition-colors"
                >
                  পরবর্তী প্রশ্ন
                </button>
              </div>
            </div>

            {/* Target Statement to convert */}
            <div className="bg-indigo-900/70 p-4 rounded-xl border border-indigo-700/80">
              <span className="text-xs text-indigo-300 block mb-1">মূল বাক্য (আন্ডারলাইন করা অংশ বাদ দিয়ে প্রশ্ন তৈরি করো):</span>
              <p className="text-base sm:text-lg font-bold text-white">
                {currentWhEx.statement.replace(
                  currentWhEx.underlinedPart,
                  `[underline: ${currentWhEx.underlinedPart}]`
                )}
              </p>
              <div className="mt-2 text-xs text-amber-300 flex items-center gap-2 font-medium">
                <span>লক্ষ্য Wh-শব্দ: <strong>{currentWhEx.targetWh}</strong></span>
                <span>•</span>
                <span>{currentWhEx.explanationBn}</span>
              </div>
            </div>

            {/* Answer Construct Zone */}
            <div className="bg-indigo-950/80 p-4 rounded-xl border-2 border-dashed border-indigo-600 min-h-[70px] flex items-center flex-wrap gap-2">
              {whCurrentTokens.length === 0 ? (
                <span className="text-xs text-indigo-400 italic">
                  নিচের শব্দগুলোতে ক্লিক করে ক্রমান্বয়ে সাজাও...
                </span>
              ) : (
                whCurrentTokens.map((tok, idx) => (
                  <button
                    key={`${tok}-${idx}`}
                    onClick={() => handleRemoveWhToken(tok, idx)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-indigo-950 hover:bg-rose-400 hover:text-white transition-all shadow-sm"
                    title="ক্লিক করে সরান"
                  >
                    {tok} ✕
                  </button>
                ))
              )}
            </div>

            {/* Word Pool (Words available to click) */}
            <div>
              <span className="text-xs text-indigo-300 block mb-2 font-semibold">উপলব্ধ শব্দসমূহ:</span>
              <div className="flex items-center flex-wrap gap-2">
                {whAvailableTokens.map((word, wIdx) => (
                  <button
                    key={`${word}-${wIdx}`}
                    onClick={() => handleAddWhToken(word, wIdx)}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-indigo-800/90 text-white hover:bg-indigo-700 border border-indigo-600 shadow-sm transition-all"
                  >
                    + {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleResetWh}
                className="flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট করুন</span>
              </button>

              <button
                onClick={handleCheckWhAnswer}
                disabled={whCurrentTokens.length === 0}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-indigo-950 hover:brightness-105 transition-all shadow-md"
              >
                উত্তর যাচাই করুন
              </button>
            </div>

            {/* Feedback message */}
            {whFeedback === 'correct' && (
              <div className="p-3 bg-emerald-900/80 border border-emerald-500 rounded-xl text-xs text-emerald-200 font-bold flex items-center justify-between">
                <span>দারুণ! নির্ভুল Wh-প্রশ্ন তৈরি হয়েছে (+১৫ XP প্রাপ্ত)!</span>
                <button onClick={handleNextWh} className="underline text-amber-300 font-bold">পরবর্তীটি ট্রাই করুন</button>
              </div>
            )}
            {whFeedback === 'wrong' && (
              <div className="p-3 bg-rose-900/80 border border-rose-500 rounded-xl text-xs text-rose-200 font-medium flex items-center justify-between">
                <span>শব্দগুলোর ক্রম সঠিক হয়নি। আবার চেষ্টা করো!</span>
                <button onClick={handleResetWh} className="underline text-white font-bold">পুনরায় সাজাও</button>
              </div>
            )}
          </div>

          {/* Wh Rules Master Catalog */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Wh-Questions এর ২৫টি গোল্ডেন রুলস
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WH_QUESTIONS_RULES.map((r) => (
                <div key={r.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-[#1A237E] text-amber-400 text-[10px] font-bold flex items-center justify-center">
                      {r.ruleNumber}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
                  </div>
                  <p className="text-xs text-indigo-950 font-mono font-semibold bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 my-1.5">
                    {r.shortcutFormula}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.noteBn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SENTENCE CORRECTION SECTION */}
      {activeCategory === 'sentence_correction' && (
        <div className="space-y-6">
          {/* Rules explanation box */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Sentence Correction: সচরাচর যেসব জায়গায় ভুল হয় (High Yield Rules)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SENTENCE_CORRECTION_RULES.map((rule) => (
                <div key={rule.id} className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200/80 space-y-2">
                  <span className="text-[11px] font-extrabold text-indigo-900 uppercase">
                    রুল {rule.ruleNumber}: {rule.title}
                  </span>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100 text-xs font-mono font-bold text-indigo-950">
                    {rule.shortcutFormula}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{rule.noteBn}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Error Spotting Drills */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                বোর্ড স্ট্যান্ডার্ড সেন্টেন্স কারেকশন প্র্যাক্টিস
              </h3>
              <span className="text-xs text-slate-500 font-semibold">১২টি গুরুত্বপূর্ণ ড্রিল</span>
            </div>

            <div className="space-y-3">
              {TOP_CORRECTION_DRILLS.map((item, idx) => (
                <div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          {item.categoryTag}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-rose-700 font-mono">
                        ভুল: <s>{item.incorrectSentence}</s>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-800 font-mono">
                        সঠিক: {item.correctSentence}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    <strong>কারণ ও নিয়ম:</strong> {item.ruleExplanationBn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. ARTICLES SECTION */}
      {activeCategory === 'articles' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Articles: জাতীয় বিশ্ববিদ্যালয়ের সেরা ১০টি ব্ল্যাঙ্ক সেট
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              প্যাসেজটি পড়ে নিজে উত্তর চিন্তা করো, তারপর "উত্তর দেখুন" বাটনে ক্লিক করে চেক করো।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ARTICLE_PASSAGES.map((art) => {
                const isRevealed = revealedArticles[art.id];
                return (
                  <div key={art.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-900">
                        সেট #{art.number}: {art.title}
                      </span>
                      <button
                        onClick={() => setRevealedArticles(prev => ({ ...prev, [art.id]: !prev[art.id] }))}
                        className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
                      >
                        {isRevealed ? 'উত্তর লুকান' : 'উত্তর দেখুন'}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-serif leading-relaxed text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                      {art.textWithBlanks}
                    </p>

                    {isRevealed && (
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs space-y-1.5 animate-fadeIn">
                        <div className="font-bold text-emerald-950 font-mono">
                          (a) {art.answers.a} • (b) {art.answers.b} • (c) {art.answers.c} • (d) {art.answers.d} • (e) {art.answers.e}
                        </div>
                        {art.explanation && (
                          <p className="text-emerald-800 text-[11px]">{art.explanation}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. PUNCTUATION & CAPITALIZATION */}
      {activeCategory === 'punctuation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Punctuation & Capitalization (বোর্ড সমাধান)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              কোটেশন মার্ক (“ ”), ক্যাপিটাল লেটার এবং কমা-ফুলস্টপের যথাযথ ব্যবহার।
            </p>

            <div className="space-y-4">
              {PUNCTUATION_PASSAGES.map((punc) => {
                const isRevealed = revealedPunctuation[punc.id];
                return (
                  <div key={punc.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                          {punc.examTag}
                        </span>
                        <span className="text-xs font-bold text-slate-700">Passage #{punc.number}</span>
                      </div>
                      <button
                        onClick={() => setRevealedPunctuation(prev => ({ ...prev, [punc.id]: !prev[punc.id] }))}
                        className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
                      >
                        {isRevealed ? 'সমাধান লুকান' : 'সঠিক পাংচুয়েশন দেখুন'}
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm font-mono text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      <strong>Raw Text:</strong> {punc.rawText}
                    </div>

                    {isRevealed && (
                      <div className="bg-indigo-950 text-white p-3.5 rounded-lg border border-indigo-800 space-y-2 text-xs">
                        <div className="font-bold text-amber-300 font-serif leading-relaxed text-sm">
                          {punc.punctuatedText}
                        </div>
                        <div className="pt-2 border-t border-indigo-800 text-[11px] text-indigo-200 space-y-1">
                          <span className="font-bold text-white block">প্রয়োগকৃত নিয়মসমূহ:</span>
                          <ul className="list-disc list-inside space-y-0.5">
                            {punc.rulesApplied.map((r, rIdx) => (
                              <li key={rIdx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. BOOSTER REARRANGEMENT */}
      {activeCategory === 'rearrange' && (
        <div className="space-y-6">
          {/* Interactive Rearrange Game */}
          <div className="bg-gradient-to-br from-[#1A237E] to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-indigo-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-700/60">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  ইন্টারেক্টিভ টোকেন ড্রিল
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Booster Rearrangement (#{rearrangeIndex + 1} / {BOOSTER_REARRANGEMENTS.length})
                </h3>
              </div>
              <button
                onClick={handleNextRearrange}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-indigo-950 hover:bg-amber-300 transition-colors"
              >
                পরবর্তী বাক্য
              </button>
            </div>

            <div className="bg-indigo-900/70 p-3.5 rounded-xl border border-indigo-700">
              <span className="text-xs text-indigo-300 block mb-1">এলোমেলো শব্দমালা:</span>
              <p className="text-base font-bold text-amber-300 font-mono">
                {currentRearrange.scrambled}
              </p>
            </div>

            {/* User sentence builder slot */}
            <div className="bg-indigo-950/80 p-4 rounded-xl border-2 border-dashed border-indigo-600 min-h-[60px] flex items-center flex-wrap gap-2">
              {rearrangeTokens.length === 0 ? (
                <span className="text-xs text-indigo-400 italic">
                  নিচের শব্দ টোকেনগুলোতে ক্রমান্বয়ে ক্লিক করে বাক্য সাজাও...
                </span>
              ) : (
                rearrangeTokens.map((tok, idx) => (
                  <button
                    key={`${tok}-${idx}`}
                    onClick={() => handleRemoveRearrangeToken(tok, idx)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-indigo-950 hover:bg-rose-400 hover:text-white transition-all shadow-sm"
                  >
                    {tok} ✕
                  </button>
                ))
              )}
            </div>

            {/* Word tokens pool */}
            <div className="flex items-center flex-wrap gap-2">
              {rearrangePool.map((tok, idx) => (
                <button
                  key={`${tok}-${idx}`}
                  onClick={() => handleAddRearrangeToken(tok, idx)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-800 text-white hover:bg-indigo-700 border border-indigo-600 transition-all"
                >
                  + {tok}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setRearrangeTokens([]);
                  setRearrangePool([...currentRearrange.tokens].sort(() => Math.random() - 0.5));
                  setRearrangeFeedback('idle');
                }}
                className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট</span>
              </button>

              <button
                onClick={handleCheckRearrange}
                disabled={rearrangeTokens.length === 0}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-indigo-950 hover:brightness-105 transition-all shadow-md"
              >
                যাচাই করুন
              </button>
            </div>

            {rearrangeFeedback === 'correct' && (
              <div className="p-3 bg-emerald-900/80 border border-emerald-500 rounded-xl text-xs text-emerald-200 font-bold flex items-center justify-between">
                <span>সঠিক হয়েছে! (+১৫ XP প্রাপ্ত)!</span>
                <button onClick={handleNextRearrange} className="underline text-amber-300">পরবর্তীটি ট্রাই করুন</button>
              </div>
            )}
            {rearrangeFeedback === 'wrong' && (
              <div className="p-3 bg-rose-900/80 border border-rose-500 rounded-xl text-xs text-rose-200 font-medium">
                ভুল হয়েছে। আবার চেষ্টা করো অথবা সঠিক উত্তর: <strong>{currentRearrange.correctSentence}</strong>
              </div>
            )}
          </div>

          {/* Quick list of Booster Rearrangements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              টপ বুস্টার রিঅ্যারেঞ্জমেন্ট তালিকা
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BOOSTER_REARRANGEMENTS.slice(0, 16).map((item) => (
                <div key={item.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-indigo-900 mr-1.5">#{item.number}</span>
                  <span className="text-slate-800 font-medium">{item.correctSentence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. CHANGING WORDS */}
      {activeCategory === 'changing_words' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Changing Words & Sentence Making (১০০টি সেরা শব্দ)
                </h3>
                <p className="text-xs text-slate-500">
                  নির্দিষ্ট Parts of Speech এ রূপান্তর ও বাক্য রচনা।
                </p>
              </div>

              {/* POS filter buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['all', 'noun', 'verb', 'adj', 'adv'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setChangingPosFilter(pos)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                      changingPosFilter === pos ? 'bg-[#1A237E] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CHANGING_WORDS_LIST
                .filter(w => changingPosFilter === 'all' || w.targetPos === changingPosFilter)
                .map((cw) => (
                  <div key={cw.id} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">{cw.givenWord}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                        {cw.targetPos}
                      </span>
                    </div>
                    <div className="font-bold text-indigo-900">
                      রূপান্তর: <span className="underline">{cw.changedWord}</span>
                    </div>
                    <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200/80">
                      "{cw.sentence}"
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. BOARD TRANSLATIONS */}
      {activeCategory === 'translation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Board Translations (বাংলা থেকে ইংরেজি অনুবাদ)
              </h3>
              <p className="text-xs text-slate-500">
                ২০০৮ থেকে ২০২৩ সালের জাতীয় বিশ্ববিদ্যালয়ের সেরা বোর্ড অনুবাদসমূহ।
              </p>
            </div>

            <div className="space-y-4">
              {TOP_TRANSLATIONS.map((tr) => (
                <div key={tr.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#1A237E] text-amber-300">
                      {tr.nuYear}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                    <strong>বাংলা অনুচ্ছেদ:</strong> {tr.banglaText}
                  </div>

                  <div className="bg-indigo-950 text-white p-3.5 rounded-lg border border-indigo-800 text-xs sm:text-sm font-serif leading-relaxed text-amber-200">
                    <strong className="text-white block mb-1 font-sans text-xs">ইংরেজি অনুবাদ:</strong>
                    {tr.englishTranslation}
                  </div>

                  {tr.keyVocabulary && tr.keyVocabulary.length > 0 && (
                    <div className="flex items-center flex-wrap gap-1.5 pt-1 text-[11px]">
                      <span className="font-bold text-slate-600 mr-1">কী-ভোকাবুলারি:</span>
                      {tr.keyVocabulary.map((kv, kIdx) => (
                        <span key={kIdx} className="bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded font-medium">
                          {kv.bn} = <strong>{kv.en}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
