from pydantic import BaseModel
from typing import List, Optional

class VideoInfoRequest(BaseModel):
    url: str

class DownloadRequest(BaseModel):
    url: str
    quality: str = "best"

class FormatInfo(BaseModel):
    format_id: str
    resolution: str
    ext: str
    filesize: int
    has_audio: bool

class VideoInfoResponse(BaseModel):
    success: bool
    data: Optional[dict] = None

class DownloadResponse(BaseModel):
    success: bool
    data: Optional[dict] = None