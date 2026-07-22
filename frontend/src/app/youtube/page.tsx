'use client'

import Header from '@/src/components/youtube/Header'
import { AlertTriangle, Link } from 'lucide-react'

export default function YouTubePage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-12">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <a href="/" className="text-xs sm:text-sm text-red-600 hover:text-red-800 transition-colors flex items-center gap-1">
          &larr; Back to Home
        </a>
      </div>

      <Header />

      {/* Unavailable Notice */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-2">
            Service Under Development
          </h2>
          <p className="text-sm sm:text-base text-amber-700 max-w-md mx-auto">
            YouTube downloader is currently unavailable on the web version. 
            We're working on making it available soon.
          </p>
        </div>
      </div>

      {/* Disabled URL Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-xl border-2 border-gray-200 opacity-50">
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Link className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value=""
              placeholder="Service temporarily unavailable..."
              className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none text-gray-400 placeholder-gray-400 cursor-not-allowed"
              disabled
            />
            <button
              disabled
              className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-not-allowed whitespace-nowrap"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}