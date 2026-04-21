import { SectionHeader } from './section-shared';

interface PersonProfile {
  name?: string;
  photoUrl?: string;
  fatherName?: string;
  motherName?: string;
  role?: string;
}

export function CoupleProfileSection({ props }: { props: Record<string, unknown> }) {
  const groom = props.groom as PersonProfile | undefined;
  const bride = props.bride as PersonProfile | undefined;

  // Flat props fallback for legacy data
  const groomName = groom?.name ?? (props.groomName as string) ?? '';
  const brideName = bride?.name ?? (props.brideName as string) ?? '';
  const groomPhotoUrl = groom?.photoUrl ?? (props.groomPhotoUrl as string | undefined);
  const bridePhotoUrl = bride?.photoUrl ?? (props.bridePhotoUrl as string | undefined);

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <SectionHeader label="COUPLE" title="두 사람" />
      <div className="mx-auto flex max-w-sm items-start justify-center gap-8 sm:gap-12">
        {/* Groom */}
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-stone-100 ring-1 ring-stone-200 sm:h-28 sm:w-28">
            {groomPhotoUrl ? (
              <img
                src={groomPhotoUrl}
                alt={groomName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-stone-300">
                {groomName.slice(0, 1)}
              </div>
            )}
          </div>
          <p className="mt-4 text-[11px] tracking-[0.3em] text-rose-400 uppercase">GROOM</p>
          <p className="mt-1 text-lg font-light tracking-wide text-stone-800">{groomName}</p>
          {groom?.fatherName && (
            <p className="mt-1.5 text-xs text-stone-400">
              {groom.fatherName}
              {groom.motherName ? ` · ${groom.motherName}` : ''}의{' '}
              {groom.role ?? '아들'}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="mt-12 flex flex-col items-center gap-2 pt-4" aria-hidden="true">
          <div className="h-8 w-px bg-stone-200" />
          <span className="text-lg text-stone-300">♥</span>
          <div className="h-8 w-px bg-stone-200" />
        </div>

        {/* Bride */}
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-stone-100 ring-1 ring-stone-200 sm:h-28 sm:w-28">
            {bridePhotoUrl ? (
              <img
                src={bridePhotoUrl}
                alt={brideName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-stone-300">
                {brideName.slice(0, 1)}
              </div>
            )}
          </div>
          <p className="mt-4 text-[11px] tracking-[0.3em] text-rose-400 uppercase">BRIDE</p>
          <p className="mt-1 text-lg font-light tracking-wide text-stone-800">{brideName}</p>
          {bride?.fatherName && (
            <p className="mt-1.5 text-xs text-stone-400">
              {bride.fatherName}
              {bride.motherName ? ` · ${bride.motherName}` : ''}의{' '}
              {bride.role ?? '딸'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
