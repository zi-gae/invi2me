import { TextField, SectionDivider, ArrayField, str, arr } from '../form-primitives';
import { ImageUploadField } from '../image-upload-field';
import { patch, type FormProps } from './form-types';

interface TransportRow { type: string; description: string }
const EMPTY_TRANSPORT: TransportRow = { type: '', description: '' };

export function LocationMapPropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  const transports = arr<TransportRow>(props, 'transports');
  return (
    <div className="space-y-3">
      <TextField label="웨딩홀 이름" value={str(props, 'venueName')} onChange={(v) => set({ venueName: v })} />
      <TextField label="주소" value={str(props, 'address')} onChange={(v) => set({ address: v })} />
      <TextField label="상세 주소" value={str(props, 'subAddress')} onChange={(v) => set({ subAddress: v })} />
      <ImageUploadField label="지도 이미지" value={str(props, 'mapImageUrl')} onChange={(v) => set({ mapImageUrl: v })} eventId={eventId} />
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
