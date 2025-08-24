import { createClient } from "@/lib/supabase/server";
import { apiCall } from "@/lib/utils/api";

export async function transferBlobToApi() {
  const supabase = await createClient();
  const { data: images, error: imagesError } = await supabase
    .from("images")
    .select("path");

  images?.push({ path: "/tc1_1.webp" });

  if (imagesError) {
    console.error("Error fetching images:", imagesError);
    return { ok: false, error: imagesError.message, status: 500 };
  }

  const blobList: FormData = new FormData();
  let downloaded = 0;
  let failed = 0;
  await Promise.all(
    (images ?? []).map(async (image: { path: string }) => {
      const { data, error } = await supabase.storage
        .from("portfolio-images")
        .download(image.path);

      if (error) {
        console.error("Error downloading image:", error);
        failed += 1;
        return;
      }

      const file = new File([data], image.path);
      blobList.append("files", file, image.path);
      downloaded += 1;
    })
  );

  const { ok, error, status } = await apiCall("/api/DataTransfer/images", {
    method: "POST",
    body: blobList,
  });

  return { ok, error, status, data: { count: downloaded, failed } };
}
