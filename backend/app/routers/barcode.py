from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import FileResponse
from ..services.barcode_service import BarcodeService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/barcode", tags=["barcode"])
service = BarcodeService()
barcode_dir = DOWNLOADS_DIR / "barcodes"
barcode_dir.mkdir(parents=True, exist_ok=True)

@router.post("/generate")
async def generate_barcode(
    data: str = Form(...),
    barcode_type: str = Form('code128')
):
    try:
        result = service.generate_barcode(data, barcode_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{filename}")
async def get_file(filename: str):
    filepath = barcode_dir / filename
    if filepath.exists():
        return FileResponse(path=str(filepath), filename=filename, media_type='image/png')
    raise HTTPException(status_code=404, detail="File not found")