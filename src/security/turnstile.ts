const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerificationResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export const isTurnstileEnabled = () => {
  return Boolean(import.meta.env.TURNSTILE_SECRET_KEY);
};

export const verifyTurnstileToken = async (
  token: string,
  remoteIp: string,
): Promise<boolean> => {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return import.meta.env.DEV;
  }

  if (!token) {
    return false;
  }

  const payload = new URLSearchParams({
    secret,
    response: token,
    remoteip: remoteIp,
  });

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as TurnstileVerificationResponse;
    return data.success;
  } catch {
    return false;
  }
};
