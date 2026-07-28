'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ruler, ArrowLeftRight, Weight, Thermometer, Gauge } from 'lucide-react'

type UnitCategory = {
  name: string
  icon: any
  units: { name: string; value: number }[]
}

const categories: Record<string, UnitCategory> = {
  length: {
    name: 'Length',
    icon: Ruler,
    units: [
      { name: 'Millimeter', value: 0.001 },
      { name: 'Centimeter', value: 0.01 },
      { name: 'Meter', value: 1 },
      { name: 'Kilometer', value: 1000 },
      { name: 'Inch', value: 0.0254 },
      { name: 'Foot', value: 0.3048 },
      { name: 'Yard', value: 0.9144 },
      { name: 'Mile', value: 1609.344 },
    ]
  },
  weight: {
    name: 'Weight',
    icon: Weight,
    units: [
      { name: 'Milligram', value: 0.000001 },
      { name: 'Gram', value: 0.001 },
      { name: 'Kilogram', value: 1 },
      { name: 'Ton', value: 1000 },
      { name: 'Ounce', value: 0.0283495 },
      { name: 'Pound', value: 0.453592 },
      { name: 'Stone', value: 6.35029 },
    ]
  },
  temperature: {
    name: 'Temperature',
    icon: Thermometer,
    units: [
      { name: 'Celsius', value: 0 },
      { name: 'Fahrenheit', value: 0 },
      { name: 'Kelvin', value: 0 },
    ]
  },
  area: {
    name: 'Area',
    icon: Gauge,
    units: [
      { name: 'Square Meter', value: 1 },
      { name: 'Square Kilometer', value: 1000000 },
      { name: 'Square Foot', value: 0.092903 },
      { name: 'Square Yard', value: 0.836127 },
      { name: 'Acre', value: 4046.86 },
      { name: 'Hectare', value: 10000 },
    ]
  },
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('Meter')
  const [toUnit, setToUnit] = useState('Kilometer')
  const [fromValue, setFromValue] = useState('1')

  const currentCategory = categories[category]

  const convert = (): number => {
    const value = parseFloat(fromValue) || 0

    if (category === 'temperature') {
      // Special temperature conversion
      let celsius = 0
      if (fromUnit === 'Celsius') celsius = value
      else if (fromUnit === 'Fahrenheit') celsius = (value - 32) * 5 / 9
      else if (fromUnit === 'Kelvin') celsius = value - 273.15

      if (toUnit === 'Celsius') return celsius
      else if (toUnit === 'Fahrenheit') return (celsius * 9 / 5) + 32
      else if (toUnit === 'Kelvin') return celsius + 273.15
      return celsius
    }

    // Regular conversion
    const from = currentCategory.units.find(u => u.name === fromUnit)
    const to = currentCategory.units.find(u => u.name === toUnit)
    if (!from || !to) return 0
    return (value * from.value) / to.value
  }

  const swap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const result = convert()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Ruler className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Unit Converter</h1>
        <p className="text-gray-500">Convert between different units of measurement</p>
      </div>

      <div className="space-y-4">
        {/* Category Selector */}
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                category === key
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {/* From */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">From</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white min-w-[130px]"
              >
                {currentCategory.units.map(u => (
                  <option key={u.name} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swap}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Swap units"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">To</label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-lg text-lg font-medium text-cyan-700">
                {result % 1 === 0 ? result.toLocaleString() : result.toFixed(6)}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white min-w-[130px]"
              >
                {currentCategory.units.map(u => (
                  <option key={u.name} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-2">Conversion</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{fromValue || '0'} {fromUnit}</span>
            {' = '}
            <span className="font-medium text-cyan-600">
              {result % 1 === 0 ? result.toLocaleString() : result.toFixed(6)} {toUnit}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}