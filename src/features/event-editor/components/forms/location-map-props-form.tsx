import { TextField, SectionDivider, ArrayField, str, arr, num } from '../form-primitives';
import { ImageUploadField } from '../image-upload-field';
import { KakaoPlaceSearch } from '../kakao-place-search';
import type { KakaoPlace } from '../kakao-place-search';
import { patch, type FormProps } from './form-types';

interface TransportRow { type: string; description: string }
const EMPTY_TRANSPORT: TransportRow = { type: '', description: '' };

export function LocationMapPropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  const transports = arr<TransportRow>(props, 'transports');

  function handlePlaceSelect(place: KakaoPlace) {
    set({
      venueName: place.place_name,
      address: place.road_address_name || place.address_name,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
    });
  }

  return (
    <div className="space-y-3">
      <SectionDivider label="장소 검색" />
      <KakaoPlaceSearch onSelect={handlePlaceSelect} />

      <SectionDivider label="장소 정보" />
      <TextField label="웨딩홀 이름" value={str(props, 'venueName')} onChange={(v) => set({ venueName: v })} />
      <TextField label="주소" value={str(props, 'address')} onChange={(v) => set({ address: v })} />
      <TextField label="상세 주소" value={str(props, 'subAddress')} onChange={(v) => set({ subAddress: v })} />

      <div className="grid grid-cols-2 gap-2">
        <TextField label="위도 (lat)" value={String(num(props, 'lat') ?? '')} onChange={(v) => set({ lat: v ? parseFloat(v) : undefined })} />
        <TextField label="경도 (lng)" value={String(num(props, 'lng') ?? '')} onChange={(v) => set({ lng: v ? parseFloat(v) : undefined })} />
      </div>

      <ImageUploadField label="지도 이미지 (선택)" value={str(props, 'mapImageUrl')} onChange={(v) => set({ mapImageUrl: v })} eventId={eventId} />
      <SectionDivider label="교통편" />
      <ArrayField
        label="교통편 목록"
        items={transports}
        onChange={(items) => set({ transports: items })}
        emptyItem={EMPTY_TRANSPORT}
        fields={{ type: { label: '종류', placeholder: 'subway / bus / car / taxi' }, description: { label: '설명', placeholder: '2호선 강남역 1번 출구...' } }}
        addLabel="교통편 추가"
      />
    </div>
  );
}
