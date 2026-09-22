# GOLDEN MINUTE — Demo & Verification Checklist

This checklist tracks validation for the **GOLDEN MINUTE** Real-Time Emergency Guidance Copilot MVP for the YC Fall 2026 × Moss Builder Sprint.

- [x] Backend starts successfully (`python -m uvicorn app.main:app --port 8000`)
- [x] Frontend starts successfully (`npm run dev` / `npm run build` on port 3000)
- [x] Health endpoint works (`GET /health` -> 200 OK)
- [x] Status endpoint works (`GET /api/v1/status` -> 200 OK, `moss_available: true`)
- [x] Text query works (`POST /api/v1/emergency` -> 200 OK with structured guidance)
- [x] Empty query validation works (Returns HTTP 422 Unprocessable Entity)
- [x] Moss Primary Retrieval Layer active (`moss-1.13.0` + `inferedge-moss-core`)
- [x] Live Moss queries verified (`choking`: 17.37ms, `bleeding`: 11.1ms, `burns`: 10.57ms)
- [x] Baseline fallback available if Moss is disabled or unconfigured
- [x] Safety gate works (Rejects unapproved records, missing sources, missing content, low relevance)
- [x] Fallback works (Deterministic safe instructions with 112 emergency service reminder)
- [x] Source is displayed (Authoritative organization name and verified URL)
- [x] Actual latency is displayed (Measured honestly with `time.perf_counter()`)
- [x] Voice input active (Web Speech API with permission handling and fallback)
- [x] Text-to-speech active (SpeechSynthesis API with clear emergency narration)
- [x] No secret keys are exposed (Environment variables kept on backend only)
- [x] Safety notice is visible (Clear educational prototype disclaimer; non-diagnostic)
