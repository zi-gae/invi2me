interface MembersPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { workspaceSlug } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">멤버 관리</h1>
      {/* TODO: Members table */}
    </div>
  );
}
