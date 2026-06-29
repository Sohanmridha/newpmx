# Gemini API Usage Guidelines for MridhaX AI

## Model Selection
- Use `gemini-1.5-flash` for fast, real-time interactions (chat, notifications).
- Use `gemini-1.5-pro` for complex tasks like math solving, PDF analysis, or deep data introspection.

## Key Capabilities to Implement

### 1. Vision & Multimodal
- Support image analysis for study materials.
- Support voice-to-text (transcription) and text-to-speech.

### 2. PDF & Document Analysis
- Use the Gemini API to parse and summarize uploaded PDF documents for the Study Assistant mode.

### 3. Smart Notifications
- Use server-side cron or background tasks to generate personalized motivational quotes using Gemini.

### 4. Function Calling
- Use function calling to give MridhaX AI "Full Control" over the app state.
  - `add_habit(name, time)`
  - `remove_habit(id)`
  - `update_study_target(subject, minutes)`
  - `generate_roadmap(goal)`

## Security & Privacy
- Always keep the `GEMINI_API_KEY` on the server side (`server.ts`).
- Proxy all AI requests through `/api/ai`.
