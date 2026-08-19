'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { useLoanSummary, useLoans } from '@/features/loans/hooks';
import { LoanCard } from '@/components/ui/LoanCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { HorizontalBar } from '@/components/ui/BarChart';
import { formatCurrency } from '@/lib/utils';
import { LOAN_STATUS_OPTIONS, LOAN_TYPE_OPTIONS } from '@/lib/constants';
import { MOTION_ITEM, MOTION_PAGE } from '@/lib/motion';
import type { LoanQueryParams } from '@/features/loans/types';

const STATUS_META: Record<string, { label: string; tone: string }> = {
  ACTIVE: { label: 'Active', tone: 'bg-primary' },
  DUE: { label: 'Due', tone: 'bg-error' },
  PENDING: { label: 'Pending', tone: 'bg-warning' },
  FINISHED: { label: 'Finished', tone: 'bg-success' },
};

export default function HomePage() {
  const [params, setParams] = useState<LoanQueryParams>({});
  const [search, setSearch] = useState('');

  const summaryQuery = useLoanSummary();
  const loansQuery = useLoans(params);

  const summary = summaryQuery.data;
  const paginated = loansQuery.data;

  const applySearch = () => {
    setParams((prev) => ({ ...prev, searchTerm: search || undefined, page: 1 }));
  };

  const setFilter = (key: keyof LoanQueryParams, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const maxStatus = Math.max(
    1,
    ...(summary?.statusBreakdown.map((s) => s._count._all) ?? [1])
  );

  return (
    <motion.div {...MOTION_PAGE} className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Home</h1>
          <p className="text-sm text-slate-400">Overview of all your loans at a glance.</p>
        </div>
        <Link
          href="/loans/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Loan
        </Link>
      </div>

      <motion.section
        variants={MOTION_ITEM}
        initial="hidden"
        animate="visible"
        className="glass-card p-5"
      >
        <h2 className="font-semibold text-white flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-cyan-400" /> Loan Analytics
        </h2>
        {summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            <div className="flex flex-col gap-2">
              {summary.statusBreakdown.map((s) => (
                <HorizontalBar
                  key={s.status}
                  label={STATUS_META[s.status]?.label ?? s.status}
                  value={s._count._all}
                  max={maxStatus}
                  tone={STATUS_META[s.status]?.tone ?? 'bg-primary'}
                />
              ))}
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-3">
              <div className="glass-card p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total loans</p>
                <p className="text-xl font-bold text-white mt-1">{summary.totals.totalLoans}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total amount</p>
                <p className="text-xl font-bold text-white mt-1">
                  {formatCurrency(summary.totals.totalAmount)}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Remaining</p>
                <p className="text-xl font-bold text-rose-400 mt-1">
                  {formatCurrency(summary.totals.totalRemaining)}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Paid</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {formatCurrency(summary.totals.totalPaid)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="skeleton h-40 w-full mt-4 rounded-xl" />
        )}
      </motion.section>

      {summary?.criticalLoans.length ? (
        <motion.section variants={MOTION_ITEM} initial="hidden" animate="visible">
          <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Critical — due within 7 days
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {summary.criticalLoans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} highlight />
            ))}
          </div>
        </motion.section>
      ) : null}

      {summary?.newLoans.length ? (
        <motion.section variants={MOTION_ITEM} initial="hidden" animate="visible">
          <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" /> New — added within 7 days
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {summary.newLoans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        </motion.section>
      ) : null}

      {summary?.finishedLoans.length ? (
        <motion.section variants={MOTION_ITEM} initial="hidden" animate="visible">
          <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recently finished
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {summary.finishedLoans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        </motion.section>
      ) : null}

      <motion.section variants={MOTION_ITEM} initial="hidden" animate="visible">
        <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
          <ClipboardList className="w-4 h-4 text-cyan-400" /> All Loans
        </h2>

        <div className="glass-card p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex flex-1 gap-2">
              <input
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 transition-all"
                placeholder="Search by title or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              />
              <button
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                onClick={applySearch}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            <select
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all appearance-none"
              value={params.status ?? ''}
              onChange={(e) => setFilter('status', e.target.value)}
            >
              <option value="" className="bg-slate-900">All statuses</option>
              {LOAN_STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="bg-slate-900">
                  {s.label}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all appearance-none"
              value={params.loanType ?? ''}
              onChange={(e) => setFilter('loanType', e.target.value)}
            >
              <option value="" className="bg-slate-900">All types</option>
              {LOAN_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value} className="bg-slate-900">
                  {t.label}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all appearance-none"
              value={params.sortOrder ?? 'desc'}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  sortOrder: e.target.value as 'asc' | 'desc',
                  page: 1,
                }))
              }
            >
              <option value="desc" className="bg-slate-900">Newest first</option>
              <option value="asc" className="bg-slate-900">Oldest first</option>
            </select>
          </div>

          {paginated ? (
            paginated.data.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.data.map((loan) => (
                    <LoanCard
                      key={loan.id}
                      loan={loan}
                      highlight={
                        loan.status === 'DUE' ||
                        (loan.dueDate !== null && loan.status !== 'FINISHED')
                      }
                    />
                  ))}
                </div>
                <Pagination
                  meta={paginated.meta}
                  onPageChange={(page) =>
                    setParams((prev) => ({ ...prev, page }))
                  }
                />
              </>
            ) : (
              <EmptyState
                title="No loans found"
                description="Try changing your search or filters, or create a new loan."
                action={
                  <Link
                    href="/loans/new"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Loan
                  </Link>
                }
              />
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-48 w-full rounded-xl" />
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
