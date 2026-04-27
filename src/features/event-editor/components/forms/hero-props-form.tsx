import { TextField, SectionDivider, str } from '../form-primitives';
import { ImageUploadField } from '../image-upload-field';
import { patch, type FormProps } from './form-types';

export function HeroPropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <SectionDivider label="이름" />
      <TextField label="신랑 이름" value={str(props, 'groomName')} onChange={(v) => set({ groomName: v })} placeholder="홍길동" />
      <TextField label="신부 이름" value={str(props, 'brideName')} onChange={(v) => set({ brideName: v })} placeholder="김영희" />
      <SectionDivider label="날짜 · 장소" />
      <TextField label="결혼식 날짜" type="date" value={str(props, 'weddingDate')} onChange={(v) => set({ weddingDate: v })} />
      <TextField label="웨딩홀 이름" value={str(props, 'venueName')} onChange={(v) => set({ venueName: v })} placeholder="그랜드볼룸" />
      <SectionDivider label="배경" />
      <ImageUploadField label="커버 이미지" value={str(props, 'imageUrl')} onChange={(v) => set({ imageUrl: v })} eventId={eventId} cropAspect={9 / 16} hint="모바일 비율 9:16" />
    </div>
  );
}
