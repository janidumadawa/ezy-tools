from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from ..services.tiktok_service import TikTokService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/tiktok", tags=["tiktok"])
service = TikTokService()

@router.get("/info")
async def get_video_info(url: str):
    try:
        return service.get_video_info(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/download")
async def download_video(request: Request):
    try:
        data = await request.json()
        result = service.download(data['url'])
        if result['success']:
            filename = result['data']['filename']
            result['data']['download_url'] = f'/api/tiktok/file/{filename}'
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{filename}")
async def get_file(filename: str):
    filepath = DOWNLOADS_DIR / filename
    if filepath.exists():
        return FileResponse(path=str(filepath), filename=filename, media_type='application/octet-stream')
    raise HTTPException(status_code=404, detail="File not found")