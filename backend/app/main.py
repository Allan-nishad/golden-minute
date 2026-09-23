import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import (
    EmergencyRequest,
    EmergencyResponse,
    HealthResponse,
    StatusResponse,
    SourceMetadata,
    LatencyMetrics
)
from app.retrieval import baseline_retriever
from app.moss_retrieval import moss_retriever
from app.safety_gate import evaluate_safety_gate
from app.symptom_triage import evaluate_symptom_triage
from app.fallback import get_fallback_response
from app.llm_formatter import llm_formatter
from app.metrics import Timer


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes and pre-loads the Moss index on application startup."""
    if moss_retriever.is_available():
        await moss_retriever.ensure_index_loaded()
    yield


app = FastAPI(
    title="GOLDEN MINUTE API",
    description="Real-Time Voice Emergency Guidance Copilot — Safety-First Prototype (Moss Retrieval Layer)",
    version="0.1.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend and Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse, tags=["System"])
def health_check():
    """Health check endpoint confirming service status."""
    return HealthResponse(status="ok", service="golden-minute-backend")


@app.get("/api/v1/status", response_model=StatusResponse, tags=["System"])
def system_status():
    """Returns actual runtime capabilities and verified configuration state."""
    return StatusResponse(
        baseline_available=len(baseline_retriever.get_approved_records()) > 0,
        moss_configured=moss_retriever.is_configured,
        moss_available=moss_retriever.is_available(),
        llm_configured=llm_formatter.is_configured,
        supported_categories=baseline_retriever.get_supported_categories(),
        environment=settings.ENVIRONMENT
    )


@app.post("/api/v1/emergency", response_model=EmergencyResponse, tags=["Emergency Guidance"])
async def handle_emergency_query(payload: EmergencyRequest):
    """
    Main emergency guidance pipeline:
    1. Input validation
    2. PRIMARY RETRIEVAL: Moss index search (using official Moss SDK)
    3. Secondary/Comparison: Transparent baseline search if Moss unconfigured
    4. Strict Safety & Relevance Gating (rejects unapproved or unverified protocols)
    5. Formatting (Optional LLM formatter or clean raw approved protocol)
    6. Deterministic Fallback if validation fails (directs to 112)
    """
    total_timer = Timer().start()
    
    baseline_ms = None
    moss_ms = None
    llm_ms = None
    
    candidate_record = None
    retrieval_score = 0.0
    active_engine = "fallback"

    approved_records = baseline_retriever.get_approved_records()

    # ALWAYS MEASURE BASELINE SEARCH (for transparent latency & relevance comparison)
    base_timer = Timer().start()
    baseline_result = baseline_retriever.retrieve(payload.query)
    baseline_ms = base_timer.stop()

    # STEP 1: PRIMARY RETRIEVAL VIA MOSS (if configured)
    if payload.use_moss and moss_retriever.is_available():
        moss_result = await moss_retriever.retrieve(payload.query, approved_records)
        moss_ms = moss_result.get("moss_ms")
        if moss_result.get("record"):
            candidate_record = moss_result["record"]
            retrieval_score = moss_result["score"]
            active_engine = "moss"

    # STEP 2: BASELINE CANDIDATE (used if Moss returned no candidate or was toggled off)
    if candidate_record is None:
        if baseline_result.get("record"):
            candidate_record = baseline_result.get("record")
            retrieval_score = baseline_result.get("score", 0.0)
            active_engine = "baseline"

    # STEP 3: STRICT SAFETY GATE EVALUATION
    gate_result = evaluate_safety_gate(candidate_record, retrieval_score, query=payload.query)

    # STEP 4: SYMPTOM TRIAGE & RED-FLAG EVALUATION
    triage_result = evaluate_symptom_triage(
        query=payload.query,
        candidate_record=gate_result["record"] if gate_result["passed"] else None,
        safety_passed=gate_result["passed"]
    )

    if not gate_result["passed"]:
        total_ms = total_timer.stop()
        metrics = LatencyMetrics(
            baseline_retrieval_ms=round(baseline_ms, 2) if baseline_ms is not None else None,
            moss_retrieval_ms=round(moss_ms, 2) if moss_ms is not None else None,
            llm_formatting_ms=None,
            backend_total_ms=round(total_ms, 2)
        )
        return get_fallback_response(
            gate_result["reason_code"],
            metrics,
            interaction_type=triage_result["interaction_type"],
            warning_signs=triage_result["warning_signs_detected"]
        )

    # STEP 5: APPROVED GUIDANCE FORMATTING
    approved_record = gate_result["record"]
    final_guidance = approved_record.content

    if payload.use_llm and llm_formatter.is_available():
        formatted_text, llm_ms = llm_formatter.format_content(approved_record.content, payload.language)
        final_guidance = formatted_text

    total_ms = total_timer.stop()

    metrics = LatencyMetrics(
        baseline_retrieval_ms=round(baseline_ms, 2) if baseline_ms is not None else None,
        moss_retrieval_ms=round(moss_ms, 2) if moss_ms is not None else None,
        llm_formatting_ms=round(llm_ms, 2) if llm_ms is not None else None,
        backend_total_ms=round(total_ms, 2)
    )

    return EmergencyResponse(
        guidance=final_guidance,
        protocol_category=approved_record.category,
        source=SourceMetadata(
            name=approved_record.source_name,
            url=approved_record.source_url,
            title=approved_record.title,
            protocol_id=approved_record.id
        ),
        safety_status="validated",
        retrieval_engine=active_engine,
        validation_reason=gate_result["reason_code"],
        interaction_type=triage_result["interaction_type"],
        clarifying_questions=triage_result["clarifying_questions"],
        warning_signs_detected=triage_result["warning_signs_detected"],
        metrics=metrics,
        emergency_reminder="If this is a real emergency, contact local emergency services immediately. In India, call 112.",
        safety_notice="Prototype guidance only. Do not delay professional emergency assistance."
    )
