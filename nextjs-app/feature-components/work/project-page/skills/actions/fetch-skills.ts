'use server';
import { apiCall } from "@/lib/utils/api";
import { components } from "@/types/swagger-types";

export async function fetchSkillsServer(): Promise<components["schemas"]["SkillGetDto"][]> {
  const { data, error } = await apiCall("/api/Skill");
  if (error || !data) return [];
  return data;
}
