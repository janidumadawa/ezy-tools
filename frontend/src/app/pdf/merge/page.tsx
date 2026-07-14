'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Upload, Download, Loader2, X, FileText, CheckCircle, Layers, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'

const API_URL = 'http://localhost:8000/api/pdf'

interface PDFFile {
  file: File
  id: string
  preview?: string
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setError('')
    setDownloadUrl('')
    
    const newFiles: PDFFile[] = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newFiles.length) return
    
    const temp = newFiles[index]
    newFiles[index] = newFiles[newIndex]
    newFiles[newIndex] = temp
    
    setFiles(newFiles)
  }

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    
    const newFiles = [...files]
    const draggedItem = newFiles[dragIndex]
    newFiles.splice(dragIndex, 1)
    newFiles.splice(index, 0, draggedItem)
    
    setFiles(newFiles)
    setDragIndex(index)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      files.forEach(({ file }) => {
        formData.append('files', file)
      })

      const response = await axios.post(`${API_URL}/merge`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        setDownloadUrl(`http://localhost:8000/api/pdf/file/${response.data.data.filename}`)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to merge PDFs')
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const totalSize = files.reduce((acc, { file }) => acc + file.size, 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <Link href="/pdf" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1">
        &larr; Back to PDF Tools
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Layers className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merge PDF</h1>
          <p className="text-sm text-gray-500">Combine multiple PDFs into one file</p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mt-8 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7 text-blue-600" />
        </div>
        <p className="text-gray-600 font-medium mb-1">Drag & drop PDF files here</p>
        <p className="text-sm text-gray-400 mb-4">or click to browse files</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Choose Files
        </label>
        <p className="text-xs text-gray-400 mt-3">Maximum file size: 100MB per file</p>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Files to merge ({files.length})
            </h3>
            <span className="text-xs text-gray-400">
              Total: {formatSize(totalSize)}
            </span>
          </div>

          {/* Order Hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-3 flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-blue-700">
              Drag files to reorder • Files will be merged in this order (top to bottom)
            </p>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 bg-white border rounded-lg px-4 py-3 transition-all ${
                  dragIndex === index 
                    ? 'border-blue-400 shadow-lg scale-[1.02] opacity-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                } cursor-grab active:cursor-grabbing`}
              >
                {/* Drag Handle */}
                <div className="text-gray-300 hover:text-gray-500">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Page Number Badge */}
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                </div>

                {/* PDF Icon */}
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatSize(file.file.size)}
                  </p>
                </div>

                {/* Move Buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveFile(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-100"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-100"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add More Files Button */}
      {files.length > 0 && (
        <div className="mt-3">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="add-more-files"
          />
          <label
            htmlFor="add-more-files"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
          >
            <Upload className="w-4 h-4" />
            Add more files
          </label>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
          <X className="w-4 h-4 text-red-500" />
          {error}
        </div>
      )}

      {/* Merge Button */}
      {files.length >= 2 && !downloadUrl && (
        <button
          onClick={handleMerge}
          disabled={loading}
          className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Merging {files.length} files...
            </>
          ) : (
            <>
              <Layers className="w-5 h-5" />
              Merge {files.length} PDFs into One
            </>
          )}
        </button>
      )}

      {/* Download Result */}
      {downloadUrl && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Merge Complete!</p>
              <p className="text-sm text-green-600">Your merged PDF is ready</p>
            </div>
          </div>
          
          <a
            href={downloadUrl}
            download
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
          >
            <Download className="w-5 h-5" />
            Download Merged PDF
          </a>
          
          <button
            onClick={() => {
              setDownloadUrl('')
              setFiles([])
            }}
            className="w-full mt-2 py-2.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Start New Merge
          </button>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && !downloadUrl && (
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
              <p className="text-xs text-gray-500">Select PDFs</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold text-blue-600">2</span>
              </div>
              <p className="text-xs text-gray-500">Arrange order</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold text-blue-600">3</span>
              </div>
              <p className="text-xs text-gray-500">Download</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}