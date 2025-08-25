import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()

    // Insert into database
    const { data, error } = await supabase
      .from("resume_builds")
      .insert({
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        linkedin_url: body.linkedinUrl,
        portfolio_url: body.portfolioUrl,
        professional_summary: body.professionalSummary,
        target_role: body.targetRole,
        target_industry: body.targetIndustry,
        work_experience: body.workExperience,
        education: body.education,
        skills: body.skills,
        certifications: body.certifications,
        projects: body.projects,
        languages: body.languages,
        achievements: body.achievements,
        additional_notes: body.additionalNotes,
        order_id: `BUILD-${Date.now()}`, // Generate order ID
        status: "pending",
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

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
