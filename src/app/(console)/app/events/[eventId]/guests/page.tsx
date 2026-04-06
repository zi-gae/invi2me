interface GuestsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function GuestsPage({ params }: GuestsPageProps) {
  const { eventId } = await params;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">게스트 관리</h1>
        {/* TODO: Add/import guest buttons */}
      </div>
      {/* TODO: Guest list table */}
    </div>
  );
}
