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

    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,https://frontend-orpin-chi-47.vercel.app"

    @property
    def cors_origins_list(self) -> list[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def effective_llm_api_key(self) -> str:
        return self.LLM_API_KEY or self.GEMINI_API_KEY or self.OPENAI_API_KEY

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
