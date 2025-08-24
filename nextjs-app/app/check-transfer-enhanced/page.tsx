import { entityApi, apiBatch } from "@/lib/utils/api-enhanced";
import { getImageUrl } from "@/lib/utils/get-url";
import Image from "next/image";

/**
 * Enhanced check transfer page demonstrating the improved API utilities
 * Shows better type safety, cleaner code, and improved maintainability
 */
export default async function CheckTransferEnhancedPage() {
  // Define the endpoints to check
  const endpoints = [
    "/api/Project",
    "/api/ProjectAsset", 
    "/api/ProjectSkill",
    "/api/Skill",
  ] as const;

  // Use the enhanced batch API for better type safety and error handling
  const results = await apiBatch(endpoints);

  // Alternative approach using individual API calls with better type inference
  const individualResults = {
    projects: await entityApi.projects(),
    projectAssets: await entityApi.projectAssets(),
    projectSkills: await entityApi.projectSkills(), 
    skills: await entityApi.skills(),
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <h1 className="text-4xl font-bold mb-10 tracking-wide text-gray-900 dark:text-gray-100">
        Enhanced Check Transfer
      </h1>
      
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
          API Enhancements
        </h2>
        <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
          <li>✅ Better type safety with specialized functions</li>
          <li>✅ Separated concerns (GET vs POST vs Upload)</li>
          <li>✅ Standardized error handling</li>
          <li>✅ Reduced code duplication</li>
          <li>✅ Enhanced maintainability</li>
        </ul>
      </div>

      {/* Batch Results Section */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Batch API Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endpoints.map((endpoint) => {
            const result = results[endpoint];
            return (
              <div
                key={endpoint}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  {endpoint.replace("/api/", "")}
                </h3>
                {!result.ok ? (
                  <div className="text-red-600 dark:text-red-400 mb-3">
                    Error: {result.error} {result.status ? `(Status: ${result.status})` : ""}
                  </div>
                ) : (
                  <div className="text-green-600 dark:text-green-400 mb-3">
                    ✅ Success - {Array.isArray(result.data) ? result.data.length : 'N/A'} items
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Individual API Results Section */}
      <section className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Specialized API Results
        </h2>
        <div className="space-y-6">
          {Object.entries(individualResults).map(([key, result]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              {!result.ok ? (
                <div className="text-red-600 dark:text-red-400 mb-3">
                  Error: {result.error} {result.status ? `(Status: ${result.status})` : ""}
                </div>
              ) : (
                <>
                  <div className="text-green-600 dark:text-green-400 mb-3">
                    ✅ Success - {Array.isArray(result.data) ? result.data.length : 'N/A'} items loaded
                  </div>
                  {Array.isArray(result.data) && result.data.length > 0 && (
                    <details>
                      <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Show items ({result.data.length})
                      </summary>
                      <div className="space-y-2 max-h-64 overflow-auto">
                        {result.data.slice(0, 5).map((item: Record<string, unknown>, index: number) => (
                          <div 
                            key={index}
                            className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm"
                          >
                            {key === "projectAssets" && typeof item === 'object' && item !== null && 'path' in item && typeof item.path === 'string' && (
                              <div className="mb-2">
                                <Image
                                  src={getImageUrl(item.path)}
                                  alt={`Asset ${item.path}`}
                                  width={60}
                                  height={60}
                                  className="rounded object-cover"
                                />
                              </div>
                            )}
                            <pre className="text-gray-800 dark:text-gray-100">
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          </div>
                        ))}
                        {result.data.length > 5 && (
                          <div className="text-gray-500 dark:text-gray-400 text-center py-2">
                            ... and {result.data.length - 5} more items
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}