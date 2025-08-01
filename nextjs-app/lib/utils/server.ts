import { cookies } from "next/headers";
import { createClient } from "../supabase/server";

export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export const checkAuth = async () => {
  const cookieStore = await cookies();
  return cookieStore.has(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`);
};