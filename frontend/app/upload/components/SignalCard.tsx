"use client";

/**
 * Thresholds for visual risk indication
 */
const HIGH_RISK_THRESHOLD = 75;
const MEDIUM_RISK_THRESHOLD = 40;

/**
 * Types
 */
interface Signal {
  name: string;
  risk: number;
  description: string;
}

interface SignalCardProps {
  signal: Signal;
}

/**
 * Utility
 */
function normalizePercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  return value <= 1 ? Math.round(value * 100) : Math.round(value);
}

function getRiskColorClass(value: number): string {
  if (value >= HIGH_RISK_THRESHOLD) {
    return "text-red-300";
  }
  if (value >= MEDIUM_RISK_THRESHOLD) {
    return "text-yellow-300";
  }
  return "text-green-300";
}

/**
 * Component
 * Displays a single model signal (probability / metric)
 */
export default function SignalCard({ signal }: SignalCardProps) {
  const riskValue = normalizePercent(signal.risk);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-white">
          {signal.name || "Unknown Signal"}
        </h4>

        <span
          className={`font-bold ${getRiskColorClass(riskValue)}`}
        >
          {riskValue}%
        </span>
      </div>

      <p className="text-sm leading-6 text-gray-300">
        {signal.description || "No description available."}
      </p>
    </div>
  );
}