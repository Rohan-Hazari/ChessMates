import { headers } from "next/headers";
import { getAuthSession } from "./auth";

export async function getSessionFromRequest() {
  const headersList = headers();
  const cachedToken = headersList.get("x-auth-token");

  if (cachedToken) {
    return JSON.parse(cachedToken);
  }

  return await getAuthSession();
}
