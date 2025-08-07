import { transferImagesToApi } from "@/lib/server-actions/transfer-image-path-to-api";
import { transferBlobToApi } from "@/lib/server-actions/transfer-images-to-api";
import { transferProjectSkillsToApi } from "@/lib/server-actions/transfer-project-skills-to-api";
import { transferProjectsToApi } from "@/lib/server-actions/transfer-projects-to-api";
import { transferSkillsToApi } from "@/lib/server-actions/transfer-skill-to-api";
import React from "react";

export default async function DataTransferPage() {
  await transferSkillsToApi();
  await transferProjectsToApi();
  await transferProjectSkillsToApi();
  await transferImagesToApi();
  await transferBlobToApi();
  return (
    <main>
      <h1>Data Transfer</h1>
      <p>This is a generic server component page in Next.js.</p>
    </main>
  );
}
