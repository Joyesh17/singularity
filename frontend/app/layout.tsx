import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Global fonts
 */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

/**
 * Global metadata
 * Critical for branding, SEO, and hackathon presentation
 */
export const metadata: Metadata = {
  title: "Singularity AI — Fake Image Detection Platform",
  description:
    "Singularity is an AI-powered platform for detecting fake and AI-generated images using deep learning and explainable AI (Grad-CAM).",

  applicationName: "Singularity AI",

  keywords: [
    "AI",
    "Deepfake detection",
    "Image authenticity",
    "Computer vision",
    "Machine learning",
    "Grad-CAM",
    "Fake image detection",
  ],

  authors: [
    { name: "Singularity AI Team" },
  ],

  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * Root layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-[#050A14] text-white antialiased">
        {children}
      </body>
    </html>
  );
}