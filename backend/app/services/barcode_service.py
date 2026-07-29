import barcode
from barcode.writer import ImageWriter
import io
import base64
import time
from pathlib import Path
from ..config import DOWNLOADS_DIR

class BarcodeService:
    def __init__(self):
        self.download_dir = DOWNLOADS_DIR / "barcodes"
        self.download_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_barcode(self, data: str, barcode_type: str = 'code128') -> dict:
        """Generate barcode"""
        try:
            if not data.strip():
                return {'success': False, 'error': 'Please enter data'}
            
            # Map types
            types = {
                'ean13': barcode.EAN13,
                'ean8': barcode.EAN8,
                'code128': barcode.Code128,
                'code39': barcode.Code39,
                'upca': barcode.UPCA,
            }
            
            barcode_class = types.get(barcode_type, barcode.Code128)
            
            # Generate
            code = barcode_class(data, writer=ImageWriter())
            
            # Save
            filename = f"barcode_{int(time.time())}"
            filepath = self.download_dir / filename
            code.save(str(filepath))
            
            # Read image for preview
            with open(f"{filepath}.png", 'rb') as f:
                img_base64 = base64.b64encode(f.read()).decode()
            
            return {
                'success': True,
                'data': {
                    'filename': f'{filename}.png',
                    'download_url': f'/api/barcode/file/{filename}.png',
                    'preview': f'data:image/png;base64,{img_base64}',
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}