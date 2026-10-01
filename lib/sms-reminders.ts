export function smsConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && (process.env.TWILIO_FROM_NUMBER || process.env.TWILIO_MESSAGING_SERVICE_SID));
}

export async function sendUnreadAnnouncementSms(phone: string, title: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) throw new Error("SMS_PROVIDER_NOT_CONFIGURED");
  const body = new URLSearchParams({
    To: phone,
    Body: `HAAT Tulkarm Office: لديك تعميم لم تتم قراءته بعد: ${title}. يرجى الدخول إلى المنصة وقراءته.`,
  });
  if (process.env.TWILIO_MESSAGING_SERVICE_SID) body.set("MessagingServiceSid", process.env.TWILIO_MESSAGING_SERVICE_SID);
  else if (process.env.TWILIO_FROM_NUMBER) body.set("From", process.env.TWILIO_FROM_NUMBER);
  else throw new Error("SMS_SENDER_NOT_CONFIGURED");
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await response.json() as { sid?: string; message?: string };
  if (!response.ok) throw new Error(result.message || `SMS_SEND_FAILED_${response.status}`);
  return result.sid || "queued";
}
