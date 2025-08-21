import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, plan } = body

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    // Save to Supabase
    const supabase = createSupabaseServerClient()
    const { error: dbError } = await supabase.from("leads").insert([
      {
        name,
        email,
        phone,
        plan: plan || "General Contact",
        created_at: new Date().toISOString(),
      },
    ])

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save contact information" }, { status: 500 })
    }

    // Send email notification
    try {
      await resend.emails.send({
        from: "CraftMyResume <noreply@craftmyresume.com>",
        to: [process.env.LEADS_NOTIFY_TO || "leads@craftmyresume.com"],
        subject: `New Lead: ${plan || "General Contact"}`,
        html: `
          <h2>New Lead Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Plan:</strong> ${plan || "General Contact"}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      })
    } catch (emailError) {
      console.error("Email error:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
