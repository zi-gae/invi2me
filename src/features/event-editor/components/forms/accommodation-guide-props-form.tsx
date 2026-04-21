import { TextareaField, SectionDivider, ArrayField, str, arr } from '../form-primitives';
import { patch, type FormProps } from './form-types';

interface HotelRow { name: string; address: string; phone: string; discount: string }
const EMPTY_HOTEL: HotelRow = { name: '', address: '', phone: '', discount: '' };

export function AccommodationGuidePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const hotels = arr<HotelRow>(props, 'hotels');
  return (
    <div className="space-y-3">
      <TextareaField label="안내 문구" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} />
      <SectionDivider label="숙소 목록" />
      <ArrayField
        label="숙소"
        items={hotels}
        onChange={(newHotels) => set({ hotels: newHotels })}
        emptyItem={EMPTY_HOTEL}
        fields={{
          name: { label: '숙소명', placeholder: '그랜드 호텔' },
          address: { label: '주소', placeholder: '서울시 강남구...' },
          phone: { label: '전화', placeholder: '02-1234-5678' },
          discount: { label: '할인', placeholder: '10% 할인 (코드: WEDDING)' },
        }}
        addLabel="숙소 추가"
      />
    </div>
  );
}
