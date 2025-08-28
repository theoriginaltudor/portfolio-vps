import { cookies } from "next/headers";

export const getUser = async () => {
  const response = await fetch("/api/Login/me");
  if (!response.ok) return null;
  const user = await response.json();
  return user;
}

export const checkAuth = async () => {
  const cookieStore = await cookies();
  return cookieStore.has(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`);
};