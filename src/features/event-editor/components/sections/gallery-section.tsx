import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GalleryImage {
  url: string;
  alt?: string;
}

export function GallerySection({ props }: { props: Record<string, unknown> }) {
  const images = (props.images as GalleryImage[]) ?? [];
  const title = (props.title as string) ?? '';
  const columns = (props.columns as number) ?? 2;

  return (
    <section className="bg-stone-900">
      {title && (
        <div className="px-6 pb-4 pt-16 text-center sm:pt-20">
          <span className="text-[11px] tracking-[0.35em] text-stone-500 uppercase">
            GALLERY
          </span>
          <p className="mt-1 text-base font-light text-stone-300">{title}</p>
        </div>
      )}
      {images.length > 0 ? (
        <div className={cn('grid gap-0.5', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
          {images.map((image, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-stone-800">
              <Image
                src={image.url}
                alt={image.alt ?? `갤러리 ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 pb-16 pt-8">
          <div
            className={cn(
              'grid gap-0.5',
              columns === 3 ? 'grid-cols-3' : 'grid-cols-2',
            )}
          >
            {Array.from({ length: columns === 3 ? 6 : 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded bg-stone-800" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
