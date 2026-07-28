from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from fastapi.responses import FileResponse
from typing import Optional
from ..services.qr_service import QRService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/qr", tags=["qr"])
service = QRService()
qr_dir = DOWNLOADS_DIR / "qr_codes"
qr_dir.mkdir(parents=True, exist_ok=True)

@router.post("/generate")
async def generate_qr(
    data: str = Form(...),
    size: int = Form(300),
    color: str = Form("#000000"),
    bg_color: str = Form("#FFFFFF"),
    logo: Optional[UploadFile] = File(None)
):
    try:
        result = service.generate_qr(data, size, color, bg_color, logo)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{filename}")
async def get_file(filename: str):
    filepath = qr_dir / filename
    if filepath.exists():
        return FileResponse(path=str(filepath), filename=filename, media_type='image/png')
    raise HTTPException(status_code=404, detail="File not found")