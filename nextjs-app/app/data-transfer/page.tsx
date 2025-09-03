import { transferImagesToApi } from "@/lib/server-actions/transfer-image-path-to-api";
import type { Metadata } from "next";
import { transferBlobToApi } from "@/lib/server-actions/transfer-images-to-api";
import { transferProjectSkillsToApi } from "@/lib/server-actions/transfer-project-skills-to-api";
import { transferProjectsToApi } from "@/lib/server-actions/transfer-projects-to-api";
import { transferSkillsToApi } from "@/lib/server-actions/transfer-skill-to-api";
import { cn } from "@/lib/utils/client";
import React from "react";

type TransferResult = {
  name: string;
  status: "success" | "error";
  message: string;
  statusCode?: number;
  count?: number;
};

export default async function DataTransferPage() {
  const results: TransferResult[] = [];

  async function runAction(
    name: string,
    action: () => Promise<
      | { ok: boolean; error?: string; status?: number; data?: unknown }
      | undefined
    >
  ) {
    try {
      const response = await action();
      if (response && typeof response === "object" && "ok" in response) {
        if (response.ok) {
          const count =
            typeof response.data === "object" &&
            response.data &&
            "count" in response.data
              ? (response.data as { count?: number }).count
              : undefined;
          results.push({
            name,
            status: "success",
            message: count != null ? `Success (sent ${count})` : "Success",
            statusCode: response.status,
            count: count,
          });
        } else {
          results.push({
            name,
            status: "error",
            message: response.error || "Unknown error",
            statusCode: response.status,
          });
        }
      } else {
        results.push({ name, status: "success", message: "Success" });
      }
    } catch (e: unknown) {
      let message = "Unknown error";
      function hasMessage(obj: unknown): obj is { message: string } {
        return (
          typeof obj === "object" &&
          obj !== null &&
          "message" in obj &&
          typeof (obj as { message: unknown }).message === "string"
        );
      }
      if (hasMessage(e)) {
        message = e.message;
      } else if (typeof e === "string") {
        message = e;
      } else {
        message = JSON.stringify(e);
      }
      results.push({ name, status: "error", message });
    }
  }

  await runAction("Skills", transferSkillsToApi);
  await runAction("Projects", transferProjectsToApi);
  await runAction("Project Skills", transferProjectSkillsToApi);
  await runAction("Images", transferImagesToApi);
  await runAction("Blobs", transferBlobToApi);

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Data Transfer</h1>
      <p className="mb-8 text-gray-600">
        Runs data transfer tasks and summarizes results.
      </p>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Transfer Results</h2>
        <ul className="space-y-3">
          {results.map((r) => (
            <li
              key={r.name}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border font-medium",
                r.status === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              )}
            >
              <span className="text-xl">
                {r.status === "success" ? "✅" : "❌"}
              </span>
              <span className="flex-1">{r.name}</span>
              <span className="text-sm flex items-center gap-2">
                <span>{r.message}</span>
                {typeof r.statusCode === "number" ? (
                  <span className="text-xs text-gray-400">
                    [{r.statusCode}]
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Data Transfer",
  description: "Utility page to synchronize local/imported portfolio data (projects, skills, assets) with the API backend.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Data Transfer – Admin",
    description: "Internal utilities for syncing portfolio content.",
  url: "https://tudor-dev.com/data-transfer"
  }
};
