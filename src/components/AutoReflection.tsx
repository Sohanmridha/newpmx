import React, { useState } from 'react';
import { ReflectionNote } from '../types';
import { BookOpen, NotebookPen, Sparkles, Lightbulb, Save, Trash2, History, Star, Edit2 } from 'lucide-react';

interface AutoReflectionProps {
  language: 'bn' | 'en';
  reflections: ReflectionNote[];
  subjects: Array<{ id: string; name: string }>;
  onSave: (note: Omit<ReflectionNote, 'id' | 'date'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export default function AutoReflection({ 
  language, 
  reflections, 
  subjects, 
  onSave, 
  onDelete,
  onUpdate
}: AutoReflectionProps) {
  const [text, setText] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [rating, setRating] = useState(5);
  const [mood, setMood] = useState('Focused 🎯');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Helper translations
  const t = (bnText: string, enText: string) => (language === 'bn' ? bnText : enText);

  // Suggested prompts depending on language
  const prompts = language === 'bn' ? [
    "১. আজ পড়াশোনায় কোন গুরুত্বপূর্ণ টপিক শিখলেন?",
    "২. আজকে পড়ার সময় ফোকাস কেমন ছিল ও ডিস্ট্রাকশনগুলো কী ছিল?",
    "৩. আগামীকালের জন্য কোনো নির্দিষ্ট প্রশ্ন বা লক্ষ্য কি মাথায় আছে?",
    "৪. আজকের নামাজ এবং অভ্যাসের অনুশাসন কেমন চললো?"
  ] : [
    "1. What important core topics did you learn today?",
    "2. How sharp was your mind focus, and what distracted you?",
    "3. Any outstanding equations, bugs, or questions to solve tomorrow?",
    "4. How was your overall lifestyle harmony and prayer habits?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert(t('অনুগ্রহ করে আপনার রিফ্লেকশন নোটটি আগে লিখুন!', 'Please write your reflection note text first!'));
      return;
    }

    onSave({
      text,
      subject: selectedSub || undefined,
      focusedRating: rating,
      mood
    });

    // Reset Form
    setText('');
    setSelectedSub('');
    setRating(5);
    setMood('Focused 🎯');
  };

  const moods = [
    { labelEn: 'Focused 🎯', labelBn: 'ফোকাসড 🎯' },
    { labelEn: 'Peaceful 🧘', labelBn: 'শান্ত 🧘' },
    { labelEn: 'Productive ⚡', labelBn: 'উদ্দীপিত ⚡' },
    { labelEn: 'Tired 😴', labelBn: 'ক্লান্ত 😴' },
    { labelEn: 'Scattered 🌀', labelBn: 'এলোমেলো 🌀' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Reflection Writer Block */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl">
        <h3 className="text-base font-bold text-slate-200 mb-2 font-sans flex items-center gap-2">
          <NotebookPen className="w-5 h-5 text-amber-500" />
          <span>{t('আজকের সেলফ-রিফ্লেকশন ডায়েরী', 'Today\'s Self-Reflection Notebook')}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5 font-sans leading-relaxed">
          {t(
            'নিজের প্রতিদিনের কাজের মূল্যায়ন বা সেলফ-রিফ্লেকশন হলো সবচেয়ে কার্যকর স্বভাব। নিচে স্বয়ংক্রিয় প্রম্পট দেখে ডায়েরী নোট লিখে ফেলুন।',
            'Reviewing your own actions and focus rates is the single best mechanism for self-improvement.'
          )}
        </p>

        {/* Dynamic prompts helper */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5 mb-5 select-none">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-sans flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{t('সহায়ক আত্ম-বিশ্লেষণ প্রম্পটসমূহ:', 'Thinking Prompts to guide you:')}</span>
          </span>
          <div className="space-y-1 mt-1 text-xs text-slate-300 leading-relaxed font-sans border-l border-amber-500/20 pl-2.5">
            {prompts.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Text Input area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('আপনার মনের কথা / স্টাডি রিফ্লেকশন:', 'Your Thoughts / Study Reflection:')}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder={t('এখানে বিস্তারিত লিখুন...', 'Write your details here...')}
              className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 outline-none text-xs md:text-sm focus:border-amber-500 transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Subject Selector tag */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('সম্পর্কিত বিষয় (ঐচ্ছিক):', 'Associated Subject (Optional):')}
              </label>
              <select
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 outline-none text-xs md:text-sm"
              >
                <option key="default" value="">{t('কোনো নির্দিষ্ট বিষয় নয়', 'Not linked to specific subject')}</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Mood selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('আজকের মেজাজ/মুড কেমন ছিল?', 'Current Mood/Energy State:')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                {moods.map((m, i) => {
                  const mLabel = language === 'bn' ? m.labelBn : m.labelEn;
                  const isS = mood === m.labelEn;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMood(m.labelEn)}
                      className={`py-1.5 px-2 rounded-md border text-center text-[10px] md:text-xs font-medium cursor-pointer transition-colors duration-200 ${
                        isS 
                          ? 'border-amber-500/50 bg-amber-500/10 text-amber-200' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-705'
                      }`}
                    >
                      {mLabel}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Star focus rating */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-slate-950 border border-slate-800/60 rounded-xl">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('আজকের ওভারঅল মনোযোগ রেটিং:', 'Concentration Rating for today:')}
              </label>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                {rating === 5 ? t('৫ স্টার - চরম ডেডিকেশন!', '5 Stars - Extreme dedication!') : `${rating}/5 Stars`}
              </span>
            </div>
            
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-xl transform active:scale-95 transition-transform duration-100 cursor-pointer"
                >
                  <span className={star <= rating ? 'text-yellow-400' : 'text-slate-700'}>★</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit buttons */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold py-3.5 rounded-xl transition duration-200 text-xs md:text-sm uppercase tracking-widest text-center shadow-lg shadow-amber-500/5 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 text-slate-900" />
            <span>{t('নোটবুক মেমোরিতে লিখে রাখুন', 'Write into Journal Memory')}</span>
          </button>

        </form>
      </div>

      {/* Expansion History logs list */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-sans flex items-center gap-2">
          <History className="w-5 h-5 text-amber-500" />
          <span>{t('ইতিহাস - সংরক্ষিত আত্ম-প্রতিফলন নোটসমূহ', 'History - Saved Reflection Notes')}</span>
        </h3>

        {reflections.length === 0 ? (
          <p className="text-slate-500 text-xs italic text-center py-6">
            {t('কোনো সংরক্ষিত নোট পাওয়া যায়নি। আজকের দিনটি পর্যালোচনা করতে প্রথম নোটটি লিখুন!', 'No notebook entries found. Start writing today to track your life progress!')}
          </p>
        ) : (
          <div className="space-y-3">
            {reflections.map((ref) => {
              const isEditing = editingId === ref.id;
              return (
                <div 
                  key={ref.id} 
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 relative group"
                >
                  {isEditing ? (
                    <div className="w-full space-y-3">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-lg border border-slate-750 bg-slate-900 text-slate-200 text-xs md:text-sm outline-none focus:border-amber-500"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            if (editingText.trim()) {
                              onUpdate(ref.id, editingText.trim());
                              setEditingId(null);
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg uppercase tracking-wide cursor-pointer"
                        >
                          {t('সেভ', 'Save')}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-800 hover:bg-slate-750 text-slate-400 text-xs px-3.5 py-1.5 rounded-lg uppercase tracking-wide cursor-pointer"
                        >
                          {t('বাতিল', 'Cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Action buttons inside group top-right */}
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingId(ref.id);
                            setEditingText(ref.text);
                          }}
                          className="text-[10px] bg-slate-900 border border-slate-800 hover:border-blue-500 text-blue-300 font-bold px-2.5 py-1 rounded transition duration-150 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-blue-300" />
                          <span>{t('সম্পাদনা', 'Edit')}</span>
                        </button>
                        <button
                          onClick={() => onDelete(ref.id)}
                          className="text-[10px] bg-red-950/40 border border-red-500/20 hover:bg-red-900 text-red-300 font-bold px-2.5 py-1 rounded transition duration-150 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 text-red-300" />
                          <span>{t('মুছুন', 'Delete')}</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[10px] pr-32">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-semibold">
                          {ref.date}
                        </span>
                        
                        {ref.subject && (
                          <span className="bg-blue-900/20 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded font-medium">
                            {ref.subject}
                          </span>
                        )}

                        <span className="bg-amber-950/30 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded font-medium">
                          {moods.find(m => m.labelEn === ref.mood)?.labelBn || ref.mood}
                        </span>

                        <span className="text-yellow-400 font-bold">
                          {'★'.repeat(ref.focusedRating)}
                        </span>
                      </div>

                      <p className="text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans pt-1">
                        {ref.text}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
