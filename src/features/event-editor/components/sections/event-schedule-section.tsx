import { MapPin, Calendar, Clock } from 'lucide-react';
import { SectionHeader } from './section-shared';

export function EventScheduleSection({ props }: { props: Record<string, unknown> }) {
  const date = props.date as string | undefined;
  const time = (props.time as string) ?? '';
  const venueName = (props.venueName as string) ?? '';
  const venueAddress = (props.venueAddress as string) ?? '';
  const hallName = (props.hallName as string) ?? '';

  const formattedDate = date
    ? new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date(date))
    : '';

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <SectionHeader label="SCHEDULE" title="일시 · 장소" />
      <div className="mx-auto max-w-xs space-y-6 text-center">
        {formattedDate && (
          <div className="flex items-center justify-center gap-3 text-stone-700">
            <Calendar className="size-4 shrink-0 text-stone-400" aria-hidden="true" />
            <time dateTime={date} className="text-[15px] tracking-wide">
              {formattedDate}
            </time>
          </div>
        )}
        {time && (
          <div className="flex items-center justify-center gap-3 text-stone-700">
            <Clock className="size-4 shrink-0 text-stone-400" aria-hidden="true" />
            <time className="text-[15px] tracking-wide">{time}</time>
          </div>
        )}
        {(venueName || venueAddress) && (
          <div className="flex items-start justify-center gap-3 text-stone-700">
            <MapPin
              className="size-4 shrink-0 translate-y-0.5 text-stone-400"
              aria-hidden="true"
            />
            <address className="not-italic text-left">
              {venueName && (
                <p className="text-[15px] tracking-wide">{venueName}</p>
              )}
              {hallName && (
                <p className="mt-0.5 text-sm text-stone-500">{hallName}</p>
              )}
              {venueAddress && (
                <p className="mt-1 text-xs text-stone-400">{venueAddress}</p>
              )}
            </address>
          </div>
        )}
      </div>
    </section>
  );
}
