import { Navbar } from '@/components/shared/Navbar';
import { Sidebar } from '@/components/shared/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        <footer className="p-4 text-center text-xs text-slate-600 border-t border-white/5">
          Debt Manager · Full-Stack Debt Management Technology
        </footer>
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="app-drawer" aria-label="close sidebar" className="drawer-overlay" />
        <Sidebar />
      </div>
    </div>
  );
}
