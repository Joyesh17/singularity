"use client";

import { useEffect, useState } from "react";

import UploadBox from "./components/UploadBox";
import ResultCard from "./components/ResultCard";
import ScanHistory from "./components/ScanHistory";

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
};

type HistoryItem = {
  filename: string;
  authenticity_score: number;
  risk_level: string;
  date: string;
};

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
      setHistory(JSON.parse(storedHistory));
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
      alert("Please select a file first.");
      return;
    }

    setLoading(true);

    setLoadingText("Analyzing media...");

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:8000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      setLoadingText(
        "Generating authenticity score..."
      );

      const data: ScanResult =
        await response.json();

      setResult(data);

      const newHistoryItem: HistoryItem = {
        filename: data.original_filename,
        authenticity_score:
          data.authenticity_score,
        risk_level: data.risk_level,
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

      setSelectedFile(null);
    } catch (error) {
      console.error(error);

      alert("Upload failed.");
    }

    setLoading(false);

    setLoadingText("");
  }

  function clearHistory() {
    localStorage.removeItem("scan_history");

    setHistory([]);
  }

  return (
    <main className="min-h-screen bg-[#050A14] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">
          Scan Suspicious Media
        </h1>

        <p className="mb-8 leading-7 text-gray-300">
          Upload an image, video, or audio file
          to generate an authenticity score and
          detect possible manipulation signals.
        </p>

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

        <ScanHistory
          history={history}
          onClear={clearHistory}
        />
      </div>
    </main>
  );
}