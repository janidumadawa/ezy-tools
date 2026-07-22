'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/converter`

export default function ImageToPdfPage() {
  const [file, setFile] = useState<File | null>(null)
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

  const handleConvert = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${API_URL}/image-to-pdf`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Conversion failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      <div className="text-center mb-8">
        <ImageIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Image to PDF</h1>
        <p className="text-gray-500">Convert any image to PDF format</p>
      </div>

      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400 transition-colors">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Click to upload image</p>
          <p className="text-sm text-gray-400">PNG, JPG, WebP, BMP supported</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
        </div>
      ) : !result ? (
        <div className="space-y-4">
          {preview && <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center"><img src={preview} className="max-h-48 rounded-lg object-contain" /></div>}
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <ImageIcon className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p></div>
            <button onClick={() => { setFile(null); setPreview('') }} className="text-red-500 hover:bg-red-50 p-1 rounded">&times;</button>
          </div>
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}
          <button onClick={handleConvert} disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</> : <><Download className="w-4 h-4" /> Convert to PDF</>}
          </button>
        </div>
      ) : null}

      {result && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800">Conversion Complete!</p>
          <a href={`${API_URL}/file/${result.filename}`} download className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"><Download className="w-4 h-4" /> Download PDF</a>
          <button onClick={() => { setFile(null); setResult(null); setPreview('') }} className="block w-full mt-3 text-sm text-gray-500">Convert Another</button>
        </div>
      )}
    </div>
  )
}