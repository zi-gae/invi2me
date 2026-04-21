import { ChevronDown } from 'lucide-react';
import { SectionHeader } from './section-shared';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ props }: { props: Record<string, unknown> }) {
  const title = (props.title as string) ?? '자주 묻는 질문';
  const items = (props.items as FaqItem[]) ?? [];

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <SectionHeader title={title} />
      {items.length > 0 ? (
        <div className="mx-auto max-w-sm divide-y divide-stone-100 overflow-hidden rounded-xl bg-white shadow-sm">
          {items.map((item, i) => (
            <details key={i} className="group px-4 py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span className="text-sm font-medium text-stone-700">{item.question}</span>
                <ChevronDown
                  className="size-4 shrink-0 translate-y-0.5 text-stone-400 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">{item.answer}</p>
            </details>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-sm rounded-xl border border-dashed border-stone-200 py-10 text-center">
          <p className="text-sm text-stone-400">FAQ 항목이 없습니다.</p>
        </div>
      )}
    </section>
  );
}
