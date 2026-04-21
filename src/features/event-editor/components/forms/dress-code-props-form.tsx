import { TextField, TextareaField, SectionDivider, str, arr } from '../form-primitives';
import { patch, type FormProps } from './form-types';

interface ColorRow { hex: string; label: string }
const EMPTY_COLOR: ColorRow = { hex: '#f5f5f4', label: '' };

export function DressCodePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const colors = arr<ColorRow>(props, 'colors');
  return (
    <div className="space-y-3">
      <TextareaField label="드레스 코드 안내" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} />
      <SectionDivider label="색상 팔레트" />
      <div className="flex flex-wrap gap-2">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-lg border border-stone-100 bg-stone-50 px-2 py-1.5">
            <input
              type="color"
              value={color.hex}
              onChange={(e) => { const c = [...colors]; c[i] = { ...c[i], hex: e.target.value }; set({ colors: c }); }}
              className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <input
              value={color.label}
              onChange={(e) => { const c = [...colors]; c[i] = { ...c[i], label: e.target.value }; set({ colors: c }); }}
              placeholder="라벨"
              className="h-6 w-16 rounded border border-input bg-transparent px-1.5 text-xs outline-none"
            />
            <button type="button" onClick={() => set({ colors: colors.filter((_, idx) => idx !== i) })} className="text-stone-400 hover:text-destructive">
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set({ colors: [...colors, { ...EMPTY_COLOR }] })}
          className="flex h-8 items-center gap-1 rounded-lg border border-dashed border-stone-300 px-3 text-xs text-stone-500 hover:border-stone-400"
        >
          색상 추가
        </button>
      </div>
      <TextField label="비고" value={str(props, 'note')} onChange={(v) => set({ note: v })} placeholder="화려한 색상 자제를 부탁드립니다" />
    </div>
  );
}
