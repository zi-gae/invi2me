interface CheckInPageProps {
  params: Promise<{ eventSlug: string }>;
}

export default async function CheckInPage({ params }: CheckInPageProps) {
  const { eventSlug } = await params;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-bold">체크인</h1>
        {/* TODO: QR check-in */}
      </div>
    </main>
  );
}
