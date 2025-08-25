"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Upload, FileText, Plus, Trash2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ThankYouPage() {
  const [showBuildForm, setShowBuildForm] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)

  // Resume Update Form State
  const [updateForm, setUpdateForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    additionalDetails: "",
  })

  // Build from Scratch Form State
  const [buildForm, setBuildForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedinUrl: "",
    portfolioUrl: "",
    professionalSummary: "",
    targetRole: "",
    targetIndustry: "",
    workExperience: [{ company: "", position: "", duration: "", description: "" }],
    education: [{ institution: "", degree: "", year: "", gpa: "" }],
    skills: [{ category: "Technical", items: "" }],
    certifications: [{ name: "", issuer: "", year: "" }],
    projects: [{ name: "", description: "", technologies: "" }],
    languages: [{ language: "", proficiency: "" }],
    achievements: "",
    additionalNotes: "",
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        setSubmitError("Please upload a PDF, DOC, or DOCX file")
        return
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError("File size must be less than 10MB")
        return
      }

      setResumeFile(file)
      setSubmitError(null)
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitWarning(null)

    try {
      const formData = new FormData()
      formData.append("customerName", updateForm.customerName)
      formData.append("email", updateForm.email)
      formData.append("phone", updateForm.phone)
      formData.append("additionalDetails", updateForm.additionalDetails)
      if (resumeFile) {
        formData.append("resumeFile", resumeFile)
      }

      const response = await fetch("/api/resume-update", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitSuccess(true)
        if (result.message.includes("Note:")) {
          setSubmitWarning(
            "File upload had an issue, but your request was saved. Please email your resume to support@craftmyresume.com",
          )
        }
      } else {
        setSubmitError(result.error || "Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBuildSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/resume-build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildForm),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitSuccess(true)
        setShowBuildForm(false)
      } else {
        setSubmitError(result.error || "Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addArrayItem = (field: string, newItem: any) => {
    setBuildForm((prev) => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[]), newItem],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setBuildForm((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index),
    }))
  }

  const updateArrayItem = (field: string, index: number, updatedItem: any) => {
    setBuildForm((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).map((item, i) => (i === index ? updatedItem : item)),
    }))
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">
              We've received your information and will start working on your resume within 24 hours.
            </p>
            {submitWarning && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{submitWarning}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-gray-500">You'll receive updates via email and WhatsApp.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Purchase!</h1>
            <p className="text-lg text-gray-600">
              Your payment has been processed successfully. Let's get started on crafting your perfect resume.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {submitError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Resume Update Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Update Your Existing Resume
            </CardTitle>
            <CardDescription>Upload your current resume and tell us what changes you'd like to make</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={updateForm.customerName}
                    onChange={(e) => setUpdateForm((prev) => ({ ...prev, customerName: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={updateForm.email}
                    onChange={(e) => setUpdateForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={updateForm.phone}
                  onChange={(e) => setUpdateForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="resumeUpload">Upload Your Current Resume (Optional)</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="resumeUpload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="resumeUpload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    {resumeFile && <p className="text-sm text-emerald-600 font-medium">{resumeFile.name}</p>}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  If file upload doesn't work, you can email your resume to support@craftmyresume.com
                </p>
              </div>

              <div>
                <Label htmlFor="additionalDetails">Additional Details *</Label>
                <Textarea
                  id="additionalDetails"
                  placeholder="Please describe what changes you'd like to make to your resume. For example:
- Add new work experience at XYZ Company (2023-2024)
- Update skills section with Python, React
- Add new certification in AWS
- Modify professional summary
- Change resume format/design"
                  value={updateForm.additionalDetails}
                  onChange={(e) => setUpdateForm((prev) => ({ ...prev, additionalDetails: e.target.value }))}
                  required
                  rows={6}
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Resume Update Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Alternative Option */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Don't have a Resume?</h3>
              <p className="text-gray-600 mb-6">
                No worries! Fill out our detailed form and we'll build your resume from scratch.
              </p>

              <Dialog open={showBuildForm} onOpenChange={setShowBuildForm}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    Fill Details Form
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Build Your Resume from Scratch</DialogTitle>
                    <DialogDescription>
                      Fill out all the details below and we'll create a professional resume for you.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleBuildSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={buildForm.fullName}
                            onChange={(e) => setBuildForm((prev) => ({ ...prev, fullName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="buildEmail">Email Address *</Label>
                          <Input
                            id="buildEmail"
                            type="email"
                            value={buildForm.email}
                            onChange={(e) => setBuildForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="buildPhone">Phone Number *</Label>
                          <Input
                            id="buildPhone"
                            value={buildForm.phone}
                            onChange={(e) => setBuildForm((prev) => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={buildForm.address}
                            onChange={(e) => setBuildForm((prev) => ({ ...prev, address: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                          <Input
                            id="linkedinUrl"
                            value={buildForm.linkedinUrl}
                            onChange={(e) => setBuildForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolioUrl">Portfolio/Website URL</Label>
                          <Input
                            id="portfolioUrl"
                            value={buildForm.portfolioUrl}
                            onChange={(e) => setBuildForm((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Professional Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="targetRole">Target Role/Position</Label>
                          <Input
                            id="targetRole"
                            value={buildForm.targetRole}
                            onChange={(e) => setBuildForm((prev) => ({ ...prev, targetRole: e.target.value }))}
                            placeholder="e.g., Software Engineer, Marketing Manager"
                          />
                        </div>
                        <div>
                          <Label htmlFor="targetIndustry">Target Industry</Label>
                          <Input
                            id="targetIndustry"
                            value={buildForm.targetIndustry}
                            onChange={(e) => setBuildForm((prev) => ({ ...prev, targetIndustry: e.target.value }))}
                            placeholder="e.g., Technology, Healthcare, Finance"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="professionalSummary">Professional Summary</Label>
                        <Textarea
                          id="professionalSummary"
                          value={buildForm.professionalSummary}
                          onChange={(e) => setBuildForm((prev) => ({ ...prev, professionalSummary: e.target.value }))}
                          placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">Work Experience</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addArrayItem("workExperience", { company: "", position: "", duration: "", description: "" })
                          }
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Experience
                        </Button>
                      </div>
                      {buildForm.workExperience.map((exp, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="font-medium">Experience {index + 1}</h5>
                            {buildForm.workExperience.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem("workExperience", index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Company Name</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) =>
                                  updateArrayItem("workExperience", index, { ...exp, company: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Position/Job Title</Label>
                              <Input
                                value={exp.position}
                                onChange={(e) =>
                                  updateArrayItem("workExperience", index, { ...exp, position: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Duration</Label>
                              <Input
                                value={exp.duration}
                                onChange={(e) =>
                                  updateArrayItem("workExperience", index, { ...exp, duration: e.target.value })
                                }
                                placeholder="e.g., Jan 2020 - Present"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label>Job Description & Achievements</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) =>
                                updateArrayItem("workExperience", index, { ...exp, description: e.target.value })
                              }
                              placeholder="Describe your responsibilities, achievements, and key contributions..."
                              rows={3}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">Education</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem("education", { institution: "", degree: "", year: "", gpa: "" })}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Education
                        </Button>
                      </div>
                      {buildForm.education.map((edu, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="font-medium">Education {index + 1}</h5>
                            {buildForm.education.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem("education", index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Institution/University</Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) =>
                                  updateArrayItem("education", index, { ...edu, institution: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Degree/Course</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) =>
                                  updateArrayItem("education", index, { ...edu, degree: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Year of Completion</Label>
                              <Input
                                value={edu.year}
                                onChange={(e) => updateArrayItem("education", index, { ...edu, year: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>GPA/Percentage (Optional)</Label>
                              <Input
                                value={edu.gpa}
                                onChange={(e) => updateArrayItem("education", index, { ...edu, gpa: e.target.value })}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">Skills</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem("skills", { category: "", items: "" })}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Skill Category
                        </Button>
                      </div>
                      {buildForm.skills.map((skill, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="font-medium">Skill Category {index + 1}</h5>
                            {buildForm.skills.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem("skills", index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Category</Label>
                              <Select
                                value={skill.category}
                                onValueChange={(value) =>
                                  updateArrayItem("skills", index, { ...skill, category: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Technical">Technical Skills</SelectItem>
                                  <SelectItem value="Programming">Programming Languages</SelectItem>
                                  <SelectItem value="Software">Software & Tools</SelectItem>
                                  <SelectItem value="Languages">Languages</SelectItem>
                                  <SelectItem value="Soft">Soft Skills</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Skills (comma-separated)</Label>
                              <Input
                                value={skill.items}
                                onChange={(e) => updateArrayItem("skills", index, { ...skill, items: e.target.value })}
                                placeholder="e.g., JavaScript, React, Node.js, Python"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Additional Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Certifications */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">Certifications</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem("certifications", { name: "", issuer: "", year: "" })}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        {buildForm.certifications.map((cert, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium">Certification {index + 1}</span>
                              {buildForm.certifications.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeArrayItem("certifications", index)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Input
                                placeholder="Certification Name"
                                value={cert.name}
                                onChange={(e) =>
                                  updateArrayItem("certifications", index, { ...cert, name: e.target.value })
                                }
                              />
                              <Input
                                placeholder="Issuing Organization"
                                value={cert.issuer}
                                onChange={(e) =>
                                  updateArrayItem("certifications", index, { ...cert, issuer: e.target.value })
                                }
                              />
                              <Input
                                placeholder="Year"
                                value={cert.year}
                                onChange={(e) =>
                                  updateArrayItem("certifications", index, { ...cert, year: e.target.value })
                                }
                              />
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Languages */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">Languages</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem("languages", { language: "", proficiency: "" })}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        {buildForm.languages.map((lang, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium">Language {index + 1}</span>
                              {buildForm.languages.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeArrayItem("languages", index)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Input
                                placeholder="Language"
                                value={lang.language}
                                onChange={(e) =>
                                  updateArrayItem("languages", index, { ...lang, language: e.target.value })
                                }
                              />
                              <Select
                                value={lang.proficiency}
                                onValueChange={(value) =>
                                  updateArrayItem("languages", index, { ...lang, proficiency: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Proficiency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Native">Native</SelectItem>
                                  <SelectItem value="Fluent">Fluent</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Basic">Basic</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">Projects (Optional)</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem("projects", { name: "", description: "", technologies: "" })}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Project
                        </Button>
                      </div>
                      {buildForm.projects.map((project, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="font-medium">Project {index + 1}</h5>
                            {buildForm.projects.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem("projects", index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <Input
                              placeholder="Project Name"
                              value={project.name}
                              onChange={(e) => updateArrayItem("projects", index, { ...project, name: e.target.value })}
                            />
                            <Textarea
                              placeholder="Project Description"
                              value={project.description}
                              onChange={(e) =>
                                updateArrayItem("projects", index, { ...project, description: e.target.value })
                              }
                              rows={2}
                            />
                            <Input
                              placeholder="Technologies Used (comma-separated)"
                              value={project.technologies}
                              onChange={(e) =>
                                updateArrayItem("projects", index, { ...project, technologies: e.target.value })
                              }
                            />
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
                      <div>
                        <Label htmlFor="achievements">Achievements & Awards</Label>
                        <Textarea
                          id="achievements"
                          value={buildForm.achievements}
                          onChange={(e) => setBuildForm((prev) => ({ ...prev, achievements: e.target.value }))}
                          placeholder="List any notable achievements, awards, or recognitions..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <Textarea
                          id="additionalNotes"
                          value={buildForm.additionalNotes}
                          onChange={(e) => setBuildForm((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                          placeholder="Any other information you'd like to include in your resume..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowBuildForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Resume Details"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
