import { notFound } from 'next/navigation';
import { getPublishedPage } from '@/features/event-editor/queries/page.queries';
import { SectionRenderer } from '@/features/event-editor/components/section-renderer';
import { DomainError } from '@/shared/lib/errors';
import type { PublishedPageDto } from '@/features/event-editor/types/editor.dto';

interface EventPageProps {
  params: Promise<{ eventSlug: string }>;
}

async function fetchPage(eventSlug: string): Promise<PublishedPageDto> {
  try {
    return await getPublishedPage(eventSlug);
  } catch (error) {
    if (error instanceof DomainError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventSlug } = await params;
  const page = await fetchPage(eventSlug);

  return (
    <main className="min-h-screen">
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
