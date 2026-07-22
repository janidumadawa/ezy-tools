'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/converter`

export default function WordToPdfPage() {
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
      const response = await axios.post(`${API_URL}/word-to-pdf`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) {
      setError('Conversion failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Word to PDF</h1>
        <p className="text-gray-500">Convert Word documents to PDF online</p>
      </div>

      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Click to upload Word file</p>
          <p className="text-sm text-gray-400">.docx files supported</p>
          <input ref={fileInputRef} type="file" accept=".docx,.doc" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
      ) : !result ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-sm">{file.name}</span>
            <button onClick={() => setFile(null)} className="ml-auto text-red-500">&times;</button>
          </div>
          <button onClick={handleConvert} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</> : <><RefreshCw className="w-4 h-4" /> Convert to PDF</>}
          </button>
        </div>
      ) : null}

      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}

      {result && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-green-800">Conversion Complete!</p>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/converter/file/${result.filename}`} download className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            <Download className="w-4 h-4" /> Download PDF
          </a>
        </div>
      )}
    </div>
  )
}