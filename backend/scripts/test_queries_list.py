import httpx

queries = [
    "Someone is choking",
    "choking",
    "There is a burn",
    "Someone is unconscious",
    "severe bleeding",
    "Asthma attack",
    "Heart stopped CPR",
    "Someone got electrocuted",
    "Snake bite",
    "Car accident",
    "What should I do if someone is bleeding?"
]

for q in queries:
    r = httpx.post("http://127.0.0.1:8000/api/v1/emergency", json={"query": q, "use_moss": True})
    data = r.json()
    print(f"QUERY: {q:35} | Category: {data['protocol_category']:20} | Engine: {data['retrieval_engine']:8} | Step 1: {data['guidance'].splitlines()[0] if data['guidance'] else ''}")
