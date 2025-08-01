export default async function ServerTestPage() {
  const res = await fetch("http://aspnet-api:5000/api/your-endpoint", {
    cache: "no-store",
  });
  const data = await res.text();

  return (
    <main>
      <h1>API Response</h1>
      <pre>{data}</pre>
    </main>
  );
}
