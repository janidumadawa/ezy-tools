import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os

class PinterestService(BaseDownloader):
    """Pinterest download service"""
    
    def get_media_info(self, url: str) -> dict:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            return {
                'success': True,
                'data': {
                    'title': info.get('title', 'Pinterest Pin'),
                    'thumbnail': info.get('thumbnail', ''),
                    'type': 'video' if info.get('duration') else 'image',
                    'uploader': info.get('uploader', 'Unknown'),
                }
            }
    
    def download(self, url: str) -> dict:
        download_id = str(int(time.time()))
        
        ydl_opts = self.get_common_options(download_id)
        ydl_opts['format'] = 'best'
        ydl_opts['merge_output_format'] = 'mp4'
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
        
        title = info.get('title', 'pinterest_media')
        ext = info.get('ext', 'mp4')
        safe_title = self.sanitize_filename(title)
        filename = f"{safe_title}.{ext}"
        
        filepath = self.find_downloaded_file(download_id)
        
        if filepath:
            new_path = self.download_dir / filename
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
                }
            }
        
        return {'success': False, 'error': 'File not found'}