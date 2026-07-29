'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Globe, Search, Loader2, MapPin, Monitor, Wifi, Shield } from 'lucide-react'

export default function IPLookupPage() {
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const lookupIP = async (customIP?: string) => {
    setLoading(true); setError(''); setResult(null)
    try {
      const queryIP = customIP || ip || ''
      const url = queryIP 
        ? `https://ipapi.co/${queryIP}/json/`
        : 'https://ipapi.co/json/'
      
      const response = await axios.get(url)
      if (response.data.error) {
        setError('Invalid IP address or lookup failed')
      } else {
        setResult(response.data)
      }
    } catch (err: any) {
      setError('Failed to lookup IP')
    } finally { setLoading(false) }
  }

  const getMyIP = () => {
    lookupIP()
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">&larr; Back to Home</Link>
      
      <div className="text-center mb-8">
        <Globe className="w-12 h-12 text-sky-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">IP Lookup</h1>
        <p className="text-gray-500">Find location and details of any IP address</p>
      </div>

      <div className="space-y-4">
        {/* Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && lookupIP(ip)}
            />
            <button
              onClick={() => lookupIP(ip)}
              disabled={loading || !ip}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={getMyIP}
            disabled={loading}
            className="w-full mt-3 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Monitor className="w-4 h-4" />
            Lookup My IP
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />
            <span className="text-sm text-gray-500">Looking up...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
        )}

        {result && (
          <div className="space-y-3">
            {/* IP Display */}
            <div className="bg-white rounded-xl border border-sky-200 p-5 text-center">
              <p className="text-xs text-gray-400 mb-1">IP Address</p>
              <p className="text-2xl font-bold text-sky-600 font-mono">{result.ip}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MapPin, label: 'City', value: result.city },
                { icon: MapPin, label: 'Region', value: result.region },
                { icon: Globe, label: 'Country', value: result.country_name },
                { icon: MapPin, label: 'Postal Code', value: result.postal },
                { icon: Wifi, label: 'ISP', value: result.org },
                { icon: Shield, label: 'Timezone', value: result.timezone },
              ].filter(item => item.value).map((item) => (
                <div key={item.label} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] text-gray-400 uppercase">{item.label}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 truncate">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Location Info */}
            {result.latitude && result.longitude && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 mb-2">Location</p>
                <p className="text-sm text-gray-600 font-mono">
                  {result.latitude}, {result.longitude}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 mt-2"
                >
                  <MapPin className="w-3 h-3" /> View on Google Maps
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}