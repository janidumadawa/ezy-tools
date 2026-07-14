import { Video, Music, CheckCircle } from 'lucide-react'
import { Format } from '@/src/types'

interface QualitySelectorProps {
  formats: Format[]
  selectedQuality: string
  onSelect: (quality: string) => void
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return 'Unknown'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export default function QualitySelector({ formats, selectedQuality, onSelect }: QualitySelectorProps) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
        Select Quality
      </label>
      
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        <button
          onClick={() => onSelect('best')}
          className={`relative p-2 sm:p-3 rounded-lg text-left transition-all duration-200 border ${
            selectedQuality === 'best'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Video className={`w-3 h-3 sm:w-4 sm:h-4 ${selectedQuality === 'best' ? 'text-red-700' : 'text-gray-500'}`} />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900">Best Quality</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Up to 4K</p>
            </div>
          </div>
          {selectedQuality === 'best' && (
            <CheckCircle className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 text-red-700" />
          )}
        </button>
        
        {formats.slice(0, 2).map((format) => (
          <button
            key={format.format_id}
            onClick={() => onSelect(format.resolution)}
            className={`relative p-2 sm:p-3 rounded-lg text-left transition-all duration-200 border ${
              selectedQuality === format.resolution
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Video className={`w-3 h-3 sm:w-4 sm:h-4 ${selectedQuality === format.resolution ? 'text-red-700' : 'text-gray-500'}`} />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">{format.resolution}</p>
                <p className="text-[10px] sm:text-xs text-gray-500">{formatFileSize(format.filesize)}</p>
              </div>
            </div>
            {selectedQuality === format.resolution && (
              <CheckCircle className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 text-red-700" />
            )}
          </button>
        ))}

        <button
          onClick={() => onSelect('audio')}
          className={`relative p-2 sm:p-3 rounded-lg text-left transition-all duration-200 border ${
            selectedQuality === 'audio'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Music className={`w-3 h-3 sm:w-4 sm:h-4 ${selectedQuality === 'audio' ? 'text-red-700' : 'text-gray-500'}`} />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900">Audio MP3</p>
              <p className="text-[10px] sm:text-xs text-gray-500">High quality</p>
            </div>
          </div>
          {selectedQuality === 'audio' && (
            <CheckCircle className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 text-red-700" />
          )}
        </button>
      </div>
    </div>
  )
}