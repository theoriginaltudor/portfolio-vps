"use client";

import { useState } from "react";

/**
 * Interactive demonstration component showing how to use the enhanced API utilities
 * This component demonstrates the practical usage of all enhanced functions
 */
export default function ApiDemoComponent() {
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const executeDemo = async (demoName: string, demoFn: () => Promise<unknown>) => {
    setLoading(prev => ({ ...prev, [demoName]: true }));
    try {
      const result = await demoFn();
      setResults(prev => ({ ...prev, [demoName]: result }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [demoName]: { 
          ok: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [demoName]: false }));
    }
  };

  const demos = [
    {
      name: "Entity API - Get Projects",
      description: "Fetch all projects using the enhanced entityApi wrapper",
      action: async () => {
        const { entityApi } = await import("@/lib/utils/api-enhanced");
        return await entityApi.projects();
      }
    },
    {
      name: "Entity API - Get Skills",
      description: "Fetch all skills using the enhanced entityApi wrapper",
      action: async () => {
        const { entityApi } = await import("@/lib/utils/api-enhanced");
        return await entityApi.skills();
      }
    },
    {
      name: "Batch API - Health Check",
      description: "Check multiple endpoints simultaneously using apiBatch",
      action: async () => {
        const { apiBatch } = await import("@/lib/utils/api-enhanced");
        const endpoints = ["/api/Project", "/api/ProjectAsset", "/api/ProjectSkill", "/api/Skill"] as const;
        return await apiBatch(endpoints);
      }
    },
    {
      name: "Transfer API - Projects",
      description: "Transfer projects using the enhanced createTransferFunction pattern",
      action: async () => {
        const { transferProjectsToApiEnhanced } = await import("@/lib/server-actions/transfer-projects-enhanced");
        return await transferProjectsToApiEnhanced();
      }
    },
    {
      name: "Transfer API - Skills",
      description: "Transfer skills using the enhanced API utilities",
      action: async () => {
        const { transferSkillsToApiEnhanced } = await import("@/lib/server-actions/transfer-enhanced");
        return await transferSkillsToApiEnhanced();
      }
    },
    {
      name: "Transfer API - Project Assets",
      description: "Transfer project assets with validation using enhanced utilities",
      action: async () => {
        const { transferProjectAssetsWithValidation } = await import("@/lib/server-actions/transfer-project-assets-enhanced");
        return await transferProjectAssetsWithValidation();
      }
    },
    {
      name: "Project Asset Stats",
      description: "Get project asset statistics using utility functions",
      action: async () => {
        const { getProjectAssetStats } = await import("@/lib/server-actions/transfer-project-assets-enhanced");
        return await getProjectAssetStats();
      }
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Enhanced API Utilities Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Interactive demonstration of the enhanced API functions with better type safety, 
          separated concerns, and improved maintainability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {demos.map((demo) => (
          <div 
            key={demo.name}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {demo.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {demo.description}
            </p>
            
            <button
              onClick={() => executeDemo(demo.name, demo.action)}
              disabled={loading[demo.name]}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading[demo.name] ? "Running..." : "Execute Demo"}
            </button>

            {results[demo.name] && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Result:
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-64 overflow-auto">
                  <pre className="text-xs text-gray-800 dark:text-gray-100">
                    {JSON.stringify(results[demo.name], null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
          Key Improvements Demonstrated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              🎯 Separated Concerns
            </h3>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• GET operations: entityApi</li>
              <li>• POST operations: transferApi</li>
              <li>• File uploads: apiUpload</li>
              <li>• Batch operations: apiBatch</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              🛡️ Better Type Safety
            </h3>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Endpoint type validation</li>
              <li>• Response type inference</li>
              <li>• DTO type enforcement</li>
              <li>• Compile-time error checking</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              🔧 Reduced Duplication
            </h3>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Factory functions</li>
              <li>• Shared utilities</li>
              <li>• Standardized responses</li>
              <li>• Common error handling</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              📈 Enhanced Maintainability
            </h3>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Clear function purpose</li>
              <li>• Consistent patterns</li>
              <li>• Better error messages</li>
              <li>• Easier testing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-200">
          Migration Strategy
        </h2>
        <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
          <p>✅ <strong>Backward Compatible:</strong> All original functions remain available</p>
          <p>✅ <strong>Gradual Migration:</strong> Adopt enhanced functions incrementally</p>
          <p>✅ <strong>Easy Testing:</strong> Mock enhanced functions independently</p>
          <p>✅ <strong>Documentation:</strong> Complete documentation in ENHANCED_API_DOCS.md</p>
        </div>
      </div>
    </div>
  );
}