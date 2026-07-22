import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os
import requests
from pathlib import Path

class PinterestService(BaseDownloader):
    """Pinterest download service - handles both images and videos"""
    
    def __init__(self):
        super().__init__()
        # Ensure download directory exists
        self.download_dir.mkdir(parents=True, exist_ok=True)
    
    def get_media_info(self, url: str) -> dict:
        """Get basic media info without checking formats"""
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
            'skip_download': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            has_duration = info.get('duration') is not None and info.get('duration', 0) > 0
            
            return {
                'success': True,
                'data': {
                    'title': (info.get('title') or 'Pinterest Pin')[:100],
                    'thumbnail': info.get('thumbnail') or '',
                    'type': 'video' if has_duration else 'image',
                    'uploader': info.get('uploader') or info.get('channel', 'Unknown'),
                }
            }
    
    def download(self, url: str) -> dict:
        """Download Pinterest media"""
        
        # Get info using extract_flat to check type
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
        
        has_duration = info.get('duration') is not None and info.get('duration', 0) > 0
        
        if has_duration:
            return self._download_video(url)
        else:
            return self._download_image(url, info)
    
    def _download_video(self, url: str) -> dict:
        """Download Pinterest video"""
        download_id = str(int(time.time()))
        
        ydl_opts = self.get_common_options(download_id)
        ydl_opts['format'] = 'best'
        ydl_opts['merge_output_format'] = 'mp4'
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
        
        title = info.get('title', 'pinterest_video')[:50]
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
                    'type': 'video',
                }
            }
        raise Exception("Video file not found")
    
    def _download_image(self, url: str, info: dict) -> dict:
        """Download Pinterest image by direct URL"""
        
        # Get full info to find image URL
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                full_info = ydl.extract_info(url, download=False)
        except:
            full_info = info
        
        # Find image URL
        image_url = full_info.get('thumbnail', '')
        
        # Try to get original size image
        entries = full_info.get('entries', [])
        if entries and entries[0].get('url'):
            image_url = entries[0]['url']
        elif full_info.get('url'):
            image_url = full_info['url']
        
        if not image_url:
            raise Exception("No image URL found. Try a different pin.")
        
        # Get extension
        ext = 'jpg'
        clean_url = image_url.split('?')[0].split('#')[0]
        if '.png' in clean_url:
            ext = 'png'
        elif '.webp' in clean_url:
            ext = 'webp'
        
        title = full_info.get('title', 'pinterest_image')[:50]
        safe_title = self.sanitize_filename(title)
        filename = f"{safe_title}.{ext}"
        filepath = self.download_dir / filename
        
        print(f"📥 Downloading image to: {filepath}")
        print(f"🔗 Image URL: {image_url[:100]}...")
        
        # Download with proper headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': 'https://www.pinterest.com/',
        }
        
        try:
            resp = requests.get(image_url, stream=True, timeout=60, headers=headers)
            resp.raise_for_status()
            
            with open(filepath, 'wb') as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
        except Exception as e:
            raise Exception(f"Failed to download image: {str(e)}")
        
        if not filepath.exists():
            raise Exception(f"File was not created at {filepath}")
        
        file_size = os.path.getsize(filepath)
        size_mb = file_size / (1024 * 1024)
        
        print(f"✅ Downloaded: {filename} ({size_mb:.2f} MB)")
        
        return {
            'success': True,
            'data': {
                'title': safe_title,
                'filename': filename,
                'filesize': f"{size_mb:.1f} MB",
                'type': 'image',
            }
        }