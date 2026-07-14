export interface VideoInfo {
  title: string
  duration: string
  thumbnail: string
  uploader: string
  formats: Format[]
}

export interface Format {
  format_id: string
  resolution: string
  ext: string
  filesize: number
  has_audio: boolean
}

export type DownloadStatus = 
  | 'idle' 
  | 'analyzing' 
  | 'ready' 
  | 'downloading' 
  | 'completed' 
  | 'error'

export interface DownloadState {
  status: DownloadStatus
  message: string
  progress: number
  filename?: string
}