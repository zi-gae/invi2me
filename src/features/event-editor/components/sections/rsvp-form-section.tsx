'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
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
  { status: 'attending',     label: '참석합니다', icon: CheckCircle, color: 'border-green-300 text-green-600 [&_svg]:text-green-400' },
  { status: 'not_attending', label: '불참합니다', icon: XCircle,     color: 'border-stone-200 text-stone-400 [&_svg]:text-stone-400' },
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
  const [selectedSide, setSelectedSide] = useState<'groom' | 'bride' | null>(null);

  // 익명 팝업 상태
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AttendanceStatus | null>(null);

  const form = useForm<SubmitAnonymousRsvpInput>({
    resolver: zodResolver(submitAnonymousRsvpSchema),
    defaultValues: { name: '', companionCount: 0, hasMeal: false, attendanceStatus: 'attending', side: undefined },
  });

  function handleButtonClick(status: AttendanceStatus) {
    if (!selectedSide) return;
    setErrorMsg(null);
    if (token) {
      // 토큰 있음: 바로 제출
      startTransition(async () => {
        const result = await submitRsvpAction(eventSlug, token, {
          attendanceStatus: status,
          side: selectedSide,
          companionCount: 0,
          hasMeal: false,
        });
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
      form.setValue('side', selectedSide);
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
          <p className="mb-6 text-xs text-stone-400">
            회신 기한: <time dateTime={deadline}>{deadlineFormatted}</time>까지
          </p>
        )}

        {/* Side selection */}
        <div className="mb-6">
          <p className="mb-2.5 text-xs font-medium text-stone-400">신랑/신부 측을 선택해주세요</p>
          <div className="flex gap-2.5">
            {([
              { value: 'groom', label: '신랑 측' },
              { value: 'bride', label: '신부 측' },
            ] as const).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedSide(value)}
                className={`flex flex-1 items-center justify-center rounded-2xl border-2 py-3 text-sm font-semibold transition-all duration-200 ${
                  selectedSide === value
                    ? 'border-green-300 bg-green-50 text-green-600'
                    : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5">
          {BUTTONS.map(({ status, label, icon: Icon, color }) => (
            <button
              key={status}
              type="button"
              disabled={isPending || !selectedSide}
              onClick={() => handleButtonClick(status)}
              className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 bg-white px-3 py-5 transition-opacity disabled:opacity-40 ${color}`}
            >
              <Icon weight="fill" className="size-7" />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
        {errorMsg && <p className="mt-4 text-xs text-red-500">{errorMsg}</p>}
        {!errorMsg && (
          <p className="mt-4 text-xs text-stone-400">
            {selectedSide ? '참석 버튼을 눌러 응답을 남겨주세요.' : '신랑/신부 측을 먼저 선택해주세요.'}
          </p>
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
            <input type="hidden" {...form.register('side')} />

            {/* 이름 */}
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

            {/* 식사 여부 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-stone-700">식사 여부</span>
              <div className="flex gap-2">
                {([{ value: true, label: '식사합니다' }, { value: false, label: '식사 안 합니다' }] as const).map(({ value, label }) => {
                  const watched = form.watch('hasMeal');
                  return (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => form.setValue('hasMeal', value)}
                      className={`flex flex-1 items-center justify-center rounded-lg border py-2 text-xs font-semibold transition-all ${
                        watched === value
                          ? 'border-green-300 bg-green-50 text-green-600'
                          : 'border-stone-200 bg-white text-stone-500'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 추가 인원 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-stone-700">추가 인원</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => form.setValue('companionCount', Math.max(0, (form.getValues('companionCount') ?? 0) - 1))}
                  className="flex size-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-stone-300"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold text-stone-700">
                  {form.watch('companionCount') ?? 0}
                </span>
                <button
                  type="button"
                  onClick={() => form.setValue('companionCount', Math.min(10, (form.getValues('companionCount') ?? 0) + 1))}
                  className="flex size-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-stone-300"
                >
                  +
                </button>
                <span className="text-xs text-stone-400">명 (본인 제외)</span>
              </div>
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
