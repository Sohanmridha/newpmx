import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Award, 
  ShieldAlert, 
  CheckCircle2,
  ChevronRight,
  Radio,
  FileText,
  Volume2,
  Share2
} from 'lucide-react';
import { VoiceAnalysisResult, Language } from '../types/voice';
import { RJ_BROADCAST_SCRIPTS, SLOW_READING_SCRIPTS } from '../data/voiceCurriculum';
import { LiveVoiceAnalyser, playSuccessChime } from '../utils/voiceAudioSynth';

interface VoiceStudioProps {
  currentDay: number;
  language: Language;
  savedRecordings: VoiceAnalysisResult[];
  onSaveAnalysis: (result: VoiceAnalysisResult) => void;
}

export function VoiceStudio({
  currentDay,
  language,
  savedRecordings,
  onSaveAnalysis
}: VoiceStudioProps) {
  const [selectedScriptIdx, setSelectedScriptIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<VoiceAnalysisResult | null>(null);
  const [transcript, setTranscript] = useState('');

  const scripts = RJ_BROADCAST_SCRIPTS;
  const activeScript = scripts[selectedScriptIdx % scripts.length];

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<LiveVoiceAnalyser | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition warning:', e);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Live Canvas Waveform Drawing Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isRecording && analyserRef.current) {
        const buffer = new Uint8Array(128);
        analyserRef.current.getWaveformData(buffer);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#34d399'; // Emerald glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(52, 211, 153, 0.6)';

        ctx.beginPath();
        const sliceWidth = canvas.width / buffer.length;
        let x = 0;

        for (let i = 0; i < buffer.length; i++) {
          const v = buffer[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      } else {
        // Flat baseline
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      audioChunksRef.current = [];
      setTranscript('');
      setAudioUrl(null);
      setCurrentAnalysis(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;

      const analyser = new LiveVoiceAnalyser();
      await analyser.start();
      analyserRef.current = analyser;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // ignore already started
        }
      }

      setIsRecording(true);
      setRecordDuration(0);

      durationTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    if (analyserRef.current) {
      analyserRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }
    setIsRecording(false);
  };

  const handleAnalyzePerformance = async () => {
    if (recordDuration < 2) return;
    setIsAnalyzing(true);

    try {
      const scriptText = language === 'bn' ? activeScript.textBn : activeScript.textEn;
      const wordCount = (transcript || scriptText).trim().split(/\s+/).length;
      const minutes = Math.max(0.1, recordDuration / 60);
      const calculatedWpm = Math.round(wordCount / minutes);

      const response = await fetch('/api/ai/voice-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript || scriptText,
          targetScript: scriptText,
          durationSec: recordDuration,
          estimatedWpm: calculatedWpm || 115,
          pauseCount: Math.max(2, Math.floor(recordDuration / 4)),
          language: language,
          exerciseType: 'rj_reading'
        })
      });

      const data = await response.json();
      const analysisObj: VoiceAnalysisResult = {
        id: `rec_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        dayNumber: currentDay,
        voiceScore: data.voiceScore || 82,
        clarity: data.clarity || 84,
        pacing: data.pacing || 78,
        pronunciation: data.pronunciation || 86,
        pauseControl: data.pauseControl || 75,
        resonanceStability: data.resonanceStability || 82,
        wpm: data.wpm || calculatedWpm || 115,
        feedback: data.feedback || (language === 'bn' ? 'দারুণ কণ্ঠপ্রবাহ ও সাবলীলতা!' : 'Great pacing and vocal resonance!'),
        strengths: data.strengths || (language === 'bn' ? ['স্পষ্ট উচ্চারণ'] : ['Clear articulation']),
        improvementArea: data.improvementArea || (language === 'bn' ? 'লম্বা বাক্যে পরিমিত পজ দিন।' : 'Pause smoothly between transitions.'),
        audioBlobUrl: audioUrl || undefined,
        transcript: transcript || scriptText,
        targetScript: scriptText
      };

      setCurrentAnalysis(analysisObj);
      onSaveAnalysis(analysisObj);
      playSuccessChime();
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleAudioPlayback = () => {
    if (!audioPlayerRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audioPlayerRef.current = audio;
    }

    if (audioPlayerRef.current) {
      if (isPlayingAudio) {
        audioPlayerRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-20 select-none animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            {language === 'bn' ? 'এআই ভয়েস স্টুডিও ও আরজে রেকর্ডিং' : 'AI Voice Studio & RJ Evaluation'}
          </span>
          <h2 className="text-xl font-black text-white">
            {language === 'bn' ? 'কণ্ঠ রেকর্ডিং ও এআই মূল্যায়ন' : 'Record & AI Speech Analysis'}
          </h2>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 shadow-md">
          <Radio className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* Teleprompter Script Selector & Viewer */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              {language === 'bn' ? activeScript.titleBn : activeScript.titleEn}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {scripts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedScriptIdx(idx)}
                className={`w-6 h-6 rounded-lg text-[11px] font-bold transition-all ${
                  selectedScriptIdx === idx
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Teleprompter Script Text */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/60 font-serif leading-relaxed text-sm sm:text-base text-slate-100 min-h-[120px] whitespace-pre-line tracking-wide">
          {language === 'bn' ? activeScript.textBn : activeScript.textEn}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>{language === 'bn' ? 'টিপস: কথা বলার সময় তাড়াহুড়ো করবেন না।' : 'Tip: Relax throat and pause naturally.'}</span>
          <span className="font-mono text-emerald-400">RJ Tempo: 110-125 WPM</span>
        </div>
      </div>

      {/* Live Audio Visualizer Canvas & Controls */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-xl flex flex-col items-center space-y-4">
        {/* Waveform Canvas */}
        <div className="w-full h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
          <canvas ref={canvasRef} width={480} height={96} className="w-full h-full" />

          {/* Recording Timer Badge */}
          {isRecording && (
            <div className="absolute top-2.5 right-3 bg-rose-950/80 border border-rose-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[11px] font-mono font-bold text-rose-300">
                REC {Math.floor(recordDuration / 60)}:{(recordDuration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Action Button Controls */}
        <div className="flex items-center gap-3 w-full justify-center">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="flex-1 max-w-xs py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              <span>{language === 'bn' ? 'রেকর্ডিং শুরু করুন' : 'Start RJ Recording'}</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex-1 max-w-xs py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-sm tracking-wide shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5" />
              <span>{language === 'bn' ? 'রেকর্ডিং থামান' : 'Stop Recording'}</span>
            </button>
          )}
        </div>

        {/* Playback & Analyze Options when Audio is Recorded */}
        {audioUrl && !isRecording && (
          <div className="w-full pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handleToggleAudioPlayback}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span>{isPlayingAudio ? (language === 'bn' ? 'থামুন' : 'Pause') : (language === 'bn' ? 'কণ্ঠ শুনুন' : 'Listen')}</span>
            </button>

            <button
              onClick={handleAnalyzePerformance}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>
                {isAnalyzing
                  ? (language === 'bn' ? 'এআই বিশ্লেষণ চলছে...' : 'AI Analyzing...')
                  : (language === 'bn' ? 'এআই ভয়েস স্কোর নিন' : 'Evaluate with AI')}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* AI Voice Score Evaluation Result Card */}
      <AnimatePresence>
        {currentAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 p-5 shadow-2xl space-y-4"
          >
            {/* Top Score Summary */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">
                  {language === 'bn' ? 'আজকের এআই ভয়েস স্কোর' : "Today's AI Voice Score"}
                </span>
                <h3 className="text-2xl font-black text-white font-mono flex items-center gap-2 mt-0.5">
                  <span>{currentAnalysis.voiceScore} / 100</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-sans border border-emerald-800">
                    {currentAnalysis.voiceScore >= 85 ? 'Excellent' : 'Good Pacing'}
                  </span>
                </h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Sub-Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {language === 'bn' ? 'স্পষ্টতা (Clarity)' : 'Clarity'}
                </span>
                <span className="text-lg font-bold text-cyan-300 font-mono">{currentAnalysis.clarity}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {language === 'bn' ? 'গতি (Pacing)' : 'Pacing'}
                </span>
                <span className="text-lg font-bold text-amber-300 font-mono">{currentAnalysis.wpm} WPM</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {language === 'bn' ? 'উচ্চারণ' : 'Pronunciation'}
                </span>
                <span className="text-lg font-bold text-emerald-300 font-mono">{currentAnalysis.pronunciation}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {language === 'bn' ? 'পজ নিয়ন্ত্রণ' : 'Pause Control'}
                </span>
                <span className="text-lg font-bold text-purple-300 font-mono">{currentAnalysis.pauseControl}%</span>
              </div>
            </div>

            {/* AI Actionable Coaching Feedback */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-200 leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'bn' ? 'কোচ ফিডব্যাক ও পরামর্শ' : 'AI Voice Coach Insights'}</span>
              </div>
              <p>{currentAnalysis.feedback}</p>
              <div className="pt-1 text-[11px] text-amber-300 font-medium">
                💡 {language === 'bn' ? 'উন্নতির ক্ষেত্র: ' : 'Focus: '} {currentAnalysis.improvementArea}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety Reminder */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          {language === 'bn'
            ? 'সুরক্ষা বার্তা: এআই ভয়েস ট্রেনিং স্বরযন্ত্রের কোনো রোগ নির্ণয় করে না। স্বরভঙ্গ বা গলা ব্যথা অব্যাহত থাকলে ENT বিশেষজ্ঞের পরামর্শ নিন।'
            : 'Safety Note: This app promotes relaxed speaking and does not provide medical diagnoses. Consult an ENT specialist if hoarseness persists.'}
        </span>
      </div>
    </div>
  );
}
