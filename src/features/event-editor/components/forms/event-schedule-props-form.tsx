import { TextField, SectionDivider, str } from '../form-primitives';
import { patch, type FormProps } from './form-types';

export function EventSchedulePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="날짜" type="date" value={str(props, 'date')} onChange={(v) => set({ date: v })} />
        <TextField label="시각" value={str(props, 'time')} onChange={(v) => set({ time: v })} placeholder="오후 1시 30분" />
      </div>
      <SectionDivider label="장소" />
      <TextField label="웨딩홀 이름" value={str(props, 'venueName')} onChange={(v) => set({ venueName: v })} placeholder="그랜드볼룸" />
      <TextField label="홀 이름" value={str(props, 'hallName')} onChange={(v) => set({ hallName: v })} placeholder="다이아몬드홀 2층" />
      <TextField label="주소" value={str(props, 'venueAddress')} onChange={(v) => set({ venueAddress: v })} placeholder="서울특별시 강남구..." />
    </div>
  );
}
