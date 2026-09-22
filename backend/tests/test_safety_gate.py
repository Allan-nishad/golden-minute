from app.models import KnowledgeBaseRecord
from app.safety_gate import evaluate_safety_gate


def get_valid_record():
    return KnowledgeBaseRecord(
        id="test-valid",
        title="Valid Test Protocol",
        category="choking",
        keywords=["choking"],
        content="Step 1: Perform back blows.",
        source_name="Official Health Service",
        source_url="https://health.org/firstaid",
        review_status="approved_for_demo",
        language="en"
    )


def test_safety_gate_valid_record():
    record = get_valid_record()
    res = evaluate_safety_gate(record, score=0.8)
    assert res["passed"] is True
    assert res["reason_code"] == "validation_passed"
    assert res["record"] == record


def test_safety_gate_pending_review_fails():
    record = get_valid_record()
    record.review_status = "pending_review"
    res = evaluate_safety_gate(record, score=0.8)
    assert res["passed"] is False
    assert res["reason_code"] == "not_approved"


def test_safety_gate_missing_source_fails():
    record = get_valid_record()
    record.source_name = ""
    res = evaluate_safety_gate(record, score=0.8)
    assert res["passed"] is False
    assert res["reason_code"] == "missing_source"

    record = get_valid_record()
    record.source_url = ""
    res = evaluate_safety_gate(record, score=0.8)
    assert res["passed"] is False
    assert res["reason_code"] == "missing_source"


def test_safety_gate_missing_content_fails():
    record = get_valid_record()
    record.content = "   "
    res = evaluate_safety_gate(record, score=0.8)
    assert res["passed"] is False
    assert res["reason_code"] == "missing_content"


def test_safety_gate_low_relevance_fails():
    record = get_valid_record()
    res = evaluate_safety_gate(record, score=0.05, threshold=0.15)
    assert res["passed"] is False
    assert res["reason_code"] == "low_relevance"


def test_safety_gate_unsupported_category_fails():
    record = get_valid_record()
    record.category = "crypto_trading"
    res = evaluate_safety_gate(record, score=0.8)
    assert res["passed"] is False
    assert res["reason_code"] == "unsupported_category"
