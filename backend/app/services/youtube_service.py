import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os

class YouTubeService(BaseDownloader):
    def get_video_info(self, url: str) -> dict:
        """Get YouTube video information"""
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'noplaylist': True,
            # Add these to bypass bot detection
            'extractor_args': {
                'youtube': {
                    'player_client': ['android', 'ios', 'web'],
                    'skip': ['hls', 'dash'],
                }
            },
            # Use a common user agent
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        }
        
        try:
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
        except Exception as e:
            raise Exception(f"Failed to fetch video: {str(e)}")
    
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
                    'player_client': ['android', 'ios', 'web'],
                    'skip': ['hls', 'dash'],
                }
            },
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
            
            return {'success': False, 'error': 'File not found after download'}
            
        except Exception as e:
            raise Exception(f"Download failed: {str(e)}")