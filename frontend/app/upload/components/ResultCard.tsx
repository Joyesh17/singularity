"use client";

import SignalCard from "./SignalCard";
import RecommendationBox from "./RecommendationBox";
import DownloadReportButton from "./DownloadReportButton";

interface Signal {
  name: string;
  risk: number;
  description: string;
}

interface ImageInfo {
  width: number;
  height: number;
  format: string;
  mode: string;
  aspect_ratio: number;
  megapixels: number;
  has_exif: boolean;
}

interface ScanResult {
  message: string;
  original_filename: string;
  stored_filename: string;
  content_type: string;
  media_category?: string;
  file_size_bytes: number;
  authenticity_score: number;
  risk_level: string;
  model_version: string;
  created_at?: string;
  image_info?: ImageInfo;
  signals?: Signal[];
}

interface ResultCardProps {
  result: ScanResult;
  previewUrl?: string | null;
}

export default function ResultCard({
  result,
  previewUrl,
}: ResultCardProps) {

  const getRiskBadgeStyle = () => {
    switch (result.risk_level) {
      case "Suspicious":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20";
      case "High Risk":
        return "bg-red-500/20 text-red-300 border border-red-400/20";
      default:
        return "bg-green-500/20 text-green-300 border border-green-400/20";
    }
  };

  const getProgressBarColor = () => {
    if (result.authenticity_score >= 75) return "bg-green-400";
    if (result.authenticity_score >= 45) return "bg-yellow-400";
    return "bg-red-400";
  };

  const scanId = `SG-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  // ✅ Threat logic
  const confidence = Math.min(
    98,
    Math.max(60, result.authenticity_score + 5)
  );

  const topSignal = result.signals?.sort(
    (a, b) => b.risk - a.risk
  )[0];

  const primaryConcern = topSignal
    ? topSignal.name
    : "General media inconsistencies detected";

  const getRecommendation = () => {
    if (result.risk_level === "High Risk") {
      return "Avoid sharing. Perform strict verification from trusted sources.";
    }

    if (result.risk_level === "Suspicious") {
      return "Manual verification advised before sharing.";
    }

    return "Media appears safe, but always verify critical content.";
  };

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">

      {/* ✅ MEDIA PREVIEW */}
      {previewUrl && (
        <div className="border-b border-white/10 bg-black/30 p-6">
          <p className="mb-4 text-sm uppercase tracking-widest text-cyan-300">
            Uploaded Media Preview
          </p>

          {result.content_type.startsWith("image/") && (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full max-h-[500px] object-contain rounded-2xl"
            />
          )}

          {result.content_type.startsWith("video/") && (
            <video controls className="w-full rounded-2xl">
              <source src={previewUrl} type={result.content_type} />
            </video>
          )}

          {result.content_type.startsWith("audio/") && (
            <audio controls className="w-full">
              <source src={previewUrl} type={result.content_type} />
            </audio>
          )}
        </div>
      )}

      {/* ✅ HEADER */}
      <div className="border-b border-white/10 p-8">
        <div className="mb-6 flex justify-between items-start flex-col md:flex-row gap-4">
          <div>
            <p className="text-sm text-cyan-300 mb-2 uppercase tracking-widest">
              Authenticity Analysis
            </p>

            <h2 className="text-5xl font-bold">
              {result.authenticity_score}
              <span className="text-cyan-300"> /100</span>
            </h2>
          </div>

          <div className={`px-4 py-2 rounded-full font-semibold ${getRiskBadgeStyle()}`}>
            {result.risk_level}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Trust Score</span>
            <span>{result.authenticity_score}%</span>
          </div>

          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`${getProgressBarColor()} h-full transition-all`}
              style={{ width: `${result.authenticity_score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-8">

        {/* ✅ THREAT PANEL */}
        <div className="mb-10 rounded-3xl border border-red-400/20 bg-red-500/10 p-6">
          <p className="text-sm uppercase text-red-300 mb-4 tracking-widest">
            Threat Assessment
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-400 text-sm">Threat Level</p>
              <p className="text-xl font-bold text-white">
                {result.risk_level}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Confidence</p>
              <p className="text-xl font-bold text-cyan-300">
                {confidence}%
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Primary Concern</p>
              <p className="text-white font-semibold">
                {primaryConcern}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Recommended Action</p>
              <p className="text-white font-semibold">
                {getRecommendation()}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Signals */}
        {result.signals && result.signals.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-5">
              Detected Signals
            </h3>

            <div className="space-y-4">
              {result.signals.map((signal, index) => (
                <SignalCard key={index} signal={signal} />
              ))}
            </div>
          </div>
        )}

        <RecommendationBox />
        <DownloadReportButton result={result} />
      </div>
    </div>
  );
}