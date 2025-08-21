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

    // Handle file upload if present
    if (resumeFile) {
      const fileExt = resumeFile.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `resumes/updates/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resume-files")
        .upload(filePath, resumeFile)

      if (uploadError) {
        console.error("File upload error:", uploadError)
        return NextResponse.json({ error: "File upload failed" }, { status: 500 })
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("resume-files").getPublicUrl(filePath)

      resumeFileUrl = publicUrl
    }

    // Insert into database
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
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Send notification email (optional)
    // You can integrate with Resend here to notify your team

    return NextResponse.json({
      success: true,
      message: "Resume update request submitted successfully",
      data: data[0],
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
