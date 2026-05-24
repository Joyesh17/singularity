import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050A14] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050A14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-cyan-300"
          >
            Singularity
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            <Link
              href="/docs"
              className="transition hover:text-cyan-300"
            >
              Documentation
            </Link>

            <Link
              href="/upload"
              className="transition hover:text-cyan-300"
            >
              Scanner
            </Link>
          </nav>

          <Link
            href="/upload"
            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pb-32 pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              AI BuildFest 2026 Project
            </div>

            <h1 className="mb-8 text-6xl font-black leading-tight md:text-7xl">
              Detect Deepfakes
              <span className="block text-cyan-300">
                Before They Spread
              </span>
            </h1>

            <p className="mb-10 max-w-2xl text-lg leading-9 text-gray-300">
              Singularity is an AI-powered media verification platform
              designed to analyze suspicious images, videos, and audio
              using forensic-style analysis, authenticity scoring, and
              explainable AI signals.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/upload"
                className="rounded-2xl bg-cyan-400 px-8 py-4 text-lg font-semibold text-black transition hover:bg-cyan-300"
              >
                Start Scanning
              </Link>

              <Link
                href="/docs"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-lg font-semibold transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
              >
                Explore Docs
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
              {/* Score Header */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm text-gray-400">
                    Authenticity Score
                  </p>

                  <h2 className="text-6xl font-black text-cyan-300">
                    72
                    <span className="text-white">/100</span>
                  </h2>
                </div>

                <div className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-300">
                  Suspicious
                </div>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="mb-3 flex justify-between text-sm text-gray-400">
                  <span>Trust Analysis</span>
                  <span>72%</span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-yellow-400" />
                </div>
              </div>

              {/* Signal Cards */}
              <div className="space-y-4">
                {[
                  {
                    title: "Metadata Consistency",
                    risk: "34%",
                  },
                  {
                    title: "Compression Analysis",
                    risk: "61%",
                  },
                  {
                    title: "Visual Artifact Detection",
                    risk: "72%",
                  },
                ].map((signal, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">
                        {signal.title}
                      </h3>

                      <span className="font-bold text-cyan-300">
                        {signal.risk}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{
                          width: signal.risk,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <p className="mb-2 text-xs uppercase tracking-widest text-cyan-200">
                  AI Recommendation
                </p>

                <p className="leading-7 text-cyan-50">
                  This media contains suspicious manipulation indicators.
                  Verify authenticity before sharing publicly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <p className="mb-5 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Platform Features
            </p>

            <h2 className="text-5xl font-black leading-tight">
              Built for modern
              <span className="block text-cyan-300">
                media verification
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Authenticity Scoring",
                description:
                  "Dynamic forensic-style authenticity scoring for suspicious media.",
              },
              {
                title: "Forensic Signals",
                description:
                  "Analyze metadata, compression artifacts, and suspicious media patterns.",
              },
              {
                title: "Verification Reports",
                description:
                  "Download structured verification reports instantly.",
              },
              {
                title: "Persistent History",
                description:
                  "Track previous scans with persistent local scan history.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.03]"
              >
                <h3 className="mb-5 text-2xl font-semibold">
                  {feature.title}
                </h3>

                <p className="leading-8 text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-cyan-400/20 bg-cyan-400/10 p-12 text-center md:p-16">
          <p className="mb-5 text-sm uppercase tracking-[0.3em] text-cyan-300">
            Start Verifying
          </p>

          <h2 className="mb-8 text-5xl font-black leading-tight">
            Experience AI-powered
            <span className="block text-cyan-300">
              media trust analysis
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-9 text-cyan-50">
            Upload suspicious media, analyze forensic signals,
            generate authenticity reports, and explore the future
            of explainable AI-powered verification.
          </p>

          <Link
            href="/upload"
            className="inline-flex rounded-2xl bg-cyan-400 px-10 py-5 text-lg font-semibold text-black transition hover:bg-cyan-300"
          >
            Open Scanner
          </Link>
        </div>
      </section>
    </main>
  );
}