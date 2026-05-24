"use client";

type ScanHistoryItem = {
  filename: string;
  authenticity_score: number;
  risk_level: string;
  date: string;
};

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onClear: () => void;
}

export default function ScanHistory({
  history,
  onClear,
}: ScanHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  const totalScans = history.length;

  const averageScore = Math.round(
    history.reduce(
      (sum, item) => sum + item.authenticity_score,
      0
    ) / totalScans
  );

  const highRiskCount = history.filter(
    (item) => item.risk_level === "High Risk"
  ).length;

  const suspiciousCount = history.filter(
    (item) => item.risk_level === "Suspicious"
  ).length;

  const authenticCount = history.filter(
    (item) =>
      item.risk_level === "Likely Authentic"
  ).length;

  return (
    <div className="mt-14">
      {/* Analytics Dashboard */}
      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Scan Analytics
          </h2>

          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            Local Intelligence Dashboard
          </div>
        </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Total Scans */}
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
            <p className="mb-3 text-sm uppercase tracking-widest text-gray-400">
              Total Scans
            </p>

            <h3 className="text-4xl font-black text-cyan-300">
              {totalScans}
            </h3>
          </div>

          {/* Average Score */}
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
            <p className="mb-3 text-sm uppercase tracking-widest text-gray-400">
              Average Score
            </p>

            <h3 className="text-4xl font-black text-white">
              {averageScore}
              <span className="text-cyan-300">
                /100
              </span>
            </h3>
          </div>

          {/* High Risk */}
          <div className="rounded-3xl border border-red-400/10 bg-red-500/10 p-6">
            <p className="mb-3 text-sm uppercase tracking-widest text-red-200">
              High Risk
            </p>

            <h3 className="text-4xl font-black text-red-300">
              {highRiskCount}
            </h3>
          </div>

          {/* Suspicious */}
          <div className="rounded-3xl border border-yellow-400/10 bg-yellow-500/10 p-6">
            <p className="mb-3 text-sm uppercase tracking-widest text-yellow-200">
              Suspicious
            </p>

            <h3 className="text-4xl font-black text-yellow-300">
              {suspiciousCount}
            </h3>
          </div>
        </div>

        {/* Authentic Summary */}
        <div className="mt-5 rounded-3xl border border-green-400/10 bg-green-500/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-widest text-green-200">
                Trusted Media
              </p>

              <h3 className="text-4xl font-black text-green-300">
                {authenticCount}
              </h3>
            </div>

            <div className="max-w-xl text-sm leading-7 text-green-50">
              Singularity continuously analyzes uploaded media and
              tracks forensic authenticity patterns across all scans.
            </div>
          </div>
        </div>
      </div>

      {/* Scan History */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Scan History
          </h2>

          <button
            onClick={onClear}
            className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
          >
            Clear History
          </button>
        </div>

        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/4 p-6 transition hover:border-cyan-400/20"
            >
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {item.filename}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {item.date}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      item.risk_level === "High Risk"
                        ? "bg-red-500/20 text-red-300"
                        : item.risk_level ===
                          "Suspicious"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {item.risk_level}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      Authenticity
                    </p>

                    <p className="text-2xl font-black text-cyan-300">
                      {item.authenticity_score}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${
                    item.authenticity_score >= 75
                      ? "bg-green-400"
                      : item.authenticity_score >= 45
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                  style={{
                    width: `${item.authenticity_score}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}