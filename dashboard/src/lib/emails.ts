import { resend } from './resend';

const FROM = 'AImie Solutions <hello@aimiesolutions.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard-seven-nu-97.vercel.app';

export async function sendWelcomeEmail(
  to: string,
  { name, telnyxNumber }: { name: string; telnyxNumber: string | null }
) {
  const loginUrl = `${APP_URL}/dashboard/onboarding`;
  const displayName = name || 'there';

  const numberSection = telnyxNumber
    ? `
      <div style="margin:32px 0;background:#0f172a;border:1px solid rgba(14,165,233,0.25);border-radius:12px;padding:24px;text-align:center;">
        <p style="margin:0 0 8px;font-size:12px;color:#64748b;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Your dedicated AI phone number</p>
        <p style="margin:0;font-size:28px;font-weight:700;color:#0ea5e9;font-family:monospace;letter-spacing:0.05em;">${telnyxNumber}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#64748b;">Forward your existing number to this, or start using it directly.</p>
      </div>`
    : `
      <div style="margin:32px 0;background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;text-align:center;">
        <p style="margin:0;font-size:14px;color:#94a3b8;">Your dedicated phone number is being provisioned — we'll send it through shortly.</p>
      </div>`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to AImie — complete your setup',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);border-radius:16px;padding:16px 28px;">
        <span style="font-size:22px;font-weight:800;color:white;letter-spacing:-0.03em;">AImie<span style="color:#0ea5e9;">.</span></span>
      </div>
    </div>

    <!-- Main card -->
    <div style="background:#0f0f0f;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:40px;">
      <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:white;line-height:1.3;">
        Welcome, ${displayName} 👋
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
        Your account is live. Amy — your AI receptionist — is almost ready to start answering calls for your business.
      </p>

      ${numberSection}

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0 24px;">
        <a href="${loginUrl}" style="display:inline-block;background:#0ea5e9;color:white;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:10px;letter-spacing:-0.01em;">
          Complete your setup →
        </a>
      </div>

      <!-- Steps -->
      <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;margin-top:8px;">
        <p style="margin:0 0 16px;font-size:12px;font-weight:600;color:#64748b;letter-spacing:0.08em;text-transform:uppercase;">What happens next</p>
        ${[
          'Add your business details & hours',
          'Connect your booking platform',
          'Customise how Amy speaks',
          'Go live — never miss a call again',
        ].map((step, i) => `
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
          <div style="width:20px;height:20px;border-radius:50%;background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
            <span style="font-size:10px;font-weight:700;color:#0ea5e9;">${i + 1}</span>
          </div>
          <span style="font-size:13px;color:#94a3b8;line-height:1.5;">${step}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;">
      <p style="font-size:12px;color:#334155;margin:0 0 8px;">AImie Solutions — Melbourne, Australia</p>
      <p style="font-size:12px;color:#334155;margin:0;">Questions? Reply to this email or call <a href="tel:+61390226413" style="color:#0ea5e9;text-decoration:none;">+61 3 9022 6413</a></p>
    </div>

  </div>
</body>
</html>`,
  });
}

export async function sendFirstCallEmail(
  to: string,
  {
    businessName,
    callerNumber,
    duration,
    transcript,
    summary,
  }: {
    businessName: string;
    callerNumber: string;
    duration: number | null;
    transcript: string | null;
    summary: string | null;
  }
) {
  const durationText = duration
    ? `${Math.floor(duration / 60)}m ${duration % 60}s`
    : 'unknown duration';

  const transcriptSection = transcript
    ? `
      <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin-top:20px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:600;color:#64748b;letter-spacing:0.1em;text-transform:uppercase;">Full transcript</p>
        <pre style="margin:0;font-size:13px;color:#94a3b8;white-space:pre-wrap;word-break:break-word;line-height:1.7;font-family:monospace;">${transcript}</pre>
      </div>`
    : '';

  const summarySection = summary
    ? `
      <div style="background:rgba(14,165,233,0.05);border:1px solid rgba(14,165,233,0.15);border-radius:12px;padding:20px;margin-top:20px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#0ea5e9;letter-spacing:0.1em;text-transform:uppercase;">AI Summary</p>
        <p style="margin:0;font-size:14px;color:#cbd5e1;line-height:1.7;">${summary}</p>
      </div>`
    : '';

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Amy just handled her first call — here\'s the transcript',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);border-radius:16px;padding:16px 28px;">
        <span style="font-size:22px;font-weight:800;color:white;letter-spacing:-0.03em;">AImie<span style="color:#0ea5e9;">.</span></span>
      </div>
    </div>

    <!-- Main card -->
    <div style="background:#0f0f0f;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:40px;">
      <!-- Success icon -->
      <div style="width:56px;height:56px;border-radius:16px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
        <span style="font-size:24px;">📞</span>
      </div>

      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:white;line-height:1.3;">
        Amy just handled her first call!
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
        Your AI receptionist answered a real call for <strong style="color:white;">${businessName}</strong>. Here's everything that happened.
      </p>

      <!-- Call details -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px;">
        <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:16px;">
          <p style="margin:0 0 4px;font-size:11px;color:#64748b;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Caller</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:white;font-family:monospace;">${callerNumber}</p>
        </div>
        <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:16px;">
          <p style="margin:0 0 4px;font-size:11px;color:#64748b;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Duration</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:white;">${durationText}</p>
        </div>
      </div>

      ${summarySection}
      ${transcriptSection}

      <!-- CTA -->
      <div style="text-align:center;margin-top:32px;">
        <a href="${APP_URL}/dashboard/calls" style="display:inline-block;background:#0ea5e9;color:white;font-weight:700;font-size:14px;text-decoration:none;padding:12px 28px;border-radius:10px;">
          View all calls in dashboard →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;">
      <p style="font-size:12px;color:#334155;margin:0;">AImie Solutions — Melbourne, Australia</p>
    </div>

  </div>
</body>
</html>`,
  });
}
