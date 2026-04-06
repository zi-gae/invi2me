interface EditorPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { eventId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">페이지 편집기</h1>
      {/* TODO: Block-based page editor */}
    </div>
  );
}
