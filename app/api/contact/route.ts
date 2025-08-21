import { NextResponse } from "next/server"
import { z } from "zod"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { sendLeadNotification, type LeadPayload } from "@/lib/email/resend"

const payloadSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200),
    email: z.string().trim().email().max(200).optional().or(z.literal("")),
    phone: z.string().trim().max(50).optional().or(z.literal("")),
    message: z.string().trim().max(4000).optional().or(z.literal("")),
    plan: z.string().trim().max(200).optional().or(z.literal("")),
  })
  .refine((v) => (v.email && v.email.length > 0) || (v.phone && v.phone.length > 0), {
    message: "Provide at least an email or phone number.",
    path: ["email"],
  })

function safePathFromReferrer(ref: string | null): string | null {
  if (!ref) return null
  try {
    const u = new URL(ref)
    return u.pathname || "/"
  } catch {
    return ref // if it's not a full URL, return as-is
  }
}

function withTimeout<T>(p: Promise<T>, ms = 4000): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms)
    p.then((v) => {
      clearTimeout(id)
      resolve(v)
    }).catch((e) => {
      clearTimeout(id)
      reject(e)
    })
  })
}

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServerClient()

    const body = await req.json().catch(() => ({}))
    const parsed = payloadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data

    // Meta from headers
    const ua = req.headers.get("user-agent") || null
    const referrer = req.headers.get("referer") || req.headers.get("referrer") || null
    const ip =
      (req.headers.get("x-forwarded-for") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)[0] || null
    const source = safePathFromReferrer(referrer)

    // Insert lead and return inserted row
    const { data: row, error } = await supabase
      .from("leads")
      .insert({
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        message: data.message || null,
        plan: data.plan || null,
        source,
        user_agent: ua,
        referrer,
        ip,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 })
    }

    // Fire-and-forget email notification; do not block the response on email success
    const leadForEmail: LeadPayload = {
      id: row?.id ?? null,
      created_at: row?.created_at ?? null,
      name: row?.name ?? data.name ?? null,
      email: row?.email ?? data.email ?? null,
      phone: row?.phone ?? data.phone ?? null,
      message: row?.message ?? data.message ?? null,
      plan: row?.plan ?? data.plan ?? null,
      source,
      user_agent: ua,
      referrer,
      ip,
    }

    // Kick off email (non-blocking)
    let emailStatus: { sent: boolean; id?: string; reason?: string } = { sent: false }
    try {
      const res = await withTimeout(sendLeadNotification(leadForEmail), 5000)
      emailStatus = res
      if (res.sent) {
        console.log("Lead email sent. Resend ID:", res.id)
      } else {
        console.warn("Lead email not sent:", res.reason)
      }
    } catch (e) {
      console.error("Lead email error/timeout:", e)
      emailStatus = { sent: false, reason: "error_or_timeout" }
    }

    return NextResponse.json({ ok: true, email: emailStatus.sent ? "sent" : "not_sent", reason: emailStatus.reason || undefined })
  } catch (err: any) {
    console.error("Contact route error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
