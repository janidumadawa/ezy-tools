import Link from 'next/link'
import Image from 'next/image'
import { Globe, MessageCircle, Play } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo3-nobg.png"
                alt="EzyTools Logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>

            <p className="text-sm text-gray-500 mb-1">
              Free online tools to make your daily tasks easier. Download videos, convert files, and more.
            </p>

            <p className="text-sm text-gray-400">
              ඔබගේ දෛනික වැඩ පහසු කරගැනීමට නොමිලේ Online Tools.
              වීඩියෝ බාගත කිරීම, File conversion සහ තවත් සේවාවන්.
            </p>

          </div>
        </div>


        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-400">
            © 2026 EzyTools. All rights reserved. For personal use only.
          </p>

          <p className="text-center text-xs text-gray-400 mt-1">
            පුද්ගලික භාවිතය සඳහා පමණි.
          </p>

        </div>

      </div>
    </footer>
  )
}