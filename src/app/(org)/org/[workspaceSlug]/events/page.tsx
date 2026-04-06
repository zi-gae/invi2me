interface OrgEventsPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function OrgEventsPage({ params }: OrgEventsPageProps) {
  const { workspaceSlug } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">조직 이벤트</h1>
      {/* TODO: Org events list */}
    </div>
  );
}
