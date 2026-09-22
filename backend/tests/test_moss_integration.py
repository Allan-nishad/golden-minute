import pytest
import asyncio
from app.config import settings
from app.moss_retrieval import MossRetriever
from app.retrieval import baseline_retriever


def test_moss_sdk_classes_available():
    """Verifies that the official Moss SDK is installed and exports expected classes."""
    import moss
    assert hasattr(moss, "MossClient")
    assert hasattr(moss, "DocumentInfo")
    assert hasattr(moss, "QueryOptions")


@pytest.mark.asyncio
async def test_moss_retriever_initialization_and_honesty():
    """
    Tests MossRetriever behavior.
    If no credentials are set, returns unconfigured status honestly without simulation or crash.
    """
    retriever = MossRetriever()
    approved = baseline_retriever.get_approved_records()
    
    if not retriever.is_configured:
        result = await retriever.retrieve("Someone is choking", approved)
        assert result["engine"] == "moss"
        assert result["record"] is None
        assert result["moss_ms"] is None
        assert result["error"] == "moss_credentials_not_configured"
    else:
        # If configured with real credentials
        loaded = await retriever.ensure_index_loaded()
        if loaded:
            result = await retriever.retrieve("Someone is choking", approved)
            assert result["engine"] == "moss"
            assert result["moss_ms"] is not None
            assert result["moss_ms"] > 0
            if result["record"] is not None:
                assert result["record"].category == "choking"
                assert result["record"].review_status == "approved_for_demo"
