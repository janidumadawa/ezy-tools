from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from typing import List
from ..services.pdf_service import PDFService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/pdf", tags=["pdf"])
service = PDFService()

pdf_dir = DOWNLOADS_DIR / "pdf_tools"
pdf_dir.mkdir(parents=True, exist_ok=True)

@router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    try:
        result = service.merge_pdfs(files)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/split")
async def split_pdf(file: UploadFile = File(...), pages_per_split: int = Form(1)):
    try:
        result = service.split_pdf(file, pages_per_split)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/split-custom")
async def split_custom(file: UploadFile = File(...), ranges: str = Form(...)):
    try:
        page_ranges = [r.strip() for r in ranges.split(',')]
        result = service.split_by_ranges(file, page_ranges)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compress")
async def compress_pdf(file: UploadFile = File(...)):
    try:
        result = service.compress_pdf(file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        result = service.extract_text(file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rotate")
async def rotate_pdf(file: UploadFile = File(...), rotation: int = Form(90)):
    try:
        result = service.rotate_pdf(file, rotation)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/remove-pages")
async def remove_pages(file: UploadFile = File(...), pages: str = Form(...)):
    try:
        pages_list = [int(p.strip()) for p in pages.split(',')]
        result = service.remove_pages(file, pages_list)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/images-to-pdf")
async def images_to_pdf(files: List[UploadFile] = File(...)):
    try:
        result = service.images_to_pdf(files)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{filename}")
async def get_file(filename: str):
    filepath = pdf_dir / filename
    if filepath.exists():
        return FileResponse(path=str(filepath), filename=filename, media_type='application/octet-stream')
    raise HTTPException(status_code=404, detail="File not found")