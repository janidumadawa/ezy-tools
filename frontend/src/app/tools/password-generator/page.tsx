'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Key, Copy, RefreshCw, CheckCircle, Shield, Zap } from 'lucide-react'

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('strong')

  const generatePassword = useCallback(() => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    }

    let charPool = ''
    if (options.uppercase) charPool += chars.uppercase
    if (options.lowercase) charPool += chars.lowercase
    if (options.numbers) charPool += chars.numbers
    if (options.symbols) charPool += chars.symbols

    if (!charPool) return

    let result = ''
    for (let i = 0; i < length; i++) {
      result += charPool.charAt(Math.floor(Math.random() * charPool.length))
    }
    setPassword(result)

    // Calculate strength
    const activeOptions = Object.values(options).filter(Boolean).length
    if (length >= 16 && activeOptions >= 3) setStrength('strong')
    else if (length >= 10 && activeOptions >= 2) setStrength('medium')
    else setStrength('weak')
  }, [length, options])

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const strengthColor = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  }

  const strengthText = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Key className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Generator</h1>
        <p className="text-gray-500">Generate strong, secure passwords instantly</p>
      </div>

      <div className="space-y-6">
        {/* Password Display */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-lg text-gray-800 min-h-[48px] break-all">
              {password || 'Click generate to create password'}
            </div>
            {password && (
              <button
                onClick={copyToClipboard}
                className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-600" />}
              </button>
            )}
          </div>

          {/* Strength Indicator */}
          {password && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strengthColor[strength]}`} style={{ width: strength === 'strong' ? '100%' : strength === 'medium' ? '66%' : '33%' }} />
              </div>
              <span className={`text-xs font-medium ${strength === 'strong' ? 'text-green-600' : strength === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                {strengthText[strength]}
              </span>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Length */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Length</label>
              <span className="text-sm font-bold text-indigo-600">{length}</span>
            </div>
            <input
              type="range"
              min="6"
              max="50"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>6</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          {/* Character Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'uppercase', label: 'A-Z', icon: 'ABC' },
                { key: 'lowercase', label: 'a-z', icon: 'abc' },
                { key: 'numbers', label: '0-9', icon: '123' },
                { key: 'symbols', label: '!@#$%', icon: '@#$' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setOptions(prev => ({ ...prev, [opt.key]: !prev[opt.key as keyof typeof options] }))}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    options[opt.key as keyof typeof options]
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold w-8">{opt.icon}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200"
        >
          <RefreshCw className="w-5 h-5" />
          Generate Password
        </button>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">Security Tips</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Use at least 16 characters for strong security</li>
              <li>• Mix uppercase, lowercase, numbers, and symbols</li>
              <li>• Never reuse passwords across accounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}