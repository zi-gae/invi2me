'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod/v4';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const createEventSchema = z.object({
  title: z.string().min(1, '이벤트 제목을 입력해주세요'),
  eventType: z.enum(['wedding', 'seminar', 'conference', 'birthday', 'other']),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, '영문 소문자, 숫자, 하이픈만 사용 가능합니다'),
});

type CreateEventForm = z.infer<typeof createEventSchema>;

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateEventForm>({ title: '', eventType: 'wedding', slug: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateEventForm, string>>>({});

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setForm(f => ({ ...f, title, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    const result = createEventSchema.safeParse(form);
    if (!result.success) {
      const errors: Partial<Record<keyof CreateEventForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateEventForm;
        errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/app/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? '이벤트 생성에 실패했습니다.');
        return;
      }
      router.push(`/app/events/${data.data.id}`);
    } catch {
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/app/events" className="text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="inline size-4" /> 내 이벤트
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">새 이벤트 만들기</h1>
        <p className="mt-1 text-sm text-muted-foreground">이벤트 기본 정보를 입력하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">이벤트 제목 *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="홍길동 ♥ 이영희 결혼식"
          />
          {fieldErrors.title && <p className="mt-1 text-xs text-destructive">{fieldErrors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">이벤트 유형 *</label>
          <select
            value={form.eventType}
            onChange={e => setForm(f => ({ ...f, eventType: e.target.value as CreateEventForm['eventType'] }))}
            className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="wedding">결혼식</option>
            <option value="seminar">세미나</option>
            <option value="conference">컨퍼런스</option>
            <option value="birthday">생일파티</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">URL 슬러그 *</label>
          <input
            type="text"
            value={form.slug}
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="hong-wedding-2026"
          />
          {fieldErrors.slug && <p className="mt-1 text-xs text-destructive">{fieldErrors.slug}</p>}
          <p className="mt-1 text-xs text-muted-foreground">공개 페이지 주소: /{form.slug || 'slug'}</p>
        </div>

        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div className="flex gap-3 pt-2">
          <Link href="/app/events" className="flex-1 rounded-md border px-4 py-2 text-center text-sm hover:bg-accent">
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? '생성 중...' : '이벤트 생성'}
          </button>
        </div>
      </form>
    </div>
  );
}
