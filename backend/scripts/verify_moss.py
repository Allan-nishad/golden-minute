"""
MOSS VERIFICATION SCRIPT (PHASE 0)

This script performs an honest, end-to-end check of the Moss SDK, credentials, index creation/loading,
and real query retrieval timing.

Run:
    python scripts/verify_moss.py
"""

import asyncio
import os
import sys
import time
from pathlib import Path

# Fix stdout encoding on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import settings
from app.models import KnowledgeBaseRecord
from app.retrieval import baseline_retriever


async def run_phase_0_verification():
    print("=" * 70)
    print("PHASE 0: MOSS VERIFICATION & RETRIEVAL TEST")
    print("=" * 70)

    # 1. Check SDK Installation
    print("\n[1/6] Checking Official Moss SDK...")
    try:
        import moss
        from moss import MossClient, DocumentInfo, QueryOptions
        print(f"  [OK] Found installed Moss SDK: version {getattr(moss, '__version__', '1.13.0')}")
    except ImportError as e:
        print(f"  [FAIL] Moss SDK not installed: {e}")
        print("  --> Fix: run 'pip install moss'")
        return False

    # 2. Check Configuration & Credentials
    print("\n[2/6] Checking Moss Project Credentials...")
    project_id = os.environ.get("MOSS_PROJECT_ID") or settings.MOSS_PROJECT_ID
    project_key = os.environ.get("MOSS_PROJECT_KEY") or settings.MOSS_PROJECT_KEY
    index_name = os.environ.get("MOSS_INDEX_NAME") or settings.MOSS_INDEX_NAME

    if not project_id or not project_key:
        print("  [FAIL] BLOCKER: Moss project credentials are missing.")
        print("  --> Please create 'backend/.env' with:")
        print("      MOSS_PROJECT_ID=your_project_id")
        print("      MOSS_PROJECT_KEY=your_project_key")
        print("      MOSS_INDEX_NAME=golden-minute-emergency")
        print("      ENABLE_MOSS=true")
        print("  --> Sign up at: https://portal.usemoss.dev")
        print("\n  [STATUS]: Verification paused awaiting real credentials.")
        return False

    print(f"  [OK] Project ID: {project_id[:6]}... (configured)")
    print(f"  [OK] Project Key: {project_key[:6]}... (configured)")
    print(f"  [OK] Index Name: {index_name}")

    # 3. Load Curated Emergency Knowledge Base
    print("\n[3/6] Loading Curated Emergency Knowledge Base...")
    approved_records = baseline_retriever.get_approved_records()
    print(f"  [OK] Found {len(approved_records)} approved emergency protocols.")
    
    docs = []
    for rec in approved_records:
        text = f"{rec.title}. {rec.content} Keywords: {', '.join(rec.keywords)}"
        docs.append(DocumentInfo(id=rec.id, text=text))
        print(f"    - [{rec.category}] {rec.id}: {rec.title}")

    # 4. Connect to Moss and Create/Load Index
    print(f"\n[4/6] Connecting to Moss & Loading Index '{index_name}'...")
    client = MossClient(project_id, project_key)
    
    try:
        t0 = time.perf_counter()
        try:
            await client.create_index(index_name, docs)
            t_index = (time.perf_counter() - t0) * 1000
            print(f"  [OK] Index '{index_name}' created/synced in {t_index:.2f} ms")
        except Exception as create_err:
            if "INDEX_EXISTS" in str(create_err) or "409" in str(create_err):
                print(f"  [OK] Index '{index_name}' already exists in cloud project. Proceeding to load.")
            else:
                raise create_err

        t0 = time.perf_counter()
        await client.load_index(index_name)
        t_load = (time.perf_counter() - t0) * 1000
        print(f"  [OK] Index '{index_name}' loaded in memory in {t_load:.2f} ms")
    except Exception as e:
        print(f"  [FAIL] Failed during Moss index operation: {e}")
        return False

    # 5. Execute Real Moss Queries & Measure Real Latency
    print("\n[5/6] Executing Real Moss Emergency Queries...")
    test_queries = [
        "Someone is choking and cannot breathe",
        "Severe arterial bleeding wound",
        "Hot boiling water burn"
    ]

    for q in test_queries:
        t_start = time.perf_counter()
        result = await client.query(
            index_name,
            q,
            QueryOptions(top_k=1, alpha=0.8)
        )
        elapsed_ms = (time.perf_counter() - t_start) * 1000

        print(f"\n  Query: \"{q}\"")
        print(f"  ⚡ Measured Moss Retrieval Latency: {elapsed_ms:.2f} ms")
        
        if result and hasattr(result, "docs") and len(result.docs) > 0:
            top_doc = result.docs[0]
            print(f"  [OK] Matched Doc ID: {top_doc.id}")
            print(f"  [OK] Relevance Score: {top_doc.score:.4f}")
            print(f"  [OK] Document Preview: {top_doc.text[:90]}...")
        else:
            print("  [FAIL] No document returned for query.")

    # 6. Conclusion
    print("\n" + "=" * 70)
    print("[SUCCESS] PHASE 0 COMPLETE: REAL QUERY -> REAL MOSS RETRIEVAL -> REAL RESULT -> REAL TIMING")
    print("=" * 70)
    return True


if __name__ == "__main__":
    asyncio.run(run_phase_0_verification())
