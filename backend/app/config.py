from pathlib import Path
import subprocess
import os

DOWNLOADS_DIR = Path.home() / "Downloads" / "YouTubeDownloads"
DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)

CORS_ORIGINS = [
    "http://localhost:3000",
    "https://ezy-tools.vercel.app",  # Your Vercel domain
    "https://*.vercel.app",
]

FFMPEG_PATH = None
try:
    result = subprocess.run(['where', 'ffmpeg'], capture_output=True, text=True, shell=True)
    if result.returncode == 0:
        FFMPEG_PATH = result.stdout.strip().split('\n')[0]
except:
    pass