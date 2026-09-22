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
    Strict formatting-only LLM wrapper.
    Never invents new medical steps; operates strictly on approved text.
    """

    def __init__(self):
        self.is_configured = bool(settings.ENABLE_LLM and settings.OPENAI_API_KEY)
        self.client = None
        self._init_client()

    def _init_client(self) -> None:
        if not self.is_configured:
            return
        try:
            from openai import OpenAI  # type: ignore
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            logger.info("OpenAI client initialized for formatting.")
        except ImportError:
            logger.warning("OpenAI SDK not installed. LLM formatting disabled.")
            self.client = None
        except Exception as e:
            logger.warning(f"Failed to initialize OpenAI client: {e}")
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
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": f"Language: {language}\n\nApproved source content:\n{approved_content}"
                    }
                ],
                temperature=0.0,
                max_tokens=300,
                timeout=3.0  # Strict timeout for emergency latency bounds
            )
            elapsed_ms = (time.perf_counter() - start) * 1000.0
            formatted_text = response.choices[0].message.content.strip()
            return formatted_text or approved_content, round(elapsed_ms, 2)
        except Exception as e:
            elapsed_ms = (time.perf_counter() - start) * 1000.0
            logger.warning(f"LLM formatting failed or timed out: {e}. Falling back to raw approved content.")
            return approved_content, round(elapsed_ms, 2)


llm_formatter = LLMFormatter()
