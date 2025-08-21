import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()

    const {
      fullName,
      email,
      phone,
      address,
      linkedinUrl,
      portfolioUrl,
      professionalSummary,
      targetRole,
      targetIndustry,
      workExperience,
      education,
      skills,
      certifications,
      projects,
      languages,
      achievements,
      additionalNotes,
    } = body

    // Insert into database
    const { data, error } = await supabase
      .from("resume_builds")
      .insert({
        full_name: fullName,
        email,
        phone,
        address,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        professional_summary: professionalSummary,
        target_role: targetRole,
        target_industry: targetIndustry,
        work_experience: workExperience,
        education,
        skills,
        certifications,
        projects,
        languages,
        achievements,
        additional_notes: additionalNotes,
        order_id: `BUILD-${Date.now()}`, // Generate order ID
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
      message: "Resume build request submitted successfully",
      data: data[0],
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
