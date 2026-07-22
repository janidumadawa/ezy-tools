from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from ..services.converter_service import ConverterService
from ..config import DOWNLOADS_DIR

router = APIRouter(prefix="/api/converter", tags=["converter"])
service = ConverterService()

converter_dir = DOWNLOADS_DIR / "converted"
converter_dir.mkdir(parents=True, exist_ok=True)

@router.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    try:
        return service.word_to_pdf(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    try:
        return service.pdf_to_word(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image-to-pdf")
async def image_to_pdf(file: UploadFile = File(...)):
    try:
        return service.image_to_pdf(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pdf-to-images")
async def pdf_to_images(file: UploadFile = File(...)):
    try:
        return service.pdf_to_images(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compress-image")
async def compress_image(file: UploadFile = File(...), quality: int = Form(70)):
    try:
        return service.compress_image(file, quality)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/convert-image")
async def convert_image(file: UploadFile = File(...), format: str = Form('png')):
    try:
        return service.convert_image_format(file, format)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{filename}")
async def get_file(filename: str):
    filepath = converter_dir / filename
    if filepath.exists():
        return FileResponse(path=str(filepath), filename=filename, media_type='application/octet-stream')
    raise HTTPException(status_code=404, detail="File not found")



@router.post("/excel-to-pdf")
async def excel_to_pdf(file: UploadFile = File(...)):
    try:
        return service.excel_to_pdf(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resize-image")
async def resize_image(
    file: UploadFile = File(...),
    width: int = Form(None),
    height: int = Form(None),
    percentage: int = Form(None)
):
    try:
        return service.resize_image(file, width, height, percentage)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/text-to-pdf")
async def text_to_pdf(file: UploadFile = File(...)):
    try:
        return service.text_to_pdf(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pptx-to-pdf")
async def pptx_to_pdf(file: UploadFile = File(...)):
    try:
        return service.pptx_to_pdf(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/csv-to-pdf")
async def csv_to_pdf(file: UploadFile = File(...)):
    try:
        return service.csv_to_pdf(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/images-to-pdf")
async def images_to_pdf(files: list[UploadFile] = File(...)):
    try:
        return service.merge_images_to_pdf(files)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))