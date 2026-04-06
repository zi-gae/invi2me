interface RsvpPageProps {
  params: Promise<{ eventSlug: string }>;
}

export default async function RsvpPage({ params }: RsvpPageProps) {
  const { eventSlug } = await params;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-bold">참석 여부 응답</h1>
        <p className="mt-2 text-gray-500">이벤트: {eventSlug}</p>
        {/* TODO: RSVP form */}
      </div>
    </main>
  );
}
