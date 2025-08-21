"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface OfferOverlayProps {
  emerald: string
  gold: string
  whatsappUrl: string
}

export default function OfferOverlay({ emerald, gold }: OfferOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000) // Show after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  const handleBuyNow = () => {
    window.open("https://payments.cashfree.com/forms/craftmyresumepayment", "_blank")
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 transition-all duration-300 ${
        isClosing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      <div
        className="rounded-xl border shadow-lg p-4 relative"
        style={{
          backgroundColor: "white",
          borderColor: "rgba(212,175,55,0.35)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close offer"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        {/* Content */}
        <div className="pr-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ backgroundColor: "rgba(212,175,55,0.15)", color: emerald }}
            >
              Limited Time
            </span>
            <span className="text-xs text-gray-600">⏰ Offer ends soon!</span>
          </div>

          <h3 className="font-bold text-sm mb-1" style={{ color: emerald }}>
            Professional Resume @ ₹499
          </h3>

          <p className="text-xs text-gray-600 mb-3">ATS-optimized • Cover letter included • 2-3 day delivery</p>

          <Button
            onClick={handleBuyNow}
            className="w-full rounded-full text-sm font-semibold py-2 hover:shadow-md transition-all"
            style={{ backgroundColor: gold, color: emerald }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
