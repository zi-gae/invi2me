import { TextField, TextareaField, SectionDivider, str, obj } from '../form-primitives';
import { patch, type FormProps } from './form-types';

export function InvitationMessagePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const groomParents = obj<{ father: string; mother: string }>(props, 'groomParents');
  const brideParents = obj<{ father: string; mother: string }>(props, 'brideParents');
  return (
    <div className="space-y-3">
      <TextareaField label="초대 문구" value={str(props, 'message')} onChange={(v) => set({ message: v })} rows={5} placeholder="저희 두 사람이 하나가 되는 자리에 초대합니다..." />
      <SectionDivider label="신랑측" />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="신랑 아버지" value={str(groomParents, 'father')} onChange={(v) => set({ groomParents: { ...groomParents, father: v } })} placeholder="홍부친" />
        <TextField label="신랑 어머니" value={str(groomParents, 'mother')} onChange={(v) => set({ groomParents: { ...groomParents, mother: v } })} placeholder="홍모친" />
      </div>
      <TextField label="신랑 이름" value={str(props, 'groomName')} onChange={(v) => set({ groomName: v })} placeholder="홍길동" />
      <SectionDivider label="신부측" />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="신부 아버지" value={str(brideParents, 'father')} onChange={(v) => set({ brideParents: { ...brideParents, father: v } })} placeholder="김부친" />
        <TextField label="신부 어머니" value={str(brideParents, 'mother')} onChange={(v) => set({ brideParents: { ...brideParents, mother: v } })} placeholder="김모친" />
      </div>
      <TextField label="신부 이름" value={str(props, 'brideName')} onChange={(v) => set({ brideName: v })} placeholder="김영희" />
    </div>
  );
}
