'use client'
import Image from "next/image";
import { useState } from 'react'
import axios from 'axios'
import { Download, Loader2, CheckCircle, AlertCircle, Video, Music, Clock, User } from 'lucide-react'

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
                const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/facebook/file/${filename}`
                
                const fileResponse = await fetch(fileUrl)
                const blob = await fileResponse.blob()
                
                const downloadUrl = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = downloadUrl
                link.download = filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(downloadUrl)
                
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
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-12 relative overflow-hidden">
            {/* Background Watermarks - hidden on mobile */}
  
            <div className="hidden lg:block absolute top-40 left-[10px] pointer-events-none -z-10">
                <img src="/logos/facebook.png" alt="" className="w-[400px] h-[400px] object-contain opacity-[0.3] blur-sm rotate-[-15deg]" />
            </div>
            
            {/* Back Button */}
            <div className="mb-4 sm:mb-6">
                <a href="/" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                    &larr; Back to Home
                </a>
            </div>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Image
                        src="/logos/facebook.png"
                        alt="Facebook Logo"
                        width={40}
                        height={40}
                        className="w-10 h-10 sm:w-[55px] sm:h-[55px] object-contain"
                    />
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
                        Facebook{" "}
                        <span className="text-blue-600">Video</span>{" "}
                        <span className="block sm:inline">Downloader</span>
                    </h1>
                </div>

                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4 lg:mb-6 px-2">
                    Facebook වීඩියෝ ඩවුන්ලෝඩ් කරගැනීමට
                </h2>

                <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-2xl mx-auto px-2">
                    Download videos in HD quality or extract MP3 audio.
                </p>

                <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto mt-2 sm:mt-3 leading-relaxed px-2">
                    ඕනෑම Facebook වීඩියෝවක්{" "}
                    <span className="font-semibold">HD Quality</span> එකෙන් හෝ
                    එහි <span className="font-semibold">Audio</span> එක වෙනම
                    ඩවුන්ලෝඩ් කරගැනීමට හැක.
                </p>
            </div>

            {/* URL Input */}
            <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
                <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 sm:p-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste Facebook video URL..."
                                className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 py-1"
                                onKeyDown={(e) => e.key === 'Enter' && fetchVideoInfo()}
                            />
                        </div>
                        <button
                            onClick={fetchVideoInfo}
                            disabled={loading}
                            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-95 whitespace-nowrap"
                        >
                            {loading ? (
                                <><Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> Analyzing</>
                            ) : (
                                <><Download className="w-3 h-3 sm:w-4 sm:h-4" /> Analyze</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="max-w-2xl mx-auto mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-spin flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-blue-700 font-medium">Fetching video info...</p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="max-w-2xl mx-auto mb-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Video Info */}
            {videoInfo && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        {videoInfo.thumbnail && (
                            <div className="aspect-video bg-gray-900 relative">
                                <img
                                    src={videoInfo.thumbnail}
                                    alt={videoInfo.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                        <Video className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 ml-0.5 sm:ml-1" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-4 sm:p-6">
                            <h2 className="font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base">
                                {videoInfo.title}
                            </h2>
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                                {videoInfo.uploader && (
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="truncate max-w-[120px] sm:max-w-none">{videoInfo.uploader}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {videoInfo.duration}
                                </div>
                            </div>

                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                Select Quality
                            </label>
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-4">
                                <button
                                    onClick={() => setSelectedQuality('best')}
                                    className={`relative p-2 sm:p-3 rounded-lg text-left transition-all border ${selectedQuality === 'best' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Video className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">Best Quality</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500">HD</p>
                                        </div>
                                    </div>
                                    {selectedQuality === 'best' && (
                                        <CheckCircle className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                    )}
                                </button>

                                {videoInfo.formats.slice(0, 2).map((format) => (
                                    <button
                                        key={format.format_id}
                                        onClick={() => setSelectedQuality(format.resolution)}
                                        className={`relative p-2 sm:p-3 rounded-lg text-left transition-all border ${selectedQuality === format.resolution ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <Video className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium">{format.resolution}</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500">{formatFileSize(format.filesize)}</p>
                                            </div>
                                        </div>
                                        {selectedQuality === format.resolution && (
                                            <CheckCircle className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                        )}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setSelectedQuality('audio')}
                                    className={`relative p-2 sm:p-3 rounded-lg text-left transition-all border ${selectedQuality === 'audio' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Music className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium">Audio MP3</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500">High quality</p>
                                        </div>
                                    </div>
                                    {selectedQuality === 'audio' && (
                                        <CheckCircle className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={downloadVideo}
                                disabled={downloading}
                                className="w-full py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98]"
                            >
                                {downloading ? (
                                    <><Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> Downloading...</>
                                ) : downloadComplete ? (
                                    <><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Downloaded!</>
                                ) : (
                                    <><Download className="w-3 h-3 sm:w-4 sm:h-4" /> Download {selectedQuality === 'audio' ? 'MP3' : 'Video'}</>
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