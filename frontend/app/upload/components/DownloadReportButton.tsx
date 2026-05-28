"use client";

/**
 * Constants
 */
const REPORT_PLATFORM = "Singularity";
const REPORT_VERSION = "1.0";
const DEFAULT_RECOMMENDATION =
  "Verify authenticity before sharing publicly.";

/**
 * Types
 */
interface Signal {
  name: string;
  risk: number;
  description: string;
}

interface ReportResult {
  original_filename?: string;
  content_type?: string;
  file_size_bytes?: number;
  authenticity_score?: number;
  risk_level?: string;
  model_version?: string;
  signals?: Signal[];
}

interface DownloadReportButtonProps {
  result: ReportResult;
}

/**
 * Utility: format date for filename
 */
function getDateString(): string {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

/**
 * Build report object
 */
function buildReport(result: ReportResult) {
  return {
    generated_at: new Date().toISOString(),
    platform: REPORT_PLATFORM,
    report_version: REPORT_VERSION,

    media: {
      filename: result.original_filename ?? "unknown",
      content_type: result.content_type ?? "unknown",
      file_size_bytes: result.file_size_bytes ?? 0,
    },

    analysis: {
      authenticity_score: result.authenticity_score ?? 0,
      risk_level: result.risk_level ?? "unknown",
      model_version: result.model_version ?? "unknown",
      signals: result.signals ?? [],
    },

    recommendation: DEFAULT_RECOMMENDATION,
  };
}

/**
 * Component
 * Provides downloadable JSON report of analysis result
 */
export default function DownloadReportButton({
  result,
}: DownloadReportButtonProps) {
  function downloadReport() {
    try {
      const reportData = buildReport(result);

      const blob = new Blob(
        [JSON.stringify(reportData, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `singularity-report-${getDateString()}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to download report. Please try again.");
    }
  }

  return (
    <button
      onClick={downloadReport}
      className="mt-6 w-full rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-6 py-4 font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
    >
      Download Verification Report
    </button>
  );
}
