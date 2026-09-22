from app.retrieval import BaselineRetriever
from app.config import settings


def test_baseline_retriever_approved_records_only():
    retriever = BaselineRetriever()
    approved = retriever.get_approved_records()
    assert len(approved) > 0
    for record in approved:
        assert record.review_status == "approved_for_demo"


def test_retrieval_choking_query():
    retriever = BaselineRetriever()
    result = retriever.retrieve("Someone is choking on food")
    assert result["record"] is not None
    assert result["record"].category == "choking"
    assert result["score"] >= settings.RELEVANCE_THRESHOLD
    assert result["engine"] == "baseline"


def test_retrieval_bleeding_query():
    retriever = BaselineRetriever()
    result = retriever.retrieve("There is heavy blood and deep wound")
    assert result["record"] is not None
    assert result["record"].category == "bleeding"
    assert result["score"] >= settings.RELEVANCE_THRESHOLD


def test_retrieval_burns_query():
    retriever = BaselineRetriever()
    result = retriever.retrieve("Spilled boiling hot water scald")
    assert result["record"] is not None
    assert result["record"].category == "burns"
    assert result["score"] >= settings.RELEVANCE_THRESHOLD


def test_retrieval_irrelevant_query():
    retriever = BaselineRetriever()
    result = retriever.retrieve("What is the recipe for chocolate cake?")
    assert result["record"] is None
