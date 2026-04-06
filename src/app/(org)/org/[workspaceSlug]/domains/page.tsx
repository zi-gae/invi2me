interface DomainsPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function DomainsPage({ params }: DomainsPageProps) {
  const { workspaceSlug } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">도메인 관리</h1>
      {/* TODO: Custom domains management */}
    </div>
  );
}
