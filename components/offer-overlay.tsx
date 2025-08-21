"use client"

import { useEffect, useState, useCallback } from "react"
import { X, MessageCircle } from "lucide-react"

type Props = {
  emerald?: string
  gold?: string
  whatsappUrl?: string
  extraLabel?: string
}

const DISMISS_KEY = "cmr_offer_dismissed"

export default function OfferOverlay({
  emerald = "#0f5b4f",
  gold = "#d4af37",
  whatsappUrl = "https://wa.me/917039409085",
  extraLabel = "Resume + Cover Letter",
}: Props) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY)
      if (dismissed === "1") setOpen(false)
    } catch {
      // ignore
    }
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      // ignore
    }
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-x-2 sm:inset-x-4 bottom-2 sm:bottom-4 z-50"
      role="region"
      aria-label="Limited time offer"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="mx-auto max-w-3xl rounded-2xl border shadow-lg bg-white"
        style={{ borderColor: "rgba(15,91,79,0.15)", pointerEvents: "auto" }}
      >
        {/* Single-line, no-wrap row with truncation where needed */}
        <div className="px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
            {/* Left: Offer pill */}
            <span
              className="inline-flex items-center text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{ backgroundColor: "rgba(212,175,55,0.15)", color: emerald }}
            >
              Limited Time Offer
            </span>

            {/* Price */}
            <span className="text-sm sm:text-base font-medium shrink-0" style={{ color: emerald }}>
              {"₹499 Only"}
            </span>

            {/* Middle: extra label, truncated on small screens to stay one line */}
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-700 truncate" title={extraLabel} aria-label={extraLabel}>
                {"• "} {extraLabel}
              </p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="inline-flex items-center justify-center gap-1.5 rounded-full h-9 px-3 sm:px-4 text-sm font-semibold shadow hover:opacity-95 transition shrink-0"
              style={{ backgroundColor: "#25D366", color: "#0b2f21" }}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">WhatsApp</span>
              <span className="sm:hidden">Chat</span>
            </a>

            {/* Close */}
            <button
              aria-label="Close offer"
              onClick={handleClose}
              className="ml-1 rounded-full p-1.5 hover:bg-gray-100 transition shrink-0"
              title="Dismiss"
            >
              <X className="h-4 w-4" style={{ color: emerald }} />
            </button>
          </div>
        </div>
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  )
}
