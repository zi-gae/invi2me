interface CheckinManagePageProps {
  params: Promise<{ eventId: string }>;
}

export default async function CheckinManagePage({ params }: CheckinManagePageProps) {
  const { eventId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">체크인 관리</h1>
      {/* TODO: Checkin session management + logs */}
    </div>
  );
}
