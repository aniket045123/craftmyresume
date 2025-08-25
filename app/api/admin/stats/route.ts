import { NextResponse } from "next/server"
import { adminOperations } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const stats = await adminOperations.getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
