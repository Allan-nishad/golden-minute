import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    MOSS_PROJECT_ID: str = ""
    MOSS_PROJECT_KEY: str = ""
    MOSS_INDEX_NAME: str = "golden-minute-emergency"
    
    # LLM Gateway Settings (Hackathon Gemini Gateway / OpenAI-compatible endpoint)
    LLM_BASE_URL: str = "https://llm.hidevs.xyz/v1"
    LLM_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gemini-3.5-flash-lite"
    
    ENABLE_MOSS: bool = False
    ENABLE_LLM: bool = False
    
    # Path to local knowledge base JSON
    DATA_DIR: Path = Path(__file__).resolve().parent.parent / "data"
    KNOWLEDGE_BASE_PATH: Path = DATA_DIR / "knowledge_base.json"

    # Relevance threshold for baseline retrieval (0.0 to 1.0)
    RELEVANCE_THRESHOLD: float = 0.15

    @property
    def effective_llm_api_key(self) -> str:
        return self.LLM_API_KEY or self.GEMINI_API_KEY or self.OPENAI_API_KEY

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
