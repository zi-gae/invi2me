import { SectionHeader } from './section-shared';

interface DressCodeColor {
  hex: string;
  label?: string;
}

export function DressCodeSection({ props }: { props: Record<string, unknown> }) {
  const description = (props.description as string) ?? '';
  const colors = (props.colors as DressCodeColor[]) ?? [];
  const note = (props.note as string) ?? '';

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <SectionHeader label="DRESS CODE" title="드레스 코드" />
      <div className="mx-auto max-w-xs text-center">
        {description && (
          <p className="mb-8 text-sm leading-relaxed text-stone-500">{description}</p>
        )}
        {colors.length > 0 && (
          <div className="mb-8 flex justify-center gap-4">
            {colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="h-10 w-10 rounded-full shadow-sm ring-1 ring-stone-200"
                  style={{ backgroundColor: color.hex }}
                  role="img"
                  aria-label={color.label ?? color.hex}
                />
                {color.label && (
                  <span className="text-[10px] text-stone-400">{color.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {note && <p className="text-xs text-stone-400">{note}</p>}
      </div>
    </section>
  );
}
