"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DemoSignal = {
  title: string;
  value: string;
};

type DemoResult = {
  label: string;
  prediction: "REAL" | "FAKE";
  confidence: number;
  realProbability: number;
  fakeProbability: number;
  badge: string;
  badgeClassName: string;
  predictionClassName: string;
  progressClassName: string;
  explanation: string;
  signals: DemoSignal[];
};

type Feature = {
  title: string;
  description: string;
};

const CONTACT_PHONE = "+880 1XXX-XXXXXX";

const demoResults: DemoResult[] = [
  {
    label: "Landscape Image Scan",
    prediction: "FAKE",
    confidence: 98,
    realProbability: 2,
    fakeProbability: 98,
    badge: "High Confidence",
    badgeClassName:
      "border border-red-400/20 bg-red-500/20 text-red-300",
    predictionClassName: "text-red-400",
    progressClassName: "bg-red-400",
    explanation:
      "Grad-CAM highlights sky gradients, lighting transitions, and texture regions that influenced the fake prediction.",
    signals: [
      {
        title: "AI Image Probability",
        value: "98%",
      },
      {
        title: "Model Confidence",
        value: "98%",
      },
      {
        title: "Grad-CAM",
        value: "Enabled",
      },
    ],
  },
  {
    label: "Camera Photo Scan",
    prediction: "REAL",
    confidence: 97,
    realProbability: 97,
    fakeProbability: 3,
    badge: "Likely Real",
    badgeClassName:
      "border border-green-400/20 bg-green-500/20 text-green-300",
    predictionClassName: "text-green-400",
    progressClassName: "bg-green-400",
    explanation:
      "The model identifies natural scene structure, photographic texture, and consistent visual details that support the real prediction.",
    signals: [
      {
        title: "Real Image Probability",
        value: "97%",
      },
      {
        title: "Model Confidence",
        value: "97%",
      },
      {
        title: "Grad-CAM",
        value: "Enabled",
      },
    ],
  },
  {
    label: "Suspicious Social Media Image",
    prediction: "FAKE",
    confidence: 91,
    realProbability: 9,
    fakeProbability: 91,
    badge: "Suspicious",
    badgeClassName:
      "border border-yellow-400/20 bg-yellow-500/20 text-yellow-300",
    predictionClassName: "text-yellow-300",
    progressClassName: "bg-yellow-400",
    explanation:
      "The system detects visual patterns that may indicate AI generation and recommends manual verification before sharing.",
    signals: [
      {
        title: "AI Image Probability",
        value: "91%",
      },
      {
        title: "Verification Risk",
        value: "Medium",
      },
      {
        title: "Grad-CAM",
        value: "Available",
      },
    ],
  },
  {
    label: "Verified Natural Image",
    prediction: "REAL",
    confidence: 94,
    realProbability: 94,
    fakeProbability: 6,
    badge: "Low Risk",
    badgeClassName:
      "border border-cyan-400/20 bg-cyan-500/20 text-cyan-300",
    predictionClassName: "text-cyan-300",
    progressClassName: "bg-cyan-400",
    explanation:
      "The model finds stronger evidence for real image structure than AI-generated artifacts.",
    signals: [
      {
        title: "Real Image Probability",
        value: "94%",
      },
      {
        title: "AI Image Probability",
        value: "6%",
      },
      {
        title: "Decision Support",
        value: "XAI",
      },
    ],
  },
];

const features: Feature[] = [
  {
    title: "Real vs AI Classification",
    description:
      "EfficientNet-based detection distinguishes real images from AI-generated content for MVP image verification.",
  },
  {
    title: "Confidence Scoring",
    description:
      "Each prediction includes real probability, fake probability, and model confidence for transparent interpretation.",
  },
  {
    title: "Grad-CAM Explainability",
    description:
      "Visual heatmaps highlight image regions that influenced the model decision.",
  },
];

function getRandomDemoResult(): DemoResult {
  const index = Math.floor(Math.random() * demoResults.length);
  return demoResults[index];
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050A14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-cyan-300 transition hover:text-cyan-200"
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

          <Link
            href="/history"
            className="transition hover:text-cyan-300"
          >
            Result History
          </Link>
        </nav>

        <Link
          href="/upload"
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
        >
          Launch Scanner
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050A14] px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-2xl font-black text-cyan-300">
            Singularity
          </h3>

          <p className="max-w-md leading-7 text-gray-400">
            An AI-powered fake image detection platform with confidence scoring
            and Grad-CAM explainability for responsible image verification.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">
            Quick Links
          </h4>

          <div className="space-y-3 text-gray-400">
            <Link
              href="/"
              className="block transition hover:text-cyan-300"
            >
              Home
            </Link>

            <Link
              href="/upload"
              className="block transition hover:text-cyan-300"
            >
              Scanner
            </Link>

            <Link
              href="/docs"
              className="block transition hover:text-cyan-300"
            >
              Documentation
            </Link>

            <Link
              href="/history"
              className="block transition hover:text-cyan-300"
            >
              Result History
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">
            Project Information
          </h4>

          <div className="space-y-3 text-gray-400">
            <p>Project: Singularity AI</p>
            <p>MVP Version: v1 Image Detector</p>
            <p>Contact: {CONTACT_PHONE}</p>
            <p>Location: Bangladesh</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 md:flex-row">
        <p>
          © {currentYear} Singularity AI. All rights reserved.
        </p>

        <p>
          MVP v1 focuses on Stable Diffusion-style fake image detection.
        </p>
      </div>
    </footer>
  );
}

function DemoPreviewCard({ demo }: { demo: DemoResult }) {
  return (
    <div className="relative">
      <div className="rounded-4xl border border-white/10 bg-white/4 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Live Demo Preview
            </p>

            <p className="mt-2 text-xl text-gray-300">
              {demo.label}
            </p>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${demo.badgeClassName}`}
          >
            {demo.badge}
          </div>
        </div>

        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm text-gray-400">
              Prediction
            </p>

            <h2 className={`text-5xl font-black ${demo.predictionClassName}`}>
              {demo.prediction}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">
              Confidence
            </p>

            <p className="text-3xl font-black text-white">
              {demo.confidence}%
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-400">
            <span>Model Confidence</span>
            <span>{demo.confidence}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${demo.progressClassName}`}
              style={{ width: `${demo.confidence}%` }}
            />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-400">
              Real Probability
            </p>

            <p className="mt-2 text-2xl font-bold text-green-300">
              {demo.realProbability}%
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-gray-400">
              Fake Probability
            </p>

            <p className="mt-2 text-2xl font-bold text-red-300">
              {demo.fakeProbability}%
            </p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          {demo.signals.map((signal) => (
            <div
              key={signal.title}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-white">
                  {signal.title}
                </h3>

                <span className="font-bold text-cyan-300">
                  {signal.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
          <p className="mb-2 text-xs uppercase tracking-widest text-cyan-200">
            Explainability
          </p>

          <p className="text-sm leading-6 text-cyan-50">
            {demo.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [demo, setDemo] = useState<DemoResult>(demoResults[0]);

  useEffect(() => {
    setDemo(getRandomDemoResult());
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050A14] text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <Header />

      <section className="px-6 pb-32 pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              AI Deepfake Image Detection System
            </div>

            <h1 className="mb-8 text-6xl font-black leading-tight md:text-7xl">
              Detect AI Images
              <span className="block text-cyan-300">
                Instantly & Explainably
              </span>
            </h1>

            <p className="mb-4 max-w-2xl text-lg leading-9 text-gray-300">
              Upload an image and determine whether it is real or AI-generated.
              Singularity combines deep learning, probability scoring, and
              Grad-CAM explainability to make image verification more
              transparent.
            </p>

            <p className="mb-10 text-sm font-medium text-cyan-300">
              Model: EfficientNet-B0 · MVP v1 image detector
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/upload"
                className="rounded-2xl bg-cyan-400 px-8 py-4 text-lg font-semibold text-black transition hover:bg-cyan-300"
              >
                Start Detection
              </Link>

              <Link
                href="/docs"
                className="rounded-2xl border border-white/10 bg-white/4 px-8 py-4 text-lg font-semibold transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
              >
                Read Documentation
              </Link>
            </div>
          </div>

          <DemoPreviewCard demo={demo} />
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <p className="mb-5 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Key Capabilities
            </p>

            <h2 className="text-5xl font-black leading-tight">
              Built for
              <span className="block text-cyan-300">
                real-time AI detection
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/4 p-8 transition hover:border-cyan-400/40 hover:bg-cyan-400/4"
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

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-cyan-400/20 bg-cyan-400/10 p-12 text-center md:p-16">
          <p className="mb-5 text-sm uppercase tracking-[0.3em] text-cyan-300">
            Try It Now
          </p>

          <h2 className="mb-8 text-5xl font-black leading-tight">
            Analyze images with
            <span className="block text-cyan-300">
              AI-powered detection
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-9 text-cyan-50">
            Upload any image and instantly get a real/fake prediction,
            confidence score, probability breakdown, and visual explanation.
          </p>

          <Link
            href="/upload"
            className="inline-flex rounded-2xl bg-cyan-400 px-10 py-5 text-lg font-semibold text-black transition hover:bg-cyan-300"
          >
            Open Scanner
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}