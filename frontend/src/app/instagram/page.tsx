'use client'

import { AlertTriangle, Link } from 'lucide-react'
import Image from "next/image";

export default function InstagramPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10 lg:py-12 relative overflow-hidden">

      {/* Background Watermarks - hidden on mobile */}
      <div className="hidden lg:block absolute top-40 left-[30px] pointer-events-none -z-10">
        <img src="/logos/instagram.png" alt="" className="w-[300px] h-[300px] object-contain opacity-[0.3] blur-sm rotate-22" />
      </div>

      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <a href="/" className="text-xs sm:text-sm text-[#c13584] hover:text-[#e1306c] transition-colors flex items-center gap-1">
          &larr; Back to Home
        </a>
      </div>

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Image
            src="/logos/instagram.png"
            alt="Instagram Logo"
            width={40}
            height={40}
            className="w-10 h-10 sm:w-[55px] sm:h-[55px] object-contain"
          />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
            Instagram{" "}
            <span className="text-[#e1306c]">Downloader</span>
          </h1>
        </div>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4 lg:mb-6 px-2">
          Instagram වීඩියෝ සහ ඡායාරූප ඩවුන්ලෝඩ් කරගැනීමට
        </h2>

        <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-2xl mx-auto px-2">
          Download Instagram Reels, Photos, and Videos in high quality.
        </p>

        <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto mt-2 sm:mt-3 leading-relaxed px-2">
          Instagram Reels, Photos සහ Videos{" "}
          <span className="font-semibold">High Quality</span> එකෙන්
          පහසුවෙන් Download කරගැනීමට හැක.
        </p>
      </div>

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
            Instagram downloader is currently unavailable on the web version. 
            We're working on making it available soon.
          </p>
        </div>
      </div>

      {/* Disabled URL Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="mb-2 sm:mb-3 px-1">
          <p className="text-xs sm:text-sm font-medium text-gray-400">
            Paste your Instagram link below
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400">
            Instagram Link එක මෙතනට Paste කරන්න
          </p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 opacity-50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 sm:p-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Link className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value=""
                placeholder="Service temporarily unavailable..."
                className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none text-gray-400 placeholder-gray-400 py-1 cursor-not-allowed"
                disabled
              />
            </div>
            <button
              disabled
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-300 text-gray-500 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed whitespace-nowrap"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}