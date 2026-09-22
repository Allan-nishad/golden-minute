import json
import re
from pathlib import Path
from typing import List, Optional, Dict, Any
from app.models import KnowledgeBaseRecord
from app.config import settings


def tokenize(text: str) -> List[str]:
    """Simple lowercase alphanumeric tokenization."""
    return re.findall(r"\b[a-z0-9]+\b", text.lower())


class BaselineRetriever:
    """Transparent, deterministic keyword and token relevance scoring retriever."""

    def __init__(self, data_path: Optional[Path] = None):
        self.data_path = data_path or settings.KNOWLEDGE_BASE_PATH
        self.records: List[KnowledgeBaseRecord] = []
        self.reload()

    def reload(self) -> None:
        """Loads and parses the knowledge base file."""
        if not self.data_path.exists():
            self.records = []
            return

        with open(self.data_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            self.records = [KnowledgeBaseRecord(**item) for item in raw_data]

    def get_approved_records(self) -> List[KnowledgeBaseRecord]:
        """Returns only approved records."""
        return [r for r in self.records if r.review_status == "approved_for_demo"]

    def get_supported_categories(self) -> List[str]:
        """Returns list of distinct approved categories."""
        return sorted(list({r.category for r in self.get_approved_records()}))

    def calculate_relevance(self, query: str, record: KnowledgeBaseRecord) -> float:
        """
        Calculates a transparent relevance score [0.0 - 1.0] based on query token matches
        across keywords, category, title, and body content.
        """
        q_tokens = set(tokenize(query))
        if not q_tokens:
            return 0.0

        score = 0.0
        max_possible = len(q_tokens) * 4.0  # Max potential weight per query token

        title_tokens = set(tokenize(record.title))
        category_tokens = set(tokenize(record.category))
        
        # Flatten keywords into individual tokens
        keyword_tokens = set()
        for kw in record.keywords:
            keyword_tokens.update(tokenize(kw))

        content_tokens = set(tokenize(record.content))

        # Check full query phrase in keywords
        clean_q = query.lower().strip()
        for kw in record.keywords:
            if kw.lower() in clean_q or clean_q in kw.lower():
                score += 3.0

        for token in q_tokens:
            if token in category_tokens:
                score += 4.0
            elif token in keyword_tokens:
                score += 3.0
            elif token in title_tokens:
                score += 2.0
            elif token in content_tokens:
                score += 1.0

        normalized_score = min(score / max(max_possible, 1.0), 1.0)
        return round(normalized_score, 4)

    def retrieve(self, query: str) -> Dict[str, Any]:
        """
        Searches approved records and returns the best candidate with its score.
        """
        approved_records = self.get_approved_records()
        if not approved_records:
            return {"record": None, "score": 0.0, "engine": "baseline"}

        best_record: Optional[KnowledgeBaseRecord] = None
        best_score = 0.0

        for record in approved_records:
            score = self.calculate_relevance(query, record)
            if score > best_score:
                best_score = score
                best_record = record

        if best_record and best_score >= settings.RELEVANCE_THRESHOLD:
            return {
                "record": best_record,
                "score": best_score,
                "engine": "baseline"
            }

        return {
            "record": None,
            "score": best_score,
            "engine": "baseline"
        }


# Global baseline retriever instance
baseline_retriever = BaselineRetriever()
