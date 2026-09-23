import time
import logging
from typing import Optional, Tuple
from app.config import settings

logger = logging.getLogger("llm_formatter")

SYSTEM_PROMPT = """You are a formatting assistant for an emergency guidance display.
You must ONLY reformat the approved source content provided below.
Rules:
1. Do not add, remove, invent, infer, or modify medical instructions.
2. Do not diagnose the user.
3. Do not claim certainty.
4. Keep the wording clear, concise, calm, and step-by-step.
5. If the source content is already clear, return it cleanly formatted without adding extra claims.
"""


class LLMFormatter:
    """
    Strict formatting-only LLM wrapper for the Hackathon Gemini Gateway (https://llm.hidevs.xyz/v1).
    Accepts OpenAI-compatible chat completions requests with models like:
      - gemini-3.5-flash-lite (default)
      - gemini-3.5-flash
      - gemini-3.6-flash
    Never invents new medical steps; operates strictly on approved text.
    """

    def __init__(self):
        self.api_key = settings.effective_llm_api_key
        self.base_url = settings.LLM_BASE_URL.rstrip("/")
        self.model = settings.LLM_MODEL
        self.is_configured = bool(settings.ENABLE_LLM and self.api_key)
        self.client = None
        self._init_client()

    def _init_client(self) -> None:
        if not self.is_configured:
            return
        try:
            import httpx
            self.client = httpx.Client(
                base_url=self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                timeout=4.0  # Strict timeout for emergency latency bounds
            )
            logger.info(f"Gemini LLM client initialized: base_url={self.base_url}, model={self.model}")
        except Exception as e:
            logger.warning(f"Failed to initialize LLM client: {e}")
            self.client = None

    def is_available(self) -> bool:
        return self.is_configured and self.client is not None

    def format_content(self, approved_content: str, language: str = "en") -> Tuple[str, Optional[float]]:
        """
        Formats approved content using LLM if available.
        Returns (formatted_text, elapsed_ms).
        Falls back to raw approved_content if LLM is disabled or fails.
        """
        if not self.is_available():
            return approved_content, None

        start = time.perf_counter()
        try:
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": f"Language: {language}\n\nApproved source content:\n{approved_content}"
                    }
                ],
                "temperature": 0.0,
                "max_tokens": 300
            }
            response = self.client.post("/chat/completions", json=payload)
            elapsed_ms = (time.perf_counter() - start) * 1000.0

            if response.status_code == 200:
                data = response.json()
                choices = data.get("choices", [])
                if choices and "message" in choices[0]:
                    formatted_text = choices[0]["message"].get("content", "").strip()
                    return formatted_text or approved_content, round(elapsed_ms, 2)
            
            logger.warning(
                f"LLM API call returned status {response.status_code}: {response.text[:200]}. "
                "Falling back to approved content."
            )
            return approved_content, round(elapsed_ms, 2)
        except Exception as e:
            elapsed_ms = (time.perf_counter() - start) * 1000.0
            logger.warning(f"LLM formatting failed or timed out: {e}. Falling back to raw approved content.")
            return approved_content, round(elapsed_ms, 2)


llm_formatter = LLMFormatter()
