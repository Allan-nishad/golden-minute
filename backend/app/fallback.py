from typing import Optional, List
from app.models import EmergencyResponse, SourceMetadata, LatencyMetrics

FALLBACK_GENERAL_GUIDANCE = (
    "I could not verify an approved emergency protocol for this specific situation. "
    "Please consult a qualified healthcare professional for medical assessment. "
    "If you observe any red-flag symptoms or believe this may be an emergency, contact emergency services immediately (In India, dial 112)."
)

FALLBACK_EMERGENCY_ESCALATION = (
    "Potential critical emergency warning signs identified: {warning_list}. "
    "Please contact local emergency services immediately (In India, dial 112). "
    "Keep the person safe, calm, and do not delay professional emergency assistance."
)

FALLBACK_SOURCE = SourceMetadata(
    name="Emergency Services Dispatch Advisory",
    url="https://112.gov.in",
    title="National Emergency Helpline (112)",
    protocol_id="fallback-112"
)


def get_fallback_response(
    reason_code: str,
    metrics: LatencyMetrics,
    interaction_type: str = "fallback",
    warning_signs: Optional[List[str]] = None
) -> EmergencyResponse:
    """Returns a deterministic, safe, symptom-aware fallback response."""
    warnings = warning_signs or []

    if warnings:
        guidance = FALLBACK_EMERGENCY_ESCALATION.format(warning_list=", ".join(warnings))
        final_type = "emergency"
    else:
        guidance = FALLBACK_GENERAL_GUIDANCE
        final_type = "fallback"

    return EmergencyResponse(
        guidance=guidance,
        protocol_category="general_emergency",
        source=FALLBACK_SOURCE,
        safety_status="fallback",
        retrieval_engine="fallback",
        validation_reason=reason_code,
        interaction_type=final_type,
        clarifying_questions=[],
        warning_signs_detected=warnings,
        metrics=metrics,
        emergency_reminder="If this is a real emergency, contact local emergency services immediately. In India, call 112.",
        safety_notice="Prototype guidance only. Do not delay professional emergency assistance."
    )

