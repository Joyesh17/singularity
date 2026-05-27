// #Start
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HistoryItem = {
  filename: string;
  authenticity_score: number;
  risk_level: string;
  prediction?: "real" | "fake";
  confidence?: number;
  date: string;
};

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050A14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-black tracking-tight text-cyan-300">
          Singularity
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          <Link href="/docs" className="transition hover:text-white">
            Documentation
          </Link>

          <Link href="/upload" className="transition hover:text-white">
            Scanner
          </Link>

          <Link href="/history" className="transition hover:text-white">
            Result History
          </Link>
        </nav>

        <Link href="/upload" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/20">
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
            <Link href="/" className="block transition hover:text-white">
              Home
            </Link>

            <Link href="/upload" className="block transition hover:text-white">
              Scanner
            </Link>

            <Link href="/docs" className="block transition hover:text-white">
              Documentation
            </Link>

            <Link href="/history" className="block transition hover:text-white">
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

function getRiskStyle(riskLevel: string) {
  if (riskLevel === "High Risk") {
    return "border-red-400/20 bg-red-500/10 text-red-300";
  }

  if (riskLevel === "Suspicious") {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-300";
  }

  return "border-green-400/20 bg-green-500/10 text-green-300";
}

function getPredictionStyle(prediction?: "real" | "fake") {
  if (prediction === "fake") {
    return "text-red-300";
  }

  if (prediction === "real") {
    return "text-green-300";
  }

  return "text-cyan-300";
}

function formatPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "N/A";
  }

  if (value <= 1) {
    return `${(value * 100).toFixed(2)}%`;
  }

  return `${value.toFixed(2)}%`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("scan_history");

    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory) as HistoryItem[];
        setHistory(parsedHistory);
      } catch {
        localStorage.removeItem("scan_history");
        setHistory([]);
      }
    }
  }, []);

  function clearHistory() {
    localStorage.removeItem("scan_history");
    setHistory([]);
  }

  return (
    <main className="min-h-screen bg-[#050A14] text-white">
      <Header />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Scan Records
            </p>

            <h1 className="mb-5 text-5xl font-black">
              Result History
            </h1>

            <p className="mx-auto max-w-3xl leading-7 text-gray-300">
              Review recent image scans stored locally in your browser. This
              history helps you quickly revisit previous predictions,
              authenticity scores, and risk levels.
            </p>
          </div>

          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-cyan-300">
                Local History
              </p>

              <p className="mt-2 text-gray-300">
                Total saved scans:{" "}
                <span className="font-semibold text-white">
                  {history.length}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/upload"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
              >
                New Scan
              </Link>

              <button
                onClick={clearHistory}
                disabled={history.length === 0}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:border-red-400/30 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear History
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                No scan history yet
              </h2>

              <p className="mx-auto mb-8 max-w-2xl leading-7 text-gray-300">
                Once you scan an image, the result will appear here. Scan
                history is stored locally in this browser.
              </p>

              <Link
                href="/upload"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
              >
                Start First Scan
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {history.map((item, index) => (
                <div
                  key={`${item.filename}-${item.date}-${index}`}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.03]"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="min-w-0">
                      <p className="mb-2 text-sm uppercase tracking-widest text-cyan-300">
                        Scan #{index + 1}
                      </p>

                      <h2 className="break-words text-2xl font-bold">
                        {item.filename}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        {item.date}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:min-w-[520px]">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                        <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
                          Prediction
                        </p>

                        <p
                          className={`text-xl font-bold ${getPredictionStyle(
                            item.prediction
                          )}`}
                        >
                          {item.prediction
                            ? item.prediction.toUpperCase()
                            : "N/A"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                        <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
                          Trust Score
                        </p>

                        <p className="text-xl font-bold text-cyan-300">
                          {item.authenticity_score}/100
                        </p>
                      </div>

                      <div
                        className={`rounded-2xl border p-4 text-center ${getRiskStyle(
                          item.risk_level
                        )}`}
                      >
                        <p className="mb-2 text-xs uppercase tracking-widest opacity-80">
                          Risk Level
                        </p>

                        <p className="text-xl font-bold">
                          {item.risk_level}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm text-gray-400">
                        Confidence
                      </p>

                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{
                            width:
                              typeof item.confidence === "number"
                                ? `${Math.min(
                                    100,
                                    item.confidence <= 1
                                      ? item.confidence * 100
                                      : item.confidence
                                  )}%`
                                : "0%",
                          }}
                        />
                      </div>

                      <p className="mt-2 text-sm text-gray-400">
                        {formatPercent(item.confidence)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-sm text-gray-400">
                        Authenticity Score
                      </p>

                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={
                            item.authenticity_score >= 75
                              ? "h-full rounded-full bg-green-400"
                              : item.authenticity_score >= 45
                                ? "h-full rounded-full bg-yellow-400"
                                : "h-full rounded-full bg-red-400"
                          }
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, item.authenticity_score)
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-sm text-gray-400">
                        {item.authenticity_score}% trust score
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-5 text-sm leading-7 text-yellow-50">
            <p className="mb-2 font-semibold text-yellow-300">
              Privacy Note
            </p>

            <p>
              Result history is stored only in your browser localStorage. It is
              not synced to a cloud account. Clearing browser data or pressing
              “Clear History” will remove these records.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
// #Finish