'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, ImageIcon, CheckCircle, AlertCircle, Maximize2 } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/converter`

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [percentage, setPercentage] = useState('')
  const [mode, setMode] = useState<'dimensions' | 'percentage'>('percentage')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleResize = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (mode === 'percentage' && percentage) formData.append('percentage', percentage)
      if (mode === 'dimensions') {
        if (width) formData.append('width', width)
        if (height) formData.append('height', height)
      }
      const response = await axios.post(`${API_URL}/resize-image`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Resize failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Maximize2 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Image Resizer</h1>
        <p className="text-gray-500">Resize images by dimensions or percentage</p>
      </div>

      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Click to upload image</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} className="hidden" />
        </div>
      ) : !result ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <ImageIcon className="w-8 h-8 text-indigo-600" />
            <span className="text-sm truncate">{file.name}</span>
            <button onClick={() => setFile(null)} className="ml-auto text-red-500">&times;</button>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-2">
            <button onClick={() => setMode('percentage')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'percentage' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Percentage</button>
            <button onClick={() => setMode('dimensions')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'dimensions' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Dimensions</button>
          </div>

          {mode === 'percentage' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scale: {percentage || '0'}%</label>
              <input type="range" min="10" max="200" value={percentage || 100} onChange={(e) => setPercentage(e.target.value)} className="w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Auto" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Auto" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          )}

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}

          <button onClick={handleResize} disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resizing...</> : <><Maximize2 className="w-4 h-4" /> Resize Image</>}
          </button>
        </div>
      ) : null}

      {result && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800">Resized!</p>
          <p className="text-sm text-green-600">Original: {result.original_size} → New: {result.new_size}</p>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/converter/file/${result.filename}`} download className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            <Download className="w-4 h-4" /> Download
          </a>
          <button onClick={() => { setFile(null); setResult(null) }} className="block w-full mt-3 text-sm text-gray-500">Resize Another</button>
        </div>
      )}
    </div>
  )
}