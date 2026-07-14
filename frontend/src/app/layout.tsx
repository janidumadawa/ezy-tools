import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import './globals.css'
import InfoNotice from '@/src/components/layout/InfoNotice'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EzyTools - Free Online Tools',
  description: 'Free online tools including YouTube downloader, file converters, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Navbar />
        <InfoNotice />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}