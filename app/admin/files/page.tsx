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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FolderOpen, Search, Download, Eye, Trash2, FileText, File, Loader2, ExternalLink } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"

interface FileItem {
  id: string
  name: string
  customer: string
  email: string
  requestId: string
  type: string
  size: string
  uploadedAt: string
  status: string
  downloadUrl: string
}

interface FileStats {
  totalFiles: number
  totalSize: string
  pdfFiles: number
  docFiles: number
}

interface FilesResponse {
  files: FileItem[]
  stats: FileStats
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [stats, setStats] = useState<FileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [searchTerm, typeFilter, statusFilter])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (typeFilter !== "all") params.append("type", typeFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/admin/files?${params}`)
      if (!response.ok) throw new Error("Failed to fetch files")

      const data: FilesResponse = await response.json()
      setFiles(data.files)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const deleteFile = async (fileName: string) => {
    try {
      setDeleting(fileName)
      const response = await fetch(`/api/admin/files?file=${encodeURIComponent(fileName)}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete file")

      // Refresh the files list
      await fetchFiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file")
    } finally {
      setDeleting(null)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "docx":
      case "doc":
        return <File className="h-4 w-4 text-blue-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
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
        <Button onClick={fetchFiles}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <AdminHeader title="Files" description="Manage uploaded resumes and documents" />

      {/* File Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFiles}</div>
              <p className="text-xs text-muted-foreground">All uploaded files</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSize}</div>
              <p className="text-xs text-muted-foreground">Total storage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PDF Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pdfFiles}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalFiles > 0 ? Math.round((stats.pdfFiles / stats.totalFiles) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Word Docs</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.docFiles}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalFiles > 0 ? Math.round((stats.docFiles / stats.totalFiles) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Files</CardTitle>
          <CardDescription>Search and filter uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by filename, customer, or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF Files</SelectItem>
                <SelectItem value="docx">Word Documents</SelectItem>
                <SelectItem value="doc">Word Documents (Legacy)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Files ({files.length})</CardTitle>
          <CardDescription>Complete list of uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <div className="flex flex-col">
                          <span className="font-medium">{file.name}</span>
                          <span className="text-sm text-muted-foreground uppercase">{file.type}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{file.customer}</span>
                        <span className="text-sm text-muted-foreground">{file.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{file.requestId}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{file.size}</TableCell>
                    <TableCell className="text-sm">{file.uploadedAt}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedFile(file)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>File Details - {file.name}</DialogTitle>
                              <DialogDescription>Complete file information</DialogDescription>
                            </DialogHeader>
                            {selectedFile && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">File Name</label>
                                    <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">File Type</label>
                                    <p className="text-sm text-muted-foreground uppercase">{selectedFile.type}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">File Size</label>
                                    <p className="text-sm text-muted-foreground">{selectedFile.size}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Upload Date</label>
                                    <p className="text-sm text-muted-foreground">{selectedFile.uploadedAt}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Customer</label>
                                    <p className="text-sm text-muted-foreground">{selectedFile.customer}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Request ID</label>
                                    <p className="text-sm text-muted-foreground">{selectedFile.requestId}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={() => handleDownloadFile(selectedFile.downloadUrl, selectedFile.name)}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download File
                                  </Button>
                                  <Button variant="outline" asChild>
                                    <a href={selectedFile.downloadUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View in Browser
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadFile(file.downloadUrl, file.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" disabled={deleting === file.name}>
                              {deleting === file.name ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete File</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{file.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteFile(file.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
