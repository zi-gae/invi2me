import { ArrayField, arr } from '../form-primitives';
import { patch, type FormProps } from './form-types';

interface TimelineRow { time: string; event: string; description: string }
const EMPTY_TIMELINE: TimelineRow = { time: '', event: '', description: '' };

export function TimelinePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const items = arr<TimelineRow>(props, 'items');
  return (
    <div className="space-y-3">
      <ArrayField
        label="식순"
        items={items}
        onChange={(newItems) => set({ items: newItems })}
        emptyItem={EMPTY_TIMELINE}
        fields={{
          time: { label: '시간', placeholder: '오후 1:30' },
          event: { label: '행사명', placeholder: '신랑 입장' },
          description: { label: '설명', placeholder: '(선택)' },
        }}
        addLabel="식순 추가"
      />
    </div>
  );
}
