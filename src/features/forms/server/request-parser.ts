export type UploadedFile = {
  filename: string;
  contentType: string;
  data: Uint8Array;
};

export type ParsedFormRequest = {
  fields: Record<string, string>;
  files: Record<string, UploadedFile>;
};

export async function parseFormRequest(
  request: Request,
): Promise<ParsedFormRequest> {
  const fields: Record<string, string> = {};
  const files: Record<string, UploadedFile> = {};
  const formData = await request.formData();

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      fields[key] = value;
      continue;
    }

    if (value instanceof File) {
      const fileBuffer = await value.arrayBuffer();
      files[key] = {
        filename: value.name,
        contentType: value.type,
        data: new Uint8Array(fileBuffer),
      };
    }
  }

  return { fields, files };
}
