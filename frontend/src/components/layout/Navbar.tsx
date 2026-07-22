'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Wrench, Home, Info, ChevronDown, LucideIcon, FileText, FileSpreadsheet, Presentation, ImageIcon, Images, RefreshCw } from 'lucide-react'

// Add type for dropdown items
type DropdownItem = {
  name: string
  href: string
  icon: string | null
  iconComponent?: LucideIcon
  description: string
}

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
          { name: 'Facebook Downloader', href: '/facebook', icon: '/logos/facebook.png', description: 'Reels & Videos' } as DropdownItem,
          { name: 'TikTok Downloader', href: '/tiktok', icon: '/logos/tik-tok.png', description: 'No watermark videos' } as DropdownItem,
          { name: 'Twitter Downloader', href: '/twitter', icon: '/logos/x.png', description: 'Videos & GIFs' } as DropdownItem,
          { name: 'Pinterest Downloader', href: '/pinterest', icon: '/logos/pinterest.png', description: 'Videos & Images' } as DropdownItem,
          { name: 'Reddit Downloader', href: '/reddit', icon: '/logos/reddit.png', description: 'Videos with audio' } as DropdownItem,
          { name: 'YouTube Downloader', href: '/youtube', icon: '/logos/youtube.png', description: 'Videos & MP3 audio' } as DropdownItem,
          { name: 'Instagram Downloader', href: '/instagram', icon: '/logos/instagram.png', description: 'Reels & Photos' } as DropdownItem,
        ]
      },
      {
        category: 'File Converters',
        items: [
          { name: 'Word to PDF', href: '/converters/word-to-pdf', icon: null, iconComponent: FileText, description: '.docx → .pdf' } as DropdownItem,
          { name: 'PDF to Word', href: '/converters/pdf-to-word', icon: null, iconComponent: FileText, description: '.pdf → .docx' } as DropdownItem,
          { name: 'Excel to PDF', href: '/converters/excel-to-pdf', icon: null, iconComponent: FileSpreadsheet, description: '.xlsx → .pdf' } as DropdownItem,
          { name: 'PPTX to PDF', href: '/converters/pptx-to-pdf', icon: null, iconComponent: Presentation, description: '.pptx → .pdf' } as DropdownItem,
          { name: 'Image to PDF', href: '/converters/image-to-pdf', icon: null, iconComponent: ImageIcon, description: 'Images → .pdf' } as DropdownItem,
          { name: 'CSV to PDF', href: '/converters/csv-to-pdf', icon: null, iconComponent: FileText, description: '.csv → .pdf' } as DropdownItem,
          { name: 'Text to PDF', href: '/converters/text-to-pdf', icon: null, iconComponent: FileText, description: '.txt → .pdf' } as DropdownItem,
        ]
      },
      {
        category: 'PDF Tools',
        items: [
          { name: 'Merge PDF', href: '/pdf/merge', icon: '/logos/pdf.png', description: 'Combine PDFs' } as DropdownItem,
          { name: 'Split PDF', href: '/pdf/split', icon: '/logos/pdf.png', description: 'Extract pages' } as DropdownItem,
          { name: 'Compress PDF', href: '/pdf/compress', icon: '/logos/pdf.png', description: 'Reduce file size' } as DropdownItem,
          { name: 'Extract Text', href: '/pdf/extract-text', icon: '/logos/pdf.png', description: 'Get text from PDF' } as DropdownItem,
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
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {category.category}
                            </h3>
                          </div>

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
                                  {subItem.icon ? (
                                    <img src={subItem.icon} alt="" className="w-5 h-5 object-contain" />
                                  ) : subItem.iconComponent ? (
                                    <subItem.iconComponent className="w-4 h-4 text-gray-500" />
                                  ) : null}
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
                            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                              {subItem.icon ? (
                                <img src={subItem.icon} alt="" className="w-5 h-5 object-contain" />
                              ) : subItem.iconComponent ? (
                                <subItem.iconComponent className="w-4 h-4" />
                              ) : null}
                            </div>
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