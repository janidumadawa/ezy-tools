import yt_dlp
from ..utils.downloader import BaseDownloader
import time
import os

class YouTubeService(BaseDownloader):
    def get_video_info(self, url: str) -> dict:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'noplaylist': True,
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
    
    def download(self, url: str, quality: str = 'best') -> dict:
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
        ydl_opts['format'] = format_str
        
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
        
        return {'success': False, 'error': 'File not found'}