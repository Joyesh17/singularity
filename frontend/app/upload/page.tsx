"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import UploadBox from "./components/UploadBox";
import ResultCard from "./components/ResultCard";

/**
 * Constants
 */
const MAX_HISTORY_ITEMS = 10;
const HIGH_FAKE_THRESHOLD = 0.75;
const LOCAL_STORAGE_KEY = "scan_history";

/**
 * Use env variable for production
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/predict";

/**
 * Types
 */
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

type BackendResult = {
  success: boolean;
  prediction: "real" | "fake";
  confidence: number;
  real_probability: number;
  fake_probability: number;
  model: string;
  image_width?: number;
  image_height?: number;
  timestamp?: string;
  important_note?: string;
  xai?: any;
  uploaded_file?: {
    original_filename?: string;
    saved_filename?: string;
    url?: string;
  };
};

type ScanResult = {
  original_filename: string;
  authenticity_score: number;
  risk_level: string;
  prediction?: "real" | "fake";
  confidence?: number;
  real_probability?: number;
  fake_probability?: number;
  model?: string;
  xai?: any;
  important_note?: string;
};

type HistoryItem = {
  filename: string;
  authenticity_score: number;
  risk_level: string;
  prediction?: "real" | "fake";
  confidence?: number;
  date: string;
};

/**
 * Utility functions
 */
function toPercent(value: number): number {
  return Math.round(value * 100);
}

function getRiskLevel(
  prediction: "real" | "fake",
  fakeProbability: number
): string {
  if (prediction === "fake") {
    return fakeProbability >= HIGH_FAKE_THRESHOLD
      ? "High Risk"
      : "Suspicious";
  }

  return "Likely Real";
}

function getAuthenticityScore(
  prediction: "real" | "fake",
  real: number,
  fake: number
): number {
  return prediction === "real"
    ? toPercent(real)
    : Math.max(0, 100 - toPercent(fake));
}

function mapBackendResult(
  data: BackendResult,
  file: File
): ScanResult {
  return {
    original_filename:
      data.uploaded_file?.original_filename || file.name,
    authenticity_score: getAuthenticityScore(
      data.prediction,
      data.real_probability,
      data.fake_probability
    ),
    risk_level: getRiskLevel(
      data.prediction,
      data.fake_probability
    ),
    prediction: data.prediction,
    confidence: data.confidence,
    real_probability: data.real_probability,
    fake_probability: data.fake_probability,
    model: data.model,
    xai: data.xai,
    important_note: data.important_note,
  };
}

/**
 * Header component
 */
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050A14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-black text-cyan-300">
          Singularity
        </Link>

        <nav className="hidden gap-8 text-sm text-gray-300 md:flex">
          <Link href="/docs">Documentation</Link>
          <Link href="/upload">Scanner</Link>
          <Link href="/history">History</Link>
        </nav>

        <Link
          href="/upload"
          className="rounded-xl bg-cyan-400 px-5 py-3 text-black"
        >
          Launch Scanner
        </Link>
      </div>
    </header>
  );
}

/**
 * Footer component
 */
function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-gray-400">
      <div className="mx-auto max-w-7xl text-center">
        © {new Date().getFullYear()} Singularity AI
      </div>
    </footer>
  );
}

/**
 * Main page component
 */
export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  /**
   * Load history from localStorage
   */
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return;

    try {
      setHistory(JSON.parse(stored));
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  /**
   * Generate preview
   */
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  /**
   * Upload handler
   */
  async function handleUpload() {
    if (!selectedFile) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);
    setLoadingText("Uploading...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend responded with error.");
      }

      const data: BackendResult = await response.json();

      const mapped = mapBackendResult(data, selectedFile);

      setResult(mapped);

      const newItem: HistoryItem = {
        filename: mapped.original_filename,
        authenticity_score: mapped.authenticity_score,
        risk_level: mapped.risk_level,
        prediction: mapped.prediction,
        confidence: mapped.confidence,
        date: new Date().toLocaleString(),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev].slice(
          0,
          MAX_HISTORY_ITEMS
        );

        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(updated)
        );

        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to process image. Try again.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  }

  return (
    <main className="min-h-screen bg-[#050A14] text-white">
      <Header />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-black">
            Scan Image
          </h1>

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
        </div>
      </section>

      <Footer />
    </main>
  );
}
