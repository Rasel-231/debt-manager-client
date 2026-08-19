'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Home as HomeIcon,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/home', label: 'Home', icon: HomeIcon },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/5">
      <div className="flex items-center px-4 md:px-6 h-16 gap-3">
        <div className="flex-none lg:hidden">
          <label
            htmlFor="app-drawer"
            aria-label="open sidebar"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5" />
          </label>
        </div>

        <div className="flex-1 flex items-center gap-3">
          <Link href={isAuthenticated ? '/home' : '/'} className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl gradient-bg glow-cyan">
              <ShieldCheck className="w-4 h-4 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
              Debt<span className="gradient-text">Manager</span>
            </span>
          </Link>
        </div>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex-none">
          {isLoading ? (
            <span className="loading loading-spinner loading-sm text-slate-400" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-white">{user?.name}</span>
                <span className="text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                  {user?.role}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
