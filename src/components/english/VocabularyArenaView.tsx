import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  RotateCw, 
  Check, 
  X, 
  Sparkles, 
  Search, 
  Trophy, 
  BookOpen, 
  Layers, 
  Timer, 
  ArrowRight,
  Shuffle
} from 'lucide-react';
import { NU_SYNONYMS, NU_ANTONYMS } from '../../data/vocabularyData';
import { VocabWord } from '../../types/englishCare';
import { soundFX } from '../../utils/audioFeedback';
import confetti from 'canvas-confetti';

interface VocabularyArenaViewProps {
  onEarnXp: (amount: number, reason: string) => void;
  masteredVocab: string[];
  onMasterWord: (wordId: string) => void;
}

export const VocabularyArenaView: React.FC<VocabularyArenaViewProps> = ({
  onEarnXp,
  masteredVocab,
  onMasterWord
}) => {
  const [activeType, setActiveType] = useState<'synonym' | 'antonym'>('synonym');
  const [activeMode, setActiveMode] = useState<'flashcards' | 'match_challenge' | 'dictionary'>('flashcards');

  // Flashcard swipe state
  const wordList: VocabWord[] = useMemo(() => {
    return activeType === 'synonym' ? NU_SYNONYMS : NU_ANTONYMS;
  }, [activeType]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Speed Match Game state
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<string | null>(null);
  const [matchSelectedRight, setMatchSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState<number>(0);

  const currentWord: VocabWord | undefined = wordList[currentIndex] || wordList[0];
  const isCurrentMastered = currentWord ? masteredVocab.includes(currentWord.id) : false;

  // Flashcard Actions
  const handleNextWord = (mastered: boolean) => {
    if (mastered && currentWord) {
      if (!isCurrentMastered) {
        onMasterWord(currentWord.id);
        onEarnXp(10, `Mastered ${currentWord.word}`);
        soundFX.playSuccess();
        confetti({ particleCount: 25, spread: 45 });
      }
    } else {
      soundFX.playCardSwipe();
    }

    setIsFlipped(false);
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrevWord = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Speed match pairs generator
  const matchBatch = useMemo(() => {
    const subset = wordList.slice(0, 5);
    const lefts = subset.map(w => ({ id: w.id, text: w.word }));
    const rights = [...subset]
      .sort(() => Math.random() - 0.5)
      .map(w => ({ id: w.id, text: w.targetWord }));
    return { lefts, rights };
  }, [wordList, matchScore]);

  const handleSelectLeft = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setMatchSelectedLeft(id);
    if (matchSelectedRight) {
      checkMatch(id, matchSelectedRight);
    }
  };

  const handleSelectRight = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setMatchSelectedRight(id);
    if (matchSelectedLeft) {
      checkMatch(matchSelectedLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      soundFX.playSuccess();
      setMatchedPairs(prev => [...prev, leftId]);
      setMatchScore(prev => prev + 1);
      onEarnXp(15, 'Vocab Pair Matched');
      confetti({ particleCount: 30, spread: 50 });
      setMatchSelectedLeft(null);
      setMatchSelectedRight(null);
    } else {
      soundFX.playError();
      setTimeout(() => {
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
      }, 500);
    }
  };

  // Filtered dictionary
  const filteredWords = wordList.filter(w => 
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.targetWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.banglaMeaning.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black">
              <Flame className="w-5 h-5 fill-indigo-950" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Vocabulary Arena (Synonyms & Antonyms)
              </h2>
              <p className="text-xs text-slate-500">
                সোয়াইপ করে শিখুন ৫০টি সিনোনিম ও ১৫০টি এন্টোনিম • সাথে বোর্ড সাল
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeMode === 'flashcards' ? 'bg-[#1A237E] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ফ্ল্যাশ কার্ড সোয়াইপ</span>
          </button>
          <button
            onClick={() => setActiveMode('match_challenge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeMode === 'match_challenge' ? 'bg-[#1A237E] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>ম্যাচ ড্রিল</span>
          </button>
          <button
            onClick={() => setActiveMode('dictionary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeMode === 'dictionary' ? 'bg-[#1A237E] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>শব্দকোষ তালিকা</span>
          </button>
        </div>
      </div>

      {/* Category Toggle: Synonyms vs Antonyms */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            setActiveType('synonym');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeType === 'synonym'
              ? 'bg-amber-400 text-indigo-950 shadow-md scale-105 ring-2 ring-amber-300'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>৫০টি সমার্থক শব্দ (Synonyms)</span>
        </button>

        <button
          onClick={() => {
            setActiveType('antonym');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeType === 'antonym'
              ? 'bg-[#1A237E] text-amber-300 shadow-md scale-105 ring-2 ring-indigo-900'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>১৫০টি বিপরীত শব্দ (Antonyms)</span>
        </button>
      </div>

      {/* 1. FLASHCARD SWIPE ARENA */}
      {activeMode === 'flashcards' && currentWord && (
        <div className="max-w-xl mx-auto space-y-5">
          {/* Card Counter & Board Tag */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <span>শব্দ {currentIndex + 1} / {wordList.length}</span>
            <div className="flex items-center gap-2">
              {currentWord.boardTag && (
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold">
                  {currentWord.boardTag}
                </span>
              )}
              {isCurrentMastered && (
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  ✓ মাস্টার্ড
                </span>
              )}
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none bg-gradient-to-br from-[#1A237E] via-[#283593] to-indigo-950 text-white rounded-3xl p-8 shadow-2xl border-2 border-indigo-700/80 min-h-[320px] flex flex-col justify-between text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Top Prompt Indicator */}
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="uppercase tracking-wider font-bold">
                {activeType === 'synonym' ? 'সমার্থক শব্দ (Synonym)' : 'বিপরীত শব্দ (Antonym)'}
              </span>
              <span className="text-[11px] bg-indigo-900/80 px-2 py-0.5 rounded-full border border-indigo-700">
                {isFlipped ? 'সামনের অংশ দেখতে ট্যাপ করুন' : 'উত্তর দেখতে কার্ডে ট্যাপ করুন 👆'}
              </span>
            </div>

            {/* Main Word & Reveal Content */}
            <div className="my-auto py-6 space-y-3">
              {!isFlipped ? (
                <>
                  <h3 className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight">
                    {currentWord.word}
                  </h3>
                  <p className="text-lg font-bold text-white">
                    {currentWord.banglaMeaning}
                  </p>
                </>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-xs text-indigo-300 font-bold block uppercase tracking-widest">
                    {activeType === 'synonym' ? 'সঠিক সমার্থক শব্দ:' : 'সঠিক বিপরীত শব্দ:'}
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-black text-emerald-300 tracking-tight">
                    {currentWord.targetWord}
                  </h3>
                  {currentWord.secondaryOptions && (
                    <p className="text-xs text-indigo-200">
                      অন্যান্য বিকল্প: {currentWord.secondaryOptions.join(', ')}
                    </p>
                  )}
                  <div className="bg-indigo-950/80 p-3 rounded-xl border border-indigo-700 text-xs text-amber-100 font-serif italic max-w-md mx-auto mt-4">
                    "{currentWord.exampleSentence}"
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Indicator */}
            <div className="text-[11px] text-indigo-400">
              EnglishCare Honours 2nd Year Vocab Engine
            </div>
          </div>

          {/* Swipe Buttons (Still Learning vs Mastered) */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleNextWord(false)}
              className="py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-300 shadow-sm flex items-center justify-center gap-2 transition-all hover:border-slate-400"
            >
              <X className="w-5 h-5 text-rose-500" />
              <span>আরও রিভিশন দরকার</span>
            </button>

            <button
              onClick={() => handleNextWord(true)}
              className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all scale-100 hover:scale-105"
            >
              <Check className="w-5 h-5 text-white" />
              <span>পেরেছি! (+১০ XP)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. SPEED MATCH CHALLENGE */}
      {activeMode === 'match_challenge' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                শব্দ মেলানো ড্রিল (Speed Match)
              </h3>
              <p className="text-xs text-slate-500">
                বাম পাশের শব্দের সাথে ডান পাশের সঠিক {activeType === 'synonym' ? 'Synonym' : 'Antonym'} মিলিয়ে ট্যাপ করো।
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900">
              স্কোর: {matchScore}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-500 block uppercase">মূল শব্দমালা:</span>
              {matchBatch.lefts.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = matchSelectedLeft === item.id;
                return (
                  <button
                    key={`l-${item.id}`}
                    disabled={isMatched}
                    onClick={() => handleSelectLeft(item.id)}
                    className={`w-full p-3 rounded-xl text-xs font-bold text-left transition-all border ${
                      isMatched
                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        : isSelected
                        ? 'bg-[#1A237E] text-amber-300 border-indigo-900 shadow-md scale-105'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-indigo-50'
                    }`}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-500 block uppercase">
                লক্ষ্য {activeType === 'synonym' ? 'Synonym' : 'Antonym'}:
              </span>
              {matchBatch.rights.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = matchSelectedRight === item.id;
                return (
                  <button
                    key={`r-${item.id}`}
                    disabled={isMatched}
                    onClick={() => handleSelectRight(item.id)}
                    className={`w-full p-3 rounded-xl text-xs font-bold text-left transition-all border ${
                      isMatched
                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        : isSelected
                        ? 'bg-[#1A237E] text-amber-300 border-indigo-900 shadow-md scale-105'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-amber-50'
                    }`}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. VOCABULARY DICTIONARY LIST */}
      {activeMode === 'dictionary' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {activeType === 'synonym' ? 'Synonyms শব্দকোষ' : 'Antonyms শব্দকোষ'}
              </h3>
              <p className="text-xs text-slate-500">
                মোট {wordList.length} টি শব্দ • বাংলায় অর্থ ও উদাহরণ বাক্য
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শব্দ খুঁজুন..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredWords.map((w) => (
              <div key={w.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{w.word}</span>
                  {w.boardTag && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
                      {w.boardTag}
                    </span>
                  )}
                </div>
                <div className="text-slate-600 font-medium">বাংলা অর্থ: {w.banglaMeaning}</div>
                <div className="text-indigo-950 font-bold">
                  {activeType === 'synonym' ? 'Synonym: ' : 'Antonym: '}
                  <span className="text-emerald-700 underline">{w.targetWord}</span>
                </div>
                <p className="text-slate-500 italic text-[11px] pt-1">"{w.exampleSentence}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
