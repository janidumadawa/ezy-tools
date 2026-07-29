'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Volume2, Download, Loader2, Play, Pause } from 'lucide-react'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/tts`

const languages = [
  { code: 'en', name: 'English' },
  { code: 'si', name: 'Sinhala (සිංහල)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
]

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [lang, setLang] = useState('en')
  const [slow, setSlow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const generateSpeech = async () => {
    if (!text.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('lang', lang)
      formData.append('slow', slow.toString())
      
      const response = await axios.post(`${API_URL}/generate`, formData)
      if (response.data.success) setResult(response.data.data)
      else setError(response.data.error)
    } catch (err: any) { setError('Failed to generate audio') }
    finally { setLoading(false) }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setPlaying(!playing)
    }
  }

  const charCount = text.length

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Volume2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Text to Speech</h1>
        <p className="text-gray-500">Convert text into natural sounding audio</p>
      </div>

      <div className="space-y-4">
        {/* Text Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={6}
            maxLength={5000}
            className="w-full resize-y text-sm border-0 outline-none text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center justify-between border-t pt-3 mt-2">
            <span className="text-xs text-gray-400">{charCount} / 5000 characters</span>
            <button onClick={() => setText('')} className="text-xs text-gray-400 hover:text-red-500">Clear</button>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          {/* Language */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Slow Mode */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={slow}
              onChange={(e) => setSlow(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-600"
            />
            <span className="text-sm text-gray-600">Slow speech</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateSpeech}
          disabled={loading || !text.trim()}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Generate Audio'}
        </button>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl border border-emerald-200 p-6 space-y-4">
            {/* Audio Player */}
            <audio
              ref={audioRef}
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/tts/file/${result.filename}`}
              onEnded={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="w-full"
              controls
            />

            {/* Download Button */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/api/tts/file/${result.filename}`}
              download
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download MP3
            </a>

            <button
              onClick={() => { setResult(null); setText('') }}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Generate Another
            </button>
          </div>
        )}
      </div>
    </div>
  )
}