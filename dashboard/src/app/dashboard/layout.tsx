import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex' }}>
      <Sidebar />
      {/*
        On desktop the sidebar is fixed, so we use a left margin.
        The sidebar starts at 64px collapsed; JS in Sidebar syncs localStorage.
        We can't read localStorage here (server component), so we default to the
        collapsed width and let the client hydrate without layout shift.
      */}
      <div
        className="flex-1 lg:ml-16"
        style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
