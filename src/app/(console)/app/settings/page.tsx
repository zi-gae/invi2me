import { redirect } from 'next/navigation';

import { getCurrentWorkspace } from '@/features/auth/utils/get-current-workspace';
import { WorkspaceNotFoundError } from '@/shared/lib/errors';

export default async function SettingsPage() {
  let workspace;
  try {
    workspace = await getCurrentWorkspace();
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError) {
      redirect('/login');
    }
    throw error;
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-sm text-muted-foreground">워크스페이스 정보를 확인합니다.</p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">워크스페이스 정보</h2>
        <dl className="space-y-3">
          <div className="flex items-center gap-4">
            <dt className="w-32 shrink-0 text-sm text-muted-foreground">이름</dt>
            <dd className="text-sm font-medium">{workspace.name ?? '-'}</dd>
          </div>
          <div className="flex items-center gap-4">
            <dt className="w-32 shrink-0 text-sm text-muted-foreground">슬러그</dt>
            <dd className="font-mono text-sm">{workspace.slug}</dd>
          </div>
          <div className="flex items-center gap-4">
            <dt className="w-32 shrink-0 text-sm text-muted-foreground">플랜</dt>
            <dd className="text-sm font-medium">{workspace.planCode}</dd>
          </div>
          <div className="flex items-center gap-4">
            <dt className="w-32 shrink-0 text-sm text-muted-foreground">기본 언어</dt>
            <dd className="text-sm font-medium">{workspace.defaultLocale}</dd>
          </div>
          <div className="flex items-center gap-4">
            <dt className="w-32 shrink-0 text-sm text-muted-foreground">타임존</dt>
            <dd className="text-sm font-medium">{workspace.defaultTimezone}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
