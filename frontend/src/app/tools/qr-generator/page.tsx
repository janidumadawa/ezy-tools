'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { QrCode, Download, Loader2, RefreshCw, Upload, X } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/qr`

export default function QRGeneratorPage() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(300)
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoPreview('')
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const generateQR = async () => {
    if (!text.trim()) return
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('data', text)
      formData.append('size', size.toString())
      formData.append('color', color)
      formData.append('bg_color', bgColor)
      if (logo) formData.append('logo', logo)
      
      const response = await axios.post(`${API_URL}/generate`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Failed to generate QR code') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <QrCode className="w-12 h-12 text-gray-800 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
        <p className="text-gray-500">Generate custom QR codes with colors and logo</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text or URL</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && generateQR()}
          />
        </div>

        {/* Size Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size: {size}px</label>
          <input type="range" min="150" max="600" step="50" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>150px</span>
            <span>300px</span>
            <span>600px</span>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">QR Color</label>
            <div className="flex gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <div className="flex gap-2">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border" />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo (optional)</label>
          {logoPreview ? (
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <img src={logoPreview} alt="Logo preview" className="w-10 h-10 rounded object-contain" />
              <span className="text-sm text-gray-600 truncate flex-1">{logo?.name}</span>
              <button onClick={removeLogo} className="text-red-500 hover:bg-red-50 p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 transition-colors">
              <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Click to upload logo (PNG, JPG)</p>
            </div>
          )}
          <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateQR}
          disabled={loading || !text.trim()}
          className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 text-center">
          <img src={result.preview} alt="QR Code" className="mx-auto rounded-lg shadow-sm" style={{ maxWidth: '100%', height: 'auto' }} />
          <div className="mt-4 flex gap-3 justify-center flex-wrap">
            <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/qr/file/${result.filename}`} download className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
              <Download className="w-4 h-4" /> Download PNG
            </a>
            <button onClick={() => { setResult(null); setText('') }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
              <RefreshCw className="w-4 h-4" /> Create New
            </button>
          </div>
        </div>
      )}
    </div>
  )
}