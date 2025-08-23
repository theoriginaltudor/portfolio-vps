import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

interface ProjectImage {
  path: string;
}

export const buildImageUrls = cache(
  async (
    supabase: SupabaseClient<Database>,
    images: ProjectImage[]
  ): Promise<string[]> => {
    if (!images?.length) return [];
    return images.map((img) => {
      const cleanPath = img.path.startsWith("/") ? img.path.slice(1) : img.path;
      const { data } = supabase.storage.from("portfolio-images").getPublicUrl(cleanPath);
      return data.publicUrl;
    });
  }
);
