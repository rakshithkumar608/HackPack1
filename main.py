from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import requests
import faiss
import numpy as np
import os
import pickle
import json



OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
OLLAMA_CHAT_URL = "http://localhost:11434/api/generate"

EMBED_MODEL = "nomic-embed-text"
CHAT_MODEL = "gemma:2b"

DATA_FILE = "data/notes.txt"
FAISS_INDEX_FILE = "faiss.index"
CHUNKS_FILE = "chunks.pkl"

CHUNK_SIZE = 900
CHUNK_OVERLAP = 100

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

faiss_index = None
chunk_texts: List[str] = []
EMBED_DIM = None


def normalize_company_name(company: str) -> str:
    return company.split(".")[0].strip().upper()


def load_text_file(path: str) -> str:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing file: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def chunk_text(text: str) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start = end - CHUNK_OVERLAP
    return chunks

RAW_TEXT = load_text_file(DATA_FILE)
DOCUMENT_CHUNKS = chunk_text(RAW_TEXT)


def create_faiss_index():
    global faiss_index, chunk_texts, EMBED_DIM
    embeddings = []
    chunk_texts.clear()

    for chunk in DOCUMENT_CHUNKS:
        res = requests.post(
            OLLAMA_EMBED_URL,
            json={"model": EMBED_MODEL, "prompt": chunk}
        )
        emb = np.array(res.json()["embedding"], dtype="float32")
        embeddings.append(emb)
        chunk_texts.append(chunk)

    EMBED_DIM = len(embeddings[0])
    faiss_index = faiss.IndexFlatL2(EMBED_DIM)
    faiss_index.add(np.vstack(embeddings))

def save_index():
    faiss.write_index(faiss_index, FAISS_INDEX_FILE)
    with open(CHUNKS_FILE, "wb") as f:
        pickle.dump(chunk_texts, f)

def load_index() -> bool:
    global faiss_index, chunk_texts, EMBED_DIM
    if os.path.exists(FAISS_INDEX_FILE) and os.path.exists(CHUNKS_FILE):
        faiss_index = faiss.read_index(FAISS_INDEX_FILE)
        EMBED_DIM = faiss_index.d
        with open(CHUNKS_FILE, "rb") as f:
            chunk_texts[:] = pickle.load(f)
        return True
    return False


def retrieve_relevant_chunks(query: str, top_k: int = 5) -> List[str]:
    res = requests.post(
        OLLAMA_EMBED_URL,
        json={"model": EMBED_MODEL, "prompt": query}
    )
    query_emb = np.array(res.json()["embedding"], dtype="float32").reshape(1, -1)
    _, indices = faiss_index.search(query_emb, top_k)
    return [chunk_texts[i] for i in indices[0]]

def filter_chunks_for_company(chunks: list[str], company: str) -> list[str]:
    company = company.upper()
    filtered = [c for c in chunks if company in c.upper()]

    # 🔁 fallback: trust FAISS ranking if explicit name missing
    if not filtered:
        return chunks[:2]

    return filtered


@app.on_event("startup")
def startup():
    if not load_index():
        create_faiss_index()
        save_index()



class ReasoningSignal(BaseModel):
    reasoning_quality: str
    time_horizon_present: bool
    risk_awareness_present: bool
    confidence_level: str
    detected_biases: List[str]
    clarity_score: float

class ReasoningJudgement(BaseModel):
    verdict: str
    xp_awarded: int
    feedback: str

class PreTradeRequest(BaseModel):
    session_id: str
    company: str
    user_reasoning: Optional[str] = None

class PreTradeResponse(BaseModel):
    verdict: str
    xp_awarded: int
    judgement_message: str
    company_news: str



DEFAULT_SIGNAL = {
    "reasoning_quality": "weak",
    "time_horizon_present": False,
    "risk_awareness_present": False,
    "confidence_level": "medium",
    "detected_biases": [],
    "clarity_score": 0.3
}

def classify_reasoning(text: str) -> ReasoningSignal:
    prompt = f"""
You are a financial reasoning classifier for beginner students.
You do NOT give investment advice.
You ONLY analyze reasoning quality and biases.

User reasoning:
"{text}"

Return ONLY valid JSON using this schema:
{json.dumps(DEFAULT_SIGNAL, indent=2)}
"""
    try:
        res = requests.post(
            OLLAMA_CHAT_URL,
            json={"model": CHAT_MODEL, "prompt": prompt, "stream": False},
            timeout=15
        )
        raw = res.json()["response"]
        parsed = json.loads(raw[raw.find("{"): raw.rfind("}") + 1])
        return ReasoningSignal(**parsed)
    except Exception:
        return ReasoningSignal(**DEFAULT_SIGNAL)


feedback_map = {
    "good": """Your reasoning shows a balanced way of thinking. You considered both
positive factors and risks. This shows awareness of uncertainty.
To improve, clearly state your time horizon and how you would respond to changes.""",

    "risky": """Your reasoning shows some understanding but is influenced by bias or
short-term focus. You may be relying on recent trends.
To improve, consider what could go wrong and how long your decision depends on current conditions.""",

    "poor": """Your reasoning lacks clarity and risk awareness.
Important factors such as uncertainty or supporting information are missing.
To improve, explain your interest clearly, identify risks, and state what information you used."""
}

def judge_reasoning_backend(signal: ReasoningSignal) -> ReasoningJudgement:
    xp = 0
    verdict = "poor"

    if signal.reasoning_quality == "strong":
        xp += 30
        verdict = "good"
    elif signal.reasoning_quality == "average":
        xp += 15
        verdict = "risky"
    else:
        xp += 5

    if signal.time_horizon_present:
        xp += 10
    if signal.risk_awareness_present:
        xp += 10
    if signal.clarity_score > 0.6:
        xp += 5
    if "fomo" in signal.detected_biases:
        xp -= 5
        verdict = "risky"

    xp = max(xp, 0)

    return ReasoningJudgement(
        verdict=verdict,
        xp_awarded=xp,
        feedback=feedback_map[verdict]
    )



def get_company_news(company: str) -> str:
    normalized = normalize_company_name(company)
    raw_chunks = retrieve_relevant_chunks(normalized)
    chunks = filter_chunks_for_company(raw_chunks, normalized)

    if not chunks:
        return f"No significant recent information found about {normalized}."

    context_text = "\n".join(chunks)

    prompt = f"""
You are a financial news summarizer for beginner students.
Do NOT give investment advice.

Context:
{context_text}

Task:
Based ONLY on the context above, write 2–3 simple sentences describing
business activity, stability, or risks related to {normalized}.
Do NOT say you lack information.
Do NOT refuse.
If information is limited, summarize whatever is available.
"""

    try:
        res = requests.post(
            OLLAMA_CHAT_URL,
            json={"model": CHAT_MODEL, "prompt": prompt, "stream": False},
            timeout=15
        )
        return res.json()["response"].strip()
    except Exception:
        return f"No significant recent information found about {normalized}."



@app.post("/pre_trade_check", response_model=PreTradeResponse)
def pre_trade_check(req: PreTradeRequest):
    company_news = get_company_news(req.company)

    if req.user_reasoning:
        signal = classify_reasoning(req.user_reasoning)
        judgement = judge_reasoning_backend(signal)
    else:
        judgement = ReasoningJudgement(
            verdict="unknown",
            xp_awarded=0,
            feedback="No reasoning provided."
        )

    return {
        "verdict": judgement.verdict,
        "xp_awarded": judgement.xp_awarded,
        "judgement_message": judgement.feedback,
        "company_news": company_news
    }


class CompanyNewsRequest(BaseModel):
    company: str

class CompanyNewsResponse(BaseModel):
    title: str
    summary: str
    sentiment: int   # 1 = positive, 0 = negative / cautious

def detect_sentiment(text: str) -> int:
    negative_words = ["risk", "uncertain", "volatility", "pressure", "slowdown", "regulatory"]
    score = sum(1 for w in negative_words if w in text.lower())
    return 0 if score >= 2 else 1

@app.post("/company_news", response_model=CompanyNewsResponse)
def company_news(req: CompanyNewsRequest):

    # 1️ Retrieve chunks
    chunks = retrieve_relevant_chunks(req.company, top_k=5)

    # 2️Filter by company name (you already wrote this logic)
    chunks = filter_chunks_for_company(chunks, req.company)

    if not chunks:
        return {
            "title": req.company,
            "summary": "No significant recent information found.",
            "sentiment": 0
        }

    context = "\n".join(chunks)

    prompt = f"""
Summarize the key business information and risks about {req.company}
using the context below. Keep it short and factual.

Context:
{context}
"""

    try:
        res = requests.post(
            OLLAMA_CHAT_URL,
            json={"model": CHAT_MODEL, "prompt": prompt, "stream": False},
            timeout=15
        )
        summary = res.json()["response"].strip()
    except Exception:
        summary = "Unable to generate company summary."

    sentiment = detect_sentiment(summary)

    return {
        "title": req.company,
        "summary": summary,
        "sentiment": sentiment
    }






from pydantic import BaseModel

class ReflectionRequest(BaseModel):
    reasoning: str

class ReflectionResponse(BaseModel):
    verdict: str
    xp_awarded: int
    judgement_message: str


@app.post("/reflection_check", response_model=ReflectionResponse)
def reflection_check(req: ReflectionRequest):
    signal = classify_reasoning(req.reasoning)
    judgement = judge_reasoning_backend(signal)

    #  IMPORTANT:
    # signal JSON NEVER leaves backend
    return {
        "verdict": judgement.verdict,
        "xp_awarded": judgement.xp_awarded,
        "judgement_message": judgement.feedback
    }






@app.get("/health")
def health():
    return {"status": "ok"}


app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
