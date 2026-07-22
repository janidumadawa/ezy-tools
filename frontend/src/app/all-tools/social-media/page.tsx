'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

const unavailableTools = ['YouTube Downloader', 'Instagram Downloader']

const socialMediaTools = [
  {
    name: 'Facebook Downloader',
    description: 'Download Facebook Reels and Videos in HD quality or extract MP3 audio',
    href: '/facebook',
    icon: '/logos/facebook.png',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    features: ['HD Quality', 'MP3 Audio', 'Reels', 'Videos'],
    status: 'active',
  },
  {
    name: 'TikTok Downloader',
    description: 'Download TikTok videos without watermark in high quality',
    href: '/tiktok',
    icon: '/logos/tik-tok.png',
    color: 'cyan',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
    features: ['No Watermark', 'HD Quality', 'Fast Download'],
    status: 'active',
  },
  {
    name: 'Twitter/X Downloader',
    description: 'Download videos from Twitter/X posts easily',
    href: '/twitter',
    icon: '/logos/x.png',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
    features: ['HD Quality', 'Videos', 'GIFs'],
    status: 'active',
  },
  {
    name: 'Pinterest Downloader',
    description: 'Download Pinterest images, pins and videos in high quality',
    href: '/pinterest',
    icon: '/logos/pinterest-logo.png',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    features: ['Images', 'Videos', 'Pins', 'HD Quality'],
    status: 'active',
  },
  {
    name: 'Reddit Downloader',
    description: 'Download Reddit videos with audio from any subreddit',
    href: '/reddit',
    icon: '/logos/reddit.png',
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    features: ['With Audio', 'HD Quality', 'Any Subreddit'],
    status: 'active',
  },
  {
    name: 'YouTube Downloader',
    description: 'Download YouTube videos in HD quality or extract MP3 audio',
    href: '/youtube',
    icon: '/logos/youtube.png',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    features: ['4K Quality', 'MP3 Audio', 'Fast Download'],
    status: 'unavailable',
  },
  {
    name: 'Instagram Downloader',
    description: 'Download Instagram Reels, Photos, and Videos in high quality',
    href: '/instagram',
    icon: '/logos/instagram.png',
    color: 'pink',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    features: ['HD Quality', 'Photos', 'Reels', 'Videos'],
    status: 'unavailable',
  },
]

export default function AllSocialMediaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back Button */}
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          All Social Media Tools
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Download videos, images, and audio from your favorite social media platforms
        </p>
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-4 mb-6 text-xs sm:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Available Online
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          Under Development
        </span>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialMediaTools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.status === 'unavailable' ? '#' : tool.href}
            onClick={(e) => tool.status === 'unavailable' && e.preventDefault()}
            className={`group relative bg-white rounded-xl border-2 p-5 sm:p-6 transition-all duration-300 ${
              tool.status === 'unavailable'
                ? 'opacity-60 cursor-not-allowed border-gray-200'
                : `${tool.borderColor} hover:shadow-lg hover:-translate-y-0.5`
            }`}
          >
            {/* Status Badge */}
            {tool.status === 'unavailable' && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-[10px] font-medium">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  Coming Soon
                </span>
              </div>
            )}

            {/* Icon */}
            <div className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Image src={tool.icon} alt={tool.name} width={28} height={28} className="w-7 h-7 object-contain" />
            </div>

            {/* Content */}
            <h3 className={`font-bold text-lg mb-2 ${tool.status === 'unavailable' ? 'text-gray-400' : 'text-gray-900'}`}>
              {tool.name}
            </h3>
            <p className={`text-sm mb-4 line-clamp-2 ${tool.status === 'unavailable' ? 'text-gray-400' : 'text-gray-500'}`}>
              {tool.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-1.5">
              {tool.features.map((feature) => (
                <span
                  key={feature}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                    tool.status === 'unavailable'
                      ? 'bg-gray-100 text-gray-400'
                      : `${tool.bgColor} ${tool.textColor}`
                  }`}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Status indicator */}
            <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full ${
              tool.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
            }`}></div>
          </Link>
        ))}
      </div>
    </div>
  )
}