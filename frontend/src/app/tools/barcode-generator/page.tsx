'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Download, Loader2, RefreshCw, Barcode } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/barcode`

const barcodeTypes = [
  { value: 'code128', label: 'Code 128', desc: 'General purpose' },
  { value: 'code39', label: 'Code 39', desc: 'Alphanumeric' },
  { value: 'ean13', label: 'EAN-13', desc: 'Products (12 digits)' },
  { value: 'ean8', label: 'EAN-8', desc: 'Small products (7 digits)' },
  { value: 'upca', label: 'UPC-A', desc: 'Retail (11 digits)' },
]

export default function BarcodeGeneratorPage() {
  const [data, setData] = useState('')
  const [barcodeType, setBarcodeType] = useState('code128')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const generateBarcode = async () => {
    if (!data.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const formData = new FormData()
      formData.append('data', data)
      formData.append('barcode_type', barcodeType)
      
      const response = await axios.post(`${API_URL}/generate`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Failed to generate barcode') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Barcode className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Barcode Generator</h1>
        <p className="text-gray-500">Generate various types of barcodes</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {/* Data Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode Data</label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Enter numbers or text..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && generateBarcode()}
            />
          </div>

          {/* Barcode Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {barcodeTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setBarcodeType(type.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    barcodeType === type.value
                      ? 'border-slate-500 bg-slate-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{type.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateBarcode}
            disabled={loading || !data.trim()}
            className="w-full py-3 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Barcode className="w-4 h-4" />}
            {loading ? 'Generating...' : 'Generate Barcode'}
          </button>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <img src={result.preview} alt="Barcode" className="mx-auto max-w-full h-auto" />
            <div className="mt-4 flex gap-3 justify-center">
              <a
                href={`${API_URL}/file/${result.filename}`}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                <Download className="w-4 h-4" /> Download PNG
              </a>
              <button
                onClick={() => { setResult(null); setData('') }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                <RefreshCw className="w-4 h-4" /> New
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}