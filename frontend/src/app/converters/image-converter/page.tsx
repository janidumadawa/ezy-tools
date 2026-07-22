'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, ImageIcon, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/converter`

const formats = [
  { value: 'png', label: 'PNG', color: 'bg-blue-100 text-blue-700' },
  { value: 'jpg', label: 'JPG', color: 'bg-green-100 text-green-700' },
  { value: 'webp', label: 'WebP', color: 'bg-purple-100 text-purple-700' },
]

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState('png')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setError('')
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(selectedFile)
  }

  const getCurrentFormat = () => {
    if (!file) return ''
    const ext = file.name.split('.').pop()?.toLowerCase()
    return ext?.toUpperCase() || ''
  }

  const handleConvert = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('format', targetFormat)
      
      const response = await axios.post(`${API_URL}/convert-image`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error || 'Conversion failed')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Conversion failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <ImageIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Image Converter</h1>
        <p className="text-gray-500">Convert images between PNG, JPG, and WebP formats</p>
      </div>

      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-purple-400 transition-colors">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Click to upload image</p>
          <p className="text-sm text-gray-400">PNG, JPG, WebP supported</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
        </div>
      ) : !result ? (
        <div className="space-y-4">
          {/* Preview */}
          {preview && (
            <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
              <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
            </div>
          )}

          {/* File Info */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <ImageIcon className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB • {getCurrentFormat()}</p>
            </div>
            <button onClick={() => { setFile(null); setPreview('') }} className="text-red-500 hover:bg-red-50 p-1 rounded">&times;</button>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Convert to:</label>
            <div className="grid grid-cols-3 gap-2">
              {formats.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setTargetFormat(fmt.value)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                    targetFormat === fmt.value
                      ? `${fmt.color} border-current`
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Arrow */}
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded">{getCurrentFormat()}</span>
            <ArrowRight className="w-4 h-4" />
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">{targetFormat.toUpperCase()}</span>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}

          <button onClick={handleConvert} disabled={loading} className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</> : <><Download className="w-4 h-4" /> Convert to {targetFormat.toUpperCase()}</>}
          </button>
        </div>
      ) : null}

      {result && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800">Conversion Complete!</p>
          <p className="text-sm text-green-600 mb-4">{result.message}</p>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/converter/file/${result.filename}`} download className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            <Download className="w-4 h-4" /> Download {targetFormat.toUpperCase()}
          </a>
          <button onClick={() => { setFile(null); setResult(null); setPreview('') }} className="block w-full mt-3 text-sm text-gray-500 hover:text-gray-700">
            Convert Another Image
          </button>
        </div>
      )}
    </div>
  )
}