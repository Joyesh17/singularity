"use client";

/**
 * Constants
 */
const HIGH_TRUST_THRESHOLD = 75;
const MEDIUM_TRUST_THRESHOLD = 45;

const RISK_HIGH = "High Risk";
const RISK_SUSPICIOUS = "Suspicious";
const RISK_REAL = "Likely Real";

/**
 * Types
 */
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

/**
 * Utility functions
 */
function getProgressBarClass(score: number): string {
  if (score >= HIGH_TRUST_THRESHOLD) return "bg-green-400";
  if (score >= MEDIUM_TRUST_THRESHOLD) return "bg-yellow-400";
  return "bg-red-400";
}

function getRiskBadgeClass(risk: string): string {
  if (risk === RISK_HIGH) {
    return "bg-red-500/20 text-red-300";
  }

  if (risk === RISK_SUSPICIOUS) {
    return "bg-yellow-500/20 text-yellow-300";
  }

  return "bg-green-500/20 text-green-300";
}

/**
 * Component
 * Displays scan analytics summary and history list
 */
export default function ScanHistory({
  history,
  onClear,
}: ScanHistoryProps) {
  if (!history || history.length === 0) {
    return null;
  }

  const totalScans = history.length;

  const averageScore = Math.round(
    history.reduce((sum, item) => {
      return sum + (item.authenticity_score || 0);
    }, 0) / totalScans
  );

  const highRiskCount = history.filter(
    (item) => item.risk_level === RISK_HIGH
  ).length;

  const suspiciousCount = history.filter(
    (item) => item.risk_level === RISK_SUSPICIOUS
  ).length;

  const realCount = history.filter(
    (item) => item.risk_level === RISK_REAL
  ).length;

  return (
    <div className="mt-14">
      {/* Analytics section */}
      <div className="mb-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-bold">
            Scan Analytics
          </h2>

          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            Local Intelligence Dashboard
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Scans" value={totalScans} highlight />

          <StatCard label="Average Score">
            {averageScore}
            <span className="text-cyan-300"> /100</span>
          </StatCard>

          <StatCard
            label="High Risk"
            value={highRiskCount}
            variant="danger"
          />

          <StatCard
            label="Suspicious"
            value={suspiciousCount}
            variant="warning"
          />
        </div>

        {/* Real summary */}
        <div className="mt-5 rounded-3xl border border-green-400/10 bg-green-500/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-widest text-green-200">
                Trusted Media
              </p>

              <h3 className="text-4xl font-black text-green-300">
                {realCount}
              </h3>
            </div>

            <p className="max-w-xl text-sm leading-7 text-green-50">
              Singularity tracks authenticity across uploaded media
              and provides insights into verification patterns.
            </p>
          </div>
        </div>
      </div>

      {/* History list */}
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
              key={`${item.filename}-${item.date}-${index}`}
              className="rounded-3xl border border-white/10 bg-white/4 p-6 transition hover:border-cyan-400/20"
            >
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {item.filename || "Unnamed file"}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {item.date}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${getRiskBadgeClass(
                      item.risk_level
                    )}`}
                  >
                    {item.risk_level}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      Authenticity
                    </p>

                    <p className="text-2xl font-black text-cyan-300">
                      {item.authenticity_score ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${getProgressBarClass(
                    item.authenticity_score
                  )}`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, item.authenticity_score || 0)
                    )}%`,
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

/**
 * Reusable stat card
 */
function StatCard({
  label,
  value,
  children,
  variant,
  highlight,
}: {
  label: string;
  value?: number;
  children?: React.ReactNode;
  variant?: "danger" | "warning";
  highlight?: boolean;
}) {
  const base =
    "rounded-3xl border p-6";

  const variantClass =
    variant === "danger"
      ? "border-red-400/10 bg-red-500/10 text-red-300"
      : variant === "warning"
      ? "border-yellow-400/10 bg-yellow-500/10 text-yellow-300"
      : highlight
      ? "border-white/10 bg-white/4 text-cyan-300"
      : "border-white/10 bg-white/4 text-white";

  return (
    <div className={`${base} ${variantClass}`}>
      <p className="mb-3 text-sm uppercase tracking-widest text-gray-400">
        {label}
      </p>

      <h3 className="text-4xl font-black">
        {children ?? value ?? 0}
      </h3>
    </div>
  );
}