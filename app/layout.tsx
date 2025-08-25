import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CraftMyResume - Professional ATS-Optimized Resume Writing Services",
  description:
    "Get a professional, ATS-optimized resume that lands interviews. 75%+ ATS score guaranteed. Expert writers, 48-hour delivery, cover letter included. Starting at ₹499.",
  keywords:
    "resume writing, ATS optimized resume, professional resume, CV writing, cover letter, LinkedIn optimization, job application, career services, resume maker, India",
  authors: [{ name: "CraftMyResume" }],
  creator: "CraftMyResume",
  publisher: "CraftMyResume",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://craftmyresume.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CraftMyResume - Professional ATS-Optimized Resume Writing Services",
    description:
      "Get a professional, ATS-optimized resume that lands interviews. 75%+ ATS score guaranteed. Expert writers, 48-hour delivery, cover letter included. Starting at ₹499.",
    url: "https://craftmyresume.com",
    siteName: "CraftMyResume",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CraftMyResume - Professional Resume Writing Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CraftMyResume - Professional ATS-Optimized Resume Writing Services",
    description:
      "Get a professional, ATS-optimized resume that lands interviews. 75%+ ATS score guaranteed. Expert writers, 48-hour delivery, cover letter included. Starting at ₹499.",
    images: ["/twitter-image.png"],
    creator: "@craftmyresume",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1258487649291772');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1258487649291772&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
