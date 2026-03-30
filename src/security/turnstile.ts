const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerificationResponse = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

const getAllowedHostnames = () => {
  const raw = import.meta.env.TURNSTILE_ALLOWED_HOSTNAMES;
  if (!raw) return [];

  return raw
    .split(",")
    .map((entry: string) => entry.trim().toLowerCase())
    .filter(Boolean);
};

const isHostnameAllowed = (hostname?: string) => {
  const allowed = getAllowedHostnames();
  if (allowed.length === 0) {
    return true;
  }

  if (!hostname) {
    return false;
  }

  return allowed.includes(hostname.toLowerCase());
};

export const isTurnstileEnabled = () => {
  return Boolean(import.meta.env.TURNSTILE_SECRET_KEY);
};

export const verifyTurnstileToken = async (
  token: string,
  remoteIp: string,
  expectedAction?: string,
): Promise<boolean> => {
  if (import.meta.env.DEV) {
    return true;
  }

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
    if (!data.success) {
      return false;
    }

    if (!isHostnameAllowed(data.hostname)) {
      return false;
    }

    if (expectedAction && data.action !== expectedAction) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
