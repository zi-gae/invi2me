'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, LogOut, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { logout } from '@/features/auth/actions/logout';
import { LogoutButton } from '@/features/auth/components/logout-button';

interface ConsoleLayoutShellProps {
  children: React.ReactNode;
  workspaceName: string;
}

export function ConsoleLayoutShell({ children, workspaceName }: ConsoleLayoutShellProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <aside
        className={`flex flex-col border-r bg-muted/40 transition-[width] duration-200 ${open ? 'w-64' : 'w-14'}`}
      >
        <div className={`flex items-center py-5 ${open ? 'justify-between px-4' : 'justify-center px-2'}`}>
          {open && (
            <Link href="/app/events" className="text-lg font-bold tracking-tight">
              invi2me
            </Link>
          )}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={open ? '사이드바 닫기' : '사이드바 열기'}
          >
            {open ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
          </button>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            href="/app/events"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent ${!open && 'justify-center'}`}
            title={!open ? '내 이벤트' : undefined}
          >
            <CalendarDays className="size-4 shrink-0" />
            {open && '내 이벤트'}
          </Link>
          <Link
            href="/app/settings"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent ${!open && 'justify-center'}`}
            title={!open ? '설정' : undefined}
          >
            <Settings className="size-4 shrink-0" />
            {open && '설정'}
          </Link>
        </nav>

        <Separator />

        <div className="px-3 py-4">
          {open ? (
            <>
              <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{workspaceName}</p>
              <LogoutButton />
            </>
          ) : (
            <button
              onClick={() => logout()}
              className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              title="로그아웃"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
