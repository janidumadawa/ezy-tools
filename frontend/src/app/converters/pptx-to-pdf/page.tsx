'use client'

import { AlertTriangle, Presentation } from 'lucide-react'
import Link from 'next/link'

export default function PptxToPdfPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Presentation className="w-12 h-12 text-orange-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">PowerPoint to PDF</h1>
        <p className="text-gray-500">Convert PowerPoint presentations to PDF</p>
      </div>

      {/* Unavailable Notice */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 sm:p-10 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-2">
          Service Under Development
        </h2>
        <p className="text-sm sm:text-base text-amber-700 max-w-md mx-auto">
          We're working on making it available online soon.
        </p>
      </div>

      {/* Disabled Input */}
      <div className="mt-6 bg-white rounded-xl border-2 border-gray-200 opacity-50">
        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Presentation className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value=""
            placeholder="Service temporarily unavailable..."
            className="flex-1 text-sm bg-transparent border-none outline-none text-gray-400 placeholder-gray-400 cursor-not-allowed"
            disabled
          />
          <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg text-sm font-semibold cursor-not-allowed whitespace-nowrap">
            Convert
          </button>
        </div>
      </div>
    </div>
  )
}