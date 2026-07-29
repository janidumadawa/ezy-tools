from gtts import gTTS
import os
import time
from pathlib import Path
from ..config import DOWNLOADS_DIR

class TTSService:
    def __init__(self):
        self.download_dir = DOWNLOADS_DIR / "tts"
        self.download_dir.mkdir(parents=True, exist_ok=True)
    
    def text_to_speech(self, text: str, lang: str = 'en', slow: bool = False) -> dict:
        """Convert text to speech"""
        try:
            if not text.strip():
                return {'success': False, 'error': 'Please enter some text'}
            
            filename = f"tts_{int(time.time())}.mp3"
            filepath = self.download_dir / filename
            
            tts = gTTS(text=text, lang=lang, slow=slow)
            tts.save(str(filepath))
            
            return {
                'success': True,
                'data': {
                    'filename': filename,
                    'download_url': f'/api/tts/file/{filename}',
                    'message': 'Audio generated successfully'
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}