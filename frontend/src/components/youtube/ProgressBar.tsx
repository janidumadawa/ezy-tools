import { DownloadState } from "@/src/types";

interface ProgressBarProps {
  downloadState: DownloadState;
}

export default function ProgressBar({
  downloadState,
}: ProgressBarProps) {
  const { status, message, progress } = downloadState;

  if (status === "idle" || status === "ready") return null;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Loading Text */}
      <div className="text-sm font-semibold text-[#ff0133]">
        {status === "analyzing" && (
          <span>
            Analyzing<span className="animate-pulse">.</span>
            <span
              className="animate-pulse"
              style={{ animationDelay: "0.3s" }}
            >
              .
            </span>
            <span
              className="animate-pulse"
              style={{ animationDelay: "0.6s" }}
            >
              .
            </span>
          </span>
        )}

        {status === "downloading" && (
          <span>
            Downloading<span className="animate-pulse">.</span>
            <span
              className="animate-pulse"
              style={{ animationDelay: "0.3s" }}
            >
              .
            </span>
            <span
              className="animate-pulse"
              style={{ animationDelay: "0.6s" }}
            >
              .
            </span>
          </span>
        )}

        {status === "completed" && (
          <span className="text-green-600">Complete!</span>
        )}

        {status === "error" && (
          <span className="text-red-600">Error</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-red-100 rounded-full h-8 p-1 shadow-inner border border-red-200">
        <div
          className="relative h-full rounded-full overflow-hidden transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background:
              status === "error"
                ? "#dc2626"
                : "linear-gradient(90deg, #ff0133 0%, #ff3b5f 50%, #ff6b81 100%)",
          }}
        >
          {/* Animated shine */}
          <div className="absolute inset-0 flex items-center gap-4 opacity-25">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-10 bg-white rotate-12"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <p className="text-xs text-gray-500">{message}</p>
    </div>
  );
}