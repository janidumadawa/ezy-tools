'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, Cake } from 'lucide-react'

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const today = new Date()

    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    // Total days
    const diffTime = today.getTime() - birth.getTime()
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60

    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday < today) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    }
    const daysUntilBirthday = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Zodiac sign
    const zodiac = getZodiacSign(birth.getDate(), birth.getMonth() + 1)

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      daysUntilBirthday,
      zodiac,
      birthDate: birth.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    })
  }

  const getZodiacSign = (day: number, month: number) => {
    const signs = [
      { name: 'Capricorn', emoji: '♑', start: [12, 22], end: [1, 19] },
      { name: 'Aquarius', emoji: '♒', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', emoji: '♓', start: [2, 19], end: [3, 20] },
      { name: 'Aries', emoji: '♈', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', emoji: '♉', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', emoji: '♊', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', emoji: '♋', start: [6, 21], end: [7, 22] },
      { name: 'Leo', emoji: '♌', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', emoji: '♍', start: [8, 23], end: [9, 22] },
      { name: 'Libra', emoji: '♎', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', emoji: '♏', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', emoji: '♐', start: [11, 22], end: [12, 21] },
    ]

    for (const sign of signs) {
      if (
        (month === sign.start[0] && day >= sign.start[1]) ||
        (month === sign.end[0] && day <= sign.end[1])
      ) {
        return sign
      }
    }
    return signs[0]
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Cake className="w-12 h-12 text-pink-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Age Calculator</h1>
        <p className="text-gray-500">Calculate your exact age and time since birth</p>
      </div>

      <div className="space-y-4">
        {/* Date Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            onClick={calculateAge}
            disabled={!birthDate}
            className="w-full mt-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            Calculate Age
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Main Age */}
            <div className="bg-white rounded-xl border border-pink-200 p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Your Age is</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-bold text-pink-600">{result.years}</span>
                <div className="text-left">
                  <p className="text-sm text-gray-500">years</p>
                  <p className="text-sm text-gray-400">{result.months} months</p>
                  <p className="text-sm text-gray-400">{result.days} days</p>
                </div>
              </div>
              {result.zodiac && (
                <p className="mt-3 text-sm text-gray-500">
                  Zodiac Sign: <span className="font-medium">{result.zodiac.emoji} {result.zodiac.name}</span>
                </p>
              )}
            </div>

            {/* Born On */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-400 mb-1">Born on</p>
              <p className="text-sm text-gray-700 font-medium">{result.birthDate}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Total Days', value: result.totalDays.toLocaleString() },
                { label: 'Total Weeks', value: result.totalWeeks.toLocaleString() },
                { label: 'Total Months', value: result.totalMonths.toLocaleString() },
                { label: 'Total Hours', value: result.totalHours.toLocaleString() },
                { label: 'Total Minutes', value: result.totalMinutes.toLocaleString() },
                { label: 'Days Until 🎂', value: result.daysUntilBirthday },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                  <p className="text-lg font-bold text-pink-600">{stat.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}