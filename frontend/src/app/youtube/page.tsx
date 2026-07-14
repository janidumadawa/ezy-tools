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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

 {/* Background YouTube Logo Watermark */}
<div className="absolute top-10 right-[-120px] pointer-events-none -z-10">
  <img
    src="/logos/youtube.png"
    alt=""
    className="w-[500px] h-[500px] object-contain opacity-[0.06] blur-sm"
  />
</div>

<div className="absolute top-40 left-[10px] pointer-events-none -z-10">
  <img
    src="/logos/youtube.png"
    alt=""
    className="w-[400px] h-[400px] object-contain opacity-[0.3] blur-sm rotate-[-15deg]"
  />
</div>


    {/* Page Content */}
    <div className="relative z-10">

      <div className="mb-6">
        <a
          href="/"
          className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
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
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">

            <VideoInfo videoInfo={videoInfo} />

            <div className="p-6 space-y-4">
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