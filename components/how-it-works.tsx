"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, FileText, MessageSquare, Download } from "lucide-react"

interface HowItWorksInteractiveProps {
  emerald: string
  gold: string
  onGetStarted: () => void
}

export default function HowItWorksInteractive({ emerald, gold, onGetStarted }: HowItWorksInteractiveProps) {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 1,
      title: "Upload Your Current Resume",
      description: "Share your existing resume or career details through our secure intake form.",
      icon: <FileText className="h-6 w-6" />,
      image: "/intake-form-upload.png",
      details: [
        "Secure file upload system",
        "Multiple format support (PDF, DOC, DOCX)",
        "Career questionnaire for context",
        "Privacy-first approach",
      ],
    },
    {
      id: 2,
      title: "Strategy Call & Planning",
      description: "Our expert writers analyze your background and discuss your target roles in a 1:1 consultation.",
      icon: <MessageSquare className="h-6 w-6" />,
      image: "/strategy-video-call-notes-resume-planning.png",
      details: [
        "15-minute strategy consultation",
        "Target role alignment",
        "Industry keyword research",
        "ATS optimization planning",
      ],
    },
    {
      id: 3,
      title: "Professional Writing & ATS Review",
      description:
        "We craft your resume with quantified achievements and run it through ATS scanners for optimization.",
      icon: <CheckCircle2 className="h-6 w-6" />,
      image: "/resume-review-ats.png",
      details: [
        "Expert resume writing",
        "ATS compatibility testing",
        "Keyword optimization",
        "Achievement quantification",
      ],
    },
    {
      id: 4,
      title: "Final Delivery & Support",
      description: "Receive your polished resume in multiple formats with 20 days of revision support.",
      icon: <Download className="h-6 w-6" />,
      image: "/resume-final-delivery-download.png",
      details: ["PDF and DOCX formats", "Cover letter included", "20-day revision window", "Tailoring guidelines"],
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="w-full">
      {/* Mobile: Horizontal scrolling chips */}
      <div className="md:hidden mb-8">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                index === activeStep ? "text-white shadow-md" : "text-gray-600 bg-white border hover:bg-gray-50"
              }`}
              style={{
                backgroundColor: index === activeStep ? emerald : undefined,
                borderColor: index === activeStep ? emerald : "rgba(15,91,79,0.2)",
              }}
            >
              Step {step.id}: {step.title}
            </button>
          ))}
        </div>

        {/* Mobile content */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full grid place-items-center"
                style={{ backgroundColor: `rgba(15,91,79,0.1)` }}
              >
                <span style={{ color: emerald }}>{steps[activeStep].icon}</span>
              </div>
              <CardTitle className="text-lg" style={{ color: emerald }}>
                {steps[activeStep].title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <img
              src={steps[activeStep].image || "/placeholder.svg"}
              alt={steps[activeStep].title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 mb-4">{steps[activeStep].description}</p>
            <ul className="space-y-2">
              {steps[activeStep].details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 mt-0.5" style={{ color: "#19c37d" }} />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Vertical stepper */}
        <div className="md:col-span-5">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-sm ${
                  index === activeStep ? "shadow-md" : "hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: index === activeStep ? "rgba(15,91,79,0.05)" : "white",
                  borderColor: index === activeStep ? emerald : "rgba(15,91,79,0.15)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="h-10 w-10 rounded-full grid place-items-center flex-shrink-0"
                    style={{
                      backgroundColor: index === activeStep ? emerald : "rgba(15,91,79,0.1)",
                      color: index === activeStep ? "white" : emerald,
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-base mb-1"
                      style={{ color: index === activeStep ? emerald : "#374151" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content area */}
        <div className="md:col-span-7">
          <div className="sticky top-8">
            <Card className="border shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-50 relative overflow-hidden">
                <img
                  src={steps[activeStep].image || "/placeholder.svg"}
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: emerald }}
                >
                  Step {steps[activeStep].id}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3" style={{ color: emerald }}>
                  {steps[activeStep].title}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">{steps[activeStep].description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {steps[activeStep].details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5" style={{ color: "#19c37d" }} />
                      <span className="text-sm text-gray-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Button
          onClick={onGetStarted}
          className="rounded-full px-8 py-6 text-base font-semibold hover:shadow-md transition-all"
          style={{ backgroundColor: gold, color: emerald }}
        >
          Get Started
        </Button>
        <p className="mt-3 text-sm text-gray-600">Ready in 48-72 hours • 20-day revision support included</p>
      </div>
    </div>
  )
}
