import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin requests API called")
    const supabase = createSupabaseServerClient()

    // Test database connection first
    const { data: testData, error: testError } = await supabase.from("resume_updates").select("count").limit(1)

    if (testError) {
      console.error("Database connection test failed:", testError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    console.log("Database connection successful")

    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const type = searchParams.get("type") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "25")
    const offset = (page - 1) * limit

    // Build queries for both tables
    let updatesQuery = supabase.from("resume_updates").select("*")

    let buildsQuery = supabase.from("resume_builds").select("*")

    // Apply status filter
    if (status !== "all") {
      updatesQuery = updatesQuery.eq("status", status)
      buildsQuery = buildsQuery.eq("status", status)
    }

    // Execute queries
    const { data: resumeUpdates, error: updatesError } = await updatesQuery
    const { data: resumeBuilds, error: buildsError } = await buildsQuery

    if (updatesError || buildsError) {
      console.error("Database error:", updatesError || buildsError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Transform and combine data
    let allRequests = [
      ...(resumeUpdates || []).map((r) => ({
        id: `UPD-${r.id}`,
        originalId: r.id,
        customer: r.customer_name,
        email: r.email,
        phone: r.phone,
        type: "Update",
        status: r.status,
        priority: determinePriority(r.created_at, r.status),
        submittedAt: formatDate(r.created_at),
        details: r.additional_details || "Resume update request",
        hasFile: !!r.resume_file_url,
        fileUrl: r.resume_file_url,
        orderId: r.order_id,
        requestType: "update",
      })),
      ...(resumeBuilds || []).map((r) => ({
        id: `BUILD-${r.id}`,
        originalId: r.id,
        customer: r.full_name,
        email: r.email,
        phone: r.phone,
        type: "Build from Scratch",
        status: r.status,
        priority: determinePriority(r.created_at, r.status),
        submittedAt: formatDate(r.created_at),
        details: `${r.target_role || "Professional"} resume for ${r.target_industry || "various industries"}`,
        hasFile: false,
        fileUrl: null,
        orderId: r.order_id,
        requestType: "build",
      })),
    ]

    // Apply type filter
    if (type !== "all") {
      allRequests = allRequests.filter((r) => r.type === type)
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      allRequests = allRequests.filter(
        (r) =>
          r.customer.toLowerCase().includes(searchLower) ||
          r.email.toLowerCase().includes(searchLower) ||
          r.id.toLowerCase().includes(searchLower),
      )
    }

    // Sort by creation date (newest first)
    allRequests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    // Apply pagination
    const total = allRequests.length
    const paginatedRequests = allRequests.slice(offset, offset + limit)

    return NextResponse.json({
      requests: paginatedRequests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()
    const { id, status, requestType } = body

    if (!id || !status || !requestType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const originalId = Number.parseInt(id.split("-")[1])
    const table = requestType === "update" ? "resume_updates" : "resume_builds"

    const { data, error } = await supabase
      .from(table)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", originalId)
      .select()

    if (error) {
      console.error("Update error:", error)
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function determinePriority(createdAt: string, status: string): string {
  const created = new Date(createdAt)
  const now = new Date()
  const hoursOld = (now.getTime() - created.getTime()) / (1000 * 60 * 60)

  if (status === "pending" && hoursOld > 24) return "high"
  if (status === "pending" && hoursOld > 12) return "medium"
  return "low"
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}
