import os
import tempfile
from pathlib import Path
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
from ..config import DOWNLOADS_DIR

class PDFService:
    def __init__(self):
        self.download_dir = DOWNLOADS_DIR / "pdf_tools"
        self.download_dir.mkdir(parents=True, exist_ok=True)
    
    def merge_pdfs(self, files) -> dict:
        """Merge multiple PDF files"""
        try:
            writer = PdfWriter()
            for file in files:
                reader = PdfReader(file.file)
                for page in reader.pages:
                    writer.add_page(page)
            
            output_filename = f"merged_{self._generate_id()}.pdf"
            output_path = self.download_dir / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            return {
                'success': True,
                'data': {
                    'filename': output_filename,
                    'download_url': f'/api/pdf/file/{output_filename}',
                    'message': f'Merged {len(files)} PDFs successfully'
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def split_pdf(self, file, pages_per_split: int = 1) -> dict:
        """Split PDF into multiple files"""
        try:
            reader = PdfReader(file.file)
            total_pages = len(reader.pages)
            output_files = []
            
            for i in range(0, total_pages, pages_per_split):
                writer = PdfWriter()
                end = min(i + pages_per_split, total_pages)
                
                for page_num in range(i, end):
                    writer.add_page(reader.pages[page_num])
                
                output_filename = f"split_part_{i//pages_per_split + 1}_{self._generate_id()}.pdf"
                output_path = self.download_dir / output_filename
                
                with open(output_path, 'wb') as f:
                    writer.write(f)
                
                output_files.append({
                    'filename': output_filename,
                    'download_url': f'/api/pdf/file/{output_filename}',
                    'pages': f'{i+1}-{end}'
                })
            
            return {
                'success': True,
                'data': {
                    'files': output_files,
                    'total_parts': len(output_files),
                    'message': f'PDF split into {len(output_files)} parts'
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def split_by_ranges(self, file, page_ranges: list) -> dict:
        """Split PDF by custom page ranges like ['1-3', '4-5']"""
        try:
            reader = PdfReader(file.file)
            total_pages = len(reader.pages)
            output_files = []
            
            for i, page_range in enumerate(page_ranges):
                writer = PdfWriter()
                
                if '-' in page_range:
                    start, end = map(int, page_range.split('-'))
                    pages = list(range(start, end + 1))
                else:
                    pages = [int(page_range)]
                
                for page_num in pages:
                    if 1 <= page_num <= total_pages:
                        writer.add_page(reader.pages[page_num - 1])
                
                if len(writer.pages) > 0:
                    filename = f"part_{i+1}_{self._generate_id()}.pdf"
                    filepath = self.download_dir / filename
                    
                    with open(filepath, 'wb') as f:
                        writer.write(f)
                    
                    output_files.append({
                        'filename': filename,
                        'download_url': f'/api/pdf/file/{filename}',
                        'pages': page_range,
                        'part': i + 1
                    })
            
            return {
                'success': True,
                'data': {
                    'files': output_files,
                    'total_parts': len(output_files)
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def compress_pdf(self, file) -> dict:
        """Compress PDF file"""
        try:
            reader = PdfReader(file.file)
            writer = PdfWriter()
            
            for page in reader.pages:
                page.compress_content_streams()
                writer.add_page(page)
            
            output_filename = f"compressed_{self._generate_id()}.pdf"
            output_path = self.download_dir / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            compressed_size = os.path.getsize(output_path)
            
            return {
                'success': True,
                'data': {
                    'filename': output_filename,
                    'download_url': f'/api/pdf/file/{output_filename}',
                    'compressed_size': f'{compressed_size / 1024:.1f} KB',
                    'message': 'PDF compressed successfully'
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def extract_text(self, file) -> dict:
        """Extract text from PDF"""
        try:
            reader = PdfReader(file.file)
            text = ''
            
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n\n'
            
            output_filename = f"extracted_text_{self._generate_id()}.txt"
            output_path = self.download_dir / output_filename
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(text)
            
            return {
                'success': True,
                'data': {
                    'filename': output_filename,
                    'download_url': f'/api/pdf/file/{output_filename}',
                    'text_preview': text[:300] + '...' if len(text) > 300 else text,
                    'total_pages': len(reader.pages)
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def rotate_pdf(self, file, rotation: int = 90) -> dict:
        """Rotate PDF pages"""
        try:
            reader = PdfReader(file.file)
            writer = PdfWriter()
            
            for page in reader.pages:
                page.rotate(rotation)
                writer.add_page(page)
            
            output_filename = f"rotated_{self._generate_id()}.pdf"
            output_path = self.download_dir / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            return {
                'success': True,
                'data': {
                    'filename': output_filename,
                    'download_url': f'/api/pdf/file/{output_filename}',
                    'message': f'PDF rotated by {rotation} degrees'
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def remove_pages(self, file, pages_to_remove: list) -> dict:
        """Remove specific pages from PDF"""
        try:
            reader = PdfReader(file.file)
            writer = PdfWriter()
            total_pages = len(reader.pages)
            
            for i in range(total_pages):
                if i + 1 not in pages_to_remove:
                    writer.add_page(reader.pages[i])
            
            output_filename = f"removed_pages_{self._generate_id()}.pdf"
            output_path = self.download_dir / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            return {
                'success': True,
                'data': {
                    'filename': output_filename,
                    'download_url': f'/api/pdf/file/{output_filename}',
                    'original_pages': total_pages,
                    'removed_pages': pages_to_remove,
                    'remaining_pages': total_pages - len(pages_to_remove),
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def images_to_pdf(self, files) -> dict:
        """Convert images to PDF"""
        try:
            images = []
            for file in files:
                img = Image.open(file.file)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                images.append(img)
            
            output_filename = f"images_to_pdf_{self._generate_id()}.pdf"
            output_path = self.download_dir / output_filename
            
            images[0].save(str(output_path), 'PDF', save_all=True, append_images=images[1:] if len(images) > 1 else [])
            
            return {
                'success': True,
                'data': {
                    'filename': output_filename,
                    'download_url': f'/api/pdf/file/{output_filename}',
                    'message': f'Created PDF from {len(images)} images'
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _generate_id(self):
        import time
        return str(int(time.time()))