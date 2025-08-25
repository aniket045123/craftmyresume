import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin files API called")
    const supabase = createSupabaseServerClient()

    // Test storage connection
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Storage connection failed:", bucketsError)
      return NextResponse.json({ error: "Storage connection failed" }, { status: 500 })
    }

    console.log(
      "Storage connection successful, buckets:",
      buckets?.map((b) => b.name),
    )

    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || "all"
    const status = searchParams.get("status") || "all"

    // Get files from storage
    const { data: storageFiles, error: storageError } = await supabase.storage.from("resume-files").list("updates", {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    })

    if (storageError) {
      console.error("Storage error:", storageError)
      return NextResponse.json({ error: "Storage error" }, { status: 500 })
    }

    // Get resume updates to match files with customers
    const { data: resumeUpdates, error: dbError } = await supabase
      .from("resume_updates")
      .select("id, customer_name, email, resume_file_url, created_at, status")

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Create a map of file URLs to customer info
    const fileCustomerMap = new Map()
    ;(resumeUpdates || []).forEach((update) => {
      if (update.resume_file_url) {
        const fileName = update.resume_file_url.split("/").pop()
        fileCustomerMap.set(fileName, {
          customer: update.customer_name,
          email: update.email,
          requestId: `UPD-${update.id}`,
          uploadedAt: update.created_at,
          status: update.status,
        })
      }
    })

    // Transform storage files to match our UI format
    let files = (storageFiles || [])
      .filter((file) => file.name !== ".emptyFolderPlaceholder")
      .map((file) => {
        const customerInfo = fileCustomerMap.get(file.name) || {
          customer: "Unknown",
          email: "unknown@example.com",
          requestId: "N/A",
          uploadedAt: file.created_at,
          status: "active",
        }

        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "unknown"

        return {
          id: `FILE-${file.name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 8)}`,
          name: file.name,
          customer: customerInfo.customer,
          email: customerInfo.email,
          requestId: customerInfo.requestId,
          type: fileExtension,
          size: formatFileSize(file.metadata?.size || 0),
          uploadedAt: formatDate(customerInfo.uploadedAt),
          status: customerInfo.status === "completed" ? "archived" : "active",
          downloadUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume-files/updates/${file.name}`,
        }
      })

    // Apply filters
    if (type !== "all") {
      files = files.filter((f) => f.type === type)
    }

    if (status !== "all") {
      files = files.filter((f) => f.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      files = files.filter(
        (f) =>
          f.name.toLowerCase().includes(searchLower) ||
          f.customer.toLowerCase().includes(searchLower) ||
          f.requestId.toLowerCase().includes(searchLower),
      )
    }

    // Calculate storage stats
    const totalFiles = files.length
    const totalSize = files.reduce((sum, f) => sum + parseFileSize(f.size), 0)
    const pdfFiles = files.filter((f) => f.type === "pdf").length
    const docFiles = files.filter((f) => ["doc", "docx"].includes(f.type)).length

    return NextResponse.json({
      files,
      stats: {
        totalFiles,
        totalSize: formatFileSize(totalSize),
        pdfFiles,
        docFiles,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get("file")

    if (!fileName) {
      return NextResponse.json({ error: "File name required" }, { status: 400 })
    }

    const { error } = await supabase.storage.from("resume-files").remove([`updates/${fileName}`])

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function parseFileSize(sizeStr: string): number {
  const match = sizeStr.match(/^([\d.]+)\s*([KMGT]?B)$/i)
  if (!match) return 0

  const size = Number.parseFloat(match[1])
  const unit = match[2].toUpperCase()

  const multipliers: { [key: string]: number } = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  }

  return size * (multipliers[unit] || 1)
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
