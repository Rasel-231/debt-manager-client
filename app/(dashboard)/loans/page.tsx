'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { useLoans } from '@/features/loans/hooks';
import { LoanCard } from '@/components/ui/LoanCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { LOAN_STATUS_OPTIONS, LOAN_TYPE_OPTIONS } from '@/lib/constants';
import { MOTION_PAGE } from '@/lib/motion';
import type { LoanQueryParams } from '@/features/loans/types';

function LoansView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? undefined;

  const [params, setParams] = useState<LoanQueryParams>({});
  const [search, setSearch] = useState('');

  const loansQuery = useLoans({ ...params, loanType: type });
  const paginated = loansQuery.data;

  const applySearch = () => {
    setParams((prev) => ({ ...prev, searchTerm: search || undefined, page: 1 }));
  };

  const setFilter = (key: keyof LoanQueryParams, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const activeType = type;

  return (
    <motion.div {...MOTION_PAGE} className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Loans</h1>
          <p className="text-sm text-slate-400">
            {activeType
              ? LOAN_TYPE_OPTIONS.find((t) => t.value === activeType)?.label
              : 'All loans'}
          </p>
        </div>
        <Link
          href="/loans/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Loan
        </Link>
      </div>

      <div className="flex gap-1.5 p-1 rounded-xl bg-white/3 border border-white/5 w-fit">
        <button
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            !activeType
              ? 'bg-cyan-500/15 text-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          onClick={() => router.replace('/loans')}
        >
          All
        </button>
        {LOAN_TYPE_OPTIONS.map((t) => (
          <button
            key={t.value}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeType === t.value
                ? 'bg-cyan-500/15 text-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => router.replace(`/loans?type=${t.value}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex flex-1 gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 transition-all"
              placeholder="Search by title..."
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
                  <LoanCard key={loan.id} loan={loan} highlight={loan.status === 'DUE'} />
                ))}
              </div>
              <Pagination
                meta={paginated.meta}
                onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
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
    </motion.div>
  );
}

export default function LoansPage() {
  return (
    <Suspense fallback={<div className="skeleton h-48 w-full rounded-xl" />}>
      <LoansView />
    </Suspense>
  );
}
