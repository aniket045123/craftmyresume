"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Target,
  Loader2,
  Award,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"

interface AnalyticsData {
  keyMetrics: {
    monthlyRevenue: number
    revenueGrowth: number
    monthlyProfit: number
    profitMargin: number
    conversionRate: number
    avgCompletionTime: number
    customerSatisfaction: number
    totalCustomers: number
  }
  financialData: {
    thisMonthRevenue: number
    thisMonthAdSpend: number
    thisMonthProfit: number
    revenuePerCustomer: number
    dailyAdSpend: number
    profitMargin: number
    totalYearRevenue: number
  }
  requestAnalytics: {
    totalRequests: number
    pendingRequests: number
    inProgressRequests: number
    completedRequests: number
    cancelledRequests: number
    completionRate: number
    updateRequests: number
    buildRequests: number
    updatePercentage: number
    buildPercentage: number
  }
  customerData: {
    totalCustomers: number
    firstTimeCustomers: number
    repeatCustomers: number
    vipCustomers: number
    thisMonthCustomers: number
    customerLifetimeValue: number
  }
  websiteTraffic: {
    totalVisitors: number
    uniqueVisitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: number
    topPages: Array<{
      page: string
      views: number
      conversionRate: number
    }>
  }
  performanceMetrics: {
    responseTime: number
    firstDraftTime: number
    revisionTime: number
    finalDeliveryTime: number
    revisionRate: number
    customerRetentionRate: number
    referralRate: number
  }
  monthlyData: Array<{
    month: string
    requests: number
    leads: number
    revenue: number
    adSpend: number
    profit: number
    conversionRate: number
  }>
  insights: {
    positive: string[]
    improvements: string[]
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/analytics")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch analytics")
      }

      const data: AnalyticsData = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Analytics fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <p className="text-red-500 font-medium">Error loading analytics</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <Button onClick={fetchAnalytics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="flex flex-col gap-6 p-6">
      <AdminHeader title="Analytics Dashboard" description="Comprehensive business insights and performance metrics" />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analytics.keyMetrics.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {analytics.keyMetrics.revenueGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  {analytics.keyMetrics.revenueGrowth >= 0 ? "+" : ""}
                  {analytics.keyMetrics.revenueGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analytics.keyMetrics.monthlyProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3 text-blue-500" />
                  {analytics.keyMetrics.profitMargin}% profit margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.keyMetrics.conversionRate}%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3 text-green-500" />
                  Leads to customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.keyMetrics.customerSatisfaction}/5</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  Excellent rating
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Ad Spend</CardTitle>
                <CardDescription>Monthly comparison over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.monthlyData.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-green-600">₹{month.revenue.toLocaleString()}</span>
                          <span className="text-red-600">₹{month.adSpend.toLocaleString()}</span>
                          <span className={`font-medium ${month.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ₹{month.profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-2">
                        <div
                          className="bg-green-500 rounded-sm"
                          style={{
                            width: `${Math.max((month.revenue / Math.max(...analytics.monthlyData.map((m) => m.revenue))) * 100, 5)}%`,
                          }}
                        />
                        <div
                          className="bg-red-500 rounded-sm"
                          style={{
                            width: `${Math.max((month.adSpend / Math.max(...analytics.monthlyData.map((m) => m.adSpend))) * 100, 5)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span>Revenue</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <span>Ad Spend</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Status Overview</CardTitle>
                <CardDescription>Current status of all resume requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics.requestAnalytics.completedRequests}</span>
                    <Badge variant="secondary">{analytics.requestAnalytics.completionRate}%</Badge>
                  </div>
                </div>
                <Progress value={analytics.requestAnalytics.completionRate} className="h-2" />

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {analytics.requestAnalytics.pendingRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.requestAnalytics.inProgressRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Business Insights</CardTitle>
              <CardDescription>Key trends and areas for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Positive Trends
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {analytics.insights.positive.map((trend, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-orange-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {analytics.insights.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>This month's financial overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Revenue</span>
                  <span className="font-bold text-green-600">
                    ₹{analytics.financialData.thisMonthRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ad Spend</span>
                  <span className="font-bold text-red-600">
                    ₹{analytics.financialData.thisMonthAdSpend.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Profit</span>
                    <span
                      className={`font-bold ${analytics.financialData.thisMonthProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ₹{analytics.financialData.thisMonthProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Per customer metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenue per Customer</span>
                  <span className="font-bold">₹{analytics.financialData.revenuePerCustomer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Daily Ad Spend</span>
                  <span className="font-bold">₹{analytics.financialData.dailyAdSpend}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Lifetime Value</span>
                  <span className="font-bold text-blue-600">₹{analytics.customerData.customerLifetimeValue}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yearly Overview</CardTitle>
                <CardDescription>Annual performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Year Revenue</span>
                  <span className="font-bold text-green-600">
                    ₹{analytics.financialData.totalYearRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profit Margin</span>
                  <Badge variant={analytics.financialData.profitMargin >= 30 ? "default" : "secondary"}>
                    {analytics.financialData.profitMargin}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Customer breakdown by engagement level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">First-time Customers</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics.customerData.firstTimeCustomers}</span>
                    <Badge variant="outline">
                      {analytics.customerData.totalCustomers > 0
                        ? Math.round(
                            (analytics.customerData.firstTimeCustomers / analytics.customerData.totalCustomers) * 100,
                          )
                        : 0}
                      %
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Repeat Customers</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics.customerData.repeatCustomers}</span>
                    <Badge variant="outline">
                      {analytics.customerData.totalCustomers > 0
                        ? Math.round(
                            (analytics.customerData.repeatCustomers / analytics.customerData.totalCustomers) * 100,
                          )
                        : 0}
                      %
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">VIP Customers (5+ orders)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics.customerData.vipCustomers}</span>
                    <Badge variant="outline">
                      {analytics.customerData.totalCustomers > 0
                        ? Math.round(
                            (analytics.customerData.vipCustomers / analytics.customerData.totalCustomers) * 100,
                          )
                        : 0}
                      %
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Preferences</CardTitle>
                <CardDescription>Distribution of service types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Resume Updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics.requestAnalytics.updateRequests}</span>
                    <Badge variant="secondary">{analytics.requestAnalytics.updatePercentage}%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Build from Scratch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics.requestAnalytics.buildRequests}</span>
                    <Badge variant="secondary">{analytics.requestAnalytics.buildPercentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${analytics.requestAnalytics.updatePercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
                <CardDescription>Average response times by stage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Initial Response</span>
                  <Badge variant="outline">{analytics.performanceMetrics.responseTime}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">First Draft</span>
                  <Badge variant="outline">{analytics.performanceMetrics.firstDraftTime}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revisions</span>
                  <Badge variant="outline">{analytics.performanceMetrics.revisionTime}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Final Delivery</span>
                  <Badge variant="outline">{analytics.performanceMetrics.finalDeliveryTime}h</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Service quality indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completion Rate</span>
                  <Badge variant={analytics.requestAnalytics.completionRate >= 90 ? "default" : "secondary"}>
                    {analytics.requestAnalytics.completionRate}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revision Rate</span>
                  <Badge variant={analytics.performanceMetrics.revisionRate <= 20 ? "default" : "destructive"}>
                    {analytics.performanceMetrics.revisionRate}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Retention</span>
                  <Badge variant="default">{analytics.performanceMetrics.customerRetentionRate}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Referral Rate</span>
                  <Badge variant="default">{analytics.performanceMetrics.referralRate}%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Score</CardTitle>
                <CardDescription>Overall performance rating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {Math.round(
                      (analytics.requestAnalytics.completionRate +
                        analytics.performanceMetrics.customerRetentionRate +
                        (100 - analytics.performanceMetrics.revisionRate)) /
                        3,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <Progress
                  value={Math.round(
                    (analytics.requestAnalytics.completionRate +
                      analytics.performanceMetrics.customerRetentionRate +
                      (100 - analytics.performanceMetrics.revisionRate)) /
                      3,
                  )}
                  className="h-2"
                />
                <div className="text-xs text-center text-muted-foreground">
                  Based on completion rate, retention, and quality metrics
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Website Traffic</CardTitle>
                <CardDescription>Visitor statistics and engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.websiteTraffic.totalVisitors.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Visitors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.websiteTraffic.uniqueVisitors.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Unique Visitors</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.websiteTraffic.pageViews.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Page Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.websiteTraffic.bounceRate}%</div>
                    <div className="text-xs text-muted-foreground">Bounce Rate</div>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <div className="text-lg font-bold">{analytics.websiteTraffic.avgSessionDuration} min</div>
                  <div className="text-xs text-muted-foreground">Avg. Session Duration</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages and their conversion rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.websiteTraffic.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm font-medium">{page.page}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">{page.views.toLocaleString()} views</span>
                      <Badge variant={page.conversionRate >= 2 ? "default" : "secondary"}>
                        {page.conversionRate}% CVR
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
