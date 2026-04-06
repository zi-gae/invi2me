import { notFound } from 'next/navigation';

interface EventPageProps {
  params: Promise<{ eventSlug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventSlug } = await params;

  // TODO: Fetch published event by slug
  // TODO: Render published snapshot sections

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold">이벤트: {eventSlug}</h1>
        <p className="mt-4 text-gray-500">공개 이벤트 페이지가 여기에 렌더링됩니다.</p>
      </div>
    </main>
  );
}
