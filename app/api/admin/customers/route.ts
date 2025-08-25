import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin customers API called")
    const supabase = createSupabaseServerClient()

    // Test connection
    const { error: testError } = await supabase.from("resume_updates").select("count").limit(1)

    if (testError) {
      console.error("Database connection failed:", testError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "25")

    // Get all customers from both tables
    const { data: resumeUpdates, error: updatesError } = await supabase
      .from("resume_updates")
      .select("customer_name, email, phone, created_at, status")

    const { data: resumeBuilds, error: buildsError } = await supabase
      .from("resume_builds")
      .select("full_name, email, phone, created_at, status")

    const { data: leads, error: leadsError } = await supabase.from("leads").select("name, email, phone, created_at")

    if (updatesError || buildsError || leadsError) {
      console.error("Database error:", updatesError || buildsError || leadsError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Combine and deduplicate customers by email
    const customerMap = new Map()

    // Process resume updates
    ;(resumeUpdates || []).forEach((r) => {
      const email = r.email.toLowerCase()
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: `CUST-${email
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 8)
            .toUpperCase()}`,
          name: r.customer_name,
          email: r.email,
          phone: r.phone,
          totalRequests: 0,
          lastRequest: r.created_at,
          joinedDate: r.created_at,
          status: "active",
          requestHistory: [],
        })
      }
      const customer = customerMap.get(email)
      customer.totalRequests++
      customer.requestHistory.push({ type: "update", date: r.created_at, status: r.status })
      if (new Date(r.created_at) > new Date(customer.lastRequest)) {
        customer.lastRequest = r.created_at
      }
      if (new Date(r.created_at) < new Date(customer.joinedDate)) {
        customer.joinedDate = r.created_at
      }
    })

    // Process resume builds
    ;(resumeBuilds || []).forEach((r) => {
      const email = r.email.toLowerCase()
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: `CUST-${email
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 8)
            .toUpperCase()}`,
          name: r.full_name,
          email: r.email,
          phone: r.phone,
          totalRequests: 0,
          lastRequest: r.created_at,
          joinedDate: r.created_at,
          status: "active",
          requestHistory: [],
        })
      }
      const customer = customerMap.get(email)
      customer.totalRequests++
      customer.requestHistory.push({ type: "build", date: r.created_at, status: r.status })
      if (new Date(r.created_at) > new Date(customer.lastRequest)) {
        customer.lastRequest = r.created_at
      }
      if (new Date(r.created_at) < new Date(customer.joinedDate)) {
        customer.joinedDate = r.created_at
      }
    })

    // Process leads (potential customers)
    ;(leads || []).forEach((r) => {
      const email = r.email.toLowerCase()
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: `LEAD-${email
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 8)
            .toUpperCase()}`,
          name: r.name,
          email: r.email,
          phone: r.phone,
          totalRequests: 0,
          lastRequest: null,
          joinedDate: r.created_at,
          status: "lead",
          requestHistory: [],
        })
      }
    })

    let customers = Array.from(customerMap.values())

    // Determine customer status
    customers = customers.map((customer) => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      if (customer.totalRequests === 0) {
        customer.status = "lead"
      } else if (customer.lastRequest && new Date(customer.lastRequest) > thirtyDaysAgo) {
        customer.status = "active"
      } else {
        customer.status = "inactive"
      }

      // Format dates
      customer.lastRequest = customer.lastRequest ? formatDate(customer.lastRequest) : "Never"
      customer.joinedDate = formatDate(customer.joinedDate)

      return customer
    })

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone?.toLowerCase().includes(searchLower),
      )
    }

    // Sort by last request date (most recent first)
    customers.sort((a, b) => {
      if (a.lastRequest === "Never" && b.lastRequest === "Never") return 0
      if (a.lastRequest === "Never") return 1
      if (b.lastRequest === "Never") return -1
      return new Date(b.lastRequest).getTime() - new Date(a.lastRequest).getTime()
    })

    // Calculate stats
    const totalCustomers = customers.length
    const activeCustomers = customers.filter((c) => c.status === "active").length
    const repeatCustomers = customers.filter((c) => c.totalRequests > 1).length
    const avgRequests =
      totalCustomers > 0 ? (customers.reduce((sum, c) => sum + c.totalRequests, 0) / totalCustomers).toFixed(1) : 0

    // Apply pagination
    const offset = (page - 1) * limit
    const paginatedCustomers = customers.slice(offset, offset + limit)

    return NextResponse.json({
      customers: paginatedCustomers,
      stats: {
        totalCustomers,
        activeCustomers,
        repeatCustomers,
        avgRequests,
      },
      pagination: {
        page,
        limit,
        total: totalCustomers,
        totalPages: Math.ceil(totalCustomers / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}
