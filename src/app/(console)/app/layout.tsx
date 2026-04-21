import { redirect } from 'next/navigation';

import { getCurrentWorkspace } from '@/features/auth/utils/get-current-workspace';
import { ConsoleLayoutShell } from './_components/console-layout-shell';

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
    <ConsoleLayoutShell workspaceName={workspace.name ?? workspace.slug}>
      {children}
    </ConsoleLayoutShell>
  );
}
