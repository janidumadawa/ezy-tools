import { Clock, User } from 'lucide-react'
import { VideoInfo as VideoInfoType } from '@/src/types'

interface VideoInfoProps {
  videoInfo: VideoInfoType
}

export default function VideoInfo({ videoInfo }: VideoInfoProps) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {videoInfo.thumbnail && (
        <div className="aspect-video bg-gray-900">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
        <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {videoInfo.title}
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {videoInfo.uploader}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {videoInfo.duration}
          </div>
        </div>
      </div>
    </div>
  )
}