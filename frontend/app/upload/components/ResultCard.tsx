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

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
      {/* Top Score Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-2">
            Authenticity Score
          </p>

          <h2 className="text-5xl font-bold text-cyan-300">
            {result.authenticity_score}/100
          </h2>
        </div>

        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskBadgeStyle()}`}
        >
          {result.risk_level}
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