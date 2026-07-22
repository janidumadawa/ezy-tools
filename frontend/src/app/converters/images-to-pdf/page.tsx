'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, Images, CheckCircle, AlertCircle, X } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/converter`

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selected])
    setResult(null); setError('')
  }

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const handleConvert = async () => {
    if (files.length === 0) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      const response = await axios.post(`${API_URL}/images-to-pdf`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Conversion failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      <div className="text-center mb-8">
        <Images className="w-12 h-12 text-violet-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Images to PDF</h1>
        <p className="text-gray-500">Combine multiple images into a single PDF</p>
      </div>

      {files.length === 0 ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-violet-400">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Click to upload images</p>
          <p className="text-sm text-gray-400">Select multiple images to merge into PDF</p>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
        </div>
      ) : !result ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">{files.length} image{files.length > 1 ? 's' : ''} selected</h3>
            <button onClick={() => fileInputRef.current?.click()} className="text-sm text-violet-600 hover:text-violet-700">+ Add more</button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <Images className="w-5 h-5 text-violet-500 flex-shrink-0" />
                <span className="text-sm truncate flex-1">{file.name}</span>
                <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                <button onClick={() => removeFile(index)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}
          <button onClick={handleConvert} disabled={loading} className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Merging...</> : <><Download className="w-4 h-4" /> Merge to PDF</>}
          </button>
        </div>
      ) : null}

      {result && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800">PDF Created!</p>
          <p className="text-sm text-green-600 mb-4">{result.message}</p>
          <a href={`${API_URL}/file/${result.filename}`} download className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"><Download className="w-4 h-4" /> Download PDF</a>
          <button onClick={() => { setFiles([]); setResult(null) }} className="block w-full mt-3 text-sm text-gray-500">Create Another</button>
        </div>
      )}
    </div>
  )
}