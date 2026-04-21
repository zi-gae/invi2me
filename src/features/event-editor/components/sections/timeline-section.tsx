import { SectionHeader } from './section-shared';

interface TimelineItem {
  time: string;
  event: string;
  description?: string;
}

export function TimelineSection({ props }: { props: Record<string, unknown> }) {
  const items = (props.items as TimelineItem[]) ?? [];

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <SectionHeader label="TIMELINE" title="식순" />
      {items.length > 0 ? (
        <ol className="mx-auto max-w-xs">
          {items.map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-xs text-stone-400">
                  {i + 1}
                </div>
                {i < items.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-stone-100" />
                )}
              </div>
              <div className="pb-6">
                <span className="text-xs text-stone-400">{item.time}</span>
                <p className="mt-0.5 text-sm font-medium text-stone-700">{item.event}</p>
                {item.description && (
                  <p className="mt-1 text-xs text-stone-400">{item.description}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mx-auto max-w-xs rounded-xl border border-dashed border-stone-200 py-10 text-center">
          <p className="text-sm text-stone-400">식순 정보가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
