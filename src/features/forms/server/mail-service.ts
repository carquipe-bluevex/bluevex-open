const RESEND_API_URL = "https://api.resend.com/emails";

type MailAttachment = {
  filename: string;
  content: string;
};

type MailPayload = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  attachments?: MailAttachment[];
};

const canSendWithResend = (apiKey: string) => !apiKey.startsWith("re_test_");

const sendResendEmail = async (
  apiKey: string,
  payload: MailPayload,
): Promise<void> => {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Resend API error:", response.status);
  }
};

export async function sendPrimaryAndAckEmails(params: {
  apiKey: string;
  primary: MailPayload;
  ack?: MailPayload;
}): Promise<void> {
  if (!canSendWithResend(params.apiKey)) {
    console.log("Skipping email send for test API key");
    return;
  }

  await sendResendEmail(params.apiKey, params.primary);

  if (params.ack) {
    await sendResendEmail(params.apiKey, params.ack);
  }
}

export function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < arr.byteLength; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}
