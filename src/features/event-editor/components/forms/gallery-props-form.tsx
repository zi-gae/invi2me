import { TextField, SectionDivider, str, arr } from '../form-primitives';
import { ImageUploadCell } from '../image-upload-field';
import { patch, type FormProps } from './form-types';

interface ImageRow { url: string; alt: string }
const EMPTY_IMAGE: ImageRow = { url: '', alt: '' };

export function GalleryPropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  const images = arr<ImageRow>(props, 'images');

  function updateImage(i: number, patch: Partial<ImageRow>) {
    const updated = images.map((img, idx) => (idx === i ? { ...img, ...patch } : img));
    set({ images: updated });
  }

  function removeImage(i: number) {
    set({ images: images.filter((_, idx) => idx !== i) });
  }

  function addImage() {
    set({ images: [...images, { ...EMPTY_IMAGE }] });
  }

  return (
    <div className="space-y-3">
      <TextField label="제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="우리의 이야기" />
      <SectionDivider label="이미지 목록" />
      <div className="space-y-2">
        {images.map((image, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-stone-100 bg-stone-50 p-2.5">
            <ImageUploadCell
              value={image.url}
              onChange={(url) => updateImage(i, { url })}
              eventId={eventId}
            />
            <input
              value={image.alt}
              onChange={(e) => updateImage(i, { alt: e.target.value })}
              placeholder="설명"
              className="h-7 flex-1 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none focus:border-ring"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-destructive"
              aria-label={`${i + 1}번 이미지 삭제`}
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 text-xs text-stone-500 hover:border-stone-400"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          이미지 추가
        </button>
      </div>
    </div>
  );
}
