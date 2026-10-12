"""Conservative gate: evidence sufficiency is distinct from retrieval score."""

from __future__ import annotations

import re

from src.knowledge.rag_engine import tokenize

UNVERIFIED = ("模拟样本", "演示政策", "未经平台核实", "非知乎实采", "非小红书实采")
UNCERTAIN = ("暂无", "无法确认", "不能确认", "不确定", "未提供", "未知", "没有配方")
SENSITIVE_INTENTS = {"allergy_reaction", "order_query", "logistics_query", "refund_request",
                     "quality_issue", "authenticity_check", "invoice_request"}


class AnswerableGate:
    """Require verified evidence and product-specific support before auto reply."""

    def __init__(self, threshold: float = 0.7) -> None:
        self.threshold = threshold

    def evaluate(self, query: str, docs: list[dict], intent: str = "") -> dict:
        """Return decision and calibrated heuristic confidence (not a probability)."""
        if intent in SENSITIVE_INTENTS:
            return {"can_auto_reply": False, "confidence": 0.0, "reason": "requires_human_or_order_system"}
        if not docs:
            return {"can_auto_reply": False, "confidence": 0.0, "reason": "no_evidence"}
        verified = [doc for doc in docs if doc.get("verified") is True
                    and not any(flag in doc.get("source", "") for flag in UNVERIFIED)]
        if not verified:
            return {"can_auto_reply": False, "confidence": 0.0, "reason": "unverified_evidence"}
        query_tokens = set(tokenize(query))
        filtered = [token for token in query_tokens if len(token) > 1]
        if not filtered:
            filtered = list(query_tokens)
        best = max(
            (
                0.0
                if any(flag in f"{doc.get('title', '')} {doc.get('content', '')}"
                       for flag in UNCERTAIN)
                or doc.get("approved_product_claim") is False
                else len(set(filtered) & set(tokenize(
                    f"{doc.get('title', '')} {doc.get('content', '')}")))
                / max(len(filtered), 1)
            )
            for doc in verified
        ) if verified else 0.0
        # Product claims need explicit product identity and structured approval.
        product_names = re.findall(r"[A-Za-z][\w-]{2,}", query)
        if product_names and not any(
            doc.get("approved_product_claim") and all(
                name.lower() in str(doc.get("product_name", "")).lower() for name in product_names
            ) for doc in verified
        ):
            best = 0.0
        return {"can_auto_reply": best >= self.threshold, "confidence": round(best, 3),
                "reason": "supported" if best >= self.threshold else "insufficient_evidence"}

    def can_answer(self, query: str, docs: list[dict], intent: str = "") -> bool:
        """Compatibility boolean interface."""
        return self.evaluate(query, docs, intent)["can_auto_reply"]
