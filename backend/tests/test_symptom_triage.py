import pytest
from app.models import KnowledgeBaseRecord
from app.symptom_triage import evaluate_symptom_triage

@pytest.fixture
def fever_record():
    return KnowledgeBaseRecord(
        id="protocol-fever-management",
        title="Fever Assessment & Red-Flag Triage Guidelines",
        category="fever_symptom",
        keywords=["fever", "high temperature"],
        content="Stay hydrated and rest.",
        source_name="CDC Guidelines",
        source_url="https://cdc.gov",
        review_status="approved_for_demo",
        language="en"
    )

@pytest.fixture
def choking_record():
    return KnowledgeBaseRecord(
        id="protocol-choking-adult",
        title="Adult Choking First Aid Protocol",
        category="choking",
        keywords=["choking", "cannot breathe"],
        content="Give 5 back blows.",
        source_name="Red Cross",
        source_url="https://redcross.org",
        review_status="approved_for_demo",
        language="en"
    )

def test_mild_fever_triage_clarification(fever_record):
    res = evaluate_symptom_triage("Fever", fever_record, safety_passed=True)
    assert res["interaction_type"] == "clarification"
    assert len(res["clarifying_questions"]) > 0
    assert len(res["warning_signs_detected"]) == 0

def test_fever_with_red_flags_triage_emergency(fever_record):
    res = evaluate_symptom_triage("Fever with confusion and difficulty breathing", fever_record, safety_passed=True)
    assert res["interaction_type"] == "emergency"
    assert len(res["warning_signs_detected"]) >= 2
    assert "Altered mental status or acute confusion" in res["warning_signs_detected"]

def test_acute_choking_triage_emergency(choking_record):
    res = evaluate_symptom_triage("Someone is choking", choking_record, safety_passed=True)
    assert res["interaction_type"] == "emergency"

def test_fallback_when_safety_fails():
    res = evaluate_symptom_triage("Random query", None, safety_passed=False)
    assert res["interaction_type"] == "fallback"
