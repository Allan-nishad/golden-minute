from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "golden-minute-backend"


def test_status_endpoint():
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert "baseline_available" in data
    assert "moss_configured" in data
    assert "moss_available" in data
    assert "llm_configured" in data
    assert "supported_categories" in data
    assert "choking" in data["supported_categories"]
    assert "bleeding" in data["supported_categories"]
