import { jsPDF } from 'jspdf';
import { AppState } from '../types';

// Helper function to draw a rounded rectangle on Canvas
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill = false,
  stroke = true
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// Helper to draw wrapped text on Canvas
function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

export function exportStateToPdf(state: AppState) {
  const exportLabel = new Date().toISOString().split('T')[0];
  const todayStr = exportLabel;

  // --- STATS CALCULATION ---
  const totalStudySecs = Object.values(state.history).reduce((total, log) => {
    if (!log.study) return total;
    return total + Object.values(log.study).reduce((s, val) => s + val, 0);
  }, 0);
  const totalStudyHrs = (totalStudySecs / 3600).toFixed(1);

  const now = Date.now();
  const past7Days = now - (7 * 24 * 60 * 60 * 1000);
  const past30Days = now - (30 * 24 * 60 * 60 * 1000);

  let weeklyStudyMinutes = 0;
  let monthlyStudyMinutes = 0;

  const totalScheduledWeeklyTargetMins = state.subjects.reduce((sum, s) => sum + s.target, 0) * 7;
  const totalScheduledMonthlyTargetMins = state.subjects.reduce((sum, s) => sum + s.target, 0) * 30;

  Object.entries(state.history).forEach(([dateStr, log]) => {
    const logTime = new Date(dateStr).getTime();
    if (!log.study) return;
    const dayMins = Object.values(log.study).reduce((s, val) => s + (val / 60), 0);
    
    if (logTime >= past7Days) {
      weeklyStudyMinutes += dayMins;
    }
    if (logTime >= past30Days) {
      monthlyStudyMinutes += dayMins;
    }
  });

  const weeklyStudyHrs = (weeklyStudyMinutes / 60).toFixed(1);
  const monthlyStudyHrs = (monthlyStudyMinutes / 60).toFixed(1);

  const weeklyCompletionRate = totalScheduledWeeklyTargetMins > 0 
    ? Math.min(100, Math.round((weeklyStudyMinutes / totalScheduledWeeklyTargetMins) * 100)) 
    : 0;

  const monthlyCompletionRate = totalScheduledMonthlyTargetMins > 0 
    ? Math.min(100, Math.round((monthlyStudyMinutes / totalScheduledMonthlyTargetMins) * 100)) 
    : 0;

  // Waqt consistency
  let prayerWaqtsLoggedWeekly = 0;
  let prayerCompletionsWeekly = 0;
  Object.entries(state.history).forEach(([dateStr, log]) => {
    const logTime = new Date(dateStr).getTime();
    if (logTime >= past7Days && log.prayer) {
      Object.values(log.prayer).forEach((status) => {
        prayerWaqtsLoggedWeekly++;
        if (['জামাত', 'ঘরে', 'jamaat', 'home'].includes(status)) {
          prayerCompletionsWeekly++;
        }
      });
    }
  });
  const prayerSuccessRate = prayerWaqtsLoggedWeekly > 0 
    ? Math.round((prayerCompletionsWeekly / prayerWaqtsLoggedWeekly) * 100) 
    : 0;

  // Good habits consistency
  let totalHabitOpportunities = 0;
  let totalHabitCompleted = 0;
  Object.entries(state.history).forEach(([dateStr, log]) => {
    const logTime = new Date(dateStr).getTime();
    if (logTime >= past7Days && log.habits) {
      state.habits.forEach((h) => {
        totalHabitOpportunities++;
        if (log.habits[h.id] || log.habits[h.name]) {
          totalHabitCompleted++;
        }
      });
    }
  });
  const habitsSuccessRate = totalHabitOpportunities > 0 
    ? Math.round((totalHabitCompleted / totalHabitOpportunities) * 100) 
    : 0;

  // --- RENDERING PAGE 1 CANVAS (High resolution 1200 x 1697) ---
  const canvas1 = document.createElement('canvas');
  canvas1.width = 1200;
  canvas1.height = 1697;
  const ctx1 = canvas1.getContext('2d')!;

  // Background and basic frame
  ctx1.fillStyle = '#ffffff';
  ctx1.fillRect(0, 0, 1200, 1697);
  ctx1.strokeStyle = '#e2e8f0';
  ctx1.lineWidth = 12;
  ctx1.strokeRect(20, 20, 1160, 1657);

  // Soft secondary frame accents
  ctx1.strokeStyle = '#f1f5f9';
  ctx1.lineWidth = 2;
  ctx1.strokeRect(30, 30, 1140, 1637);

  // --- HEADER BLOCK ---
  // Draw premium deep navy banner at top
  ctx1.fillStyle = '#0f172a';
  drawRoundedRect(ctx1, 50, 50, 1100, 150, 16, true, false);

  ctx1.fillStyle = '#f59e0b'; // Amber Gold Logo Icon Accents
  ctx1.beginPath();
  ctx1.arc(100, 125, 30, 0, Math.PI * 2);
  ctx1.fill();

  ctx1.fillStyle = '#0f172a';
  ctx1.font = 'bold 22px system-ui, Arial, sans-serif';
  ctx1.fillText('M', 90, 133);

  ctx1.fillStyle = '#ffffff';
  ctx1.font = 'bold 36px system-ui, Arial, sans-serif';
  ctx1.fillText('মৃধাক্স (MridhaX) সেলফ-মাস্টারি সেলফ-গ্রোথ ডায়াগনস্টিক রিপোর্ট', 160, 115);

  ctx1.fillStyle = '#94a3b8';
  ctx1.font = '18px system-ui, Arial, sans-serif';
  ctx1.fillText(`তারিখ: ${new Date().toLocaleDateString('bn-BD')} (${new Date().toLocaleDateString('en-US')})   |   বন্ধু সাথী: MridhaX AI Companion`, 160, 155);

  // --- SCORECARD ROW ---
  ctx1.fillStyle = '#334155';
  ctx1.font = 'bold 24px system-ui, Arial, sans-serif';
  ctx1.fillText('● মেন্টরশিপ লিডারবোর্ড ও ডেক্স স্কোরকার্ড', 50, 245);

  // Card 1: Level & XP
  ctx1.fillStyle = '#fafafa';
  ctx1.strokeStyle = '#cbd5e1';
  ctx1.lineWidth = 1.5;
  drawRoundedRect(ctx1, 50, 270, 340, 170, 14, true, true);
  ctx1.fillStyle = '#475569';
  ctx1.font = 'bold 16px system-ui, Arial, sans-serif';
  ctx1.fillText('ফোকাস ডোমেইন লেভেল', 75, 310);
  ctx1.fillStyle = '#f59e0b';
  ctx1.font = 'bold 42px system-ui, Arial, sans-serif';
  ctx1.fillText(`Level ${state.focusLevel || 1}`, 75, 370);
  ctx1.fillStyle = '#64748b';
  ctx1.font = '15px system-ui, Arial, sans-serif';
  ctx1.fillText(`সর্বমোট অর্জিত XP: ${state.focusPoints || 0}`, 75, 410);

  // Card 2: Weekly Study Hour
  ctx1.fillStyle = '#fafafa';
  drawRoundedRect(ctx1, 430, 270, 340, 170, 14, true, true);
  ctx1.fillStyle = '#475569';
  ctx1.font = 'bold 16px system-ui, Arial, sans-serif';
  ctx1.fillText('সাপ্তাহিক পড়াশোনার পরিধি', 455, 310);
  ctx1.fillStyle = '#10b981';
  ctx1.font = 'bold 42px system-ui, Arial, sans-serif';
  ctx1.fillText(`${weeklyStudyHrs} ঘণ্টা`, 455, 370);
  ctx1.fillStyle = '#64748b';
  ctx1.font = '15px system-ui, Arial, sans-serif';
  ctx1.fillText(`টার্গেটের ${weeklyCompletionRate}% সম্পন্ন হয়েছে`, 455, 410);

  // Card 3: Lifestyle Consistency
  ctx1.fillStyle = '#fafafa';
  drawRoundedRect(ctx1, 810, 270, 340, 170, 14, true, true);
  ctx1.fillStyle = '#475569';
  ctx1.font = 'bold 16px system-ui, Arial, sans-serif';
  ctx1.fillText('ধর্মীয় মূল্যবোধ ও সুঅভ্যাস', 835, 310);
  ctx1.fillStyle = '#4f46e5';
  ctx1.font = 'bold 42px system-ui, Arial, sans-serif';
  ctx1.fillText(`সাফল্য ${habitsSuccessRate}%`, 835, 370);
  ctx1.fillStyle = '#64748b';
  ctx1.font = '15px system-ui, Arial, sans-serif';
  ctx1.fillText(`৫ ওয়াক্ত নামাজ আদায় হার: ${prayerSuccessRate}%`, 835, 410);

  // --- SECTION 1: SUBJECT WISE DETAILED PROGRESS ---
  ctx1.fillStyle = '#0f172a';
  ctx1.font = 'bold 24px system-ui, Arial, sans-serif';
  ctx1.fillText('১. বিষয়ভিত্তিক পড়াশোনা এবং লক্ষ্যমাত্রা অর্জনের হার', 50, 495);

  let progressY = 535;
  if (state.subjects.length === 0) {
    ctx1.fillStyle = '#64748b';
    ctx1.font = 'italic 18px system-ui, Arial, sans-serif';
    ctx1.fillText('এখনো কোনো পাঠ্য বিষয় সেট করা হয়নি। অনুগ্রহ করে অ্যাপের স্টাডি ট্যাবে সাবজেক্ট যোগ করুন।', 75, progressY + 30);
  } else {
    state.subjects.slice(0, 5).forEach((sub) => {
      // Calc metrics
      let subSecs = 0;
      Object.entries(state.history).forEach(([_, log]) => {
        if (log.study && log.study[sub.name]) {
          subSecs += log.study[sub.name];
        }
      });
      const subMins = Math.round(subSecs / 60);
      const weeklyGoalMins = sub.target * 7;
      const subPct = weeklyGoalMins > 0 ? Math.min(100, Math.round((subMins / weeklyGoalMins) * 100)) : 0;

      // Draw Sub card background
      ctx1.fillStyle = '#f8fafc';
      ctx1.strokeStyle = '#f1f5f9';
      drawRoundedRect(ctx1, 50, progressY, 1100, 95, 10, true, true);

      // Subject label & info
      ctx1.fillStyle = '#1e293b';
      ctx1.font = 'bold 18px system-ui, Arial, sans-serif';
      ctx1.fillText(`বিষয়: ${sub.name}`, 80, progressY + 40);

      ctx1.fillStyle = '#64748b';
      ctx1.font = '15px system-ui, Arial, sans-serif';
      ctx1.fillText(`সাপ্তাহিক গোল: ${weeklyGoalMins} মিনিট   |   অর্জিত: ${subMins} মিনিট`, 80, progressY + 70);

      // Progress Tracker Bar Frame
      ctx1.fillStyle = '#e2e8f0';
      drawRoundedRect(ctx1, 650, progressY + 38, 380, 22, 6, true, false);

      // Filled portion
      if (subPct > 0) {
        const fillW = Math.round((subPct / 100) * 380);
        // Colored logic based on achievement percentage
        ctx1.fillStyle = subPct >= 75 ? '#10b981' : (subPct >= 40 ? '#f59e0b' : '#ef4444');
        drawRoundedRect(ctx1, 650, progressY + 38, fillW, 22, 6, true, false);
      }

      // Percentage label
      ctx1.fillStyle = '#1e293b';
      ctx1.font = 'bold 18px system-ui, Arial, sans-serif';
      ctx1.fillText(`${subPct}%`, 1055, progressY + 55);

      progressY += 115;
    });
  }

  // --- SECTION 2: FIVE TIMES PRAYERS TRACKING ---
  ctx1.fillStyle = '#0f172a';
  ctx1.font = 'bold 24px system-ui, Arial, sans-serif';
  ctx1.fillText('২. পাঁচ ওয়াক্ত নামাজ ও তরিক্বত আদায়ের রেকর্ড', 50, 1130);

  // Background box
  ctx1.fillStyle = '#fafaf9';
  ctx1.strokeStyle = '#e7e5e4';
  ctx1.lineWidth = 1;
  drawRoundedRect(ctx1, 50, 1160, 1100, 440, 16, true, true);

  // List past 5 days details or default grids
  const waqtsList = [
    { key: 'Fajr', label: 'ফজর (Fajr)' },
    { key: 'Dhuhr', label: 'যোহর (Dhuhr)' },
    { key: 'Asr', label: 'আসর (Asr)' },
    { key: 'Maghrib', label: 'মাগরিব (Maghrib)' },
    { key: 'Isha', label: 'এশা (Isha)' }
  ];

  let tableX = 90;
  // Columns header
  ctx1.fillStyle = '#78716c';
  ctx1.font = 'bold 16px system-ui, Arial, sans-serif';
  ctx1.fillText('তারিখ (Date)', tableX, 1205);

  waqtsList.forEach((w, idx) => {
    ctx1.fillText(w.label, tableX + 220 + (idx * 160), 1205);
  });

  // Table horizontal division line
  ctx1.strokeStyle = '#d6d3d1';
  ctx1.lineWidth = 1.5;
  ctx1.beginPath();
  ctx1.moveTo(80, 1225);
  ctx1.lineTo(1120, 1225);
  ctx1.stroke();

  // Load last 5 days
  const loggedDays = Object.keys(state.history)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 5);

  let tableY = 1265;
  if (loggedDays.length === 0) {
    ctx1.fillStyle = '#78716c';
    ctx1.font = 'italic 16px system-ui, Arial, sans-serif';
    ctx1.fillText('কোনো সালাত লগ রেকর্ড খুঁজে পাওয়া যায়নি। আপনার দৈনিক নামাজ এন্ট্রি শুরু করুন!', 200, tableY + 60);
  } else {
    loggedDays.forEach((dStr) => {
      ctx1.fillStyle = '#1c1917';
      ctx1.font = 'bold 15px system-ui, Arial, sans-serif';
      ctx1.fillText(dStr, tableX, tableY);

      const dayLog = state.history[dStr];
      const prayerLog = dayLog?.prayer || {};

      waqtsList.forEach((w, idx) => {
        const val = prayerLog[w.key] || 'পড়িনি';
        // Translate state to beautiful symbols or clear Bangla indicators
        let displayVal = 'পড়িনি ❌';
        let valColor = '#ef4444'; // Red

        if (['জামাত', 'jamaat'].includes(val.toLowerCase())) {
          displayVal = 'জামাত ☀️';
          valColor = '#10b981';
        } else if (['ঘরে', 'home'].includes(val.toLowerCase())) {
          displayVal = 'একাকী 🏠';
          valColor = '#06b6d4';
        } else if (['কাজা', 'qaza'].includes(val.toLowerCase())) {
          displayVal = 'কাজা 🌙';
          valColor = '#f59e0b';
        }

        ctx1.fillStyle = valColor;
        ctx1.font = '15px system-ui, Arial, sans-serif';
        ctx1.fillText(displayVal, tableX + 220 + (idx * 160), tableY);
      });

      // Thin inner divider
      ctx1.strokeStyle = '#e7e5e4';
      ctx1.lineWidth = 0.5;
      ctx1.beginPath();
      ctx1.moveTo(80, tableY + 15);
      ctx1.lineTo(1120, tableY + 15);
      ctx1.stroke();

      tableY += 45;
    });
  }


  // --- RENDERING PAGE 2 CANVAS (High resolution 1200 x 1697) ---
  const canvas2 = document.createElement('canvas');
  canvas2.width = 1200;
  canvas2.height = 1697;
  const ctx2 = canvas2.getContext('2d')!;

  // Background and border
  ctx2.fillStyle = '#ffffff';
  ctx2.fillRect(0, 0, 1200, 1697);
  ctx2.strokeStyle = '#cbd5e1';
  ctx2.lineWidth = 12;
  ctx2.strokeRect(20, 20, 1160, 1657);

  // Header banner small
  ctx2.fillStyle = '#0f172a';
  drawRoundedRect(ctx2, 50, 50, 1100, 100, 12, true, false);
  ctx2.fillStyle = '#ffffff';
  ctx2.font = 'bold 24px system-ui, Arial, sans-serif';
  ctx2.fillText('মৃধাক্স (MridhaX) লাইফস্টাইল, ডিসিপ্লিন ও মেন্টর গাইডলাইন', 95, 110);

  // --- SECTION 3: HABITS CHECKLIST & COMPLIANCE ---
  ctx2.fillStyle = '#1e293b';
  ctx2.font = 'bold 22px system-ui, Arial, sans-serif';
  ctx2.fillText('৩. সুঅভ্যাস (Good Habits) ও বদ অভ্যাস বর্জন (Addiction Free) ট্র্যাকিং', 50, 215);

  // Active Bad Habits Quit Clocks Grid
  let bhY = 250;
  if (state.badHabits && state.badHabits.length > 0) {
    state.badHabits.forEach((bh, idx) => {
      const qDate = new Date(bh.quitAt);
      const diffDays = Math.max(0, Math.floor((Date.now() - qDate.getTime()) / (1000 * 60 * 60 * 24)));

      // Draw block box
      ctx2.fillStyle = '#fffbeb';
      ctx2.strokeStyle = '#fde68a';
      ctx2.lineWidth = 1.5;
      drawRoundedRect(ctx2, 50 + (idx % 2 === 1 ? 560 : 0), bhY, 520, 130, 12, true, true);

      ctx2.fillStyle = '#b45309';
      ctx2.font = 'bold 16px system-ui, Arial, sans-serif';
      ctx2.fillText(`🚭 বর্জন লক্ষ্য: ${bh.name}`, 75 + (idx % 2 === 1 ? 560 : 0), bhY + 40);

      ctx2.fillStyle = '#d97706';
      ctx2.font = 'bold 26px system-ui, Arial, sans-serif';
      ctx2.fillText(`${diffDays} দিন মুক্ত`, 75 + (idx % 2 === 1 ? 560 : 0), bhY + 80);

      ctx2.fillStyle = '#78350f';
      ctx2.font = 'italic 13px system-ui, Arial, sans-serif';
      const stageMsg = diffDays <= 3 ? 'কঠিন পর্যায়! লড়তে থাকুন!' : (diffDays <= 7 ? 'দারুণ শুরু! ফোকাস ধরে রাখুন!' : 'অভিনন্দন! মাইলফলক বজায় রাখুন!');
      ctx2.fillText(stageMsg, 75 + (idx % 2 === 1 ? 560 : 0), bhY + 110);

      if (idx % 2 === 1) {
        bhY += 150;
      } else if (idx === state.badHabits.length - 1) {
        bhY += 150;
      }
    });
  } else {
    ctx2.fillStyle = '#f8fafc';
    ctx2.strokeStyle = '#cbd5e1';
    drawRoundedRect(ctx2, 50, bhY, 1100, 80, 10, true, true);
    ctx2.fillStyle = '#64748b';
    ctx2.font = 'italic 16px system-ui, Arial, sans-serif';
    ctx2.fillText('আপনি কোনো কুঅভ্যাস বর্জনের লক্ষ্যমালা সেট করেননি। মাদক/সোশ্যাল মিডিয়া বর্জন ট্র্যাকার যুক্ত করতে পারেন।', 75, bhY + 45);
    bhY += 105;
  }

  // --- SECTION 4: DIGITAL DETOX & PHONE INTRUSION ---
  ctx2.fillStyle = '#1e293b';
  ctx2.font = 'bold 22px system-ui, Arial, sans-serif';
  ctx2.fillText('৪. ডিজিটাল আসক্তি ও মোবাইল স্ক্রিন টাইম নিয়ন্ত্রণ', 50, bhY + 45);

  const phoneLimit = state.phoneLimitMinutes || 150;
  const phoneHist = state.phoneUsageHistory || {};
  const phoneValSum = Object.values(phoneHist).slice(0, 7).reduce((acc, current) => acc + current, 0);
  const avgScreenTime = Object.keys(phoneHist).length > 0 ? Math.round(phoneValSum / Object.keys(phoneHist).length) : 0;

  ctx2.fillStyle = '#fafafa';
  ctx2.strokeStyle = '#cbd5e1';
  drawRoundedRect(ctx2, 50, bhY + 70, 1100, 160, 16, true, true);

  ctx2.fillStyle = '#1e293b';
  ctx2.font = 'bold 18px system-ui, Arial, sans-serif';
  ctx2.fillText('মোবাইল স্ক্রীন আসক্তি নিয়ন্ত্রণ মেট্রিক্স (Digital Detox Panel)', 85, bhY + 115);

  ctx2.fillStyle = '#555';
  ctx2.font = '15px system-ui, Arial, sans-serif';
  ctx2.fillText(`আপনার দৈনিক বরাদ্দকৃত সর্বোচ্চ লিমিট: ${phoneLimit} মিনিট   |   সালাতকালীন সময় ও ফোন লক রাখার রেটিং: ৫/৫ 🏆`, 85, bhY + 145);

  // Indicator
  const screenIsGood = avgScreenTime <= phoneLimit;
  ctx2.fillStyle = screenIsGood ? '#10b981' : '#ef4444';
  ctx2.font = 'bold 22px system-ui, Arial, sans-serif';
  ctx2.fillText(`গড় ব্যবহার: ${avgScreenTime} মিনিট / দিন (${screenIsGood ? 'নিরাপদ সীমায় ✅' : 'ঝুঁকিপূর্ণ আসক্তি ⚠️'})`, 85, bhY + 190);

  // --- SECTION 5: COACH SOHAN MRIDHA'S SPECIAL BN DIAGNOSIS ---
  // Large personalized diagnosis card with coach avatar decoration
  ctx2.fillStyle = '#fafaf9';
  ctx2.strokeStyle = '#f59e0b';
  ctx2.lineWidth = 2.5;
  drawRoundedRect(ctx2, 50, bhY + 285, 1100, 290, 20, true, true);

  // Little Coach Icon Label
  ctx2.fillStyle = '#f59e0b';
  drawRoundedRect(ctx2, 85, bhY + 265, 230, 40, 8, true, false);
  ctx2.fillStyle = '#0f172a';
  ctx2.font = 'bold 15px system-ui, Arial, sans-serif';
  ctx2.fillText('কোচ সোহান মৃধার মন্তব্য', 110, bhY + 290);

  // Diagnosis Message formulation
  let feedbackMessageBn = '';
  if (weeklyCompletionRate < 45) {
    feedbackMessageBn = `প্রিয় বন্ধু, তোমার আরো অনেক বেশি সতর্ক হতে হবে এবং পড়ার টেবিলে মনোযোগ বাড়াতে হবে! তোমার লক্ষ্যমাত্রা মাত্র ${weeklyCompletionRate}% পূরণ হয়েছে, যা খুবই কম। আজই সস্তা ডোপামিনের ফাঁদ ও সোশ্যাল মিডিয়ার আসক্তি রুখে দাও। তুমি অনন্য শক্তির অধিকারী, মেধার পূর্ণ প্রয়োগ করো এবং আগামীকালকে সুন্দর ও উজ্জ্বল করতে উঠে দাঁড়াও!`;
  } else if (weeklyCompletionRate < 75) {
    feedbackMessageBn = `হে লড়াকু বন্ধু, তোমার রুটিনে অনেক ভালো অগ্রগতি হচ্ছে! সাপ্তাহিক লক্ষ্য পূরণের হার ${weeklyCompletionRate}%, যা ইতিবাচক। তবে তুমি ইচ্ছে করলেই নিজের সেরা সত্ত্বা প্রকাশের মাধ্যমে ১০০% টার্গেট ছুঁতে পারো। রুটিনের ছোটখাট অবহেলাগুলো সংশোধন করো, নিয়মিত ৫ ওয়াক্ত নামাজ এবং সুঅভ্যাসগুলো বজায় রেখে কঠোর ফোকাস রাখো!`;
  } else {
    feedbackMessageBn = `আলহামদুলিল্লাহ অসাধারণ লড়াই করছ বন্ধু! তোমার সুদৃঢ় ইচ্ছাশক্তি ও সুঅভ্যাস নিয়ন্ত্রণে আমি পরম মুগ্ধ। সাপ্তাহিক পড়াশোনার ${weeklyCompletionRate}% লক্ষ্য পূরণ করে তুমি অন্যদের ছাড়িয়ে অনন্য উচ্চতায় দাঁড়িয়েছ। তোমার মা-বাবার মনে আনন্দের সুবাতাস বইতে বাধ্য। এই চমৎকার অগ্রগতি ধরে রাখো এবং ফোকাসড্ থাকো!`;
  }

  ctx2.fillStyle = '#1c1917';
  ctx2.font = 'bold 18px system-ui, Arial, sans-serif';
  ctx2.fillText('অ্যাকাডেমিক ও ফোকাস ডায়াগনস্টিক ফিডব্যাক:', 85, bhY + 355);

  ctx2.fillStyle = '#44403c';
  ctx2.font = 'bold 16px system-ui, Arial, sans-serif';
  // Wrapped Bangladesh text beautifully helper call
  drawWrappedText(ctx2, feedbackMessageBn, 85, bhY + 395, 1030, 30);

  // Print signature
  ctx2.fillStyle = '#d97706';
  ctx2.font = 'bold 16px system-ui, Arial, sans-serif';
  ctx2.fillText('— আপনার শুভাকাঙ্ক্ষী ও কোচ, মোহাম্মাদ সোহান মৃধা ও MridhaX AI', 580, bhY + 540);


  // --- PERSONAL MASTER COMPANION PLEDGE ---
  ctx2.fillStyle = '#e2e8f0';
  drawRoundedRect(ctx2, 50, bhY + 610, 1100, 130, 16, true, false);

  ctx2.fillStyle = '#334155';
  ctx2.font = 'italic bold 15px system-ui, Arial, sans-serif';
  const pledgeText = `“আমি শপথ করছি যে, আমি আমার বাবা-মায়েরা কষ্টার্জিত রক্তের মূল্য রক্ষা করবো। আমি সোশ্যাল মিডিয়ার ফাঁদ ও ক্ষতিকর কুঅভ্যাস সম্পূর্ণরূপে পরিহার করবো এবং একজন খাঁটি মানুষ হয়ে নিজের ক্যরিয়ার ও আখেরাত গড়ে তুলবো। মৃধাক্স এআই থাকবে আমার এই যাত্রায় অবিরাম সাথী।”`;
  drawWrappedText(ctx2, pledgeText, 85, bhY + 655, 1030, 26);

  // --- SAVE AND EXPORT GENERATED FILE ---
  setTimeout(() => {
    try {
      const imgData1 = canvas1.toDataURL('image/jpeg', 0.96);
      const imgData2 = canvas2.toDataURL('image/jpeg', 0.96);

      const pdf = new jsPDF('p', 'mm', 'a4');
      // A4 scale standard page dimension: 210mm x 297mm
      pdf.addImage(imgData1, 'JPEG', 0, 0, 210, 297);
      pdf.addPage();
      pdf.addImage(imgData2, 'JPEG', 0, 0, 210, 297);
      
      pdf.save(`MridhaX_Academic_Report_${exportLabel}.pdf`);
      console.log("[MridhaX PDF Export] Successfully generated via HTML5 Canvas Snapshots!");
    } catch (err) {
      console.error("[PDF Canvas Generation Error]:", err);
    }
  }, 100);
}
