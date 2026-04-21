import { TextField, str } from '../form-primitives';
import { patch, type FormProps } from './form-types';

export function CountdownPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextField label="목표 날짜·시간" type="datetime-local" value={str(props, 'targetDate')} onChange={(v) => set({ targetDate: v })} />
      <TextField label="라벨" value={str(props, 'label')} onChange={(v) => set({ label: v })} placeholder="결혼식까지" />
      <TextField label="완료 메시지" value={str(props, 'completedMessage')} onChange={(v) => set({ completedMessage: v })} placeholder="행복한 결혼 생활을 시작했습니다 💕" />
    </div>
  );
}
