interface RsvpsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function RsvpsPage({ params }: RsvpsPageProps) {
  const { eventId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">RSVP 응답 현황</h1>
      {/* TODO: RSVP summary cards + response table */}
    </div>
  );
}
