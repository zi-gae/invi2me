'use client';

import { useRef, useState } from 'react';
import { Search } from 'lucide-react';

declare global {
  interface Window {
    kakao: {
      maps: {
        services: {
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (result: KakaoPlace[], status: string) => void,
            ) => void;
          };
          Status: { OK: string };
        };
      };
    };
  }
}

export interface KakaoPlace {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string; // longitude
  y: string; // latitude
}

interface KakaoPlaceSearchProps {
  onSelect: (place: KakaoPlace) => void;
}

export function KakaoPlaceSearch({ onSelect }: KakaoPlaceSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function waitForSdk(timeout = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.kakao?.maps?.services) { resolve(true); return; }
      const start = Date.now();
      const timer = setInterval(() => {
        if (window.kakao?.maps?.services) { clearInterval(timer); resolve(true); }
        else if (Date.now() - start > timeout) { clearInterval(timer); resolve(false); }
      }, 100);
    });
  }

  async function search() {
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    setError(null);
    setResults([]);

    const ready = await waitForSdk();
    if (!ready) {
      setError('카카오 지도를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
      setSearching(false);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(q, (data, status) => {
      setSearching(false);
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
        setOpen(true);
      } else {
        setError('검색 결과가 없습니다.');
        setOpen(false);
      }
    });
  }

  function handleSelect(place: KakaoPlace) {
    onSelect(place);
    setQuery(place.place_name);
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="장소명 또는 주소로 검색"
            className="w-full rounded-md border bg-background py-2 pl-8 pr-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
        <button
          type="button"
          onClick={search}
          disabled={searching}
          className="rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          {searching ? '검색 중...' : '검색'}
        </button>
      </div>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
          {results.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => handleSelect(place)}
                className="w-full px-3 py-2.5 text-left hover:bg-muted"
              >
                <p className="text-sm font-medium">{place.place_name}</p>
                <p className="text-xs text-muted-foreground">
                  {place.road_address_name || place.address_name}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
