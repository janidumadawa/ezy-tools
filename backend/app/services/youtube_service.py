import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os
import subprocess

class YouTubeService(BaseDownloader):
    """YouTube download service"""
    
    def get_video_info(self, url: str) -> dict:
        """Get YouTube video information"""
        try:
            video_id = self._extract_id(url)
            
            # Use oEmbed API (never blocked)
            import requests
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
            raise Exception(f"Failed to fetch video: {str(e)}")
    
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
    
    def download(self, url: str, quality: str = 'best') -> dict:
        """Download using yt-dlp with multiple fallback methods"""
        download_id = str(int(time.time()))
        is_audio = (quality == 'audio')
        
        # Try different methods in order
        methods = [
            self._download_android,
            self._download_ios,
            self._download_web,
        ]
        
        last_error = None
        for method in methods:
            try:
                return method(url, download_id, is_audio, quality)
            except Exception as e:
                last_error = str(e)
                continue
        
        raise Exception(f"All download methods failed. Last error: {last_error}")
    
    def _download_android(self, url, download_id, is_audio, quality):
        """Try Android client"""
        ydl_opts = {
            'format': 'bestaudio/best' if is_audio else 'best[height<=720]/best',
            'noplaylist': True,
            'outtmpl': str(self.download_dir / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'extractor_args': {'youtube': {'player_client': ['android']}},
            'http_headers': {'User-Agent': 'com.google.android.youtube/19.09.37 (Linux; U; Android 13)'},
            'merge_output_format': 'mp4',
        }
        return self._do_download(url, download_id, is_audio, ydl_opts)
    
    def _download_ios(self, url, download_id, is_audio, quality):
        """Try iOS client"""
        ydl_opts = {
            'format': 'bestaudio/best' if is_audio else 'best[height<=720]/best',
            'noplaylist': True,
            'outtmpl': str(self.download_dir / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'extractor_args': {'youtube': {'player_client': ['ios']}},
            'http_headers': {'User-Agent': 'com.apple.mobilesafari/16.0 (iPhone; U; CPU iPhone OS 16_0 like Mac OS X)'},
            'merge_output_format': 'mp4',
        }
        return self._do_download(url, download_id, is_audio, ydl_opts)
    
    def _download_web(self, url, download_id, is_audio, quality):
        """Try web client"""
        ydl_opts = {
            'format': 'bestaudio/best' if is_audio else 'best[height<=720]/best',
            'noplaylist': True,
            'outtmpl': str(self.download_dir / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'http_headers': {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'},
            'merge_output_format': 'mp4',
        }
        return self._do_download(url, download_id, is_audio, ydl_opts)
    
    def _do_download(self, url, download_id, is_audio, ydl_opts):
        """Execute the download"""
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