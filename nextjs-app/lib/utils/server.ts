import { cookies } from "next/headers";
import { authApiCall } from "./auth-api";

export const getUser = async () => {
  const {ok, data: user} = await authApiCall("/api/Login/me", { method: "GET" });
  if (!ok) return null;
  return user;
}

export const checkAuth = async () => {
  const cookieStore = await cookies();
  return cookieStore.has("auth");
};