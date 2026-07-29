'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, Music, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/audio`

const formats = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'ogg', label: 'OGG' },
  { value: 'flac', label: 'FLAC' },
  { value: 'm4a', label: 'M4A' },
  { value: 'aac', label: 'AAC' },
]

export default function AudioConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState('mp3')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getOriginalFormat = () => {
    if (!file) return ''
    return file.name.split('.').pop()?.toUpperCase() || ''
  }

  const handleConvert = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('format', targetFormat)

      const response = await axios.post(`${API_URL}/convert`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Conversion failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>

      <div className="text-center mb-8">
        <Music className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Audio Converter</h1>
        <p className="text-gray-500">Convert audio files between formats</p>
      </div>

      <div className="space-y-4">
        {/* Upload */}
        {!file ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-green-400 transition-colors">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Click to upload audio file</p>
            <p className="text-sm text-gray-400">MP3, WAV, OGG, FLAC, M4A, AAC, WMA supported</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.aac,.m4a,.wma,.flac,.mp3,.wav,.ogg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />          </div>
        ) : !result ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            {/* File Info */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
              <Music className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{getOriginalFormat()}</span>
              <button onClick={() => setFile(null)} className="text-red-500 hover:bg-red-50 p-1 rounded">&times;</button>
            </div>

            {/* Format Arrow */}
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-medium">{getOriginalFormat()}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-medium">{targetFormat.toUpperCase()}</span>
            </div>

            {/* Target Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Convert to</label>
              <div className="grid grid-cols-3 gap-2">
                {formats.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setTargetFormat(f.value)}
                    className={`py-3 rounded-lg text-sm font-medium border-2 transition-all ${targetFormat === f.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {loading ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
            </button>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </div>
        ) : null}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl border border-green-200 p-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-green-800">Conversion Complete!</p>
            <p className="text-sm text-green-600">{result.original_format} → {result.target_format}</p>
            <p className="text-xs text-green-500 mb-4">{result.filesize}</p>
            <a
              href={`${API_URL}/file/${result.filename}`}
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              <Download className="w-4 h-4" /> Download {result.target_format}
            </a>
            <button onClick={() => { setFile(null); setResult(null) }} className="block w-full mt-3 text-sm text-gray-500">
              Convert Another File
            </button>
          </div>
        )}
      </div>
    </div>
  )
}