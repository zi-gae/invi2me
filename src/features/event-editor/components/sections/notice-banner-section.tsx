export function NoticeBannerSection({ props }: { props: Record<string, unknown> }) {
  const text = (props.text as string) ?? '';
  if (!text) return null;

  return (
    <section className="bg-amber-50 px-6 py-5">
      <div className="mx-auto flex max-w-sm items-start gap-2.5">
        <span className="mt-0.5 shrink-0 text-base" aria-hidden="true">
          📌
        </span>
        <p className="text-sm leading-relaxed text-amber-800">{text}</p>
      </div>
    </section>
  );
}
