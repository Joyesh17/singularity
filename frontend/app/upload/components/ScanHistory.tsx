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

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Scan History
        </h2>

        <button
          onClick={onClear}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {history.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/4 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">
                {item.filename}
              </h3>

              <span className="text-cyan-300 font-bold">
                {item.authenticity_score}/100
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{item.risk_level}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}