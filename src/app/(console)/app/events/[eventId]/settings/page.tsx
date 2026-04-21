import Link from 'next/link';
import { getAdminEventById } from '@/features/events/queries/event.queries';
import { EventSettingsForm } from '@/features/events/components/event-settings-form';
import { EventNotFoundError } from '@/shared/lib/errors';

interface SettingsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { eventId } = await params;

  let event;
  try {
    event = await getAdminEventById(eventId);
  } catch (error) {
    if (error instanceof EventNotFoundError) {
      return (
        <div className="h-full overflow-y-auto px-8 pb-8">
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold text-muted-foreground">이벤트를 찾을 수 없습니다</h1>
            <Link
              href="/app/events"
              className="mt-4 text-sm text-primary underline underline-offset-4"
            >
              이벤트 목록으로 돌아가기
            </Link>
          </div>
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="h-full overflow-y-auto px-8 pb-8">
      <EventSettingsForm event={event} />
    </div>
  );
}
