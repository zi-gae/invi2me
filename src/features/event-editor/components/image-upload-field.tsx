'use client';

import { useCallback, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  eventId: string;
  hint?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  eventId,
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const form = new FormData();
        form.append('file', file);

        const res = await fetch(`/api/app/events/${eventId}/upload`, {
          method: 'POST',
          body: form,
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error ?? '업로드 실패');
          return;
        }

        onChange(data.url);
      } catch {
        toast.error('이미지 업로드 중 오류가 발생했습니다.');
      } finally {
        setUploading(false);
      }
    },
    [eventId, onChange],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    // reset input so same file can be re-selected
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      upload(file);
    } else {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleRemove() {
    onChange('');
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-stone-600">
        {label}
        {hint && (
          <span className="ml-1 font-normal text-stone-400">({hint})</span>
        )}
      </label>

      {/* 미리보기 */}
      {value ? (
        <div className="group relative overflow-hidden rounded-lg border border-stone-200">
          <img
            src={value}
            alt={label}
            className="h-36 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-full bg-white/90 p-2 text-stone-700 shadow-sm transition-colors hover:bg-white"
              aria-label="이미지 변경"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ImagePlus className="size-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm transition-colors hover:bg-white"
              aria-label="이미지 삭제"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        /* 업로드 드롭존 */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          disabled={uploading}
          className={`flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors ${
            dragOver
              ? 'border-stone-500 bg-stone-100'
              : 'border-stone-200 bg-stone-50 hover:border-stone-400'
          } ${uploading ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-stone-400" />
          ) : (
            <ImagePlus className="size-5 text-stone-400" />
          )}
          <span className="text-xs text-stone-400">
            {uploading ? '업로드 중...' : '클릭 또는 드래그하여 업로드'}
          </span>
          <span className="text-[10px] text-stone-300">
            JPEG, PNG, WebP, GIF · 최대 10MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

// ─── Compact variant for array rows (gallery) ────────────────────────────────

interface ImageUploadCellProps {
  value: string;
  onChange: (url: string) => void;
  eventId: string;
}

export function ImageUploadCell({ value, onChange, eventId }: ImageUploadCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`/api/app/events/${eventId}/upload`, {
          method: 'POST',
          body: form,
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? '업로드 실패');
          return;
        }
        onChange(data.url);
      } catch {
        toast.error('업로드 오류');
      } finally {
        setUploading(false);
      }
    },
    [eventId, onChange],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  }

  return (
    <div className="flex items-center gap-1.5">
      {value ? (
        <div className="group relative size-10 shrink-0 overflow-hidden rounded border border-stone-200">
          <img src={value} alt="" className="size-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="size-3 text-white" />
          </button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex h-7 items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 text-xs text-stone-500 hover:border-stone-400 disabled:cursor-wait disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <ImagePlus className="size-3" />
        )}
        {uploading ? '업로드...' : value ? '변경' : '업로드'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
