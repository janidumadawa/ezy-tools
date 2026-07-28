'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Percent, Calculator } from 'lucide-react'

type CalcMode = 'basic' | 'increase' | 'decrease' | 'find'

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState<CalcMode>('basic')
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [formula, setFormula] = useState('')

  const calculate = () => {
    const v1 = parseFloat(value1) || 0
    const v2 = parseFloat(value2) || 0
    let res = 0
    let f = ''

    switch (mode) {
      case 'basic':
        // What is X% of Y?
        res = (v1 * v2) / 100
        f = `${v1}% of ${v2} = ${res}`
        break
      case 'increase':
        // X increased by Y%
        res = v1 + (v1 * v2) / 100
        f = `${v1} + ${v2}% = ${res}`
        break
      case 'decrease':
        // X decreased by Y%
        res = v1 - (v1 * v2) / 100
        f = `${v1} - ${v2}% = ${res}`
        break
      case 'find':
        // X is what % of Y?
        res = (v1 / v2) * 100
        f = `${v1} is ${res.toFixed(2)}% of ${v2}`
        break
    }

    setResult(res)
    setFormula(f)
  }

  const modes = [
    { key: 'basic' as CalcMode, label: 'What is % of ?', example: 'What is 20% of 150?' },
    { key: 'increase' as CalcMode, label: 'Increase by %', example: '150 + 20% = ?' },
    { key: 'decrease' as CalcMode, label: 'Decrease by %', example: '150 - 20% = ?' },
    { key: 'find' as CalcMode, label: 'What % is it?', example: '30 is what % of 150?' },
  ]

  const labels = {
    basic: { v1: 'Percentage (%)', v2: 'Of Number' },
    increase: { v1: 'Number', v2: 'Increase by (%)' },
    decrease: { v1: 'Number', v2: 'Decrease by (%)' },
    find: { v1: 'Number', v2: 'Of Number' },
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Percent className="w-12 h-12 text-rose-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Percentage Calculator</h1>
        <p className="text-gray-500">Calculate percentages easily</p>
      </div>

      <div className="space-y-4">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setResult(null); setValue1(''); setValue2('') }}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                mode === m.key
                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <p className="text-xs font-medium">{m.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{m.example}</p>
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">{labels[mode].v1}</label>
            <input
              type="number"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">{labels[mode].v2}</label>
            <input
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && calculate()}
            />
          </div>

          <button
            onClick={calculate}
            disabled={!value1 || !value2}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Calculate
          </button>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-white rounded-xl border border-rose-200 p-6 text-center">
            <p className="text-sm text-gray-400 mb-2">{formula}</p>
            <p className="text-4xl font-bold text-rose-600">
              {Number.isInteger(result) ? result.toLocaleString() : result.toFixed(2)}
              {mode === 'find' ? '%' : ''}
            </p>
          </div>
        )}

        {/* Quick Tips */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Quick Tips</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <span>10% = divide by 10</span>
            <span>25% = divide by 4</span>
            <span>50% = divide by 2</span>
            <span>1% = divide by 100</span>
          </div>
        </div>
      </div>
    </div>
  )
}