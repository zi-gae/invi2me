import { Phone } from 'lucide-react';
import { SectionHeader } from './section-shared';

interface Hotel {
  name: string;
  address?: string;
  phone?: string;
  discount?: string;
}

export function AccommodationGuideSection({ props }: { props: Record<string, unknown> }) {
  const hotels = (props.hotels as Hotel[]) ?? [];
  const description = (props.description as string) ?? '';

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <SectionHeader label="ACCOMMODATION" title="숙소 안내" />
      {description && (
        <p className="mx-auto mb-10 max-w-xs text-center text-sm text-stone-400">
          {description}
        </p>
      )}
      {hotels.length > 0 ? (
        <div className="mx-auto max-w-sm space-y-3">
          {hotels.map((hotel, i) => (
            <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-4">
              <p className="font-medium text-stone-700">{hotel.name}</p>
              {hotel.address && (
                <p className="mt-1 text-xs text-stone-400">{hotel.address}</p>
              )}
              {hotel.discount && (
                <p className="mt-1.5 text-xs font-medium text-rose-400">{hotel.discount}</p>
              )}
              {hotel.phone && (
                <a
                  href={`tel:${hotel.phone}`}
                  className="mt-2 flex items-center gap-1.5 text-xs text-stone-500 hover:text-rose-400"
                >
                  <Phone className="size-3" aria-hidden="true" />
                  {hotel.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-sm rounded-xl border border-dashed border-stone-200 py-10 text-center">
          <p className="text-sm text-stone-400">숙소 정보가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
