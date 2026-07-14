'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Play, Wrench, Home, Info, ChevronDown, Camera, FileText, Download, Music2 } from 'lucide-react'

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Tools',
    href: '#',
    icon: Wrench,
    dropdown: [
      {
        category: 'Social Media Downloaders',
        items: [
          { name: 'YouTube Downloader', href: '/youtube', icon: Play, description: 'Videos & MP3 audio' },
          { name: 'Facebook Downloader', href: '/facebook', icon: Download, description: 'Reels & Videos' },
          { name: 'TikTok Downloader', href: '/tiktok', icon: Music2, description: 'No watermark videos' },
          { name: 'Instagram Downloader', href: '/instagram', icon: Camera, description: 'Reels & Photos' },
        ]
      },
      {
        category: 'PDF Tools',
        items: [
          { name: 'Merge PDF', href: '/pdf/merge', icon: FileText, description: 'Combine PDFs' },
          { name: 'Split PDF', href: '/pdf/split', icon: FileText, description: 'Extract pages' },
          { name: 'Compress PDF', href: '/pdf/compress', icon: FileText, description: 'Reduce file size' },
          { name: 'Extract Text', href: '/pdf/extract-text', icon: FileText, description: 'Get text from PDF' },
        ]
      },
      {
        category: 'Coming Soon',
        items: [
          { name: 'Image Tools', href: '#', icon: Wrench, description: 'Convert & compress images' },
          { name: 'File Converters', href: '#', icon: Wrench, description: 'Format conversion' },
        ]
      },
    ]
  },
  {
    name: 'About',
    href: '/about',
    icon: Info,
  },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo3-nobg.png"
                alt="EzyTools Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                      activeDropdown === item.name
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                      isActive(item.href)
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )}

                {/* Mega Dropdown */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 grid grid-cols-2 gap-4">
                      {item.dropdown.map((category, catIndex) => (
                        <div key={catIndex} className={catIndex === item.dropdown.length - 1 ? 'col-span-2' : ''}>
                          {/* Category Title */}
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {category.category}
                            </h3>
                          </div>
                          
                          {/* Category Items */}
                          <div className={`grid gap-1 ${catIndex === item.dropdown.length - 1 ? 'grid-cols-2' : ''}`}>
                            {category.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors ${
                                  isActive(subItem.href) ? 'bg-purple-50' : ''
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  isActive(subItem.href) ? 'bg-purple-100' : 'bg-gray-100'
                                }`}>
                                  <subItem.icon className={`w-4 h-4 ${
                                    isActive(subItem.href) ? 'text-purple-600' : 'text-gray-500'
                                  }`} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{subItem.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{subItem.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
                      <Link
                        href="/tools"
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-1"
                      >
                        View All Tools →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-3">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div>
                    <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {item.name}
                    </div>
                    {item.dropdown.map((category, catIndex) => (
                      <div key={catIndex} className="mb-2">
                        <p className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">
                          {category.category}
                        </p>
                        {category.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                              isActive(subItem.href)
                                ? 'bg-purple-50 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <subItem.icon className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{subItem.name}</p>
                              <p className="text-xs text-gray-400">{subItem.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                      isActive(item.href)
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}