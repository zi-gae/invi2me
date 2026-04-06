interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">이벤트 상세</h1>
      <p className="text-gray-500">ID: {eventId}</p>
      {/* TODO: Event overview dashboard */}
    </div>
  );
}
