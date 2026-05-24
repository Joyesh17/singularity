export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#050A14] text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="mb-20">
          <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm mb-4">
            Singularity Documentation
          </p>

          <h1 className="text-6xl font-bold mb-8 leading-tight">
            AI-Powered Deepfake Detection &
            <span className="text-cyan-300"> Media Verification</span>
          </h1>

          <p className="text-xl text-gray-300 leading-9 max-w-4xl">
            Singularity is a modern AI-powered media verification platform
            designed to detect suspicious images, videos, and audio before
            misinformation spreads across social media ecosystems.
          </p>
        </div>

        {/* Problem + Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-semibold mb-5">
              Problem
            </h2>

            <p className="text-gray-300 leading-8">
              Modern generative AI tools can create highly realistic fake media,
              making misinformation increasingly difficult to identify. Most
              users lack accessible tools to verify authenticity before sharing
              content online.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-semibold mb-5">
              Solution
            </h2>

            <p className="text-gray-300 leading-8">
              Singularity provides a lightweight forensic analysis pipeline that
              analyzes uploaded media, generates authenticity scores, detects
              suspicious signals, and exports verification reports through a
              modern full-stack platform.
            </p>
          </section>
        </div>

        {/* Features */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-10">
            Core Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Image Upload & Analysis",
              "Video & Audio Verification",
              "Authenticity Score Engine",
              "Dynamic Risk Classification",
              "Forensic Signal Detection",
              "Verification Report Export",
              "Persistent Scan History",
              "Modern Cybersecurity Dashboard",
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-lg text-cyan-200">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-10">
            System Architecture
          </h2>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 overflow-x-auto">
            <pre className="text-sm text-cyan-100 leading-8">
{`
┌────────────────────┐
│     Frontend       │
│ Next.js + Tailwind │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│    Upload API      │
│      FastAPI       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Detection Pipeline │
│ Metadata Analysis  │
│ Signal Generation  │
│ Risk Scoring       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Result Dashboard   │
│ Reports + History  │
└────────────────────┘
`}
            </pre>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-10">
            Technology Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">
                Frontend
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">
                Backend
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>FastAPI</li>
                <li>Python</li>
                <li>Pydantic</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">
                Analysis Layer
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>Metadata Inspection</li>
                <li>Signal Scoring</li>
                <li>Dynamic Risk Engine</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detection Pipeline */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-10">
            Detection Pipeline
          </h2>

          <div className="space-y-6">
            {[
              {
                title: "1. Media Upload",
                description:
                  "Users upload image, video, or audio files through the secure upload interface.",
              },
              {
                title: "2. Validation Layer",
                description:
                  "The backend validates file type, file size, and supported media formats.",
              },
              {
                title: "3. Forensic Analysis",
                description:
                  "Metadata analysis, compression analysis, and visual signal scoring are performed.",
              },
              {
                title: "4. Authenticity Scoring",
                description:
                  "Weighted scoring logic generates a dynamic authenticity score and risk classification.",
              },
              {
                title: "5. Result Generation",
                description:
                  "The platform generates detected signals, recommendations, and exportable reports.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="text-2xl font-semibold mb-3 text-cyan-300">
                  {step.title}
                </h3>

                <p className="text-gray-300 leading-8">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Responsible AI */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-10">
            Responsible AI Statement
          </h2>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
            <p className="text-cyan-50 leading-9">
              Singularity is designed to support responsible media verification
              and reduce misinformation risks. The platform currently uses a
              lightweight forensic scoring engine and does not claim perfect
              detection accuracy. Future versions may integrate hosted AI models
              and advanced multimodal analysis pipelines.
            </p>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-10">
          <h2 className="text-4xl font-bold mb-10">
            Future Roadmap
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Hosted AI model integration",
              "Advanced deepfake heatmaps",
              "Video frame forensic analysis",
              "Audio waveform verification",
              "OCR-based misinformation detection",
              "Verification browser extension",
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-gray-200">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}