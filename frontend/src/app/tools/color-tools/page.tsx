'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Palette, Copy, CheckCircle, RefreshCw } from 'lucide-react'

export default function ColorToolsPage() {
  const [hex, setHex] = useState('#884AB2')
  const [copied, setCopied] = useState('')

  // Convert HEX to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    }
    return { r: 0, g: 0, b: 0 }
  }

  const rgb = hexToRgb(hex)
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  // Generate random color
  const randomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setHex(randomHex)
  }

  // Generate palette
  const generatePalette = () => {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const colors = []
    for (let i = 0; i < 5; i++) {
      const newHue = (hsl.h + i * 72) % 360
      colors.push(`hsl(${newHue}, ${hsl.s}%, ${hsl.l}%)`)
    }
    return colors
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const formatValue = (label: string, value: string) => (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-mono font-medium text-gray-700">{value}</p>
      </div>
      <button
        onClick={() => copyToClipboard(value, label)}
        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        title="Copy"
      >
        {copied === label ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
      </button>
    </div>
  )

  const palette = generatePalette()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Palette className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Color Tools</h1>
        <p className="text-gray-500">Convert colors and generate palettes</p>
      </div>

      <div className="space-y-4">
        {/* Color Picker & Preview */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="h-32 transition-colors duration-300" style={{ backgroundColor: hex }} />
          <div className="p-4 flex items-center gap-3">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border flex-shrink-0"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={randomColor}
              className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
              title="Random color"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Color Values */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Color Values</h3>
          {formatValue('HEX', hex)}
          {formatValue('RGB', rgbString)}
          {formatValue('HSL', hslString)}
        </div>

      </div>
    </div>
  )
}