'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitRsvpSchema } from '../schemas/rsvp.schema';
import { submitRsvpAction, type RsvpActionResult } from '../actions/rsvp.actions';
import type { PublicRsvpResponseDto } from '../types/rsvp.dto';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  XCircle,
  Question,
  Confetti,
  Users,
  ForkKnife,
  PaperPlaneTilt,
  ChatTeardropText,
} from '@phosphor-icons/react';

type RsvpFormValues = {
  attendanceStatus: 'attending' | 'not_attending' | 'maybe';
  side: 'groom' | 'bride';
  companionCount: number;
  hasMeal: boolean;
  messageToCouple?: string;
  answers?: Record<string, unknown>;
  consents?: Record<string, boolean>;
};

const ATTENDANCE_OPTIONS = [
  {
    value: 'attending',
    label: '참석합니다',
    Icon: CheckCircle,
    selectedClass: 'border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
    iconClass: 'text-rose-500',
  },
  {
    value: 'not_attending',
    label: '불참합니다',
    Icon: XCircle,
    selectedClass: 'border-stone-400 bg-stone-50 text-stone-600 dark:bg-stone-800 dark:text-stone-300',
    iconClass: 'text-stone-400',
  },
  {
    value: 'maybe',
    label: '미정입니다',
    Icon: Question,
    selectedClass: 'border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
    iconClass: 'text-amber-500',
  },
] as const;

interface RsvpFormProps {
  eventSlug: string;
  guestToken: string;
  guestName: string;
  maxCompanionCount: number;
}

export function RsvpForm({ eventSlug, guestToken, guestName, maxCompanionCount }: RsvpFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<RsvpActionResult | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(submitRsvpSchema) as never,
    defaultValues: {
      attendanceStatus: undefined,
      side: undefined,
      companionCount: 0,
      hasMeal: false,
      messageToCouple: '',
    },
  });

  const attendanceStatus = watch('attendanceStatus');
  const side = watch('side');
  const isAttending = attendanceStatus === 'attending' || attendanceStatus === 'maybe';

  function onSubmit(data: RsvpFormValues) {
    startTransition(async () => {
      const res = await submitRsvpAction(eventSlug, guestToken, data);
      setResult(res);
    });
  }

  if (result?.success) {
    return <RsvpSuccess data={result.data} guestName={guestName} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Guest greeting */}
      <div className="text-center">
        <p className="text-lg text-muted-foreground">
          <span className="font-semibold text-foreground">{guestName}</span>님,
        </p>
        <p className="text-muted-foreground">참석 여부를 알려주세요.</p>
      </div>

      {/* Attendance status */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-muted-foreground">
          참석 여부를 선택해주세요 <span className="text-destructive">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {ATTENDANCE_OPTIONS.map((option) => {
            const isSelected = attendanceStatus === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setValue('attendanceStatus', option.value as RsvpFormValues['attendanceStatus'], { shouldValidate: true });
                  if (option.value === 'not_attending') {
                    setValue('companionCount', 0);
                    setValue('hasMeal', false);
                  }
                }}
                className={`flex flex-col items-center gap-2.5 rounded-2xl border-2 px-3 py-5 transition-all duration-200 ${
                  isSelected
                    ? option.selectedClass
                    : 'border-border bg-background hover:border-muted-foreground/30 hover:bg-muted/40'
                }`}
              >
                <option.Icon
                  weight={isSelected ? 'fill' : 'regular'}
                  className={`size-7 transition-colors ${isSelected ? option.iconClass : 'text-muted-foreground'}`}
                />
                <span className="text-xs font-semibold">{option.label}</span>
              </button>
            );
          })}
        </div>
        {errors.attendanceStatus && (
          <p className="text-sm text-destructive">{errors.attendanceStatus.message ?? '참석 여부를 선택해주세요.'}</p>
        )}
      </fieldset>

      {/* Side selection */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-muted-foreground">
          신랑/신부 측을 선택해주세요 <span className="text-destructive">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'groom', label: '신랑 측' },
            { value: 'bride', label: '신부 측' },
          ] as const).map((option) => {
            const isSelected = side === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('side', option.value, { shouldValidate: true })}
                className={`rounded-2xl border-2 py-3 text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
                    : 'border-border bg-background hover:border-muted-foreground/30 hover:bg-muted/40'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {errors.side && (
          <p className="text-sm text-destructive">{errors.side.message ?? '신랑/신부 측을 선택해주세요.'}</p>
        )}
      </fieldset>

      {/* Companion count & meal (only when attending/maybe) */}
      {isAttending && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companionCount" className="flex items-center gap-1.5 text-sm">
              <Users weight="duotone" className="size-4 text-rose-400" />
              추가 인원
            </Label>
            <select
              id="companionCount"
              {...register('companionCount', { valueAsNumber: true })}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-invalid={!!errors.companionCount}
            >
              <option value={0}>없음</option>
              {Array.from({ length: Math.min(maxCompanionCount, 10) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
            {errors.companionCount && (
              <p className="text-xs text-destructive">{errors.companionCount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="hasMeal" className="flex items-center gap-1.5 text-sm">
              <ForkKnife weight="duotone" className="size-4 text-rose-400" />
              식사 여부
            </Label>
            <select
              id="hasMeal"
              onChange={(e) => setValue('hasMeal', e.target.value === 'true', { shouldValidate: true })}
              defaultValue="false"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="true">식사 예정</option>
              <option value="false">식사 안 함</option>
            </select>
          </div>
        </div>
      )}

      {/* Message to couple */}
      <div className="space-y-2">
        <Label htmlFor="messageToCouple" className="flex items-center gap-1.5 text-sm">
          <ChatTeardropText weight="duotone" className="size-4 text-rose-400" />
          축하 메시지 <span className="text-muted-foreground font-normal">(선택)</span>
        </Label>
        <Textarea
          id="messageToCouple"
          placeholder="축하의 말씀을 남겨주세요"
          maxLength={1000}
          {...register('messageToCouple')}
          aria-invalid={!!errors.messageToCouple}
        />
        {errors.messageToCouple && (
          <p className="text-xs text-destructive">{errors.messageToCouple.message}</p>
        )}
      </div>

      {/* Server error */}
      {result && !result.success && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {result.error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full gap-2 rounded-xl"
        disabled={isPending || !attendanceStatus || !side}
      >
        <PaperPlaneTilt weight="fill" className="size-4" />
        {isPending ? '제출 중...' : '응답 제출하기'}
      </Button>
    </form>
  );
}

/** Success view after submission */
function RsvpSuccess({ data, guestName }: { data: PublicRsvpResponseDto; guestName: string }) {
  const statusLabels: Record<string, string> = {
    attending: '참석',
    not_attending: '불참',
    maybe: '미정',
  };

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950">
        <Confetti weight="duotone" className="size-10 text-rose-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold">응답이 완료되었습니다</h2>
        <p className="mt-2 text-muted-foreground">
          <span className="font-semibold text-foreground">{guestName}</span>님의 응답이 정상적으로 접수되었습니다.
        </p>
      </div>
      <div className="rounded-2xl border bg-card p-4 text-left">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">참석 여부</dt>
            <dd className="font-medium">{statusLabels[data.attendanceStatus] ?? data.attendanceStatus}</dd>
          </div>
          {data.partySize > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">참석 인원</dt>
              <dd className="font-medium">{data.partySize}명</dd>
            </div>
          )}
          {data.mealCount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">식사 인원</dt>
              <dd className="font-medium">{data.mealCount}명</dd>
            </div>
          )}
          {data.messageToCouple && (
            <div className="border-t pt-2">
              <dt className="mb-1 text-muted-foreground">축하 메시지</dt>
              <dd className="text-foreground">{data.messageToCouple}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
