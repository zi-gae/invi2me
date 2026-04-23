'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, XCircle, Question } from '@phosphor-icons/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SectionHeader } from './section-shared';
import { submitRsvpAction, submitAnonymousRsvpAction } from '@/features/rsvp/actions/rsvp.actions';
import { submitAnonymousRsvpSchema, type SubmitAnonymousRsvpInput } from '@/features/rsvp/schemas/rsvp.schema';

type AttendanceStatus = 'attending' | 'not_attending' | 'maybe';

interface RsvpFormSectionProps {
  props: Record<string, unknown>;
  eventSlug: string;
}

const BUTTONS: { status: AttendanceStatus; label: string; icon: React.ElementType; color: string }[] = [
  { status: 'attending',     label: '참석합니다', icon: CheckCircle, color: 'border-rose-300 text-rose-500 [&_svg]:text-rose-400' },
  { status: 'not_attending', label: '불참합니다', icon: XCircle,     color: 'border-stone-200 text-stone-400 [&_svg]:text-stone-400' },
  { status: 'maybe',         label: '미정입니다', icon: Question,    color: 'border-amber-200 text-amber-500 [&_svg]:text-amber-400' },
];

export function RsvpFormSection({ props, eventSlug }: RsvpFormSectionProps) {
  const description =
    (props.description as string) ?? '참석 여부를 알려주시면 준비에 큰 도움이 됩니다.';
  const deadline = props.deadline as string | undefined;

  const deadlineFormatted = deadline
    ? new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(new Date(deadline))
    : '';

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState<AttendanceStatus | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 익명 팝업 상태
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AttendanceStatus | null>(null);

  const form = useForm<SubmitAnonymousRsvpInput>({
    resolver: zodResolver(submitAnonymousRsvpSchema),
    defaultValues: { name: '', phone: '', attendanceStatus: 'attending' },
  });

  function handleButtonClick(status: AttendanceStatus) {
    setErrorMsg(null);
    if (token) {
      // 토큰 있음: 바로 제출
      startTransition(async () => {
        const result = await submitRsvpAction(eventSlug, token, { attendanceStatus: status, partySize: 1, mealCount: 0 });
        if (result.success) {
          setSubmitted(status);
        } else {
          setErrorMsg(result.error);
        }
      });
    } else {
      // 토큰 없음: 팝업 열기
      setPendingStatus(status);
      form.setValue('attendanceStatus', status);
      setDialogOpen(true);
    }
  }

  function handleAnonymousSubmit(data: SubmitAnonymousRsvpInput) {
    startTransition(async () => {
      const result = await submitAnonymousRsvpAction(eventSlug, data);
      if (result.success) {
        setSubmitted(data.attendanceStatus);
        setDialogOpen(false);
      } else {
        form.setError('root', { message: result.error });
      }
    });
  }

  if (submitted) {
    const btn = BUTTONS.find((b) => b.status === submitted)!;
    const Icon = btn.icon;
    return (
      <section className="bg-stone-50 px-6 py-20 sm:py-24">
        <SectionHeader label="RSVP" title="참석 여부" />
        <div className="mx-auto max-w-xs text-center">
          <div className={`inline-flex flex-col items-center gap-3 rounded-2xl border-2 bg-white px-10 py-8 ${btn.color}`}>
            <Icon weight="fill" className="size-10" />
            <span className="text-sm font-semibold">{btn.label}</span>
          </div>
          <p className="mt-6 text-xs text-stone-400">응답이 저장되었습니다. 감사합니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <SectionHeader label="RSVP" title="참석 여부" />
      <div className="mx-auto max-w-xs text-center">
        {description && (
          <p className="mb-4 text-sm leading-relaxed text-stone-500">{description}</p>
        )}
        {deadlineFormatted && (
          <p className="mb-8 text-xs text-stone-400">
            회신 기한: <time dateTime={deadline}>{deadlineFormatted}</time>까지
          </p>
        )}
        <div className="flex gap-2.5">
          {BUTTONS.map(({ status, label, icon: Icon, color }) => (
            <button
              key={status}
              type="button"
              disabled={isPending}
              onClick={() => handleButtonClick(status)}
              className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 bg-white px-3 py-5 transition-opacity disabled:opacity-50 ${color}`}
            >
              <Icon weight="fill" className="size-7" />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
        {errorMsg && <p className="mt-4 text-xs text-red-500">{errorMsg}</p>}
        {!errorMsg && (
          <p className="mt-4 text-xs text-stone-400">참석 버튼을 눌러 응답을 남겨주세요.</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {pendingStatus === 'attending' ? '참석 응답' : pendingStatus === 'not_attending' ? '불참 응답' : '미정 응답'}
            </DialogTitle>
            <DialogDescription>응답자 확인을 위해 이름과 전화번호를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleAnonymousSubmit)} className="mt-2 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rsvp-name" className="text-sm font-medium text-stone-700">이름</label>
              <input
                id="rsvp-name"
                type="text"
                placeholder="홍길동"
                autoComplete="name"
                {...form.register('name')}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rsvp-phone" className="text-sm font-medium text-stone-700">전화번호</label>
              <input
                id="rsvp-phone"
                type="tel"
                placeholder="010-0000-0000"
                autoComplete="tel"
                {...form.register('phone')}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
              />
              {form.formState.errors.phone && (
                <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
            {form.formState.errors.root && (
              <p className="text-xs text-red-500">{form.formState.errors.root.message}</p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="mt-1 rounded-xl bg-stone-800 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
              {isPending ? '저장 중...' : '응답 제출'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
