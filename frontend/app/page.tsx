export default function Home() {
  return (
    <main className="min-h-screen bg-[#050A14] text-white flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold mb-6">
          Singularity
        </h1>

        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
          AI-powered deepfake detection platform that verifies images, videos,
          and audio before misinformation spreads.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/upload"
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg"
          >
            Scan Media
          </a>

          <a
            href="/docs"
            className="border border-gray-500 hover:border-white px-6 py-3 rounded-lg"
          >
            View Docs
          </a>
        </div>
      </div>
    </main>
  );
}