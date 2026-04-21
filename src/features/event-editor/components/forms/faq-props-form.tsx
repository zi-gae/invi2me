import { TextField, ArrayField, str, arr } from '../form-primitives';
import { patch, type FormProps } from './form-types';

interface FaqRow { question: string; answer: string }
const EMPTY_FAQ: FaqRow = { question: '', answer: '' };

export function FaqPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const items = arr<FaqRow>(props, 'items');
  return (
    <div className="space-y-3">
      <TextField label="섹션 제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="자주 묻는 질문" />
      <ArrayField
        label="Q&A 항목"
        items={items}
        onChange={(newItems) => set({ items: newItems })}
        emptyItem={EMPTY_FAQ}
        fields={{
          question: { label: '질문', placeholder: '주차는 어떻게 하나요?' },
          answer: { label: '답변', placeholder: '지하 1층 주차장을 이용해 주세요.' },
        }}
        addLabel="Q&A 추가"
      />
    </div>
  );
}
