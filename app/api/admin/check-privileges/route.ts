import { type NextRequest, NextResponse } from "next/server"
import { adminOperations } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { isAdmin, adminUser, error } = await adminOperations.checkAdminPrivileges(email)

    if (error) {
      return NextResponse.json({ error: "Failed to check admin privileges" }, { status: 500 })
    }

    if (isAdmin && adminUser) {
      // Update last login
      await adminOperations.updateLastLogin(email)
    }

    return NextResponse.json({
      isAdmin,
      adminUser: isAdmin ? adminUser : null,
    })
  } catch (error) {
    console.error("Admin privilege check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
