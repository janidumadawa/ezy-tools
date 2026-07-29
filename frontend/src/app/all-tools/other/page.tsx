'use client'

import Link from 'next/link'
import { ArrowLeft, QrCode, Key, Type, Palette, Ruler, Cake, Percent, Volume2, Braces, Code2, Globe, Barcode } from 'lucide-react'

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
  },
  {
  name: 'Barcode Generator',
  description: 'Generate Code 128, EAN, UPC barcodes',
  href: '/tools/barcode-generator',
  icon: Barcode,
  IconComponent: Barcode,
  color: 'slate',
  borderColor: 'hover:border-slate-300',
  shadowColor: 'hover:shadow-slate-100',
  bgColor: 'bg-slate-100',
  hoverBg: 'group-hover:bg-slate-200',
  textColor: 'text-slate-700',
  features: ['Code 128', 'EAN', 'UPC', 'PNG'],
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
  },
  {
    name: 'Age Calculator',
    description: 'Calculate your exact age and time since birth',
    href: '/tools/age-calculator',
    icon: Cake,
    color: 'pink',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    features: ['Years', 'Months', 'Days', 'Zodiac'],
  },
  {
  name: 'Percentage Calculator',
  description: 'Calculate percentages easily',
  href: '/tools/percentage-calculator',
  icon: Percent,
  IconComponent: Percent,
  color: 'rose',
  borderColor: 'hover:border-rose-300',
  shadowColor: 'hover:shadow-rose-100',
  bgColor: 'bg-rose-50',
  hoverBg: 'group-hover:bg-rose-100',
  textColor: 'text-rose-600',
  features: ['% of', '+%', '-%', 'Find %'],
},
{
  name: 'Text to Speech',
  sinhala: 'Text එක Audio බවට',
  description: 'Convert text into natural sounding audio',
  sinhalaDescription: 'text එකක් audio එකක් බවට convert කරන්න.',
  href: '/tools/text-to-speech',
  icon: Volume2,
  IconComponent: Volume2,
  color: 'emerald',
  borderColor: 'hover:border-emerald-300',
  shadowColor: 'hover:shadow-emerald-100',
  bgColor: 'bg-emerald-50',
  hoverBg: 'group-hover:bg-emerald-100',
  textColor: 'text-emerald-600',
  features: ['11 Languages', 'MP3 Download', 'Sinhala Support'],
},
{
  name: 'Base64 Encoder',
  description: 'Encode or decode text to/from Base64',
  href: '/tools/base64',
  icon: Code2,
  IconComponent: Code2,
  color: 'amber',
  borderColor: 'hover:border-amber-300',
  shadowColor: 'hover:shadow-amber-100',
  bgColor: 'bg-amber-50',
  hoverBg: 'group-hover:bg-amber-100',
  textColor: 'text-amber-600',
  features: ['Encode', 'Decode', 'Copy'],
},
{
  name: 'JSON Formatter',
  description: 'Format, validate, and minify JSON data',
  href: '/tools/json-formatter',
  icon: Braces,
  IconComponent: Braces,
  color: 'orange',
  borderColor: 'hover:border-orange-300',
  shadowColor: 'hover:shadow-orange-100',
  bgColor: 'bg-orange-50',
  hoverBg: 'group-hover:bg-orange-100',
  textColor: 'text-orange-600',
  features: ['Format', 'Minify', 'Validate'],
},
{
  name: 'IP Lookup',
  description: 'Find location and details of any IP address',
  href: '/tools/ip-lookup',
  icon: Globe,
  IconComponent: Globe,
  color: 'sky',
  borderColor: 'hover:border-sky-300',
  shadowColor: 'hover:shadow-sky-100',
  bgColor: 'bg-sky-50',
  hoverBg: 'group-hover:bg-sky-100',
  textColor: 'text-sky-600',
  features: ['City', 'ISP', 'Location', 'Map'],
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