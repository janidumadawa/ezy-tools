'use client'
import Image from "next/image";
import { useState } from 'react'
import axios from 'axios'
import { Download, Loader2, CheckCircle, AlertCircle, Video, Music, Clock, User } from 'lucide-react'

// const API_URL = 'http://localhost:8000/api/facebook'
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/facebook`

interface VideoInfo {
    title: string
    duration: string
    thumbnail: string
    uploader: string
    formats: Array<{
        format_id: string
        resolution: string
        ext: string
        filesize: number
        has_audio: boolean
    }>
}

export default function FacebookPage() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
    const [selectedQuality, setSelectedQuality] = useState('best')
    const [downloading, setDownloading] = useState(false)
    const [downloadComplete, setDownloadComplete] = useState(false)

    const fetchVideoInfo = async () => {
        if (!url.trim()) {
            setError('Please enter a Facebook video URL')
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
        const response = await axios.post(`${API_URL}/download`, {
            url,
            quality: selectedQuality
        })

        if (response.data.success) {
            const filename = response.data.data.filename
            const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/facebook/file/${filename}`
            
            // Create a hidden link and click it (works better than window.open)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            setDownloadComplete(true)
            setTimeout(() => setDownloadComplete(false), 5000)
        }
    } catch (err: any) {
        setError(err.response?.data?.detail || 'Download failed')
    } finally {
        setDownloading(false)
    }
}
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return 'Unknown'
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Background Facebook Logo Watermark */}
            <div className="absolute top-10 right-[-120px] pointer-events-none -z-10">
                <img
                    src="/logos/facebook.png"
                    alt=""
                    className="w-[500px] h-[500px] object-contain opacity-[0.06] blur-sm"
                />
            </div>

            <div className="absolute top-40 left-[10px] pointer-events-none -z-10">
                <img
                    src="/logos/facebook.png"
                    alt=""
                    className="w-[400px] h-[400px] object-contain opacity-[0.3] blur-sm rotate-[-15deg]"
                />
            </div>
            
            {/* Back Button */}
            <div className="mb-6">
                <a href="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                    &larr; Back to Home
                </a>
            </div>

            <div className="text-center mb-10">

                <div className="flex items-center justify-center gap-3 mb-3">

                    <Image
                        src="/logos/facebook.png"
                        alt="Facebook Logo"
                        width={55}
                        height={55}
                        className="object-contain"
                    />

                    <h1 className="text-5xl font-bold text-gray-900">
                        Facebook <span className="text-blue-600">Video</span> Downloader
                    </h1>


                </div>


                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                    Facebook වීඩියෝ ඩවුන්ලෝඩ් කරගැනීමට
                </h2>


                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Download videos in HD quality or extract MP3 audio.
                </p>


                <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
                    ඕනෑම Facebook වීඩියෝවක්{" "}
                    <span className="font-semibold">HD Quality</span> එකෙන් හෝ
                    එහි <span className="font-semibold">Audio</span> එක වෙනම
                    ඩවුන්ලෝඩ් කරගැනීමට හැක.
                </p>

            </div>

            {/* URL Input */}
            <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-100 transition-all duration-300">
                    <div className="flex items-center gap-3 p-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste Facebook video URL here..."
                            className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                            onKeyDown={(e) => e.key === 'Enter' && fetchVideoInfo()}
                        />
                        <button
                            onClick={fetchVideoInfo}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing</>
                            ) : (
                                <><Download className="w-4 h-4" /> Analyze</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="max-w-2xl mx-auto mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <p className="text-sm text-blue-700 font-medium">Fetching video info...</p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="max-w-2xl mx-auto mb-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Video Info */}
            {videoInfo && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Thumbnail */}
                        {videoInfo.thumbnail && (
                            <div className="aspect-video bg-gray-900 relative">
                                <img
                                    src={videoInfo.thumbnail}
                                    alt={videoInfo.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                        <Video className="w-8 h-8 text-blue-600 ml-1" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-6">
                            {/* Video Details */}
                            <h2 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                                {videoInfo.title}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                {videoInfo.uploader && (
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        {videoInfo.uploader}
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {videoInfo.duration}
                                </div>
                            </div>

                            {/* Quality Selection */}
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Select Quality
                            </label>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <button
                                    onClick={() => setSelectedQuality('best')}
                                    className={`relative p-3 rounded-lg text-left transition-all border ${selectedQuality === 'best'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium">Best Quality</p>
                                            <p className="text-xs text-gray-500">HD</p>
                                        </div>
                                    </div>
                                    {selectedQuality === 'best' && (
                                        <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
                                    )}
                                </button>

                                {videoInfo.formats.slice(0, 2).map((format) => (
                                    <button
                                        key={format.format_id}
                                        onClick={() => setSelectedQuality(format.resolution)}
                                        className={`relative p-3 rounded-lg text-left transition-all border ${selectedQuality === format.resolution
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Video className="w-4 h-4 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium">{format.resolution}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(format.filesize)}</p>
                                            </div>
                                        </div>
                                        {selectedQuality === format.resolution && (
                                            <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
                                        )}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setSelectedQuality('audio')}
                                    className={`relative p-3 rounded-lg text-left transition-all border ${selectedQuality === 'audio'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Music className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium">Audio MP3</p>
                                            <p className="text-xs text-gray-500">High quality</p>
                                        </div>
                                    </div>
                                    {selectedQuality === 'audio' && (
                                        <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
                                    )}
                                </button>
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={downloadVideo}
                                disabled={downloading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
                            >
                                {downloading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</>
                                ) : downloadComplete ? (
                                    <><CheckCircle className="w-4 h-4" /> Downloaded!</>
                                ) : (
                                    <><Download className="w-4 h-4" /> Download {selectedQuality === 'audio' ? 'MP3' : 'Video'}</>
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