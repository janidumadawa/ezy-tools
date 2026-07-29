from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from ..services.audio_service import AudioService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/audio", tags=["audio"])
service = AudioService()
audio_dir = DOWNLOADS_DIR / "audio"
audio_dir.mkdir(parents=True, exist_ok=True)

@router.post("/convert")
async def convert_audio(
    file: UploadFile = File(...),
    format: str = Form('mp3')
):
    try:
        result = service.convert_audio(file, format)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{filename}")
async def get_file(filename: str):
    filepath = audio_dir / filename
    if filepath.exists():
        return FileResponse(path=str(filepath), filename=filename, media_type='audio/mpeg')
    raise HTTPException(status_code=404, detail="File not found")