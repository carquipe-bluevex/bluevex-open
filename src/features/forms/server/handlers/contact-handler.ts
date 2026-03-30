import {
  createTextResponse,
  getClientIp,
} from "../../../../security/form-guards";
import {
  isTurnstileEnabled,
  verifyTurnstileToken,
} from "../../../../security/turnstile";
import { sendPrimaryAndAckEmails } from "../mail-service";
import { parseFormRequest } from "../request-parser";
import { createOkResponse, createRedirectResponse } from "../responses";
import {
  isHoneypotTriggered,
  isValidEmail,
  normalizeSubjectValue,
  validateContactSubmission,
} from "../validators";

const CONTACT_RECIPIENT = "hola@bluevex.tech";

export async function handleContactSubmission(params: {
  request: Request;
  apiKey: string;
  from: string;
}): Promise<Response> {
  const { fields } = await parseFormRequest(params.request);

  if (isTurnstileEnabled()) {
    const token = fields["cf-turnstile-response"] || "";
    const ip = getClientIp(params.request);
    const captchaValid = await verifyTurnstileToken(token, ip);
    if (!captchaValid) {
      return createTextResponse("Invalid captcha", 400);
    }
  }

  if (isHoneypotTriggered(fields)) {
    return createOkResponse();
  }

  const validation = validateContactSubmission(fields);
  if ("message" in validation) {
    return createTextResponse(validation.message, 400);
  }

  const {
    nombre,
    empresa,
    email,
    tamano,
    telefono,
    servicio,
    mensaje,
    privacidad,
  } = validation.data;

  const ip = getClientIp(params.request);
  const userAgent = params.request.headers.get("user-agent") || "-";

  const primaryText = [
    "Nuevo contacto recibido:",
    "",
    `Nombre: ${nombre}`,
    `Empresa: ${empresa}`,
    `Email: ${email}`,
    `Tamano compania: ${tamano}`,
    `Telefono: ${telefono}`,
    `Servicio: ${servicio}`,
    `Privacidad: ${privacidad}`,
    "",
    "Mensaje:",
    mensaje,
    "",
    `IP: ${ip}`,
    `User-Agent: ${userAgent}`,
  ].join("\n");

  const ack =
    email !== "-" && isValidEmail(email)
      ? {
          from: params.from,
          to: [email],
          subject: "Hemos recibido tu mensaje",
          text: [
            "Gracias por contar con nosotros.",
            "Hemos recibido tu mensaje y lo estamos revisando.",
            "Te responderemos en cuanto tengamos novedades.",
          ].join("\n"),
        }
      : undefined;

  await sendPrimaryAndAckEmails({
    apiKey: params.apiKey,
    primary: {
      from: params.from,
      to: [CONTACT_RECIPIENT],
      subject: `Nuevo contacto: ${normalizeSubjectValue(nombre !== "-" ? nombre : "Sin nombre")}`,
      text: primaryText,
    },
    ack,
  });

  return createRedirectResponse("/contacto?sent=1");
}
