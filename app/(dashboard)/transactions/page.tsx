'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { useTransactions, useTransactionStats } from '@/features/transactions/hooks';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MOTION_PAGE, MOTION_STAGGER, MOTION_ITEM } from '@/lib/motion';
import type { TransactionQueryParams } from '@/features/transactions/types';

export default function TransactionsPage() {
  const [params, setParams] = useState<TransactionQueryParams>({});
  const [search, setSearch] = useState('');

  const transactionsQuery = useTransactions(params);
  const statsQuery = useTransactionStats();
  const paginated = transactionsQuery.data;
  const stats = statsQuery.data;

  const applySearch = () => {
    setParams((prev) => ({ ...prev, searchTerm: search || undefined, page: 1 }));
  };

  const setFilter = (key: keyof TransactionQueryParams, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  return (
    <motion.div {...MOTION_PAGE} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" /> Transaction History
        </h1>
        <p className="text-sm text-slate-400">Every payment and deposit recorded.</p>
      </div>

      <motion.div {...MOTION_STAGGER} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Transactions"
          value={stats ? String(stats.totalCount) : '—'}
          icon={History}
          loading={statsQuery.isLoading}
        />
        <StatCard
          label="Total Amount"
          value={stats ? formatCurrency(stats.totalAmount) : '—'}
          icon={History}
          tone="primary"
          loading={statsQuery.isLoading}
        />
        <StatCard
          label="Paid (Payments)"
          value={stats ? formatCurrency(stats.totalPaid) : '—'}
          icon={History}
          tone="success"
          loading={statsQuery.isLoading}
        />
        <StatCard
          label="Deposited"
          value={stats ? formatCurrency(stats.totalDeposited) : '—'}
          icon={History}
          tone="warning"
          loading={statsQuery.isLoading}
        />
      </motion.div>

      <motion.div
        variants={MOTION_ITEM}
        initial="hidden"
        animate="visible"
        className="glass-card p-5"
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex flex-1 gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 transition-all"
              placeholder="Search by loan title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
            />
            <button
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
              onClick={applySearch}
            >
              Search
            </button>
          </div>

          <select
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all appearance-none"
            value={params.type ?? ''}
            onChange={(e) => setFilter('type', e.target.value)}
          >
            <option value="" className="bg-slate-900">All types</option>
            <option value="PAYMENT" className="bg-slate-900">Payment</option>
            <option value="DEPOSIT" className="bg-slate-900">Deposit</option>
          </select>
        </div>

        {paginated ? (
          paginated.data.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-white/5">
                      <th className="text-slate-400 font-semibold">Date</th>
                      <th className="text-slate-400 font-semibold">Loan</th>
                      <th className="text-slate-400 font-semibold">Type</th>
                      <th className="text-slate-400 font-semibold text-right">Amount</th>
                      <th className="text-slate-400 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.data.map((txn) => (
                      <tr key={txn.id} className="border-white/5 hover:bg-white/2">
                        <td className="whitespace-nowrap text-slate-300">
                          {formatDate(txn.paymentDate)}
                        </td>
                        <td>
                          {txn.loan ? (
                            <Link
                              href={`/loans/${txn.loanId}`}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              {txn.loan.title}
                            </Link>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium border ${
                              txn.type === 'PAYMENT'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                            }`}
                          >
                            {txn.type === 'PAYMENT' ? 'Payment' : 'Deposit'}
                          </span>
                        </td>
                        <td
                          className={`font-semibold text-right whitespace-nowrap ${
                            txn.type === 'PAYMENT' ? 'text-emerald-400' : 'text-cyan-400'
                          }`}
                        >
                          {txn.type === 'PAYMENT' ? '-' : '+'}
                          {formatCurrency(txn.amountPaid)}
                        </td>
                        <td className="text-sm text-slate-500 max-w-xs truncate">
                          {txn.notes ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                meta={paginated.meta}
                onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              />
            </>
          ) : (
            <EmptyState
              title="No transactions found"
              description="Try changing your filters, or record a payment from a loan."
            />
          )
        ) : (
          <div className="skeleton h-48 w-full rounded-xl" />
        )}
      </motion.div>
    </motion.div>
  );
}
