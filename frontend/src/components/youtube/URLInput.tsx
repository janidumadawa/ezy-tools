import { Loader2, Link } from "lucide-react";
import { DownloadState } from "@/src/types";

interface URLInputProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  downloadState: DownloadState;
}

export default function URLInput({
  url,
  setUrl,
  onSubmit,
  downloadState,
}: URLInputProps) {
  return (
    <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
      <div className="mb-2 sm:mb-3 px-1">
        <p className="text-xs sm:text-sm font-medium text-gray-700">
          Paste your YouTube video link below
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500">
          යූටියුබ් ලින්ක් එක මෙතනට Paste කරන්න
        </p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#ff0133] transition-all duration-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 sm:p-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Link className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff0133]" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 py-1"
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={downloadState.status === "analyzing"}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#ff0133] hover:bg-[#e0002a] disabled:bg-gray-300 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-95"
          >
            {downloadState.status === "analyzing" ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                <span className="whitespace-nowrap">Analyzing</span>
              </>
            ) : (
              <span className="whitespace-nowrap">Download</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}