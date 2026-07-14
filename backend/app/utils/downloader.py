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
        filepath = None
        for f in self.download_dir.glob(f"*{download_id}*"):
            filepath = f
            break
        
        if not filepath:
            all_files = sorted(self.download_dir.glob("*"), key=lambda x: x.stat().st_mtime, reverse=True)
            for f in all_files:
                if f.is_file():
                    filepath = f
                    break
        return filepath