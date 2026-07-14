import { Download, Loader2, CheckCircle } from 'lucide-react'
import { DownloadState } from '@/src/types'

interface DownloadButtonProps {
  onClick: () => void
  downloadState: DownloadState
  selectedQuality: string
}

export default function DownloadButton({ onClick, downloadState, selectedQuality }: DownloadButtonProps) {
  const isDownloading = downloadState.status === 'downloading'
  const isCompleted = downloadState.status === 'completed'

  return (
    <button
      onClick={onClick}
      disabled={isDownloading}
      className="w-full py-3.5 bg-[#ff0133] hover:bg-[#d1105a] disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-200 active:scale-[0.98]"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Downloading...
        </>
      ) : isCompleted ? (
        <>
          <CheckCircle className="w-4 h-4" />
          Download Again
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download {selectedQuality === 'audio' ? 'MP3' : 'Video'}
        </>
      )}
    </button>
  )
}