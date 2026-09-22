# GOLDEN MINUTE ⏱️
### Real-Time Voice Emergency Guidance Copilot
*Built for the YC Fall 2026 × Moss: The Zero Latency Builder Sprint*

[![Moss Zero-Latency](https://img.shields.io/badge/Moss-Sub--10ms_Retrieval-8B5CF6?style=for-the-badge&logo=fastapi&logoColor=white)](https://portal.usemoss.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Pytest Passed](https://img.shields.io/badge/Tests-23%2F23%20Passing-10B981?style=for-the-badge)](https://docs.pytest.org)

> ⚠️ **IMPORTANT MEDICAL DISCLAIMER:**  
> GOLDEN MINUTE is an educational prototype and hackathon research demonstration. It does **not** provide medical diagnoses, replace clinical judgement, or substitute for emergency dispatch services. If you are experiencing a life-threatening medical emergency, immediately contact local emergency services (In India, dial **112**; In the US, dial **911**).

---

## 🌟 What is GOLDEN MINUTE?

In acute medical crises (choking, cardiac arrest, severe hemorrhage, anaphylaxis), bystanders have less than 60 seconds—the **"Golden Minute"**—to take critical, life-preserving action before professional emergency responders arrive.

**GOLDEN MINUTE** is a voice-first, safety-conscious emergency guidance copilot designed for zero-latency retrieval. By combining the **Official Moss SDK** for sub-10ms in-memory semantic context retrieval with an independent **Deterministic Medical Safety Gate** and **Symptom Triage Engine**, GOLDEN MINUTE delivers certified first-aid instructions in seconds without hallucinations or clinical guesswork.

---

## 🎯 Key Capabilities

- ⚡ **Sub-10ms Context Retrieval:** Queries run against an in-memory, pre-warmed Moss cloud index (`golden-minute-emergency`) executing in **`0.65 ms - 8 ms`**.
- 🎙️ **Hands-Free Voice Experience:** Web Speech API speech-to-text recognition paired with instant speech synthesis read-out so bystanders can listen while using their hands.
- 🛡️ **10-Point Safety Gate:** Validates medical review status (`approved_for_demo`), verifies source URLs, checks semantic relevance, and blocks unverified treatments.
- 🩺 **Symptom-Aware Triage Engine:** Differentiates between:
  - 🚨 **Immediate Red-Flag Emergencies** (e.g. *"fever with confusion and breathing difficulty"*, *"sudden thunderclap headache"*) ➔ Instant escalation to 112.
  - ❓ **Non-Urgent Symptoms** (e.g. *"fever"*, *"headache"*) ➔ Cautious next steps with focused **Essential Clarifying Questions** (temperature, duration, age, onset).
  - 📋 **Approved First-Aid Protocols** (e.g. choking, burns, CPR) ➔ Actionable step-by-step guidance.
  - 🛡️ **Out-of-Domain Queries** ➔ Safe, non-alarmist healthcare assessment advice.
- 🔍 **Judge & Developer Verification Panel:** Expandable real-time telemetry card displaying exact Moss query timing, baseline comparisons, and safety gate decisions.
- 📊 **Zero-Simulation Telemetry:** Honest timers using Python `time.perf_counter()`.

---

## 🏗️ System Architecture

```text
                     USER INPUT
         (Voice via Web Speech API  OR  Typed Emergency)
                          │
                          ▼
            [ Next.js 16 App Router UI ]
                          │  HTTP POST /api/v1/emergency
                          ▼
             [ FastAPI Backend Engine ]
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
[ 1. Primary: Moss Semantic Search ]   [ 2. Baseline Comparison ]
   Index: golden-minute-emergency        Keyword / Token Match
   Options: top_k=1, alpha=0.8           Measured side-by-side
   Latency: ~0.65 ms (Sub-10ms)
         │
         ▼
[ 3. Strict Safety & Relevance Gate ]
   • Check review_status == "approved_for_demo"
   • Authoritative Source & URL integrity
   • Semantic Relevance Threshold (>= 0.30)
         │
         ▼
[ 4. Symptom-Aware Triage Engine ]
   • Red-Flag Warning Signs Detection
   • Clarifying Questions Generation
         │
    Passed? ────────── No ──────────► [ Safe Deterministic Fallback ]
         │                              • National Helpline (112)
        Yes                             • Non-alarmist guidance
         │
         ▼
[ 5. Verified Guidance & Audio Delivery ]
   • Actionable numbered protocol steps
   • Authoritative source attribution (Red Cross / CDC / WHO / AHA)
   • Hands-free TTS voice read-aloud
```

---

## 📚 Supported Emergency Protocols & Sources

All protocols are curated directly from authoritative public health bodies:

| Protocol Category | Scenario | Authoritative Source |
| :--- | :--- | :--- |
| **Choking** | Adult & Child Choking Relief | International Federation of Red Cross (IFRC) |
| **Severe Bleeding** | Direct Pressure & Tourniquet Use | American Red Cross / Stop The Bleed |
| **Thermal Burns** | First & Second-Degree Burn Cooling | World Health Organization (WHO) |
| **Unconsciousness** | Unresponsive Recovery Position | British Red Cross / Resuscitation Council UK |
| **Breathing Emergency** | Asthma Attack & Inhaler Protocol | Asthma + Lung UK Guidelines |
| **Cardiac Arrest** | Adult CPR & AED Administration | American Heart Association (AHA) |
| **Seizure** | Convulsions & Seizure Safety | CDC & Epilepsy Foundation |
| **Stroke** | Suspected Stroke (F.A.S.T.) Assessment | American Stroke Association / AHA |
| **Anaphylaxis** | Severe Allergic Reaction & EpiPen | AAAAI / American Red Cross |
| **Head Injury** | Concussion, Trauma & Severe Headache | American Red Cross & CDC Heads Up |
| **Fever Assessment** | Fever Triage & Red-Flag Clarification | CDC & NHS Clinical Guidelines |

---

## ⚡ Live Telemetry & Benchmark Comparison

Unlike traditional RAG systems that introduce 800ms–2000ms database roundtrips, GOLDEN MINUTE uses in-memory Moss vector execution:

| Operation Stage | Average Measured Latency |
| :--- | :--- |
| **🧠 Moss Context Retrieval** | **`0.65 ms – 8.26 ms`** *(Strictly <10ms)* |
| **💻 Local Baseline Search** | **`0.70 ms – 2.50 ms`** |
| **🛡️ Safety Gate & Symptom Triage** | **`< 0.50 ms`** |
| **⏱️ Total Server Pipeline** | **`2.10 ms – 11.50 ms`** |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js 18+** and `npm`
- **Moss Account & Project:** Sign up at [portal.usemoss.dev](https://portal.usemoss.dev)

---

### 2. Backend Installation & Setup

```bash
# 1. Open terminal and navigate to backend
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Configure Environment Variables
# Copy example env file
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
MOSS_PROJECT_ID=your_moss_project_id_here
MOSS_PROJECT_KEY=your_moss_project_key_here
MOSS_INDEX_NAME=golden-minute-emergency
RELEVANCE_THRESHOLD=0.30
ENVIRONMENT=development
```

```bash
# 4. Sync approved emergency protocols to your Moss Cloud index
python scripts/sync_moss_index.py

# 5. Run the automated test suite (23 passing tests)
pytest tests/ -v

# 6. Start the FastAPI server
python -m uvicorn app.main:app --port 8000 --host 127.0.0.1
```
*Backend runs at: `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`)*

---

### 3. Frontend Installation & Setup

```bash
# 1. In a new terminal, navigate to frontend
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```
*Frontend runs at: `http://localhost:3000`*

---

## 🧪 Testing the Core Flows

### A. Life-Threatening Emergency (Zero-Latency Guidance)
1. Type or speak: *"Someone is choking"*
2. Observe Moss retrieval duration (`<10 ms`) and verified Red Cross choking protocol.
3. Click **"Read Aloud"** to trigger voice guidance.

### B. Non-Emergency Symptom Triage (Clarification)
1. Type or speak: *"Fever"*
2. System identifies an isolated symptom without red flags.
3. Displays **`Non-Emergency Symptom Triage`** with 4 essential clarifying questions (temperature, duration, age, red flags).

### C. Red-Flag Symptom Escalation
1. Type: *"Fever with confusion and difficulty breathing"*
2. System immediately detects neurological and respiratory red flags.
3. Escalates to **`Emergency Escalation Required`** directing immediate contact with **112**.

### D. Live Diagnostic Script
Run the automated tracer against all edge cases:
```bash
python backend/scripts/diagnose_queries.py
```

---

## 📁 Repository Structure

```text
golden-minute/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app & lifespan index loader
│   │   ├── moss_retrieval.py    # Official Moss SDK client & query caching
│   │   ├── symptom_triage.py    # Symptom classification & red-flag detection
│   │   ├── safety_gate.py       # 10-point medical safety & relevance validator
│   │   ├── retrieval.py         # Baseline token search for side-by-side benchmarking
│   │   ├── fallback.py          # Deterministic 112 emergency fallback handler
│   │   ├── models.py            # Pydantic schemas (EmergencyRequest / Response)
│   │   └── config.py            # Environment configuration
│   ├── data/
│   │   └── knowledge_base.json  # 11 approved, source-linked medical protocols
│   ├── scripts/
│   │   ├── sync_moss_index.py   # Moss cloud index synchronization
│   │   ├── diagnose_queries.py  # Diagnostic request tracer
│   │   └── verify_all_scenarios.py
│   └── tests/                   # 23 automated pytest test cases
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Main copilot dashboard & auto-scroller
│   │   └── layout.tsx
│   ├── components/
│   │   ├── EmergencyInput.tsx   # Voice & text input with quick scenario pills
│   │   ├── GuidanceCard.tsx     # Triage & emergency protocol display card
│   │   ├── MetricsPanel.tsx     # Sub-10ms Moss telemetry monitor
│   │   ├── DebugPanel.tsx       # Collapsible judge verification panel
│   │   ├── VoiceControls.tsx    # Web Speech STT & SpeechSynthesis TTS
│   │   └── EmergencyReminder.tsx
│   └── lib/
│       └── api.ts               # Type-safe backend client
└── README.md
```

---

## 🏆 Hackathon Compliance Checklist (YC × Moss Sprint)

- [x] **Moss is Mandatory:** Official `moss-1.13.0` SDK integrated in `backend/app/moss_retrieval.py`.
- [x] **Sub-10ms Context Retrieval:** Honest measured retrieval of `0.65 ms – 8.26 ms` using `time.perf_counter()`.
- [x] **No Mocked Data:** Real Moss cloud index `golden-minute-emergency` queried live.
- [x] **Safety-First Guardrails:** Independent medical safety gate blocking unapproved or hallucinated data.
- [x] **Symptom Triage:** Handles fever and headache safely with clarifying questions without premature emergency alarms.
- [x] **Accessible Voice Loop:** Speech-to-Text input and voice read-aloud output.
- [x] **Deterministic Fallback:** Directs to National Helpline (112) when queries lack verified protocols.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
