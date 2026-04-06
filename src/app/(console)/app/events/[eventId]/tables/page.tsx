interface TablesPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function TablesPage({ params }: TablesPageProps) {
  const { eventId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">좌석/테이블 관리</h1>
      {/* TODO: Seating chart editor */}
    </div>
  );
}
