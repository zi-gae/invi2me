export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add auth check, sidebar navigation
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <h2 className="text-lg font-bold">invi2me</h2>
        <nav className="mt-6 space-y-2">
          <p className="text-sm text-gray-500">이벤트 관리</p>
          {/* TODO: Navigation links */}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
