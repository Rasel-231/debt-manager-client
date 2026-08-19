'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { HandCoins } from 'lucide-react';
import type { Loan } from '@/types';
import { useCreateTransaction } from '@/features/transactions/hooks';
import { formatCurrency, getErrorMessage } from '@/lib/utils';
import { modalOverlay, modalContent } from '@/lib/motion';

interface PayLoanModalProps {
  loan: Loan;
  onClose: () => void;
}

export function PayLoanModal({ loan, onClose }: PayLoanModalProps) {
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const maxPayable = Math.max(0, loan.remainingAmount);

  const submit = async () => {
    setError(null);
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }
    if (parsed > maxPayable) {
      setError(`Payment amount cannot exceed the remaining balance of ${formatCurrency(maxPayable)}.`);
      return;
    }
    try {
      await createTransaction.mutateAsync({
        loanId: loan.id,
        amountPaid: parsed,
        type: 'PAYMENT',
        notes: notes || null,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['loans'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ]);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={modalOverlay}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          variants={modalContent}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md glass-card p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="p-2 rounded-xl bg-emerald-500/15">
              <HandCoins className="w-5 h-5 text-emerald-400" />
            </span>
            <h3 className="font-bold text-lg text-white">Pay Loan</h3>
          </div>

          <div className="mb-5 glass-card p-4">
            <p className="font-semibold text-white">{loan.title}</p>
            <p className="text-sm text-slate-400 mt-1">
              Remaining balance:{' '}
              <span className="font-bold text-rose-400">{formatCurrency(maxPayable)}</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-300">Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 transition-all"
                placeholder="0.00"
                autoFocus
              />
            </label>

            <div className="flex gap-2">
              {[0.25, 0.5, 1].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  className="px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  onClick={() => setAmount(String(Math.round(maxPayable * ratio * 100) / 100))}
                >
                  {Math.round(ratio * 100)}%
                </button>
              ))}
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-300">Notes (optional)</span>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 transition-all"
                placeholder="e.g. 1st installment"
              />
            </label>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="alert-error px-4 py-2.5 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}
            {createTransaction.isPending && (
              <div className="alert-info px-4 py-2.5 rounded-xl text-sm">
                Recording payment...
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center gap-2 disabled:opacity-50"
              onClick={submit}
              disabled={createTransaction.isPending}
            >
              {createTransaction.isPending ? 'Paying...' : 'Confirm Payment'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
