'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Braces, Copy, CheckCircle, Trash2, Minimize2, Maximize2 } from 'lucide-react'

export default function JSONFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  const formatJSON = () => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
    } catch (e: any) {
      setError(e.message || 'Invalid JSON')
      setOutput('')
    }
  }

  const minifyJSON = () => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
    } catch (e: any) {
      setError(e.message || 'Invalid JSON')
      setOutput('')
    }
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
        <Braces className="w-12 h-12 text-orange-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">JSON Formatter</h1>
        <p className="text-gray-500">Format, validate, and minify JSON data</p>
      </div>

      <div className="space-y-4">
        {/* Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "John", "age": 30}'
            rows={8}
            className="w-full resize-y text-sm border-0 outline-none text-gray-700 placeholder-gray-400 font-mono"
          />
          <div className="flex items-center justify-between border-t pt-3 mt-2">
            <span className="text-xs text-gray-400">{input.length} characters</span>
            <button onClick={() => { setInput(''); setOutput(''); setError('') }} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Indent Selector */}
        <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-2">
          <span className="text-xs text-gray-500">Indent:</span>
          {[2, 4, 8].map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={`px-3 py-1 rounded text-xs font-medium ${indent === n ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {n} spaces
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={formatJSON}
            disabled={!input}
            className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            Format
          </button>
          <button
            onClick={minifyJSON}
            disabled={!input}
            className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
            Minify
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700 font-mono">{error}</p>
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="bg-white rounded-xl border border-orange-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Formatted JSON</label>
              <button onClick={copyOutput} className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-600">
                {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-700 max-h-96 overflow-auto whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}