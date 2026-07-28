import qrcode
import io
import base64
from pathlib import Path
from PIL import Image
from ..config import DOWNLOADS_DIR

class QRService:
    def __init__(self):
        self.download_dir = DOWNLOADS_DIR / "qr_codes"
        self.download_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_qr(self, data: str, size: int = 300, color: str = "#000000", bg_color: str = "#FFFFFF", logo_file=None) -> dict:
        """Generate QR code with optional logo"""
        try:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction for logo
                box_size=10,
                border=4,
            )
            qr.add_data(data)
            qr.make(fit=True)
            
            # Create QR image
            img = qr.make_image(fill_color=color, back_color=bg_color).convert('RGB')
            img = img.resize((size, size))
            
            # Add logo if provided
            if logo_file:
                try:
                    logo = Image.open(logo_file.file)
                    # Calculate logo size (20% of QR size)
                    logo_size = int(size * 0.2)
                    logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
                    
                    # Create white background for logo
                    logo_bg = Image.new('RGB', (logo_size + 10, logo_size + 10), 'white')
                    logo_bg.paste(logo, (5, 5))
                    
                    # Calculate position to center
                    pos = ((size - logo_bg.size[0]) // 2, (size - logo_bg.size[1]) // 2)
                    img.paste(logo_bg, pos)
                except:
                    pass  # Skip logo if error
            
            # Save to file
            import time
            filename = f"qrcode_{int(time.time())}.png"
            filepath = self.download_dir / filename
            img.save(str(filepath), 'PNG')
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            return {
                'success': True,
                'data': {
                    'filename': filename,
                    'download_url': f'/api/qr/file/{filename}',
                    'preview': f'data:image/png;base64,{img_base64}',
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}