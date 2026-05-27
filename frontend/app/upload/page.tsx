// #Start
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import UploadBox from "./components/UploadBox";
import ResultCard from "./components/ResultCard";

type Signal = {
  name: string;
  risk: number;
  description: string;
};

type ImageInfo = {
  width: number;
  height: number;
  format: string;
  mode: string;
  aspect_ratio: number;
  megapixels: number;
  has_exif: boolean;
};

type XAIInfo = {
  method?: string;
  target_class?: string;
  interpretation_note?: string;
  gradcam_path?: string;
  original_path?: string;
  metadata_path?: string;
  gradcam_url?: string;
  original_url?: string;
  metadata_url?: string;
};

type BackendResult = {
  success: boolean;
  prediction: "real" | "fake";
  confidence: number;
  real_probability: number;
  fake_probability: number;
  model: string;
  input_image?: string;
  image_width?: number;
  image_height?: number;
  important_note?: string;
  timestamp?: string;
  xai?: XAIInfo;
  uploaded_file?: {
    original_filename?: string;
    saved_filename?: string;
    saved_path?: string;
    url?: string;
  };
};

type ScanResult = {
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

  prediction?: "real" | "fake";
  confidence?: number;
  real_probability?: number;
  fake_probability?: number;
  model?: string;
  xai?: XAIInfo;
  important_note?: string;
  uploaded_file?: BackendResult["uploaded_file"];
};

type HistoryItem = {
  filename: string;
  authenticity_score: number;
  risk_level: string;
  prediction?: "real" | "fake";
  confidence?: number;
  date: string;
};

const API_URL = "http://127.0.0.1:8000/predict";

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050A14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-cyan-300"
        >
          Singularity
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          <Link
            href="/docs"
            className="transition hover:text-cyan-300"
          >
            Documentation
          </Link>

          <Link
            href="/upload"
            className="transition hover:text-cyan-300"
          >
            Scanner
          </Link>

          <Link
            href="/history"
            className="transition hover:text-cyan-300"
          >
            Result History
          </Link>
        </nav>

        <Link
          href="/upload"
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
        >
          Launch Scanner
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050A14] px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-2xl font-black text-cyan-300">
            Singularity
          </h3>

          <p className="max-w-md leading-7 text-gray-400">
            An AI-powered fake image detection platform with confidence scoring,
            scan history, and Grad-CAM explainability for responsible image
            verification.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">
            Quick Links
          </h4>

          <div className="space-y-3 text-gray-400">
            <Link
              href="/"
              className="block transition hover:text-cyan-300"
            >
              Home
            </Link>

            <Link
              href="/upload"
              className="block transition hover:text-cyan-300"
            >
              Scanner
            </Link>

            <Link
              href="/docs"
              className="block transition hover:text-cyan-300"
            >
              Documentation
            </Link>

            <Link
              href="/history"
              className="block transition hover:text-cyan-300"
            >
              Result History
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">
            Project Information
          </h4>

          <div className="space-y-3 text-gray-400">
            <p>Project: Singularity AI</p>
            <p>MVP Version: v1 Image Detector</p>
            <p>Contact: +880 1XXX-XXXXXX</p>
            <p>Location: Bangladesh</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 md:flex-row">
        <p>
          © {currentYear} Singularity AI. All rights reserved.
        </p>

        <p>
          MVP v1 focuses on Stable Diffusion-style fake image detection.
        </p>
      </div>
    </footer>
  );
}

function probabilityToPercent(value: number): number {
  return Math.round(value * 100);
}

function getRiskLevel(
  prediction: "real" | "fake",
  fakeProbability: number
): string {
  if (prediction === "fake") {
    if (fakeProbability >= 0.75) {
      return "High Risk";
    }

    return "Suspicious";
  }

  return "Likely Real";
}

function getAuthenticityScore(
  prediction: "real" | "fake",
  realProbability: number,
  fakeProbability: number
): number {
  if (prediction === "real") {
    return probabilityToPercent(realProbability);
  }

  return Math.max(0, 100 - probabilityToPercent(fakeProbability));
}

function buildSignals(data: BackendResult): Signal[] {
  return [
    {
      name: "AI Image Probability",
      risk: probabilityToPercent(data.fake_probability),
      description:
        "Model-estimated probability that this image is AI-generated.",
    },
    {
      name: "Real Image Probability",
      risk: probabilityToPercent(data.real_probability),
      description:
        "Model-estimated probability that this image is a real photographic image.",
    },
    {
      name: "Model Confidence",
      risk: probabilityToPercent(data.confidence),
      description:
        "Confidence score for the model's final real/fake prediction.",
    },
    {
      name: "Grad-CAM Explainability",
      risk: probabilityToPercent(data.confidence),
      description:
        "Grad-CAM heatmap was generated to show which regions influenced the prediction.",
    },
  ];
}

function mapBackendResultToScanResult(
  data: BackendResult,
  selectedFile: File
): ScanResult {
  const originalFilename =
    data.uploaded_file?.original_filename || selectedFile.name;

  const storedFilename =
    data.uploaded_file?.saved_filename || selectedFile.name;

  const authenticityScore = getAuthenticityScore(
    data.prediction,
    data.real_probability,
    data.fake_probability
  );

  const riskLevel = getRiskLevel(
    data.prediction,
    data.fake_probability
  );

  const width = data.image_width || 0;
  const height = data.image_height || 0;

  const imageInfo: ImageInfo = {
    width,
    height,
    format: selectedFile.type || "image",
    mode: "RGB",
    aspect_ratio: height > 0 ? Number((width / height).toFixed(4)) : 0,
    megapixels:
      width > 0 && height > 0
        ? Number(((width * height) / 1_000_000).toFixed(3))
        : 0,
    has_exif: false,
  };

  return {
    message:
      "Image analysis completed using the Singularity AI image detector.",
    original_filename: originalFilename,
    stored_filename: storedFilename,
    content_type: selectedFile.type || "image/*",
    media_category: "image",
    file_size_bytes: selectedFile.size,
    authenticity_score: authenticityScore,
    risk_level: riskLevel,
    model_version: data.model || "EfficientNet-B0 MVP",
    created_at: data.timestamp || new Date().toISOString(),
    image_info: imageInfo,
    signals: buildSignals(data),

    prediction: data.prediction,
    confidence: data.confidence,
    real_probability: data.real_probability,
    fake_probability: data.fake_probability,
    model: data.model,
    xai: data.xai,
    important_note: data.important_note,
    uploaded_file: data.uploaded_file,
  };
}

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    const storedHistory = localStorage.getItem("scan_history");

    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        localStorage.removeItem("scan_history");
      }
    }
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    setPreviewUrl(null);
  }, [selectedFile]);

  async function handleUpload() {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      alert("MVP v1 supports image files only.");
      return;
    }

    setLoading(true);
    setLoadingText("Uploading image...");
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoadingText("Running AI image detector...");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert("Prediction failed.");
        return;
      }

      setLoadingText("Generating explainability heatmap...");

      const mappedResult = mapBackendResultToScanResult(
        data as BackendResult,
        selectedFile
      );

      setResult(mappedResult);

      const newHistoryItem: HistoryItem = {
        filename: mappedResult.original_filename,
        authenticity_score: mappedResult.authenticity_score,
        risk_level: mappedResult.risk_level,
        prediction: mappedResult.prediction,
        confidence: mappedResult.confidence,
        date: new Date().toLocaleString(),
      };

      const updatedHistory = [
        newHistoryItem,
        ...history,
      ].slice(0, 10);

      setHistory(updatedHistory);

      localStorage.setItem(
        "scan_history",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  }

  return (
    <main className="min-h-screen bg-[#050A14] text-white">
      <Header />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Singularity Scanner
            </p>

            <h1 className="mb-4 text-5xl font-black">
              Scan Suspicious Image
            </h1>

            <p className="mx-auto max-w-3xl leading-7 text-gray-300">
              Upload an image to detect whether it is likely real or
              AI-generated. The system returns confidence scores, detected
              signals, and a Grad-CAM explanation showing which regions
              influenced the prediction.
            </p>
          </div>

          <UploadBox
            selectedFile={selectedFile}
            loading={loading}
            loadingText={loadingText}
            onFileChange={setSelectedFile}
            onUpload={handleUpload}
          />

          {result && (
            <ResultCard
              result={result}
              previewUrl={previewUrl}
            />
          )}

          <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-5 text-sm leading-7 text-yellow-50">
            <p className="mb-2 font-semibold text-yellow-300">
              MVP v1 Scope
            </p>

            <p>
              This MVP is optimized for Stable Diffusion-style fake image
              detection. MVP v2 will expand training to StyleGAN, DALL·E,
              Midjourney, and other generators for stronger cross-generator
              generalization.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
// #Finish