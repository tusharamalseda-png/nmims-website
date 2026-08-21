import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

export async function sendNewLeadNotification(lead: {
  name: string;
  email?: string | null;
  phone?: string | null;
  program?: string | null;
  state?: string | null;
  sourcePage?: string | null;
}) {
  if (!resend || !NOTIFY_EMAIL) return { skipped: true };

  return resend.emails.send({
    from: FROM,
    to: NOTIFY_EMAIL,
    subject: `New enquiry: ${lead.name}${lead.program ? ` — ${lead.program}` : ""}`,
    html: `
      <h2>New website enquiry</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      ${lead.email ? `<p><strong>Email:</strong> ${lead.email}</p>` : ""}
      ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ""}
      ${lead.program ? `<p><strong>Program:</strong> ${lead.program}</p>` : ""}
      ${lead.state ? `<p><strong>State:</strong> ${lead.state}</p>` : ""}
      ${lead.sourcePage ? `<p><strong>Source page:</strong> ${lead.sourcePage}</p>` : ""}
    `,
  });
}

export async function sendLeadReply(to: string, subject: string, message: string) {
  if (!resend) throw new Error("Email is not configured (missing RESEND_API_KEY).");
  return resend.emails.send({
    from: FROM,
    to,
    subject,
    html: message.replace(/\n/g, "<br>"),
  });
}
