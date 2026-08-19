import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <span className="p-3 rounded-2xl gradient-bg glow-cyan">
            <ShieldCheck className="w-6 h-6 text-white" />
          </span>
          <span className="text-3xl font-bold">
            Debt<span className="gradient-text">Manager</span>
          </span>
        </Link>
        <div className="glass-card p-8">{children}</div>
      </div>
    </div>
  );
}
