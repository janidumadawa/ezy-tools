'use client'

import Link from 'next/link'
import { ArrowLeft, QrCode, Key, Type, Palette, Ruler } from 'lucide-react'

const otherTools = [
  {
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs with custom colors and logo',
    href: '/tools/qr-generator',
    icon: QrCode,
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
    features: ['Custom Colors', 'Logo Upload', 'PNG Download'],
    status: 'active',
  },
  {
    name: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable length and characters',
    href: '/tools/password-generator',
    icon: Key,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    features: ['6-50 Characters', 'A-Z, a-z, 0-9', 'Symbols'],
    status: 'active',
  },
  {
    name: 'Text Tools',
    description: 'Count words, change case, reverse text, and clean up formatting',
    href: '/tools/text-tools',
    icon: Type,
    color: 'teal',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    features: ['Word Count', 'Case Convert', 'Clean Text'],
    status: 'active',
  },
  {
    name: 'Color Tools',
    description: 'Pick colors, convert between HEX, RGB, HSL, and generate palettes',
    href: '/tools/color-tools',
    icon: Palette,
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    features: ['HEX', 'RGB', 'HSL', 'Palette'],
    status: 'active',
  },
  {
    name: 'Unit Converter',
    description: 'Convert between length, weight, temperature, and area units',
    href: '/tools/unit-converter',
    icon: Ruler,
    color: 'cyan',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
    features: ['Length', 'Weight', 'Temp', 'Area'],
    status: 'active',
  },
]

export default function AllOtherToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Other Tools</h1>
        <p className="text-gray-500 text-sm sm:text-base">Useful utilities for everyday tasks</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherTools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className={`group relative bg-white rounded-xl border-2 p-5 sm:p-6 transition-all duration-300 ${tool.borderColor} hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon className={`w-7 h-7 ${tool.textColor}`} />
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2">{tool.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{tool.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {tool.features.map((feature) => (
                <span key={feature} className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${tool.bgColor} ${tool.textColor}`}>
                  {feature}
                </span>
              ))}
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={`text-sm font-medium ${tool.textColor}`}>Open →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}