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
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-400/80">Overview</p>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-cyan-300" /> Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Track balances, due dates and key metrics at a glance.
        </p>
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
          className="glass-card overflow-hidden relative"
        >
          <div className="absolute inset-x-0 -top-10 h-24 bg-gradient-to-br from-cyan-500/12 to-transparent blur-2xl" />
          <div className="relative p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="font-semibold text-white">Monthly new loans</h2>
                <p className="text-xs text-slate-500 mt-1">Last 6 months</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Trend
              </span>
            </div>
            {summary ? (
              trend.length ? (
                <BarChart data={trend} height={190} />
              ) : (
                <EmptyState title="No data yet" description="Loans you add will appear here." />
              )
            ) : (
              <div className="skeleton h-44 w-full rounded-xl" />
            )}
          </div>
        </motion.section>

        <motion.section
          variants={MOTION_ITEM}
          initial="hidden"
          animate="visible"
          className="glass-card overflow-hidden relative"
        >
          <div className="absolute inset-x-0 -top-10 h-24 bg-gradient-to-br from-rose-500/12 to-transparent blur-2xl" />
          <div className="relative p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Due within 7 days
                </h2>
                <p className="text-xs text-slate-500 mt-1">Prioritize these payments</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-rose-400/80">
                Critical
              </span>
            </div>
            {summary ? (
              critical.length ? (
                <div className="flex flex-col gap-3">
                  {critical.map((loan) => (
                    <div
                      key={loan.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-rose-500/25 bg-gradient-to-r from-rose-500/10 to-transparent p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{loan.title}</p>
                        <p className="text-sm text-rose-300 font-semibold mt-1">
                          {formatCurrency(loan.remainingAmount)} remaining
                        </p>
                      </div>
                      <button
                        className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
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
              <div className="skeleton h-44 w-full rounded-xl" />
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
