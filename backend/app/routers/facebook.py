from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from ..services.facebook_service import FacebookService
from ..config import DOWNLOADS_DIR
import os

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
    """Download Facebook video - returns file info"""
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
    """Stream file to browser"""
    filepath = DOWNLOADS_DIR / filename
    
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Get file size
    file_size = os.path.getsize(filepath)
    
    # Determine media type
    if filename.endswith('.mp3'):
        media_type = 'audio/mpeg'
    else:
        media_type = 'video/mp4'
    
    # Return file with proper headers
    return FileResponse(
        path=str(filepath),
        filename=filename,
        media_type=media_type,
        headers={
            'Content-Disposition': f'attachment; filename="{filename}"',
            'Content-Length': str(file_size),
            'Access-Control-Expose-Headers': 'Content-Disposition',
        }
    )