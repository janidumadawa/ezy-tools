import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os
import requests

class InstagramService(BaseDownloader):
    """Instagram download service"""
    
    # Free Instagram API endpoints
    API_ENDPOINTS = [
        "https://api.rapidapi.com/instagram-downloader-download-instagram-videos-stories-reels-photos.p.rapidapi.com",
    ]
    
    def get_media_info(self, url: str) -> dict:
        """Get Instagram media info"""
        # Try yt-dlp with multiple clients
        clients = ['android', 'ios', 'web']
        
        for client in clients:
            try:
                ydl_opts = {
                    'quiet': True,
                    'no_warnings': True,
                    'extract_flat': False,
                    'extractor_args': {'instagram': {'client': client}},
                    'http_headers': {
                        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
                    },
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=False)
                    
                    media_type = 'video' if info.get('duration') else 'image'
                    
                    return {
                        'success': True,
                        'data': {
                            'title': info.get('title', 'Instagram Media'),
                            'thumbnail': info.get('thumbnail', ''),
                            'type': media_type,
                            'duration': info.get('duration_string', None),
                            'uploader': info.get('uploader', 'Unknown'),
                        }
                    }
            except:
                continue
        
        raise Exception("Failed to fetch Instagram media. Try on local version.")
    
    def download(self, url: str) -> dict:
        """Download Instagram media"""
        download_id = str(int(time.time()))
        
        ydl_opts = {
            'format': 'best',
            'noplaylist': True,
            'outtmpl': str(self.download_dir / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'extractor_args': {'instagram': {'client': 'ios'}},
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
            },
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
        
        title = info.get('title', 'instagram_media')
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
                    'type': 'video' if ext == 'mp4' else 'image',
                }
            }
        
        return {'success': False, 'error': 'File not found'}