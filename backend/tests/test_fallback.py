from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_emergency_empty_query_rejected():
    response = client.post("/api/v1/emergency", json={"query": "   "})
    assert response.status_code == 422


def test_emergency_too_long_query_rejected():
    long_text = "a" * 501
    response = client.post("/api/v1/emergency", json={"query": long_text})
    assert response.status_code == 422


def test_emergency_fallback_for_unknown_query():
    response = client.post("/api/v1/emergency", json={"query": "how do I bake sourdough bread?"})
    assert response.status_code == 200
    data = response.json()
    assert data["safety_status"] == "fallback"
    assert data["retrieval_engine"] == "fallback"
    assert "112" in data["emergency_reminder"]
    assert data["metrics"]["backend_total_ms"] > 0


def test_emergency_valid_query_choking():
    response = client.post("/api/v1/emergency", json={"query": "someone is choking"})
    assert response.status_code == 200
    data = response.json()
    assert data["safety_status"] == "validated"
    assert data["protocol_category"] == "choking"
    assert data["retrieval_engine"] in ["baseline", "moss"]
    assert "back blows" in data["guidance"].lower()
    assert data["source"]["name"] != ""
    assert data["source"]["url"].startswith("http")
    assert data["metrics"]["backend_total_ms"] > 0
