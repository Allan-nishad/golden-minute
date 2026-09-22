import httpx

tests = [
    ("choking", "Someone is choking"),
    ("bleeding", "My friend is bleeding badly from arm"),
    ("burns", "Someone touched boiling water and got burned"),
    ("unconsciousness", "Someone collapsed and is not responding"),
    ("breathing_emergency", "Severe asthma attack cannot breathe"),
    ("general_emergency", "Cardiac arrest need CPR"),
    ("seizure", "Someone is having a seizure and shaking violently"),
    ("stroke", "Face drooping and arm weakness suspect stroke"),
    ("allergic_reaction", "Severe allergic reaction to peanuts throat swelling"),
    ("fallback", "Tell me a funny joke"),
    ("fallback", "Snake bite in the woods")
]

print("-" * 110)
print(f"{'QUERY':45} | {'CATEGORY':20} | {'ENGINE':8} | {'MOSS MS':8} | {'BASE MS':8} | {'STATUS':10}")
print("-" * 110)

for expected_cat, q in tests:
    r = httpx.post("http://127.0.0.1:8000/api/v1/emergency", json={"query": q, "use_moss": True})
    d = r.json()
    cat = d["protocol_category"]
    engine = d["retrieval_engine"]
    moss_ms = str(d["metrics"]["moss_retrieval_ms"])
    base_ms = str(d["metrics"]["baseline_retrieval_ms"])
    status = d["safety_status"]
    title = d["source"].get("title", "")
    print(f"{q[:45]:45} | {cat:20} | {engine:8} | {moss_ms:8} | {base_ms:8} | {status:10}")

print("-" * 110)
