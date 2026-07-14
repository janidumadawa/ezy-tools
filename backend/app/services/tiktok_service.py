import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os

class TikTokService(BaseDownloader):
    """TikTok video download service"""
    
    def get_video_info(self, url: str) -> dict:
        """Get TikTok video information"""
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                return {
                    'success': True,
                    'data': {
                        'title': info.get('title', 'TikTok Video')[:100],
                        'duration': info.get('duration_string', 'Unknown'),
                        'thumbnail': info.get('thumbnail', ''),
                        'uploader': info.get('uploader', 'Unknown'),
                        'description': info.get('description', '')[:200],
                    }
                }
        except Exception as e:
            raise Exception(f"Failed to fetch video: {str(e)}")
    
    def download(self, url: str, with_watermark: bool = False) -> dict:
        """Download TikTok video"""
        download_id = str(int(time.time()))
        
        ydl_opts = self.get_common_options(download_id)
        ydl_opts['format'] = 'best'
        ydl_opts['merge_output_format'] = 'mp4'
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
            
            title = info.get('title', 'tiktok_video')[:50]
            safe_title = self.sanitize_filename(title)
            filename = f"{safe_title}.mp4"
            
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
            
            return {'success': False, 'error': 'File not found after download'}
            
        except Exception as e:
            raise Exception(f"Download failed: {str(e)}")