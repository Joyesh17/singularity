"use client";

interface DownloadReportButtonProps {
  result: any;
}

export default function DownloadReportButton({
  result,
}: DownloadReportButtonProps) {
  function downloadReport() {
    const reportData = {
      generated_at: new Date().toISOString(),
      platform: "Singularity",
      report_version: "1.0",

      media: {
        filename: result.original_filename,
        content_type: result.content_type,
        file_size_bytes: result.file_size_bytes,
      },

      analysis: {
        authenticity_score: result.authenticity_score,
        risk_level: result.risk_level,
        model_version: result.model_version,
        signals: result.signals || [],
      },

      recommendation:
        "Verify authenticity before sharing publicly.",
    };

    const jsonString = JSON.stringify(reportData, null, 2);

    const blob = new Blob([jsonString], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `singularity-report-${Date.now()}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
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