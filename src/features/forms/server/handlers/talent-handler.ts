import {
  createTextResponse,
  getClientIp,
} from "../../../../security/form-guards";
import {
  isTurnstileEnabled,
  verifyTurnstileToken,
} from "../../../../security/turnstile";
import { sendPrimaryAndAckEmails, uint8ArrayToBase64 } from "../mail-service";
import { parseFormRequest } from "../request-parser";
import { createOkResponse, createRedirectResponse } from "../responses";
import {
  getFileSummary,
  isHoneypotTriggered,
  isValidEmail,
  normalizeSubjectValue,
  validateTalentSubmission,
} from "../validators";

const TALENT_RECIPIENT = "hola@bluevex.tech";

export async function handleTalentSubmission(params: {
  request: Request;
  apiKey: string;
  from: string;
}): Promise<Response> {
  const { fields, files } = await parseFormRequest(params.request);

  if (isTurnstileEnabled()) {
    const token = fields["cf-turnstile-response"] || "";
    const ip = getClientIp(params.request);
    const captchaValid = await verifyTurnstileToken(token, ip, "talent_form");
    if (!captchaValid) {
      return createTextResponse("Invalid captcha", 400);
    }
  }

  if (isHoneypotTriggered(fields)) {
    return createOkResponse();
  }

  const validation = validateTalentSubmission(fields, files);
  if ("message" in validation) {
    const status = validation.message === "CV file is too large" ? 413 : 400;
    return createTextResponse(validation.message, status);
  }

  const {
    nombre,
    email,
    rol,
    ubicacion,
    linkedin,
    mensaje,
    privacidad,
    cvFile,
  } = validation.data;

  const cvSummary = getFileSummary(cvFile.filename || null, cvFile.data.length);

  const ip = getClientIp(params.request);
  const userAgent = params.request.headers.get("user-agent") || "-";

  const primaryText = [
    "Nueva candidatura recibida:",
    "",
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    `Perfil/Rol: ${rol}`,
    `Ubicacion: ${ubicacion}`,
    `LinkedIn/Portfolio: ${linkedin}`,
    `CV: ${cvSummary}`,
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
          subject: "Hemos recibido tu candidatura",
          text: [
            "Gracias por contar con nosotros.",
            "Hemos recibido tu candidatura y la estamos revisando.",
            "Si necesitamos informacion adicional, te contactaremos.",
          ].join("\n"),
        }
      : undefined;

  await sendPrimaryAndAckEmails({
    apiKey: params.apiKey,
    primary: {
      from: params.from,
      to: [TALENT_RECIPIENT],
      subject: `Nueva candidatura: ${normalizeSubjectValue(nombre !== "-" ? nombre : "Sin nombre")}`,
      text: primaryText,
      attachments: [
        {
          filename: cvFile.filename || "cv.pdf",
          content: uint8ArrayToBase64(cvFile.data),
        },
      ],
    },
    ack,
  });

  return createRedirectResponse("/talento?sent=1");
}
