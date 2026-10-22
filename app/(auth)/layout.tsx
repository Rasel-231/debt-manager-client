import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-cyan-500/10 via-violet-500/8 to-transparent blur-3xl" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <span className="p-3 rounded-2xl gradient-bg glow-cyan">
            <ShieldCheck className="w-6 h-6 text-white" />
          </span>
          <span className="text-3xl font-semibold tracking-tight">
            Debt<span className="gradient-text">Manager</span>
          </span>
        </Link>
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-cyan-500/12 to-transparent blur-2xl" />
          <div className="relative">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Secure access to your debt management dashboard
        </p>
      </div>
    </div>
  );
}
