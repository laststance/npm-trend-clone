const APP_NAME = "NPM Trends";

const COLORS = {
  primary: "#171717",
  primaryForeground: "#fafafa",
  muted: "#737373",
  border: "#e5e5e5",
  background: "#ffffff",
  surface: "#fafafa",
  accent: "#2563eb",
} as const;

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.surface};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.surface};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:${COLORS.background};border:1px solid ${COLORS.border};border-radius:12px;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <span style="font-size:20px;font-weight:700;color:${COLORS.primary};letter-spacing:-0.02em;">${APP_NAME}</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:24px 32px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:${COLORS.muted};">
                If you didn&rsquo;t request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(url: string, label: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:24px 0;">
      <a href="${url}" target="_blank" style="display:inline-block;padding:12px 32px;background-color:${COLORS.primary};color:${COLORS.primaryForeground};font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;line-height:1.4;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

/**
 * Generates styled HTML for password reset emails.
 * Uses table-based layout with inline CSS for maximum email client compatibility.
 */
export function resetPasswordEmail(url: string): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${COLORS.primary};text-align:center;">
      Reset Your Password
    </h1>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:${COLORS.muted};text-align:center;">
      We received a request to reset your password. Click the button below to choose a new one.
    </p>
    ${ctaButton(url, "Reset Password")}
    <p style="margin:0;font-size:12px;line-height:1.5;color:${COLORS.muted};text-align:center;">
      This link expires in 1 hour. If the button doesn&rsquo;t work, paste this URL into your browser:
    </p>
    <p style="margin:8px 0 0;font-size:12px;line-height:1.5;color:${COLORS.accent};word-break:break-all;text-align:center;">
      ${url}
    </p>`;

  return baseLayout(content);
}

/**
 * Generates styled HTML for email verification emails.
 * Uses table-based layout with inline CSS for maximum email client compatibility.
 */
export function verifyEmailTemplate(url: string): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${COLORS.primary};text-align:center;">
      Verify Your Email
    </h1>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:${COLORS.muted};text-align:center;">
      Thanks for signing up! Please verify your email address to get started.
    </p>
    ${ctaButton(url, "Verify Email Address")}
    <p style="margin:0;font-size:12px;line-height:1.5;color:${COLORS.muted};text-align:center;">
      This link expires in 1 hour. If the button doesn&rsquo;t work, paste this URL into your browser:
    </p>
    <p style="margin:8px 0 0;font-size:12px;line-height:1.5;color:${COLORS.accent};word-break:break-all;text-align:center;">
      ${url}
    </p>`;

  return baseLayout(content);
}
