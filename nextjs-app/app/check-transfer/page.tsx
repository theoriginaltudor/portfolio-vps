import { apiCall } from "@/lib/utils/api";

export default async function CheckTransferPage() {
  const endpoints = [
    "/api/Project",
    "/api/ProjectAsset",
    "/api/ProjectSkill",
    "/api/Skill",
  ] as const;

  // Call all endpoints in parallel
  const results = await Promise.all(
    endpoints.map(async (url) => {
      try {
        const { ok, error, status, data } = await apiCall(url);
        return {
          key: url,
          ok,
          error,
          status,
          data,
        };
      } catch (err) {
        let errorMsg = "Unknown error";
        if (
          err &&
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as { message?: unknown }).message === "string"
        ) {
          errorMsg = (err as { message: string }).message;
        }
        return {
          key: url,
          ok: false,
          error: errorMsg,
          status: null,
          data: null,
        };
      }
    })
  );

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <h1 className="text-4xl font-bold mb-10 tracking-wide text-gray-900 dark:text-gray-100">
        Check Transfer
      </h1>
      {results.map((res) => (
        <section
          key={res.key}
          className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 tracking-tight">
            {res.key.replace("/api/", "")}
          </h2>
          {!res.ok ? (
            <div className="text-red-600 dark:text-red-400 mb-3">
              Error: {res.error} {res.status ? `(Status: ${res.status})` : ""}
            </div>
          ) : (
            <>
              <div className="mb-3 font-medium text-gray-700 dark:text-gray-200">
                Count: {Array.isArray(res.data) ? res.data.length : 0}
              </div>
              {Array.isArray(res.data) ? (
                res.data.slice(0, 2).map((item, idx) => (
                  <details key={idx} className="mb-2">
                    <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
                      Show result {idx + 1}
                    </summary>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-sm mt-2 text-gray-800 dark:text-gray-100 max-h-96 overflow-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </details>
                ))
              ) : (
                <details>
                  <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
                    Show result
                  </summary>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-sm mt-2 text-gray-800 dark:text-gray-100 max-h-96 overflow-auto">
                    {JSON.stringify(res.data, null, 2)}
                  </pre>
                </details>
              )}
            </>
          )}
        </section>
      ))}
    </main>
  );
}
