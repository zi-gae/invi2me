import { TextField, SectionDivider, str, obj } from '../form-primitives';
import { ImageUploadField } from '../image-upload-field';
import { patch, type FormProps } from './form-types';

interface PersonObj { name: string; photoUrl: string; fatherName: string; motherName: string; role: string }

export function CoupleProfilePropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  const groom = obj<PersonObj>(props, 'groom');
  const bride = obj<PersonObj>(props, 'bride');
  const setGroom = (g: Partial<PersonObj>) => set({ groom: { ...groom, ...g } });
  const setBride = (b: Partial<PersonObj>) => set({ bride: { ...bride, ...b } });
  return (
    <div className="space-y-3">
      <SectionDivider label="신랑" />
      <TextField label="이름" value={str(groom, 'name')} onChange={(v) => setGroom({ name: v })} placeholder="홍길동" />
      <ImageUploadField label="사진" value={str(groom, 'photoUrl')} onChange={(v) => setGroom({ photoUrl: v })} eventId={eventId} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="아버지" value={str(groom, 'fatherName')} onChange={(v) => setGroom({ fatherName: v })} />
        <TextField label="어머니" value={str(groom, 'motherName')} onChange={(v) => setGroom({ motherName: v })} />
      </div>
      <TextField label="호칭" value={str(groom, 'role')} onChange={(v) => setGroom({ role: v })} placeholder="아들" />
      <SectionDivider label="신부" />
      <TextField label="이름" value={str(bride, 'name')} onChange={(v) => setBride({ name: v })} placeholder="김영희" />
      <ImageUploadField label="사진" value={str(bride, 'photoUrl')} onChange={(v) => setBride({ photoUrl: v })} eventId={eventId} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="아버지" value={str(bride, 'fatherName')} onChange={(v) => setBride({ fatherName: v })} />
        <TextField label="어머니" value={str(bride, 'motherName')} onChange={(v) => setBride({ motherName: v })} />
      </div>
      <TextField label="호칭" value={str(bride, 'role')} onChange={(v) => setBride({ role: v })} placeholder="딸" />
    </div>
  );
}
