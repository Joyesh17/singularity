"use client";

interface Signal {
  name: string;
  risk: number;
  description: string;
}

interface SignalCardProps {
  signal: Signal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white">{signal.name}</h4>

        <span className="text-cyan-300 font-bold">{signal.risk}%</span>
      </div>

      <p className="text-sm text-gray-300 leading-6">{signal.description}</p>
    </div>
  );
}
