import { createClient } from "@/lib/supabase/server";
import { apiCall } from "@/lib/utils/api";
import { cn } from "@/lib/utils/client";

export default async function DataTransferPage() {
  const supabase = await createClient();
  const { data: images, error: imagesError } = await supabase
    .from("images")
    .select("path");

  if (imagesError) {
    console.error("Error fetching images:", imagesError);
    return <div>Error fetching images</div>;
  }

  const blobList: FormData = new FormData();
  console.log(`Fetched ${images.length} images from Supabase`);

  await Promise.all(
    images.map(async (image) => {
      const { data, error } = await supabase.storage
        .from("portfolio-images")
        .download(image.path);

      if (error) {
        console.error("Error downloading image:", error);
        return;
      }

      const file = new File([data], image.path);
      console.log(`Adding file to FormData: ${image.path}, size: ${file.size}`);

      blobList.append("files", file, image.path);
    })
  );

  console.log(
    `FormData entries count: ${Array.from(blobList.entries()).length}`
  );

  const { ok, error, status } = await apiCall("/api/DataTransfer/images", {
    method: "POST",
    body: blobList,
  });

  return (
    <main>
      <h1>API Response</h1>
      <pre className={cn("text-red-600", { "text-green-600": ok })}>
        {ok ? "Success" : "Error"}
      </pre>
      {error && (
        <div>
          <p>Error: {error}</p>
          <p>Status: {status}</p>
        </div>
      )}
    </main>
  );
}
