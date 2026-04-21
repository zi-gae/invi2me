import { notFound } from 'next/navigation';
import { db } from '@/db';
import { events } from '@/db/schema/events';
import { eq, and } from 'drizzle-orm';
import { getGuestByToken } from '@/features/guests/queries/guest.queries';
import { getDefaultRsvpForm, getExistingRsvpResponse } from '@/features/rsvp/queries/rsvp.queries';
import { RsvpForm } from '@/features/rsvp/components/rsvp-form';
import { DomainError } from '@/shared/lib/errors';
import {
  CheckCircle,
  Hourglass,
  Warning,
  Lock,
} from '@phosphor-icons/react/dist/ssr';

interface RsvpPageProps {
  params: Promise<{ eventSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function RsvpPage({ params, searchParams }: RsvpPageProps) {
  const { eventSlug } = await params;
  const { token } = await searchParams;

  // Get published event
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, eventSlug), eq(events.status, 'published')))
    .limit(1);

  if (!event) notFound();

  // No token → show message
  if (!token) {
    return (
      <RsvpLayout title={event.title}>
        <StatusCard
          icon={<Lock weight="duotone" className="size-8 text-muted-foreground" />}
          title="초대 링크가 필요합니다"
          description="개인 초대 링크를 통해 접속해주세요. 초대 링크는 카카오톡이나 이메일로 전달됩니다."
        />
      </RsvpLayout>
    );
  }

  // Validate guest token
  let guest;
  try {
    guest = await getGuestByToken(token);
  } catch (error) {
    if (error instanceof DomainError && error.statusCode === 404) {
      return (
        <RsvpLayout title={event.title}>
          <StatusCard
            icon={<Warning weight="duotone" className="size-8 text-destructive" />}
            title="유효하지 않은 초대 링크입니다"
            description="초대 링크가 만료되었거나 잘못된 링크입니다. 초대를 보내신 분에게 문의해주세요."
          />
        </RsvpLayout>
      );
    }
    throw error;
  }

  // Check RSVP window
  const now = new Date();
  if (event.rsvpClosesAt && new Date(event.rsvpClosesAt) < now) {
    return (
      <RsvpLayout title={event.title}>
        <StatusCard
          icon={<Hourglass weight="duotone" className="size-8 text-amber-500" />}
          title="응답 기간이 마감되었습니다"
          description="RSVP 응답 기간이 종료되었습니다. 문의사항은 초대를 보내신 분에게 연락해주세요."
        />
      </RsvpLayout>
    );
  }

  if (event.rsvpOpensAt && new Date(event.rsvpOpensAt) > now) {
    return (
      <RsvpLayout title={event.title}>
        <StatusCard
          icon={<Hourglass weight="duotone" className="size-8 text-muted-foreground" />}
          title="아직 응답 기간이 아닙니다"
          description={`응답은 ${new Date(event.rsvpOpensAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}부터 가능합니다.`}
        />
      </RsvpLayout>
    );
  }

  // Check if already submitted
  const existingResponse = await getExistingRsvpResponse(event.id, guest.id);
  if (existingResponse) {
    const statusLabels: Record<string, string> = {
      attending: '참석',
      not_attending: '불참',
      maybe: '미정',
    };
    return (
      <RsvpLayout title={event.title}>
        <div className="space-y-6 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950">
            <CheckCircle weight="duotone" className="size-10 text-rose-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">이미 응답하셨습니다</h2>
            <p className="mt-2 text-muted-foreground">
              <span className="font-semibold text-foreground">{guest.fullName}</span>님은 이미 응답을 완료하셨습니다.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-4 text-left">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">참석 여부</dt>
                <dd className="font-medium">{statusLabels[existingResponse.attendanceStatus] ?? existingResponse.attendanceStatus}</dd>
              </div>
              {existingResponse.partySize > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">참석 인원</dt>
                  <dd className="font-medium">{existingResponse.partySize}명</dd>
                </div>
              )}
              {existingResponse.mealCount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">식사 인원</dt>
                  <dd className="font-medium">{existingResponse.mealCount}명</dd>
                </div>
              )}
              {existingResponse.messageToCouple && (
                <div className="border-t pt-2">
                  <dt className="mb-1 text-muted-foreground">축하 메시지</dt>
                  <dd className="text-foreground">{existingResponse.messageToCouple}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </RsvpLayout>
    );
  }

  // Check RSVP form exists
  const form = await getDefaultRsvpForm(event.id);
  if (!form) {
    return (
      <RsvpLayout title={event.title}>
        <StatusCard
          icon={<Warning weight="duotone" className="size-8 text-muted-foreground" />}
          title="RSVP를 사용할 수 없습니다"
          description="이 이벤트의 RSVP 양식이 아직 준비되지 않았습니다."
        />
      </RsvpLayout>
    );
  }

  return (
    <RsvpLayout title={event.title}>
      <RsvpForm
        eventSlug={eventSlug}
        guestToken={token}
        guestName={guest.fullName}
        maxCompanionCount={guest.maxCompanionCount ?? 5}
      />
    </RsvpLayout>
  );
}

function RsvpLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">참석 여부 응답</p>
        </div>
        {children}
      </div>
    </main>
  );
}

function StatusCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
