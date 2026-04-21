import { SectionHeader } from './section-shared';

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
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col items-center rounded-xl border border-rose-200 bg-white px-4 py-5">
            <span className="text-2xl" aria-label="참석">
              🥂
            </span>
            <span className="mt-2 text-sm font-medium text-rose-500">참석</span>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-xl border border-stone-200 bg-white px-4 py-5">
            <span className="text-2xl" aria-label="불참">
              😔
            </span>
            <span className="mt-2 text-sm font-medium text-stone-500">불참</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-stone-400">참석 버튼을 눌러 응답을 남겨주세요.</p>
      </div>
    </section>
  );
}
