import { TextField, ArrayField, str, arr } from '../form-primitives';
import { patch, type FormProps } from './form-types';

interface GuideRow { label: string; detail: string }
const EMPTY_GUIDE: GuideRow = { label: '', detail: '' };

export function TransportGuidePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const items = arr<GuideRow>(props, 'items');
  return (
    <div className="space-y-3">
      <TextField label="제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="교통 안내" />
      <ArrayField
        label="교통 안내 항목"
        items={items}
        onChange={(newItems) => set({ items: newItems })}
        emptyItem={EMPTY_GUIDE}
        fields={{ label: { label: '라벨', placeholder: '지하철' }, detail: { label: '내용', placeholder: '2호선 강남역 1번 출구...' } }}
        addLabel="항목 추가"
      />
    </div>
  );
}
