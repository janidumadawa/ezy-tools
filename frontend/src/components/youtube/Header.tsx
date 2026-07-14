import Image from "next/image";

export default function Header() {
  return (
    <div className="text-center mb-6 sm:mb-8 lg:mb-10">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <Image
          src="/logos/youtube.png"
          alt="YouTube Logo"
          width={40}
          height={40}
          className="w-10 h-10 sm:w-[55px] sm:h-[55px] object-contain"
        />
        
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
          YouTube{" "}
          <span className="text-[#ff0133]">Video</span>{" "}
          <span className="block sm:inline">Downloader</span>
        </h1>
      </div>

      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4 lg:mb-6 px-2">
        යූටියුබ් වීඩියෝ ඩවුන්ලෝඩ් කරගැනීමට
      </h2>

      <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-2xl mx-auto px-2">
        Download videos in HD quality or extract MP3 audio.
      </p>

      <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto mt-2 sm:mt-3 leading-relaxed px-2">
        ඕනෑම යූටියුබ් වීඩියෝවක්{" "}
        <span className="font-semibold">HD Quality</span> එකෙන් හෝ
        එහි <span className="font-semibold">Audio</span> එක වෙනම
        ඩවුන්ලෝඩ් කරගැනීමට හැක.
      </p>
    </div>
  );
}