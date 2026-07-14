'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, FileText, Scissors } from 'lucide-react'

const API_URL = 'http://localhost:8000/api/pdf'

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pagesPerSplit, setPagesPerSplit] = useState(1)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<any[]>([])
  const [error, setError] = useState('')

  const handleSplit = async () => {
    if (!file) return
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('pages_per_split', pagesPerSplit.toString())

      const response = await axios.post(`${API_URL}/split`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        setFiles(response.data.data.files)
      }
    } catch (err: any) {
      setError('Failed to split PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/pdf" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        &larr; Back to PDF Tools
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Split PDF</h1>
      <p className="text-gray-500 mb-6">Split PDF by number of pages per file</p>

      {/* Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
        {!file ? (
          <>
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file" />
            <label htmlFor="file" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm cursor-pointer hover:bg-green-700">
              Choose PDF
            </label>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-600" />
            <span className="text-sm">{file.name}</span>
            <button onClick={() => setFile(null)} className="ml-auto text-red-500">&times;</button>
          </div>
        )}
      </div>

      {/* Pages per split */}
      {file && files.length === 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pages per file</label>
            <select value={pagesPerSplit} onChange={(e) => setPagesPerSplit(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value={1}>1 page per file</option>
              <option value={2}>2 pages per file</option>
              <option value={3}>3 pages per file</option>
              <option value={5}>5 pages per file</option>
              <option value={10}>10 pages per file</option>
            </select>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

          <button onClick={handleSplit} disabled={loading} className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
            {loading ? 'Splitting...' : <><Scissors className="w-4 h-4" /> Split PDF</>}
          </button>
        </div>
      )}

      {/* Results */}
      {files.length > 0 && (
        <div className="space-y-3">
          <p className="font-medium text-gray-700">Split into {files.length} files:</p>
          {files.map((f: any, i: number) => (
            <a key={i} href={`http://localhost:8000/api/pdf/file/${f.filename}`} download className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-500" />
                <span className="text-sm">Part {i + 1} (Pages {f.pages})</span>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </a>
          ))}
          <button onClick={() => { setFile(null); setFiles([]) }} className="w-full py-2 text-sm text-gray-600 hover:text-gray-800">
            Split Another PDF
          </button>
        </div>
      )}
    </div>
  )
}