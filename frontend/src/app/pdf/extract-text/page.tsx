'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, FileText, CheckCircle, Copy, Eye } from 'lucide-react'

// const API_URL = 'http://localhost:8000/api/pdf'
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/pdf`

export default function ExtractTextPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError('')
      setResult(null)
    } else {
      setError('Please select a valid PDF file')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleExtract = async () => {
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_URL}/extract-text`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        setResult(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to extract text')
    } finally {
      setLoading(false)
    }
  }

  const copyText = () => {
    if (result?.text_preview) {
      navigator.clipboard.writeText(result.text_preview)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/pdf" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        &larr; Back to PDF Tools
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Extract Text from PDF</h1>
          <p className="text-sm text-gray-500">Extract all text content from your PDF file</p>
        </div>
      </div>

      {/* Upload */}
      {!file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragOver 
              ? 'border-indigo-400 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 bg-gray-50/50'
          }`}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-indigo-500' : 'text-gray-400'}`} />
          <p className="text-gray-600 font-medium mb-1">
            {dragOver ? 'Drop your PDF here' : 'Drag & drop PDF here'}
          </p>
          <p className="text-sm text-gray-400 mb-4">or click to browse files</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 inline-block"
          >
            Choose PDF File
          </button>
        </div>
      )}

      {/* File Selected */}
      {file && !result && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
            </div>
            <button 
              onClick={() => setFile(null)} 
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              <span className="text-lg">&times;</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          <button
            onClick={handleExtract}
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Extracting Text...</>
            ) : (
              <><Eye className="w-5 h-5" /> Extract Text</>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-indigo-800">Text Extracted!</p>
              <p className="text-sm text-indigo-600">{result.total_pages} page{result.total_pages > 1 ? 's' : ''} processed</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-medium text-gray-700 text-sm">Extracted Text</h3>
              <button
                onClick={copyText}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <><CheckCircle className="w-3 h-3 text-green-500" /> Copied!</>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy Text</>
                )}
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {result.text_preview}
              </pre>
            </div>
          </div>

          <a
            href={`http://localhost:8000/api/pdf/file/${result.filename}`}
            download
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download as Text File (.txt)
          </a>

          <button
            onClick={() => { setFile(null); setResult(null) }}
            className="w-full py-2.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Extract from Another PDF
          </button>
        </div>
      )}

      {/* Empty State Steps */}
      {!file && !result && (
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-500">Upload PDF</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-500">Extract Text</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Download className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-500">Download .txt</p>
          </div>
        </div>
      )}
    </div>
  )
}