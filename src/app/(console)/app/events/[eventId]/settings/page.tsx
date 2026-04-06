interface SettingsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { eventId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">이벤트 설정</h1>
      {/* TODO: Event settings form */}
    </div>
  );
}
