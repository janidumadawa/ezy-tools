import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os
import requests
import json

class YouTubeService(BaseDownloader):
    """YouTube download service with cloud-friendly methods"""
    
    # Free Invidious instances (work on cloud servers)
    INVIDIOUS_INSTANCES = [
        "https://inv.nadeko.net",
        "https://invidious.slipfox.xyz",
        "https://yt.artemislena.eu",
        "https://invidious.privacydev.net",
        "https://iv.nboeck.de",
    ]
    
    def get_video_info(self, url: str) -> dict:
        """Get YouTube video info using Invidious API"""
        video_id = self._extract_id(url)
        if not video_id:
            raise Exception("Invalid YouTube URL")
        
        # Try Invidious first (works on cloud)
        for instance in self.INVIDIOUS_INSTANCES:
            try:
                api_url = f"{instance}/api/v1/videos/{video_id}"
                resp = requests.get(api_url, timeout=10)
                
                if resp.status_code == 200:
                    data = resp.json()
                    
                    return {
                        'success': True,
                        'data': {
                            'title': data.get('title', 'Unknown'),
                            'duration': self._format_duration(data.get('lengthSeconds', 0)),
                            'thumbnail': f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                            'uploader': data.get('author', 'Unknown'),
                            'formats': self._get_default_formats(),
                        }
                    }
            except:
                continue
        
        # Fallback to yt-dlp
        return self._get_info_ytdlp(url)
    
    def _get_info_ytdlp(self, url: str) -> dict:
        """Fallback using yt-dlp"""
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'noplaylist': True,
            'extractor_args': {
                'youtube': {
                    'player_client': ['android', 'ios'],
                }
            },
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
            },
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            return {
                'success': True,
                'data': {
                    'title': info.get('title', 'Unknown'),
                    'duration': info.get('duration_string', 'Unknown'),
                    'thumbnail': info.get('thumbnail', ''),
                    'uploader': info.get('uploader', 'Unknown'),
                    'formats': self._get_default_formats(),
                }
            }
    
    def download(self, url: str, quality: str = 'best') -> dict:
        """Download YouTube video"""
        video_id = self._extract_id(url)
        download_id = str(int(time.time()))
        is_audio = (quality == 'audio')
        
        # Try Invidious direct download
        for instance in self.INVIDIOUS_INSTANCES:
            try:
                api_url = f"{instance}/api/v1/videos/{video_id}"
                resp = requests.get(api_url, timeout=10)
                
                if resp.status_code == 200:
                    data = resp.json()
                    
                    # Get download URL
                    download_url = None
                    if is_audio:
                        for fmt in data.get('adaptiveFormats', []):
                            if 'audio' in fmt.get('type', ''):
                                download_url = fmt.get('url')
                                break
                    else:
                        for fmt in data.get('formatStreams', []):
                            if fmt.get('url'):
                                download_url = fmt.get('url')
                                break
                    
                    if download_url:
                        return self._download_from_url(download_url, is_audio, data.get('title', 'video'))
            except:
                continue
        
        # Fallback to yt-dlp
        return self._download_ytdlp(url, download_id, is_audio)
    
    def _download_from_url(self, url: str, is_audio: bool, title: str) -> dict:
        """Download from direct URL"""
        ext = 'mp3' if is_audio else 'mp4'
        safe_title = self.sanitize_filename(title)
        filename = f"{safe_title}.{ext}"
        filepath = self.download_dir / filename
        
        resp = requests.get(url, stream=True, timeout=300)
        resp.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        
        file_size = os.path.getsize(filepath)
        size_mb = file_size / (1024 * 1024)
        
        return {
            'success': True,
            'data': {
                'title': safe_title,
                'filename': filename,
                'filesize': f"{size_mb:.1f} MB",
            }
        }
    
    def _download_ytdlp(self, url: str, download_id: str, is_audio: bool) -> dict:
        """Fallback yt-dlp download"""
        format_str = 'bestaudio/best' if is_audio else 'best[height<=720]/best'
        
        ydl_opts = {
            'format': format_str,
            'noplaylist': True,
            'outtmpl': str(self.download_dir / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'extractor_args': {'youtube': {'player_client': ['android']}},
            'http_headers': {'User-Agent': 'com.google.android.youtube/19.09.37 (Linux; U; Android 13)'},
            'merge_output_format': 'mp4',
        }
        
        if is_audio:
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
        
        title = info.get('title', 'video')
        ext = 'mp3' if is_audio else 'mp4'
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
        
        raise Exception("File not found after download")
    
    def _get_default_formats(self) -> list:
        """Return standard format options"""
        return [
            {'format_id': 'best', 'resolution': 'Best Quality', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
            {'format_id': '720p', 'resolution': '720p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
            {'format_id': '480p', 'resolution': '480p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
            {'format_id': '360p', 'resolution': '360p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
            {'format_id': 'audio', 'resolution': 'Audio MP3', 'ext': 'mp3', 'filesize': 0, 'has_audio': True},
        ]
    
    def _extract_id(self, url: str) -> str:
        import re
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/shorts/)([a-zA-Z0-9_-]+)',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return ""
    
    def _format_duration(self, seconds) -> str:
        if not seconds:
            return "Unknown"
        seconds = int(seconds)
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        if hours > 0:
            return f"{hours}:{minutes:02d}:{secs:02d}"
        return f"{minutes}:{secs:02d}"