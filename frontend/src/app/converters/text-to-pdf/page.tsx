'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/converter`

export default function TextToPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleConvert = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${API_URL}/text-to-pdf`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Conversion failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Text to PDF</h1>
        <p className="text-gray-500">Convert plain text files to PDF format</p>
      </div>

      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-gray-400">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Click to upload text file</p>
          <p className="text-sm text-gray-400">.txt files supported</p>
          <input ref={fileInputRef} type="file" accept=".txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
      ) : !result ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <FileText className="w-8 h-8 text-gray-600" />
            <span className="text-sm truncate">{file.name}</span>
            <button onClick={() => setFile(null)} className="ml-auto text-red-500">&times;</button>
          </div>
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}
          <button onClick={handleConvert} disabled={loading} className="w-full py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</> : <><Download className="w-4 h-4" /> Convert to PDF</>}
          </button>
        </div>
      ) : null}

      {result && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800">Conversion Complete!</p>
          <a href={`${API_URL}/file/${result.filename}`} download className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"><Download className="w-4 h-4" /> Download PDF</a>
          <button onClick={() => { setFile(null); setResult(null) }} className="block w-full mt-3 text-sm text-gray-500">Convert Another</button>
        </div>
      )}
    </div>
  )
}