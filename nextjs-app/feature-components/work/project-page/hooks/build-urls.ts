import { cache } from "react";
import { getImageUrl } from "@/lib/utils/get-url";

export const buildImageUrls = cache(
  async (images: string[]): Promise<string[]> => {
    if (!images?.length) return [];
    return images.map((img) => {
      return getImageUrl(img);
    });
  }
);
