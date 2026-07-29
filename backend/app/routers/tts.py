from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import FileResponse
from ..services.tts_service import TTSService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/tts", tags=["tts"])
service = TTSService()
tts_dir = DOWNLOADS_DIR / "tts"
tts_dir.mkdir(parents=True, exist_ok=True)

@router.post("/generate")
async def generate_speech(
    text: str = Form(...),
    lang: str = Form('en'),
    slow: bool = Form(False)
):
    try:
        result = service.text_to_speech(text, lang, slow)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{filename}")
async def get_file(filename: str):
    filepath = tts_dir / filename
    if filepath.exists():
        return FileResponse(path=str(filepath), filename=filename, media_type='audio/mpeg')
    raise HTTPException(status_code=404, detail="File not found")