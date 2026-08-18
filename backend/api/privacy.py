# backend/api/privacy.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.privacy_layer import PrivacyLayer

router = APIRouter(prefix="/api/privacy", tags=["privacy"])
privacy_layer = PrivacyLayer()


class PrivacyRequest(BaseModel):
    text: str


@router.post("/process")
async def process_text(request: PrivacyRequest):
    """Process text through privacy layer (Gemma 4)."""
    if not request.text.strip():
        raise HTTPException(400, "Text cannot be empty")
    
    result = await privacy_layer.process(request.text)
    return result.model_dump()


@router.get("/status")
async def privacy_status():
    """Check if Privacy Layer (Gemma) is available."""
    return {
        "available": privacy_layer.available,
        "model": privacy_layer.model_id,
        "provider": "Vertex AI Model Garden",
    }