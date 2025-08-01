'use server';
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types/database.types";

export async function fetchSkillsServer(): Promise<Tables<"skills">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skills").select("*");
  if (error || !data) return [];
  return data as Tables<"skills">[];
}
