import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export type LeadPayload = {
  id?: string | null
  created_at?: string | null
  name: string | null
  email: string | null
  phone: string | null
  message: string | null
  plan: string | null
  source: string | null
  user_agent: string | null
  referrer: string | null
  ip: string | null
}

export { resend }

function toText(lead: LeadPayload) {
  return [
    `New lead received`,
    ``,
    `Name: ${lead.name || "-"}`,
    `Email: ${lead.email || "-"}`,
    `Phone: ${lead.phone || "-"}`,
    `Plan: ${lead.plan || "-"}`,
    `Message:`,
    `${lead.message || "-"}`,
    ``,
    `Meta:`,
    `Created: ${lead.created_at || "-"}`,
    `Referrer: ${lead.referrer || "-"}`,
    `Source: ${lead.source || "-"}`,
    `IP: ${lead.ip || "-"}`,
    `User-Agent: ${lead.user_agent || "-"}`,
    `ID: ${lead.id || "-"}`,
  ].join("\n")
}

function toHtml(lead: LeadPayload) {
  const cell = (label: string, value?: string | null) =>
    `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">${label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${value ? String(value) : "-"}</td></tr>`

  return `<!doctype html>
<html>
  <body style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif; color:#0b1211; background:#ffffff; padding:20px">
    <h2 style="margin:0 0 12px 0;">New Lead • CraftMyResume</h2>
    <p style="margin:0 0 16px 0; color:#374151;">You received a new lead from your website.</p>
    <table style="border-collapse: collapse; width:100%; max-width:640px">
      ${cell("Name", lead.name)}
      ${cell("Email", lead.email)}
      ${cell("Phone", lead.phone)}
      ${cell("Plan", lead.plan)}
      ${cell("Message", lead.message)}
      ${cell("Created", lead.created_at)}
      ${cell("Referrer", lead.referrer)}
      ${cell("Source", lead.source)}
      ${cell("IP", lead.ip)}
      ${cell("User-Agent", lead.user_agent)}
      ${cell("Lead ID", lead.id)}
    </table>
    <p style="margin-top:16px;color:#6b7280;font-size:12px">Tip: Reply to this email to respond directly to the lead.</p>
  </body>
</html>`
}

export async function sendLeadNotification(lead: LeadPayload) {
  const to = process.env.LEADS_NOTIFY_TO
  const from = process.env.LEADS_NOTIFY_FROM || "CraftMyResume <onboarding@resend.dev>"

  if (!resend || !to) {
    return {
      sent: false,
      reason: !resend ? "Missing RESEND_API_KEY" : "Missing LEADS_NOTIFY_TO",
    }
  }

  const subject = `New Lead${lead.plan ? ` — ${lead.plan}` : ""}: ${lead.name || "Website"}`
  try {
    const res = await resend.emails.send({
      from,
      to,
      subject,
      html: toHtml(lead),
      text: toText(lead),
      // Make replying easy for your team:
      reply_to: lead.email || undefined,
      headers: {
        "X-Entity-Ref-ID": lead.id || "",
      },
      tags: [
        { name: "app", value: "craftmyresume" },
        { name: "event", value: "lead" },
      ],
    })
    return { sent: true, id: res.data?.id }
  } catch (err) {
    console.error("Resend send error:", err)
    return { sent: false, reason: "send_error" }
  }
}
