import { TextField, TextareaField, str } from '../form-primitives';
import { patch, type FormProps } from './form-types';

export function ParkingInfoPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextareaField label="주차 안내" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={4} placeholder="지하 1~3층 주차 가능합니다..." />
      <TextField label="참고 사항" value={str(props, 'note')} onChange={(v) => set({ note: v })} placeholder="주차 공간이 협소하오니 대중교통을 이용해 주세요" />
    </div>
  );
}
