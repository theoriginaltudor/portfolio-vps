import { apiCall } from "@/lib/utils/api";

export const getArticlesImage = async () => {
  const { data, error } = await apiCall("/api/ProjectAsset");
  if (error || !data) return [];
  // Use a reducer to filter out duplicate projectIds
  const uniqueAssets = data.reduce<
    { path: string; projectId: number | undefined }[]
  >((acc, asset) => {
    if (!acc.some((a) => a.projectId === asset.projectId)) {
      acc.push({ path: asset.path, projectId: asset.projectId });
    }
    return acc;
  }, []);
  return uniqueAssets;
};
