interface GiftPageProps {
  params: Promise<{ eventSlug: string }>;
}

export default async function GiftPage({ params }: GiftPageProps) {
  const { eventSlug } = await params;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-bold">마음 전달</h1>
        {/* TODO: Gift accounts with masked numbers */}
      </div>
    </main>
  );
}
