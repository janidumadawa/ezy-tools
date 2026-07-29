'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Code2, Copy, CheckCircle, ArrowLeftRight, Trash2 } from 'lucide-react'

export default function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleConvert = () => {
    setError('')
    try {
      if (mode === 'encode') {
        setOutput(btoa(input))
      } else {
        setOutput(atob(input))
      }
    } catch (e) {
      setError(mode === 'decode' ? 'Invalid Base64 string' : 'Failed to encode')
    }
  }

  const swap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInput(output)
    setOutput('')
    setError('')
  }

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Code2 className="w-12 h-12 text-amber-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Base64 Encoder/Decoder</h1>
        <p className="text-gray-500">Encode or decode text to/from Base64 format</p>
      </div>

      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => { setMode('encode'); setOutput(''); setError('') }}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
              mode === 'encode' ? 'bg-white shadow text-amber-700' : 'text-gray-500'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode('decode'); setOutput(''); setError('') }}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
              mode === 'decode' ? 'bg-white shadow text-amber-700' : 'text-gray-500'
            }`}
          >
            Decode
          </button>
        </div>

        {/* Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-xs text-gray-400 mb-2">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text...' : 'Enter Base64 string...'}
            rows={5}
            className="w-full resize-y text-sm border-0 outline-none text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center justify-between border-t pt-3 mt-2">
            <span className="text-xs text-gray-400">{input.length} characters</span>
            <button onClick={() => { setInput(''); setOutput('') }} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Convert & Swap Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleConvert}
            disabled={!input}
            className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Code2 className="w-4 h-4" />
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          <button
            onClick={swap}
            disabled={!output}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg transition-colors"
            title="Swap"
          >
            <ArrowLeftRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        {/* Output */}
        {output && (
          <div className="bg-white rounded-xl border border-amber-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </label>
              <button
                onClick={copyOutput}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-600"
              >
                {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono text-gray-700 break-all max-h-60 overflow-y-auto">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}