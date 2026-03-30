import { createTextResponse } from "../../../security/form-guards";

export const createOkResponse = () => createTextResponse("Ok", 200);

export const createRedirectResponse = (location: string) =>
  new Response(null, {
    status: 303,
    headers: {
      Location: location,
      "Cache-Control": "no-store",
    },
  });
