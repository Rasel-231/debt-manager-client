'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { HandCoins, Inbox } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLoans } from '@/features/loans/hooks';
import { useCreateTransaction } from '@/features/transactions/hooks';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, getErrorMessage } from '@/lib/utils';
import { MOTION_PAGE, MOTION_ITEM, MOTION_STAGGER } from '@/lib/motion';

export default function PayLoanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();

  const loansQuery = useLoans({ page: 1, limit: 100, sortBy: 'dueDate', sortOrder: 'asc' });
  const payableLoans =
    loansQuery.data?.data.filter(
      (loan) => loan.remainingAmount > 0 && loan.status !== 'FINISHED'
    ) ?? [];

  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');

  const selected = payableLoans.find((loan) => loan.id === selectedId);
  const maxPayable = selected?.remainingAmount ?? 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selected) {
      toast.error('Please select a loan to pay.');
      return;
    }
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error('Please enter a valid amount greater than zero.');
      return;
    }
    if (parsed > maxPayable) {
      toast.error(
        `Payment cannot exceed the remaining balance of ${formatCurrency(maxPayable)}.`
      );
      return;
    }

    try {
      await createTransaction.mutateAsync({
        loanId: selected.id,
        amountPaid: parsed,
        type: 'PAYMENT',
        paymentDate: paymentDate ? new Date(paymentDate).toISOString() : null,
        notes: notes || null,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['loans'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ]);
      toast.success('Payment recorded successfully!');
      router.push(`/loans/${selected.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <motion.div {...MOTION_PAGE} className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <HandCoins className="w-5 h-5 text-cyan-400" /> Pay Loan Now
      </h1>
      <p className="text-sm text-slate-400 mb-6">Record a payment against an active loan.</p>

      {loansQuery.isLoading ? (
        <div className="skeleton h-72 w-full rounded-xl" />
      ) : payableLoans.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No payable loans"
          description="All your loans are fully paid or finished."
          action={
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity"
              onClick={() => router.push('/loans/new')}
            >
              Create a loan
            </button>
          }
        />
      ) : (
        <motion.form
          {...MOTION_STAGGER}
          onSubmit={submit}
          className="glass-card p-6"
        >
          <div className="flex flex-col gap-5">
            <motion.label variants={MOTION_ITEM} className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-300">Select loan</span>
              <select
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/40 transition-all appearance-none"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setAmount('');
                }}
                required
              >
                <option value="" className="bg-slate-900" disabled>
                  Choose a loan...
                </option>
                {payableLoans.map((loan) => (
                  <option key={loan.id} value={loan.id} className="bg-slate-900">
                    {loan.title} — {formatCurrency(loan.remainingAmount)} remaining
                    {loan.dueDate ? ` (due ${formatDate(loan.dueDate)})` : ''}
                  </option>
                ))}
              </select>
            </motion.label>

            {selected && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2.5 rounded-xl text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              >
                Paying{' '}
                <span className="font-bold">{formatCurrency(selected.remainingAmount)}</span>{' '}
                clears this loan.
              </motion.div>
            )}

            <motion.div variants={MOTION_ITEM} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-300">Amount (BDT)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={!selected}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-300">Payment date (optional)</span>
                <input
                  type="date"
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 transition-all"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </label>
            </motion.div>

            <motion.label variants={MOTION_ITEM} className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-300">Notes (optional)</span>
              <input
                type="text"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 transition-all"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 2nd installment"
              />
            </motion.label>

            <motion.div variants={MOTION_ITEM} className="flex justify-end mt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                disabled={createTransaction.isPending || !selected}
              >
                <HandCoins className="w-4 h-4" />
                {createTransaction.isPending ? 'Recording...' : 'Confirm Payment'}
              </button>
            </motion.div>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}
