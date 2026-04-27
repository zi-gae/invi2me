'use client';

import { MapPin, Navigation } from 'lucide-react';
import { SectionHeader } from './section-shared';
import { KakaoMap } from '../kakao-map';

interface TransportItem {
  type: string;
  description: string;
}

const TRANSPORT_LABELS: Record<string, string> = {
  subway: '지하철',
  bus: '버스',
  car: '자가용',
  taxi: '택시',
};

export function LocationMapSection({ props }: { props: Record<string, unknown> }) {
  const venueName = (props.venueName as string) ?? (props.name as string) ?? '';
  const address = (props.address as string) ?? '';
  const subAddress = (props.subAddress as string) ?? '';
  const mapImageUrl = props.mapImageUrl as string | undefined;
  const lat = props.lat as number | undefined;
  const lng = props.lng as number | undefined;
  const transports = (props.transports as TransportItem[]) ?? [];

  const hasCoords = typeof lat === 'number' && typeof lng === 'number';

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <SectionHeader label="LOCATION" title="오시는 길" />
      <div className="mx-auto max-w-sm space-y-8">
        {/* Venue Info */}
        <div className="text-center">
          <p className="text-lg font-light text-stone-800">{venueName}</p>
          <p className="mt-1 text-sm text-stone-500">{address}</p>
          {subAddress && <p className="mt-0.5 text-xs text-stone-400">{subAddress}</p>}
        </div>

        {/* Map */}
        {hasCoords ? (
          <KakaoMap lat={lat} lng={lng} venueName={venueName} className="h-52 w-full" />
        ) : mapImageUrl ? (
          <div className="overflow-hidden rounded-xl">
            <img
              src={mapImageUrl}
              alt={`${venueName} 지도`}
              className="w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-52 items-center justify-center rounded-xl bg-stone-100">
            <div className="text-center">
              <MapPin className="mx-auto size-8 text-stone-300" aria-hidden="true" />
              <p className="mt-2 text-xs text-stone-400">지도 이미지</p>
            </div>
          </div>
        )}

        {/* 길찾기 버튼 */}
        {hasCoords && (
          <NavigationButton lat={lat} lng={lng} venueName={venueName} />
        )}

        {/* Transport */}
        {transports.length > 0 && (
          <div className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-100">
            {transports.map((transport, i) => (
              <div key={i} className="px-4 py-3.5">
                <span className="text-xs font-medium tracking-wide text-rose-400">
                  {TRANSPORT_LABELS[transport.type] ?? transport.type}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">
                  {transport.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function NavigationButton({ lat, lng, venueName }: { lat: number; lng: number; venueName: string }) {
  const dest = `${encodeURIComponent(venueName || '목적지')},${lat},${lng}`;

  function handleClick() {
    if (!navigator.geolocation) {
      window.open(`https://map.kakao.com/link/to/${dest}`, '_blank');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const from = `${encodeURIComponent('현재위치')},${latitude},${longitude}`;
        window.open(`https://map.kakao.com/link/from/${from}/to/${dest}`, '_blank');
      },
      () => {
        // 위치 권한 거부 시 출발지 없이 열기
        window.open(`https://map.kakao.com/link/to/${dest}`, '_blank');
      },
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-1.5 border border-stone-300 py-3 text-xs tracking-[0.15em] text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-700"
    >
      <Navigation className="size-3.5" />
      길 찾기
    </button>
  );
}
