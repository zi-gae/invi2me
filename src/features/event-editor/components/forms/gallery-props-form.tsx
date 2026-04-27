'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { TextField, SectionDivider, str, arr } from '../form-primitives';
import { ImageUploadCell } from '../image-upload-field';
import { patch, type FormProps } from './form-types';

interface ImageRow { url: string; alt: string }
const EMPTY_IMAGE: ImageRow = { url: '', alt: '' };

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export function GalleryPropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  const images = arr<ImageRow>(props, 'images');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function updateImage(i: number, patch: Partial<ImageRow>) {
    const updated = images.map((img, idx) => (idx === i ? { ...img, ...patch } : img));
    set({ images: updated });
  }

  function removeImage(i: number) {
    set({ images: images.filter((_, idx) => idx !== i) });
  }

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    const results = await Promise.allSettled(
      files.map(async (file) => {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`/api/app/events/${eventId}/upload`, { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? '업로드 실패');
        setUploadProgress((p) => p ? { ...p, done: p.done + 1 } : null);
        return data.url as string;
      }),
    );

    const succeeded = results.flatMap((r) => r.status === 'fulfilled' ? [{ url: r.value, alt: '' }] : []);
    const failed = results.filter((r) => r.status === 'rejected').length;

    if (succeeded.length) {
      set({ images: [...images, ...succeeded] });
    }
    if (failed > 0) {
      toast.error(`${failed}장 업로드에 실패했습니다.`);
    }

    setUploading(false);
    setUploadProgress(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) uploadFiles(files);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length) uploadFiles(files);
  }

  return (
    <div className="space-y-3">
      <TextField label="제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="우리의 이야기" />
      <SectionDivider label="이미지 목록" />

      {/* 멀티 업로드 드롭존 */}
      <input ref={inputRef} type="file" accept={ACCEPT} multiple onChange={handleFileChange} className="absolute size-0 opacity-0" tabIndex={-1} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        disabled={uploading}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 transition-colors disabled:cursor-wait
          ${dragOver ? 'border-stone-400 bg-stone-100' : 'border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-stone-100'}`}
      >
        {uploading ? (
          <>
            <Loader2 className="size-6 animate-spin text-stone-400" />
            <p className="text-xs text-stone-500">
              {uploadProgress ? `${uploadProgress.done} / ${uploadProgress.total}장 업로드 중...` : '업로드 중...'}
            </p>
          </>
        ) : (
          <>
            <ImagePlus className="size-6 text-stone-400" />
            <p className="text-xs font-medium text-stone-500">클릭 또는 드래그로 여러 장 추가</p>
            <p className="text-[10px] text-stone-400">JPEG · PNG · WebP · GIF</p>
          </>
        )}
      </button>

      {/* 이미지 목록 */}
      {images.length > 0 && (
        <div className="space-y-1.5">
          {images.map((image, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-stone-100 bg-stone-50 p-2">
              <ImageUploadCell value={image.url} onChange={(url) => updateImage(i, { url })} eventId={eventId} />
              <input
                value={image.alt}
                onChange={(e) => updateImage(i, { alt: e.target.value })}
                placeholder="설명 (선택)"
                className="h-7 flex-1 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none focus:border-ring"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="shrink-0 rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-destructive"
                aria-label={`${i + 1}번 이미지 삭제`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
