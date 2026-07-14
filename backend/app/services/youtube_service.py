import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os
import requests
import json

class YouTubeService(BaseDownloader):
    """YouTube download service with fallback methods"""
    
    # List of Invidious instances (free YouTube proxies)
    INVIDIOUS_INSTANCES = [
        "https://invidious.fdn.fr",
        "https://invidious.snopyta.org",
        "https://yewtu.be",
        "https://invidious.kavin.rocks",
        "https://vid.puffyan.us",
    ]
    
    def get_video_info(self, url: str) -> dict:
        """Get YouTube video information"""
        # Try Invidious first (more reliable on servers)
        try:
            return self._get_info_invidious(url)
        except:
            pass
        
        # Fallback to yt-dlp with multiple clients
        return self._get_info_ytdlp(url)
    
    def _get_info_ytdlp(self, url: str) -> dict:
        """Get info using yt-dlp"""
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'noplaylist': True,
            'extractor_args': {
                'youtube': {
                    'player_client': ['android', 'ios', 'web_embedded', 'tv_embedded'],
                }
            },
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = []
            seen_qualities = set()
            
            for f in info.get('formats', []):
                height = f.get('height')
                if height and height not in seen_qualities:
                    formats.append({
                        'format_id': f['format_id'],
                        'resolution': f"{height}p",
                        'ext': f.get('ext', 'mp4'),
                        'filesize': f.get('filesize') or f.get('filesize_approx', 0),
                        'has_audio': f.get('acodec') != 'none',
                    })
                    seen_qualities.add(height)
            
            formats.sort(key=lambda x: int(x['resolution'].replace('p', '')), reverse=True)
            
            return {
                'success': True,
                'data': {
                    'title': info.get('title', 'Unknown'),
                    'duration': info.get('duration_string', 'Unknown'),
                    'thumbnail': info.get('thumbnail', ''),
                    'uploader': info.get('uploader', 'Unknown'),
                    'formats': formats[:10],
                }
            }
    
    def _get_info_invidious(self, url: str) -> dict:
        """Get info using Invidious API"""
        # Extract video ID from URL
        video_id = self._extract_video_id(url)
        if not video_id:
            raise Exception("Invalid YouTube URL")
        
        # Try each Invidious instance
        for instance in self.INVIDIOUS_INSTANCES:
            try:
                api_url = f"{instance}/api/v1/videos/{video_id}"
                response = requests.get(api_url, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    formats = []
                    seen_qualities = set()
                    
                    for fmt in data.get('formatStreams', []) + data.get('adaptiveFormats', []):
                        quality = fmt.get('qualityLabel', '')
                        if quality and quality not in seen_qualities:
                            height = quality.replace('p', '')
                            formats.append({
                                'format_id': fmt.get('itag', ''),
                                'resolution': quality,
                                'ext': fmt.get('container', 'mp4'),
                                'filesize': int(fmt.get('size', 0)) if fmt.get('size') else 0,
                                'has_audio': 'audio' in fmt.get('type', ''),
                            })
                            seen_qualities.add(quality)
                    
                    return {
                        'success': True,
                        'data': {
                            'title': data.get('title', 'Unknown'),
                            'duration': self._format_duration(data.get('lengthSeconds', 0)),
                            'thumbnail': f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                            'uploader': data.get('author', 'Unknown'),
                            'formats': formats[:10] if formats else [],
                        }
                    }
            except:
                continue
        
        raise Exception("All Invidious instances failed")
    
    def download(self, url: str, quality: str = 'best') -> dict:
        """Download YouTube video"""
        download_id = str(int(time.time()))
        is_audio = (quality == 'audio')
        
        if is_audio:
            format_str = 'bestaudio/best'
        elif quality == 'best':
            format_str = 'bestvideo+bestaudio/best'
        else:
            height = quality.replace('p', '')
            format_str = f'bestvideo[height<={height}]+bestaudio/best[height<={height}]'
        
        ydl_opts = self.get_common_options(download_id)
        ydl_opts.update({
            'format': format_str,
            'extractor_args': {
                'youtube': {
                    'player_client': ['android', 'ios', 'web_embedded'],
                }
            },
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            },
        })
        
        if is_audio:
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        else:
            ydl_opts['merge_output_format'] = 'mp4'
        
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
        
        return {'success': False, 'error': 'File not found after download'}
    
    def _extract_video_id(self, url: str) -> str:
        """Extract YouTube video ID from URL"""
        import re
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]+)',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return ""
    
    def _format_duration(self, seconds: int) -> str:
        """Format seconds to HH:MM:SS"""
        if not seconds:
            return "Unknown"
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        if hours > 0:
            return f"{hours}:{minutes:02d}:{secs:02d}"
        return f"{minutes}:{secs:02d}"