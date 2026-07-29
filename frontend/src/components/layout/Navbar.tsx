'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, Wrench, Home, Info, ChevronDown, LucideIcon, Search,
  FileText, FileSpreadsheet, ImageIcon, Images, FileType, Presentation, Table,
  Wand2, Sticker, Shrink, Expand, RefreshCw, FileAudio,
  Calendar, Barcode, Binary, Palette, Network, Braces, KeyRound, Percent, QrCode, Type, Ruler, AudioLines,
} from 'lucide-react'

type DropdownItem = {
  name: string
  href: string
  icon: string | null
  iconComponent?: LucideIcon
  description: string
  badge?: string
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
          { name: 'TikTok Downloader', href: '/tiktok', icon: '/logos/tik-tok.png', description: 'No watermark' } as DropdownItem,
          { name: 'Twitter/X Downloader', href: '/twitter', icon: '/logos/x.png', description: 'Videos & GIFs' } as DropdownItem,
          { name: 'Pinterest Downloader', href: '/pinterest', icon: '/logos/pinterest.png', description: 'Images & Videos' } as DropdownItem,
          { name: 'Reddit Downloader', href: '/reddit', icon: '/logos/reddit.png', description: 'Videos with audio' } as DropdownItem,
          { name: 'YouTube Downloader', href: '/youtube', icon: '/logos/youtube.png', description: 'Videos & MP3', badge: 'Coming Soon' } as DropdownItem,
          { name: 'Instagram Downloader', href: '/instagram', icon: '/logos/instagram.png', description: 'Reels & Photos', badge: 'Coming Soon' } as DropdownItem,
        ]
      },
      {
        category: 'File Converters',
        items: [
          { name: 'PDF to Word', href: '/converters/pdf-to-word', icon: null, iconComponent: FileText, description: '.pdf → .docx' } as DropdownItem,
          { name: 'Word to PDF', href: '/converters/word-to-pdf', icon: null, iconComponent: FileType, description: '.docx → .pdf' } as DropdownItem,
          { name: 'Excel to PDF', href: '/converters/excel-to-pdf', icon: null, iconComponent: FileSpreadsheet, description: '.xlsx → .pdf' } as DropdownItem,
          { name: 'PPTX to PDF', href: '/converters/pptx-to-pdf', icon: null, iconComponent: Presentation, description: '.pptx → .pdf' } as DropdownItem,
          { name: 'Image to PDF', href: '/converters/image-to-pdf', icon: null, iconComponent: ImageIcon, description: 'Images → .pdf' } as DropdownItem,
          { name: 'Images to PDF', href: '/converters/images-to-pdf', icon: null, iconComponent: Images, description: 'Multiple → .pdf' } as DropdownItem,
          { name: 'CSV to PDF', href: '/converters/csv-to-pdf', icon: null, iconComponent: Table, description: '.csv → .pdf' } as DropdownItem,
          { name: 'Text to PDF', href: '/converters/text-to-pdf', icon: null, iconComponent: FileText, description: '.txt → .pdf' } as DropdownItem,
        ]
      },
      {
        category: 'Utility Tools',
        items: [
          { name: 'Age Calculator', href: '/tools/age-calculator', icon: null, iconComponent: Calendar, description: 'Find exact age' } as DropdownItem,
          { name: 'Barcode Generator', href: '/tools/barcode-generator', icon: null, iconComponent: Barcode, description: 'Create barcodes' } as DropdownItem,
          { name: 'Base64 Encoder/Decoder', href: '/tools/base64', icon: null, iconComponent: Binary, description: 'Encode & decode text' } as DropdownItem,
          { name: 'Color Tools', href: '/tools/color-tools', icon: null, iconComponent: Palette, description: 'Pick & convert colors' } as DropdownItem,
          { name: 'IP Lookup', href: '/tools/ip-lookup', icon: null, iconComponent: Network, description: 'Check IP details' } as DropdownItem,
          { name: 'JSON Formatter', href: '/tools/json-formatter', icon: null, iconComponent: Braces, description: 'Format & validate' } as DropdownItem,
          { name: 'Password Generator', href: '/tools/password-generator', icon: null, iconComponent: KeyRound, description: 'Strong passwords' } as DropdownItem,
          { name: 'Percentage Calculator', href: '/tools/percentage-calculator', icon: null, iconComponent: Percent, description: 'Quick percentages' } as DropdownItem,
          { name: 'QR Code Generator', href: '/tools/qr-generator', icon: null, iconComponent: QrCode, description: 'Create QR codes' } as DropdownItem,
          { name: 'Text to Speech', href: '/tools/text-to-speech', icon: null, iconComponent: AudioLines, description: 'Convert text to voice' } as DropdownItem,
          { name: 'Text Tools', href: '/tools/text-tools', icon: null, iconComponent: Type, description: 'Case, count & more' } as DropdownItem,
          { name: 'Unit Converter', href: '/tools/unit-converter', icon: null, iconComponent: Ruler, description: 'Convert any unit' } as DropdownItem,
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
      {
        category: 'Image Tools',
        items: [
          { name: 'Image Editor', href: '/image-tools/image-editor', icon: null, iconComponent: Wand2, description: 'Edit images online' } as DropdownItem,
          { name: 'Meme Generator', href: '/image-tools/meme-generator', icon: null, iconComponent: Sticker, description: 'Create memes fast' } as DropdownItem,
          { name: 'Image Compressor', href: '/converters/image-compressor', icon: null, iconComponent: Shrink, description: 'Shrink file size' } as DropdownItem,
          { name: 'Image Converter', href: '/converters/image-converter', icon: null, iconComponent: RefreshCw, description: 'Change image format' } as DropdownItem,
          { name: 'Image Resizer', href: '/converters/image-resizer', icon: null, iconComponent: Expand, description: 'Resize dimensions' } as DropdownItem,
        ]
      },
      {
        category: 'Audio Tools',
        items: [
          { name: 'Audio Converter', href: '/audio-tools/audio-converter', icon: null, iconComponent: FileAudio, description: 'Convert audio formats' } as DropdownItem,
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

// Flattened, searchable index of every tool across all categories — single source of truth
type SearchableTool = DropdownItem & { category: string }

const searchableTools: SearchableTool[] = navigation.flatMap((item) =>
  'dropdown' in item && item.dropdown
    ? item.dropdown.flatMap((cat) => cat.items.map((tool) => ({ ...tool, category: cat.category })))
    : []
)

function ToolIcon({ tool, className }: { tool: DropdownItem; className: string }) {
  if (tool.icon) return <img src={tool.icon} alt="" className={className} />
  if (tool.iconComponent) {
    const Icon = tool.iconComponent
    return <Icon className={className} aria-hidden="true" />
  }
  return null
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  const clearCloseTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleMouseEnter = (name: string) => {
    clearCloseTimeout()
    setSearchOpen(false)
    setActiveDropdown(name)
  }

  const handleMouseLeave = () => {
    clearCloseTimeout()
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  const toggleDropdown = (name: string) => {
    clearCloseTimeout()
    setSearchOpen(false)
    setActiveDropdown((current) => (current === name ? null : name))
  }

  const closeAll = useCallback(() => {
    setActiveDropdown(null)
    setMobileMenuOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }, [])

  // Close everything whenever the route changes
  useEffect(() => {
    closeAll()
  }, [pathname, closeAll])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAll()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeAll])

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    return () => clearCloseTimeout()
  }, [])

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return searchableTools
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [searchQuery])

  const renderSearchResult = (tool: SearchableTool, onNavigate: () => void) => {
    const isComingSoon = Boolean(tool.badge)

    if (isComingSoon) {
      return (
        <div
          key={tool.href}
          aria-disabled="true"
          className="flex items-center gap-3 px-4 py-2.5 opacity-50 cursor-not-allowed select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <ToolIcon tool={tool} className="w-5 h-5 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-gray-900 truncate">{tool.name}</p>
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[10px] font-medium flex-shrink-0">{tool.badge}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{tool.category} · {tool.description}</p>
          </div>
        </div>
      )
    }

    return (
      <Link
        key={tool.href}
        href={tool.href}
        role="option"
        onClick={onNavigate}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <ToolIcon tool={tool} className="w-5 h-5 object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">{tool.name}</p>
          <p className="text-xs text-gray-500 truncate">{tool.category} · {tool.description}</p>
        </div>
      </Link>
    )
  }

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
              <img src="/logo3-nobg.png" alt="EzyTools" className="h-10 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop search — centered between logo and nav links */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchOpen(true)
                }}
                onFocus={() => {
                  setSearchOpen(true)
                  setActiveDropdown(null)
                }}
                placeholder="Search tools..."
                aria-label="Search tools"
                role="combobox"
                aria-expanded={searchOpen && Boolean(searchQuery.trim())}
                aria-controls="navbar-search-results"
                className="w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchOpen && searchQuery.trim() && (
              <div
                id="navbar-search-results"
                role="listbox"
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[26rem] overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((tool) =>
                    renderSearchResult(tool, () => {
                      setSearchQuery('')
                      setSearchOpen(false)
                    })
                  )
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No tools found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                onMouseLeave={() => item.dropdown && handleMouseLeave()}
              >
                {item.dropdown ? (
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.name}
                    onClick={() => toggleDropdown(item.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                      activeDropdown === item.name
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.name}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                      isActive(item.href)
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.name}
                  </Link>
                )}

                {/* Mega-menu dropdown with gap bridge */}
                {item.dropdown && activeDropdown === item.name && (
                  <div
                    role="menu"
                    className="absolute top-full right-0 pt-2 z-50"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Invisible bridge to prevent gap */}
                    <div className="absolute -top-2 left-0 right-0 h-2" />

                    <div className="w-[980px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                      <div className="p-5 grid grid-cols-3 gap-6 items-start">
                        {item.dropdown.map((category, catIndex) => (
                          <div key={catIndex}>
                            <div className="flex items-center gap-2 mb-2 px-2">
                              <div className="w-1 h-4 bg-purple-500 rounded-full" aria-hidden="true"></div>
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category.category}</h3>
                            </div>
                            <div className={`grid gap-1 ${category.items.length > 8 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                              {category.items.map((subItem) => {
                                const isComingSoon = Boolean(subItem.badge)
                                const content = (
                                  <>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive(subItem.href) ? 'bg-purple-100' : 'bg-gray-100'}`}>
                                      <ToolIcon tool={subItem} className="w-5 h-5 object-contain" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-medium text-gray-900 truncate">{subItem.name}</p>
                                        {subItem.badge && (
                                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[10px] font-medium flex-shrink-0">{subItem.badge}</span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-0.5 truncate">{subItem.description}</p>
                                    </div>
                                  </>
                                )

                                if (isComingSoon) {
                                  return (
                                    <div
                                      key={subItem.name}
                                      aria-disabled="true"
                                      className="flex items-start gap-3 p-2.5 rounded-lg opacity-50 cursor-not-allowed select-none"
                                    >
                                      {content}
                                    </div>
                                  )
                                }

                                return (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    role="menuitem"
                                    className={`flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset ${
                                      isActive(subItem.href) ? 'bg-purple-50' : ''
                                    }`}
                                  >
                                    {content}
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                aria-label="Search tools"
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery.trim() ? (
              <div className="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {searchResults.length > 0 ? (
                  searchResults.map((tool) =>
                    renderSearchResult(tool, () => {
                      setSearchQuery('')
                      setMobileMenuOpen(false)
                    })
                  )
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No tools found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            ) : (
              navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">{item.name}</div>
                      {item.dropdown.map((category, catIndex) => (
                        <div key={catIndex} className="mb-2">
                          <p className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">{category.category}</p>
                          {category.items.map((subItem) => {
                            const isComingSoon = Boolean(subItem.badge)
                            const content = (
                              <>
                                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                  <ToolIcon tool={subItem} className="w-5 h-5 object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-medium truncate">{subItem.name}</p>
                                    {subItem.badge && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[10px] font-medium">{subItem.badge}</span>}
                                  </div>
                                  <p className="text-xs text-gray-400">{subItem.description}</p>
                                </div>
                              </>
                            )

                            if (isComingSoon) {
                              return (
                                <div key={subItem.name} aria-disabled="true" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 opacity-50 cursor-not-allowed select-none">
                                  {content}
                                </div>
                              )
                            }

                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive(subItem.href) ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {content}
                              </Link>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive(item.href) ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </nav>
  )
}