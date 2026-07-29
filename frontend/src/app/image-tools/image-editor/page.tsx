'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Upload, Download, RotateCw, FlipHorizontal, FlipVertical, Sun, Moon, Contrast, Crop, RefreshCw, ImageIcon } from 'lucide-react'

export default function ImageEditorPage() {
  const [image, setImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        resetFilters()
      }
      reader.readAsDataURL(file)
    }
  }

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
  }

  const applyFilters = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new window.Image()
    img.src = image
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      ctx.restore()
    }
  }

  useEffect(() => {
    applyFilters()
  }, [image, brightness, contrast, saturation, rotation, flipH, flipV])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `edited_${fileName || 'image'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <ImageIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Image Editor</h1>
        <p className="text-gray-500">Adjust brightness, contrast, rotate, and flip images</p>
      </div>

      <div className="space-y-4">
        {!image ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-red-400 transition-colors"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Click to upload image</p>
            <p className="text-sm text-gray-400">PNG, JPG, WebP supported</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        ) : (
          <>
            {/* Canvas Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-center overflow-auto">
              <canvas ref={canvasRef} className="max-w-full max-h-[400px] object-contain" />
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              {/* Brightness */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-500">Brightness</span></div>
                  <span className="text-xs text-gray-400">{brightness}%</span>
                </div>
                <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-red-500" />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2"><Contrast className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-500">Contrast</span></div>
                  <span className="text-xs text-gray-400">{contrast}%</span>
                </div>
                <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-red-500" />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2"><Moon className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-500">Saturation</span></div>
                  <span className="text-xs text-gray-400">{saturation}%</span>
                </div>
                <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full accent-red-500" />
              </div>

              {/* Rotate & Flip Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => setRotation(rotation - 90)} className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                  <RotateCw className="w-3 h-3" /> -90°
                </button>
                <button onClick={() => setRotation(rotation + 90)} className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                  <RotateCw className="w-3 h-3 rotate-180" /> +90°
                </button>
                <button onClick={() => setFlipH(!flipH)} className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${flipH ? 'bg-red-100 text-red-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <FlipHorizontal className="w-3 h-3" /> Flip H
                </button>
                <button onClick={() => setFlipV(!flipV)} className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${flipV ? 'bg-red-100 text-red-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <FlipVertical className="w-3 h-3" /> Flip V
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button onClick={downloadImage} className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={resetFilters} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={() => { setImage(null); resetFilters() }} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600">
                New
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}