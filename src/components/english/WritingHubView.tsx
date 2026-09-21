import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Layout, 
  Bell, 
  Briefcase, 
  Mail, 
  Megaphone, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  Edit3,
  Lightbulb,
  Award
} from 'lucide-react';
import { 
  POSTER_TEMPLATES, 
  NOTICE_TEMPLATES, 
  PARAGRAPH_COLLECTION, 
  APPLICATION_CV_COLLECTION, 
  LETTER_COLLECTION, 
  ADVERTISEMENT_COLLECTION 
} from '../../data/writingHubData';
import { PosterTemplate, NoticeTemplate, ParagraphItem, ApplicationItem, LetterItem, AdvertisementItem } from '../../types/englishCare';
import { soundFX } from '../../utils/audioFeedback';

interface WritingHubViewProps {
  onEarnXp: (amount: number, reason: string) => void;
  onUpdateCoverage: (percent: number) => void;
}

type WritingSection = 'poster' | 'notice' | 'application' | 'paragraph' | 'letter' | 'advertisement';

export const WritingHubView: React.FC<WritingHubViewProps> = ({ onEarnXp }) => {
  const [activeSection, setActiveSection] = useState<WritingSection>('poster');
  
  // Poster State
  const [selectedPoster, setSelectedPoster] = useState<PosterTemplate>(POSTER_TEMPLATES[0]);
  const [customPosterTopic, setCustomPosterTopic] = useState<string>('Eve-teasing');
  const [posterBorderColor, setPosterBorderColor] = useState<'blue' | 'emerald' | 'amber' | 'rose'>('blue');
  
  // Notice State
  const [selectedNotice, setSelectedNotice] = useState<NoticeTemplate>(NOTICE_TEMPLATES[0]);
  const [customNoticeTopic, setCustomNoticeTopic] = useState<string>('Eid-ul-Fitr Vacation');
  
  // Application State
  const [selectedApp, setSelectedApp] = useState<ApplicationItem>(APPLICATION_CV_COLLECTION[0]);
  
  // Paragraph State
  const [selectedPara, setSelectedPara] = useState<ParagraphItem>(PARAGRAPH_COLLECTION[0]);
  const [showParaBangla, setShowParaBangla] = useState<boolean>(true);
  
  // Letter & Ad State
  const [selectedLetter, setSelectedLetter] = useState<LetterItem>(LETTER_COLLECTION[0]);
  const [selectedAd, setSelectedAd] = useState<AdvertisementItem>(ADVERTISEMENT_COLLECTION[0]);
  
  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.playSuccess();
    onEarnXp(10, 'Writing template copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Format Poster for copy
  const getPosterFullText = (template: PosterTemplate, topic: string) => {
    const headline = template.box3_headline.replace(/\[TOPIC\]/g, topic.toUpperCase());
    const bullets = template.box4_bullets.map((b, i) => `   ${i + 1}. ${b.replace(/\[TOPIC\]/g, topic)}`).join('\n');
    const cta = template.box5_call_to_action.replace(/\[TOPIC\]/g, topic);
    return `[POSTER WRITING - 6 BOX FORMAT]
=========================================
| ${template.box1_top_left}             ${template.box2_top_right} |
=========================================
Headline:
${headline}

Key Points:
${bullets}

Call to Action:
${cta}

${template.box6_circulated_by}
=========================================`;
  };

  // Format Notice for copy
  const getNoticeFullText = (notice: NoticeTemplate, topic: string) => {
    const headline = notice.subjectOrHeadline.replace(/\[TOPIC\]/g, topic);
    const body = notice.bodyText
      .replace(/\[TOPIC\]/g, topic)
      .replace(/\[START_DATE\]/g, '10th May 2026')
      .replace(/\[END_DATE\]/g, '20th May 2026')
      .replace(/\[REOPEN_DATE\]/g, '21st May 2026')
      .replace(/\[EVENT_DATE\]/g, '15th May 2026');

    return `${notice.collegeName}
${notice.department}
Notice No: ${notice.noticeNumber}                  Date: ${notice.date}

Subject: ${headline}

${body}

${notice.signatory.name}
${notice.signatory.designation}
${notice.signatory.institution}, ${notice.signatory.location}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-amber-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              NU Honours Compulsory English (35 Marks)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Writing Hub & Universal Templates
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
              পোস্টার ৬-বক্স ফরম্যাট, অফিসিয়াল নোটিশ বোর্ড, পূর্ণাঙ্গ জব অ্যাপ্লিকেশন ও সিভি, এবং বোর্ড স্ট্যান্ডার্ড প্যারাগ্রাফ এর নির্ভুল কাঠামো।
            </p>
          </div>
          <button
            id="print-writing-hub-btn"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Print Format
          </button>
        </div>

        {/* Navigation Tabs for Writing */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 no-scrollbar border-t border-slate-800/80 mt-6">
          {[
            { id: 'poster', label: 'Poster (৬ বক্স)', icon: Layout, marks: '৪ মার্ক' },
            { id: 'notice', label: 'Notice Board', icon: Bell, marks: '৪ মার্ক' },
            { id: 'application', label: 'Job App & CV', icon: Briefcase, marks: '৮ মার্ক' },
            { id: 'paragraph', label: 'Paragraphs', icon: FileText, marks: '৮ মার্ক' },
            { id: 'letter', label: 'Formal Letters', icon: Mail, marks: '৪ মার্ক' },
            { id: 'advertisement', label: 'Advertisement', icon: Megaphone, marks: '৪ মার্ক' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                id={`writing-tab-${tab.id}`}
                onClick={() => {
                  setActiveSection(tab.id as WritingSection);
                  soundFX.playCardSwipe();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${isActive ? 'bg-amber-600 text-white font-semibold' : 'bg-slate-700 text-slate-400'}`}>
                  {tab.marks}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Sections */}
      <AnimatePresence mode="wait">
        {/* ================= 1. POSTER DESIGNER (6-BOX FORMAT) ================= */}
        {activeSection === 'poster' && (
          <motion.div
            key="section-poster"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Control Panel */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                    <Layout className="w-5 h-5 text-amber-600" />
                    Select Category
                  </h3>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                    {POSTER_TEMPLATES.length} ফরম্যাট
                  </span>
                </div>

                <div className="space-y-2">
                  {POSTER_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      id={`select-poster-${tmpl.id}`}
                      onClick={() => {
                        setSelectedPoster(tmpl);
                        setCustomPosterTopic(tmpl.applicableTopics[0] || 'Topic');
                        soundFX.playCardSwipe();
                      }}
                      className={`w-full text-left p-3 rounded-xl transition border text-sm flex items-center justify-between ${
                        selectedPoster.id === tmpl.id
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-semibold shadow-xs'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{tmpl.title}</span>
                      <ChevronRight className={`w-4 h-4 ${selectedPoster.id === tmpl.id ? 'text-amber-600' : 'text-slate-400'}`} />
                    </button>
                  ))}
                </div>

                {/* Topic Selector / Customizer */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    Customize Subject / Topic:
                  </label>
                  <input
                    id="poster-custom-topic-input"
                    type="text"
                    value={customPosterTopic}
                    onChange={(e) => setCustomPosterTopic(e.target.value)}
                    placeholder="e.g. Eve-teasing, Dengue, Deforestation"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 font-medium text-slate-800"
                  />

                  <div className="pt-2">
                    <div className="text-xs text-slate-500 mb-1.5 font-medium">Quick Select Suggested Topics:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPoster.applicableTopics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setCustomPosterTopic(topic)}
                          className={`text-xs px-2 py-1 rounded-md transition ${
                            customPosterTopic === topic
                              ? 'bg-amber-600 text-white font-medium'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Border Theme Picker */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                    Poster Border Accent:
                  </label>
                  <div className="flex items-center gap-2">
                    {(['blue', 'emerald', 'amber', 'rose'] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => setPosterBorderColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition ${
                          color === 'blue' ? 'bg-blue-600' :
                          color === 'emerald' ? 'bg-emerald-600' :
                          color === 'amber' ? 'bg-amber-600' : 'bg-rose-600'
                        } ${posterBorderColor === color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-70'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* National University Exam Rule Card */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  NU Exam Golden Rules for Poster:
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>পোস্টার সবসময় একটি চতুর্ভুজ বাক্সের (Box) মধ্যে লিখতে হবে।</li>
                  <li>৬-বক্স ফরম্যাট মানলে ৪ এ ৪ নম্বর নিশ্চিত।</li>
                  <li>হেডলাইন সবসময় Capital Letters এ বোল্ড করে লিখবেন।</li>
                  <li>বাক্যগুলো ৩-৪ লাইনের বুলেট পয়েন্টে সহজ ইংরেজিতে লিখবেন।</li>
                </ul>
              </div>
            </div>

            {/* Right Poster Canvas Preview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm sm:text-base">Visual Live Preview ( পরীক্ষার খাতা ভিউ )</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    ১০০% নির্ভুল স্ট্রাকচার
                  </span>
                </div>
                <button
                  id="copy-poster-btn"
                  onClick={() => handleCopyText(getPosterFullText(selectedPoster, customPosterTopic), 'poster')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg shadow-xs transition"
                >
                  {copiedId === 'poster' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Full Poster</span>
                    </>
                  )}
                </button>
              </div>

              {/* Poster 6-Box Rendered Canvas */}
              <div className={`bg-white rounded-2xl shadow-md p-6 sm:p-8 border-4 ${
                posterBorderColor === 'blue' ? 'border-blue-700' :
                posterBorderColor === 'emerald' ? 'border-emerald-700' :
                posterBorderColor === 'amber' ? 'border-amber-600' : 'border-rose-700'
              } space-y-6 relative transition-colors`}>
                
                {/* Box 1 & Box 2: Top Slogans */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-slate-300 bg-slate-50/80 rounded-xl p-3 text-center">
                    <span className="text-xs text-slate-400 block mb-0.5 font-medium">Box 1 (Left Slogan)</span>
                    <span className="text-sm sm:text-base font-black text-rose-600 uppercase tracking-wider">
                      {selectedPoster.box1_top_left}
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 bg-slate-50/80 rounded-xl p-3 text-center">
                    <span className="text-xs text-slate-400 block mb-0.5 font-medium">Box 2 (Right Slogan)</span>
                    <span className="text-sm sm:text-base font-black text-blue-700 uppercase tracking-wider">
                      {selectedPoster.box2_top_right}
                    </span>
                  </div>
                </div>

                {/* Box 3: Big Headline */}
                <div className="border-2 border-slate-900 bg-slate-900 text-white rounded-xl p-4 text-center shadow-sm">
                  <span className="text-xs text-amber-300 uppercase tracking-widest block font-bold mb-1">
                    ★ Box 3: Main Slogan Headline ★
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black tracking-wide text-amber-400">
                    {selectedPoster.box3_headline.replace(/\[TOPIC\]/g, customPosterTopic.toUpperCase())}
                  </h2>
                </div>

                {/* Box 4: Core Key Points / Bullets */}
                <div className="border-2 border-slate-300 rounded-xl p-5 bg-slate-50/50 space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Box 4: Key Facts & Awareness Points
                  </div>
                  <ul className="space-y-2.5 text-sm sm:text-base text-slate-800 font-medium">
                    {selectedPoster.box4_bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{bullet.replace(/\[TOPIC\]/g, customPosterTopic)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Box 5: High Time / Call to Action */}
                <div className="border-2 border-amber-400 bg-amber-50/80 rounded-xl p-4 text-center">
                  <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block mb-1">
                    Box 5: Powerful Call to Action
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    {selectedPoster.box5_call_to_action.replace(/\[TOPIC\]/g, customPosterTopic)}
                  </p>
                </div>

                {/* Box 6: Circulated By */}
                <div className="border border-slate-200 bg-slate-100 rounded-lg p-2.5 text-center text-xs sm:text-sm font-semibold text-slate-700">
                  <span className="text-slate-400 font-normal mr-1">Box 6:</span>
                  {selectedPoster.box6_circulated_by}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= 2. NOTICE BOARD VIEW ================= */}
        {activeSection === 'notice' && (
          <motion.div
            key="section-notice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Notice Left Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  Notice Types (বোর্ড কমন)
                </h3>
                <div className="space-y-2">
                  {NOTICE_TEMPLATES.map((notice) => (
                    <button
                      key={notice.id}
                      onClick={() => {
                        setSelectedNotice(notice);
                        setCustomNoticeTopic(notice.applicableTopics[0] || 'Topic');
                        soundFX.playCardSwipe();
                      }}
                      className={`w-full text-left p-3 rounded-xl transition border text-sm flex items-center justify-between ${
                        selectedNotice.id === notice.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-semibold'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{notice.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>

                {/* Topic selector */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Select Occasion / Topic:
                  </label>
                  <input
                    type="text"
                    value={customNoticeTopic}
                    onChange={(e) => setCustomNoticeTopic(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedNotice.applicableTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setCustomNoticeTopic(topic)}
                        className={`text-xs px-2 py-1 rounded-md transition ${
                          customNoticeTopic === topic
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-indigo-950">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  নোটিশের ৪ মার্ক পাওয়ার টেকনিক:
                </div>
                <p>
                  কলেজের নাম বড় অক্ষরে উপরে মাঝখানে লিখতে হবে। বামপাশে Ref/Notice No. এবং ডানপাশে অবশ্যই তারিখ থাকতে হবে। শেষে প্রিন্সিপালের নাম ও সিল থাকবে।
                </p>
              </div>
            </div>

            {/* Notice Letterhead Paper View */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-base">College Official Letterhead Notice</span>
                <button
                  onClick={() => handleCopyText(getNoticeFullText(selectedNotice, customNoticeTopic), 'notice')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-xs hover:border-slate-300"
                >
                  {copiedId === 'notice' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'notice' ? 'Copied!' : 'Copy Notice Text'}
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-10 text-slate-800 space-y-6 font-serif">
                {/* Header */}
                <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                    {selectedNotice.collegeName}
                  </h2>
                  <p className="text-sm font-sans font-semibold text-slate-600">
                    {selectedNotice.department}
                  </p>
                  <div className="inline-block mt-2 px-4 py-1 bg-slate-900 text-white font-sans font-bold text-sm tracking-widest uppercase rounded">
                    NOTICE
                  </div>
                </div>

                {/* Ref & Date */}
                <div className="flex justify-between items-center text-xs sm:text-sm font-sans text-slate-600">
                  <span>Notice No: <strong className="text-slate-800">{selectedNotice.noticeNumber}</strong></span>
                  <span>Date: <strong className="text-slate-800">{selectedNotice.date}</strong></span>
                </div>

                {/* Subject */}
                <div className="font-sans font-bold text-slate-900 text-base border-l-4 border-indigo-600 pl-3 py-0.5">
                  Subject: {selectedNotice.subjectOrHeadline.replace(/\[TOPIC\]/g, customNoticeTopic)}
                </div>

                {/* Body Text */}
                <div className="text-sm sm:text-base leading-relaxed text-slate-700 text-justify">
                  {selectedNotice.bodyText
                    .replace(/\[TOPIC\]/g, customNoticeTopic)
                    .replace(/\[START_DATE\]/g, '10th May 2026')
                    .replace(/\[END_DATE\]/g, '20th May 2026')
                    .replace(/\[REOPEN_DATE\]/g, '21st May 2026')
                    .replace(/\[EVENT_DATE\]/g, '15th May 2026')}
                </div>

                {/* Signatory */}
                <div className="pt-8 flex justify-end font-sans">
                  <div className="text-center space-y-1">
                    <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
                    <p className="font-bold text-slate-900 text-sm">{selectedNotice.signatory.name}</p>
                    <p className="text-xs text-slate-600 font-medium">{selectedNotice.signatory.designation}</p>
                    <p className="text-xs text-slate-500">{selectedNotice.signatory.institution}</p>
                    <p className="text-xs text-slate-500">{selectedNotice.signatory.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= 3. JOB APPLICATION & CV ================= */}
        {activeSection === 'application' && (
          <motion.div
            key="section-application"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Nav */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Application Templates
                </h3>
                {APPLICATION_CV_COLLECTION.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      soundFX.playCardSwipe();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition border text-sm flex items-center justify-between ${
                      selectedApp.id === app.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{app.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <Award className="w-4 h-4 text-emerald-600" />
                  সিভি ও কভার লেটার (৮ মার্কের সিক্রেট):
                </div>
                <p>
                  জাতীয় বিশ্ববিদ্যালয়ে কভার লেটার ও কারিকুলাম ভিটা (CV) দুই পৃষ্ঠায় পাশাপাশি লিখলে পরীক্ষক সবচেয়ে বেশি নম্বর দেন। শিক্ষাগত যোগ্যতার টেবিলটি নির্ভুল হতে হবে।
                </p>
              </div>
            </div>

            {/* Right CV & Application View */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-base">{selectedApp.title}</span>
                <button
                  onClick={() => handleCopyText(`${selectedApp.coverLetter || selectedApp.bodyText}\n\n${JSON.stringify(selectedApp.cvData, null, 2)}`, 'application')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-xs hover:border-slate-300"
                >
                  {copiedId === 'application' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'application' ? 'Copied!' : 'Copy Entire Application'}
                </button>
              </div>

              {/* Cover Letter Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block">
                  Part 1: Formal Cover Letter
                </div>
                <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700 font-serif">
                  {selectedApp.coverLetter || selectedApp.bodyText}
                </div>
              </div>

              {/* CV Section if available */}
              {selectedApp.cvData && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
                  <div className="text-center border-b pb-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block mb-1">
                      Part 2: Curriculum Vitae (CV)
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedApp.cvData.name}</h2>
                    <p className="text-xs text-slate-500">{selectedApp.cvData.address} | Mobile: {selectedApp.cvData.phone}</p>
                  </div>

                  {/* Personal Bio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                    <div><strong>Father's Name:</strong> {selectedApp.cvData.fatherName}</div>
                    <div><strong>Mother's Name:</strong> {selectedApp.cvData.motherName}</div>
                    <div><strong>Date of Birth:</strong> {selectedApp.cvData.dob}</div>
                    <div><strong>Nationality:</strong> Bangladeshi (by birth)</div>
                    <div><strong>Religion:</strong> Islam</div>
                    <div><strong>Marital Status:</strong> Unmarried</div>
                  </div>

                  {/* Education Table */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Educational Qualifications:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm border-collapse border border-slate-200 text-slate-700">
                        <thead className="bg-slate-100 text-slate-900 font-bold">
                          <tr>
                            <th className="border border-slate-300 p-2 text-left">Exam</th>
                            <th className="border border-slate-300 p-2 text-left">Passing Year</th>
                            <th className="border border-slate-300 p-2 text-left">Group/Subject</th>
                            <th className="border border-slate-300 p-2 text-left">Board/University</th>
                            <th className="border border-slate-300 p-2 text-left">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedApp.cvData.education.map((edu, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                              <td className="border border-slate-300 p-2 font-medium">{edu.exam}</td>
                              <td className="border border-slate-300 p-2">{edu.year}</td>
                              <td className="border border-slate-300 p-2">{edu.subject}</td>
                              <td className="border border-slate-300 p-2">{edu.board}</td>
                              <td className="border border-slate-300 p-2 font-semibold text-emerald-700">{edu.result}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="text-sm text-slate-700">
                    <strong className="block text-slate-900 mb-1">Working Experience:</strong>
                    <p className="bg-slate-50 p-3 rounded-lg border border-slate-200">{selectedApp.cvData.experience}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================= 4. PARAGRAPH COLLECTION ================= */}
        {activeSection === 'paragraph' && (
          <motion.div
            key="section-paragraph"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left selector */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Top Board Paragraphs
                </h3>
                {PARAGRAPH_COLLECTION.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPara(p);
                      soundFX.playCardSwipe();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition border text-sm flex items-center justify-between ${
                      selectedPara.id === p.id
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{p.title}</p>
                      {p.boardExamTags && (
                        <p className="text-xs text-amber-600 font-semibold mt-0.5">{p.boardExamTags}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Paragraph Reader */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedPara.title}</h3>
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                    {selectedPara.boardExamTags || 'Important'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowParaBangla(!showParaBangla)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  >
                    {showParaBangla ? 'বাংলা অনুবাদ লুকান' : 'বাংলা অনুবাদ দেখুন'}
                  </button>
                  <button
                    onClick={() => handleCopyText(`${selectedPara.englishText}\n\n[বাংলা অর্থ]\n${selectedPara.banglaTranslation}`, 'paragraph')}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    {copiedId === 'paragraph' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
              </div>

              {/* Topic Sentence Highlight */}
              {selectedPara.topicSentence && (
                <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900">
                  <strong className="block text-amber-950 font-bold mb-0.5">Topic Sentence (মূল উদ্বোধনী বাক্য):</strong>
                  {selectedPara.topicSentence}
                </div>
              )}

              {/* English Text Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">English Content</div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-800 text-justify font-serif">
                  {selectedPara.englishText}
                </p>
              </div>

              {/* Bangla Translation */}
              {showParaBangla && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">সহজ সরল বাংলা অনুবাদ</div>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 text-justify">
                    {selectedPara.banglaTranslation}
                  </p>
                </div>
              )}

              {/* Vocabulary Glossary for this paragraph */}
              {selectedPara.vocabulary.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Essential Vocabulary & Pronunciation:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPara.vocabulary.map((v, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{v.en}</span>
                        <span className="text-slate-600">{v.bn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================= 5. LETTERS & 6. ADVERTISEMENTS ================= */}
        {(activeSection === 'letter' || activeSection === 'advertisement') && (
          <motion.div
            key="section-letter-ad"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {activeSection === 'letter' ? (
              <>
                <div className="lg:col-span-1 space-y-3">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                    <h3 className="font-bold text-slate-900 text-base mb-2">Letter Topics</h3>
                    {LETTER_COLLECTION.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setSelectedLetter(l)}
                        className={`w-full text-left p-3 rounded-xl border text-sm ${
                          selectedLetter.id === l.id ? 'border-amber-500 bg-amber-50 font-semibold' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        {l.title}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 font-serif">
                  <h3 className="font-bold text-lg font-sans text-slate-900">{selectedLetter.title}</h3>
                  <div className="text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line">
                    <p className="font-bold text-slate-900">{selectedLetter.salutation}</p>
                    <p className="mt-2">{selectedLetter.body}</p>
                    <div className="mt-6 text-right">
                      <p>Yours affectionately,</p>
                      <p className="font-bold">Sohan</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="lg:col-span-1 space-y-3">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                    <h3 className="font-bold text-slate-900 text-base mb-2">Advertisement Templates</h3>
                    {ADVERTISEMENT_COLLECTION.map((ad) => (
                      <button
                        key={ad.id}
                        onClick={() => setSelectedAd(ad)}
                        className={`w-full text-left p-3 rounded-xl border text-sm ${
                          selectedAd.id === ad.id ? 'border-amber-500 bg-amber-50 font-semibold' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        {ad.title}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl border-4 border-slate-900 p-6 sm:p-8 space-y-4">
                  <div className="text-center border-b-2 border-slate-900 pb-3">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">CLASSIFIED ADVERTISEMENT</span>
                    <h3 className="font-black text-xl text-slate-900 mt-1">{selectedAd.headline}</h3>
                  </div>
                  <ul className="space-y-2 text-sm sm:text-base text-slate-800 list-disc list-inside">
                    {selectedAd.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-slate-200 text-xs sm:text-sm font-bold text-slate-700 text-center">
                    {selectedAd.contactInfo}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
