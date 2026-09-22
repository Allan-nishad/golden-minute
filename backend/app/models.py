from typing import List, Optional, Literal
from pydantic import BaseModel, Field, field_validator


class KnowledgeBaseRecord(BaseModel):
    id: str
    title: str
    category: str
    keywords: List[str] = Field(default_factory=list)
    content: str
    source_name: str
    source_url: str
    review_status: Literal["approved_for_demo", "pending_review", "rejected"]
    language: str = "en"
    last_reviewed: Optional[str] = None


class SourceMetadata(BaseModel):
    name: str
    url: str
    title: Optional[str] = None
    protocol_id: Optional[str] = None


class LatencyMetrics(BaseModel):
    baseline_retrieval_ms: Optional[float] = None
    moss_retrieval_ms: Optional[float] = None
    llm_formatting_ms: Optional[float] = None
    backend_total_ms: float


class EmergencyRequest(BaseModel):
    query: str = Field(..., description="Emergency query or user description")
    language: str = Field(default="en", description="ISO language code")
    use_moss: bool = Field(default=True, description="Attempt Moss retrieval if enabled/available")
    use_llm: bool = Field(default=False, description="Attempt LLM formatting if enabled/available")

    @field_validator("query")
    @classmethod
    def validate_query(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Query cannot be empty or only whitespace.")
        if len(trimmed) > 500:
            raise ValueError("Query exceeds maximum allowed length of 500 characters.")
        return trimmed


class EmergencyResponse(BaseModel):
    guidance: str
    protocol_category: str
    source: SourceMetadata
    safety_status: Literal["validated", "fallback"]
    retrieval_engine: Literal["baseline", "moss", "fallback"]
    validation_reason: str
    interaction_type: Literal["emergency", "clarification", "guidance", "fallback"] = "guidance"
    clarifying_questions: List[str] = Field(default_factory=list)
    warning_signs_detected: List[str] = Field(default_factory=list)
    metrics: LatencyMetrics
    emergency_reminder: str = "If this is a real emergency, contact local emergency services immediately. In India, call 112. Do not delay professional assistance while using this prototype."
    safety_notice: str = "Prototype guidance only. Do not delay professional emergency assistance."


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "golden-minute-backend"


class StatusResponse(BaseModel):
    baseline_available: bool
    moss_configured: bool
    moss_available: bool
    llm_configured: bool
    supported_categories: List[str]
    environment: str
