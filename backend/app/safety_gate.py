import re
from typing import Optional, Dict, Any, List
from app.models import KnowledgeBaseRecord
from app.config import settings

SUPPORTED_CATEGORIES = {
    "choking",
    "bleeding",
    "burns",
    "unconsciousness",
    "breathing_emergency",
    "general_emergency",
    "seizure",
    "stroke",
    "allergic_reaction",
    "head_injury",
    "fever_symptom",
}

# Known non-emergency intent keywords
NON_EMERGENCY_WORDS = {
    "joke", "riddle", "funny", "laugh", "recipe", "cake", "pasta", "pizza",
    "weather", "forecast", "game", "sports", "football", "cricket", "code",
    "python", "javascript", "song", "lyrics", "music", "movie", "film"
}

# General emergency tokens
GENERAL_EMERGENCY_TOKENS = {
    "help", "emergency", "urgent", "danger", "dying", "hurt", "injured",
    "accident", "save", "critical", "fallen", "fall", "collapse", "collapsed",
    "unresponsive", "breathing", "breathe", "blood", "choke", "choking",
    "burn", "burned", "fire", "scald", "wound", "cut", "faint", "fainted",
    "drowning", "shock", "pain", "attack", "cpr", "heart", "stroke", "seizure"
}


def tokenize(text: str) -> List[str]:
    return re.findall(r"\b[a-z0-9]+\b", text.lower())


def evaluate_safety_gate(
    candidate: Optional[KnowledgeBaseRecord],
    score: float,
    query: Optional[str] = None,
    threshold: Optional[float] = None
) -> Dict[str, Any]:
    """
    Evaluates candidate record against strict safety, approval, and relevance criteria.
    Never bypasses the gate.
    """
    min_score = threshold if threshold is not None else settings.RELEVANCE_THRESHOLD

    if candidate is None:
        return {
            "passed": False,
            "reason_code": "no_candidate",
            "record": None
        }

    if not isinstance(candidate, KnowledgeBaseRecord):
        return {
            "passed": False,
            "reason_code": "invalid_record",
            "record": None
        }

    # 1. Review status validation
    if candidate.review_status != "approved_for_demo":
        return {
            "passed": False,
            "reason_code": "not_approved",
            "record": None
        }

    # 2. Source validation
    if not candidate.source_name or not candidate.source_name.strip():
        return {
            "passed": False,
            "reason_code": "missing_source",
            "record": None
        }

    if not candidate.source_url or not candidate.source_url.strip() or not candidate.source_url.startswith("http"):
        return {
            "passed": False,
            "reason_code": "missing_source",
            "record": None
        }

    # 3. Content validation
    if not candidate.content or not candidate.content.strip():
        return {
            "passed": False,
            "reason_code": "missing_content",
            "record": None
        }

    # 4. Category validation
    if candidate.category not in SUPPORTED_CATEGORIES:
        return {
            "passed": False,
            "reason_code": "unsupported_category",
            "record": None
        }

    # 5. Relevance score threshold
    if score < min_score:
        return {
            "passed": False,
            "reason_code": "low_relevance",
            "record": None
        }

    # 6. Query semantic relevance verification (prevents false positives on out-of-domain queries)
    if query:
        q_tokens = set(tokenize(query))
        if any(w in q_tokens for w in NON_EMERGENCY_WORDS) and not any(w in q_tokens for w in GENERAL_EMERGENCY_TOKENS):
            return {
                "passed": False,
                "reason_code": "low_relevance",
                "record": None
            }

        # Check token relevance against candidate keywords/category/title
        record_tokens = set(tokenize(candidate.category))
        record_tokens.update(tokenize(candidate.title))
        for kw in candidate.keywords:
            record_tokens.update(tokenize(kw))

        has_direct_match = bool(q_tokens.intersection(record_tokens))
        has_general_emergency = bool(q_tokens.intersection(GENERAL_EMERGENCY_TOKENS))

        if not has_direct_match and not has_general_emergency:
            return {
                "passed": False,
                "reason_code": "low_relevance",
                "record": None
            }

    return {
        "passed": True,
        "reason_code": "validation_passed",
        "record": candidate
    }
