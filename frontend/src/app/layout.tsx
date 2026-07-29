import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'EzyTools - Free Online Tools for Everyday Tasks',
    template: '%s | EzyTools',
  },
  description: 'EzyTools offers 30+ free online tools for video downloading, file conversion, PDF editing, image manipulation, and everyday utilities.',
  keywords: [
    'online tools',
    'free tools',
    'youtube downloader',
    'facebook downloader',
    'tiktok downloader',
    'pdf converter',
    'image editor',
    'qr code generator',
    'password generator',
    'audio converter',
    'unit converter',
    'age calculator',
    'meme generator',
    'barcode generator',
    'text to speech',
    'file converter',
    'video downloader',
    'social media downloader',
  ],
  authors: [{ name: 'Janidu Madawa' }],
  creator: 'Janidu Madawa',
  publisher: 'EzyTools',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL('https://ezy-tools.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ezy-tools.vercel.app',
    siteName: 'EzyTools',
    title: 'EzyTools - Free Online Tools for Everyday Tasks',
    description: 'EzyTools offers 30+ free online tools for video downloading, file conversion, PDF editing, image manipulation, and everyday utilities.',
    images: [
      {
        url: '/logo3-nobg.png',
        width: 512,
        height: 512,
        alt: 'EzyTools Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EzyTools - Free Online Tools for Everyday Tasks',
    description: 'EzyTools offers 30+ free online tools for video downloading, file conversion, PDF editing, image manipulation, and everyday utilities.',
    images: ['/logo3-nobg.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo3-nobg.png" />
        <meta name="theme-color" content="#884ab2" />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}