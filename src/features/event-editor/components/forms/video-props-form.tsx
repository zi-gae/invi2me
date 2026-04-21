import { TextField, str } from '../form-primitives';
import { patch, type FormProps } from './form-types';

export function VideoPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextField label="YouTube URL" value={str(props, 'videoUrl')} onChange={(v) => set({ videoUrl: v })} placeholder="https://youtube.com/watch?v=..." />
      <TextField label="제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="우리의 웨딩 영상" />
    </div>
  );
}
