'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, FileText, CheckCircle, Shrink } from 'lucide-react'

// const API_URL = 'http://localhost:8000/api/pdf'
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/pdf`


export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleCompress = async () => {
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_URL}/compress`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        setResult(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to compress PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/pdf" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        &larr; Back to PDF Tools
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Compress PDF</h1>
      <p className="text-gray-500 mb-8">Reduce PDF file size</p>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
        {!file ? (
          <>
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm cursor-pointer hover:bg-orange-700">
              Choose PDF
            </label>
          </>
        ) : (
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <FileText className="w-5 h-5 text-orange-500" />
            <span className="text-sm">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}
      </div>

      {file && !result && (
        <button onClick={handleCompress} disabled={loading} className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Compressing...</> : <><Shrink className="w-4 h-4" /> Compress PDF</>}
        </button>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium text-green-700">Compressed! ({result.compressed_size})</span>
          </div>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/pdf/file/${result.filename}`} download className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Compressed PDF
          </a>
        </div>
      )}
    </div>
  )
}