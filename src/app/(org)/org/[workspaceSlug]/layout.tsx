export default function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <h2 className="text-lg font-bold">조직 관리</h2>
        <nav className="mt-6 space-y-2">
          {/* TODO: Org navigation */}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
