"""
Symptom Triage & Red-Flag Escalation Engine for GOLDEN MINUTE.

CRITICAL SAFETY PRINCIPLES:
- Does NOT diagnose conditions.
- Uses conservative, deterministic, source-linked medical rules (CDC, NHS, WHO, NINDS).
- Distinguishes between immediate red-flag emergencies, non-urgent symptoms requiring clarification,
  and approved standard first-aid protocols.
- Prevents false-alarm panic while never suppressing critical escalation pathways.
"""

import re
from typing import Dict, Any, List, Optional
from app.models import KnowledgeBaseRecord

# Red-flag emergency indicators (strict string/token patterns)
EMERGENCY_RED_FLAGS = [
    # Neurological / Respiratory red flags with fever or headache
    ("confusion", "Altered mental status or acute confusion"),
    ("difficulty breathing", "Severe breathing difficulty or respiratory distress"),
    ("cannot breathe", "Inability to breathe or severe airway compromise"),
    ("stiff neck", "Nuchal rigidity / stiff neck"),
    ("thunderclap", "Sudden, explosive 'worst headache of life' onset"),
    ("worst headache", "Sudden severe thunderclap headache"),
    ("blue lips", "Cyanosis (blue/pale lips or fingertips)"),
    ("unresponsive", "Unresponsiveness or lethargy"),
    ("passed out", "Loss of consciousness or fainting"),
    ("unconscious", "Loss of consciousness"),
    ("seizure", "Active or recent convulsions/seizure"),
    ("slurred speech", "Slurred speech or facial paralysis"),
    ("drooping", "Facial drooping or asymmetrical weakness"),
    ("choking", "Acute airway obstruction / choking"),
    ("severe bleeding", "Life-threatening or spurting hemorrhage"),
    ("cardiac arrest", "Suspected cardiac arrest or stopped breathing"),
    ("no pulse", "Absence of pulse or unresponsiveness"),
    ("anaphylaxis", "Severe systemic allergic reaction"),
    ("swollen throat", "Throat swelling compromising airway"),
]

FEVER_CLARIFYING_QUESTIONS = [
    "What is the measured body temperature (if a thermometer is available)?",
    "How many days has the fever lasted?",
    "What is the person's age group (especially if an infant under 3 months or an older adult)?",
    "Are there any red flags such as confusion, stiff neck, shortness of breath, or a new rash?",
]

HEADACHE_CLARIFYING_QUESTIONS = [
    "Did the headache start suddenly and severely (like a 'thunderclap') or develop gradually?",
    "Are you experiencing a stiff neck, high fever, light sensitivity, or persistent vomiting?",
    "Is there any facial numbness, weakness in the arms, or difficulty speaking?",
    "Did this headache follow a recent head injury, fall, or trauma?",
]

GENERAL_CLARIFYING_QUESTIONS = [
    "How long have you been experiencing these symptoms?",
    "Are the symptoms getting rapidly worse or staying the same?",
    "Are there any critical warning signs such as severe chest pain, breathing difficulty, or confusion?",
]


def tokenize_query(query: str) -> List[str]:
    return re.findall(r"\b[a-z0-9]+\b", query.lower())


def evaluate_symptom_triage(
    query: str,
    candidate_record: Optional[KnowledgeBaseRecord],
    safety_passed: bool
) -> Dict[str, Any]:
    """
    Evaluates query intent, detected warning signs, and candidate protocol to assign
    a deterministic interaction type:
    - 'emergency': Red-flag symptoms or life-threatening emergency protocol.
    - 'clarification': Isolated/mild symptom with no red flags; asks clarifying questions.
    - 'guidance': Approved standard protocol with no ambiguity.
    - 'fallback': No valid approved candidate found.
    """
    q_clean = query.lower().strip()
    detected_warnings: List[str] = []

    # 1. Check for explicit red-flag combinations in query
    for flag_token, description in EMERGENCY_RED_FLAGS:
        if flag_token in q_clean:
            detected_warnings.append(description)

    # 2. Check category-based classification
    if not safety_passed or candidate_record is None:
        return {
            "interaction_type": "fallback",
            "warning_signs_detected": detected_warnings,
            "clarifying_questions": []
        }

    category = candidate_record.category

    # Case A: Explicit Emergency Category (Choking, Bleeding, CPR, Stroke, Seizure, Anaphylaxis)
    acute_emergency_categories = {
        "choking", "bleeding", "unconsciousness", "general_emergency",
        "stroke", "seizure", "allergic_reaction"
    }

    if category in acute_emergency_categories or len(detected_warnings) > 0:
        return {
            "interaction_type": "emergency",
            "warning_signs_detected": detected_warnings,
            "clarifying_questions": []
        }

    # Case B: Symptom Queries requiring context clarification (Fever, Mild Headache)
    if category == "fever_symptom":
        # If no severe red flags were mentioned in the query, provide non-alarmist clarification
        return {
            "interaction_type": "clarification",
            "warning_signs_detected": detected_warnings,
            "clarifying_questions": FEVER_CLARIFYING_QUESTIONS
        }

    if category == "head_injury" and not any(w in q_clean for w in ["hit head", "trauma", "concussion", "bleeding", "thunderclap"]):
        # Isolated "headache" without trauma or red flags -> Clarification
        return {
            "interaction_type": "clarification",
            "warning_signs_detected": detected_warnings,
            "clarifying_questions": HEADACHE_CLARIFYING_QUESTIONS
        }

    # Case C: Approved General Guidance (Thermal Burns, Asthma management)
    return {
        "interaction_type": "guidance",
        "warning_signs_detected": detected_warnings,
        "clarifying_questions": []
    }
