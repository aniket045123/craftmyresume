"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  UploadCloud,
  MessagesSquare,
  FileCheck,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  CheckCircle2,
} from "lucide-react"

type Props = {
  emerald?: string
  gold?: string
  onGetStarted?: () => void
}

type Step = {
  key: string
  title: string
  subtitle: string
  bullets: string[]
  img: string
  icon: "upload" | "chat" | "check" | "rocket"
}

export default function HowItWorksInteractive({ emerald = "#0f5b4f", gold = "#d4af37", onGetStarted }: Props) {
  const steps: Step[] = useMemo(
    () => [
      {
        key: "share",
        title: "Share Details",
        subtitle: "Upload resume + target roles",
        bullets: [
          "Send your current resume or LinkedIn URL",
          "Share target roles and job links (if any)",
          "Highlight achievements you want to emphasize",
        ],
        img: "/intake-form-upload.png",
        icon: "upload",
      },
      {
        key: "call",
        title: "Strategy Call",
        subtitle: "20‑min alignment call",
        bullets: [
          "Clarify goals, domain and seniority",
          "Pick ATS‑safe layout that fits your profile",
          "Agree on voice, emphasis and turnaround",
        ],
        img: "/strategy-video-call-notes-resume-planning.png",
        icon: "chat",
      },
      {
        key: "draft",
        title: "Draft & Review",
        subtitle: "We write, you iterate",
        bullets: [
          "Outcome‑focused, quantified bullets",
          "Keyword alignment for ATS & recruiter scan",
          "Fast edits via comments or quick call",
        ],
        img: "/resume-review-ats.png",
        icon: "check",
      },
      {
        key: "deliver",
        title: "Final Delivery",
        subtitle: "Polished files, ready to use",
        bullets: [
          "PDF, DOCX, and plain‑text files",
          "Tailoring checklist + quick keyword bank",
          "20‑day edit support included",
        ],
        img: "/resume-final-delivery-download.png",
        icon: "rocket",
      },
    ],
    [],
  )

  const [active, setActive] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [hovering, setHovering] = useState(false)
  const total = steps.length
  const progressPct = ((active + 1) / total) * 100

  // Autoplay: advance every 5s (pause on hover)
  useEffect(() => {
    if (!autoPlay || hovering) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % total)
    }, 5000)
    return () => window.clearInterval(id)
  }, [autoPlay, hovering, total])

  const go = useCallback(
    (dir: "prev" | "next") => {
      setActive((i) => {
        if (dir === "next") return (i + 1) % total
        return (i - 1 + total) % total
      })
    },
    [total],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") go("next")
      if (e.key === "ArrowLeft") go("prev")
      if (e.key === "Home") setActive(0)
      if (e.key === "End") setActive(total - 1)
    },
    [go, total],
  )

  const Icon = ({ name }: { name: Step["icon"] }) => {
    if (name === "upload") return <UploadCloud className="h-4.5 w-4.5" />
    if (name === "chat") return <MessagesSquare className="h-4.5 w-4.5" />
    if (name === "check") return <FileCheck className="h-4.5 w-4.5" />
    return <Rocket className="h-4.5 w-4.5" />
  }

  return (
    <div
      className="mt-2"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Interactive how it works stepper"
    >
      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium" style={{ color: emerald }}>
            Step {active + 1} of {total}
          </span>
          <span className="text-gray-500">• {steps[active].title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setAutoPlay((v) => !v)}
            className="h-8 rounded-full px-3 text-xs"
            style={{ borderColor: emerald, color: emerald, backgroundColor: "white" }}
            aria-pressed={autoPlay}
            aria-label={autoPlay ? "Pause autoplay" : "Resume autoplay"}
          >
            {autoPlay ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
            {autoPlay ? "Pause" : "Auto"}
          </Button>
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full p-0 bg-transparent"
              style={{ borderColor: emerald, color: emerald, backgroundColor: "white" }}
              onClick={() => go("prev")}
              aria-label="Previous step"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full p-0 bg-transparent"
              style={{ borderColor: emerald, color: emerald, backgroundColor: "white" }}
              onClick={() => go("next")}
              aria-label="Next step"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "rgba(15,91,79,0.12)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            background: `linear-gradient(90deg, ${gold} 0%, ${emerald} 100%)`,
          }}
          aria-hidden="true"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile chips */}
        <div className="lg:hidden -mx-1 -mt-2 mb-1 overflow-x-auto">
          <div className="px-1 flex items-center gap-2">
            {steps.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setActive(i)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  i === active ? "shadow-sm" : "opacity-90"
                }`}
                style={{
                  borderColor: i === active ? gold : "rgba(15,91,79,0.25)",
                  color: i === active ? emerald : "rgba(15,91,79,0.9)",
                  backgroundColor: i === active ? "rgba(212,175,55,0.12)" : "white",
                }}
                aria-current={i === active ? "step" : undefined}
              >
                {i + 1}. {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Left: vertical stepper */}
        <div className="lg:col-span-4 hidden lg:block">
          <nav aria-label="Steps" className="relative">
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li key={s.key}>
                  <button
                    onClick={() => setActive(i)}
                    className={`group w-full text-left rounded-lg border px-3 py-3 transition ${
                      i === active ? "shadow-sm" : "hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor: i === active ? gold : "rgba(15,91,79,0.15)",
                      backgroundColor: i === active ? "rgba(212,175,55,0.08)" : "white",
                    }}
                    aria-current={i === active ? "step" : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full grid place-items-center shrink-0"
                        style={{ backgroundColor: i === active ? "rgba(212,175,55,0.15)" : "rgba(15,91,79,0.06)" }}
                      >
                        <Icon name={s.icon} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: emerald }}>
                          {i + 1}. {s.title}
                        </p>
                        <p className="text-xs text-gray-600">{s.subtitle}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Right: active step detail */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: emerald }}>
                {steps[active].title}
              </CardTitle>
              <p className="text-sm text-gray-600">{steps[active].subtitle}</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative rounded-lg border overflow-hidden">
                <img
                  src={steps[active].img || "/placeholder.svg"}
                  alt={`${steps[active].title} illustration`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.06) 100%)",
                  }}
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col justify-between">
                <ul className="space-y-2">
                  {steps[active].bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5" style={{ color: "#19c37d" }} />
                      <span className="text-sm text-gray-800">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-full h-9 w-9 p-0 bg-transparent"
                      style={{ borderColor: emerald, color: emerald, backgroundColor: "white" }}
                      onClick={() => go("prev")}
                      aria-label="Previous step"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full h-9 w-9 p-0 bg-transparent"
                      style={{ borderColor: emerald, color: emerald, backgroundColor: "white" }}
                      onClick={() => go("next")}
                      aria-label="Next step"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    className="rounded-full font-semibold"
                    style={{ backgroundColor: gold, color: emerald }}
                    onClick={onGetStarted}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
