import yt_dlp
from pathlib import Path
from ..config import DOWNLOADS_DIR, FFMPEG_PATH
import time

class BaseDownloader:
    def __init__(self):
        self.download_dir = DOWNLOADS_DIR
        
    def sanitize_filename(self, title: str) -> str:
        return "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
    
    def get_common_options(self, download_id: str) -> dict:
        return {
            'noplaylist': True,
            'outtmpl': str(self.download_dir / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'ffmpeg_location': FFMPEG_PATH,
        }
    
def find_downloaded_file(self, download_id: str):
    """Find the downloaded file"""
    import glob
    
    # Try exact match first
    for f in self.download_dir.glob(f"*{download_id}*"):
        if f.is_file():
            return f
    
    # Fallback: get most recent file
    all_files = sorted(
        [f for f in self.download_dir.glob("*") if f.is_file()],
        key=lambda x: x.stat().st_mtime,
        reverse=True
    )
    
    return all_files[0] if all_files else None