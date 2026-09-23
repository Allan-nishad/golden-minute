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


def test_cors_headers():
    # Test preflight request from Vercel frontend domain
    response = client.options(
        "/api/v1/emergency",
        headers={
            "Origin": "https://frontend-orpin-chi-47.vercel.app",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        }
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://frontend-orpin-chi-47.vercel.app"
    assert response.headers.get("access-control-allow-credentials") == "true"

