import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const formData = await request.formData()

    const customerName = formData.get("customerName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const additionalDetails = formData.get("additionalDetails") as string
    const resumeFile = formData.get("resumeFile") as File | null

    let resumeFileUrl = null
    let fileUploadError = null

    // Handle file upload if present
    if (resumeFile) {
      try {
        // First, try to create the bucket if it doesn't exist
        const { data: buckets } = await supabase.storage.listBuckets()
        const bucketExists = buckets?.some((bucket) => bucket.name === "resume-files")

        if (!bucketExists) {
          const { error: createBucketError } = await supabase.storage.createBucket("resume-files", {
            public: true,
            allowedMimeTypes: [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ],
            fileSizeLimit: 10485760, // 10MB
          })

          if (createBucketError) {
            console.error("Bucket creation error:", createBucketError)
            fileUploadError = "Storage setup error"
          }
        }

        if (!fileUploadError) {
          const fileExt = resumeFile.name.split(".").pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `updates/${fileName}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("resume-files")
            .upload(filePath, resumeFile)

          if (uploadError) {
            console.error("File upload error:", uploadError)
            fileUploadError = "File upload failed"
          } else {
            const {
              data: { publicUrl },
            } = supabase.storage.from("resume-files").getPublicUrl(filePath)

            resumeFileUrl = publicUrl
          }
        }
      } catch (error) {
        console.error("Storage error:", error)
        fileUploadError = "Storage service unavailable"
      }
    }

    // Insert into database (continue even if file upload failed)
    const { data, error } = await supabase
      .from("resume_updates")
      .insert({
        customer_name: customerName,
        email,
        phone,
        additional_details: additionalDetails,
        resume_file_url: resumeFileUrl,
        order_id: `UPD-${Date.now()}`, // Generate order ID
        status: "pending",
        file_upload_error: fileUploadError,
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Send notification email (optional)
    // You can integrate with Resend here to notify your team

    const response = {
      success: true,
      message: "Resume update request submitted successfully",
      data: data[0],
    }

    // Add warning if file upload failed but form submission succeeded
    if (fileUploadError && resumeFile) {
      response.message +=
        ". Note: File upload encountered an issue, but your request has been saved. Please email your resume to support."
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
