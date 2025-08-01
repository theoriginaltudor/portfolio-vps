export default async function ErrorPage({
  params,
}: {
  params: Promise<{ reason?: string }>;
}) {
  const { reason } = await params;
  return (
    <p className="text-center text-red-600 mt-8">
      Sorry, something went wrong: {reason}
    </p>
  );
}
