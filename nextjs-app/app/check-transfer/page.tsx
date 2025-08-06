import { apiCall } from "@/lib/utils/api";

export default async function CheckTransferPage() {
  const { ok, error, status, data } = await apiCall("/api/Project");

  if (!ok) {
    console.error("Error fetching projects:", error);
    return (
      <div>
        Error fetching projects: {error} (Status: {status})
      </div>
    );
  }

  return (
    <main>
      <h1>Check Transfer</h1>
      <pre>
        {JSON.stringify(
          data?.map((project) => ({ ...project, embedding: "<embedding>" })),
          null,
          2
        )}
      </pre>
    </main>
  );
}
