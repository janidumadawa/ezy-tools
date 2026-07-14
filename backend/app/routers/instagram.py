from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from ..services.instagram_service import InstagramService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/instagram", tags=["instagram"])
service = InstagramService()

@router.get("/info")
async def get_media_info(url: str):
    """Get Instagram media information"""
    try:
        return service.get_media_info(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/download")
async def download_media(request: Request):
    """Download Instagram media"""
    try:
        data = await request.json()
        result = service.download(data['url'])
        if result['success']:
            filename = result['data']['filename']
            result['data']['download_url'] = f'/api/instagram/file/{filename}'
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{filename}")
async def get_file(filename: str):
    """Download file"""
    filepath = DOWNLOADS_DIR / filename
    if filepath.exists():
        return FileResponse(
            path=str(filepath),
            filename=filename,
            media_type='application/octet-stream'
        )
    raise HTTPException(status_code=404, detail="File not found")