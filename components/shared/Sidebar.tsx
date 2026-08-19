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
    <aside className="flex flex-col min-h-full w-64 bg-[#0a0f1e] border-r border-white/5 p-4">
      <div className="mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl gradient-bg glow-cyan">
            <Banknote className="w-4 h-4 text-white" />
          </span>
          <div>
            <p className="font-bold text-white leading-tight">Debt Manager</p>
            <p className="text-[11px] text-slate-500">
              {user?.name} · {user?.role}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.adminOnly || user?.role === 'ADMIN'
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.section ?? 'main'}>
              {group.section && (
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold px-3 mt-4 mb-2">
                  {group.section}
                </p>
              )}
              {visibleItems.map(({ href, label, icon: Icon, exact }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive(href, exact)
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>
        );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-white/5">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
