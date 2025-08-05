export default async function ServerTestPage() {
  const res = await fetch("http://aspnet-api:5000/weatherforecast", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <main>
      <h1>API Response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
