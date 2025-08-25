"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  Search,
  Eye,
  Download,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { useSearchParams, useRouter } from "next/navigation"

interface ResumeRequest {
  id: string
  originalId: number
  customer: string
  email: string
  phone: string
  type: string
  status: string
  priority: string
  submittedAt: string
  details: string
  hasFile: boolean
  fileUrl: string | null
  orderId: string
  requestType: string
}

interface RequestsResponse {
  requests: ResumeRequest[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function ResumeRequestsPage() {
  const [requests, setRequests] = useState<ResumeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  })

  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all")
  const [selectedRequest, setSelectedRequest] = useState<ResumeRequest | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [searchTerm, statusFilter, typeFilter, pagination.page])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (typeFilter !== "all") params.append("type", typeFilter)

      const response = await fetch(`/api/admin/requests?${params}`)
      if (!response.ok) throw new Error("Failed to fetch requests")

      const data: RequestsResponse = await response.json()
      setRequests(data.requests)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, newStatus: string, requestType: string) => {
    try {
      setUpdating(requestId)
      const response = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: newStatus, requestType }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      // Refresh the requests
      await fetchRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "in-progress":
        return "secondary"
      case "completed":
        return "default"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileName
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={fetchRequests}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <AdminHeader title="Resume Requests" description="Manage all resume update and build requests" />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
          <CardDescription>Search and filter resume requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, email, or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Update">Updates</SelectItem>
                <SelectItem value="Build from Scratch">Build from Scratch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests ({pagination.total})</CardTitle>
          <CardDescription>Complete list of resume requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{request.customer}</span>
                          <span className="text-sm text-muted-foreground">{request.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {request.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={request.status}
                          onValueChange={(newStatus) => updateRequestStatus(request.id, newStatus, request.requestType)}
                          disabled={updating === request.id}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge
                                variant={getStatusVariant(request.status)}
                                className="flex items-center gap-1 w-fit"
                              >
                                {updating === request.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  getStatusIcon(request.status)
                                )}
                                {request.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(request.priority)} border-0`}>{request.priority}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{request.submittedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Request Details - {request.id}</DialogTitle>
                                <DialogDescription>Complete information for this resume request</DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Customer Name</label>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.customer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Phone</label>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.phone}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Order ID</label>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.orderId}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Details</label>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedRequest.details}</p>
                                  </div>
                                  {selectedRequest.hasFile && selectedRequest.fileUrl && (
                                    <div>
                                      <label className="text-sm font-medium">Uploaded File</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleDownloadFile(
                                              selectedRequest.fileUrl!,
                                              `${selectedRequest.customer}_resume.pdf`,
                                            )
                                          }
                                        >
                                          <Download className="h-4 w-4 mr-2" />
                                          Download Resume
                                        </Button>
                                        <Button size="sm" variant="outline" asChild>
                                          <a href={selectedRequest.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View File
                                          </a>
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {request.hasFile && request.fileUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadFile(request.fileUrl!, `${request.customer}_resume.pdf`)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}

                          <Button size="sm" variant="outline" asChild>
                            <a href={`mailto:${request.email}?subject=Regarding your resume request ${request.id}`}>
                              <MessageSquare className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} requests
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
