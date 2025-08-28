import { cookies } from "next/headers";
import { apiCall } from "./api";

export const getUser = async () => {
  const {ok, data: user} = await apiCall("/api/Login/me");
  if (!ok) return null;
  return user;
}

export const checkAuth = async () => {
  const cookieStore = await cookies();
  return cookieStore.has(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`);
};