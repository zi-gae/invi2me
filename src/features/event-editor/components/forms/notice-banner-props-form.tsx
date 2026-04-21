import { TextareaField, str } from '../form-primitives';
import { patch, type FormProps } from './form-types';

export function NoticeBannerPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextareaField label="공지 내용" value={str(props, 'text')} onChange={(v) => set({ text: v })} rows={3} placeholder="주차 공간이 협소하오니 가급적 대중교통을 이용해 주세요." />
    </div>
  );
}
