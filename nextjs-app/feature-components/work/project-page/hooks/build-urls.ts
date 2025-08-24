import { cache } from "react";
import { getImageUrl } from "@/lib/utils/get-url";

interface ProjectImage {
  path: string;
}

export const buildImageUrls = cache(
  async (images: ProjectImage[]): Promise<string[]> => {
    if (!images?.length) return [];
    return images.map((img) => {
      return getImageUrl(img.path);
    });
  }
);
