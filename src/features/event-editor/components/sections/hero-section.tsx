import { cn } from '@/lib/utils';

export function HeroSection({ props }: { props: Record<string, unknown> }) {
  const groomName = (props.groomName as string) ?? '';
  const brideName = (props.brideName as string) ?? '';
  const weddingDate = props.weddingDate as string | undefined;
  const venueName = (props.venueName as string) ?? '';
  const imageUrl = props.imageUrl as string | undefined;

  const hasImage = Boolean(imageUrl);

  const formattedDate = weddingDate
    ? new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date(weddingDate))
    : '';



  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      {hasImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label={`${groomName}과 ${brideName}의 웨딩 사진`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-stone-900/20 via-stone-900/20 to-stone-900/50" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-stone-100" />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 flex flex-col items-center px-6 text-center',
          hasImage ? 'text-white' : 'text-stone-800',
        )}
      >
        {(groomName || brideName) && (
          <h1 className="font-light">
            <span className="text-3xl tracking-[0.12em] sm:text-4xl">{groomName}</span>
            <span
              className={cn(
                'mx-3 text-xl font-thin sm:text-2xl',
                hasImage ? 'text-white/50' : 'text-stone-300',
              )}
            >
              &amp;
            </span>
            <span className="text-3xl tracking-[0.12em] sm:text-4xl">{brideName}</span>
          </h1>
        )}

        <div
          className={cn(
            'mx-auto mt-6 h-px w-12',
            hasImage ? 'bg-white/40' : 'bg-stone-300',
          )}
        />

        {formattedDate && (
          <p
            className={cn(
              'mt-5 text-sm tracking-[0.25em]',
              hasImage ? 'text-white/80' : 'text-stone-500',
            )}
          >
            {formattedDate}
          </p>
        )}
        {venueName && (
          <p
            className={cn(
              'mt-2 text-xs tracking-[0.2em]',
              hasImage ? 'text-white/65' : 'text-stone-400',
            )}
          >
            {venueName}
          </p>
        )}
      </div>

      {/* Scroll indicator */}
      <div
        className={cn(
          'absolute bottom-8 flex flex-col items-center gap-1.5',
          hasImage ? 'text-white/50' : 'text-stone-300',
        )}
        aria-hidden="true"
      >
        <div className="h-8 w-px bg-current" />
        <span className="text-[10px] tracking-[0.3em] uppercase">scroll</span>
      </div>
    </section>
  );
}
