import Image from "next/image";

export default function Header() {
  return (
    <div className="text-center mb-10">

      <div className="flex items-center justify-center gap-3 mb-3">

        <Image
          src="/logos/youtube.png"
          alt="YouTube Logo"
          width={55}
          height={55}
          className="object-contain"
        />
        
        <h1 className="text-5xl font-bold text-gray-900">
          YouTube <span className="text-[#ff0133]">Video</span> Downloader
        </h1>


      </div>


      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        යූටියුබ් වීඩියෝ ඩවුන්ලෝඩ් කරගැනීමට
      </h2>


      <p className="text-lg text-gray-500 max-w-2xl mx-auto">
        Download videos in HD quality or extract MP3 audio.
      </p>


      <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
        ඕනෑම යූටියුබ් වීඩියෝවක්{" "}
        <span className="font-semibold">HD Quality</span> එකෙන් හෝ
        එහි <span className="font-semibold">Audio</span> එක වෙනම
        ඩවුන්ලෝඩ් කරගැනීමට හැක.
      </p>

    </div>
  );
}