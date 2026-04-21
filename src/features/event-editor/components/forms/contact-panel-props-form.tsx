import { SectionDivider, ArrayField, arr } from '../form-primitives';
import { patch, type FormProps } from './form-types';

interface ContactRow { relation: string; name: string; phone: string }
const EMPTY_CONTACT: ContactRow = { relation: '', name: '', phone: '' };

export function ContactPanelPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const groomContacts = arr<ContactRow>(props, 'groomContacts');
  const brideContacts = arr<ContactRow>(props, 'brideContacts');
  return (
    <div className="space-y-3">
      <SectionDivider label="신랑측" />
      <ArrayField
        label="신랑측 연락처"
        items={groomContacts}
        onChange={(items) => set({ groomContacts: items })}
        emptyItem={EMPTY_CONTACT}
        fields={{
          relation: { label: '관계', placeholder: '신랑 / 아버지' },
          name: { label: '이름', placeholder: '홍길동' },
          phone: { label: '전화번호', placeholder: '010-1234-5678' },
        }}
        addLabel="연락처 추가"
      />
      <SectionDivider label="신부측" />
      <ArrayField
        label="신부측 연락처"
        items={brideContacts}
        onChange={(items) => set({ brideContacts: items })}
        emptyItem={EMPTY_CONTACT}
        fields={{
          relation: { label: '관계', placeholder: '신부 / 아버지' },
          name: { label: '이름', placeholder: '김영희' },
          phone: { label: '전화번호', placeholder: '010-9876-5432' },
        }}
        addLabel="연락처 추가"
      />
    </div>
  );
}
