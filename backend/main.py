from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import yt_dlp
import os
import time
import subprocess
from pathlib import Path

app = FastAPI(title="YouTube Downloader API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use system Downloads folder
DOWNLOADS_PATH = str(Path.home() / "Downloads" / "YouTubeDownloads")
DOWNLOAD_DIR = Path(DOWNLOADS_PATH)
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Find ffmpeg path
FFMPEG_PATH = r"C:\ProgramData\chocolatey\bin\ffmpeg.exe"  # Default chocolatey path
# Try to find it
try:
    result = subprocess.run(['where', 'ffmpeg'], capture_output=True, text=True, shell=True)
    if result.returncode == 0:
        FFMPEG_PATH = result.stdout.strip().split('\n')[0]
        print(f"✅ ffmpeg found at: {FFMPEG_PATH}")
except:
    # Try common paths
    common_paths = [
        r"C:\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
        r"C:\ProgramData\chocolatey\bin\ffmpeg.exe",
    ]
    for path in common_paths:
        if os.path.exists(path):
            FFMPEG_PATH = path
            print(f"✅ ffmpeg found at: {FFMPEG_PATH}")
            break

@app.get("/")
async def root():
    return {"message": "YouTube Downloader API", "status": "running", "ffmpeg": FFMPEG_PATH}

@app.get("/api/video-info")
async def get_video_info(url: str):
    """Get video information"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'noplaylist': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = []
            seen_qualities = set()
            
            for f in info.get('formats', []):
                height = f.get('height')
                if height and height not in seen_qualities:
                    formats.append({
                        'format_id': f['format_id'],
                        'resolution': f"{height}p",
                        'ext': f.get('ext', 'mp4'),
                        'filesize': f.get('filesize') or f.get('filesize_approx', 0),
                        'has_audio': f.get('acodec') != 'none',
                    })
                    seen_qualities.add(height)
            
            formats.sort(key=lambda x: int(x['resolution'].replace('p', '')), reverse=True)
            
            return {
                'success': True,
                'data': {
                    'title': info.get('title', 'Unknown'),
                    'duration': info.get('duration_string', 'Unknown'),
                    'thumbnail': info.get('thumbnail', ''),
                    'uploader': info.get('uploader', 'Unknown'),
                    'formats': formats[:10],
                }
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/download")
async def download_video(request: Request):
    """Download video with selected quality"""
    try:
        data = await request.json()
        url = data.get('url')
        quality = data.get('quality', 'best')
        
        if not url:
            raise HTTPException(status_code=400, detail="URL is required")
        
        download_id = str(int(time.time()))
        is_audio = (quality == 'audio')
        
        # Build format string based on quality
        if is_audio:
            format_str = 'bestaudio/best'
        elif quality == 'best':
            format_str = 'bestvideo+bestaudio/best'
        else:
            height = quality.replace('p', '')
            format_str = f'bestvideo[height<={height}]+bestaudio/best[height<={height}]'
        
        ydl_opts = {
            'format': format_str,
            'noplaylist': True,
            'outtmpl': str(DOWNLOAD_DIR / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'ffmpeg_location': FFMPEG_PATH,  # Explicit ffmpeg path
        }
        
        if is_audio:
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        else:
            ydl_opts['merge_output_format'] = 'mp4'
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
        title = info.get('title', 'video')
        ext = 'mp3' if is_audio else 'mp4'
        
        # Sanitize filename
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{safe_title}.{ext}"
        
        # Find downloaded file
        filepath = None
        for f in DOWNLOAD_DIR.glob(f"*{download_id}*"):
            filepath = f
            break
        
        if not filepath:
            all_files = sorted(DOWNLOAD_DIR.glob("*"), key=lambda x: x.stat().st_mtime, reverse=True)
            for f in all_files:
                if f.is_file():
                    filepath = f
                    break
        
        if filepath:
            new_path = DOWNLOAD_DIR / filename
            if new_path.exists():
                new_path.unlink()
            filepath.rename(new_path)
            
            file_size = os.path.getsize(new_path)
            size_mb = file_size / (1024 * 1024)
            
            return {
                'success': True,
                'data': {
                    'title': safe_title,
                    'filename': filename,
                    'filesize': f"{size_mb:.1f} MB",
                    'download_url': f'/api/download-file/{filename}',
                }
            }
        else:
            raise HTTPException(status_code=500, detail="File not found after download")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download-file/{filename}")
async def get_file(filename: str):
    """Download the file"""
    filepath = DOWNLOAD_DIR / filename
    if filepath.exists():
        return FileResponse(
            path=str(filepath),
            filename=filename,
            media_type='application/octet-stream'
        )
    raise HTTPException(status_code=404, detail="File not found")

@app.on_event("startup")
async def startup_event():
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    print(f"📁 Downloads: {DOWNLOAD_DIR}")
    print(f"🔧 FFmpeg: {FFMPEG_PATH}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)