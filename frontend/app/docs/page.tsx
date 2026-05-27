// #Start
import Link from "next/link";

function Header() {
  return (
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

          <Link
            href="/upload#scan-history"
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
            An AI-powered fake image detection platform with confidence scoring,
            scan history, and Grad-CAM explainability for responsible image
            verification.
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
              href="/upload#scan-history"
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
            <p>Contact: +880 1XXX-XXXXXX</p>
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

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#050A14] text-white">
      <Header />

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <section className="mb-20 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
            Singularity Documentation
          </p>

          <h1 className="mx-auto mb-8 max-w-5xl text-5xl font-black leading-tight md:text-6xl">
            Explainable AI-Powered
            <span className="block text-cyan-300">
              Fake Image Detection
            </span>
          </h1>

          <p className="mx-auto max-w-4xl text-xl leading-9 text-gray-300">
            Singularity is an AI-powered media verification platform. In MVP
            Version 1, the system focuses on image-based fake media detection:
            users upload an image, the backend predicts whether the image is
            likely real or AI-generated, and the interface provides confidence
            scores with Grad-CAM visual explainability.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/upload"
              className="rounded-2xl bg-cyan-400 px-7 py-4 font-semibold text-black transition hover:bg-cyan-300"
            >
              Open Scanner
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 font-semibold transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
            >
              Back to Home
            </Link>
          </div>
        </section>

        {/* Current MVP Summary */}
        <section className="mb-20 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
            Current MVP Status
          </p>

          <h2 className="mb-5 text-4xl font-bold">
            MVP v1: Image Detection + Grad-CAM
          </h2>

          <p className="mx-auto max-w-4xl leading-9 text-cyan-50">
            The current version of Singularity is a working end-to-end image
            detection system. It uses a trained EfficientNet-B0 deep learning
            model to classify uploaded images as likely real or AI-generated.
            The result page shows the final prediction, confidence score, real
            probability, fake probability, detected signals, scan history, and a
            Grad-CAM heatmap explaining which image regions influenced the
            model&apos;s decision.
          </p>
        </section>

        {/* Problem + Solution */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Motivation
            </p>

            <h2 className="text-4xl font-bold">
              Problem and Solution
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <h3 className="mb-5 text-center text-3xl font-semibold">
                Problem
              </h3>

              <p className="leading-8 text-gray-300">
                Generative AI tools can now create highly realistic synthetic
                images. These images can be used in misinformation, fake social
                media posts, manipulated news content, fraud attempts, and
                impersonation scenarios. Most users do not have an accessible
                way to check whether an image is real or AI-generated before
                sharing it.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <h3 className="mb-5 text-center text-3xl font-semibold">
                Solution
              </h3>

              <p className="leading-8 text-gray-300">
                Singularity provides a practical image verification workflow. A
                user uploads an image, the backend runs a deep learning model,
                the system returns a real/fake prediction with probabilities,
                and Grad-CAM visualizes the regions that influenced the
                prediction. This makes the output more transparent than a plain
                label.
              </p>
            </div>
          </div>
        </section>

        {/* Why Image-Only MVP */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Scope Justification
            </p>

            <h2 className="text-4xl font-bold">
              Why MVP v1 Focuses Only on Images
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="mb-6 leading-8 text-gray-300">
              Deepfake detection across image, video, and audio is a large
              multimodal problem. Building all three modalities at once would
              require separate datasets, separate models, different evaluation
              metrics, and more compute. For MVP v1, Singularity intentionally
              focuses on fake image detection because image detection allows the
              system to be completed properly end-to-end: dataset creation,
              model training, evaluation, backend inference, frontend
              integration, and explainability.
            </p>

            <p className="leading-8 text-gray-300">
              This scoped approach makes the MVP realistic, demonstrable, and
              extensible. Instead of presenting an unfinished multimodal system,
              Singularity v1 delivers one complete and working AI pipeline for
              image verification. Video and audio detection are planned for
              future versions after the image detection foundation becomes more
              robust.
            </p>
          </div>
        </section>

        {/* Core Features */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Features
            </p>

            <h2 className="text-4xl font-bold">
              Core Features in MVP v1
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Image Upload & Preview",
                description:
                  "Users can upload an image through a drag-and-drop interface and preview it before analysis.",
              },
              {
                title: "Real/Fake Classification",
                description:
                  "The backend classifies the image as likely real or AI-generated using the trained EfficientNet-B0 model.",
              },
              {
                title: "Confidence Score",
                description:
                  "The system returns model confidence, real probability, and fake probability for transparent interpretation.",
              },
              {
                title: "Authenticity Score",
                description:
                  "The UI converts model output into a user-friendly authenticity score and risk level.",
              },
              {
                title: "Grad-CAM Explainability",
                description:
                  "A heatmap is generated to show which image regions influenced the predicted class.",
              },
              {
                title: "Scan History",
                description:
                  "Recent scan results are stored locally so users can review previous predictions.",
              },
              {
                title: "Detected Signals",
                description:
                  "The result view summarizes AI probability, real probability, model confidence, and Grad-CAM availability as explanation signals.",
              },
              {
                title: "Report Export",
                description:
                  "The frontend can export structured result data for documentation or review.",
              },
              {
                title: "Backend API",
                description:
                  "FastAPI exposes a /predict endpoint that accepts images and returns prediction results with Grad-CAM paths.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
              >
                <h3 className="mb-4 text-xl font-semibold text-cyan-200">
                  {feature.title}
                </h3>

                <p className="leading-7 text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Model Justification */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Technical Justification
            </p>

            <h2 className="text-4xl font-bold">
              Model Choice and Justification
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <h3 className="mb-4 text-center text-2xl font-semibold text-cyan-300">
                EfficientNet-B0
              </h3>

              <p className="leading-8 text-gray-300">
                Singularity MVP v1 uses EfficientNet-B0 as the image detection
                backbone. The model is lightweight, fast enough for local or
                server-side inference, and strong enough for binary image
                classification. This makes EfficientNet-B0 suitable for a
                practical MVP where the backend must return predictions quickly
                after an image upload.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <h3 className="mb-4 text-center text-2xl font-semibold text-cyan-300">
                Transfer Learning
              </h3>

              <p className="leading-8 text-gray-300">
                The model was fine-tuned for binary classification with two
                classes: real and fake. Transfer learning reduces the amount of
                data and compute required compared with training a model from
                scratch. This approach is appropriate for the MVP because it
                allows the project to reach a functional and demonstrable state
                within limited compute resources.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <h3 className="mb-4 text-center text-2xl font-semibold text-cyan-300">
                Grad-CAM Explainability
              </h3>

              <p className="leading-8 text-gray-300">
                Grad-CAM was added so the system does not only return a label.
                The heatmap highlights regions that contributed to the
                predicted class. This makes the prediction easier to inspect and
                explain during a demo. The heatmap should be interpreted as
                attention evidence, not as pixel-level forensic proof.
              </p>
            </div>
          </div>
        </section>

        {/* Dataset */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Training Data
            </p>

            <h2 className="text-4xl font-bold">
              MVP v1 Dataset
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="mb-6 leading-8 text-gray-300">
              The MVP v1 dataset was built as a balanced image classification
              dataset with real images and AI-generated fake images. The real
              images came from an ImageNet-style photographic subset, while the
              fake images were generated using Stable Diffusion v1.5 prompts.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <h3 className="mb-4 text-xl font-semibold text-green-300">
                  Training Split
                </h3>

                <ul className="space-y-3 text-gray-300">
                  <li>2,000 real images</li>
                  <li>2,000 AI-generated fake images</li>
                  <li>Total training images: 4,000</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <h3 className="mb-4 text-xl font-semibold text-cyan-300">
                  Validation Split
                </h3>

                <ul className="space-y-3 text-gray-300">
                  <li>500 real images</li>
                  <li>500 AI-generated fake images</li>
                  <li>Total validation images: 1,000</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Performance */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Evaluation
            </p>

            <h2 className="text-4xl font-bold">
              Current MVP Performance
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="mb-8 text-center leading-8 text-gray-300">
              On the validation split used for MVP v1, the model achieved very
              strong performance. These numbers demonstrate that the system is
              working well on the current real-vs-Stable-Diffusion task.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[
                {
                  label: "Accuracy",
                  value: "99.8%",
                },
                {
                  label: "Precision",
                  value: "99.8%",
                },
                {
                  label: "Recall",
                  value: "99.8%",
                },
                {
                  label: "F1 Score",
                  value: "99.8%",
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-center"
                >
                  <p className="mb-2 text-sm uppercase tracking-widest text-cyan-300">
                    {metric.label}
                  </p>

                  <p className="text-4xl font-black">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-6">
              <p className="mb-2 text-center font-semibold text-yellow-300">
                Important Evaluation Note
              </p>

              <p className="leading-8 text-yellow-50">
                The MVP v1 validation set is in-distribution: it compares real
                photographic images with Stable Diffusion v1.5 generated fake
                images. The model performs very well on this task, but it should
                not yet be claimed as a universal detector for all generators.
                Testing on StyleGAN, DALL·E, Midjourney, and other generators
                is planned for MVP v2.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Architecture
            </p>

            <h2 className="text-4xl font-bold">
              System Architecture
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <div className="flex justify-center">
              <pre className="inline-block text-left text-sm leading-8 text-cyan-100">
{`
┌──────────────────────────┐
│        Frontend          │
│   Next.js + TypeScript   │
│   Tailwind CSS UI        │
└────────────┬─────────────┘
             │
             │ image upload
             ▼
┌──────────────────────────┐
│        FastAPI           │
│      POST /predict       │
└────────────┬─────────────┘
             │
             │ preprocessing
             ▼
┌──────────────────────────┐
│   EfficientNet-B0 Model  │
│   real/fake prediction   │
│   probability output     │
└────────────┬─────────────┘
             │
             │ explanation
             ▼
┌──────────────────────────┐
│        Grad-CAM          │
│   heatmap visualization  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Result Dashboard    │
│ prediction + confidence  │
│ signals + scan history   │
└──────────────────────────┘
`}
              </pre>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Implementation
            </p>

            <h2 className="text-4xl font-bold">
              Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold text-cyan-300">
                Frontend
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Local scan history</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold text-cyan-300">
                Backend
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>FastAPI</li>
                <li>Python</li>
                <li>Uvicorn</li>
                <li>Multipart image upload</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold text-cyan-300">
                AI Layer
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>PyTorch</li>
                <li>TorchVision</li>
                <li>EfficientNet-B0</li>
                <li>Grad-CAM</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detection Pipeline */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Workflow
            </p>

            <h2 className="text-4xl font-bold">
              Detection Pipeline
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "1. Image Upload",
                description:
                  "The user uploads an image through the scanner interface. MVP v1 intentionally supports image input only.",
              },
              {
                title: "2. Backend Validation",
                description:
                  "The FastAPI backend validates the image file and stores it temporarily in the local storage directory.",
              },
              {
                title: "3. Image Preprocessing",
                description:
                  "The image is converted to RGB, resized to 224×224, normalized using ImageNet statistics, and converted into a tensor.",
              },
              {
                title: "4. Model Prediction",
                description:
                  "EfficientNet-B0 predicts real and fake probabilities. The class with the higher probability becomes the final prediction.",
              },
              {
                title: "5. Grad-CAM Explanation",
                description:
                  "Grad-CAM generates a heatmap showing which regions contributed to the predicted class.",
              },
              {
                title: "6. Result Rendering",
                description:
                  "The frontend displays authenticity score, risk level, probability signals, Grad-CAM image, recommendation, and scan history.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center"
              >
                <h3 className="mb-3 text-2xl font-semibold text-cyan-300">
                  {step.title}
                </h3>

                <p className="leading-8 text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Grad-CAM Interpretation */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Explainability
            </p>

            <h2 className="text-4xl font-bold">
              How to Interpret Grad-CAM
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="mb-6 leading-8 text-gray-300">
              Grad-CAM highlights image regions that contributed strongly to
              the model&apos;s predicted class. If the prediction is fake, the
              heatmap shows regions that supported the fake classification. If
              the prediction is real, the heatmap shows regions that supported
              the real classification.
            </p>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-6">
              <p className="mb-2 text-center font-semibold text-yellow-300">
                Interpretation Warning
              </p>

              <p className="leading-8 text-yellow-50">
                Red or yellow areas do not automatically mean “fake artifacts.”
                They mean high relative contribution to the displayed class.
                Grad-CAM should be used as explanation evidence, not as
                pixel-level forensic proof.
              </p>
            </div>
          </div>
        </section>

        {/* Responsible AI */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Responsible AI
            </p>

            <h2 className="text-4xl font-bold">
              Responsible AI Statement
            </h2>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
            <p className="mx-auto max-w-4xl leading-9 text-cyan-50">
              Singularity is designed to support responsible media verification
              and reduce misinformation risk. The system should not be treated
              as a perfect truth oracle. It provides AI-assisted evidence,
              confidence scores, and explanations to help users make more
              informed decisions. Critical or high-impact media should still be
              verified through trusted sources and additional forensic review.
            </p>
          </div>
        </section>

        {/* MVP v2 Roadmap */}
        <section className="mb-10">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Roadmap
            </p>

            <h2 className="text-4xl font-bold">
              MVP v2 Roadmap
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="mb-8 text-center leading-8 text-gray-300">
              Testing showed that the MVP v1 model is strongest on Stable
              Diffusion-style images and may not generalize reliably to all
              generators such as StyleGAN or DALL·E. MVP v2 will improve
              generalization by using a multi-generator training and validation
              split.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <h3 className="mb-4 text-xl font-semibold text-cyan-300">
                  Planned Training Set
                </h3>

                <ul className="space-y-3 text-gray-300">
                  <li>2,500 real images</li>
                  <li>1,200 Stable Diffusion images</li>
                  <li>400 StyleGAN images</li>
                  <li>450 DALL·E images</li>
                  <li>450 Midjourney images</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <h3 className="mb-4 text-xl font-semibold text-cyan-300">
                  Planned Validation Set
                </h3>

                <ul className="space-y-3 text-gray-300">
                  <li>600 real images</li>
                  <li>300 Stable Diffusion images</li>
                  <li>100 StyleGAN images</li>
                  <li>100 DALL·E images</li>
                  <li>100 Midjourney images</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                "Multi-generator fake image detection",
                "Cross-generator evaluation",
                "Larger external holdout testing",
                "Improved Grad-CAM comparison views",
                "Video frame-level detection",
                "Audio deepfake detection",
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center"
                >
                  <p className="text-gray-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
// #Finish