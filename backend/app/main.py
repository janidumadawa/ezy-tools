from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import CORS_ORIGINS, FFMPEG_PATH
from .routers import youtube, instagram, facebook, pdf, tiktok, pinterest, reddit, twitter, converter  # Import the new router

app = FastAPI(title="EzyTools API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(youtube.router)
app.include_router(instagram.router)  # Add this
app.include_router(facebook.router)  # Add this
app.include_router(pdf.router)  # Add this
app.include_router(tiktok.router)  # Add this
app.include_router(pinterest.router)  # Add this
app.include_router(reddit.router)  # Add this
app.include_router(twitter.router)  # Add this
app.include_router(converter.router)  # Include the converter router

@app.get("/")
async def root():
    return {
        "name": "EzyTools API",
        "version": "1.0.0",
        "ffmpeg": "Found" if FFMPEG_PATH else "Not Found",
        "tools": ["youtube", "instagram", "facebook", "pdf", "tiktok", "pinterest", "reddit"]  # Update tools list
    }