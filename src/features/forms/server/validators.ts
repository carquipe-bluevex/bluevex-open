import type { UploadedFile } from "./request-parser";

const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46];
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

type ValidationSuccess<T> = {
  ok: true;
  data: T;
};

type ValidationError = {
  ok: false;
  message: string;
};

type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

export type ContactSubmission = {
  nombre: string;
  empresa: string;
  email: string;
  tamano: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  privacidad: string;
};

export type TalentSubmission = {
  nombre: string;
  email: string;
  rol: string;
  ubicacion: string;
  linkedin: string;
  mensaje: string;
  privacidad: string;
  cvFile: UploadedFile;
};

export const formatValue = (value: string | null) => {
  if (!value) return "-";
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed || "-";
};

export const isValidEmail = (value: string) => /.+@.+\..+/.test(value);

export const normalizeSubjectValue = (value: string) =>
  value
    .replace(/[\r\n]+/g, " ")
    .slice(0, 120)
    .trim();

export const isHoneypotTriggered = (fields: Record<string, string>) =>
  formatValue(fields["bot-field"]) !== "-";

const isPdfMime = (value: string) =>
  value === "application/pdf" || value === "application/x-pdf";

const hasPdfSignature = (bytes: Uint8Array): boolean => {
  if (bytes.length < PDF_MAGIC.length) {
    return false;
  }

  return PDF_MAGIC.every((byte, index) => bytes[index] === byte);
};

export const getFileSummary = (
  filename: string | null,
  size: number,
): string => {
  if (!filename || size === 0) return "No adjunto";
  return `${filename || "cv.pdf"} (${Math.round(size / 1024)} KB)`;
};

export function validateContactSubmission(
  fields: Record<string, string>,
): ValidationResult<ContactSubmission> {
  const nombre = formatValue(fields["nombre"]);
  const empresa = formatValue(fields["empresa"]);
  const email = formatValue(fields["email"]);
  const tamano = formatValue(fields["tamaño"]);
  const telefono = formatValue(fields["telefono"]);
  const servicio = formatValue(fields["servicio"]);
  const mensaje = formatValue(fields["mensaje"]);
  const privacidad = fields["privacidad"] ? "Aceptada" : "No aceptada";

  if (nombre === "-" || nombre.length > 120) {
    return { ok: false, message: "Invalid name" };
  }

  if (email === "-" || !isValidEmail(email) || email.length > 180) {
    return { ok: false, message: "Invalid email" };
  }

  if (mensaje === "-" || mensaje.length > 5000) {
    return { ok: false, message: "Invalid message" };
  }

  if (!fields["privacidad"]) {
    return { ok: false, message: "Privacy consent required" };
  }

  return {
    ok: true,
    data: {
      nombre,
      empresa,
      email,
      tamano,
      telefono,
      servicio,
      mensaje,
      privacidad,
    },
  };
}

export function validateTalentSubmission(
  fields: Record<string, string>,
  files: Record<string, UploadedFile>,
): ValidationResult<TalentSubmission> {
  const nombre = formatValue(fields["nombre"]);
  const email = formatValue(fields["email"]);
  const rol = formatValue(fields["rol"]);
  const ubicacion = formatValue(fields["ubicacion"]);
  const linkedin = formatValue(fields["linkedin"]);
  const mensaje = formatValue(fields["mensaje"]);
  const privacidad = fields["privacidad"] ? "Aceptada" : "No aceptada";

  if (nombre === "-" || nombre.length > 120) {
    return { ok: false, message: "Invalid name" };
  }

  if (email === "-" || !isValidEmail(email) || email.length > 180) {
    return { ok: false, message: "Invalid email" };
  }

  if (
    rol.length > 140 ||
    ubicacion.length > 140 ||
    linkedin.length > 240 ||
    mensaje.length > 5000
  ) {
    return { ok: false, message: "Invalid form fields" };
  }

  if (!fields["privacidad"]) {
    return { ok: false, message: "Privacy consent required" };
  }

  const cvFile = files["cv"];

  if (!cvFile || cvFile.data.length === 0) {
    return { ok: false, message: "CV file is required" };
  }

  if (cvFile.data.length > MAX_ATTACHMENT_SIZE) {
    return { ok: false, message: "CV file is too large" };
  }

  if (!isPdfMime(cvFile.contentType) || !hasPdfSignature(cvFile.data)) {
    return { ok: false, message: "CV must be a valid PDF file" };
  }

  return {
    ok: true,
    data: {
      nombre,
      email,
      rol,
      ubicacion,
      linkedin,
      mensaje,
      privacidad,
      cvFile,
    },
  };
}
