'use client'

import { useState } from 'react'
import { Info, X } from 'lucide-react'

export default function InfoNotice() {
  const [open, setOpen] = useState(false)

  return (
    <div className="hidden lg:block fixed right-5 bottom-8 z-50">

      {open ? (
        <div className="w-52 bg-white border border-gray-200 rounded-xl shadow-lg p-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            
            <img
              src="/logo3-nobg.png"
              alt="EzyTools Logo"
                className="w-28 h-8 object-contain"
            />

            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

          </div>


          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Simple, fast, and free tools for everyday tasks.
          </p>


          <p className="text-xs text-gray-400 leading-relaxed">
            දෛනික අවශ්‍යතා සඳහා සරල, වේගවත් සහ නොමිලේ Online Tools.
          </p>


          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">

            <p className="text-sm font-medium text-red-500">
              No registration required.
            </p>

            <p className="text-xs text-gray-400">
              ලියාපදිංචිය අවශ්‍ය නොවේ.
            </p>

          </div>

        </div>

      ) : (

        /* Floating Icon */

        <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-purple-600 flex items-center justify-center transition-all hover:scale-105 overflow-hidden"
        aria-label="About EzyTools"
        >
        <img
            src="/favicon.ico"
            alt="EzyTools Logo"
            className="w-11 h-11 object-contain"
        />
        </button>

      )}

    </div>
  )
}