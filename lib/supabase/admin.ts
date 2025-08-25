import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create admin client with service role key to bypass RLS
export const createAdminClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper functions for admin operations
export const adminOperations = {
  // Check if user is admin
  async checkAdminPrivileges(email: string) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Admin check error:", error)
      return { isAdmin: false, error: error.message }
    }

    return { isAdmin: !!data, adminUser: data }
  },

  // Update last login
  async updateLastLogin(email: string) {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("email", email)

    if (error) {
      console.error("Update last login error:", error)
    }
  },

  // Get comprehensive analytics data
  async getAnalyticsData() {
    const supabase = createAdminClient()

    try {
      // Get all leads
      const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

      // Get all resume requests (combining updates and builds)
      const { data: resumeUpdates } = await supabase
        .from("resume_updates")
        .select("*")
        .order("created_at", { ascending: false })

      const { data: resumeBuilds } = await supabase
        .from("resume_builds")
        .select("*")
        .order("created_at", { ascending: false })

      // Combine all requests
      const allRequests = [
        ...(resumeUpdates || []).map((r) => ({ ...r, type: "update", service_type: "Resume Update" })),
        ...(resumeBuilds || []).map((r) => ({ ...r, type: "build", service_type: "Resume Build" })),
      ]

      // Calculate date ranges
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      const thisYear = new Date(now.getFullYear(), 0, 1)

      // Revenue calculations (Rs. 499 per customer)
      const REVENUE_PER_CUSTOMER = 499
      const DAILY_AD_SPEND = 500

      // This month data
      const thisMonthRequests = allRequests.filter((r) => new Date(r.created_at) >= thisMonth)
      const thisMonthLeads = (leads || []).filter((l) => new Date(l.created_at) >= thisMonth)
      const thisMonthRevenue = thisMonthRequests.length * REVENUE_PER_CUSTOMER

      // Last month data
      const lastMonthRequests = allRequests.filter(
        (r) => new Date(r.created_at) >= lastMonth && new Date(r.created_at) <= lastMonthEnd,
      )
      const lastMonthRevenue = lastMonthRequests.length * REVENUE_PER_CUSTOMER

      // Calculate growth
      const revenueGrowth =
        lastMonthRevenue > 0
          ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
          : thisMonthRevenue > 0
            ? 100
            : 0

      // Conversion rate (leads to customers)
      const conversionRate =
        thisMonthLeads.length > 0 ? Math.round((thisMonthRequests.length / thisMonthLeads.length) * 100) : 0

      // Ad spend and profit calculations
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      const currentDay = now.getDate()
      const thisMonthAdSpend = currentDay * DAILY_AD_SPEND
      const thisMonthProfit = thisMonthRevenue - thisMonthAdSpend
      const profitMargin = thisMonthRevenue > 0 ? Math.round((thisMonthProfit / thisMonthRevenue) * 100) : 0

      // Request status breakdown
      const pendingRequests = allRequests.filter((r) => r.status === "pending").length
      const inProgressRequests = allRequests.filter((r) => r.status === "in_progress").length
      const completedRequests = allRequests.filter((r) => r.status === "completed").length
      const cancelledRequests = allRequests.filter((r) => r.status === "cancelled").length

      // Completion rate
      const totalRequests = allRequests.length
      const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0

      // Average completion time (mock calculation based on status)
      const avgCompletionTime = 24 // hours (you can calculate this from actual data)

      // Customer satisfaction (mock - you'd get this from feedback)
      const customerSatisfaction = 4.7

      // Monthly trend data (last 6 months)
      const monthlyData = []
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

        const monthRequests = allRequests.filter((r) => {
          const date = new Date(r.created_at)
          return date >= monthStart && date <= monthEnd
        })

        const monthLeads = (leads || []).filter((l) => {
          const date = new Date(l.created_at)
          return date >= monthStart && date <= monthEnd
        })

        const monthRevenue = monthRequests.length * REVENUE_PER_CUSTOMER
        const monthDays = monthEnd.getDate()
        const monthAdSpend = monthDays * DAILY_AD_SPEND
        const monthProfit = monthRevenue - monthAdSpend

        monthlyData.push({
          month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          requests: monthRequests.length,
          leads: monthLeads.length,
          revenue: monthRevenue,
          adSpend: monthAdSpend,
          profit: monthProfit,
          conversionRate: monthLeads.length > 0 ? Math.round((monthRequests.length / monthLeads.length) * 100) : 0,
        })
      }

      // Service type breakdown
      const updateRequests = allRequests.filter((r) => r.type === "update").length
      const buildRequests = allRequests.filter((r) => r.type === "build").length

      // Customer segments (based on email frequency)
      const customerEmails = new Set([
        ...(resumeUpdates || []).map((r) => r.email),
        ...(resumeBuilds || []).map((r) => r.email),
      ])

      const customerRequestCounts = new Map()
      allRequests.forEach((r) => {
        const email = r.email
        customerRequestCounts.set(email, (customerRequestCounts.get(email) || 0) + 1)
      })

      const firstTimeCustomers = Array.from(customerRequestCounts.values()).filter((count) => count === 1).length
      const repeatCustomers = Array.from(customerRequestCounts.values()).filter(
        (count) => count > 1 && count < 5,
      ).length
      const vipCustomers = Array.from(customerRequestCounts.values()).filter((count) => count >= 5).length

      // Website traffic (mock data - you'd integrate with Google Analytics)
      const websiteTraffic = {
        totalVisitors: 2847,
        uniqueVisitors: 2156,
        pageViews: 8934,
        bounceRate: 34,
        avgSessionDuration: 3.2, // minutes
        topPages: [
          { page: "/", views: 3421, conversionRate: 2.8 },
          { page: "/thankyou", views: 1234, conversionRate: 100 },
          { page: "/page2", views: 987, conversionRate: 1.2 },
        ],
      }

      // Performance metrics
      const performanceMetrics = {
        responseTime: 2.1, // hours
        firstDraftTime: 18, // hours
        revisionTime: 6, // hours
        finalDeliveryTime: 24, // hours
        revisionRate: 15, // percentage
        customerRetentionRate: 68, // percentage
        referralRate: 23, // percentage
      }

      return {
        // Key metrics
        keyMetrics: {
          monthlyRevenue: thisMonthRevenue,
          revenueGrowth,
          monthlyProfit: thisMonthProfit,
          profitMargin,
          conversionRate,
          avgCompletionTime,
          customerSatisfaction,
          totalCustomers: customerEmails.size,
        },

        // Financial data
        financialData: {
          thisMonthRevenue,
          thisMonthAdSpend,
          thisMonthProfit,
          revenuePerCustomer: REVENUE_PER_CUSTOMER,
          dailyAdSpend: DAILY_AD_SPEND,
          profitMargin,
          totalYearRevenue: allRequests.filter((r) => new Date(r.created_at) >= thisYear).length * REVENUE_PER_CUSTOMER,
        },

        // Request analytics
        requestAnalytics: {
          totalRequests,
          pendingRequests,
          inProgressRequests,
          completedRequests,
          cancelledRequests,
          completionRate,
          updateRequests,
          buildRequests,
          updatePercentage: totalRequests > 0 ? Math.round((updateRequests / totalRequests) * 100) : 0,
          buildPercentage: totalRequests > 0 ? Math.round((buildRequests / totalRequests) * 100) : 0,
        },

        // Customer data
        customerData: {
          totalCustomers: customerEmails.size,
          firstTimeCustomers,
          repeatCustomers,
          vipCustomers,
          thisMonthCustomers: thisMonthRequests.length,
          customerLifetimeValue: REVENUE_PER_CUSTOMER * 1.5, // assuming some customers return
        },

        // Website traffic
        websiteTraffic,

        // Performance metrics
        performanceMetrics,

        // Monthly trends
        monthlyData,

        // Insights and trends
        insights: {
          positive: [
            `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}% revenue growth this month`,
            `${conversionRate}% conversion rate from leads to customers`,
            `${completionRate}% completion rate for all requests`,
            `${performanceMetrics.customerRetentionRate}% customer retention rate`,
            `${performanceMetrics.referralRate}% of customers come from referrals`,
          ],
          improvements: [
            `${performanceMetrics.revisionRate}% of projects require revisions`,
            `Average response time could be improved (${performanceMetrics.responseTime}h)`,
            `Bounce rate is ${websiteTraffic.bounceRate}% - could be optimized`,
            `Ad spend efficiency: Rs.${Math.round(thisMonthAdSpend / thisMonthRequests.length || 0)} per customer`,
          ],
        },
      }
    } catch (error) {
      console.error("Analytics data error:", error)
      throw error
    }
  },

  // Get dashboard stats
  async getDashboardStats() {
    const supabase = createAdminClient()

    try {
      // Get leads count
      const { count: totalLeads } = await supabase.from("leads").select("*", { count: "exact", head: true })

      // Get resume requests stats
      const { data: resumeUpdates } = await supabase.from("resume_updates").select("status, created_at")
      const { data: resumeBuilds } = await supabase.from("resume_builds").select("status, created_at")

      const allRequests = [...(resumeUpdates || []), ...(resumeBuilds || [])]
      const totalRequests = allRequests.length
      const pendingRequests = allRequests.filter((r) => r.status === "pending").length
      const completedRequests = allRequests.filter((r) => r.status === "completed").length
      const inProgressRequests = allRequests.filter((r) => r.status === "in_progress").length

      // Calculate this month's stats
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)

      const thisMonthRequests = allRequests.filter((r) => new Date(r.created_at) >= thisMonth).length

      const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0
      const totalRevenue = completedRequests * 499 // Rs. 499 per customer

      return {
        totalLeads: totalLeads || 0,
        totalRequests,
        pendingRequests,
        completedRequests,
        inProgressRequests,
        thisMonthRequests,
        completionRate,
        totalRevenue,
        thisMonthCustomers: thisMonthRequests,
      }
    } catch (error) {
      console.error("Dashboard stats error:", error)
      throw error
    }
  },
}
