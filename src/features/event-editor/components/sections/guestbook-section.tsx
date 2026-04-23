'use client';

import { useState } from 'react';
import { SectionHeader } from './section-shared';

const RELATION_OPTIONS = ['신랑 측', '신부 측', '지인', '기타'] as const;
type Relation = (typeof RELATION_OPTIONS)[number];

interface GuestMessage {
  id: string;
  author: string;
  relation: string;
  content: string;
  createdAt: string;
}

interface GuestbookSectionProps {
  props: Record<string, unknown>;
  eventSlug: string;
}

export function GuestbookSection({ props, eventSlug }: GuestbookSectionProps) {
  const description =
    (props.description as string) ?? '따뜻한 축하 메시지를 남겨주세요.';

  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    author: '',
    relation: '신랑 측' as Relation,
    content: '',
    password: '',
  });

  const [deleteTarget, setDeleteTarget] = useState<GuestMessage | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await fetch(`/api/public/events/${eventSlug}/guestbook`);
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  // 섹션이 처음 보일 때 자동 로드
  if (!loaded && !loading) {
    loadMessages();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.author.trim() || !form.content.trim() || !form.password) {
      setFormError('모든 항목을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/events/${eventSlug}/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        setFormError(json.error?.message ?? '오류가 발생했습니다.');
        return;
      }
      setMessages((prev) => [json.data, ...prev]);
      setForm({ author: '', relation: '신랑 측', content: '', password: '' });
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || !deletePassword) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/public/events/${eventSlug}/guestbook/${deleteTarget.id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: deletePassword }),
        },
      );
      const json = await res.json();
      if (!json.success) {
        setDeleteError(json.error?.message ?? '삭제에 실패했습니다.');
        return;
      }
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeletePassword('');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <SectionHeader label="GUESTBOOK" title="방명록" />

      {description && (
        <p className="mx-auto mb-10 max-w-xs text-center text-sm text-stone-400">
          {description}
        </p>
      )}

      {/* 작성 버튼 */}
      <div className="mx-auto mb-8 flex max-w-sm justify-center">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full border border-stone-300 px-5 py-2 text-sm text-stone-600 transition hover:bg-stone-50"
        >
          {showForm ? '닫기' : '메시지 남기기'}
        </button>
      </div>

      {/* 작성 폼 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-10 max-w-sm space-y-3 rounded-2xl border border-stone-200 p-5"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="이름"
              value={form.author}
              maxLength={50}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
            />
            <div className="relative shrink-0">
              <select
                value={form.relation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, relation: e.target.value as Relation }))
                }
                className="appearance-none rounded-lg border border-stone-200 py-2 pl-3 pr-7 text-sm outline-none focus:border-stone-400"
              >
                {RELATION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-400"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <textarea
            placeholder="축하 메시지를 남겨주세요. (최대 500자)"
            value={form.content}
            maxLength={500}
            rows={4}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
          />

          <input
            type="password"
            placeholder="비밀번호 (삭제 시 사용)"
            value={form.password}
            maxLength={20}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
          />

          {formError && (
            <p className="text-xs text-red-500">{formError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-stone-800 py-2.5 text-sm text-white transition hover:bg-stone-700 disabled:opacity-60"
          >
            {submitting ? '등록 중...' : '등록하기'}
          </button>
        </form>
      )}

      {/* 메시지 목록 */}
      {loading ? (
        <div className="mx-auto max-w-sm py-12 text-center">
          <p className="text-sm text-stone-400">불러오는 중...</p>
        </div>
      ) : messages.length > 0 ? (
        <div className="mx-auto max-w-sm space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-xl bg-stone-50 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-stone-700">
                    {msg.author}
                  </span>
                  <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-500">
                    {msg.relation}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <time dateTime={msg.createdAt} className="text-xs text-stone-400">
                    {new Date(msg.createdAt).toLocaleDateString('ko-KR')}
                  </time>
                  <button
                    onClick={() => {
                      setDeleteTarget(msg);
                      setDeletePassword('');
                      setDeleteError(null);
                    }}
                    className="text-xs text-stone-300 transition hover:text-stone-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-sm rounded-xl border border-dashed border-stone-200 py-12 text-center">
          <p className="text-sm text-stone-400">아직 남겨진 메시지가 없습니다.</p>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
            <p className="mb-4 text-sm font-medium text-stone-700">
              비밀번호를 입력하면 메시지가 삭제됩니다.
            </p>
            <input
              type="password"
              placeholder="비밀번호"
              value={deletePassword}
              autoFocus
              onChange={(e) => setDeletePassword(e.target.value)}
              className="mb-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
            />
            {deleteError && (
              <p className="mb-2 text-xs text-red-500">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDeleteTarget(null);
                  setDeletePassword('');
                  setDeleteError(null);
                }}
                className="flex-1 rounded-lg border border-stone-200 py-2 text-sm text-stone-500 transition hover:bg-stone-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || !deletePassword}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
