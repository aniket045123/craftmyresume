"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Loader2, CheckCircle } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { useToast } from "@/hooks/use-toast"

interface Settings {
  businessName: string
  businessEmail: string
  businessPhone: string
  autoResponseEnabled: boolean
  autoResponseMessage: string
  notificationEmail: string
  emailNotificationsEnabled: boolean
  slackWebhookUrl: string
  slackNotificationsEnabled: boolean
  defaultTurnaroundHours: number
  maxFileSize: number
  allowedFileTypes: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    businessName: "CraftMyResume",
    businessEmail: "admin@craftmyresume.com",
    businessPhone: "+1 (555) 123-4567",
    autoResponseEnabled: true,
    autoResponseMessage: "Thank you for your resume request! We'll get back to you within 24 hours.",
    notificationEmail: "notifications@craftmyresume.com",
    emailNotificationsEnabled: true,
    slackWebhookUrl: "",
    slackNotificationsEnabled: false,
    defaultTurnaroundHours: 24,
    maxFileSize: 10,
    allowedFileTypes: "pdf,doc,docx",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...settings, ...data })
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        toast({
          title: "Settings saved",
          description: "Your settings have been updated successfully.",
        })
        setTimeout(() => setSaved(false), 2000)
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <AdminHeader title="Settings" description="Configure your admin dashboard and business settings" />

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Basic information about your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => updateSetting("businessName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Business Email</Label>
              <Input
                id="businessEmail"
                type="email"
                value={settings.businessEmail}
                onChange={(e) => updateSetting("businessEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input
                id="businessPhone"
                value={settings.businessPhone}
                onChange={(e) => updateSetting("businessPhone", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto Response Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto Response</CardTitle>
          <CardDescription>Automatic email responses to new requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto Response</Label>
              <p className="text-sm text-muted-foreground">Send automatic confirmation emails to customers</p>
            </div>
            <Switch
              checked={settings.autoResponseEnabled}
              onCheckedChange={(checked) => updateSetting("autoResponseEnabled", checked)}
            />
          </div>
          {settings.autoResponseEnabled && (
            <div className="space-y-2">
              <Label htmlFor="autoResponseMessage">Auto Response Message</Label>
              <Textarea
                id="autoResponseMessage"
                value={settings.autoResponseMessage}
                onChange={(e) => updateSetting("autoResponseMessage", e.target.value)}
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive notifications about new requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email alerts for new requests</p>
              </div>
              <Switch
                checked={settings.emailNotificationsEnabled}
                onCheckedChange={(checked) => updateSetting("emailNotificationsEnabled", checked)}
              />
            </div>
            {settings.emailNotificationsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => updateSetting("notificationEmail", e.target.value)}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Slack Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Slack Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications to Slack channel</p>
              </div>
              <Switch
                checked={settings.slackNotificationsEnabled}
                onCheckedChange={(checked) => updateSetting("slackNotificationsEnabled", checked)}
              />
            </div>
            {settings.slackNotificationsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="slackWebhookUrl">Slack Webhook URL</Label>
                <Input
                  id="slackWebhookUrl"
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={settings.slackWebhookUrl}
                  onChange={(e) => updateSetting("slackWebhookUrl", e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Service Settings</CardTitle>
          <CardDescription>Configure service delivery and file upload settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultTurnaroundHours">Default Turnaround (Hours)</Label>
              <Input
                id="defaultTurnaroundHours"
                type="number"
                min="1"
                max="168"
                value={settings.defaultTurnaroundHours}
                onChange={(e) => updateSetting("defaultTurnaroundHours", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                min="1"
                max="50"
                value={settings.maxFileSize}
                onChange={(e) => updateSetting("maxFileSize", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                placeholder="pdf,doc,docx"
                value={settings.allowedFileTypes}
                onChange={(e) => updateSetting("allowedFileTypes", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Comma-separated list of allowed file extensions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} className="min-w-32">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
