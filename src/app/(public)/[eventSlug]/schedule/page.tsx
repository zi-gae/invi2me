interface SchedulePageProps {
  params: Promise<{ eventSlug: string }>;
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const { eventSlug } = await params;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold">일정 안내</h1>
        {/* TODO: Render event schedules */}
      </div>
    </main>
  );
}
