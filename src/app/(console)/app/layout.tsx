import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays, Settings } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { getCurrentWorkspace } from '@/features/auth/utils/get-current-workspace';

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let workspace;
  try {
    workspace = await getCurrentWorkspace();
  } catch {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r bg-muted/40">
        <div className="px-4 py-5">
          <Link href="/app/events" className="text-lg font-bold tracking-tight">
            invi2me
          </Link>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            href="/app/events"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            <CalendarDays className="size-4" />
            내 이벤트
          </Link>
          <Link
            href="/app/settings"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            <Settings className="size-4" />
            설정
          </Link>
        </nav>

        <Separator />

        <div className="px-3 py-4">
          <p className="mb-2 truncate px-3 text-xs text-muted-foreground">
            {workspace.name ?? workspace.slug}
          </p>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
