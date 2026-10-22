'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Banknote,
  ClipboardList,
  CreditCard,
  History,
  Home as HomeIcon,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: typeof HomeIcon;
  exact?: boolean;
  adminOnly?: boolean;
}

const NAV_ITEMS: { section: string | null; items: NavItem[] }[] = [
  { section: null, items: [
    { href: '/home', label: 'Home', icon: HomeIcon, exact: true },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  ]},
  { section: 'Loans', items: [
    { href: '/loans?type=CASH_WITH_PRODUCT', label: 'Cash with Product', icon: PackageSearch },
    { href: '/loans?type=CASH_ONLY', label: 'Cash Only', icon: CreditCard },
    { href: '/transactions', label: 'Transaction History', icon: History },
  ]},
  { section: 'Actions', items: [
    { href: '/loans/new', label: 'New Loan Entry', icon: PlusCircle },
    { href: '/pay', label: 'Pay Loan Now', icon: ClipboardList },
  ]},
  { section: 'Admin', items: [
    { href: '/admin/users', label: 'User Management', icon: ShieldCheck, adminOnly: true },
  ]},
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href);

  return (
    <aside className="flex flex-col min-h-full w-72 bg-[#050816]/95 backdrop-blur-2xl border-r border-white/5 p-4">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 rounded-2xl gradient-bg glow-cyan">
            <Banknote className="w-4 h-4 text-white" />
          </span>
          <div>
            <p className="font-semibold text-white leading-tight tracking-tight">Debt Manager</p>
            <p className="text-[11px] text-slate-500">
              {user?.name} · {user?.role}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.adminOnly || user?.role === 'ADMIN'
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.section ?? 'main'}>
              {group.section && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-semibold px-3 mt-5 mb-2">
                  {group.section}
                </p>
              )}
              {visibleItems.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all relative overflow-hidden',
                      active
                        ? 'text-cyan-300'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/12 to-transparent" />
                    )}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-cyan-400" />
                    )}
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 relative z-10',
                        active ? 'text-cyan-300' : 'text-slate-500 group-hover:text-white'
                      )}
                    />
                    <span className="truncate relative z-10">{label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 border-t border-white/5">
        <button
          onClick={logout}
          className="group flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-300 transition-all relative overflow-hidden"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-rose-500/10 to-transparent" />
          <LogOut className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Logout</span>
        </button>
      </div>
    </aside>
  );
}
