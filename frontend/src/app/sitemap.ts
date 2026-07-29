import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ezy-tools.vercel.app'
  
  const tools = [
    // Social Media
    { url: '/facebook', priority: 0.9 },
    { url: '/tiktok', priority: 0.9 },
    { url: '/twitter', priority: 0.8 },
    { url: '/pinterest', priority: 0.8 },
    { url: '/reddit', priority: 0.8 },
    { url: '/youtube', priority: 0.7 },
    { url: '/instagram', priority: 0.7 },
    
    // File Converters
    { url: '/converters/pdf-to-word', priority: 0.9 },
    { url: '/converters/excel-to-pdf', priority: 0.8 },
    { url: '/converters/image-to-pdf', priority: 0.8 },
    { url: '/converters/images-to-pdf', priority: 0.8 },
    { url: '/converters/csv-to-pdf', priority: 0.7 },
    { url: '/converters/text-to-pdf', priority: 0.7 },
    { url: '/converters/word-to-pdf', priority: 0.6 },
    { url: '/converters/pptx-to-pdf', priority: 0.6 },
    
    // PDF Tools
    { url: '/pdf', priority: 0.9 },
    { url: '/pdf/merge', priority: 0.9 },
    { url: '/pdf/split', priority: 0.9 },
    { url: '/pdf/compress', priority: 0.8 },
    { url: '/pdf/extract-text', priority: 0.8 },
    
    // Image Tools
    { url: '/image-tools/image-editor', priority: 0.8 },
    { url: '/image-tools/meme-generator', priority: 0.8 },
    
    // Audio Tools
    { url: '/audio-tools/audio-converter', priority: 0.8 },
    
    // Other Tools
    { url: '/tools/qr-generator', priority: 0.9 },
    { url: '/tools/password-generator', priority: 0.8 },
    { url: '/tools/text-tools', priority: 0.7 },
    { url: '/tools/color-tools', priority: 0.7 },
    { url: '/tools/unit-converter', priority: 0.8 },
    { url: '/tools/age-calculator', priority: 0.8 },
    { url: '/tools/percentage-calculator', priority: 0.7 },
    { url: '/tools/text-to-speech', priority: 0.8 },
    { url: '/tools/base64', priority: 0.6 },
    { url: '/tools/json-formatter', priority: 0.6 },
    { url: '/tools/ip-lookup', priority: 0.6 },
    { url: '/tools/barcode-generator', priority: 0.7 },
    
    // Pages
    { url: '/about', priority: 0.5 },
    { url: '/all-tools/social-media', priority: 0.8 },
    { url: '/all-tools/converters', priority: 0.8 },
    { url: '/all-tools/other', priority: 0.8 },
  ]

  return tools.map((tool) => ({
    url: `${baseUrl}${tool.url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: tool.priority,
  }))
}