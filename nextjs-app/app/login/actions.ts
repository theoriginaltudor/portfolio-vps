"use server";

import { apiCall } from "@/lib/utils/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  if (!username || !password) {
    redirect("/error?reason=missing-fields");
  }

  const { error, data: responseData } = await apiCall("/api/Login/login", {
    method: "POST",
    body: { username, password },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  if (!username || !password) {
    redirect("/error?reason=missing-fields");
  }

  const { error } = await apiCall("/api/Login/signup", {
    method: "POST",
    body: { username, password },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logoutUser(pathname: string) {
  const { error } = await apiCall("/api/Login/logout", {
    method: "POST",
  });

  if (error) {
    redirect("/error");
  }

  redirect(pathname);
}
