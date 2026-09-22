# ⚡ GOLDEN MINUTE — Backend Service Architecture
### Zero-Latency Semantic Retrieval & Safety-Gated Medical Triage Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python 3.14+](https://img.shields.io/badge/Python-3.14+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Moss Zero-Latency](https://img.shields.io/badge/Moss-Sub--10ms_Engine-8B5CF6?style=for-the-badge&logo=fastapi&logoColor=white)](https://portal.usemoss.dev)
[![Pytest](https://img.shields.io/badge/Tests-23%2F23%20Passing-10B981?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org)
[![Pydantic v2](https://img.shields.io/badge/Pydantic-v2_Enforced-E92063?style=for-the-badge&logo=pydantic&logoColor=white)](https://pydantic.dev)

> 🛡️ **Medical Disclaimer:**  
> GOLDEN MINUTE is an educational prototype and hackathon research demonstration. It does **not** provide autonomous clinical diagnoses. In genuine emergencies, call national emergency dispatch immediately (**112** in India; **911** in the US).

---

## 🧭 System Overview

The **GOLDEN MINUTE Backend** is a high-throughput, low-latency API designed for real-time emergency guidance. Built on **FastAPI** and the **Official Moss SDK (`moss-1.13.0`)**, it retrieves certified first-aid protocols in **`<10ms`** (`0.65ms` warmed) and applies a strict **10-Point Medical Safety Gate** and **Symptom Triage Engine** before serving guidance.

```
                      INCOMING EMERGENCY QUERY
             POST /api/v1/emergency  { "query": "..." }
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                 FastAPI Request Pipeline                  │
  │     (Latency tracking start: time.perf_counter())        │
  └─────────────────────────────┬─────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│   [PRIMARY] Moss Retrieval    │       │     [BASELINE] Comparison     │
│   • Index: golden-minute-     │       │   • Deterministic token /     │
│     emergency                 │       │     keyword scoring engine    │
│   • Options: top_k=1, a=0.8   │       │   • Measured side-by-side     │
│   • Sub-10ms in-memory scan   │       │     for transparent bench     │
└───────────────┬───────────────┘       └───────────────┬───────────────┘
                │                                       │
                └───────────────────┬───────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                 [SAFETY GATE] 10-Point Validation                     │
│  1. Check review_status == "approved_for_demo"                        │
│  2. Verify authoritative source name & HTTPS URL integrity           │
│  3. Verify non-empty clinical guidance content                        │
│  4. Enforce supported category bounds                                 │
│  5. Validate semantic relevance threshold (score >= 0.30)             │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│              [SYMPTOM TRIAGE] Non-Diagnostic Classification          │
│  • Red-Flag Emergency Escalation (e.g. fever + confusion) ➔ 112       │
│  • Non-Urgent Symptom Clarification (e.g. fever, headache)           │
│  • Approved Protocol Guidance (e.g. choking, burns, CPR)              │
│  • Out-of-Domain Fallback Guard                                       │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    Structured JSON Response Payload                   │
│  • interaction_type ("emergency" | "clarification" | "guidance")      │
│  • clarifying_questions []  &  warning_signs_detected []             │
│  • Verified authoritative source metadata                             │
│  • Measured latency telemetry breakdown (Moss vs Baseline ms)         │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Core Module Breakdown

| Module File | Responsibility | Key Features |
| :--- | :--- | :--- |
| [`app/main.py`](file:///c:/Users/allan/Documents/Projects/golden-minute/backend/app/main.py) | **API Router & Orchestrator** | Asynchronous lifespan handler, CORS middleware, timing telemetry, error handling. |
| [`app/moss_retrieval.py`](file:///c:/Users/allan/Documents/Projects/golden-minute/backend/app/moss_retrieval.py) | **Moss Zero-Latency Client** | In-memory index caching, pre-warmed vector sessions, real `perf_counter()` timing. |
| [`app/symptom_triage.py`](file:///c:/Users/allan/Documents/Projects/golden-minute/backend/app/symptom_triage.py) | **Symptom Triage & Red-Flag Engine** | Deterministic red-flag detection, clarifying questions generation (CDC / NHS). |
| [`app/safety_gate.py`](file:///c:/Users/allan/Documents/Projects/golden-minute/backend/app/safety_gate.py) | **Medical Safety Gate** | Rejection of unapproved/draft records, URL integrity check, relevance validation. |
| [`app/retrieval.py`](file:///c:/Users/allan/Documents/Projects/golden-minute/backend/app/retrieval.py) | **Local Baseline Search** | Transparent tokenized keyword matching for side-by-side benchmark comparison. |
| [`app/fallback.py`](file:///c:/Users/allan/Documents/Projects/golden-minute/backend/app/fallback.py) | **Deterministic Fallback** | Safe, calm advisory routing to National Emergency Helpline (**112**). |
| [`app/models.py`](file:///c:/Users/allan/Documents/Projects/golden-minute/backend/app/models.py) | **Pydantic Schemas** | Strict type contracts for requests, responses, telemetry, and metadata. |
| [`data/knowledge_base.json`](file:///c:/Users/allan/Documents/Projects/golden-minute/backend/data/knowledge_base.json) | **Certified Medical Protocols** | 11 approved, source-linked protocols (Red Cross, WHO, AHA, CDC, NHS, AAAAI). |

---

## 🔌 API Reference & Contracts

### 1. `POST /api/v1/emergency` — Emergency Guidance & Triage Pipeline

Submits an emergency description or symptom query.

#### Request Body
```json
{
  "query": "Someone is choking on food and cannot breathe",
  "language": "en",
  "use_moss": true,
  "use_llm": false
}
```

#### Response Example: Acute Emergency (`interaction_type = "emergency"`)
```json
{
  "guidance": "1. Verify if the person can speak, cough, or breathe...\n2. Give up to 5 sharp back blows between shoulder blades...\n3. Perform up to 5 inward/upward abdominal thrusts...",
  "protocol_category": "choking",
  "source": {
    "name": "International Federation of Red Cross (IFRC)",
    "url": "https://www.ifrc.org/our-work/disaster-preparedness/first-aid",
    "title": "Adult Choking First Aid Protocol",
    "protocol_id": "protocol-choking-adult"
  },
  "safety_status": "validated",
  "retrieval_engine": "moss",
  "validation_reason": "validation_passed",
  "interaction_type": "emergency",
  "clarifying_questions": [],
  "warning_signs_detected": [
    "Acute airway obstruction / choking",
    "Inability to breathe or severe airway compromise"
  ],
  "metrics": {
    "baseline_retrieval_ms": 0.85,
    "moss_retrieval_ms": 0.65,
    "llm_formatting_ms": null,
    "backend_total_ms": 1.45
  },
  "emergency_reminder": "If this is a real emergency, contact local emergency services immediately. In India, call 112.",
  "safety_notice": "Prototype guidance only. Do not delay professional emergency assistance."
}
```

#### Response Example: Non-Emergency Symptom Triage (`interaction_type = "clarification"`)
```json
{
  "guidance": "1. Ensure hydration with small, frequent sips of water...\n2. Dress in lightweight clothing...\n3. Monitor temperature with a thermometer...\n4. Red Flags: Infants <3 months, stiff neck, or breathing difficulty.",
  "protocol_category": "fever_symptom",
  "source": {
    "name": "CDC & NHS Clinical Guidelines on Fever",
    "url": "https://www.cdc.gov/flu/treatment/treatment.htm",
    "title": "Fever Assessment & Red-Flag Triage Guidelines",
    "protocol_id": "protocol-fever-management"
  },
  "safety_status": "validated",
  "retrieval_engine": "moss",
  "validation_reason": "validation_passed",
  "interaction_type": "clarification",
  "clarifying_questions": [
    "What is the measured body temperature (if a thermometer is available)?",
    "How many days has the fever lasted?",
    "What is the person's age group (especially if an infant under 3 months or an older adult)?",
    "Are there any red flags such as confusion, stiff neck, shortness of breath, or a new rash?"
  ],
  "warning_signs_detected": [],
  "metrics": {
    "baseline_retrieval_ms": 1.10,
    "moss_retrieval_ms": 8.26,
    "llm_formatting_ms": null,
    "backend_total_ms": 9.75
  },
  "emergency_reminder": "If this is a real emergency, contact local emergency services immediately. In India, call 112.",
  "safety_notice": "Prototype guidance only. Do not delay professional emergency assistance."
}
```

---

### 2. `GET /api/v1/status` — System Diagnostics & Capability Probe

Returns verified engine capabilities, Moss connectivity, and active categories.

```json
{
  "baseline_available": true,
  "moss_configured": true,
  "moss_available": true,
  "llm_configured": false,
  "supported_categories": [
    "allergic_reaction",
    "bleeding",
    "breathing_emergency",
    "burns",
    "choking",
    "fever_symptom",
    "general_emergency",
    "head_injury",
    "seizure",
    "stroke",
    "unconsciousness"
  ],
  "environment": "development"
}
```

### 3. `GET /health` — Liveness Check
```json
{
  "status": "ok",
  "service": "golden-minute-backend"
}
```

---

## ⚙️ Environment Variables Configuration

Create a `.env` file inside `backend/`:

```env
# Moss Developer Portal Credentials (https://portal.usemoss.dev)
MOSS_PROJECT_ID=your_moss_project_id_here
MOSS_PROJECT_KEY=your_moss_project_key_here
MOSS_INDEX_NAME=golden-minute-emergency

# Safety & Relevance Gating Thresholds
RELEVANCE_THRESHOLD=0.30

# Environment Settings
ENVIRONMENT=development
PORT=8000
```

---

## 🚀 Development & Operational Guide

### 1. Setup Virtual Environment & Dependencies
```bash
# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Sync Knowledge Base to Moss Cloud Index
```bash
python scripts/sync_moss_index.py
```

### 3. Run Automated Pytest Suite (23 Tests)
```bash
pytest tests/ -v
```

### 4. Start High-Performance Uvicorn Server
```bash
python -m uvicorn app.main:app --port 8000 --host 127.0.0.1 --reload
```
- API Base: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

### 5. Run Live Diagnostic Query Tracer
```bash
python scripts/diagnose_queries.py
```
Outputs live sub-10ms timing traces across all emergency categories and symptom triage flows.
