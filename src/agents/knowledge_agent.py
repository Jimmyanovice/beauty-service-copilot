"""Knowledge agent exposing retrieved context and answerability decision."""

from __future__ import annotations

from src.knowledge.answerable_gate import AnswerableGate
from src.knowledge.rag_engine import RAGEngine


class KnowledgeAgent:
    """Retrieve evidence; unverified demo documents are never auto-answerable."""

    def __init__(self, rag_engine: RAGEngine | None = None, gate: AnswerableGate | None = None) -> None:
        self.rag_engine = rag_engine or RAGEngine()
        self.gate = gate or AnswerableGate()

    def search(self, query: str, intent: str = "", user_profile: dict | None = None) -> dict:
        """Return ranked evidence with conservative handoff decision."""
        docs = self.rag_engine.hybrid_search(query)
        decision = self.gate.evaluate(query, docs, intent)
        context = "\n".join(f"[{i}] {doc.get('title', '')} ({doc.get('source', '')}): "
                            f"{doc.get('content', '')[:400]}" for i, doc in enumerate(docs[:3], 1))
        return {"retrieved_docs": docs, "context": context, "confidence": decision["confidence"],
                "can_auto_reply": decision["can_auto_reply"], "reason": decision["reason"]}
