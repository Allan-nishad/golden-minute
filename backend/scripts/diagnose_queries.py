import time
import httpx

time.sleep(2)

queries = [
    "Fever",
    "Headache",
    "Someone is choking",
    "Fever with confusion and difficulty breathing",
    "Sudden severe thunderclap headache with stiff neck",
    "Tell me a joke"
]

print("=" * 135)
print(f"{'QUERY':42} | {'MOSS':6} | {'DOC ID / TITLE':35} | {'TYPE':13} | {'STATUS':10} | {'MOSS MS':8} | {'REASON'}")
print("=" * 135)

for q in queries:
    try:
        r = httpx.post("http://127.0.0.1:8000/api/v1/emergency", json={"query": q, "use_moss": True})
        d = r.json()
        doc_info = d["source"].get("title") or d["source"].get("protocol_id") or "None"
        moss_called = "YES" if d["metrics"]["moss_retrieval_ms"] is not None else "NO"
        moss_ms = str(d["metrics"]["moss_retrieval_ms"])
        itype = d.get("interaction_type", "N/A")
        status = d.get("safety_status", "N/A")
        reason = d.get("validation_reason", "N/A")
        warnings = len(d.get("warning_signs_detected", []))
        if warnings:
            reason += f" ({warnings} warnings)"
        print(f"{q[:42]:42} | {moss_called:6} | {doc_info[:35]:35} | {itype:13} | {status:10} | {moss_ms:8} | {reason}")
    except Exception as e:
        print(f"{q[:42]:42} | ERROR: {e}")

print("=" * 135)
