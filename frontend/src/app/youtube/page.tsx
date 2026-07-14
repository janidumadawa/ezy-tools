'use client'

import Header from '@/src/components/youtube/Header'
import URLInput from '@/src/components/youtube/URLInput'
import ProgressBar from '@/src/components/youtube/ProgressBar'
import StatusMessage from '@/src/components/youtube/StatusMessage'
import VideoInfo from '@/src/components/youtube/VideoInfo'
import QualitySelector from '@/src/components/youtube/QualitySelector'
import DownloadButton from '@/src/components/youtube/DownloadButton'
import { useYouTubeDownloader } from '@/src/hooks/useYouTubeDownloader'

export default function YouTubePage() {
  const {
    url,
    setUrl,
    videoInfo,
    error,
    setError,
    selectedQuality,
    setSelectedQuality,
    downloadState,
    fetchVideoInfo,
    downloadVideo
  } = useYouTubeDownloader()

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-12 relative overflow-hidden">
      {/* Background YouTube Logo Watermark - hidden on mobile */}

      <div className="hidden lg:block absolute top-30 left-[10px] pointer-events-none -z-10">
        <img
          src="/logos/youtube.png"
          alt=""
          className="w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] object-contain opacity-[0.15] blur-sm rotate-[-15deg]"
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <div className="mb-4 sm:mb-6">
          <a
            href="/"
            className="text-xs sm:text-sm text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
          >
            &larr; Back to Home
          </a>
        </div>

        <Header />
        <URLInput 
          url={url}
          setUrl={setUrl}
          onSubmit={fetchVideoInfo}
          downloadState={downloadState}
        />
        <ProgressBar downloadState={downloadState} />
        <StatusMessage 
          downloadState={downloadState}
          error={error}
          setError={setError}
        />

        {videoInfo && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <VideoInfo videoInfo={videoInfo} />
              <div className="p-4 sm:p-6 space-y-4">
                <QualitySelector 
                  formats={videoInfo.formats}
                  selectedQuality={selectedQuality}
                  onSelect={setSelectedQuality}
                />
                <DownloadButton 
                  onClick={downloadVideo}
                  downloadState={downloadState}
                  selectedQuality={selectedQuality}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}