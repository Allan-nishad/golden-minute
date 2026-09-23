import pytest
from unittest.mock import MagicMock, patch
from app.llm_formatter import LLMFormatter, SYSTEM_PROMPT
from app.config import settings


def test_llm_formatter_disabled_by_default():
    formatter = LLMFormatter()
    # When not configured or disabled, format_content returns original text and None
    text, elapsed = formatter.format_content("1. Perform CPR.\n2. Call 112.")
    assert text == "1. Perform CPR.\n2. Call 112."


def test_llm_formatter_success(monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_LLM", True)
    monkeypatch.setattr(settings, "LLM_API_KEY", "sk-test-virtual-key")
    monkeypatch.setattr(settings, "LLM_BASE_URL", "https://llm.hidevs.xyz/v1")
    monkeypatch.setattr(settings, "LLM_MODEL", "gemini-3.5-flash-lite")

    formatter = LLMFormatter()
    assert formatter.is_configured is True
    assert formatter.is_available() is True

    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "choices": [
            {
                "message": {
                    "content": "Step 1: Check airway.\nStep 2: Give rescue breaths."
                }
            }
        ]
    }

    with patch.object(formatter.client, "post", return_value=mock_resp) as mock_post:
        formatted, elapsed = formatter.format_content("Check airway, give rescue breaths", "en")
        assert formatted == "Step 1: Check airway.\nStep 2: Give rescue breaths."
        assert elapsed is not None
        assert elapsed >= 0.0

        mock_post.assert_called_once()
        call_args, call_kwargs = mock_post.call_args
        assert call_args[0] == "/chat/completions"
        assert call_kwargs["json"]["model"] == "gemini-3.5-flash-lite"
        assert len(call_kwargs["json"]["messages"]) == 2


def test_llm_formatter_fallback_on_error(monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_LLM", True)
    monkeypatch.setattr(settings, "LLM_API_KEY", "sk-test-virtual-key")

    formatter = LLMFormatter()
    mock_resp = MagicMock()
    mock_resp.status_code = 500
    mock_resp.text = "Internal Server Error"

    with patch.object(formatter.client, "post", return_value=mock_resp):
        formatted, elapsed = formatter.format_content("Raw approved content", "en")
        assert formatted == "Raw approved content"
        assert elapsed is not None


def test_llm_formatter_fallback_on_exception(monkeypatch):
    monkeypatch.setattr(settings, "ENABLE_LLM", True)
    monkeypatch.setattr(settings, "LLM_API_KEY", "sk-test-virtual-key")

    formatter = LLMFormatter()

    with patch.object(formatter.client, "post", side_effect=Exception("Connection timeout")):
        formatted, elapsed = formatter.format_content("Original text", "en")
        assert formatted == "Original text"
        assert elapsed is not None
