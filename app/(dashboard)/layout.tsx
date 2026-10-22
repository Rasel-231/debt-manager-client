import { Navbar } from '@/components/shared/Navbar';
import { Sidebar } from '@/components/shared/Sidebar';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="drawer lg:drawer-open">
        <input id="app-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            {children}
          </main>
          <footer className="px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              Debt Manager · Smart Debt Tracking &amp; Repayment
            </div>
          </footer>
        </div>
        <div className="drawer-side z-40">
          <label htmlFor="app-drawer" aria-label="close sidebar" className="drawer-overlay" />
          <Sidebar />
        </div>
      </div>
    </ProtectedRoute>
  );
}
