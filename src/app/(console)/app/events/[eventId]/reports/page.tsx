interface ReportsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { eventId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">리포트</h1>
      {/* TODO: Analytics dashboard */}
    </div>
  );
}
