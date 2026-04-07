'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/shared/lib/supabase-browser';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleResend = async () => {
    if (!email) return;

    setResendStatus('sending');
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/email-verified`,
      },
    });

    if (error) {
      setResendStatus('error');
    } else {
      setResendStatus('sent');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">이메일을 확인해주세요</h1>
          <p className="text-sm text-gray-500">
            {email ? (
              <>
                <span className="font-medium text-gray-700">{email}</span>로<br />
                인증 링크를 발송했습니다.
              </>
            ) : (
              '가입하신 이메일로 인증 링크를 발송했습니다.'
            )}
          </p>
          <p className="text-sm text-gray-400">
            이메일의 링크를 클릭해 인증을 완료해주세요.
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-4 text-left">
          <p className="text-xs text-blue-700">
            이메일이 보이지 않으면 스팸 폴더를 확인해보세요.
          </p>
        </div>

        <div className="space-y-3">
          {resendStatus === 'sent' ? (
            <p className="text-sm text-green-600">인증 이메일을 다시 발송했습니다.</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendStatus === 'sending' || !email}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {resendStatus === 'sending' ? '발송 중...' : '인증 이메일 다시 받기'}
            </button>
          )}
          {resendStatus === 'error' && (
            <p className="text-xs text-red-500">발송에 실패했습니다. 잠시 후 다시 시도해주세요.</p>
          )}

          <Link
            href="/login"
            className="block text-sm text-blue-600 hover:underline"
          >
            로그인 페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
