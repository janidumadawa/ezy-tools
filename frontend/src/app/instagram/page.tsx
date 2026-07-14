'use client'

import { useState } from 'react'
import axios from 'axios'
import { Download, Loader2, CheckCircle, AlertCircle, Play, Link } from 'lucide-react'
import Image from "next/image";

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
      const response = await axios.post(`${API_URL}/download`, { url })

      if (response.data.success) {
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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-12 relative overflow-hidden">

      {/* Background Watermarks - hidden on mobile */}
      <div className="hidden lg:block absolute top-40 left-[30px] pointer-events-none -z-10">
        <img src="/logos/instagram.png" alt="" className="w-[300px] h-[300px] object-contain opacity-[0.3] blur-sm rotate-22" />
      </div>

      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <a href="/" className="text-xs sm:text-sm text-[#c13584] hover:text-[#e1306c] transition-colors flex items-center gap-1">
          &larr; Back to Home
        </a>
      </div>

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Image
            src="/logos/instagram.png"
            alt="Instagram Logo"
            width={40}
            height={40}
            className="w-10 h-10 sm:w-[55px] sm:h-[55px] object-contain"
          />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
            Instagram{" "}
            <span className="text-[#e1306c]">Downloader</span>
          </h1>
        </div>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4 lg:mb-6 px-2">
          Instagram වීඩියෝ සහ ඡායාරූප ඩවුන්ලෝඩ් කරගැනීමට
        </h2>

        <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-2xl mx-auto px-2">
          Download Instagram Reels, Photos, and Videos in high quality.
        </p>

        <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto mt-2 sm:mt-3 leading-relaxed px-2">
          Instagram Reels, Photos සහ Videos{" "}
          <span className="font-semibold">High Quality</span> එකෙන්
          පහසුවෙන් Download කරගැනීමට හැක.
        </p>
      </div>

      {/* URL Input */}
      <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="mb-2 sm:mb-3 px-1">
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Paste your Instagram link below
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500">
            Instagram Link එක මෙතනට Paste කරන්න
          </p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#e1306c] focus-within:border-[#e1306c] focus-within:shadow-lg focus-within:shadow-pink-100 transition-all duration-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 sm:p-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Link className="w-4 h-4 sm:w-5 sm:h-5 text-[#e1306c]" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Instagram URL here..."
                className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 py-1"
                onKeyDown={(e) => e.key === 'Enter' && fetchMedia()}
              />
            </div>
            <button
              onClick={fetchMedia}
              disabled={loading}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#e1306c] hover:bg-[#c13584] disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-200 active:scale-95 whitespace-nowrap"
            >
              {loading ? (
                <><Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> Downloading...</>
              ) : (
                <><Download className="w-3 h-3 sm:w-4 sm:h-4" /> Download</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#e1306c] animate-spin flex-shrink-0" />
            <p className="text-xs sm:text-sm text-[#c13584] font-medium">Fetching media...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-red-700 flex-1">{error}</p>
          </div>
        </div>
      )}

      {/* Media Info */}
      {mediaInfo && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {mediaInfo.thumbnail && (
              <div className="relative bg-gray-100">
                <img 
                  src={mediaInfo.thumbnail} 
                  alt={mediaInfo.title || 'Instagram media'} 
                  className="w-full aspect-square object-cover"
                />
                {mediaInfo.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-[#e1306c] ml-0.5 sm:ml-1" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 sm:p-6">
              <h2 className="font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base">
                {mediaInfo.title || 'Instagram Media'}
              </h2>

              <button
                onClick={downloadMedia}
                disabled={downloading}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#fd1d1d] via-[#e1306c] to-[#c13584] hover:from-[#e1306c] hover:to-[#c13584] disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-200 active:scale-[0.98]"
              >
                {downloading ? (
                  <><Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> Downloading...</>
                ) : downloadComplete ? (
                  <><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Downloaded!</>
                ) : (
                  <><Download className="w-3 h-3 sm:w-4 sm:h-4" /> Download</>
                )}
              </button>

              {downloadComplete && (
                <div className="mt-3 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-green-700">Saved to Downloads folder</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}