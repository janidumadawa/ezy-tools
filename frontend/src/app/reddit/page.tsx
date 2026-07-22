'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Download, Loader2, CheckCircle, AlertCircle, Play, User, MessageCircle } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/reddit`

export default function RedditPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoInfo, setVideoInfo] = useState<any>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const fetchVideo = async () => {
    if (!url.trim()) { setError('Please enter a Reddit URL'); return }
    setLoading(true); setError(''); setVideoInfo(null)
    try {
      const response = await axios.get(`${API_URL}/info`, { params: { url } })
      if (response.data.success) setVideoInfo(response.data.data)
    } catch (err: any) { setError(err.response?.data?.detail || 'Failed to fetch video') }
    finally { setLoading(false) }
  }

  const downloadVideo = async () => {
    if (!videoInfo) return
    setDownloading(true); setDownloadComplete(false); setError('')
    try {
      const response = await axios.post(`${API_URL}/download`, { url })
      if (response.data.success) {
        const filename = response.data.data.filename
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/reddit/file/${filename}`, '_blank')
        setDownloadComplete(true)
        setTimeout(() => setDownloadComplete(false), 5000)
      }
    } catch (err: any) { setError(err.response?.data?.detail || 'Download failed') }
    finally { setDownloading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
            {/* Background Watermarks - hidden on mobile */}
      <div className="hidden md:block absolute top-40 left-100 pointer-events-none -z-10">
        <img
          src="/logos/reddit.png"
          alt="Reddit Logo"
          className="w-[400px] h-[400px] object-contain opacity-[0.2] blur-sm rotate-12"
        />
      </div>
      <Link href="/" className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 mb-4 inline-flex items-center gap-1">&larr; Back to Home</Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <img src="/logos/reddit.png" alt="Reddit Logo" className="w-8 h-8 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reddit <span className="text-orange-600">Downloader</span></h1>
        <p className="text-gray-900">Download Reddit videos with audio</p>
        <p className="text-sm text-gray-900 mt-1">Reddit වීඩියෝ පහසුවෙන් Download කරගන්න</p>
      </div>

      {/* URL Input */}
      <div className="mb-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 focus-within:border-orange-500 transition-all">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 sm:p-3">
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste Reddit post URL..." className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 py-1" onKeyDown={(e) => e.key === 'Enter' && fetchVideo()} />
            <button onClick={fetchVideo} disabled={loading} className="px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap">
              {loading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <Download className="w-3 h-3 sm:w-4 sm:h-4" />} Analyze
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3"><Loader2 className="w-5 h-5 text-orange-600 animate-spin" /><p className="text-sm text-orange-700">Fetching video...</p></div>}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-sm text-red-700">{error}</p></div>}

      {videoInfo && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {videoInfo.thumbnail && (
            <div className="aspect-video bg-gray-900 relative">
              <img src={videoInfo.thumbnail} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center"><div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><Play className="w-7 h-7 text-orange-600 ml-1" /></div></div>
            </div>
          )}
          <div className="p-4 sm:p-6">
            <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">{videoInfo.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              {videoInfo.subreddit && <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">r/{videoInfo.subreddit}</span>}
              {videoInfo.uploader && <span className="flex items-center gap-1"><User className="w-3 h-3" />u/{videoInfo.uploader}</span>}
              <span>{videoInfo.duration}</span>
            </div>
            <button onClick={downloadVideo} disabled={downloading} className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2">
              {downloading ? <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</> : downloadComplete ? <><CheckCircle className="w-4 h-4" /> Downloaded!</> : <><Download className="w-4 h-4" /> Download Video</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}