'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, FileSpreadsheet, Presentation, ImageIcon, Images, AlertTriangle } from 'lucide-react'

const converterTools = [
  {
    name: 'Word to PDF',
    description: 'Convert Word documents (.docx) to PDF format instantly',
    href: '/converters/word-to-pdf',
    icon: FileText,
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    tag: '.docx → .pdf',
    status: 'local',
  },
  {
    name: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents',
    href: '/converters/pdf-to-word',
    icon: FileText,
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    tag: '.pdf → .docx',
    status: 'active',
  },
  {
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF format',
    href: '/converters/excel-to-pdf',
    icon: FileSpreadsheet,
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    tag: '.xlsx → .pdf',
    status: 'active',
  },
  {
    name: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentations to PDF',
    href: '/converters/pptx-to-pdf',
    icon: Presentation,
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    tag: '.pptx → .pdf',
    status: 'local',
  },
  {
    name: 'Image to PDF',
    description: 'Convert any image (PNG, JPG, WebP) to PDF',
    href: '/converters/image-to-pdf',
    icon: ImageIcon,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    tag: '.png → .pdf',
    status: 'active',
  },
  {
    name: 'Images to PDF',
    description: 'Combine multiple images into a single PDF file',
    href: '/converters/images-to-pdf',
    icon: Images,
    color: 'violet',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    borderColor: 'border-violet-200',
    tag: 'Multiple → .pdf',
    status: 'active',
  },
  {
    name: 'CSV to PDF',
    description: 'Convert CSV data files to formatted PDF tables',
    href: '/converters/csv-to-pdf',
    icon: FileText,
    color: 'teal',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    tag: '.csv → .pdf',
    status: 'active',
  },
  {
    name: 'Text to PDF',
    description: 'Convert plain text files to PDF format',
    href: '/converters/text-to-pdf',
    icon: FileText,
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    tag: '.txt → .pdf',
    status: 'active',
  },
]

export default function AllConvertersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All File Converters</h1>
        <p className="text-gray-500 text-sm sm:text-base">Convert documents, images, and files between formats instantly</p>
        
        {/* Status Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Under Development</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {converterTools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.status === 'local' ? '#' : tool.href}
            onClick={(e) => tool.status === 'local' && e.preventDefault()}
            className={`group relative bg-white rounded-xl border-2 p-5 sm:p-6 transition-all duration-300 ${
              tool.status === 'local' 
                ? 'opacity-60 cursor-not-allowed border-gray-200' 
                : `${tool.borderColor} hover:shadow-lg hover:-translate-y-0.5`
            }`}
          >
            {/* Status Badge */}
            {tool.status === 'local' && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-[10px] font-medium">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  Coming Soon
                </span>
              </div>
            )}

            {/* Format Tag */}
            {tool.status === 'active' && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-medium">{tool.tag}</span>
              </div>
            )}

            <div className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center mb-4 ${tool.status === 'active' ? 'group-hover:scale-110' : ''} transition-transform`}>
              <tool.icon className={`w-7 h-7 ${tool.textColor}`} />
            </div>

            <h3 className={`font-bold text-lg mb-2 ${tool.status === 'local' ? 'text-gray-400' : 'text-gray-900'}`}>
              {tool.name}
            </h3>
            <p className={`text-sm line-clamp-2 ${tool.status === 'local' ? 'text-gray-400' : 'text-gray-500'}`}>
              {tool.description}
            </p>

            {tool.status === 'active' && (
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`text-sm font-medium ${tool.textColor}`}>Convert →</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}