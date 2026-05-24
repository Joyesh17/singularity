"use client";

import SignalCard from "./SignalCard";
import RecommendationBox from "./RecommendationBox";
import DownloadReportButton from "./DownloadReportButton";

interface Signal {
  name: string;
  risk: number;
  description: string;
}

interface ScanResult {
  message: string;
  original_filename: string;
  stored_filename: string;
  content_type: string;
  file_size_bytes: number;
  authenticity_score: number;
  risk_level: string;
  model_version: string;
  signals?: Signal[];
}

interface ResultCardProps {
  result: ScanResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const getRiskBadgeStyle = () => {
    switch (result.risk_level) {
      case "Suspicious":
        return "bg-yellow-500/20 text-yellow-300";

      case "High Risk":
        return "bg-red-500/20 text-red-300";

      default:
        return "bg-green-500/20 text-green-300";
    }
  };

  const getProgressBarColor = () => {
    if (result.authenticity_score >= 75) {
      return "bg-green-400";
    }

    if (result.authenticity_score >= 45) {
      return "bg-yellow-400";
    }

    return "bg-red-400";
  };

  const scanId = `SG-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/4 p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-cyan-300 mb-3">
            Authenticity Analysis
          </p>

          <h2 className="text-5xl font-bold text-white">
            {result.authenticity_score}
            <span className="text-cyan-300">/100</span>
          </h2>
        </div>

        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskBadgeStyle()}`}
        >
          {result.risk_level}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Trust Score</span>
          <span>{result.authenticity_score}%</span>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor()}`}
            style={{
              width: `${result.authenticity_score}%`,
            }}
          />
        </div>
      </div>

      {/* Scan Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400 mb-2">
            Scan ID
          </p>

          <p className="font-semibold text-cyan-300">
            {scanId}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400 mb-2">
            Scan Timestamp
          </p>

          <p className="font-semibold text-white">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* File Information */}
      <div className="space-y-5 text-gray-300">
        <div className="flex justify-between border-b border-white/10 pb-3">
          <span>Original File</span>

          <span className="text-white font-medium">
            {result.original_filename}
          </span>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-3">
          <span>Content Type</span>

          <span className="text-white font-medium">
            {result.content_type}
          </span>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-3">
          <span>File Size</span>

          <span className="text-white font-medium">
            {(result.file_size_bytes / 1024).toFixed(2)} KB
          </span>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-3">
          <span>Model Version</span>

          <span className="text-white font-medium">
            {result.model_version}
          </span>
        </div>
      </div>

      {/* Detected Signals */}
      {result.signals && result.signals.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-5">
            Detected Signals
          </h3>

          <div className="space-y-4">
            {result.signals.map((signal, index) => (
              <SignalCard
                key={index}
                signal={signal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <RecommendationBox />

      {/* Download Report */}
      <DownloadReportButton result={result} />
    </div>
  );
}