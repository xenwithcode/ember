# backend/services/privacy_layer.py
"""
Privacy Layer powered by Gemma 4 (Vertex AI, global endpoint)
Runs BEFORE the main agent to ensure user privacy and safety.
"""

import os
import json
import re
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from google import genai
from backend.config import config


class PIIReplacement(BaseModel):
    original: str
    tag: str


class PrivacyResult(BaseModel):
    anonymized_text: str
    detected_pii: List[PIIReplacement]
    safety_alert: Optional[str] = None
    mood_score: float  # -1.0 to 1.0
    mood_label: str
    crisis_detected: bool
    processing_time_ms: int


class PrivacyLayer:
    """
    Privacy Shield: Gemma 4 runs first to protect user data
    before it reaches the main Gemini-powered agent.
    """

    def __init__(self):
        self.project_id = config.GOOGLE_CLOUD_PROJECT
        self.model_id = config.GEMMA_MODEL

        # Initialize Vertex AI client for Gemma (MaaS models use the global endpoint)
        try:
            self.client = genai.Client(
                vertexai=True,
                project=self.project_id,
                location="global",
            )
            self.available = True
        except Exception as e:
            print(f"⚠️  Privacy Layer init failed: {e}. Using fallback mode.")
            self.client = None
            self.available = False
            self.model_id = None

    async def process(self, raw_text: str) -> PrivacyResult:
        """Main entry point — processes text through all 3 safety stages."""
        import time
        start = time.time()

        # Stage 1: Anonymize PII
        anonymized = await self._anonymize_pii(raw_text)

        # Stage 2: Safety check (CRITICAL)
        crisis_detected, safety_alert = await self._safety_check(raw_text)

        # Stage 3: Mood analysis (for quick UI feedback)
        mood_score, mood_label = await self._analyze_mood(raw_text)

        elapsed = int((time.time() - start) * 1000)

        return PrivacyResult(
            anonymized_text=anonymized["text"],
            detected_pii=[PIIReplacement(**r) for r in anonymized["replacements"]],
            safety_alert=safety_alert,
            mood_score=mood_score,
            mood_label=mood_label,
            crisis_detected=crisis_detected,
            processing_time_ms=elapsed,
        )

    async def _anonymize_pii(self, text: str) -> Dict[str, Any]:
        """Replace personally identifiable info with generic tags."""
        if not self.available:
            return self._fallback_anonymize(text)

        prompt = f"""You are a privacy filter. Replace personally identifiable information
with generic tags. Keep the emotional meaning intact.

Rules:
- Replace person names (not "I" or "me") with [PERSON]
- Replace school names with [SCHOOL]
- Replace company/workplace names with [WORKPLACE]
- Replace specific locations (cities, addresses) with [LOCATION]
- Replace phone numbers with [PHONE]
- Do NOT replace pronouns or generic nouns

Text: {text}

Respond ONLY with JSON in this exact format:
{{"text": "anonymized version here", "replacements": [{{"original": "John", "tag": "[PERSON]"}}]}}"""

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_id,
                contents=prompt,
            )
            return self._parse_json_response(response.text, text)
        except Exception as e:
            print(f"PII anonymization failed: {e}")
            return self._fallback_anonymize(text)

    async def _safety_check(self, text: str) -> tuple:
        """Detect self-harm or crisis indicators — runs FAST for safety."""
        # Fast keyword check first (no latency)
        crisis_keywords = [
            "suicide", "suicidal", "kill myself", "end it all",
            "want to die", "self-harm", "hurt myself", "cut myself",
            "no reason to live", "better off dead", "can't go on",
        ]
        
        text_lower = text.lower()
        crisis_detected = any(kw in text_lower for kw in crisis_keywords)

        if not crisis_detected:
            return False, None

        # If keywords detected, confirm with Gemma (avoid false positives)
        if self.available:
            prompt = f"""You are a crisis detection system. Analyze this text for
genuine signs of self-harm or suicidal ideation. Be conservative — better to
over-alert than miss a real crisis.

Text: {text}

Respond ONLY with JSON:
{{"crisis": true or false, "confidence": 0.0 to 1.0}}"""

            try:
                response = await self.client.aio.models.generate_content(
                    model=self.model_id, contents=prompt
                )
                result = self._parse_json_response(response.text, "")
                if result.get("crisis") is False:
                    return False, None  # Gemma overrode keyword match
            except Exception:
                pass  # Default to alert if model fails

        alert = (
            "⚠️ We care about your safety. If you're in crisis, "
            "please reach out now:\n"
            "• 988 Suicide & Crisis Lifeline: Call or text 988\n"
            "• Crisis Text Line: Text HOME to 741741\n"
            "• International: findahelpline.com"
        )
        return True, alert

    async def _analyze_mood(self, text: str) -> tuple:
        """Quick mood classification for UI feedback."""
        if not self.available:
            return self._fallback_mood(text)

        prompt = f"""Classify the dominant emotion in this text.
Choose ONE: happy, sad, anxious, angry, calm, hopeful, neutral.
Also rate emotional valence from -1.0 (very negative) to 1.0 (very positive).

Text: {text}

Respond ONLY with JSON:
{{"label": "one emotion", "score": -0.5}}"""

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_id, contents=prompt
            )
            result = self._parse_json_response(response.text, "")
            label = result.get("label", "neutral")
            score = float(result.get("score", 0.0))
            return max(-1.0, min(1.0, score)), label
        except Exception:
            return self._fallback_mood(text)

    def _parse_json_response(self, text: str, original: str) -> Dict[str, Any]:
        """Safely parse JSON from model response."""
        # Try to extract JSON from markdown code blocks or raw text
        json_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        json_str = json_match.group(1) if json_match else text.strip()

        # Try to find JSON object in text
        if "{" not in json_str:
            return {"text": original, "replacements": []}

        start = json_str.find("{")
        end = json_str.rfind("}") + 1
        if start == -1 or end == 0:
            return {"text": original, "replacements": []}

        try:
            return json.loads(json_str[start:end])
        except json.JSONDecodeError:
            return {"text": original, "replacements": []}

    def _fallback_anonymize(self, text: str) -> Dict[str, Any]:
        """Rule-based fallback if Gemma is unavailable."""
        import re
        replacements = []

        # Phone numbers
        phone_pattern = r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"
        for match in re.finditer(phone_pattern, text):
            replacements.append({"original": match.group(), "tag": "[PHONE]"})
            text = text.replace(match.group(), "[PHONE]")

        # Email addresses
        email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
        for match in re.finditer(email_pattern, text):
            replacements.append({"original": match.group(), "tag": "[EMAIL]"})
            text = text.replace(match.group(), "[EMAIL]")

        return {"text": text, "replacements": replacements}

    def _fallback_mood(self, text: str) -> tuple:
        """Keyword-based mood fallback."""
        text_lower = text.lower()
        if any(w in text_lower for w in ["happy", "great", "amazing", "wonderful"]):
            return 0.7, "happy"
        if any(w in text_lower for w in ["sad", "depressed", "crying", "lonely"]):
            return -0.6, "sad"
        if any(w in text_lower for w in ["anxious", "worried", "nervous", "panic"]):
            return -0.4, "anxious"
        if any(w in text_lower for w in ["angry", "furious", "frustrated"]):
            return -0.5, "angry"
        if any(w in text_lower for w in ["hope", "hopeful", "looking forward"]):
            return 0.5, "hopeful"
        return 0.0, "neutral"