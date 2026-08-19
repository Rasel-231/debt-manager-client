'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarDays, Wallet } from 'lucide-react';
import type { Loan } from '@/types';
import { daysUntil, formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge, LoanTypeBadge } from './StatusBadge';

interface LoanCardProps {
  loan: Loan;
  actions?: React.ReactNode;
  highlight?: boolean;
}

export function LoanCard({ loan, actions, highlight = false }: LoanCardProps) {
  const progress =
    loan.amount > 0 ? Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100) : 0;
  const days = daysUntil(loan.dueDate);

  return (
    <Link href={`/loans/${loan.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`glass-card p-5 h-full cursor-pointer group relative overflow-hidden ${
          highlight ? 'border-rose-500/30 glow-rose' : ''
        }`}
      >
        {highlight && (
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent" />
        )}
        <div className="relative flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                {loan.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                {formatCurrency(loan.remainingAmount)} remaining of {formatCurrency(loan.amount)}
              </p>
            </div>
            <StatusBadge status={loan.status} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <LoanTypeBadge loanType={loan.loanType} />
            {loan.user && (
              <span className="text-xs text-slate-500 bg-white/5 rounded-lg px-2 py-0.5">
                {loan.user.name}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <CalendarDays className="w-3.5 h-3.5" />
              Due {formatDate(loan.dueDate)}
              {days !== null && days >= 0 && <span className="text-slate-500">({days}d)</span>}
            </span>
            <span className="text-slate-500">
              {loan._count?.transactions ?? 0} payments
            </span>
          </div>

          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${
                progress === 100
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-cyan-400 to-violet-500'
              }`}
            />
          </div>
          {actions && <div className="mt-1">{actions}</div>}
        </div>
      </motion.div>
    </Link>
  );
}
