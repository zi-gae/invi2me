interface BillingPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { workspaceSlug } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">청구/플랜 관리</h1>
      {/* TODO: Billing dashboard */}
    </div>
  );
}
