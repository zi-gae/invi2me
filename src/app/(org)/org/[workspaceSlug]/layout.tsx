import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  CalendarDays,
  Layout,
  Users,
  Globe,
  CreditCard,
} from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const { workspaceSlug } = await params;

  let workspace;
  try {
    const result = await getWorkspaceBySlug(workspaceSlug);
    workspace = result.workspace;
  } catch {
    redirect('/login');
  }

  const navLinks = [
    { label: '이벤트', href: `/org/${workspaceSlug}/events`, icon: CalendarDays },
    { label: '템플릿', href: `/org/${workspaceSlug}/templates`, icon: Layout },
    { label: '멤버', href: `/org/${workspaceSlug}/members`, icon: Users },
    { label: '도메인', href: `/org/${workspaceSlug}/domains`, icon: Globe },
    { label: '결제', href: `/org/${workspaceSlug}/billing`, icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r bg-muted/40">
        <div className="px-4 py-5">
          <Link href={`/org/${workspaceSlug}/events`} className="text-lg font-bold tracking-tight">
            invi2me
          </Link>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
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
