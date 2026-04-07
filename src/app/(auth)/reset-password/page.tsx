'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { createSupabaseBrowserClient } from '@/shared/lib/supabase-browser';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirm'],
  });
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
  } = useForm<ResetPasswordForm>();

  const onSubmit = async (data: ResetPasswordForm) => {
    const result = resetPasswordSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === 'password' || field === 'confirm') {
          setFieldError(field, { message: issue.message });
        }
      }
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.updateUser({
      password: result.data.password,
    });

    if (authError) {
      if (authError.message.includes('session')) {
        setError('재설정 링크가 만료되었습니다. 비밀번호 찾기를 다시 시도해주세요.');
      } else {
        setError('비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      setLoading(false);
      return;
    }

    window.location.href = '/app/events';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">새 비밀번호 설정</h1>
          <p className="mt-2 text-sm text-gray-500">
            사용할 새 비밀번호를 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              새 비밀번호
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="8자 이상 입력"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 확인
            </label>
            <input
              id="confirm"
              type="password"
              {...register('confirm')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="동일한 비밀번호 입력"
            />
            {errors.confirm && (
              <p className="mt-1 text-xs text-red-500">{errors.confirm.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}{' '}
              {error.includes('만료') && (
                <Link href="/forgot-password" className="underline font-medium">
                  비밀번호 찾기
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
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
