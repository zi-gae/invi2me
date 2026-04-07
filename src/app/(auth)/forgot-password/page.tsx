'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { createSupabaseBrowserClient } from '@/shared/lib/supabase-browser';

const forgotPasswordSchema = z.object({
  email: z.email('올바른 이메일을 입력해주세요'),
});
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
    getValues,
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    const result = forgotPasswordSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === 'email') {
          setFieldError(field, { message: issue.message });
        }
      }
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = window.location.origin + '/auth/callback?next=/reset-password';

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      result.data.email,
      { redirectTo },
    );

    if (authError) {
      setError('이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="rounded-full bg-green-100 p-4 w-16 h-16 mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">이메일을 확인해주세요</h1>
            <p className="mt-2 text-sm text-gray-500">
              <strong>{getValues('email')}</strong>로 비밀번호 재설정 링크를 보냈습니다.
              이메일을 확인하고 링크를 클릭해주세요.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            이메일이 오지 않았다면 스팸함을 확인하거나{' '}
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-blue-600 hover:underline"
            >
              다시 시도
            </button>
            해주세요.
          </p>
          <Link href="/login" className="block text-sm text-blue-600 hover:underline">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">비밀번호 찾기</h1>
          <p className="mt-2 text-sm text-gray-500">
            가입한 이메일을 입력하면 재설정 링크를 보내드립니다
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? '전송 중...' : '재설정 링크 보내기'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          <Link href="/login" className="text-blue-600 hover:underline">
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
