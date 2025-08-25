import { NextResponse } from "next/server"
import { adminOperations } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("Admin analytics API called")

    const analyticsData = await adminOperations.getAnalyticsData()

    console.log("Analytics data retrieved successfully")
    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
