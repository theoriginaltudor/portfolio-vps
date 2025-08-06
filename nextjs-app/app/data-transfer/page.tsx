import { createClient } from "@/lib/supabase/server";
import { apiCall } from "@/lib/utils/api";
import { cn } from "@/lib/utils/client";

export default async function DataTransferPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*");

  if (error) {
    console.error("Error fetching articles:", error);
    return <div>Error fetching articles</div>;
  }

  const response = await apiCall("/api/DataTransfer/projects", {
    method: "POST",
    body: data.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      longDescription: article.long_description,
      embedding: article.embedding
        ? (JSON.parse(article.embedding) as number[])
        : undefined,
      createdAt: new Date().toISOString(),
    })),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <main>
      <h1>API Response</h1>
      <pre className={cn("text-red-600", { "text-green-600": response.ok })}>
        {response.ok ? "Success" : "Error"}
      </pre>
    </main>
  );
}
