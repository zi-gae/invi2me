interface GalleryPageProps {
  params: Promise<{ eventSlug: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { eventSlug } = await params;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-2xl font-bold">갤러리</h1>
        {/* TODO: Render photo gallery */}
      </div>
    </main>
  );
}
