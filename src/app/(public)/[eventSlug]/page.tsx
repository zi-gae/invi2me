import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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

function formatKakaoDate(isoString: string): string {
  const date = new Date(isoString);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayName = days[date.getDay()];
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${year}.${month}.${day}.(${dayName}) ${period} ${displayHours}:${minutes}`;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { eventSlug } = await params;
  let page: PublishedPageDto;
  try {
    page = await getPublishedPage(eventSlug);
  } catch {
    return {};
  }

  const title = page.seoTitle ?? page.title ?? 'invi2me';
  const dateStr = page.startsAt ? formatKakaoDate(page.startsAt) : null;
  const description = dateStr ?? undefined;
  const imageUrl = page.ogImageUrl ?? page.coverImageUrl ?? undefined;
  const url = `https://invi2me.com/${eventSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'website',
    },
    twitter: null,
    alternates: {
      canonical: url,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventSlug } = await params;
  const page = await fetchPage(eventSlug);

  return (
    <main className="min-h-screen">
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} eventSlug={eventSlug} />
      ))}
    </main>
  );
}
