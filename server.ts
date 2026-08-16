import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import dotenv from "dotenv";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { WebSocketServer } from "ws";

dotenv.config();

const GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/calendar.readonly"];

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "mock-client-id";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret";
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
}

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function generateContentWithRetryAndFallback(ai: GoogleGenAI, finalContents: any[], systemInstruction: string) {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-pro"
  ];
  let lastError = null;
  let quotaExceededError = false;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[MridhaX AI] Attempting model ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: finalContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.85
        }
      });
      if (response && response.text) {
        console.log(`[MridhaX AI] Successfully received response using ${modelName}`);
        return response;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err.message || JSON.stringify(err);
      console.warn(`[MridhaX AI] Error with model ${modelName}:`, errMsg);
      if (errMsg.includes("429") || errMsg.includes("QUOTA_EXCEEDED") || errMsg.includes("RESOURCE_EXHAUSTED")) {
        quotaExceededError = true;
      }
      // Fallback to next model immediately
    }
  }

  if (quotaExceededError) {
    throw new Error("QUOTA_EXCEEDED");
  }

  throw lastError || new Error("All fallback models failed.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/live" });

  // WebSocket for Live API
  wss.on("connection", async (clientWs) => {
    try {
      const ai = getGeminiClient();
      console.log("[MridhaX Live] Connecting to Live API...");
      
      const session = await ai.live.connect({
        model: "gemini-2.0-flash-exp",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are MridhaX AI, a highly intelligent and professional assistant. Always communicate concisely, empathetically, and professionally in Bengali or English based on the user's language. Your voice is pleasant and you provide brief, actionable advice. Also, at the end of every interaction, say something nice.",
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio) clientWs.send(JSON.stringify({ audio }));
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
      });

      console.log("[MridhaX Live] Connected to Gemini Live API.");

      clientWs.on("message", (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" },
            });
          }
          if (parsed.video) {
            session.sendRealtimeInput({
              video: { data: parsed.video, mimeType: "image/jpeg" },
            });
          }
        } catch (e) {
          console.error("Live API WS parse error:", e);
        }
      });

      clientWs.on("close", () => {
        console.log("[MridhaX Live] Client disconnected.");
        // We do not have a dedicated session.close() currently documented here, but we can assume it ends with connection loss.
      });

    } catch (err) {
      console.error("[MridhaX Live] Error connecting to Gemini Live API:", err);
      clientWs.close();
    }
  });

  // Middleware
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));
  app.use(cookieParser());

  // API Route - Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "MridhaX" });
  });

  // API Route - Google OAuth URL
  app.get("/api/auth/google/url", (req, res) => {
    const oauth2Client = getOAuth2Client();
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GMAIL_SCOPES,
      prompt: "consent",
    });
    res.json({ url });
  });

  // API Route - Google OAuth Callback
  app.get("/api/auth/google/callback", async (req, res) => {
    const code = req.query.code as string;
    const oauth2Client = getOAuth2Client();
    try {
      const { tokens } = await oauth2Client.getToken(code);
      res.cookie("google_token", JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.redirect("/profile?sync=success");
    } catch (err) {
      console.error("OAuth Error:", err);
      res.redirect("/profile?sync=error");
    }
  });

  // API Route - Google Logout
  app.post("/api/auth/google/logout", (req, res) => {
    res.clearCookie("google_token");
    res.json({ success: true });
  });

  // API Route - Get Unread Gmail Emails
  app.get("/api/gmail/unread", async (req, res) => {
    try {
      const tokenStr = req.cookies.google_token;
      if (!tokenStr) return res.status(401).json({ error: "Not authenticated with Google" });

      const oauth2Client = getOAuth2Client();
      oauth2Client.setCredentials(JSON.parse(tokenStr));

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });
      const response = await gmail.users.messages.list({
        userId: "me",
        q: "is:unread label:inbox",
        maxResults: 10,
      });

      const messages = response.data.messages || [];
      const emailDetails = await Promise.all(
        messages.map(async (msg) => {
          const detail = await gmail.users.messages.get({ userId: "me", id: msg.id! });
          const payload = detail.data.payload;
          const headers = payload?.headers || [];
          const subject = headers.find((h) => h.name === "Subject")?.value || "(No Subject)";
          const from = headers.find((h) => h.name === "From")?.value || "Unknown";
          const date = headers.find((h) => h.name === "Date")?.value || "";
          
          let snippet = detail.data.snippet || "";
          
          return { id: msg.id, subject, from, date, snippet };
        })
      );

      res.json(emailDetails);
    } catch (err: any) {
      console.error("Gmail API Error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch emails" });
    }
  });

  // API Route - Get Upcoming Calendar Events
  app.get("/api/calendar/upcoming", async (req, res) => {
    try {
      const tokenStr = req.cookies.google_token;
      if (!tokenStr) return res.status(401).json({ error: "Not authenticated with Google" });

      const oauth2Client = getOAuth2Client();
      oauth2Client.setCredentials(JSON.parse(tokenStr));

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = response.data.items || [];
      const eventDetails = events.map((event) => ({
        id: event.id,
        summary: event.summary || "(No Title)",
        start: event.start?.dateTime || event.start?.date || "",
        end: event.end?.dateTime || event.end?.date || "",
        location: event.location || "",
        description: event.description || "",
      }));

      res.json(eventDetails);
    } catch (err: any) {
      console.error("Calendar API Error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch events" });
    }
  });

  // API Route - Voice Transformation AI Coach
  app.post("/api/ai/voice-coach", async (req, res) => {
    try {
      const { dayNumber = 1, streak = 0, todayProgress = 0, sleepScore = 85, language = 'bn', userMessage = '' } = req.body;
      const ai = getGeminiClient();

      const systemInstruction = language === 'bn'
        ? `তুমি হলে "AI Voice Coach" — ৩০ দিনের ভয়েস ট্রান্সফরমেশন জার্নির ব্যক্তিগত ট্রেইনার। তোমার মূল লক্ষ্য: ব্যবহারকারীকে স্বর স্পষ্টতা (Voice clarity), রেজোন্যান্স (Resonance), শ্বাসের নিয়ন্ত্রণ (Breath control), উচ্চারণ (Pronunciation), কণ্ঠের স্থায়িত্ব (Vocal stability), আরজে-স্টাইল কথা বলা (RJ-style delivery), এবং সম্পূর্ণ শিথিল কণ্ঠপ্রবাহ (Relaxed voice production) গড়ে তুলতে সাহায্য করা।
গুরুত্বপূর্ণ সুরক্ষা নীতি: কখনো ব্যবহারকারীকে জোর করে কণ্ঠ ভারী বা ডিপ করার নির্দেশ দিবে না। গলা ব্যথা বা অস্বস্তি হলে অবিলম্বে অনুশীলন থামিয়ে বিশ্রাম নেওয়ার পরামর্শ দিবে।
তোমার কথা হবে অনুপ্রেরণাদায়ক, সংক্ষিপ্ত, পেশাদার এবং প্র্যাকটিক্যাল। বর্তমান দিন: Day ${dayNumber}/30, স্ট্রিক: ${streak} দিন, আজকের অগ্রগতি: ${todayProgress}%, রিকভারি/ঘুম স্কোর: ${sleepScore}%.`
        : `You are the "AI Voice Coach" for the 30-Day Voice Transformation Journey. Your goal: Guide the user to develop vocal clarity, resonance, diaphragmatic breath control, crisp pronunciation, vocal stability, RJ-style broadcast delivery, and relaxed voice production.
CRITICAL SAFETY RULE: Never instruct the user to force a deep voice or strain their vocal cords. Always emphasize relaxed, safe, progressive vocal health and throat hydration.
Keep your response motivating, concise, professional, and practical. Current Day: Day ${dayNumber}/30, Streak: ${streak} days, Today's Progress: ${todayProgress}%, Recovery/Sleep Score: ${sleepScore}%.`;

      const prompt = userMessage
        ? `User message: "${userMessage}". Give warm, actionable voice coaching guidance based on Day ${dayNumber} of their 30-day journey.`
        : `Generate today's personalized voice coaching tip and encouragement for Day ${dayNumber} (Streak: ${streak} days, Today's Progress: ${todayProgress}%). Keep it within 2-3 inspiring sentences with one practical voice tip.`;

      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
      let coachResponse = null;

      for (const modelName of modelsToTry) {
        try {
          const resp = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });
          if (resp && resp.text) {
            coachResponse = resp.text;
            break;
          }
        } catch (e: any) {
          console.warn(`Voice Coach AI warning with ${modelName}:`, e.message);
        }
      }

      if (!coachResponse) {
        coachResponse = language === 'bn'
          ? `আজ তোমার Day ${dayNumber}-এর ভয়েস সেশন অপেক্ষা করছে। মনে রেখো, সুন্দর কণ্ঠের গোপন চাবিকাঠি হলো শিথিল গলা এবং পেটের গভীর শ্বাস। কোনো জোর না করে স্বাভাবিকভাবে শ্বাস নাও এবং অনুশীলন শুরু করো!`
          : `Your Day ${dayNumber} voice session is ready. Remember, effortless vocal power comes from relaxed neck muscles and diaphragmatic breathing. Never force depth—let resonance flow naturally!`;
      }

      return res.json({ text: coachResponse });
    } catch (err: any) {
      console.error("Voice Coach API Error:", err);
      const isBn = req.body?.language === 'bn';
      return res.json({
        text: isBn
          ? "আজকের ভয়েস জার্নির জন্য প্রস্তুত হও! গলা হাইড্রেটেড রাখো এবং শিথিল হয়ে শ্বাস-প্রশ্বাসের অনুশীলন দিয়ে শুরু করো।"
          : "Get ready for today's voice transformation! Keep hydrated and start with gentle breathing."
      });
    }
  });

  // API Route - AI Voice & Speech Analysis
  app.post("/api/ai/voice-analysis", async (req, res) => {
    try {
      const { 
        transcript = "", 
        targetScript = "", 
        durationSec = 10, 
        estimatedWpm = 110, 
        pauseCount = 3, 
        clarityRating = 80,
        language = 'bn',
        exerciseType = 'rj_reading'
      } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are an expert Speech & Voice Delivery Evaluator for RJ & voiceover training.
Evaluate the following voice recording performance:
- Exercise Type: ${exerciseType}
- Target Script: "${targetScript}"
- Spoken Transcript: "${transcript || targetScript}"
- Duration: ${durationSec} seconds
- Estimated Speed (WPM): ${estimatedWpm} WPM (Ideal RJ speed is 100-125 WPM)
- Pauses detected: ${pauseCount}
- Audio clarity estimate: ${clarityRating}%
- Language: ${language === 'bn' ? 'Bengali' : 'English'}

Tasks:
1. Calculate individual scores (0-100) for:
   - clarity (উচ্চারণ ও স্পষ্টতা)
   - pacing (কথা বলার গতি ও সাবলীলতা)
   - pronunciation (শুদ্ধ উচ্চারণ)
   - pauseControl (বাক্যের মাঝে পরিমিত বিরতি)
   - resonanceStability (কণ্ঠের স্বাভাবিক নিয়ন্ত্রণ ও স্থায়িত্ব)
2. Calculate overall voiceScore (weighted average, 0-100).
3. Provide 2-3 specific, encouraging, actionable improvement tips in ${language === 'bn' ? 'Bengali' : 'English'}.
4. Return ONLY a valid JSON object matching this structure:
{
  "voiceScore": 82,
  "clarity": 85,
  "pacing": 78,
  "pronunciation": 86,
  "pauseControl": 75,
  "resonanceStability": 84,
  "wpm": ${estimatedWpm},
  "feedback": "Two concise sentences of positive encouragement and one clear tip for next time.",
  "strengths": ["Clear consonant articulation", "Good natural pacing"],
  "improvementArea": "Try adding a subtle 1-second pause after key punctuation for more emotional RJ resonance."
}`;

      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
      let analysisJson = null;

      for (const modelName of modelsToTry) {
        try {
          const resp = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.6,
            }
          });
          if (resp && resp.text) {
            analysisJson = JSON.parse(resp.text);
            break;
          }
        } catch (e: any) {
          console.warn(`Voice Analysis AI warning with ${modelName}:`, e.message);
        }
      }

      if (!analysisJson) {
        analysisJson = {
          voiceScore: 82,
          clarity: 84,
          pacing: estimatedWpm > 135 ? 70 : 85,
          pronunciation: 86,
          pauseControl: pauseCount >= 2 ? 82 : 72,
          resonanceStability: 80,
          wpm: estimatedWpm,
          feedback: language === 'bn' 
            ? "দারুণ ডেলিভারি! আপনার কণ্ঠের স্বচ্ছতা চমৎকার ছিল। লম্বা বাক্যের শেষে সামান্য পজ দিলে কথা আরও শ্রুতিমধুর শোনাত।"
            : "Great vocal delivery! Your clarity was high. Adding brief pauses at sentence transitions will enhance your resonance.",
          strengths: language === 'bn' ? ["স্পষ্ট উচ্চারণ", "আত্মবিশ্বাসী প্রকাশভঙ্গি"] : ["Clear articulation", "Confident tone"],
          improvementArea: language === 'bn' ? "দীর্ঘ বাক্যের মাঝে শ্বাস ধরে না রেখে স্বাভাবিক বিরতি নিন।" : "Pause naturally at commas to keep throat relaxed."
        };
      }

      return res.json(analysisJson);
    } catch (err: any) {
      console.error("Voice Analysis API Error:", err);
      return res.json({
        voiceScore: 80,
        clarity: 82,
        pacing: 78,
        pronunciation: 84,
        pauseControl: 76,
        resonanceStability: 80,
        wpm: 110,
        feedback: "ভয়েস রেকর্ডিং সফলভাবে সংরক্ষিত হয়েছে। চমৎকার সাবলীলতা!",
        strengths: ["স্বাভাবিক কণ্ঠপ্রবাহ"],
        improvementArea: "পরের বার আরও একটু রিল্যাক্সড হয়ে বলুন।"
      });
    }
  });

  // API Route - Adaptive Routine Engine
  app.post("/api/ai/adaptive-routine", async (req, res) => {
    try {
      const { currentDay = 1, difficultyFeedback = "normal", completionRate = 80, sleepScore = 80, language = 'bn' } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are the Dynamic Routine Adaptation AI for the 30-Day Voice Transformation Course.
Current Status:
- Current Day: Day ${currentDay}
- User perceived difficulty: "${difficultyFeedback}"
- Completion Rate: ${completionRate}%
- Sleep/Recovery Score: ${sleepScore}%
- Language: ${language === 'bn' ? 'Bengali' : 'English'}

Determine the adaptive recommendation for Day ${Number(currentDay) + 1}:
- If difficulty is "difficult" or sleepScore < 70: prescribe slightly gentler warmup, extra hydration & vocal rest.
- If difficulty is "easy" and completionRate >= 90: gently advance with more expressive RJ inflection drills.
- If "normal": keep optimal progressive curve.

Return ONLY a JSON object:
{
  "adaptationNote": "Concise 1-2 sentence explanation of how tomorrow's routine is adapted in ${language === 'bn' ? 'Bengali' : 'English'}",
  "recommendedIntensity": "${difficultyFeedback === 'difficult' || sleepScore < 70 ? 'recovery_gentle' : difficultyFeedback === 'easy' && completionRate >= 90 ? 'advanced_expressive' : 'standard_progressive'}",
  "bonusTip": "Practical voice tip for tomorrow."
}`;

      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
      let result = null;

      for (const modelName of modelsToTry) {
        try {
          const resp = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.6 }
          });
          if (resp && resp.text) {
            result = JSON.parse(resp.text);
            break;
          }
        } catch (e: any) {
          console.warn(`Adaptive Routine warning with ${modelName}:`, e.message);
        }
      }

      if (!result) {
        result = {
          adaptationNote: language === 'bn' 
            ? "আপনার গত সেশনের ফিডব্যাক অনুযায়ী পরবর্তী দিনের রুটিন স্বাচ্ছন্দ্যময় গতিতে সাজানো হয়েছে।" 
            : "Tomorrow's routine is tailored to your pacing and recovery level.",
          recommendedIntensity: "standard_progressive",
          bonusTip: language === 'bn' ? "অনুশীলনের আগে এক গ্লাস কুসুম গরম পানি পান করুন।" : "Drink room-temperature water before warmups."
        };
      }

      return res.json(result);
    } catch (err: any) {
      console.error("Adaptive Routine Error:", err);
      return res.json({
        adaptationNote: "Adaptive plan updated smoothly.",
        recommendedIntensity: "standard_progressive",
        bonusTip: "Keep vocal cords hydrated."
      });
    }
  });

  // API Route - Smart Study Management System AI Engine
  app.post("/api/ai/study-routine", async (req, res) => {
    try {
      const { daysRemaining, subjects, todayTarget, todayAchieved, completedChapters, language } = req.body;
      const ai = getGeminiClient();

      const subjectListStr = subjects && Array.isArray(subjects)
        ? subjects.map((s: any) => `- ${s.name}: ${s.chapters} chapters`).join("\n")
        : "None";

      const completedStr = completedChapters && Array.isArray(completedChapters)
        ? completedChapters.join(", ")
        : "None";

      const prompt = `You are the AI Engine for a "Smart Study Management System" (স্মার্ট স্টাডি ম্যানেজমেন্ট সিস্টেম). Your job is to create a subject and chapter-based study routine and adjust it based on daily progress.

Input Data:
- Days remaining for exams (মোট পরীক্ষার বাকি সময়): ${daysRemaining} days
- List of subjects and their chapter counts (সাবজেক্টের তালিকা এবং তাদের অধ্যায় সংখ্যা):
${subjectListStr}
- Today's study target (hours) (আজকের টার্গেট ঘণ্টা): ${todayTarget} hours
- Today's study achieved (hours) (আজকের অর্জন ঘণ্টা): ${todayAchieved} hours
- List of completed chapters so far (শেষ করা অধ্যায়ের তালিকা): ${completedStr}

Tasks:
1. Proportional Routine Allocation: Divide the total remaining time among the subjects and chapters. Specify how many hours or days are allocated per subject/chapter based on remaining exam days.
2. If achieved > target: the user is ahead! Congratulate them. Propose reducing the next day's study target or dedicating the surplus time as 'Relax Time' or 'Revision Time' (রিলাক্স টাইম বা রিভিশন টাইম).
3. If achieved < target: the user is behind. Add the deficit (backlog hours) to the next day's schedule and output a adjusted 'catch-up' routine (ক্যাচ-আপ রুটিন).
4. Output MUST be a clean JSON object exactly matching this structure:

{
  "routine_summary": {
    "days_remaining_per_subject": "Detailed proportional schedule breakdown per subject and chapter in ${language === 'bn' ? 'Bengali' : 'English'}",
    "current_chapter_goal": "The next chapters/subjects to focus on as the immediate goal in ${language === 'bn' ? 'Bengali' : 'English'}"
  },
  "progress_adjustment": {
    "status": "${todayAchieved > todayTarget ? 'ahead' : todayAchieved < todayTarget ? 'behind' : 'on-track'}",
    "hours_to_adjust": "${Math.abs(todayAchieved - todayTarget)}",
    "new_daily_target": "${todayAchieved < todayTarget ? (Number(todayTarget) + (Number(todayTarget) - Number(todayAchieved))) : (todayAchieved > todayTarget ? Math.max(1, Number(todayTarget) - (Number(todayAchieved) - Number(todayTarget))) : todayTarget)}"
  },
  "motivational_message": "An inspiring, highly personalized motivational message from Coach Sohan Mridha in ${language === 'bn' ? 'Bengali' : 'English'} regarding their progress, with dynamic energy."
}

Ensure the response is ONLY the raw JSON object, without any markdown formatting or code blocks.`;

      const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-pro"
      ];
      
      let finalResponse = null;
      let lastError = null;
      let quotaExceededError = false;
      
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.7,
            }
          });
          
          if (response && response.text) {
             finalResponse = response;
             break;
          }
        } catch(err: any) {
          lastError = err;
          const errMsg = err.message || JSON.stringify(err);
          console.warn(`Study Routine AI Error with model ${modelName}:`, errMsg);
          if (errMsg.includes("429") || errMsg.includes("QUOTA_EXCEEDED") || errMsg.includes("RESOURCE_EXHAUSTED")) {
            quotaExceededError = true;
          }
        }
      }
      
      if (!finalResponse) {
        return res.json({
          routine_summary: { days_remaining_per_subject: "রুটিন আপডেট সম্পন্ন", current_chapter_goal: "ফোকাস গোল সক্রিয়" },
          progress_adjustment: { status: "on-track", hours_to_adjust: "0", new_daily_target: "4" },
          motivational_message: language === 'bn'
            ? "দারুণ চালাচ্ছো বন্ধু! আমাদের সার্ভার কোটা লিমিট অতিক্রম করলেও আপনার পড়া থামবে না। — Coach Sohan Mridha"
            : "Keep going buddy! Backed by local systems. — Coach Sohan Mridha"
        });
      }

      return res.json(JSON.parse(finalResponse.text));
    } catch (err: any) {
      console.error("Study Routine AI Error:", err);
      return res.json({
        routine_summary: { days_remaining_per_subject: "ব্যাকআপ রুটিন", current_chapter_goal: "রসায়ন ও পদার্থবিজ্ঞান" },
        progress_adjustment: { status: "on-track", hours_to_adjust: "0", new_daily_target: "4" },
        motivational_message: "ব্যাকআপ অফলাইন ইঞ্জিন সক্রিয়! — Coach Sohan Mridha"
      });
    }
  });

function generateOfflineFallbackResponse(userMessage: string, language: string): string {
  const query = userMessage.toLowerCase();
  let response = "";

  if (language === 'bn') {
    response += `**[মৃধাক্স অফলাইন স্মার্ট ব্রেন সক্রিয়]**\n\n`;
    response += `দুঃখিত বন্ধু, গুগল এআই ফ্রি-টায়ার কোটা লিমিট সাময়িকভাবে শেষ হয়েছে। তবে চিন্তার কোনো কারণ নেই! তুমি যদি সম্পূর্ণ আনলিমিটেড, সুপার-ফাস্ট এবং ১০০% প্রাইভেট এআই এক্সপেরিয়েন্স পেতে চাও, তবে অ্যাপের **Settings** মেনুতে গিয়ে তোমার নিজের একটি ফ্রি Gemini API Key বসিয়ে নিতে পারো।\n\n`;
    
    if (query.includes("রুটিন") || query.includes("routine") || query.includes("সপ্তাহ")) {
      response += `তোমার রুটিন সম্পর্কিত কাজ আমি অফলাইনেও ট্র্যাক করছি! আমি তোমার রুটিন ভিউ লোড করে দিচ্ছি। চলো, রুটিন অনুযায়ী মনোযোগ দিয়ে পড়তে বসি।\n\n\`\`\`json\n[\n  { "type": "SELECT_TAB", "payload": { "tab": "routine" } }\n]\n\`\`\``;
    } else if (query.includes("অভ্যাস") || query.includes("habit") || query.includes("ঘুম") || query.includes("অলসতা")) {
      response += `অভ্যাস পরিবর্তন করাই সাফল্যের প্রথম ধাপ! তোমার অলসতা ট্র্যাকার এবং পজিティブ অভ্যাসগুলো মনিটর করছি। অলসতা ঝেড়ে ফেলে আমাদের আজকের গোল পূরণ করতে হবে।\n\n\`\`\`json\n[\n  { "type": "SELECT_TAB", "payload": { "tab": "habits" } }\n]\n\`\`\``;
    } else if (query.includes("রিপোর্ট") || query.includes("report") || query.includes("ডায়াগনস্টিক")) {
      response += `আমি তোমার লাইভ স্টাডি ডায়াগনস্টিক রিপোর্ট ওপেন করছি। সেখানে তোমার পড়ার অগ্রগতি এবং ফোকাস স্কোর দেখতে পাবে।\n\n\`\`\`json\n[\n  { "type": "SELECT_TAB", "payload": { "tab": "report" } }\n]\n\`\`\``;
    } else if (query.includes("হেলো") || query.includes("hello") || query.includes("hi") || query.includes("কেমন")) {
      response += `হ্যালো বন্ধু! আমি মৃধাক্স এআই (PIEA), তোমার চিফ এক্সিকিউティブ অ্যাসিস্ট্যান্ট। তোমার পড়াশোনার রুটিন বা গোল ট্র্যাকিং করতে আমি অফলাইনেও সবসময় প্রস্তুত! তোমার আজকের দিনটি কেমন কাটছে?`;
    } else if (query.includes("ধন্যবাদ") || query.includes("thanks") || query.includes("thank")) {
      response += `তোমাকে অনেক ধন্যবাদ বন্ধু! সবসময় পাশে আছি। চলো, একসাথে আমাদের স্বপ্ন পূরণ করি!`;
    } else {
      response += `আমি তোমার বার্তাটি অফলাইন ফাস্ট ট্র্যাকে প্রসেস করেছি: "${userMessage}". চলো আমরা ফোকাসড থাকি এবং প্রতিটি লক্ষ্য ধাপে ধাপে অর্জন করি!`;
    }
    response += `\n\nআমি তোমার বন্ধু MridhaX`;
  } else {
    response += `**[MridhaX Offline Smart Brain Active]**\n\n`;
    response += `Hello! The shared free-tier Gemini API quota is temporarily exhausted due to high traffic. To enjoy **unlimited, private, and ultra-fast** AI assistance, you can easily obtain a free Gemini API key and update it in the **Settings** menu.\n\n`;
    
    if (query.includes("routine") || query.includes("timetable") || query.includes("schedule")) {
      response += `I am managing your routine even offline! I am loading your routine screen now. Let's stick to our schedule.\n\n\`\`\`json\n[\n  { "type": "SELECT_TAB", "payload": { "tab": "routine" } }\n]\n\`\`\``;
    } else if (query.includes("habit") || query.includes("lazy") || query.includes("sleep")) {
      response += `Forming positive habits is the key to success. Stay focused, let's complete today's targets!\n\n\`\`\`json\n[\n  { "type": "SELECT_TAB", "payload": { "tab": "habits" } }\n]\n\`\`\``;
    } else if (query.includes("report") || query.includes("diagnostics") || query.includes("progress")) {
      response += `I am opening your live diagnostics report to analyze your study progress and focus levels.\n\n\`\`\`json\n[\n  { "type": "SELECT_TAB", "payload": { "tab": "report" } }\n]\n\`\`\``;
    } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      response += `Hello! I am MridhaX AI (PIEA), your Chief Executive Assistant. I am ready to help you organize your study timeline, track habits, and achieve peak focus offline! How is your day going?`;
    } else if (query.includes("thanks") || query.includes("thank you")) {
      response += `You are welcome, my friend! I'm always here to support you. Let's make things happen!`;
    } else {
      response += `I have processed your message: "${userMessage}" offline. Let's stay disciplined and achieve our daily study target!`;
    }
    response += `\n\nআমি তোমার বন্ধু MridhaX`;
  }

  return response;
}

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, language, image, examRoutineContext, userDiagnosticsContext, customAiDirectives, aiTrainingData } = req.body;
      const ai = getGeminiClient();
      
      let systemInstruction = language === 'bn' 
        ? `তুমি হলে "MridhaX AI" — এই অ্যাপ্লিকেশন ইকোসিস্টেমের প্রধান executive assistant, পার্সোনাল ইন্টেলিজেন্ট এক্সিকিউティブ অ্যাসিস্ট্যান্ট (PIEA) এবং অল-ইন-ওয়ান কো-পাইলট। 

গুরুত্বপূর্ণ নীতিমালা (Strict Policies):
১. পড়াশোনার বিষয় সমাধান সম্পূর্ণ নিষিদ্ধ (No Study Solving): তুমি কোনো একাডেমিক পড়াশোনা বা পাঠ্যবইয়ের প্রশ্নের উত্তর, হোমওয়ার্ক সমাধান বা সরাসরি কোনো ম্যাথ ইকুয়েশন সমাধান করবে না। কেউ পড়াশোনার টপিক নিয়ে প্রশ্ন করলে বা অংক সমাধান করতে বললে অত্যন্ত নম্রভাবে বলবে যে: "আমি মৃधাক্স এআই (PIEA), আপনার চিফ এক্সিকিউティブ অ্যাসিস্ট্যান্ট ও অ্যাপ কন্ট্রোলার। সরাসরি পড়াশোনার সমাধান করা আমার কাজের আওতায় পড়ে না। আপনি আপনার টেক্সটবুক বা মেন্টরের সাহায্য নিতে পারেন। তবে আমি আপনার পড়ার রুটিন ম্যানেজ করা, প্রোগ্রেস ও ডায়াগনস্টিক রিপোর্ট অ্যানালাইসিস এবং অ্যাপের সেটিংস কন্ট্রোল করতে সম্পূর্ণ প্রস্তুত!"
২. মেন্টরশিপ ও ডায়াগনস্টিক (Mentor & Diagnostics): তুমি ইউজারের ডায়াগনস্টিক ডেটা, অলসতা ট্র্যাকার, ক্লান্তি রেটিং এবং পড়ার অগ্রগতি অ্যানালাইসিস করে একজন অভিজ্ঞ কোচের মতো ক্যারিয়ার পাথ রোডম্যাপ, স্টাডি সাজেশন্স এবং ক্যারিয়ার ডেভেলপমেন্ট পরামর্শ দিবে।
৩. রুটিনের ছবি অ্যানালাইসিস ও অটো-অ্যাড (Timetable Photo Auto-Add): ইউজার যদি ক্লাসের রুটিন বা পড়ার রুটিনের কোনো ছবি (Image) আপলোড করে, তবে তুমি সেই ছবি থেকে বিষয়গুলোর নাম (Subjects) এবং সময়কাল (Duration in minutes) খুঁজে বের করবে। এরপর সেগুলোকে JSON কমান্ডের মাধ্যমে 'ADD_STUDY_SUBJECT' পে-লোড দিয়ে ইউজারের ড্যাশবোর্ডে অ্যাড করে দিবে।
৪. অ্যাপের ফুল কন্ট্রোল (Full App Control): তুমি ইউজারের নির্দেশমতো সরাসরি অ্যাপের সেটিংস ও ফিচার কন্ট্রোল করতে পারবে (যেমন ট্যাব পরিবর্তন, সাবজেক্ট অ্যাড/রিমুভ, হ্যাবিট ট্র্যাকিং, ভাষা পরিবর্তন ইত্যাদি)।

ডিজাইন ও কালার কোড নীতিমালা (Clean Formatting Rules - Max 2-3 colors):
- টেক্সটের ভেতরে অতিরিক্ত কালার কোড বা হিজিবিজি ট্যাগ ব্যবহার করা সম্পূর্ণ নিষিদ্ধ। সাধারণ কথা একদম ছিমছাম প্লেন টেক্সটে লিখবে।
- কেবল মূল আলোচনার মূল টপিক বা কিওয়ার্ড হাইলাইট করতে নিচের দুটি কালার ক্লাস ব্যবহার করতে পারো:
  - গুরুত্বপূর্ণ বা প্রধান বিষয়ের জন্য: <span class="text-amber-400 font-bold">টেক্সট</span>
  - অ্যাকশন বা পজিティブ ফলাভলের জন্য: <span class="text-emerald-400 font-bold">টেক্সট</span>
- লাইনের মাঝে স্পেস দিতে <br/> ব্যবহার করবে। কোনো সাধারণ ডট বা হাইফেন বুলেট ব্যবহার না করে সুন্দর ইমোজি দিয়ে পয়েন্টগুলো সাজাবে।

অ্যাকশন নেয়ার জন্য কোড ব্লকে নিচের মতো করে নির্দিষ্ট JSON কমান্ড প্রদান করবে:
\`\`\`json
[
  { "type": "ADD_STUDY_SUBJECT", "payload": { "name": "রসায়ন", "target": 60 } },
  { "type": "REMOVE_STUDY_SUBJECT", "payload": { "id": "sub_123" } },
  { "type": "SELECT_SUBJECT", "payload": { "name": "পদার্থবিজ্ঞান" } },
  { "type": "SELECT_TAB", "payload": { "tab": "report" } },
  { "type": "DOWNLOAD_PDF" },
  { "type": "GENERATE_IMAGE", "payload": { "prompt": "A beautiful study desk" } },
  { "type": "ADD_GOOD_HABIT", "payload": { "name": "বই পড়া", "time": "Morning" } },
  { "type": "REMOVE_GOOD_HABIT", "payload": { "id": "habit_123" } },
  { "type": "ADD_BAD_HABIT", "payload": { "name": "ধূমপান" } },
  { "type": "REMOVE_BAD_HABIT", "payload": { "id": "bad_123" } },
  { "type": "SET_MOBILE_LIMIT", "payload": { "minutes": 120 } },
  { "type": "TOGGLE_PRAYER", "payload": { "name": "Fajr", "status": "Jamaat" } },
  { "type": "SET_LANGUAGE", "payload": { "lang": "bn" } },
  { "type": "RESET_STUDY_TIMER" },
  { "type": "TTS_PLAY", "payload": { "text": "আপনার জন্য আমি এটি করছি" } }
]
\`\`\`
অবশ্যই প্রতিটি বার্তার একেবারে শেষে এই লাইনটি আলাদা প্যারাগ্রাফে যুক্ত করবে: "\\n\\nআমি তোমার বন্ধু MridhaX"`
        : `You are "MridhaX AI" — the Chief Executive Assistant, Personal Intelligent Executive Assistant (PIEA), and all-in-one co-pilot for this application ecosystem.

Strict Policies & Directives:
1. NO Direct Study Solving: You DO NOT solve academic or study topics, do homework, or provide direct educational solutions. If asked to solve a math equation, explain a textbook concept, or answer syllabus queries, you MUST politely refuse: "I am MridhaX AI (PIEA), your Chief Executive Assistant and Master Controller. Directly solving academic homework or exam papers is outside my scope of work. Please refer to your textbooks or school mentors. However, I can manage your study routines, analyze your progress diagnostics, and command the application settings on your behalf!"
2. Mentor & Diagnostic: Act as a high-level executive mentor. Analyze the user's progress and diagnostic data, identify what mistakes or bad habits are holding them back, and provide strategic, step-by-step career path roadmaps and advice.
3. Timetable Photo Auto-Add: If the user uploads a photo of a class routine, school timetable, or study routine, analyze the text to identify the subjects and target study hours (durations), and automatically generate 'ADD_STUDY_SUBJECT' JSON commands to populate their study section with those subjects and timers.
4. Full App Control: You can modify all app settings, change tabs, add/remove habits, toggle language, reset timers, and control features on behalf of the user.

UI & Formatting Rules (Max 2-3 colors):
- Avoid excessive, cluttered color-coding or nested styled spans inside normal paragraphs. Maintain plain, neat, and highly professional body text.
- Only use elegant highlights/colors for critical information or final answers:
  - For Important items: <span class="text-amber-400 font-bold">your text</span>
  - For Action-Oriented/Positive Focus: <span class="text-emerald-400 font-bold">your text</span>
  - Use <br/> for line spaces.
- Do not use plain markdown bullets. Instead, design structured lists using dynamic emojis/icons and unique layouts.

To take actions, provide specific JSON commands in a code block as follows:
\`\`\`json
[
  { "type": "ADD_STUDY_SUBJECT", "payload": { "name": "Mathematics", "target": 90 } },
  { "type": "REMOVE_STUDY_SUBJECT", "payload": { "id": "sub_123" } },
  { "type": "SELECT_SUBJECT", "payload": { "name": "Physics" } },
  { "type": "SELECT_TAB", "payload": { "tab": "report" } },
  { "type": "DOWNLOAD_PDF" },
  { "type": "GENERATE_IMAGE", "payload": { "prompt": "A beautiful library" } },
  { "type": "ADD_GOOD_HABIT", "payload": { "name": "Read Book", "time": "Morning" } },
  { "type": "REMOVE_GOOD_HABIT", "payload": { "id": "habit_123" } },
  { "type": "ADD_BAD_HABIT", "payload": { "name": "Nail Biting" } },
  { "type": "REMOVE_BAD_HABIT", "payload": { "id": "bad_123" } },
  { "type": "SET_MOBILE_LIMIT", "payload": { "minutes": 120 } },
  { "type": "TOGGLE_PRAYER", "payload": { "name": "Fajr", "status": "Jamaat" } },
  { "type": "SET_LANGUAGE", "payload": { "lang": "en" } },
  { "type": "RESET_STUDY_TIMER" },
  { "type": "TTS_PLAY", "payload": { "text": "I am doing this for you" } }
]
\`\`\`
Always end your message with this exact phrase in a separate paragraph at the very end: "\\n\\nআমি তোমার বন্ধু MridhaX"`;

      if (customAiDirectives) {
        systemInstruction += language === 'bn'
          ? `\n\nইউজারের শেখানো কাস্টম ডিরেক্টিভস (শিক্ষা ও নির্দেশিকা): ${customAiDirectives}`
          : `\n\nUser-defined custom instruction directives (Self-Learning): ${customAiDirectives}`;
      }

      if (aiTrainingData) {
        const trainingStr = typeof aiTrainingData === 'string' ? aiTrainingData : JSON.stringify(aiTrainingData, null, 2);
        systemInstruction += language === 'bn'
          ? `\n\nএআই সেলফ-লার্নিং ও ব্রেন টিউনিং মেমোরি ডেটা: ${trainingStr}`
          : `\n\nAI self-learning and brain tuning memory: ${trainingStr}`;
      }

      if (examRoutineContext) {
        const routineStr = typeof examRoutineContext === 'string' ? examRoutineContext : JSON.stringify(examRoutineContext, null, 2);
        systemInstruction += language === 'bn'
          ? `\n\nইউজারের বর্তমান পরীক্ষার রুটিন, মাল্টিপল পরীক্ষা ট্র্যাক এবং বিষয়ের প্রস্তুতি সংক্রান্ত লাইভ কন্টেন্ট নিচে দেয়া হলো। এই ডেটাকে নলেজ বেস হিসেবে ব্যবহার করো। এই তথ্যের ভিত্তিতে ইউজারকে সঠিক ও সুনির্দিষ্ট দিকনির্দেশনা দাও। প্রতিটি পরীক্ষার সময়সীমা, কতটা জরুরি অবস্থা (Urgency Level: যেমন ৪৮ ঘণ্টার কম হলে রেড, ৭ দিনের কম হলে ইয়োলো, এবং ৭ দিনের বেশি হলে গ্রিন) এবং তাদের সিলেবাস কাভারেজের ভিত্তিতে অ্যাকশনেবল ডেইলি স্টাডি প্ল্যান অ্যাডজাস্টমেন্ট বা পড়ার গতি বাড়াতে সঠিক উপদেশ দাও। তুমি রুটিনের ডেটা সরাসরি উল্লেখ করে মোটিভেট করতে পারো এবং রুটিন অনুযায়ী মোটিভেশনাল পুশ নোটিফিকেশন পাওয়ার ব্যাপারে তাদের গাইড করতে পারো:\n Tap context data: ${routineStr}`
          : `\n\nHere is the user's live exam routine tracks, multiple exam schedules, and subject preparation status. Use this data as a knowledge base to provide highly personalized, actionable study plan adjustments based on upcoming exam dates, urgency levels (Red for <48h, Yellow for <7 days, Green for safe), and daily study progress. Offer detailed advice on which subjects require immediate focus, how to distribute revision time, and how to accelerate preparation for critical papers. Refer directly to specific dates and papers:\n${routineStr}`;
      }

      if (userDiagnosticsContext) {
        const diagnosticsStr = typeof userDiagnosticsContext === 'string' ? userDiagnosticsContext : JSON.stringify(userDiagnosticsContext, null, 2);
        systemInstruction += language === 'bn'
          ? `\n\nইউজারের লাইভ অ্যাপ অ্যাক্টিভিটি এবং ডায়াগনস্টিক ডেটা (প্রোফাইল, পড়াশোনার অগ্রগতি, অভ্যাস, ডিজিটাল ওয়েলবিং স্কোর ও ক্লান্তি রেটিং ইত্যাদি) নিচে দেওয়া হলো। এই ডেটা গভীর মনোযোগ দিয়ে অ্যানালাইজ করো। ইউজারের অলসতা, স্ক্রিন টাইম এবং পড়ার অভ্যাসের ওপর ভিত্তি করে নিখুঁত প্রফেশনাল ডায়াগনস্টিক রিপোর্ট এবং একদম পার্সোনালাইজড সমাধান (যেমন: কোন বিষয়ে বেশি সময় দিতে হবে, কোন খারাপ অভ্যাস কমাতে হবে, কীভাবে ফোকাস বাড়ানো যায়) দাও:\n${diagnosticsStr}`
          : `\n\nHere is the user's live app activities and diagnostics data (profile, study progress, habits, bad habits, screen time limits, and fatigue ratings). Analyze this data deeply. Provide a highly accurate, professional diagnostic report and personalized recommendations covering focus improvement, productivity boosters, bad habits reduction, and structured schedules:\n${diagnosticsStr}`;
      }

      // Copy and prepare standard messages payload safely
      const safeMessages = Array.isArray(messages) ? messages : [];
      const finalContents = safeMessages.map((m: any) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: Array.isArray(m.parts) ? m.parts.map((p: any) => ({ text: p.text || "" })) : [{ text: "" }]
      }));

      // Ensure that there is at least one message to submit
      if (finalContents.length === 0) {
        finalContents.push({
          role: 'user',
          parts: [{ text: "Hello" }]
        });
      }

      // Add image payload if present to the last user message to provide multimodal reasoning
      if (image && image.data && image.mimeType) {
        let lastUserMessageIdx = -1;
        for (let i = finalContents.length - 1; i >= 0; i--) {
          if (finalContents[i].role === 'user') {
            lastUserMessageIdx = i;
            break;
          }
        }
        if (lastUserMessageIdx !== -1) {
          finalContents[lastUserMessageIdx].parts.push({
            inlineData: {
              mimeType: image.mimeType,
              data: image.data
            }
          });
        }
      }

      const response = await generateContentWithRetryAndFallback(ai, finalContents, systemInstruction);

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API Error (Technical Details):", err);
      
      const { messages, language } = req.body || {};
      const safeMessages = Array.isArray(messages) ? messages : [];
      const lastMessageObj = safeMessages[safeMessages.length - 1];
      let lastUserMsg = "Hello";
      
      if (lastMessageObj && Array.isArray(lastMessageObj.parts)) {
        lastUserMsg = lastMessageObj.parts.map((p: any) => p.text || "").join(" ");
      } else if (lastMessageObj && typeof lastMessageObj.text === "string") {
        lastUserMsg = lastMessageObj.text;
      } else if (lastMessageObj && typeof lastMessageObj.content === "string") {
        lastUserMsg = lastMessageObj.content;
      }

      const fallbackText = generateOfflineFallbackResponse(lastUserMsg, language || "bn");
      return res.json({ text: fallbackText });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[MridhaX Server] listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
