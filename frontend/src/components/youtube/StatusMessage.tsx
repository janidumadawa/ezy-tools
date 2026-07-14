import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { DownloadState } from '@/src/types'

interface StatusMessageProps {
  downloadState: DownloadState
  error: string
  setError: (error: string) => void
}

export default function StatusMessage({ downloadState, error, setError }: StatusMessageProps) {
  return (
    <div className="max-w-2xl mx-auto mb-6">
      {downloadState.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700">Download Complete!</p>
            <p className="text-xs text-green-600 mt-0.5">
              {downloadState.filename} saved to Downloads folder
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button 
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}