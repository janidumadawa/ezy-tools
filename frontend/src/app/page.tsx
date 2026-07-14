import Link from 'next/link'
import Image from 'next/image'
import { Wrench, FileText, ImageIcon, RefreshCw, LucideIcon } from 'lucide-react'

// Define proper types
type Tool = {
  name: string
  sinhala: string
  description: string
  sinhalaDescription: string
  href: string
  icon: string | null
  IconComponent?: LucideIcon
  color: string
  borderColor: string
  shadowColor: string
  bgColor: string
  hoverBg: string
  textColor: string
  features: string[] | string
}

type Category = {
  name: string
  sinhala: string
  icon: string | LucideIcon
  tools: Tool[]
}

const categories: Category[] = [
  {
    name: 'Social Media',
    sinhala: '',
    icon: '/logos/social-media.jpg',
    tools: [
      {
        name: 'YouTube Downloader',
        sinhala: 'YouTube වීඩියෝ download කිරීම',
        description: 'Download YouTube videos in HD quality or extract MP3 audio',
        sinhalaDescription: 'YouTube වීඩියෝ පහසුවෙන් download කරගන්න හෝ MP3 Audio ලබාගන්න.',
        href: '/youtube',
        icon: '/logos/youtube.png',
        color: 'red',
        borderColor: 'hover:border-red-300',
        shadowColor: 'hover:shadow-red-100',
        bgColor: 'bg-red-50',
        hoverBg: 'group-hover:bg-red-100',
        textColor: 'text-red-600',
        features: ['4K Quality', 'MP3 Audio', 'Fast Download'],
      },
      {
        name: 'Facebook Downloader',
        sinhala: 'Facebook Video download කිරීමට',
        description: 'Download Facebook Reels, Videos in high quality',
        sinhalaDescription: 'Facebook Reels සහ Videos පහසුවෙන් download කරගන්න.',
        href: '/facebook',
        icon: '/logos/facebook.png',
        color: 'blue',
        borderColor: 'hover:border-blue-300',
        shadowColor: 'hover:shadow-blue-100',
        bgColor: 'bg-blue-50',
        hoverBg: 'group-hover:bg-blue-100',
        textColor: 'text-blue-600',
        features: ['HD Quality', 'MP3 Audio', 'Fast Download'],
      },
      {
        name: 'TikTok Downloader',
        sinhala: 'TikTok වීඩියෝ download කිරීමට',
        description: 'Download TikTok videos without watermark',
        sinhalaDescription: 'TikTok වීඩියෝ watermark නැතුව download කරගන්න.',
        href: '/tiktok',
        icon: '/logos/tik-tok.png',
        color: 'cyan',
        borderColor: 'hover:border-cyan-400',
        shadowColor: 'hover:shadow-cyan-100',
        bgColor: 'bg-cyan-50',
        hoverBg: 'group-hover:bg-cyan-100',
        textColor: 'text-cyan-600',
        features: ['No Watermark', 'HD Quality', 'Fast Download'],
      },
      {
        name: 'Instagram Downloader',
        sinhala: 'Instagram videos/photos download කිරීමට',
        description: 'Download Instagram Reels, Photos, and Videos in high quality',
        sinhalaDescription: 'Instagram Reels, Photos සහ Videos පහසුවෙන් download කරගන්න.',
        href: '/instagram',
        icon: '/logos/instagram.png',
        color: 'pink',
        borderColor: 'hover:border-pink-300',
        shadowColor: 'hover:shadow-pink-100',
        bgColor: 'bg-pink-50',
        hoverBg: 'group-hover:bg-pink-100',
        textColor: 'text-pink-600',
        features: ['HD Quality', 'Photos & Videos', 'Fast Download'],
      },
    ]
  },
  {
    name: 'Document Tools',
    sinhala: '',
    icon: FileText,
    tools: [
      {
        name: 'PDF Tools',
        sinhala: '',
        description: 'Merge, split, compress PDF files',
        sinhalaDescription: 'PDF files merge, split, compress කරන්න.',
        href: '/pdf',
        icon: null,
        IconComponent: FileText,
        color: 'orange',
        borderColor: 'hover:border-orange-300',
        shadowColor: 'hover:shadow-orange-100',
        bgColor: 'bg-orange-50',
        hoverBg: 'group-hover:bg-orange-100',
        textColor: 'text-orange-600',
        features: ['Merge', 'Split', 'Compress'],
      },
      {
        name: 'Image Tools',
        sinhala: 'පින්තූර මෙවලම්',
        description: 'Compress, resize, and convert images',
        sinhalaDescription: 'පින්තූර compress, resize සහ convert කරන්න.',
        href: '#',
        icon: null,
        IconComponent: ImageIcon,
        color: 'green',
        borderColor: 'hover:border-green-300',
        shadowColor: 'hover:shadow-green-100',
        bgColor: 'bg-green-50',
        hoverBg: 'group-hover:bg-green-100',
        textColor: 'text-green-600',
        features: ['Coming Soon'],
      },
      {
        name: 'File Converter',
        sinhala: 'File Converter',
        description: 'Convert between different file formats',
        sinhalaDescription: 'විවිධ file formats අතර convert කරන්න.',
        href: '#',
        icon: null,
        IconComponent: RefreshCw,
        color: 'purple',
        borderColor: 'hover:border-purple-300',
        shadowColor: 'hover:shadow-purple-100',
        bgColor: 'bg-purple-50',
        hoverBg: 'group-hover:bg-purple-100',
        textColor: 'text-purple-600',
        features: ['Coming Soon'],
      },
    ]
  },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Hero Section */}
      <div className="text-center mb-10 sm:mb-14 lg:mb-16">
        {/* Logo - responsive sizing */}
        <div className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-[450px] lg:h-[180px] mx-auto mb-6 sm:mb-8">
          <Image
            src="/logo3-nobg.png"
            alt="EzyTools Logo"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 224px, 450px"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
          Everything You Need, One Click Away
        </h1>

        <p className="text-base sm:text-lg text-purple-600 font-medium mb-4 sm:mb-6 px-2">
          අවශ්‍ය සියලුම Online Tools එකම තැනකින්
        </p>
      </div>

      {/* Categories & Tools */}
      {categories.map((category, catIndex) => (
        <div key={catIndex} className="mb-10 sm:mb-14 lg:mb-16">
          {/* Category Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            {typeof category.icon === 'string' ? (
              <Image
                src={category.icon}
                alt={category.name}
                width={24}
                height={24}
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            ) : (
              <category.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
            )}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {category.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                {category.sinhala}
              </p>
            </div>
          </div>

          {/* Tools Grid - responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {category.tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className={`group bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 ${tool.borderColor} hover:shadow-md ${tool.shadowColor} transition-all duration-300 active:scale-[0.98]`}
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {/* Icon Container */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${tool.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${tool.hoverBg} transition-colors`}>
                    {tool.icon ? (
                      <Image
                        src={tool.icon}
                        alt={tool.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 sm:w-6 sm:h-6"
                      />
                    ) : tool.IconComponent ? (
                      <tool.IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${tool.textColor}`} />
                    ) : (
                      <Wrench className={`w-5 h-5 sm:w-6 sm:h-6 ${tool.textColor}`} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5 line-clamp-1">
                      {tool.sinhala}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {tool.description}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                    {tool.sinhalaDescription}
                  </p>
                </div>

                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                  {Array.isArray(tool.features) ? (
                    tool.features.map((feature: string) => (
                      <span
                        key={feature}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] sm:text-xs font-medium border border-gray-100"
                      >
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] sm:text-xs font-medium border border-gray-100">
                      {tool.features}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* More Tools Coming */}
      <div className="text-center py-8 sm:py-10 lg:py-12 border-t border-gray-200">
        <p className="text-sm sm:text-base text-gray-400 mb-2 sm:mb-4">
          More tools coming soon. Stay tuned!
        </p>
        <p className="text-xs sm:text-sm text-gray-300">
          තවත් tools ඉක්මනින්...
        </p>
      </div>
    </div>
  )
}