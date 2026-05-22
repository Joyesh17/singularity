export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#050A14] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm mb-4">
          Singularity Docs
        </p>

        <h1 className="text-5xl font-bold mb-6">
          AI Deepfake Detection Platform
        </h1>

        <p className="text-lg text-gray-300 leading-8 mb-12">
          Singularity is an AI-powered media verification platform designed to
          detect suspicious images, videos, and audio before misinformation spreads.
        </p>

        <div className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/4 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              Problem
            </h2>

            <p className="text-gray-300 leading-7">
              Generative AI tools make it easy to create realistic fake media,
              while most users cannot verify authenticity before sharing content online.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/4 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              Solution
            </h2>

            <p className="text-gray-300 leading-7">
              Singularity analyzes uploaded media using AI models, metadata inspection,
              and forensic signals to generate an explainable Authenticity Score.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/4 p-6">
            <h2 className="text-2xl font-semibold mb-3">
              MVP Features
            </h2>

            <ul className="list-disc list-inside text-gray-300 leading-8">
              <li>Image upload and analysis</li>
              <li>Video upload workflow</li>
              <li>Authenticity scoring</li>
              <li>Risk explanation dashboard</li>
              <li>Verification reports</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}