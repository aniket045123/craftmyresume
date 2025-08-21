import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://craftmyresume.in"),
  title: {
    default: "CraftMyResume — ATS‑Optimized Resume Writing Service",
    template: "%s | CraftMyResume",
  },
  description:
    "Stand out with a high‑impact, ATS‑optimized resume. 75%+ ATS score guarantee, cover letter, and LinkedIn optimization included.",
  applicationName: "CraftMyResume",
  keywords: [
    "resume writing",
    "ATS resume",
    "LinkedIn optimization",
    "cover letter",
    "job search",
    "career",
    "SOP writing",
  ],
  authors: [{ name: "CraftMyResume" }],
  creator: "CraftMyResume",
  publisher: "CraftMyResume",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "CraftMyResume — ATS‑Optimized Resume Writing Service",
    siteName: "CraftMyResume",
    description:
      "Stand out with a high‑impact, ATS‑optimized resume. 75%+ ATS score guarantee, cover letter, and LinkedIn optimization included.",
    images: [
      {
        url: "/logo-header.png",
        width: 512,
        height: 512,
        alt: "CraftMyResume logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CraftMyResume — ATS‑Optimized Resume Writing Service",
    description:
      "Stand out with a high‑impact, ATS‑optimized resume. 75%+ ATS score guarantee, cover letter, and LinkedIn optimization included.",
    images: ["/logo-header.png"],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: ["/icon.png"],
  },
  themeColor: "#0f5b4f",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
