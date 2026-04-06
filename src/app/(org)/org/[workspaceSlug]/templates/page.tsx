interface TemplatesPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function TemplatesPage({ params }: TemplatesPageProps) {
  const { workspaceSlug } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">템플릿 관리</h1>
      {/* TODO: Template library */}
    </div>
  );
}
