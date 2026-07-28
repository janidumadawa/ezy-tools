'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Type, Copy, CheckCircle, Trash2, ArrowUpDown, AlignLeft } from 'lucide-react'

export default function TextToolsPage() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState('')

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: text.length,
    charactersNoSpace: text.replace(/\s/g, '').length,
    lines: text ? text.split('\n').length : 0,
    sentences: text ? text.split(/[.!?]+/).filter(Boolean).length : 0,
  }

  const copyText = (result: string, label: string) => {
    navigator.clipboard.writeText(result)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const transformText = (type: string) => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase())
        break
      case 'lower':
        setText(text.toLowerCase())
        break
      case 'title':
        setText(text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        break
      case 'sentence':
        setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()))
        break
      case 'reverse':
        setText(text.split('').reverse().join(''))
        break
      case 'reverseWords':
        setText(text.split(' ').reverse().join(' '))
        break
      case 'trim':
        setText(text.split('\n').map(l => l.trim()).join('\n'))
        break
      case 'removeExtraSpaces':
        setText(text.replace(/\s+/g, ' ').trim())
        break
      case 'removeEmptyLines':
        setText(text.split('\n').filter(l => l.trim()).join('\n'))
        break
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Type className="w-12 h-12 text-teal-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Text Tools</h1>
        <p className="text-gray-500">Analyze, transform, and clean your text</p>
      </div>

      <div className="space-y-4">
        {/* Text Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={8}
            className="w-full resize-y text-sm border-0 outline-none text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center justify-between border-t pt-3 mt-2">
            <span className="text-xs text-gray-400">{stats.characters} characters</span>
            <button
              onClick={() => setText('')}
              className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'Words', value: stats.words },
            { label: 'Characters', value: stats.characters },
            { label: 'No Spaces', value: stats.charactersNoSpace },
            { label: 'Lines', value: stats.lines },
            { label: 'Sentences', value: stats.sentences },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-xl font-bold text-teal-600">{stat.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Transform Buttons */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Transform Text</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { type: 'upper', label: 'UPPERCASE', icon: 'Aa' },
              { type: 'lower', label: 'lowercase', icon: 'aa' },
              { type: 'title', label: 'Title Case', icon: 'Aa' },
              { type: 'sentence', label: 'Sentence case', icon: 'Aa' },
              { type: 'reverse', label: 'Reverse', icon: '⇄' },
              { type: 'reverseWords', label: 'Reverse Words', icon: '⇄' },
            ].map((btn) => (
              <button
                key={btn.type}
                onClick={() => transformText(btn.type)}
                className="py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Text */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Clean Text</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { type: 'trim', label: 'Trim Lines', icon: '✂️' },
              { type: 'removeExtraSpaces', label: 'Remove Extra Spaces', icon: '🧹' },
              { type: 'removeEmptyLines', label: 'Remove Empty Lines', icon: '📝' },
            ].map((btn) => (
              <button
                key={btn.type}
                onClick={() => transformText(btn.type)}
                className="py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={() => copyText(text, 'text')}
          disabled={!text}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {copied === 'text' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied === 'text' ? 'Copied!' : 'Copy Text'}
        </button>
      </div>
    </div>
  )
}