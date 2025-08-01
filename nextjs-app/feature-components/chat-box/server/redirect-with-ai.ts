"use server";
import { redirect } from "next/navigation";
import { getAIRoute } from "./ai-limit/get-ai-route";
import { checkAndUpdateTokenLimit } from "./ai-limit/manage-token-limit";
import { addTokensForIP } from "./ai-limit/add-tokens-for-ip";
import { headers } from "next/headers";

export async function redirectWithAI(formData: FormData) {
  const headersList = await headers();
  const tokenCheck = checkAndUpdateTokenLimit(headersList);
  if (tokenCheck.blocked && tokenCheck.redirectUrl) {
    redirect(tokenCheck.redirectUrl);
  }

  const message = formData.get("message")?.toString() || "";
  if (message.length > 800) {
    redirect(`/contact?message=${encodeURIComponent("Message too long. Try shorter inputs.")}`);
  }

  const { object, tokens } = await getAIRoute(message);

  // Add the actual tokens used to the IP's count
  const addResult = addTokensForIP(headersList, tokens);
  if (addResult.blocked && addResult.redirectUrl) {
    redirect(addResult.redirectUrl);
  }

  const redirectUrl = `/${object.path.trimEnd()}?message=${encodeURIComponent(object.response)}`;
  redirect(redirectUrl);
}
