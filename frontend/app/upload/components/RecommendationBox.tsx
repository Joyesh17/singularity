"use client";

/**
 * Default recommendation message
 */
const DEFAULT_MESSAGE =
  "This media contains potentially suspicious signals. Verify authenticity before sharing publicly.";

/**
 * Types
 */
interface RecommendationBoxProps {
  message?: string;
}

/**
 * Component
 * Displays a recommendation / guidance message based on model output
 */
export default function RecommendationBox({
  message,
}: RecommendationBoxProps) {
  const displayMessage = message?.trim() || DEFAULT_MESSAGE;

  return (
    <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
      <p className="mb-2 text-xs uppercase tracking-widest text-cyan-200">
        AI Recommendation
      </p>

      <p className="leading-7 text-cyan-50">
        {displayMessage}
      </p>
    </div>
  );
}
