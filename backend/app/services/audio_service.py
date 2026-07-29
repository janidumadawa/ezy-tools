import subprocess
import os
import time
from pathlib import Path
from ..config import DOWNLOADS_DIR

class AudioService:
    def __init__(self):
        self.download_dir = DOWNLOADS_DIR / "audio"
        self.download_dir.mkdir(parents=True, exist_ok=True)
    
    def convert_audio(self, file, target_format: str = 'mp3') -> dict:
        """Convert audio using ffmpeg directly"""
        try:
            original_name = Path(file.filename).stem
            safe_name = "".join(c for c in original_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
            
            # Save uploaded file
            temp_path = self.download_dir / f"temp_{int(time.time())}{Path(file.filename).suffix}"
            with open(temp_path, 'wb') as f:
                f.write(file.file.read())
            
            original_ext = Path(file.filename).suffix.replace('.', '').upper()
            output_filename = f"{safe_name}.{target_format}"
            output_path = self.download_dir / output_filename
            
            # Use ffmpeg for conversion
            cmd = [
                'ffmpeg', '-i', str(temp_path),
                '-y',  # Overwrite output
                str(output_path)
            ]
            
            subprocess.run(cmd, capture_output=True, check=True, timeout=120)
            
            # Cleanup temp file
            if temp_path.exists():
                os.unlink(temp_path)
            
            if not output_path.exists():
                return {'success': False, 'error': 'Conversion failed - output file not created'}
            
            file_size = os.path.getsize(output_path)
            
            return {
                'success': True,
                'data': {
                    'filename': output_filename,
                    'download_url': f'/api/audio/file/{output_filename}',
                    'filesize': f'{file_size / (1024 * 1024):.1f} MB',
                    'original_format': original_ext,
                    'target_format': target_format.upper(),
                    'message': f'{original_ext} → {target_format.upper()}'
                }
            }
        except subprocess.CalledProcessError as e:
            error_msg = e.stderr.decode() if e.stderr else str(e)
            return {'success': False, 'error': f'FFmpeg error: {error_msg[:200]}'}
        except Exception as e:
            return {'success': False, 'error': str(e)}