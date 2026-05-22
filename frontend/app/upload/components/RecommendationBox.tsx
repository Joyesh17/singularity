"use client";

interface RecommendationBoxProps {
  message?: string;
}

export default function RecommendationBox({
  message = "This media contains suspicious signals. Verify authenticity before sharing publicly.",
}: RecommendationBoxProps) {
  return (
    <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
      <p className="text-sm uppercase tracking-widest text-cyan-200 mb-2">
        AI Recommendation
      </p>

      <p className="text-cyan-50 leading-7">{message}</p>
    </div>
  );
}
