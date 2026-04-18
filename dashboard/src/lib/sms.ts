/**
 * Telnyx SMS helper.
 *
 * Requires:
 *   TELNYX_API_KEY   — your Telnyx API key
 *   TELNYX_SMS_FROM  — the Telnyx number to send from (E.164, e.g. +61390226413)
 *
 * Enable SMS on your Telnyx number in the Telnyx portal:
 *   Numbers → your number → Messaging → assign a Messaging Profile
 */

const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const SMS_FROM = process.env.TELNYX_SMS_FROM;

export async function sendSMS(to: string, body: string): Promise<boolean> {
  if (!TELNYX_API_KEY || !SMS_FROM) {
    console.warn('SMS not configured — set TELNYX_API_KEY and TELNYX_SMS_FROM');
    return false;
  }

  try {
    const res = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: SMS_FROM,
        to,
        text: body,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Telnyx SMS failed:', err);
      return false;
    }

    return true;
  } catch (err) {
    console.error('SMS send error:', err);
    return false;
  }
}

export function bookingConfirmationSMS(
  businessName: string,
  customerName: string,
  service: string,
  preferredTime: string,
): string {
  const first = customerName.split(' ')[0];
  return (
    `Hi ${first}, your booking request for ${service} at ${businessName} has been received.\n` +
    `Preferred time: ${preferredTime}.\n` +
    `The team will confirm shortly. Reply STOP to opt out.`
  );
}
