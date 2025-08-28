"use server";

import { apiCall } from "@/lib/utils/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {

  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    redirect("/error?reason=missing-fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    redirect("/error?reason=invalid-email");
  }

  const data = {
    email,
    password,
  };

  const { error, data: responseData } = await apiCall("/api/Login/login", {
    method: "POST",
    body: {username: email, password},
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
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    redirect("/error?reason=missing-fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    redirect("/error?reason=invalid-email");
  }

  const data = {
    email,
    password,
  };

  const { error } = await apiCall("/api/Login/signup", {
    method: "POST",
    body: {username: email, password},
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
