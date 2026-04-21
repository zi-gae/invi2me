import { SectionHeader } from './section-shared';

export function TransportGuideSection({ props }: { props: Record<string, unknown> }) {
  const title = (props.title as string) ?? '교통 안내';
  const items =
    (props.items as Array<{ label: string; detail: string }>) ?? [];

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <SectionHeader label="TRANSPORT" title={title} />
      {items.length > 0 && (
        <div className="mx-auto max-w-sm divide-y divide-stone-100 overflow-hidden rounded-xl bg-white shadow-sm">
          {items.map((item, i) => (
            <div key={i} className="px-5 py-4">
              <p className="text-sm font-medium text-stone-700">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">{item.detail}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
