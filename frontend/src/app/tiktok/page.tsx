'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Download, Loader2, CheckCircle, AlertCircle, Music2, Play } from 'lucide-react'

// const API_URL = 'http://localhost:8000/api/tiktok'
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/tiktok`

interface VideoInfo {
  title: string
  duration: string
  thumbnail: string
  uploader: string
  description: string
}

export default function TikTokPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const fetchVideo = async () => {
    if (!url.trim()) {
      setError('Please enter a TikTok URL')
      return
    }

    setLoading(true)
    setError('')
    setVideoInfo(null)

    try {
      const response = await axios.get(`${API_URL}/info`, {
        params: { url }
      })

      if (response.data.success) {
        setVideoInfo(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch video')
    } finally {
      setLoading(false)
    }
  }

  const downloadVideo = async () => {
    if (!videoInfo) return

    setDownloading(true)
    setDownloadComplete(false)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/download`, { url })

      if (response.data.success) {
        const filename = response.data.data.filename
        // const downloadUrl = `http://localhost:8000/api/tiktok/file/${filename}`
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/tiktok/file/${filename}`
        window.open(downloadUrl, '_blank')
        setDownloadComplete(true)
        setTimeout(() => setDownloadComplete(false), 5000)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

            {/* Background Facebook Logo Watermark */}
            <div className="absolute top-10 right-[-120px] pointer-events-none -z-10">
                <img
                    src="/logos/tik-tok.png"
                    alt=""
                    className="w-[500px] h-[500px] object-contain opacity-[0.06] blur-sm"
                />
            </div>

            <div className="absolute top-40 left-[10px] pointer-events-none -z-10">
                <img
                    src="/logos/tik-tok.png"
                    alt=""
                    className="w-[400px] h-[400px] object-contain opacity-[0.3] blur-sm rotate-22"
                />
            </div>
            

      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1">
        &larr; Back to Home
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-cyan-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src="/logos/tik-tok.png" alt="TikTok Logo" className="w-8 h-8 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          TikTok <span className="text-gray-800">Downloader</span>
        </h1>
        <p className="text-gray-500">
          Download TikTok videos without watermark
        </p>
        <p className="text-sm text-gray-400 mt-1">
          TikTok වීඩියෝ පහසුවෙන් Download කරගන්න
        </p>
      </div>




      {/* URL Input */}
      <div className="mb-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 focus-within:border-black focus-within:shadow-lg transition-all">
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 bg-cyan-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src="/logos/tik-tok.png" alt="TikTok Logo" className="w-5 h-5 object-contain" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste TikTok video URL..."
              className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && fetchVideo()}
            />
            <button
              onClick={fetchVideo}
              disabled={loading}
              className="px-6 py-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Analyze
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
          <p className="text-sm text-gray-600">Fetching video...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Video Info */}
      {videoInfo && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Thumbnail */}
          {videoInfo.thumbnail && (
            <div className="relative bg-gray-900 aspect-[9/16] max-h-[400px] mx-auto">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-black ml-1" />
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {videoInfo.title}
            </h2>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span>@{videoInfo.uploader}</span>
              <span>•</span>
              <span>{videoInfo.duration}</span>
            </div>

            {videoInfo.description && (
              <p className="text-sm text-gray-400 mb-6 line-clamp-3">
                {videoInfo.description}
              </p>
            )}

            <button
              onClick={downloadVideo}
              disabled={downloading}
              className="w-full py-3.5 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              {downloading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</>
              ) : downloadComplete ? (
                <><CheckCircle className="w-4 h-4" /> Downloaded!</>
              ) : (
                <><Download className="w-4 h-4" /> Download Video</>
              )}
            </button>

            {downloadComplete && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-sm text-green-700">Saved to Downloads folder</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}