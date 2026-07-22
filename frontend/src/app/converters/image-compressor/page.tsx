'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/converter`

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(70)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (f: File) => {
    setFile(f); setResult(null); setError('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleCompress = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('quality', quality.toString())
      const response = await axios.post(`${API_URL}/compress-image`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Compression failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <ImageIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Image Compressor</h1>
        <p className="text-gray-500">Reduce image file size while maintaining quality</p>
      </div>

      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Click to upload image</p>
          <p className="text-sm text-gray-400">PNG, JPG, WebP supported</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
        </div>
      ) : !result ? (
        <div className="space-y-4">
          {preview && <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center"><img src={preview} className="max-h-48 rounded-lg object-contain" /></div>}
          
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            <div className="flex-1"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p></div>
            <button onClick={() => { setFile(null); setPreview('') }} className="text-red-500">&times;</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality: {quality}%</label>
            <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400"><span>Smaller file</span><span>Better quality</span></div>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}

          <button onClick={handleCompress} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Compressing...</> : <><Download className="w-4 h-4" /> Compress Image</>}
          </button>
        </div>
      ) : null}

      {result && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800">Compressed!</p>
          <div className="text-sm text-green-600 mt-2">
            <p>Original: {result.original_size}</p>
            <p>Compressed: {result.compressed_size}</p>
          </div>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/converter/file/${result.filename}`} download className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            <Download className="w-4 h-4" /> Download
          </a>
          <button onClick={() => { setFile(null); setResult(null); setPreview('') }} className="block w-full mt-3 text-sm text-gray-500">Compress Another</button>
        </div>
      )}
    </div>
  )
}