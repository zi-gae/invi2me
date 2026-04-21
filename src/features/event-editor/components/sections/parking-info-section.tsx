import { SectionHeader } from './section-shared';

export function ParkingInfoSection({ props }: { props: Record<string, unknown> }) {
  const description = (props.description as string) ?? '';
  const note = (props.note as string) ?? '';

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <SectionHeader label="PARKING" title="주차 안내" />
      <div className="mx-auto max-w-sm text-center">
        {description && (
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-stone-600">
            {description}
          </p>
        )}
        {note && <p className="mt-4 text-sm text-stone-400">{note}</p>}
        {!description && !note && (
          <p className="text-sm text-stone-400">주차 정보가 없습니다.</p>
        )}
      </div>
    </section>
  );
}
