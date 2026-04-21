import { SectionHeader } from './section-shared';
import { CheckCircle, XCircle, Question } from '@phosphor-icons/react/dist/ssr';

export function RsvpFormSection({ props }: { props: Record<string, unknown> }) {
  const description =
    (props.description as string) ??
    '참석 여부를 알려주시면 준비에 큰 도움이 됩니다.';
  const deadline = props.deadline as string | undefined;

  const deadlineFormatted = deadline
    ? new Intl.DateTimeFormat('ko-KR', {
        month: 'long',
        day: 'numeric',
      }).format(new Date(deadline))
    : '';

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <SectionHeader label="RSVP" title="참석 여부" />
      <div className="mx-auto max-w-xs text-center">
        {description && (
          <p className="mb-4 text-sm leading-relaxed text-stone-500">{description}</p>
        )}
        {deadlineFormatted && (
          <p className="mb-8 text-xs text-stone-400">
            회신 기한:{' '}
            <time dateTime={deadline}>{deadlineFormatted}</time>까지
          </p>
        )}
        <div className="flex gap-2.5">
          <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-rose-300 bg-white px-3 py-5">
            <CheckCircle weight="fill" className="size-7 text-rose-400" />
            <span className="text-xs font-semibold text-rose-500">참석합니다</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-stone-200 bg-white px-3 py-5">
            <XCircle weight="fill" className="size-7 text-stone-400" />
            <span className="text-xs font-semibold text-stone-400">불참합니다</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-amber-200 bg-white px-3 py-5">
            <Question weight="fill" className="size-7 text-amber-400" />
            <span className="text-xs font-semibold text-amber-500">미정입니다</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-stone-400">참석 버튼을 눌러 응답을 남겨주세요.</p>
      </div>
    </section>
  );
}
