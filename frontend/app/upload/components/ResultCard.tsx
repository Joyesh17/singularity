// #Start
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

interface XAIInfo {
  method?: string;
  target_class?: string;
  interpretation_note?: string;
  gradcam_path?: string;
  original_path?: string;
  metadata_path?: string;
  gradcam_url?: string;
  original_url?: string;
  metadata_url?: string;
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
  image_width?: number;
  image_height?: number;
  xai?: XAIInfo;
  important_note?: string;
  uploaded_file?: {
    original_filename?: string;
    saved_filename?: string;
    saved_path?: string;
    url?: string;
  };
}

interface ResultCardProps {
  result: ScanResult;
  previewUrl?: string | null;
}

const API_BASE_URL = "http://127.0.0.1:8000";

function toPercent(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  if (value <= 1) {
    return Math.round(value * 100);
  }

  return Math.round(value);
}

function toFixedPercent(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0.00%";
  }

  if (value <= 1) {
    return `${(value * 100).toFixed(2)}%`;
  }

  return `${value.toFixed(2)}%`;
}

function buildAssetUrl(url?: string): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${API_BASE_URL}${url}`;
  }

  return url;
}

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
      ? fakeProbability >= 0.75
        ? "High Risk"
        : "Suspicious"
      : "Likely Real");

  const modelVersion =
    result.model_version ??
    result.model ??
    "EfficientNet-B0 MVP";

  const originalFilename =
    result.original_filename ??
    result.uploaded_file?.original_filename ??
    "Uploaded image";

  const contentType = result.content_type ?? "image/*";

  const gradcamUrl = buildAssetUrl(result.xai?.gradcam_url);
  const originalUrl = buildAssetUrl(result.xai?.original_url);

  const displayPreviewUrl = previewUrl ?? originalUrl;

  const derivedSignals: Signal[] =
    result.signals && result.signals.length > 0
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
              "Model-estimated probability that this image is a real photographic image.",
          },
          {
            name: "Model Confidence",
            risk: confidencePercent,
            description:
              "Confidence score for the model's final real/fake prediction.",
          },
        ];

  const topSignal = [...derivedSignals].sort(
    (a, b) => b.risk - a.risk
  )[0];

  const primaryConcern =
    prediction === "fake"
      ? topSignal?.name ?? "AI-generated visual patterns detected"
      : "No strong AI-generated pattern detected";

  const getRiskBadgeStyle = () => {
    switch (riskLevel) {
      case "Suspicious":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20";
      case "High Risk":
        return "bg-red-500/20 text-red-300 border border-red-400/20";
      case "Likely Real":
      case "Safe":
        return "bg-green-500/20 text-green-300 border border-green-400/20";
      default:
        return "bg-cyan-500/20 text-cyan-300 border border-cyan-400/20";
    }
  };

  const getProgressBarColor = () => {
    if (authenticityScore >= 75) return "bg-green-400";
    if (authenticityScore >= 45) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getPredictionBadgeStyle = () => {
    if (prediction === "fake") {
      return "bg-red-500/20 text-red-300 border border-red-400/20";
    }

    if (prediction === "real") {
      return "bg-green-500/20 text-green-300 border border-green-400/20";
    }

    return "bg-cyan-500/20 text-cyan-300 border border-cyan-400/20";
  };

  const getRecommendation = () => {
    if (prediction === "fake" || riskLevel === "High Risk") {
      return "Avoid sharing without verification. This image is likely AI-generated.";
    }

    if (riskLevel === "Suspicious") {
      return "Manual verification is advised before sharing this image.";
    }

    return "Image appears likely real, but always verify critical content from trusted sources.";
  };

  const normalizedReportResult = {
    message:
      result.message ??
      "Image analysis completed using the Singularity AI MVP detector.",
    original_filename: originalFilename,
    stored_filename:
      result.stored_filename ??
      result.uploaded_file?.saved_filename ??
      originalFilename,
    content_type: contentType,
    media_category: result.media_category ?? "image",
    file_size_bytes: result.file_size_bytes ?? 0,
    authenticity_score: authenticityScore,
    risk_level: riskLevel,
    model_version: modelVersion,
    created_at: result.created_at,
    image_info: result.image_info,
    signals: derivedSignals,
    prediction,
    confidence: result.confidence,
    real_probability: realProbability,
    fake_probability: fakeProbability,
    xai: result.xai,
    important_note: result.important_note,
  };

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">
      {/* MEDIA PREVIEW */}
      {displayPreviewUrl && (
        <div className="border-b border-white/10 bg-black/30 p-6">
          <p className="mb-4 text-sm uppercase tracking-widest text-cyan-300">
            Uploaded Image Preview
          </p>

          <img
            src={displayPreviewUrl}
            alt="Uploaded image preview"
            className="w-full max-h-[500px] object-contain rounded-2xl"
          />
        </div>
      )}

      {/* HEADER */}
      <div className="border-b border-white/10 p-8">
        <div className="mb-6 flex justify-between items-start flex-col md:flex-row gap-4">
          <div>
            <p className="text-sm text-cyan-300 mb-2 uppercase tracking-widest">
              Authenticity Analysis
            </p>

            <h2 className="text-5xl font-bold">
              {authenticityScore}
              <span className="text-cyan-300"> /100</span>
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Higher score means the image appears more likely to be real.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-start md:items-end">
            <div className={`px-4 py-2 rounded-full font-semibold ${getRiskBadgeStyle()}`}>
              {riskLevel}
            </div>

            {prediction && (
              <div className={`px-4 py-2 rounded-full font-semibold ${getPredictionBadgeStyle()}`}>
                Prediction: {prediction.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Trust Score</span>
            <span>{authenticityScore}%</span>
          </div>

          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`${getProgressBarColor()} h-full transition-all`}
              style={{ width: `${authenticityScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* MODEL PROBABILITY PANEL */}
        <div className="mb-10 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6">
          <p className="text-sm uppercase text-cyan-300 mb-4 tracking-widest">
            Model Prediction
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Final Prediction</p>
              <p
                className={`text-xl font-bold ${
                  prediction === "fake"
                    ? "text-red-300"
                    : "text-green-300"
                }`}
              >
                {prediction ? prediction.toUpperCase() : "UNKNOWN"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Real Probability</p>
              <p className="text-xl font-bold text-green-300">
                {toFixedPercent(realProbability)}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Fake Probability</p>
              <p className="text-xl font-bold text-red-300">
                {toFixedPercent(fakeProbability)}
              </p>
            </div>
          </div>
        </div>

        {/* THREAT PANEL */}
        <div className="mb-10 rounded-3xl border border-red-400/20 bg-red-500/10 p-6">
          <p className="text-sm uppercase text-red-300 mb-4 tracking-widest">
            Threat Assessment
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Threat Level</p>
              <p className="text-xl font-bold text-white">
                {riskLevel}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Confidence</p>
              <p className="text-xl font-bold text-cyan-300">
                {confidencePercent}%
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

        {/* GRAD-CAM */}
        {gradcamUrl && (
          <div className="mb-10 rounded-3xl border border-cyan-400/20 bg-black/30 p-6">
            <p className="mb-2 text-sm uppercase tracking-widest text-cyan-300">
              Explainable AI: Grad-CAM
            </p>

            <p className="mb-5 text-sm leading-7 text-gray-300">
              The heatmap highlights regions that influenced the model&apos;s
              predicted class. Red/yellow areas indicate stronger relative
              contribution. They do not necessarily mean fake artifacts.
            </p>

            <img
              src={gradcamUrl}
              alt="Grad-CAM explanation"
              className="w-full max-h-[500px] object-contain rounded-2xl border border-white/10"
            />
          </div>
        )}

        {/* Signals */}
        {derivedSignals.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-5">
              Detected Signals
            </h3>

            <div className="space-y-4">
              {derivedSignals.map((signal, index) => (
                <SignalCard key={index} signal={signal} />
              ))}
            </div>
          </div>
        )}

        {/* MVP LIMITATION NOTE */}
        {result.important_note && (
          <div className="mb-10 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-yellow-300">
              MVP Note
            </p>

            <p className="text-sm leading-7 text-yellow-50">
              {result.important_note}
            </p>
          </div>
        )}

        <RecommendationBox />
        <DownloadReportButton result={normalizedReportResult} />
      </div>
    </div>
  );
}
// #Finish