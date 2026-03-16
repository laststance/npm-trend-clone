import { Resend } from "resend";

interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM ?? "npm-trends <noreply@example.com>";

/**
 * Sends an email via Resend.
 * Falls back to console logging when RESEND_API_KEY is not configured
 * (local development without email service).
 */
export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  if (!resendApiKey) {
    console.log("[email] RESEND_API_KEY not set — logging email instead:");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    if (text) console.log(`  Text: ${text}`);
    if (html) console.log(`  HTML: ${html}`);
    return;
  }

  const resend = new Resend(resendApiKey);

  const { error } = await resend.emails.send({
    from: emailFrom,
    to: [to],
    subject,
    ...(html ? { html } : { text: text ?? "" }),
  });

  if (error) {
    console.error("[email] Failed to send:", error);
  }
}
