import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update last login timestamp for the admin user
    const { error } = await supabase
      .from("admin_users")
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)

    if (error) {
      console.error("Error updating last login:", error)
      return NextResponse.json({ error: "Failed to update login time" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
