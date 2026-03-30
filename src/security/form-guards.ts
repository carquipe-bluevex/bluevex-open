const DEFAULT_SITE = "https://www.bluevex.tech";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitBucket>;

type RateLimitOptions = {
  keyPrefix: string;
  maxRequests: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
};

const getRateLimitStore = (): RateLimitStore => {
  const globalKey = "__bluevexRateLimitStore__";
  const globalState = globalThis as typeof globalThis & {
    [globalKey]?: RateLimitStore;
  };

  if (!globalState[globalKey]) {
    globalState[globalKey] = new Map<string, RateLimitBucket>();
  }

  return globalState[globalKey];
};

const getConfiguredOrigins = (): Set<string> => {
  const origins = new Set<string>();
  const configured = import.meta.env.ALLOWED_FORM_ORIGINS || "";
  const site = import.meta.env.SITE || DEFAULT_SITE;

  if (site) {
    try {
      const siteUrl = new URL(site);
      origins.add(siteUrl.origin);
      if (siteUrl.hostname.startsWith("www.")) {
        origins.add(
          `${siteUrl.protocol}//${siteUrl.hostname.replace(/^www\./, "")}`,
        );
      }
    } catch {
      // Ignore invalid site URL and fall back to defaults below.
    }
  }

  for (const value of configured.split(",")) {
    const origin = value.trim();
    if (origin) {
      origins.add(origin);
    }
  }

  if (import.meta.env.DEV) {
    origins.add("http://localhost:4321");
    origins.add("http://127.0.0.1:4321");
  }

  return origins;
};

const parseHeaderOrigin = (request: Request): string | null => {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
};

export const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
};

export const isAllowedFormOrigin = (request: Request): boolean => {
  const requestOrigin = parseHeaderOrigin(request);
  if (!requestOrigin) {
    return false;
  }

  const allowedOrigins = getConfiguredOrigins();
  return allowedOrigins.has(requestOrigin);
};

export const isAcceptedContentType = (
  request: Request,
  acceptedContentTypes: string[],
): boolean => {
  const contentType = request.headers.get("content-type") || "";
  return acceptedContentTypes.some((accepted) =>
    contentType.startsWith(accepted),
  );
};

export const isBodyWithinLimit = (
  request: Request,
  maxBytes: number,
): boolean => {
  const headerValue = request.headers.get("content-length");
  if (!headerValue) {
    return true;
  }

  const bodySize = Number.parseInt(headerValue, 10);
  if (Number.isNaN(bodySize)) {
    return false;
  }

  return bodySize <= maxBytes;
};

export const enforceRateLimit = (
  request: Request,
  options: RateLimitOptions,
): RateLimitResult => {
  const now = Date.now();
  const store = getRateLimitStore();
  const ip = getClientIp(request);
  const key = `${options.keyPrefix}:${ip}`;
  const existing = store.get(key);

  if (!existing || now >= existing.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
      remaining: options.maxRequests - 1,
    };
  }

  if (existing.count >= options.maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      ),
      remaining: 0,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    remaining: options.maxRequests - existing.count,
  };
};

export const createTextResponse = (
  message: string,
  status: number,
  extraHeaders: Record<string, string> = {},
) => {
  return new Response(message, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
};
