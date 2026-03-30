export const prerender = false;

import {
  createTextResponse,
  enforceRateLimit,
  isAcceptedContentType,
  isAllowedFormOrigin,
  isBodyWithinLimit,
} from "../../security/form-guards";
import { handleContactSubmission } from "../../features/forms/server/handlers/contact-handler";

const MAX_BODY_SIZE = 256 * 1024;

export function GET({ request }: { request: Request }) {
  const acceptsHtml =
    request.headers.get("accept")?.includes("text/html") ?? false;

  if (acceptsHtml) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: "/contacto?error=invalid_method",
        "Cache-Control": "no-store",
      },
    });
  }

  return createTextResponse("Method not allowed", 405, {
    Allow: "POST",
  });
}

export async function POST({ request }: { request: Request }) {
  try {
    if (
      !isAcceptedContentType(request, [
        "multipart/form-data",
        "application/x-www-form-urlencoded",
      ])
    ) {
      return createTextResponse("Unsupported content type", 415);
    }

    if (!isBodyWithinLimit(request, MAX_BODY_SIZE)) {
      return createTextResponse("Payload too large", 413);
    }

    if (!isAllowedFormOrigin(request)) {
      return createTextResponse("Forbidden origin", 403);
    }

    const rateLimit = enforceRateLimit(request, {
      keyPrefix: "contact-form",
      maxRequests: 8,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return createTextResponse("Too many requests", 429, {
        "Retry-After": String(rateLimit.retryAfterSeconds),
      });
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    const from = import.meta.env.RESEND_FROM || "onboarding@resend.dev";

    if (!apiKey) {
      return createTextResponse("Server unavailable", 500);
    }

    return await handleContactSubmission({ request, apiKey, from });
  } catch (error) {
    console.error("Error in POST /api/contacto:", error);
    return createTextResponse("Internal server error", 500);
  }
}
