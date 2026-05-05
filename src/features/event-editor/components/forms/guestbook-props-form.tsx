import { TextField, TextareaField, str } from '../form-primitives';
import { patch, type FormProps } from './form-types';

export function GuestbookPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextField label="제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="방명록" />
      <TextareaField label="안내 문구" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} placeholder="따뜻한 축하 메시지를 남겨주세요." />
    </div>
  );
}
