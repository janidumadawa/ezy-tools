from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from ..services.facebook_service import FacebookService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/facebook", tags=["facebook"])
service = FacebookService()

@router.get("/info")
async def get_video_info(url: str):
    """Get Facebook video information"""
    try:
        return service.get_video_info(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/download")
async def download_video(request: Request):
    """Download Facebook video"""
    try:
        data = await request.json()
        result = service.download(
            data['url'], 
            data.get('quality', 'best')
        )
        if result['success']:
            filename = result['data']['filename']
            result['data']['download_url'] = f'/api/facebook/file/{filename}'
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