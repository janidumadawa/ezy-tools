import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os
import requests
import json

class YouTubeService(BaseDownloader):
    """YouTube download service using free APIs"""
    
    # Free YouTube API endpoints that work
    API_ENDPOINTS = [
        "https://inv.nadeko.net/api/v1/videos/",
        "https://invidious.slipfox.xyz/api/v1/videos/",
        "https://yt.artemislena.eu/api/v1/videos/",
    ]
    
    def get_video_info(self, url: str) -> dict:
        """Get YouTube video information"""
        video_id = self._extract_id(url)
        if not video_id:
            raise Exception("Invalid YouTube URL")
        
        # Try free Invidious API first
        for api_url in self.API_ENDPOINTS:
            try:
                response = requests.get(f"{api_url}{video_id}", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    
                    formats = [
                        {'format_id': 'best', 'resolution': 'Best Quality', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
                        {'format_id': '720p', 'resolution': '720p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
                        {'format_id': '480p', 'resolution': '480p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
                        {'format_id': '360p', 'resolution': '360p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
                        {'format_id': 'audio', 'resolution': 'Audio MP3', 'ext': 'mp3', 'filesize': 0, 'has_audio': True},
                    ]
                    
                    return {
                        'success': True,
                        'data': {
                            'title': data.get('title', 'Unknown'),
                            'duration': self._format_duration(data.get('lengthSeconds', 0)),
                            'thumbnail': f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                            'uploader': data.get('author', 'Unknown'),
                            'formats': formats,
                        }
                    }
            except:
                continue
        
        # Fallback to oEmbed (always works for info)
        try:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
            oembed_data = requests.get(oembed_url, timeout=10).json()
            
            formats = [
                {'format_id': 'best', 'resolution': 'Best Quality', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
                {'format_id': '720p', 'resolution': '720p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
                {'format_id': '480p', 'resolution': '480p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
                {'format_id': '360p', 'resolution': '360p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
                {'format_id': 'audio', 'resolution': 'Audio MP3', 'ext': 'mp3', 'filesize': 0, 'has_audio': True},
            ]
            
            return {
                'success': True,
                'data': {
                    'title': oembed_data.get('title', 'Unknown'),
                    'duration': 'Unknown',
                    'thumbnail': f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                    'uploader': oembed_data.get('author_name', 'Unknown'),
                    'formats': formats,
                }
            }
        except Exception as e:
            raise Exception(f"Failed to fetch video info: {str(e)}")
    
    def download(self, url: str, quality: str = 'best') -> dict:
        """Download using free API"""
        video_id = self._extract_id(url)
        if not video_id:
            raise Exception("Invalid YouTube URL")
        
        download_id = str(int(time.time()))
        is_audio = (quality == 'audio')
        
        # Try downloading via Invidious API
        for api_url in self.API_ENDPOINTS:
            try:
                response = requests.get(f"{api_url}{video_id}", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    
                    # Get download URL from Invidious
                    download_url = None
                    
                    if is_audio:
                        # Get audio stream
                        for fmt in data.get('adaptiveFormats', []):
                            if 'audio' in fmt.get('type', ''):
                                download_url = fmt.get('url')
                                break
                    else:
                        # Get video+audio combined
                        for fmt in data.get('formatStreams', []):
                            download_url = fmt.get('url')
                            if download_url:
                                break
                    
                    if download_url:
                        return self._download_from_url(download_url, download_id, is_audio, data.get('title', 'video'))
            except:
                continue
        
        # Last resort: try yt-dlp with cookies workaround
        try:
            return self._download_ytdlp_fallback(url, download_id, is_audio)
        except Exception as e:
            raise Exception(f"Download failed. YouTube is blocking server downloads. Try using a VPN or local installation. Error: {str(e)}")
    
    def _download_from_url(self, url: str, download_id: str, is_audio: bool, title: str) -> dict:
        """Download from direct URL"""
        import requests
        
        ext = 'mp3' if is_audio else 'mp4'
        safe_title = self.sanitize_filename(title)
        filename = f"{safe_title}.{ext}"
        filepath = self.download_dir / filename
        
        # Download the file
        response = requests.get(url, stream=True, timeout=300)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
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
    
    def _download_ytdlp_fallback(self, url: str, download_id: str, is_audio: bool) -> dict:
        """Fallback using yt-dlp"""
        format_str = 'bestaudio/best' if is_audio else 'best[height<=360]/best'
        
        ydl_opts = {
            'format': format_str,
            'noplaylist': True,
            'outtmpl': str(self.download_dir / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'extractor_args': {'youtube': {'player_client': ['android_vr']}},
            'http_headers': {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'},
            'merge_output_format': 'mp4',
            'age_limit': 99,
        }
        
        if is_audio:
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '128',
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
        
        raise Exception("File not found")
    
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