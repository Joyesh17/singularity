"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/**
 * Constants
 */
const LOCAL_STORAGE_KEY = "scan_history";

const HIGH_TRUST_THRESHOLD = 75;
const MEDIUM_TRUST_THRESHOLD = 45;

const RISK_HIGH = "High Risk";
const RISK_SUSPICIOUS = "Suspicious";

/**
 * Types
 */
type HistoryItem = {
  filename: string;
  authenticity_score: number;
  risk_level: string;
  prediction?: "real" | "fake";
  confidence?: number;
  date: string;
};

type HistoryStats = {
  totalScans: number;
  totalReal: number;
  totalFake: number;
  highRiskCount: number;
  suspiciousCount: number;
  averageAuthenticityScore: number;
  averageConfidence: number;
};

/**
 * Utility functions
 */
function formatPercent(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "N/A";
  }

  return value <= 1
    ? `${(value * 100).toFixed(2)}%`
    : `${value.toFixed(2)}%`;
}

function normalizePercent(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return value <= 1 ? value * 100 : value;
}

function getProgressWidth(value?: number): string {
  const normalized = normalizePercent(value);
  return `${Math.min(100, Math.max(0, normalized))}%`;
}

function getProgressColor(score?: number): string {
  const normalizedScore = normalizePercent(score);

  if (normalizedScore >= HIGH_TRUST_THRESHOLD) {
    return "bg-green-400";
  }

  if (normalizedScore >= MEDIUM_TRUST_THRESHOLD) {
    return "bg-yellow-400";
  }

  return "bg-red-400";
}

function getRiskClass(riskLevel: string): string {
  if (riskLevel === RISK_HIGH) {
    return "border-red-400/20 bg-red-500/10 text-red-300";
  }

  if (riskLevel === RISK_SUSPICIOUS) {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-300";
  }

  return "border-green-400/20 bg-green-500/10 text-green-300";
}

function getPredictionClass(prediction?: "real" | "fake"): string {
  if (prediction === "fake") {
    return "text-red-300";
  }

  if (prediction === "real") {
    return "text-green-300";
  }

  return "text-cyan-300";
}

function calculateHistoryStats(history: HistoryItem[]): HistoryStats {
  const totalScans = history.length;

  if (totalScans === 0) {
    return {
      totalScans: 0,
      totalReal: 0,
      totalFake: 0,
      highRiskCount: 0,
      suspiciousCount: 0,
      averageAuthenticityScore: 0,
      averageConfidence: 0,
    };
  }

  const totalReal = history.filter((item) => item.prediction === "real").length;
  const totalFake = history.filter((item) => item.prediction === "fake").length;

  const highRiskCount = history.filter(
    (item) => item.risk_level === RISK_HIGH
  ).length;

  const suspiciousCount = history.filter(
    (item) => item.risk_level === RISK_SUSPICIOUS
  ).length;

  const averageAuthenticityScore = Math.round(
    history.reduce((sum, item) => {
      return sum + (item.authenticity_score || 0);
    }, 0) / totalScans
  );

  const confidenceValues = history
    .map((item) => normalizePercent(item.confidence))
    .filter((value) => value > 0);

  const averageConfidence =
    confidenceValues.length > 0
      ? Math.round(
          confidenceValues.reduce((sum, value) => sum + value, 0) /
            confidenceValues.length
        )
      : 0;

  return {
    totalScans,
    totalReal,
    totalFake,
    highRiskCount,
    suspiciousCount,
    averageAuthenticityScore,
    averageConfidence,
  };
}

/**
 * Header
 */
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
          <Link href="/docs" className="transition hover:text-cyan-300">
            Documentation
          </Link>

          <Link href="/upload" className="transition hover:text-cyan-300">
            Scanner
          </Link>

          <Link href="/history" className="transition hover:text-cyan-300">
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

/**
 * Footer
 */
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
          <h4 className="mb-4 font-semibold text-white">Quick Links</h4>

          <div className="space-y-3 text-gray-400">
            <Link href="/" className="block transition hover:text-cyan-300">
              Home
            </Link>

            <Link
              href="/upload"
              className="block transition hover:text-cyan-300"
            >
              Scanner
            </Link>

            <Link href="/docs" className="block transition hover:text-cyan-300">
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
        <p>© {currentYear} Singularity AI. All rights reserved.</p>

        <p>MVP v1 focuses on Stable Diffusion-style fake image detection.</p>
      </div>
    </footer>
  );
}

/**
 * Page
 */
export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const stats = useMemo(() => {
    return calculateHistoryStats(history);
  }, [history]);

  useEffect(() => {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storedHistory) {
      return;
    }

    try {
      const parsedHistory = JSON.parse(storedHistory) as HistoryItem[];
      setHistory(parsedHistory);
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setHistory([]);
    }
  }, []);

  function resetHistory() {
    const confirmed = window.confirm(
      "Are you sure you want to reset all scan history? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setHistory([]);
  }

  return (
    <main className="min-h-screen bg-[#050A14] text-white">
      <Header />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Local Scan Records
            </p>

            <h1 className="text-5xl font-black">Result History</h1>

            <p className="mx-auto mt-4 max-w-3xl leading-7 text-gray-300">
              Review previous image authenticity scans stored locally in your
              browser. This page summarizes tested images, real/fake prediction
              counts, confidence statistics, and risk distribution.
            </p>
          </div>

          <HistorySummaryCard stats={stats} />

          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/4 p-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-cyan-300">
                History Controls
              </p>

              <p className="mt-2 text-gray-300">
                Manage locally stored scan records.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/upload"
                className="rounded-xl border border-white/10 bg-white/4 px-5 py-3 text-sm font-semibold transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
              >
                New Scan
              </Link>

              <button
                onClick={resetHistory}
                disabled={history.length === 0}
                className="rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset History
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <EmptyHistoryState />
          ) : (
            <div className="space-y-5">
              {history.map((item, index) => (
                <HistoryListItem
                  key={`${item.filename}-${item.date}-${index}`}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-5 text-sm leading-7 text-yellow-50">
            <p className="mb-2 font-semibold text-yellow-300">Privacy Note</p>

            <p>
              Result history is stored only in your browser localStorage. It is
              not synced to a cloud account. Clearing browser data or pressing
              “Reset History” will remove these records.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/**
 * Summary card shown at the top of the history page.
 */
function HistorySummaryCard({ stats }: { stats: HistoryStats }) {
  return (
    <div className="mb-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
      <div className="mb-6 text-center">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-cyan-300">
          Scan Overview
        </p>

        <h2 className="text-3xl font-bold">Local Detection Summary</h2>

        <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-cyan-50">
          This summary is calculated from scan records stored in this browser.
          The data helps track how many images were tested and how the model
          classified previous uploads.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Tested Images"
          value={stats.totalScans}
          tone="cyan"
        />

        <MetricCard label="Predicted Fake" value={stats.totalFake} tone="red" />

        <MetricCard
          label="Predicted Real"
          value={stats.totalReal}
          tone="green"
        />

        <MetricCard
          label="High Risk"
          value={stats.highRiskCount}
          tone="red"
        />

        <MetricCard
          label="Suspicious"
          value={stats.suspiciousCount}
          tone="yellow"
        />

        <MetricCard
          label="Avg. Trust Score"
          value={`${stats.averageAuthenticityScore}/100`}
          tone="cyan"
        />

        <MetricCard
          label="Avg. Confidence"
          value={`${stats.averageConfidence}%`}
          tone="cyan"
        />

        <MetricCard
          label="Storage"
          value="Browser"
          tone="gray"
        />
      </div>
    </div>
  );
}

/**
 * Empty state shown when no history exists.
 */
function EmptyHistoryState() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-12 text-center">
      <h2 className="text-2xl font-bold">No scan history yet</h2>

      <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-300">
        Once an image is scanned, the result will appear here with prediction,
        confidence, risk level, and authenticity score.
      </p>

      <Link
        href="/upload"
        className="mt-6 inline-block rounded-xl border border-white/10 bg-white/4 px-6 py-3 text-sm font-semibold transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
      >
        Start Scanning
      </Link>
    </div>
  );
}

/**
 * Individual scan history item.
 */
function HistoryListItem({
  item,
  index,
}: {
  item: HistoryItem;
  index: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 transition hover:border-cyan-400/30 hover:bg-cyan-400/3">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="min-w-0">
          <p className="mb-2 text-sm uppercase tracking-widest text-cyan-300">
            Scan #{index + 1}
          </p>

          <h2 className="wrap-break-word text-2xl font-bold">
            {item.filename || "Unnamed image"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">{item.date}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:min-w-130">
          <InfoBox title="Prediction">
            <span className={getPredictionClass(item.prediction)}>
              {item.prediction ? item.prediction.toUpperCase() : "N/A"}
            </span>
          </InfoBox>

          <InfoBox title="Trust Score">
            {item.authenticity_score}/100
          </InfoBox>

          <InfoBox title="Risk Level">
            <span
              className={`rounded-full border px-3 py-1 text-sm ${getRiskClass(
                item.risk_level
              )}`}
            >
              {item.risk_level}
            </span>
          </InfoBox>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProgressBar label="Confidence" value={item.confidence} />

        <ProgressBar
          label="Authenticity Score"
          value={item.authenticity_score}
        />
      </div>
    </div>
  );
}

/**
 * Small metric card for the summary dashboard.
 */
function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "cyan" | "red" | "green" | "yellow" | "gray";
}) {
  const toneClassMap = {
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    red: "border-red-400/20 bg-red-500/10 text-red-300",
    green: "border-green-400/20 bg-green-500/10 text-green-300",
    yellow: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",
    gray: "border-white/10 bg-white/[0.04] text-gray-300",
  };

  return (
    <div className={`rounded-2xl border p-5 ${toneClassMap[tone]}`}>
      <p className="mb-2 text-xs uppercase tracking-widest opacity-80">
        {label}
      </p>

      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}

/**
 * Generic information box used inside a history row.
 */
function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
      <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
        {title}
      </p>

      <p className="text-lg font-bold">{children}</p>
    </div>
  );
}

/**
 * Progress bar with formatted percentage label.
 */
function ProgressBar({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  const progressWidth = getProgressWidth(value);

  return (
    <div>
      <p className="mb-2 text-sm text-gray-400">{label}</p>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${getProgressColor(value)}`}
          style={{ width: progressWidth }}
        />
      </div>

      <p className="mt-2 text-sm text-gray-400">
        {formatPercent(value)}
      </p>
    </div>
  );
}
