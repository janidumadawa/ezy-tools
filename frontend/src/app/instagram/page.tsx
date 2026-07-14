'use client'

import { useState } from 'react'
import axios from 'axios'
import { Download, Loader2, CheckCircle, AlertCircle, Camera, Play, Link } from 'lucide-react'
import Image from "next/image";

// const API_URL = 'http://localhost:8000/api/instagram'
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/instagram`


export default function InstagramPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mediaInfo, setMediaInfo] = useState<any>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const fetchMedia = async () => {
    if (!url.trim()) {
      setError('Please enter an Instagram URL')
      return
    }

    setLoading(true)
    setError('')
    setMediaInfo(null)

    try {
      const response = await axios.get(`${API_URL}/info`, {
        params: { url }
      })

      if (response.data.success) {
        setMediaInfo(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch media')
    } finally {
      setLoading(false)
    }
  }

  const downloadMedia = async () => {
    if (!mediaInfo) return

    setDownloading(true)
    setDownloadComplete(false)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/download`, {
        url
      })

      if (response.data.success) {
        // const downloadUrl = `http://localhost:8000/api/instagram/file/${response.data.data.filename}`
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/instagram/file/${response.data.data.filename}`

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

       {/* Background Instagram Logo Watermark */}
            <div className="absolute top-10 right-[-120px] pointer-events-none -z-10">
                <img
                    src="/logos/instagram.png"
                    alt=""
                    className="w-[500px] h-[500px] object-contain opacity-[0.06] blur-sm"
                />
            </div>

            <div className="absolute top-40 left-[10px] pointer-events-none -z-10">
                <img
                    src="/logos/instagram.png"
                    alt=""
                    className="w-[400px] h-[400px] object-contain opacity-[0.3] blur-sm rotate-22"
                />
            </div>

      {/* Back Button */}
      <div className="mb-6">
        <a href="/" className="text-sm text-[#c13584] hover:text-[#e1306c] transition-colors flex items-center gap-1">
          &larr; Back to Home
        </a>
      </div>

<div className="text-center mb-10">

  <div className="flex items-center justify-center gap-3 mb-3">
    <Image
      src="/logos/instagram.png"
      alt="Instagram Logo"
      width={55}
      height={55}
      className="object-contain"
    />
    <h1 className="text-5xl font-bold text-gray-900">
      Instagram <span className="text-[#e1306c]">Downloader</span>
    </h1>

  </div>

  <h2 className="text-2xl font-semibold text-gray-700 mb-6">
    Instagram වීඩියෝ සහ ඡායාරූප ඩවුන්ලෝඩ් කරගැනීමට
  </h2>

  <p className="text-lg text-gray-500 max-w-2xl mx-auto">
    Download Instagram Reels, Photos, and Videos in high quality.
  </p>


  <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
    Instagram Reels, Photos සහ Videos{" "}
    <span className="font-semibold">High Quality</span> එකෙන්
    පහසුවෙන් Download කරගැනීමට හැක.
  </p>

</div>

{/* URL Input */}
<div className="max-w-2xl mx-auto mb-8">

  {/* Small bilingual instruction */}
  <div className="mb-3">
    <p className="text-sm font-medium text-gray-700">
      Paste your Instagram link below
    </p>
    <p className="text-xs text-gray-500">
      Instagram Link එක මෙතනට Paste කරන්න
    </p>
  </div>


  <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#e1306c] focus-within:border-[#e1306c] focus-within:shadow-lg focus-within:shadow-pink-100 transition-all duration-200">

    <div className="flex items-center gap-3 p-3">

      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Link className="w-5 h-5 text-[#ff0133]" />
        </div>


      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Instagram URL here..."
        className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
        onKeyDown={(e) => e.key === 'Enter' && fetchMedia()}
      />


      <button
        onClick={fetchMedia}
        disabled={loading}
        className="px-6 py-3 bg-[#e1306c] hover:bg-[#c13584] disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 hover:shadow-lg hover:shadow-pink-200 active:scale-95"
      >

        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download
          </>
        )}

      </button>

    </div>

  </div>

</div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-[#e1306c] animate-spin" />
            <p className="text-sm text-[#c13584] font-medium">Fetching media...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
          </div>
        </div>
      )}

      {/* Media Info & Download */}
      {mediaInfo && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            
            {/* Media Preview */}
            {mediaInfo.thumbnail && (
              <div className="relative bg-gray-100">
                <img 
                  src={mediaInfo.thumbnail} 
                  alt={mediaInfo.title || 'Instagram media'} 
                  className="w-full aspect-square object-cover"
                />
                {mediaInfo.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-[#e1306c] ml-1" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Media Details */}
            <div className="p-6">
              <h2 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                {mediaInfo.title || 'Instagram Media'}
              </h2>
              

              {/* Download Button */}
              <button
                onClick={downloadMedia}
                disabled={downloading}
                className="w-full py-3.5 bg-gradient-to-r from-[#fd1d1d] via-[#e1306c] to-[#c13584] hover:from-[#e1306c] hover:to-[#c13584] disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-200 active:scale-[0.98]"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : downloadComplete ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Downloaded! Click to download again
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download
                  </>
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
        </div>
      )}

    </div>
  )
}