'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  HandCoins,
  LayoutDashboard,
  TrendingUp,
} from 'lucide-react';
import { useLoanSummary } from '@/features/loans/hooks';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart } from '@/components/ui/BarChart';
import { LoanCard } from '@/components/ui/LoanCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PayLoanModal } from '@/components/ui/PayLoanModal';
import { formatCurrency } from '@/lib/utils';
import { MOTION_STAGGER, MOTION_ITEM, MOTION_PAGE } from '@/lib/motion';
import type { Loan } from '@/types';

export default function DashboardPage() {
  const summaryQuery = useLoanSummary();
  const [payingLoan, setPayingLoan] = useState<Loan | null>(null);

  const summary = summaryQuery.data;

  const critical = summary?.criticalLoans ?? [];
  const trend =
    summary?.monthlyTrend.map((m) => ({
      label: m.month,
      value: m.added,
      tone: 'primary' as const,
    })) ?? [];

  return (
    <motion.div {...MOTION_PAGE} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-cyan-400" /> Dashboard
        </h1>
        <p className="text-sm text-slate-400">Financial overview and quick actions.</p>
      </div>

      <motion.div {...MOTION_STAGGER} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Loans"
          value={summary ? String(summary.totals.totalLoans) : '—'}
          icon={Banknote}
          loading={summaryQuery.isLoading}
        />
        <StatCard
          label="Total Amount"
          value={summary ? formatCurrency(summary.totals.totalAmount) : '—'}
          icon={TrendingUp}
          tone="primary"
          loading={summaryQuery.isLoading}
        />
        <StatCard
          label="Total Remaining"
          value={summary ? formatCurrency(summary.totals.totalRemaining) : '—'}
          icon={HandCoins}
          tone="error"
          loading={summaryQuery.isLoading}
        />
        <StatCard
          label="Total Paid"
          value={summary ? formatCurrency(summary.totals.totalPaid) : '—'}
          icon={Banknote}
          tone="success"
          loading={summaryQuery.isLoading}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section
          variants={MOTION_ITEM}
          initial="hidden"
          animate="visible"
          className="glass-card overflow-hidden"
        >
          <div className="p-5">
            <h2 className="font-semibold text-white">Monthly New Loans</h2>
            <p className="text-xs text-slate-500 mb-4">Last 6 months</p>
            {summary ? (
              trend.length ? (
                <BarChart data={trend} height={180} />
              ) : (
                <EmptyState title="No data yet" description="Loans you add will appear here." />
              )
            ) : (
              <div className="skeleton h-40 w-full rounded-xl" />
            )}
          </div>
        </motion.section>

        <motion.section
          variants={MOTION_ITEM}
          initial="hidden"
          animate="visible"
          className="glass-card overflow-hidden"
        >
          <div className="p-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Emergency — Due within 7 days
            </h2>
            {summary ? (
              critical.length ? (
                <div className="flex flex-col gap-3 mt-4">
                  {critical.map((loan) => (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between gap-3 glass-card p-4 border-rose-500/20"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{loan.title}</p>
                        <p className="text-sm text-rose-400 font-bold">
                          {formatCurrency(loan.remainingAmount)}
                        </p>
                      </div>
                      <button
                        className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-400 transition-colors shrink-0 flex items-center gap-1.5"
                        onClick={() => setPayingLoan(loan)}
                      >
                        <HandCoins className="w-3.5 h-3.5" /> Pay now
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="All clear"
                  description="No loans are due within the next 7 days."
                />
              )
            ) : (
              <div className="skeleton h-40 w-full rounded-xl mt-4" />
            )}
          </div>
        </motion.section>
      </div>

      <motion.section
        variants={MOTION_ITEM}
        initial="hidden"
        animate="visible"
        className="glass-card overflow-hidden"
      >
        <div className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-white">Quick Clear</h2>
              <p className="text-xs text-slate-500">
                Loans you could finish with a single payment, ordered by due date.
              </p>
            </div>
            <Link
              href="/pay"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20 transition-all"
            >
              Pay loan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {summary ? (
            critical.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {critical.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    highlight
                    actions={
                      <button
                        className="w-full px-3 py-1.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPayingLoan(loan);
                        }}
                      >
                        <HandCoins className="w-3.5 h-3.5" /> Pay now
                      </button>
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing to pay"
                description="Your loans are all in good shape right now."
              />
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-48 w-full rounded-xl" />
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {payingLoan && (
        <PayLoanModal loan={payingLoan} onClose={() => setPayingLoan(null)} />
      )}
    </motion.div>
  );
}
