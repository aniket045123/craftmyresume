"use client"

import { CardDescription } from "@/components/ui/card"
import SeoHomeJsonLd from "@/components/seo/home-jsonld"

import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Montserrat } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  FileText,
  Menu,
  CheckCircle2,
  Cpu,
  Briefcase,
  Package2,
  Star,
  Instagram,
  Linkedin,
  ArrowUp,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Quote,
  ShieldCheck,
  XCircle,
  ZoomIn,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import HowItWorksInteractive from "@/components/how-it-works"
import OfferOverlay from "@/components/offer-overlay"

const montserrat = Montserrat({ subsets: ["latin"] })

const COLORS = {
  EMERALD: "#0f5b4f",
  GOLD: "#d4af37",
  BEIGE: "#f5efe0",
}

type PlanKey = "Resume Package" | "LinkedIn Optimization" | "SOP Writing Services"

export default function Page() {
  const [contactOpen, setContactOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { toast } = useToast()

  const handleOpenContact = useCallback((plan?: PlanKey) => {
    if (plan) setSelectedPlan(plan)
    setContactOpen(true)
  }, [])

  const handleSmoothScroll = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const heroPatternStyle = useMemo(() => {
    const dot = "rgba(255,255,255,0.06)"
    return {
      backgroundColor: COLORS.EMERALD,
      backgroundImage: `
radial-gradient(circle at 25px 25px, ${dot} 2px, transparent 2px),
radial-gradient(circle at 75px 75px, ${dot} 2px, transparent 2px)
`,
      backgroundSize: "100px 100px",
    } as React.CSSProperties
  }, [])

  return (
    <div className={`${montserrat.className} antialiased`} style={{ backgroundColor: "white" }}>
      <SeoHomeJsonLd />
      {/* Top Banner */}
      <div
        className="w-full text-center py-2 text-xs sm:text-sm tracking-widest font-semibold"
        style={{ backgroundColor: COLORS.GOLD, color: COLORS.EMERALD }}
        role="note"
        aria-label="Limited Time Offer @ Rs. 499/- Only"
      >
        Limited Time Offer @ Rs. 499/- Only
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur supports-[backdrop-filter]:bg-white/70"
        style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "rgba(15,91,79,0.15)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="#hero" className="flex items-center gap-2" aria-label="CraftMyResume - Home">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CMR%20logo-4OJnOaIoHqu4k38n9Gn9mFzONhZJNr.png"
                alt="CraftMyResume logo"
                className="h-7 sm:h-8 w-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "About", id: "about" },
              { label: "Packages", id: "packages" },
              { label: "How It Works", id: "process" },
              { label: "Why Choose", id: "why-choose" },
              { label: "ATS Friendly", id: "ats-friendly" },
              { label: "Before/After", id: "before-after" },
              { label: "FAQ", id: "faq" },
            ].map((l) => (
              <button
                key={l.id}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: COLORS.EMERALD }}
                onClick={() => handleSmoothScroll(l.id)}
              >
                {l.label}
              </button>
            ))}
          </nav>
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" aria-label="Open menu">
                  <Menu className="h-5 w-5" style={{ color: COLORS.EMERALD }} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" style={{ backgroundColor: "white" }}>
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CMR%20logo-4OJnOaIoHqu4k38n9Gn9mFzONhZJNr.png"
                        alt="CraftMyResume logo"
                        className="h-6 w-auto"
                      />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {[
                    { label: "About", id: "about" },
                    { label: "Packages", id: "packages" },
                    { label: "How It Works", id: "process" },
                    { label: "Why Choose", id: "why-choose" },
                    { label: "ATS Friendly", id: "ats-friendly" },
                    { label: "Before/After", id: "before-after" },
                    { label: "FAQ", id: "faq" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      className="text-base font-medium text-left"
                      style={{ color: COLORS.EMERALD }}
                      onClick={() => handleSmoothScroll(l.id)}
                    >
                      {l.label}
                    </button>
                  ))}
                  <Separator />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="hero" aria-labelledby="hero-heading" style={heroPatternStyle} className="py-20 md:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
              <div className="lg:col-span-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="h-6 w-6" color={COLORS.GOLD} aria-hidden="true" />
                  <span className="text-sm uppercase tracking-widest font-semibold" style={{ color: COLORS.BEIGE }}>
                    High-Impact ATS-Optimized Resumes
                  </span>
                </div>
                <h1
                  id="hero-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight text-white"
                >
                  {"Stand Out with a High-Impact ATS – Optimized Resume"}
                </h1>
                <p className="mt-5 text-base sm:text-lg md:text-xl" style={{ color: COLORS.BEIGE }}>
                  {"At Craft My Resume, we create resumes that are:"}
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Guaranteed 75%+ ATS Score",
                    "Keyword-Optimized for Your Industry",
                    "Designed by Experts, Not Templates",
                    "Includes Cover Letter & LinkedIn Profile Optimization",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="relative inline-flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6" style={{ color: "#19c37d" }} aria-hidden="true" />
                        <span
                          className="absolute inset-0 rounded-full ring-2"
                          style={{ borderColor: COLORS.GOLD }}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-white text-base sm:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-6">
                <HeroLeadForm
                  onSuccess={() => toast({ title: "Submitted!", description: "We'll be in touch shortly." })}
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" aria-labelledby="about-heading" className="py-20 md:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="about-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ color: COLORS.EMERALD }}
            >
              Why Choose CraftMyResume?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <FeatureCard
                icon={<Cpu className="h-8 w-8" color={COLORS.GOLD} aria-hidden="true" />}
                title="ATS Excellence"
                description="Resumes that pass applicant tracking systems with ease."
              />
              <FeatureCard
                icon={<Briefcase className="h-8 w-8" color={COLORS.GOLD} aria-hidden="true" />}
                title="Industry Tailored"
                description="Keywords and content aligned precisely with your field."
              />
              <FeatureCard
                icon={<Package2 className="h-8 w-8" color={COLORS.GOLD} aria-hidden="true" />}
                title="Complete Package"
                description="Resume, cover letter, and LinkedIn optimization included."
              />
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Professionals Helped", value: "12,000+" },
                { label: "Avg. ATS Score", value: "82%" },
                { label: "Interview Rate Increase", value: "3.5x" },
                { label: "Avg. Turnaround", value: "48 hrs" },
              ].map((s) => (
                <Card key={s.label} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-2xl" style={{ color: COLORS.EMERALD }}>
                      {s.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section
          id="packages"
          aria-labelledby="packages-heading"
          className="py-20 md:py-24 lg:py-28"
          style={{ backgroundColor: COLORS.BEIGE }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="packages-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ color: COLORS.EMERALD }}
            >
              Our Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <PricingCard
                name="Resume Package"
                price="₹499"
                label="Everything you need to start landing interviews"
                featured
                features={[
                  "ATS-Friendly Resume",
                  "75% ATS Score Guarantee",
                  "Cover Letter",
                  "1:1 Consultation with Writer",
                  "3–4 day Delivery",
                ]}
                onGetStarted={() => handleOpenContact("Resume Package")}
              />
              <PricingCard
                name="LinkedIn Optimization"
                price="₹599"
                label="Boost your visibility and recruiter outreach"
                features={[
                  "Headline, About & Experience optimized",
                  "Keyword & SEO-rich profile",
                  "Banner and photo guidance",
                  "Recruiter search optimization",
                  "Outreach message templates",
                ]}
                onGetStarted={() => handleOpenContact("LinkedIn Optimization")}
              />
              <PricingCard
                name="SOP Writing Services"
                price="₹499"
                label="Compelling, program‑aligned Statement of Purpose"
                features={[
                  "Tailored SOP for your target program",
                  "1:1 consultation to align goals",
                  "Structured, keyword‑optimized narrative",
                  "2 revisions within 7 days",
                  "48–72 hour delivery",
                ]}
                onGetStarted={() => handleOpenContact("SOP Writing Services")}
              />
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="process" aria-labelledby="process-heading" className="py-20 md:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="process-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ color: COLORS.EMERALD }}
            >
              How It Works
            </h2>
            <HowItWorksInteractive
              emerald={COLORS.EMERALD}
              gold={COLORS.GOLD}
              onGetStarted={() => handleSmoothScroll("packages")}
            />
          </div>
        </section>

        {/* Why choose (image + content + accordion) */}
        <section id="why-choose" aria-labelledby="why-choose-heading" className="py-20 md:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="why-choose-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ color: COLORS.EMERALD }}
            >
              Why choose our Resume Writing Services?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-center">
              <div className="lg:col-span-5">
                <img
                  src="/why-choose-resume-sample.jpg"
                  alt="Sample modern resume layout used in our services"
                  width={762}
                  height={1062}
                  loading="lazy"
                  className="w-full h-auto max-w-[420px] sm:max-w-[440px] rounded-xl border shadow-sm object-contain mx-auto lg:mx-0"
                  style={{ borderColor: "rgba(15,91,79,0.15)" }}
                />
              </div>
              <div className="lg:col-span-7">
                <div className="space-y-6">
                  <p className="text-gray-700 text-base sm:text-lg">
                    We don't just make resumes look good—we align your achievements to the roles you want, structure
                    content for ATS, and position you as the obvious choice for recruiters.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                      <div
                        className="h-8 w-8 rounded-full grid place-items-center"
                        style={{ backgroundColor: "rgba(212,175,55,0.12)" }}
                      >
                        <FileText className="h-4 w-4" color={COLORS.GOLD} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: COLORS.EMERALD }}>
                        Role‑Aligned Content
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                      <div
                        className="h-8 w-8 rounded-full grid place-items-center"
                        style={{ backgroundColor: "rgba(212,175,55,0.12)" }}
                      >
                        <Briefcase className="h-4 w-4" color={COLORS.GOLD} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: COLORS.EMERALD }}>
                        Industry Keywords
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                      <div
                        className="h-8 w-8 rounded-full grid place-items-center"
                        style={{ backgroundColor: "rgba(212,175,55,0.12)" }}
                      >
                        <Star className="h-4 w-4" color={COLORS.GOLD} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: COLORS.EMERALD }}>
                        Interview‑Ready
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {[
                      "Clear, measurable bullets that highlight impact",
                      "Clean hierarchy and formatting for rapid skimming",
                      "Optimized file type, headings, and sections for ATS",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5" style={{ color: "#19c37d" }} />
                        <span className="text-sm text-gray-700">{t}</span>
                      </li>
                    ))}
                  </ul>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="w-item-1" className="border rounded-md mb-3">
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-3">
                          <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                          <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                          <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                            ATS-Compliant and Optimized Resume Writing Services
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                        We engineer your resume for machines and humans. Sections, headings, and spacing are built to
                        parse flawlessly while remaining skim-friendly for recruiters. Expect:
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          <li>Structured sections and standardized headings that ATS can read</li>
                          <li>Keyword strategy aligned to your target job families</li>
                          <li>Minimal graphics, clean fonts, and export-safe formatting</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="w-item-2" className="border rounded-md mb-3">
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-3">
                          <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                          <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                          <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                            75% ATS Score Guaranteed
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                        We run your draft through leading ATS scanners and fix parse issues before delivery. You'll also
                        receive a short reviewer note explaining why the score improved and what to tweak per role.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="w-item-3" className="border rounded-md mb-3">
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-3">
                          <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                          <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                          <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                            Customer Service at Heart
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                        Stay informed at every step: a kickoff call, transparent timelines, and fast replies. If
                        something feels off, we'll refine quickly to hit the mark.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="w-item-4" className="border rounded-md">
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-3">
                          <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                          <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                          <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                            Proven Results for our Clients
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                        Our clients report faster callbacks, higher interview rates, and smoother conversations with
                        recruiters thanks to clear, quantified storytelling.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Button
                      className="rounded-full font-semibold hover:shadow-md"
                      style={{ backgroundColor: COLORS.GOLD, color: COLORS.EMERALD }}
                      onClick={() => handleSmoothScroll("packages")}
                    >
                      See Packages
                    </Button>
                    <p className="text-xs text-gray-600">Turnaround in 2–4 days. Interview‑ready deliverables.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After Resume */}
        <section
          id="before-after"
          aria-labelledby="before-after-heading"
          className="py-20 md:py-24 lg:py-28"
          style={{ backgroundColor: "white" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2
                id="before-after-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: COLORS.EMERALD }}
              >
                Before & After: Real Resume Transformation
              </h2>
              <p className="mt-3 text-gray-700">
                Compare a cluttered, low‑impact resume with a clean, ATS‑friendly version side by side.
              </p>
            </div>

            <div className="mt-8">
              <BeforeAfterShowcase
                beforeSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-10%20at%209.07.33%20PM-iqjuFv7QM4oW9L4wyagXgkeZaq3fZl.jpeg"
                afterSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-10%20at%209.07.29%20PM-1h4YesMFSg87XRZ59Vpks02qT5tJNG.jpeg"
                emerald={COLORS.EMERALD}
                gold={COLORS.GOLD}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              {[
                "Clear hierarchy and sections recruiters scan fast",
                "Quantified, outcome‑focused bullets",
                "ATS‑safe formatting without graphics that break parsing",
              ].map((b) => (
                <div key={b} className="rounded-xl border p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4" style={{ color: "#19c37d" }} />
                    <span>{b}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ATS Friendly (image + accordion + slider + CTA) */}
        <section id="ats-friendly" aria-labelledby="ats-friendly-heading" className="py-20 md:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="ats-friendly-heading"
              className="lg:sr-only text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
              style={{ color: COLORS.EMERALD }}
            >
              We make your resume truly ATS Friendly.
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-center">
              <div className="lg:col-span-6">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-10%20at%207.51.23%20PM-NdgkvwTLlN5CC9ISBWIsdLkMoUUVaI.jpeg"
                  alt="ATS-friendly sample resume layout"
                  className="w-full rounded-xl border shadow-sm object-cover"
                  style={{ borderColor: "rgba(15,91,79,0.15)" }}
                />
              </div>
              <div className="lg:col-span-6">
                <h2
                  className="hidden lg:block text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: COLORS.EMERALD }}
                >
                  We make your resume truly ATS Friendly.
                </h2>

                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="af-1" className="border rounded-md mb-3">
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center gap-3">
                        <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                        <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                        <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                          75%+ ATS Score Guaranteed*
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                      We analyze your draft on multiple ATS-like scanners and fix parsing errors before delivery.
                      Expect:
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Correct use of headings, dates, and section order for accurate parsing</li>
                        <li>Keyword density aligned to the job families you're targeting</li>
                        <li>An ATS summary report with tips for minor per‑JD tweaks</li>
                      </ul>
                      <p className="mt-2 text-xs text-gray-500">
                        *Scores vary by tool and job description; we ensure a minimum threshold on mainstream scanners.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="af-2" className="border rounded-md mb-3">
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center gap-3">
                        <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                        <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                        <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                          Choose your Resume Template
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                      Pick from 2–3 clean, ATS‑safe layouts that suit your seniority and industry. We then tailor:
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Section order to foreground the most relevant experience</li>
                        <li>Whitespace and hierarchy for rapid recruiter skimming</li>
                        <li>Font pairing and spacing to prevent rendering issues on portals</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="af-3" className="border rounded-md mb-3">
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center gap-3">
                        <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                        <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                        <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                          Tailored to your Target Role
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                      We align language to the outcomes your role demands. Bullets are rewritten to be quantified and
                      outcome‑driven, with a keyword bank for easy future tweaks.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="af-4" className="border rounded-md mb-3">
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center gap-3">
                        <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                        <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                        <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                          20-Day Edit Support
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                      Enjoy a 20‑day window for polishing:
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Unlimited minor fixes (typos, phrasing, order)</li>
                        <li>Up to two structural adjustments within scope</li>
                        <li>Guidance on tailoring for specific postings</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="af-5" className="border rounded-md mb-3">
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center gap-3">
                        <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                        <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                        <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                          Proven Results for our Clients
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                      Candidates report faster callbacks and improved interview ratios after using our materials. We
                      focus on clarity, impact, and relevance—what hiring teams care about most.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="af-6" className="border rounded-md">
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center gap-3">
                        <Plus className="h-4 w-4 text-gray-700 data-[state=open]:hidden" />
                        <Minus className="h-4 w-4 text-gray-700 hidden data-[state=open]:block" />
                        <span className="font-medium" style={{ color: COLORS.EMERALD }}>
                          2–3 Day Delivery
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-gray-700">
                      First drafts are typically delivered in 2–3 business days after your intake. Need it sooner? Ask
                      for our rush option. Fast iterations keep momentum while you apply.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-6">
                  <ATSReviewsSlider />
                </div>

                <Button
                  className="mt-6 rounded-full px-6 py-6 font-semibold hover:shadow-md"
                  style={{ backgroundColor: COLORS.GOLD, color: COLORS.EMERALD }}
                  onClick={() => window.open("https://payments.cashfree.com/forms/craftmyresumepayment", "_blank")}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          aria-labelledby="testimonials-heading"
          className="py-20 md:py-24 lg:py-28"
          style={{ backgroundColor: COLORS.EMERALD }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="testimonials-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center text-white"
            >
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <TestimonialCard
                quote="I landed interviews within a week. The resume was crisp, keyword-rich, and visually professional."
                name="Aisha K."
                role="Marketing Specialist"
              />
              <TestimonialCard
                quote="The LinkedIn optimization was a game changer. Recruiters started reaching out to me!"
                name="Daniel S."
                role="Software Engineer"
              />
              <TestimonialCard
                quote="Executive-level polish. The document told my story with impact and clarity. Highly recommend."
                name="Priya R."
                role="VP, Operations"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="py-20 md:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="faq-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ color: COLORS.EMERALD }}
            >
              Frequently Asked Questions
            </h2>

            <div className="max-w-4xl mx-auto space-y-10">
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.EMERALD }}>
                  Service Related Questions
                </h3>
                <Accordion type="multiple" className="w-full">
                  {[
                    {
                      q: "Will you build a resume from scratch or provide a template?",
                      a: "We write every resume from scratch based on your goals, experience, and target roles. We do use proven, ATS‑safe layouts—but we never drop your content into a generic template. Expect a short intake + 1:1 consultation, followed by a custom draft in an editable DOCX and a polished PDF.",
                    },
                    {
                      q: "Is it a subscription or a one-time service?",
                      a: "It's a one‑time fee for the package you choose. No subscriptions. Your package includes a revision window (see support FAQs) and optional add‑ons like rush delivery or job‑specific tailoring.",
                    },
                    {
                      q: "What is the turnaround time?",
                      a: "First draft typically ships in 48–72 hours after your intake call and document handover. Need it sooner? Choose our 24‑hour rush add‑on. Total timeline also depends on how quickly you share feedback.",
                    },
                    {
                      q: "What does LinkedIn optimization include?",
                      a: "We rewrite your Headline, About, and Experience sections with quantified bullets and keyword strategy; refine Skills; advise on banner/photo; optimize settings like custom URL and visibility; and provide recruiter outreach templates to improve response rates.",
                    },
                    {
                      q: "What payment methods do you accept?",
                      a: "We accept UPI, major credit/debit cards, net banking, and popular wallets. For international clients we accept cards in INR (converted by your bank). Invoices/receipts are provided upon request.",
                    },
                    {
                      q: "Do you create resumes in international/Europass formats?",
                      a: "Yes. We routinely prepare US, UK, EU (including Europass), Middle‑East and India‑focused formats. We follow region‑specific hiring norms while keeping the design ATS‑compliant and easy to skim.",
                    },
                  ].map(({ q, a }, i) => (
                    <AccordionItem key={q} value={`s-${i}`} className="border-b">
                      <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-700">{a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.EMERALD }}>
                  Customization And Flexibility Options
                </h3>
                <Accordion type="multiple" className="w-full">
                  {[
                    {
                      q: "Do I get to choose the resume template?",
                      a: "We'll recommend 2–3 clean, ATS‑safe layouts that match your seniority and industry. You can pick your preference and we'll adapt spacing, section order, and emphasis accordingly. You'll see a preview before finalization.",
                    },
                    {
                      q: "What is ATS?",
                      a: "An Applicant Tracking System (ATS) scans resumes to parse contact details, experience, and keywords before a recruiter reviews them. We structure sections, headings, and keywords to ensure proper parsing and relevance—without gimmicks or graphics that can break ATS reads.",
                    },
                    {
                      q: "How much ATS score do you guarantee?",
                      a: "We guarantee a minimum 75%+ ATS score on common scanners for your target role's keywords. Scores vary by tool and job description, so we also validate manually for recruiter readability. Remember: a high score helps you get seen, but interviews still depend on role fit and market conditions.",
                    },
                    {
                      q: "How can I tailor the resume for each application?",
                      a: "You'll receive an editable DOCX and a quick 'tailoring checklist'. We highlight which bullets/keywords to tweak per job and provide a mini keyword bank. If you'd like us to tailor for a specific posting, add our quick‑tailor add‑on.",
                    },
                  ].map(({ q, a }, i) => (
                    <AccordionItem key={q} value={`c-${i}`} className="border-b">
                      <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-700">{a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.EMERALD }}>
                  Post-Delivery Support
                </h3>
                <Accordion type="multiple" className="w-full">
                  {[
                    {
                      q: "What if I am not satisfied with your service?",
                      a: "Your success matters. If something feels off, we'll hop on a quick call and refine the document until it reflects your story and goals within the agreed scope. Our aim is clear alignment and interview‑ready delivery.",
                    },
                    {
                      q: "How many edits will I get?",
                      a: "Within 20 days of delivery, you get unlimited minor edits (typos, phrasing, ordering) and up to two rounds of structural changes (e.g., section reshuffle or role emphasis). Beyond this window, you can opt for a paid refresh.",
                    },
                    {
                      q: "What if I need edits after some weeks/months?",
                      a: "We offer refresh packages for updates like new roles, achievements, or job pivots. We securely retain your files for at least 6 months, making later updates faster and more affordable.",
                    },
                    {
                      q: "In what file formats will I receive my resume?",
                      a: "You'll receive a polished PDF (for applications) and an editable DOCX (for tailoring). We also share a plain‑text version if needed by certain ATS portals, plus font guidance so formatting stays consistent.",
                    },
                    {
                      q: "What is the guarantee of landing a job?",
                      a: "No service can guarantee a job. We guarantee quality, clarity, and ATS compliance designed to improve interview rates. Hiring outcomes depend on market conditions, role fit, and interview performance. We can support with LinkedIn optimization and interview prep add‑ons to boost your results.",
                    },
                  ].map(({ q, a }, i) => (
                    <AccordionItem key={q} value={`p-${i}`} className="border-b">
                      <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-700">{a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section
          aria-labelledby="cta-footer-heading"
          className="relative py-20 md:py-24 lg:py-28"
          style={{
            background: "linear-gradient(180deg, #f7f3e8 0%, #f5efe0 60%, #f3ead7 100%)",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="mx-auto max-w-4xl text-center">
              <h2
                id="cta-footer-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
                style={{ color: COLORS.EMERALD }}
              >
                Ready to Land Your Dream Job?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-gray-700">
                Get an ATS-optimized, recruiter-friendly resume tailored to your target roles. Clear story. Stronger
                results.
              </p>
            </div>

            {/* Content: Offer card + Benefits */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* Offer Card */}
              <div className="lg:col-span-5">
                <div
                  className="h-full rounded-2xl border shadow-sm p-6 sm:p-7"
                  style={{ borderColor: "rgba(212,175,55,0.35)", backgroundColor: "white" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: "rgba(212,175,55,0.15)", color: COLORS.EMERALD }}
                    >
                      Limited Time Offer
                    </span>
                    <ShieldCheck className="h-5 w-5" color={COLORS.EMERALD} aria-hidden="true" />
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Resume Package</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold" style={{ color: COLORS.EMERALD }}>
                        ₹499
                      </span>
                      <span className="text-sm text-gray-500">one-time</span>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2">
                    {[
                      "75%+ ATS score guarantee",
                      "Role-aligned, quantified bullets",
                      "Cover letter included",
                      "2–3 day delivery",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-5 w-5" style={{ color: "#19c37d" }} aria-hidden="true" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Button
                      className="w-full rounded-full px-5 py-5 font-semibold hover:shadow-md"
                      style={{ backgroundColor: COLORS.GOLD, color: COLORS.EMERALD }}
                      onClick={() => window.open("https://payments.cashfree.com/forms/craftmyresumepayment", "_blank")}
                      aria-label="Open payment form"
                    >
                      Avail Our Service
                    </Button>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">20‑day edit support included. No subscriptions.</p>
                </div>
              </div>

              {/* Benefits + Social Proof */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { h: "ATS-first structure", d: "Clean headings, parsing-safe formatting, and keyword alignment." },
                    { h: "Story that converts", d: "Quantified achievements matched to the roles you're targeting." },
                    { h: "Tailor fast", d: "Editable DOCX, plus a mini keyword bank and tailoring checklist." },
                    { h: "Human-led", d: "Expert writers for your industry—no generic templates." },
                  ].map((b) => (
                    <div key={b.h} className="rounded-xl border bg-white p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="h-8 w-8 rounded-full grid place-items-center"
                          style={{ backgroundColor: "rgba(212,175,55,0.15)" }}
                        >
                          <CheckCircle2 className="h-4 w-4" style={{ color: "#19c37d" }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: COLORS.EMERALD }}>
                            {b.h}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">{b.d}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust row */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5" color={COLORS.GOLD} fill={COLORS.GOLD} aria-hidden="true" />
                    ))}
                    <span className="text-sm text-gray-700">Rated 4.9/5 by professionals</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold" style={{ color: COLORS.EMERALD }}>
                      12,000+
                    </span>
                    <span className="text-gray-700"> resumes delivered across industries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10" style={{ backgroundColor: COLORS.EMERALD }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {[
                  { label: "Home", id: "hero" },
                  { label: "About", id: "about" },
                  { label: "Packages", id: "packages" },
                  { label: "Contact", id: "contact" },
                  { label: "Privacy Policy", id: "privacy" },
                ].map((link) => (
                  <button
                    key={link.label}
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: "white" }}
                    onClick={() => {
                      if (link.id === "contact") {
                        handleOpenContact()
                      } else if (link.id === "privacy") {
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      } else {
                        handleSmoothScroll(link.id)
                      }
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <Instagram className="h-5 w-5" color={COLORS.GOLD} />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <Linkedin className="h-5 w-5" color={COLORS.GOLD} />
                </a>
              </div>
            </div>
            <p className="mt-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
              © {new Date().getFullYear()} CraftMyResume. All rights reserved.
            </p>
          </div>
        </footer>

        {/* Floating Scroll-to-Top */}
        {showScrollTop && (
          <button
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 rounded-full shadow-lg p-3 hover:shadow-xl transition"
            style={{ backgroundColor: COLORS.GOLD, color: COLORS.EMERALD }}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        {/* Contact Modal */}
        <ContactDialog
          open={contactOpen}
          onOpenChange={setContactOpen}
          selectedPlan={selectedPlan}
          emerald={COLORS.EMERALD}
          gold={COLORS.GOLD}
        />
        <OfferOverlay emerald={COLORS.EMERALD} gold={COLORS.GOLD} whatsappUrl="https://wa.me/917039409085" />
      </main>
    </div>
  )
}

/* ---------- Shared Components ---------- */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="h-full hover:shadow-md transition">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle className="text-lg sm:text-xl" style={{ color: COLORS.EMERALD }}>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm sm:text-base text-gray-700">{description}</p>
      </CardContent>
    </Card>
  )
}

function PricingCard({
  name,
  price,
  label,
  features,
  featured = false,
  onGetStarted,
}: {
  name: PlanKey
  price: string
  label: string
  features: string[]
  featured?: boolean
  onGetStarted: () => void
}) {
  return (
    <Card
      className={`h-full relative hover:shadow-lg transition ${featured ? "ring-2" : ""}`}
      style={{ borderColor: featured ? COLORS.GOLD : undefined }}
    >
      {featured && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: COLORS.GOLD, color: COLORS.EMERALD }}
          aria-label="Most Popular"
        >
          Most Popular
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl" style={{ color: COLORS.EMERALD }}>
          {name}
        </CardTitle>
        <p className="text-sm text-gray-700">{label}</p>
        <div className="mt-3">
          <span className="text-3xl font-extrabold" style={{ color: COLORS.EMERALD }}>
            {price}
          </span>
          <span className="text-sm ml-1 text-gray-500">one-time</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mt-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: "#19c37d" }} aria-hidden="true" />
              <span className="text-sm text-gray-700">{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full rounded-full font-semibold hover:shadow-md"
          style={{ backgroundColor: COLORS.GOLD, color: COLORS.EMERALD }}
          onClick={() => {
            let paymentUrl = ""
            switch (name) {
              case "Resume Package":
                paymentUrl = "https://payments.cashfree.com/forms/craftmyresumepayment"
                break
              case "LinkedIn Optimization":
                paymentUrl = "https://payments.cashfree.com/forms/craftmyresumelinkedin"
                break
              case "SOP Writing Services":
                paymentUrl = "https://payments.cashfree.com/forms/craftmyresumesop"
                break
              default:
                paymentUrl = "https://payments.cashfree.com/forms/craftmyresumepayment"
            }
            window.open(paymentUrl, "_blank")
          }}
          aria-label={`Buy Now ${name}`}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string
  name: string
  role: string
}) {
  return (
    <Card
      className="h-full hover:shadow-md transition"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(212,175,55,0.3)" }}
    >
      <CardHeader>
        <div className="flex items-center gap-1" aria-label="5 star rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4" color={COLORS.GOLD} fill={COLORS.GOLD} aria-hidden="true" />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white/90 text-sm sm:text-base">{`"${quote}"`}</p>
      </CardContent>
      <CardFooter className="text-sm text-white/70">
        <span className="font-medium" style={{ color: COLORS.GOLD }}>
          {name}
        </span>
        {" – "}
        <span>{role}</span>
      </CardFooter>
    </Card>
  )
}

function ContactDialog({
  open,
  onOpenChange,
  selectedPlan,
  emerald,
  gold,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPlan: PlanKey | null
  emerald: string
  gold: string
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, plan: selectedPlan }),
        })
        if (!res.ok) {
          const body = await res.json()
          throw new Error(body.error || "Something went wrong")
        }
        toast({ title: "Submitted!", description: "Redirecting to payment..." })
        onOpenChange(false)
        setName("")
        setEmail("")
        setPhone("")

        // Redirect to payment form after successful submission
        setTimeout(() => {
          window.location.href = "https://payments.cashfree.com/forms/craftmyresumepayment"
        }, 1500)
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: e.message || "Something went wrong",
        })
      } finally {
        setLoading(false)
      }
    },
    [email, name, onOpenChange, phone, selectedPlan, toast],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle style={{ color: emerald }}>The CV That Gets The Job Done</DialogTitle>
          <DialogDescription>Buy Now and Get Your Resume Delivered In 48 Hours</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right text-sm font-medium">
              Phone
            </label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full font-semibold hover:shadow-md"
            style={{ backgroundColor: gold, color: emerald }}
            onClick={handleSubmit}
          >
            {loading ? "Creating..." : "Create My Resume"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function HeroLeadForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, plan: "General Contact" }),
        })
        if (!res.ok) {
          const body = await res.json()
          throw new Error(body.error || "Something went wrong")
        }
        toast({ title: "Submitted!", description: "Redirecting to payment..." })
        onSuccess()
        setName("")
        setEmail("")
        setPhone("")

        // Redirect to payment form after successful submission
        setTimeout(() => {
          window.location.href = "https://payments.cashfree.com/forms/craftmyresumepayment"
        }, 1500)
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: e.message || "Something went wrong",
        })
      } finally {
        setLoading(false)
      }
    },
    [email, name, onSuccess, phone, toast],
  )

  return (
    <div className="w-full">
      {/* Promotional Banner - Outside the card */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-white">Priced @</span>
          <span className="text-lg font-bold text-gray-300 line-through">₹2999</span>
          <span className="text-2xl font-bold" style={{ color: "#22c55e" }}>
            ₹499
          </span>
        </div>
      </div>

      {/* Contact Form Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg" style={{ color: COLORS.EMERALD }}>
            The CV That Gets The Job Done
          </CardTitle>
          <CardDescription>Buy Now and Get Your Resume Delivered In 48 Hours</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right text-sm font-medium">
              Phone
            </label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full font-semibold hover:shadow-md"
            style={{ backgroundColor: COLORS.GOLD, color: COLORS.EMERALD }}
            onClick={handleSubmit}
          >
            {loading ? "Creating..." : "Create My Resume"}
          </Button>
        </CardFooter>

        {/* Secure Checkout Section */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">🔒</span>
              <span className="text-xs text-gray-600 font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/visa%20%281%29-HH19GESbpVEJyljO0U17HjziUvevPM.png"
                alt="Visa"
                className="h-4 w-auto"
              />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-rO6zZdeeEmdisGb41GPPQtMQeAGCfn.png"
                alt="MasterCard"
                className="h-4 w-auto"
              />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/upi-icon-8Skw0jp5XaguCJNuhznKufRfLNyn7Z.png"
                alt="UPI"
                className="h-4 w-auto"
              />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phonepe-icon-Sa1P8jevciPZBO9OHoIUvUeRgGJwTs.png"
                alt="PhonePe"
                className="h-4 w-auto"
              />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/google-pay-rHmySgal5SRrphMRx0z3zPhudZ0z0V.png"
                alt="Google Pay"
                className="h-4 w-auto"
              />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paytm-icon-jRijPi75zcapxia9xFZX3SVi8BIQ2q.png"
                alt="Paytm"
                className="h-4 w-auto"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ATSReviewsSlider() {
  const reviews = [
    { quote: "Got 2 interviews in a week.", name: "Rohit S.", role: "Data Analyst" },
    { quote: "Clean, ATS-safe, and to the point.", name: "Mehak G.", role: "Product Manager" },
    { quote: "Parsing issues gone. More callbacks.", name: "Arjun P.", role: "Software Engineer" },
    { quote: "Fast delivery and clear communication.", name: "Sana K.", role: "Marketing Lead" },
    { quote: "Noticed by companies that ignored me before.", name: "Nitin V.", role: "Ops Manager" },
  ]

  const [index, setIndex] = useState(0)
  const next = useCallback(() => setIndex((i) => (i + 1) % reviews.length), [reviews.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + reviews.length) % reviews.length), [reviews.length])

  useEffect(() => {
    const id = window.setInterval(next, 3500)
    return () => window.clearInterval(id)
  }, [next])

  return (
    <div className="relative rounded-xl border p-4 sm:p-5" style={{ borderColor: "rgba(15,91,79,0.15)" }}>
      {/* Header row with controls */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-base sm:text-lg font-semibold" style={{ color: COLORS.EMERALD }}>
          What Our Clients Say
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous review"
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            style={{ color: COLORS.EMERALD }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next review"
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            style={{ color: COLORS.EMERALD }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Slide area with fade transition */}
      <div className="relative min-h-[92px] sm:min-h-[80px]">
        {reviews.map((r, i) => (
          <div
            key={`${r.name}-${i}`}
            className={`absolute inset-0 transition-all duration-500 ${
              i === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
            aria-hidden={i !== index}
            aria-live={i === index ? "polite" : "off"}
          >
            <div className="flex items-start gap-3">
              <div
                className="h-8 w-8 rounded-full grid place-items-center shrink-0"
                style={{ backgroundColor: "rgba(212,175,55,0.12)" }}
              >
                <Quote className="h-4 w-4" color={COLORS.GOLD} />
              </div>
              <div>
                <div className="flex items-center gap-1" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5" color={COLORS.GOLD} fill={COLORS.GOLD} aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-800">{`"${r.quote}"`}</p>
                <p className="mt-1 text-xs font-medium" style={{ color: COLORS.EMERALD }}>
                  {r.name} • <span className="font-normal text-gray-600">{r.role}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center gap-1.5">
        {reviews.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to review ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6" : "w-3"}`}
            style={{ backgroundColor: i === index ? COLORS.EMERALD : "rgba(15,91,79,0.25)" }}
          />
        ))}
      </div>
    </div>
  )
}

function BeforeAfterShowcase({
  beforeSrc,
  afterSrc,
  emerald,
  gold,
}: {
  beforeSrc: string
  afterSrc: string
  emerald: string
  gold: string
}) {
  const [swap, setSwap] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)
  const [zoomKind, setZoomKind] = useState<"before" | "after" | null>(null)

  const cards = swap
    ? [
        { kind: "after" as const, src: afterSrc },
        { kind: "before" as const, src: beforeSrc },
      ]
    : [
        { kind: "before" as const, src: beforeSrc },
        { kind: "after" as const, src: afterSrc },
      ]

  const openZoom = (src: string, kind: "before" | "after") => {
    setZoomSrc(src)
    setZoomKind(kind)
    setZoomOpen(true)
  }

  const Badge = ({ kind }: { kind: "before" | "after" }) => {
    if (kind === "before") {
      return (
        <span
          className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "rgba(239,68,68,0.10)", color: "#B91C1C" }}
        >
          <XCircle className="h-3.5 w-3.5" />
          Before
        </span>
      )
    }
    return (
      <span
        className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: "rgba(16,185,129,0.12)", color: emerald }}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        After
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-gray-600">
          Tip: Hover to zoom. Click to view full size. Use the button to swap sides.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setSwap((s) => !s)}
            className="rounded-full h-9 px-4"
            style={{ borderColor: emerald, color: emerald, backgroundColor: "white" }}
            aria-label="Swap Before and After positions"
          >
            Swap sides
          </Button>
        </div>
      </div>

      {/* Showcase */}
      <div
        className="mt-4 rounded-2xl p-3 sm:p-4"
        style={{
          background: "linear-gradient(180deg, rgba(245,239,224,0.65) 0%, rgba(243,234,215,0.45) 100%)",
          border: "1px solid rgba(15,91,79,0.12)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {cards.map(({ kind, src }) => (
            <div
              key={kind}
              className="group relative rounded-xl border shadow-sm overflow-hidden bg-white"
              style={{ borderColor: "rgba(15,91,79,0.15)" }}
            >
              <Badge kind={kind} />

              {/* Corner accent */}
              <div
                className="absolute right-0 top-0 h-0 w-0 border-l-[22px] border-b-[22px]"
                style={{
                  borderLeftColor: kind === "before" ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
                  borderBottomColor: "transparent",
                }}
                aria-hidden="true"
              />

              {/* Image button */}
              <button
                type="button"
                onClick={() => openZoom(src, kind)}
                className="relative block w-full focus:outline-none focus:ring-2"
                style={{ borderColor: gold }}
                aria-label={
                  kind === "before" ? "Open Before resume full-size preview" : "Open After resume full-size preview"
                }
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={
                      src ||
                      (kind === "before"
                        ? "/placeholder.svg?height=720&width=512&query=before%20resume"
                        : "/placeholder.svg?height=720&width=512&query=after%20resume")
                    }
                    alt={
                      kind === "before" ? "Before resume (older layout)" : "After resume (modern ATS-friendly layout)"
                    }
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain bg-white transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Overlay bottom-right action */}
                <span
                  className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-2.5 py-1 shadow-sm"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.92)",
                    color: emerald,
                    border: "1px solid rgba(15,91,79,0.18)",
                  }}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  View
                </span>
              </button>

              {/* Subtle footer label */}
              <div
                className="flex items-center justify-between px-3 py-2 text-xs"
                style={{ backgroundColor: "rgba(245,239,224,0.45)" }}
              >
                <div className="flex items-center gap-2">
                  {kind === "before" ? (
                    <>
                      <XCircle className="h-3.5 w-3.5" style={{ color: "#EF4444" }} />
                      <span className="text-gray-700">Lower clarity • Not ATS‑optimized</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color: emerald }} />
                      <span className="text-gray-700">Clean hierarchy • ATS‑friendly</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] text-gray-500">3:4 ratio</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-[92vw] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle style={{ color: emerald }}>Resume Preview</DialogTitle>
            <DialogDescription>Press Esc to close. Use pinch/zoom in your browser for details.</DialogDescription>
          </DialogHeader>
          <div className="relative w-full">
            <div
              className="relative w-full aspect-[3/4] bg-white rounded-lg overflow-hidden border"
              style={{ borderColor: "rgba(15,91,79,0.15)" }}
            >
              <img
                src={
                  zoomSrc ||
                  (zoomKind === "after"
                    ? "/placeholder.svg?height=720&width=512&query=after%20resume"
                    : "/placeholder.svg?height=720&width=512&query=before%20resume")
                }
                alt="Full-size resume preview"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
