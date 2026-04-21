import { TextField, TextareaField, str } from '../form-primitives';
import { patch, type FormProps } from './form-types';

export function RsvpFormPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextareaField label="안내 문구" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} placeholder="참석 여부를 알려주시면 준비에 큰 도움이 됩니다." />
      <TextField label="회신 기한" type="date" value={str(props, 'deadline')} onChange={(v) => set({ deadline: v })} />
    </div>
  );
}
