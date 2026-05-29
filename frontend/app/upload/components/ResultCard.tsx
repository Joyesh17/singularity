"use client";

import SignalCard from "./SignalCard";
import RecommendationBox from "./RecommendationBox";
import DownloadReportButton from "./DownloadReportButton";

/**
 * Threshold constants 
 */
const HIGH_TRUST_THRESHOLD = 75;
const MEDIUM_TRUST_THRESHOLD = 45;
const HIGH_FAKE_PROBABILITY = 0.75;

/**
 * API base URL
 * Uses `NEXT_PUBLIC_API_URL` when available; falls back to local backend.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Types
 */
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

interface XAIInfo {
  gradcam_url?: string;
  original_url?: string;
}

interface ScanResult {
  message?: string;
  original_filename?: string;
  stored_filename?: string;
  content_type?: string;
  media_category?: string;
  file_size_bytes?: number;
  authenticity_score?: number;
  risk_level?: string;
  model_version?: string;
  created_at?: string;
  image_info?: ImageInfo;
  signals?: Signal[];

  prediction?: "real" | "fake";
  confidence?: number;
  real_probability?: number;
  fake_probability?: number;
  model?: string;
  xai?: XAIInfo;
  important_note?: string;
  uploaded_file?: {
    original_filename?: string;
    saved_filename?: string;
  };
}

interface ResultCardProps {
  result: ScanResult;
  previewUrl?: string | null;
}

/**
 * Utility functions
 */
function toPercent(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return value <= 1 ? Math.round(value * 100) : Math.round(value);
}

function toFixedPercent(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.00%";
  return value <= 1
    ? `${(value * 100).toFixed(2)}%`
    : `${value.toFixed(2)}%`;
}

function buildAssetUrl(url?: string): string | null {
  if (!url) return null;

  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;

  return url;
}

function getProgressBarClass(score: number): string {
  if (score >= HIGH_TRUST_THRESHOLD) return "bg-green-400";
  if (score >= MEDIUM_TRUST_THRESHOLD) return "bg-yellow-400";
  return "bg-red-400";
}

function getRiskBadgeClass(risk: string): string {
  switch (risk) {
    case "High Risk":
      return "bg-red-500/20 text-red-300 border border-red-400/20";
    case "Suspicious":
      return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20";
    case "Likely Real":
    case "Safe":
      return "bg-green-500/20 text-green-300 border border-green-400/20";
    default:
      return "bg-cyan-500/20 text-cyan-300 border border-cyan-400/20";
  }
}

function getPredictionBadgeClass(prediction?: string): string {
  if (prediction === "fake") {
    return "bg-red-500/20 text-red-300 border border-red-400/20";
  }

  if (prediction === "real") {
    return "bg-green-500/20 text-green-300 border border-green-400/20";
  }

  return "bg-cyan-500/20 text-cyan-300 border border-cyan-400/20";
}

function getRecommendation(prediction?: string, risk?: string): string {
  if (prediction === "fake" || risk === "High Risk") {
    return "Avoid sharing without verification. This image is likely AI-generated.";
  }

  if (risk === "Suspicious") {
    return "Manual verification is advised before sharing this image.";
  }

  return "Image appears likely real, but always verify critical content from trusted sources.";
}

/**
 * Component
 */
export default function ResultCard({
  result,
  previewUrl,
}: ResultCardProps) {
  const prediction = result.prediction;

  const realProbability = result.real_probability ?? 0;
  const fakeProbability = result.fake_probability ?? 0;

  const confidencePercent = toPercent(result.confidence);

  const authenticityScore =
    typeof result.authenticity_score === "number"
      ? result.authenticity_score
      : prediction === "fake"
      ? Math.max(0, 100 - toPercent(fakeProbability))
      : toPercent(realProbability);

  const riskLevel =
    result.risk_level ??
    (prediction === "fake"
      ? fakeProbability >= HIGH_FAKE_PROBABILITY
        ? "High Risk"
        : "Suspicious"
      : "Likely Real");

  const originalFilename =
    result.original_filename ??
    result.uploaded_file?.original_filename ??
    "Uploaded image";

  const gradcamUrl = buildAssetUrl(result.xai?.gradcam_url);
  const displayPreviewUrl =
    previewUrl ?? buildAssetUrl(result.xai?.original_url);

  const derivedSignals: Signal[] =
    result.signals && result.signals.length
      ? result.signals
      : [
          {
            name: "AI Image Probability",
            risk: toPercent(fakeProbability),
            description:
              "Model-estimated probability that this image is AI-generated.",
          },
          {
            name: "Real Image Probability",
            risk: toPercent(realProbability),
            description:
              "Probability that this image is a real photograph.",
          },
          {
            name: "Model Confidence",
            risk: confidencePercent,
            description:
              "Confidence score of the final prediction.",
          },
        ];

  const topSignal =
    derivedSignals.length > 0
      ? [...derivedSignals].sort((a, b) => b.risk - a.risk)[0]
      : undefined;

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/4 shadow-2xl">
      {/* Media preview */}
      {displayPreviewUrl && (
        <div className="border-b border-white/10 bg-black/30 p-6">
          <p className="mb-4 text-sm uppercase tracking-widest text-cyan-300">
            Uploaded Image Preview
          </p>

          <img
            src={displayPreviewUrl}
            alt={originalFilename}
            className="w-full max-h-125 object-contain rounded-2xl"
          />
        </div>
      )}

      {/* Summary header */}
      <div className="border-b border-white/10 p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-cyan-300">
              Authenticity Score
            </p>

            <h2 className="text-5xl font-bold">
              {authenticityScore}
              <span className="text-cyan-300"> /100</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className={`px-4 py-2 rounded-full ${getRiskBadgeClass(riskLevel)}`}>
              {riskLevel}
            </div>

            {prediction && (
              <div className={`px-4 py-2 rounded-full ${getPredictionBadgeClass(prediction)}`}>
                {prediction.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="mb-2 flex justify-between text-sm text-gray-400">
            <span>Trust Score</span>
            <span>{authenticityScore}%</span>
          </div>

          <div className="h-4 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full ${getProgressBarClass(authenticityScore)}`}
              style={{ width: `${authenticityScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Prediction panel */}
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6">
          <h3 className="mb-4 text-sm uppercase tracking-widest text-cyan-300">
            Model Prediction
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Prediction</p>
              <p className="text-xl font-bold">
                {prediction?.toUpperCase() ?? "UNKNOWN"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Real</p>
              <p className="text-xl text-green-300">
                {toFixedPercent(realProbability)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Fake</p>
              <p className="text-xl text-red-300">
                {toFixedPercent(fakeProbability)}
              </p>
            </div>
          </div>
        </div>

        {/* Grad-CAM visualization */}
        {gradcamUrl && (
          <div className="rounded-3xl border border-cyan-400/20 bg-black/30 p-6">
            <h3 className="mb-4 text-sm uppercase tracking-widest text-cyan-300">
              Grad-CAM Explanation
            </h3>

            <img
              src={gradcamUrl}
              alt="Grad-CAM heatmap"
              className="w-full rounded-2xl"
            />
          </div>
        )}

        {/* Detected signals */}
        <div>
          <h3 className="mb-4 text-2xl font-semibold">
            Detected Signals
          </h3>

          <div className="space-y-4">
            {derivedSignals.map((signal, index) => (
              <SignalCard key={index} signal={signal} />
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <RecommendationBox />

        {/* Report download */}
        <DownloadReportButton result={result} />
      </div>
    </div>
  );
}
