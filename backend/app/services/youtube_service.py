import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os
import requests

class YouTubeService(BaseDownloader):
    """YouTube download service"""
    
    def get_video_info(self, url: str) -> dict:
        """Get YouTube video information"""
        try:
            # Extract video ID
            video_id = self._extract_id(url)
            
            # Use oEmbed API (no blocking)
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
            oembed_data = requests.get(oembed_url, timeout=10).json()
            
            # Get thumbnail
            thumbnail = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
            
            # Try yt-dlp with mobile client
            formats = self._get_formats(url)
            
            return {
                'success': True,
                'data': {
                    'title': oembed_data.get('title', 'Unknown'),
                    'duration': 'Unknown',
                    'thumbnail': thumbnail,
                    'uploader': oembed_data.get('author_name', 'Unknown'),
                    'formats': formats,
                }
            }
        except Exception as e:
            raise Exception(f"Failed to fetch video: {str(e)}")
    
    def _extract_id(self, url: str) -> str:
        """Extract YouTube video ID"""
        import re
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/shorts/)([a-zA-Z0-9_-]+)',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return ""
    
    def _get_formats(self, url: str) -> list:
        """Get available formats"""
        # Return common formats as fallback
        return [
            {'format_id': 'best', 'resolution': 'Best Quality', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
            {'format_id': '1080p', 'resolution': '1080p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
            {'format_id': '720p', 'resolution': '720p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
            {'format_id': '480p', 'resolution': '480p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
            {'format_id': '360p', 'resolution': '360p', 'ext': 'mp4', 'filesize': 0, 'has_audio': True},
        ]
    
    def download(self, url: str, quality: str = 'best') -> dict:
        """Download YouTube video"""
        download_id = str(int(time.time()))
        is_audio = (quality == 'audio')
        
        # Use simple format
        if is_audio:
            format_str = 'bestaudio/best'
        else:
            format_str = 'best[height<=720]/best'
        
        ydl_opts = {
            'format': format_str,
            'noplaylist': True,
            'outtmpl': str(self.download_dir / f'%(title)s_{download_id}.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            # Key: Use Android client
            'extractor_args': {
                'youtube': {
                    'player_client': ['android'],
                }
            },
            'http_headers': {
                'User-Agent': 'com.google.android.youtube/19.09.37 (Linux; U; Android 13; US)',
            },
            'merge_output_format': 'mp4',
        }
        
        if is_audio:
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        
        try:
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
            
            return {'success': False, 'error': 'File not found'}
            
        except Exception as e:
            # Fallback: try with web client
            ydl_opts['extractor_args']['youtube']['player_client'] = ['web']
            ydl_opts['http_headers']['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            
            try:
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
                    
                    return {
                        'success': True,
                        'data': {
                            'title': safe_title,
                            'filename': filename,
                            'filesize': f"{os.path.getsize(new_path) / (1024 * 1024):.1f} MB",
                        }
                    }
            except:
                pass
            
            raise Exception(f"Download failed: {str(e)}")