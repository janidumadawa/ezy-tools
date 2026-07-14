import Image from 'next/image'
import { Globe, Mail, Code, Heart, ExternalLink, User } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      {/* Logo */}
      <div className="text-center mb-10">
        <Image
          src="/logo3-nobg.png"
          alt="EzyTools Logo"
          width={180}
          height={180}
          className="mx-auto mb-6"
          priority
        />
      </div>

      {/* English Section */}
      <section className="mb-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          About EzyTools
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6 text-center">
          EzyTools is a growing online platform that provides simple, fast,
          and free digital tools to make everyday tasks easier.
          Our goal is to bring useful tools together in one place without
          unnecessary complexity.
        </p>

        <p className="text-gray-600 leading-relaxed mb-8 text-center">
          From file conversions and media tools to productivity solutions,
          EzyTools is continuously expanding with more useful features
          including image tools, PDF tools, document converters, text tools,
          calculators, and many more.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Why Choose EzyTools?
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <strong className="text-red-600">No Registration Required</strong>
              <br />
              Use our tools instantly without creating an account.
            </li>
            <li>
              <strong className="text-red-600">Privacy Focused</strong>
              <br />
              Your privacy matters. We do not store your uploaded files or
              personal data unnecessarily.
            </li>
            <li>
              <strong className="text-red-600">Free and Easy to Use</strong>
              <br />
              Access useful online tools with a simple and user-friendly
              experience.
            </li>
          </ul>
        </div>
      </section>

      {/* Sinhala Section */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          EzyTools ගැන
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6 text-center">
          EzyTools යනු දෛනික අවශ්‍යතා සඳහා සරල, වේගවත් සහ නොමිලේ
          Digital Tools ලබාදෙන වර්ධනය වෙමින් පවතින Online Platform එකකි.
          සංකීර්ණ ක්‍රියාවලියකින් තොරව අවශ්‍ය මෙවලම් එකම ස්ථානයකින්
          ලබාදීම අපගේ අරමුණයි.
        </p>

        <p className="text-gray-600 leading-relaxed mb-8 text-center">
          File conversion, Media tools, Image tools, PDF tools,
          Document converters, Text tools, Calculators සහ තවත් බොහෝ
          ප්‍රයෝජනවත් Tools සමඟ EzyTools අඛණ්ඩව පුළුල් වෙමින් පවතී.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            EzyTools තෝරාගන්නේ ඇයි?
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <strong className="text-red-600">ලියාපදිංචිය අවශ්‍ය නොවේ</strong>
              <br />
              Account එකක් සාදා ගැනීමකින් තොරව Tools භාවිතා කළ හැක.
            </li>
            <li>
              <strong className="text-red-600">ඔබගේ පෞද්ගලිකත්වයට ප්‍රමුඛතාවය</strong>
              <br />
              ඔබ Upload කරන Files හෝ අවශ්‍ය නොවන පුද්ගලික තොරතුරු
              අපි ගබඩා නොකරමු.
            </li>
            <li>
              <strong className="text-red-600">නොමිලේ සහ පහසු භාවිතය</strong>
              <br />
              ඕනෑම කෙනෙකුට පහසුවෙන් භාවිතා කළ හැකි සරල Online Tools.
            </li>
          </ul>
        </div>
      </section>

      
      {/* Developer Section */}
      <section className="mb-14 mt-16">
          <div className="text-center mb-6">

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Meet the Developer
            </h2>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              {/* Developer Info */}
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                  <img src="./janidu.png" alt="" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Janidu Madawa</h3>
                <p className="text-gray-500 text-sm">Full Stack Developer</p>
                <a
                  href="https://imjanidu.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 justify-center mt-1"
                >
                  Visit Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-sm text-gray-600 text-center mb-6">
                Passionate about building tools that make people&apos;s lives easier.
                EzyTools is a personal project built to provide free, simple,
                and accessible online tools for everyone.
              </p>

            </div>

          </div>
      </section>
    </div>
  )
}