"""
Script to create and populate the Moss emergency knowledge-base index.
Run this script once your MOSS_PROJECT_ID and MOSS_PROJECT_KEY are added to backend/.env:

    python scripts/sync_moss_index.py
"""

import asyncio
import json
import os
import sys
from pathlib import Path

# Add parent directory to sys.path so app modules can be imported
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import settings
from app.models import KnowledgeBaseRecord


async def sync_knowledge_base():
    if not settings.MOSS_PROJECT_ID or not settings.MOSS_PROJECT_KEY:
        print("❌ Error: MOSS_PROJECT_ID and MOSS_PROJECT_KEY must be set in backend/.env")
        print("Get your credentials at: https://portal.usemoss.dev")
        return False

    try:
        from moss import MossClient, DocumentInfo
    except ImportError:
        print("❌ Error: 'moss' package not installed. Run: pip install moss")
        return False

    kb_path = settings.KNOWLEDGE_BASE_PATH
    if not kb_path.exists():
        print(f"❌ Error: Knowledge base file not found at {kb_path}")
        return False

    with open(kb_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Filter strictly approved records
    approved = [KnowledgeBaseRecord(**item) for item in data if item.get("review_status") == "approved_for_demo"]
    print(f"[INFO] Found {len(approved)} approved emergency protocols to index in Moss.")

    documents = []
    for record in approved:
        rich_text = (
            f"Emergency Protocol: {record.title}\n"
            f"Category: {record.category}\n"
            f"Keywords: {', '.join(record.keywords)}\n"
            f"First Aid Steps:\n{record.content}\n"
            f"Source: {record.source_name} ({record.source_url})"
        )
        documents.append(DocumentInfo(id=record.id, text=rich_text))
        print(f"  + Prepared doc '{record.id}' ({record.title})")

    print(f"\n[INFO] Connecting to Moss platform and syncing index '{settings.MOSS_INDEX_NAME}'...")
    client = MossClient(
        project_id=settings.MOSS_PROJECT_ID,
        project_key=settings.MOSS_PROJECT_KEY
    )

    try:
        try:
            await client.create_index(settings.MOSS_INDEX_NAME, documents)
            print(f"[OK] Successfully created and uploaded index '{settings.MOSS_INDEX_NAME}' to Moss cloud!")
        except Exception as e:
            if "INDEX_EXISTS" in str(e) or "409" in str(e):
                print(f"[INFO] Index '{settings.MOSS_INDEX_NAME}' already exists on cloud. Syncing documents...")
                await client.load_index(settings.MOSS_INDEX_NAME)
                await client.add_docs(settings.MOSS_INDEX_NAME, documents)
                print(f"[OK] Successfully updated documents in existing index '{settings.MOSS_INDEX_NAME}'!")
            else:
                raise e

        # Verify index by loading it
        print("[INFO] Verifying index loading...")
        await client.load_index(settings.MOSS_INDEX_NAME)
        print("[OK] Moss index verified and ready for zero-latency queries!")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to sync Moss index: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(sync_knowledge_base())
    sys.exit(0 if success else 1)
