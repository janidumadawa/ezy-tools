'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Upload, Download, ImageIcon, Type, Trash2, Plus, RefreshCw } from 'lucide-react'

const memeTemplates = [
  { name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { name: 'Distracted BF', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
  { name: 'Thinking', url: 'https://i.imgflip.com/1i7c9t.jpg' },
  { name: 'Surprised Pikachu', url: 'https://i.imgflip.com/2kbn1e.jpg' },
]

interface TextBox {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
}

export default function MemeGeneratorPage() {
  const [image, setImage] = useState<string | null>(null)
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([
    { id: '1', text: 'TOP TEXT', x: 50, y: 10, fontSize: 40, color: '#FFFFFF' },
    { id: '2', text: 'BOTTOM TEXT', x: 50, y: 85, fontSize: 40, color: '#FFFFFF' },
  ])
  const [selectedBox, setSelectedBox] = useState<string>('1')
  const [showTemplates, setShowTemplates] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedTextBox = textBoxes.find(b => b.id === selectedBox)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const loadTemplate = (url: string) => {
    setImage(url)
    setShowTemplates(false)
  }

  const addTextBox = () => {
    const newBox: TextBox = {
      id: Date.now().toString(),
      text: 'NEW TEXT',
      x: 50,
      y: 50,
      fontSize: 36,
      color: '#FFFFFF',
    }
    setTextBoxes([...textBoxes, newBox])
    setSelectedBox(newBox.id)
  }

  const removeTextBox = (id: string) => {
    if (textBoxes.length > 1) {
      setTextBoxes(textBoxes.filter(b => b.id !== id))
      if (selectedBox === id) setSelectedBox(textBoxes[0].id)
    }
  }

  const updateTextBox = (field: keyof TextBox, value: string | number) => {
    setTextBoxes(textBoxes.map(b => 
      b.id === selectedBox ? { ...b, [field]: value } : b
    ))
  }

  const drawMeme = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = image
    img.onload = () => {
      // Set canvas to image dimensions (max 600px width)
      const maxWidth = 600
      const scale = maxWidth / img.width
      canvas.width = maxWidth
      canvas.height = img.height * scale

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw text boxes
      textBoxes.forEach(box => {
        const x = (box.x / 100) * canvas.width
        const y = (box.y / 100) * canvas.height
        const fontSize = box.fontSize * scale

        ctx.font = `bold ${fontSize}px Impact, sans-serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = box.color
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = fontSize / 15
        ctx.strokeText(box.text, x, y)
        ctx.fillText(box.text, x, y)

        // Draw border on selected box
        if (box.id === selectedBox) {
          const metrics = ctx.measureText(box.text)
          const textWidth = metrics.width
          const textHeight = fontSize
          ctx.strokeStyle = '#3B82F6'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.strokeRect(
            x - textWidth / 2 - 10,
            y - textHeight + 5,
            textWidth + 20,
            textHeight + 10
          )
          ctx.setLineDash([])
        }
      })
    }
  }

  useEffect(() => {
    drawMeme()
  }, [image, textBoxes, selectedBox])

  const downloadMeme = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'meme.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <ImageIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meme Generator</h1>
        <p className="text-gray-500">Create memes with custom text and templates</p>
      </div>

      <div className="space-y-4">
        {!image ? (
          <div className="space-y-4">
            {/* Upload */}
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-yellow-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Click to upload your image</p>
              <p className="text-sm text-gray-400">or choose a template below</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Templates */}
            <div>
              <button onClick={() => setShowTemplates(!showTemplates)} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                {showTemplates ? 'Hide Templates' : '📋 Use a Template'}
              </button>
              {showTemplates && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {memeTemplates.map((tpl) => (
                    <button key={tpl.name} onClick={() => loadTemplate(tpl.url)} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-yellow-400 transition-colors">
                      <img src={tpl.url} alt={tpl.name} className="w-full h-24 object-cover" />
                      <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center">{tpl.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Canvas */}
            <div className="bg-white rounded-xl border border-gray-200 p-2 flex justify-center">
              <canvas ref={canvasRef} className="max-w-full rounded" />
            </div>

            {/* Text Editor */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Text Boxes</h3>
                <button onClick={addTextBox} className="text-xs text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              {/* Text Box Tabs */}
              <div className="flex gap-1 flex-wrap">
                {textBoxes.map((box, i) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBox(box.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      selectedBox === box.id ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    Text {i + 1}
                    {textBoxes.length > 1 && selectedBox === box.id && (
                      <button onClick={(e) => { e.stopPropagation(); removeTextBox(box.id) }} className="ml-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-3 h-3 inline" />
                      </button>
                    )}
                  </button>
                ))}
              </div>

              {selectedTextBox && (
                <div className="space-y-3">
                  {/* Text Input */}
                  <input
                    type="text"
                    value={selectedTextBox.text}
                    onChange={(e) => updateTextBox('text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Enter text..."
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {/* Font Size */}
                    <div>
                      <label className="text-[10px] text-gray-400">Size</label>
                      <input type="range" min="16" max="80" value={selectedTextBox.fontSize} onChange={(e) => updateTextBox('fontSize', Number(e.target.value))} className="w-full" />
                    </div>

                    {/* X Position */}
                    <div>
                      <label className="text-[10px] text-gray-400">X: {selectedTextBox.x}%</label>
                      <input type="range" min="5" max="95" value={selectedTextBox.x} onChange={(e) => updateTextBox('x', Number(e.target.value))} className="w-full" />
                    </div>

                    {/* Y Position */}
                    <div>
                      <label className="text-[10px] text-gray-400">Y: {selectedTextBox.y}%</label>
                      <input type="range" min="5" max="95" value={selectedTextBox.y} onChange={(e) => updateTextBox('y', Number(e.target.value))} className="w-full" />
                    </div>
                  </div>

                  {/* Color */}
                  <div className="flex items-center gap-2">
                    <input type="color" value={selectedTextBox.color} onChange={(e) => updateTextBox('color', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <div className="flex gap-1">
                      {['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#FFFF00'].map(c => (
                        <button key={c} onClick={() => updateTextBox('color', c)} className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button onClick={downloadMeme} className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Meme
              </button>
              <button onClick={() => { setImage(null) }} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}