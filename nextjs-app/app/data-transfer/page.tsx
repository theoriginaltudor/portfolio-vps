import { apiCall } from "@/lib/utils/api";

export default async function ServerTestPage() {
  const result = await apiCall("/WeatherForecast", {
    cache: "no-store",
  });

  console.log("Response from API:", result);

  if (!result.ok) {
    throw new Error(`Failed to fetch data from API: ${result.error}`);
  }

  const data = result.data; // This is now properly typed!

  return (
    <main>
      <h1>API Response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
