'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Wrench, Home, Info, ChevronDown, LucideIcon, FileText, FileSpreadsheet, ImageIcon, Images } from 'lucide-react'

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
          { name: 'Excel to PDF', href: '/converters/excel-to-pdf', icon: null, iconComponent: FileSpreadsheet, description: '.xlsx → .pdf' } as DropdownItem,
          { name: 'Image to PDF', href: '/converters/image-to-pdf', icon: null, iconComponent: ImageIcon, description: 'Images → .pdf' } as DropdownItem,
          { name: 'Images to PDF', href: '/converters/images-to-pdf', icon: null, iconComponent: Images, description: 'Multiple → .pdf' } as DropdownItem,
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
    setActiveDropdown((current) => (current === name ? null : name))
  }

  const closeAll = useCallback(() => {
    setActiveDropdown(null)
    setMobileMenuOpen(false)
  }, [])

  // Close menus whenever the route changes
  useEffect(() => {
    closeAll()
  }, [pathname, closeAll])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
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

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
              <img src="/logo3-nobg.png" alt="EzyTools" className="h-10 w-auto object-contain" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
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

                {/* Dropdown with gap bridge */}
                {item.dropdown && activeDropdown === item.name && (
                  <div
                    role="menu"
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Invisible bridge to prevent gap */}
                    <div className="absolute -top-2 left-0 right-0 h-2" />

                    <div className="w-[860px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                      <div className="p-5 grid grid-cols-3 gap-6 items-start">
                        {item.dropdown.map((category, catIndex) => (
                          <div key={catIndex}>
                            <div className="flex items-center gap-2 mb-2 px-2">
                              <div className="w-1 h-4 bg-purple-500 rounded-full" aria-hidden="true"></div>
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category.category}</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                              {category.items.map((subItem) => {
                                const isComingSoon = Boolean(subItem.badge)
                                const content = (
                                  <>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive(subItem.href) ? 'bg-purple-100' : 'bg-gray-100'}`}>
                                      {subItem.icon ? (
                                        <img src={subItem.icon} alt="" className="w-5 h-5 object-contain" />
                                      ) : subItem.iconComponent ? (
                                        <subItem.iconComponent className="w-4 h-4 text-gray-500" aria-hidden="true" />
                                      ) : null}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-medium text-gray-900 truncate">{subItem.name}</p>
                                        {subItem.badge && (
                                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[10px] font-medium flex-shrink-0">{subItem.badge}</span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-0.5">{subItem.description}</p>
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

          <div className="flex items-center md:hidden">
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
        <div className="md:hidden border-t border-gray-200 bg-white max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-3">
            {navigation.map((item) => (
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
                                {subItem.icon ? <img src={subItem.icon} alt="" className="w-5 h-5 object-contain" /> : subItem.iconComponent ? <subItem.iconComponent className="w-4 h-4" aria-hidden="true" /> : null}
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
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}