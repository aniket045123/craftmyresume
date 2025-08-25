import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase.from("admin_settings").select("*").single()

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Return default settings if no settings found
    if (!data) {
      return NextResponse.json({
        businessName: "CraftMyResume",
        businessEmail: "admin@craftmyresume.com",
        businessPhone: "+1 (555) 123-4567",
        autoResponseEnabled: true,
        autoResponseMessage: "Thank you for your resume request! We'll get back to you within 24 hours.",
        notificationEmail: "notifications@craftmyresume.com",
        emailNotificationsEnabled: true,
        slackWebhookUrl: "",
        slackNotificationsEnabled: false,
        defaultTurnaroundHours: 24,
        maxFileSize: 10,
        allowedFileTypes: "pdf,doc,docx",
      })
    }

    return NextResponse.json(data.settings)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const settings = await request.json()

    // Upsert settings (insert or update)
    const { data, error } = await supabase
      .from("admin_settings")
      .upsert({
        id: 1, // Single settings record
        settings,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
