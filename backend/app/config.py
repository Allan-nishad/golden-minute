import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    MOSS_PROJECT_ID: str = ""
    MOSS_PROJECT_KEY: str = ""
    MOSS_INDEX_NAME: str = "golden-minute-emergency"
    OPENAI_API_KEY: str = ""
    ENABLE_MOSS: bool = False
    ENABLE_LLM: bool = False
    
    # Path to local knowledge base JSON
    DATA_DIR: Path = Path(__file__).resolve().parent.parent / "data"
    KNOWLEDGE_BASE_PATH: Path = DATA_DIR / "knowledge_base.json"

    # Relevance threshold for baseline retrieval (0.0 to 1.0)
    RELEVANCE_THRESHOLD: float = 0.15

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
