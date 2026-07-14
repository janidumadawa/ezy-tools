'use client'

import { useState } from 'react'
import axios from 'axios'
import { VideoInfo, DownloadState } from '@/src/types'

// const API_URL = 'http://localhost:8000/api/youtube'
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/youtube`

export function useYouTubeDownloader() {
  const [url, setUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [error, setError] = useState('')
  const [selectedQuality, setSelectedQuality] = useState('best')
  const [downloadState, setDownloadState] = useState<DownloadState>({
    status: 'idle',
    message: '',
    progress: 0
  })

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    setDownloadState({ status: 'analyzing', message: 'Analyzing video...', progress: 10 })
    setError('')
    setVideoInfo(null)

    try {
      const progressInterval = setInterval(() => {
        setDownloadState((prev: DownloadState) => ({
          ...prev,
          progress: Math.min(prev.progress + 15, 90)
        }))
      }, 300)

      const response = await axios.get(`${API_URL}/info`, {
        params: { url }
      })

      clearInterval(progressInterval)

      if (response.data.success) {
        setVideoInfo(response.data.data)
        setDownloadState({ status: 'ready', message: 'Ready to download', progress: 100 })
        
        setTimeout(() => {
          setDownloadState({ status: 'idle', message: '', progress: 0 })
        }, 2000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch video information'
      setError(errorMsg)
      setDownloadState({ status: 'error', message: errorMsg, progress: 0 })
    }
  }

  const downloadVideo = async () => {
    if (!videoInfo) return

    setDownloadState({ 
      status: 'downloading', 
      message: 'Downloading...',
      progress: 0 
    })
    setError('')

    try {
      const progressInterval = setInterval(() => {
        setDownloadState((prev: DownloadState) => {
          const newProgress = prev.progress + Math.random() * 10
          return {
            ...prev,
            progress: Math.min(newProgress, 90)
          }
        })
      }, 500)

      const response = await axios.post(`${API_URL}/download`, {
        url,
        quality: selectedQuality
      })

      clearInterval(progressInterval)

      if (response.data.success) {
        const filename = response.data.data.filename
        // const downloadUrl = `http://localhost:8000/api/youtube/file/${filename}`
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/youtube/file/${filename}`

        
        setDownloadState({ 
          status: 'completed', 
          message: 'Download complete!',
          progress: 100,
          filename: filename
        })
        
        window.open(downloadUrl, '_blank')
        
        setTimeout(() => {
          setDownloadState({ status: 'idle', message: '', progress: 0 })
        }, 8000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Download failed'
      setError(errorMsg)
      setDownloadState({ status: 'error', message: errorMsg, progress: 0 })
    }
  }

  return {
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
  }
}