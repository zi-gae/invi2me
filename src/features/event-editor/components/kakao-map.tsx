'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface KakaoMapProps {
  lat: number;
  lng: number;
  venueName?: string;
  className?: string;
}

export function KakaoMap({ lat, lng, venueName, className = 'h-52 w-full' }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let attempts = 0;

    function tryInit() {
      attempts++;
      if (attempts > 100) return; // 10초 타임아웃

      if (typeof (window.kakao?.maps as unknown as Record<string, unknown>)?.LatLng !== 'function') {
        rafId = requestAnimationFrame(tryInit);
        return;
      }

      type KakaoMaps = {
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: unknown) => unknown;
        Marker: new (options: unknown) => { setMap: (map: unknown) => void };
      };
      const { LatLng, Map, Marker } = (window.kakao.maps as unknown) as KakaoMaps;

      const center = new LatLng(lat, lng);
      const map = new Map(container!, { center, level: 3 });
      const marker = new Marker({ position: center });
      marker.setMap(map);
      mapRef.current = map;
    }

    rafId = requestAnimationFrame(tryInit);
    return () => cancelAnimationFrame(rafId);
  }, [lat, lng]);

  // lat/lng가 바뀌면 지도 중심 이동
  useEffect(() => {
    if (!mapRef.current || !window.kakao?.maps) return;
    type KakaoMapsLatLng = { LatLng: new (lat: number, lng: number) => unknown };
    const { LatLng } = (window.kakao.maps as unknown) as KakaoMapsLatLng;
    (mapRef.current as { setCenter: (c: unknown) => void }).setCenter(new LatLng(lat, lng));
  }, [lat, lng]);

  return (
    <div className="overflow-hidden rounded-xl">
      <div ref={containerRef} className={className} />
      {venueName && (
        <div className="flex items-center gap-1.5 border-t bg-muted/40 px-3 py-2">
          <MapPin className="size-3.5 shrink-0 text-rose-400" />
          <span className="text-xs text-muted-foreground">{venueName}</span>
        </div>
      )}
    </div>
  );
}
