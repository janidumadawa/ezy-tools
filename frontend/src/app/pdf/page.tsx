'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Scissors, Layers, Shrink, RotateCw, Trash2, FileType, ImageIcon } from 'lucide-react'

const pdfTools = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one',
    icon: Layers,
    href: '/pdf/merge',
    color: 'blue',
  },
  {
    name: 'Split PDF',
    description: 'Split PDF into separate pages',
    icon: Scissors,
    href: '/pdf/split',
    color: 'green',
  },
  {
    name: 'Compress PDF',
    description: 'Reduce PDF file size',
    icon: Shrink,
    href: '/pdf/compress',
    color: 'orange',
  },
  {
    name: 'Extract Text',
    description: 'Extract text content from PDF',
    icon: FileType,
    href: '/pdf/extract-text',
    color: 'indigo',
  }
]

export default function PDFToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

    {/* Background pdf Logo Watermark */}
            <div className="absolute top-10 right-[-120px] pointer-events-none -z-10">
                <img
                    src="/logos/pdf.png"
                    alt=""
                    className="w-[500px] h-[500px] object-contain opacity-[0.06] blur-sm"
                />
            </div>

            <div className="absolute top-40 left-[10px] pointer-events-none -z-10">
                <img
                    src="/logos/pdf.png"
                    alt=""
                    className="w-[400px] h-[400px] object-contain opacity-[0.3] blur-sm"
                />
            </div>
            
        
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          &larr; Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <img
          src="/logos/pdf.png"
          alt="PDF Logo"
          className="w-24 h-24 object-contain mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          PDF Tools
        </h1>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {pdfTools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className={`group bg-white rounded-xl border border-gray-200 p-6 hover:border-${tool.color}-300 hover:shadow-md hover:shadow-${tool.color}-100 transition-all duration-300`}
          >
            <div className={`w-12 h-12 bg-${tool.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${tool.color}-100 transition-colors`}>
              <tool.icon className={`w-6 h-6 text-${tool.color}-600`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
            <p className="text-sm text-gray-500">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}