'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarDays, HandCoins, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLoan, useUpdateLoan, useDeleteLoan } from '@/features/loans/hooks';
import { useTransactions, useCreateTransaction } from '@/features/transactions/hooks';
import { StatusBadge, LoanTypeBadge } from '@/components/ui/StatusBadge';
import { PayLoanModal } from '@/components/ui/PayLoanModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { daysUntil, formatCurrency, formatDate, getErrorMessage } from '@/lib/utils';
import { LOAN_STATUS_OPTIONS } from '@/lib/constants';
import { MOTION_PAGE, MOTION_ITEM, modalContent } from '@/lib/motion';
import type { Loan } from '@/types';

export function LoanDetailView({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loanQuery = useLoan(id);
  const [txnPage, setTxnPage] = useState(1);
  const transactionsQuery = useTransactions({ loanId: id, page: txnPage });

  const updateLoan = useUpdateLoan();
  const deleteLoan = useDeleteLoan();
  const createTransaction = useCreateTransaction();

  const [paying, setPaying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<Loan['status']>('ACTIVE');

  const loan = loanQuery.data;
  const paginated = transactionsQuery.data;

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['loans'] }),
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['summary'] }),
    ]);
  };

  if (loanQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-40 w-full rounded-xl" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!loan) {
    return (
      <EmptyState
        title="Loan not found"
        description="This loan may have been deleted."
        action={
          <Link
            href="/loans"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity"
          >
            Back to loans
          </Link>
        }
      />
    );
  }

  const openEdit = () => {
    setTitle(loan.title);
    setDueDate(loan.dueDate ? loan.dueDate.slice(0, 10) : '');
    setStatus(loan.status);
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!title.trim()) {
      toast.error('Title cannot be empty.');
      return;
    }
    try {
      await updateLoan.mutateAsync({
        id,
        payload: {
          title: title.trim(),
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        },
      });
      setEditing(false);
      toast.success('Loan updated successfully!');
      await invalidateAll();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const removeLoan = async () => {
    if (
      !confirm(
        'Delete this loan? All associated transactions will be removed. This cannot be undone.'
      )
    )
      return;
    try {
      await deleteLoan.mutateAsync(id);
      await invalidateAll();
      toast.success('Loan deleted successfully!');
      router.push('/loans');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeposit = async () => {
    const amountStr = prompt('Enter deposit amount (BDT):');
    if (amountStr === null) return;
    const amount = Number(amountStr);
    if (!Number.isFinite(amount) || amount <= 0) return;
    try {
      await createTransaction.mutateAsync({
        loanId: id,
        amountPaid: amount,
        type: 'DEPOSIT',
      });
      toast.success('Deposit recorded successfully!');
      await invalidateAll();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const days = daysUntil(loan.dueDate);
  const paidAmount = Math.max(0, loan.amount - loan.remainingAmount);
  const progress = Math.round((paidAmount / Math.max(1, loan.amount)) * 100);

  return (
    <motion.div {...MOTION_PAGE} className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/loans"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          &larr; Back to loans
        </Link>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all flex items-center gap-1.5"
            onClick={handleDeposit}
          >
            <Plus className="w-4 h-4" /> Deposit
          </button>
          <button
            className="px-3 py-1.5 rounded-xl text-sm font-medium text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20 transition-all flex items-center gap-1.5"
            onClick={openEdit}
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            className="px-3 py-1.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5"
            onClick={removeLoan}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <motion.section
        variants={MOTION_ITEM}
        initial="hidden"
        animate="visible"
        className="glass-card p-6"
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">{loan.title}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge status={loan.status} />
              <LoanTypeBadge loanType={loan.loanType} />
              {loan.user && (
                <span className="text-xs text-slate-500 bg-white/5 rounded-lg px-2 py-0.5">
                  {loan.user.name}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-rose-400">
              {formatCurrency(loan.remainingAmount)}
            </p>
            <p className="text-xs text-slate-500">remaining of {formatCurrency(loan.amount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="glass-card p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Amount</p>
            <p className="text-lg font-bold text-white mt-1">{formatCurrency(loan.amount)}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Paid</p>
            <p className="text-lg font-bold text-emerald-400 mt-1">
              {formatCurrency(paidAmount)}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Due
            </p>
            <p className="text-lg font-bold text-white mt-1">{formatDate(loan.dueDate)}</p>
            {days !== null && (
              <p className="text-xs text-slate-500 mt-0.5">
                {days < 0
                  ? `${Math.abs(days)}d overdue`
                  : days === 0
                    ? 'due today'
                    : `${days}d left`}
              </p>
            )}
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Payments</p>
            <p className="text-lg font-bold text-white mt-1">
              {loan._count?.transactions ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${
                progress === 100
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-cyan-400 to-violet-500'
              }`}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5">
            <span>0</span>
            <span className="font-medium">{progress}% cleared</span>
            <span>{formatCurrency(loan.amount)}</span>
          </div>
        </div>

        {loan.remainingAmount > 0 && loan.status !== 'FINISHED' && (
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center gap-2"
              onClick={() => setPaying(true)}
            >
              <HandCoins className="w-4 h-4" /> Pay Now
            </button>
          </div>
        )}
      </motion.section>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setEditing(false)}
        >
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md glass-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg text-white mb-4">Edit Loan</h3>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-300">Title</span>
                <input
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/40 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-300">Status</span>
                <select
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/40 transition-all appearance-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Loan['status'])}
                >
                  {LOAN_STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value} className="bg-slate-900">
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-300">Due Date</span>
                <input
                  type="date"
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/40 transition-all"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity disabled:opacity-50"
                onClick={saveEdit}
                disabled={updateLoan.isPending}
              >
                {updateLoan.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.section
        variants={MOTION_ITEM}
        initial="hidden"
        animate="visible"
        className="glass-card p-5"
      >
        <h2 className="font-semibold text-white mb-4">Transactions</h2>
        {paginated ? (
          paginated.data.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-white/5">
                      <th className="text-slate-400 font-semibold">Date</th>
                      <th className="text-slate-400 font-semibold">Type</th>
                      <th className="text-slate-400 font-semibold">Amount</th>
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
                        <td className="font-semibold whitespace-nowrap text-slate-200">
                          {txn.type === 'PAYMENT' ? '-' : '+'}
                          {formatCurrency(txn.amountPaid)}
                        </td>
                        <td className="text-sm text-slate-500">{txn.notes ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination meta={paginated.meta} onPageChange={setTxnPage} />
            </>
          ) : (
            <EmptyState
              title="No transactions yet"
              description="Record a payment or deposit for this loan."
            />
          )
        ) : (
          <div className="skeleton h-40 w-full rounded-xl" />
        )}
      </motion.section>

      {paying && loan && <PayLoanModal loan={loan} onClose={() => setPaying(false)} />}
    </motion.div>
  );
}
