import { CountdownTimer } from '../countdown-timer';
import { Ornament } from './section-shared';

export function CountdownSection({ props }: { props: Record<string, unknown> }) {
  const targetDate = props.targetDate as string | undefined;
  const label = (props.label as string) ?? '결혼식까지';

  if (!targetDate) return null;

  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date(targetDate));

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-sm text-center">
        <span className="text-[11px] tracking-[0.35em] text-stone-400 uppercase">D-DAY</span>
        <p className="mt-2 text-sm tracking-[0.2em] text-stone-500">{label}</p>
        <div className="mt-8">
          <CountdownTimer targetDate={targetDate} />
        </div>
        <Ornament className="mt-8" />
        <time dateTime={targetDate} className="mt-6 block text-sm tracking-[0.15em] text-stone-400">
          {formattedDate}
        </time>
      </div>
    </section>
  );
}
