"use server";

import { authApiCall } from "@/lib/utils/auth-api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Helper function to handle auth cookie forwarding
async function handleAuthCookie(response: Response) {
  const cookieStore = await cookies();
  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) {
    // Parse and forward the auth cookie (handle multiple cookies)
  const cookies = setCookieHeader.split(',');
  for (const cookie of cookies) {
      const authCookieMatch = cookie.trim().match(/auth=([^;]+)/);
      if (authCookieMatch) {
        const cookieValue = authCookieMatch[1];
        cookieStore.set("auth", cookieValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".tudor-dev.com" : undefined,
          maxAge: 60 * 60 * 24 * 7, // 7 days, matching backend
        });
        break;
      }
    }
  }
}

// Helper function for common auth flow after successful login/register
async function completeAuthFlow(response?: Response) {
  if (response) {
    await handleAuthCookie(response);
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  if (!username || !password) {
    redirect("/error?reason=missing-fields");
  }

  const { error, response } = await authApiCall("/api/Login/login", {
    method: "POST",
    body: { username, password },
  });

  if (error) {
    redirect("/error");
  }

  await completeAuthFlow(response);
}

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  if (!username || !password) {
    redirect("/error?reason=missing-fields");
  }

  const { error, response } = await authApiCall("/api/Login/signup", {
    method: "POST",
    body: { username, password },
  });

  if (error) {
    redirect("/error");
  }

  await completeAuthFlow(response);
}

export async function logoutUser(pathname: string) {
  const { error } = await authApiCall("/api/Login/logout", {
    method: "POST",
  });

  if (error) {
    redirect("/error");
  }

  // Clear the auth cookie on the client side
  const cookieStore = await cookies();
  cookieStore.delete("auth");

  redirect(pathname);
}
