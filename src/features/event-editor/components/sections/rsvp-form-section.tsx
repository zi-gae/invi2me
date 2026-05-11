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

const STATUS_OPTIONS: { status: AttendanceStatus; label: string; icon: React.ElementType; activeColor: string }[] = [
  { status: 'attending',     label: '참석합니다', icon: CheckCircle, activeColor: 'border-green-300 bg-green-50 text-green-600 [&_svg]:text-green-500' },
  { status: 'not_attending', label: '불참합니다', icon: XCircle,     activeColor: 'border-rose-300 bg-rose-50 text-rose-500 [&_svg]:text-rose-400' },
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<SubmitAnonymousRsvpInput>({
    resolver: zodResolver(submitAnonymousRsvpSchema),
    defaultValues: { name: '', companionCount: 0, hasMeal: false, attendanceStatus: 'attending', side: undefined },
  });

  const selectedStatus = form.watch('attendanceStatus');

  function handleOpenDialog() {
    if (!selectedSide) return;
    setErrorMsg(null);
    form.setValue('side', selectedSide);
    setDialogOpen(true);
  }

  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSide) return;
    const status = form.getValues('attendanceStatus');
    startTransition(async () => {
      const result = await submitRsvpAction(eventSlug, token!, {
        attendanceStatus: status,
        side: selectedSide,
        companionCount: 0,
        hasMeal: false,
      });
      if (result.success) {
        setSubmitted(status);
        setDialogOpen(false);
      } else {
        setErrorMsg(result.error);
      }
    });
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
    const option = STATUS_OPTIONS.find((o) => o.status === submitted)!;
    const Icon = option.icon;
    return (
      <section className="bg-stone-50 px-6 py-20 sm:py-24">
        <SectionHeader label="RSVP" title="참석 여부" />
        <div className="mx-auto max-w-xs text-center">
          <div className={`inline-flex flex-col items-center gap-3 rounded-2xl border-2 bg-white px-10 py-8 ${option.activeColor}`}>
            <Icon weight="fill" className="size-10" />
            <span className="text-sm font-semibold">{option.label}</span>
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

        {/* 신랑/신부 측 선택 */}
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

        {/* 단일 CTA 버튼 */}
        <button
          type="button"
          disabled={!selectedSide}
          onClick={handleOpenDialog}
          className="w-full rounded-2xl bg-stone-800 py-4 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
        >
          참석 여부 응답하기
        </button>
        {errorMsg && <p className="mt-4 text-xs text-red-500">{errorMsg}</p>}
        {!errorMsg && (
          <p className="mt-4 text-xs text-stone-400">
            {selectedSide ? '버튼을 눌러 응답을 남겨주세요.' : '신랑/신부 측을 먼저 선택해주세요.'}
          </p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>참석 여부 응답</DialogTitle>
            <DialogDescription>참석 여부와 정보를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={token ? handleTokenSubmit : form.handleSubmit(handleAnonymousSubmit)}
            className="mt-2 flex flex-col gap-4"
          >
            <input type="hidden" {...form.register('side')} />

            {/* 참석 여부 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-stone-700">참석 여부</span>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map(({ status, label, icon: Icon, activeColor }) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => form.setValue('attendanceStatus', status)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-xs font-semibold transition-all ${
                      selectedStatus === status ? activeColor : 'border-stone-200 bg-white text-stone-500'
                    }`}
                  >
                    <Icon weight="fill" className="size-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 이름 / 식사 여부 / 추가 인원 — 토큰 없을 때만 */}
            {!token && (
              <>
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

                {selectedStatus !== 'not_attending' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-stone-700">식사 여부</span>
                      <div className="flex gap-2">
                        {([{ value: true, label: '식사합니다' }, { value: false, label: '식사 안 합니다' }] as const).map(({ value, label }) => {
                          const watched = form.watch('hasMeal');
                          const activeColor = value
                            ? 'border-green-300 bg-green-50 text-green-600'
                            : 'border-rose-300 bg-rose-50 text-rose-500';
                          return (
                            <button
                              key={String(value)}
                              type="button"
                              onClick={() => form.setValue('hasMeal', value)}
                              className={`flex flex-1 items-center justify-center rounded-lg border py-2 text-xs font-semibold transition-all ${
                                watched === value ? activeColor : 'border-stone-200 bg-white text-stone-500'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-stone-700">추가 인원</span>
                      <div className="flex w-full items-center justify-between rounded-lg border border-stone-200 px-3 py-2">
                        <span className="text-xs text-stone-400">본인 제외</span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => form.setValue('companionCount', Math.max(0, (form.getValues('companionCount') ?? 0) - 1))}
                            className="flex size-7 items-center justify-center rounded-md border border-stone-200 text-stone-500 hover:border-stone-300"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm font-semibold text-stone-700">
                            {form.watch('companionCount') ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => form.setValue('companionCount', Math.min(10, (form.getValues('companionCount') ?? 0) + 1))}
                            className="flex size-7 items-center justify-center rounded-md border border-stone-200 text-stone-500 hover:border-stone-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {form.formState.errors.root && (
              <p className="text-xs text-red-500">{form.formState.errors.root.message}</p>
            )}
            {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
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
