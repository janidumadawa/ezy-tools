import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os

class InstagramService(BaseDownloader):
    """Instagram download service using yt-dlp"""
    
    def get_media_info(self, url: str) -> dict:
        """Get Instagram media information"""
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }
        
        try:
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
        except Exception as e:
            raise Exception(f"Failed to fetch media: {str(e)}")
    
    def download(self, url: str) -> dict:
        """Download Instagram media"""
        download_id = str(int(time.time()))
        
        ydl_opts = self.get_common_options(download_id)
        ydl_opts['format'] = 'best'  # Best quality
        
        try:
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
            
            return {'success': False, 'error': 'File not found after download'}
            
        except Exception as e:
            raise Exception(f"Download failed: {str(e)}")