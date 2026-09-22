# GOLDEN MINUTE — Frontend Application

Next.js App Router emergency dashboard with Web Speech API speech-to-text, browser text-to-speech audio readouts, real-time latency telemetry, and accessible emergency response controls.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎙️ Voice Features

- **Speech-to-Text**: Uses the browser's native `window.SpeechRecognition` (Web Speech API). Provides live listening states and microphone permission error recovery.
- **Text-to-Speech**: Uses `window.speechSynthesis` with optimized rate and pitch for clear, calm emergency first-aid instruction playback.
- **Accessible Fallback**: Text input remains available across all browsers and devices.

---

## 📦 Key Components

- **`EmergencyInput.tsx`**: Query box with quick prompt pills, mic button, and retrieval toggles.
- **`GuidanceCard.tsx`**: Approved step-by-step guidance card with verified source badges and voice read-aloud buttons.
- **`MetricsPanel.tsx`**: Telemetry card breaking down total backend, baseline search, Moss, and LLM processing times.
- **`EmergencyReminder.tsx`**: India 112 emergency reminder with direct phone dialer triggers.
- **`StatusBadge.tsx`**: Visual verification chips indicating safety gate pass/fallback and active retrieval engines.
