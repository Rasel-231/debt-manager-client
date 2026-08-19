'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateLoan } from '@/features/loans/hooks';
import { formatCurrency, getErrorMessage } from '@/lib/utils';
import { LOAN_TYPE_OPTIONS } from '@/lib/constants';
import { MOTION_PAGE, MOTION_ITEM, MOTION_STAGGER } from '@/lib/motion';
import type { LoanType } from '@/types';

export default function NewLoanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createLoan = useCreateLoan();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loanType, setLoanType] = useState<LoanType>('CASH_WITH_PRODUCT');
  const [dueDate, setDueDate] = useState('');

  const parsedAmount = Number(amount);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please provide a title for this loan.');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount greater than zero.');
      return;
    }

    try {
      await createLoan.mutateAsync({
        title: title.trim(),
        amount: parsedAmount,
        loanType,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['loans'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ]);
      toast.success('Loan created successfully!');
      router.push('/loans');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <motion.div {...MOTION_PAGE} className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-cyan-400" /> New Loan Entry
      </h1>
      <p className="text-sm text-slate-400 mb-6">Add a new loan to track.</p>

      <motion.form
        {...MOTION_STAGGER}
        onSubmit={submit}
        className="glass-card p-6"
      >
        <div className="flex flex-col gap-5">
          <motion.label variants={MOTION_ITEM} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-300">Title</span>
            <input
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bike loan from Rahim"
              required
            />
          </motion.label>

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
              />
              {Number.isFinite(parsedAmount) && parsedAmount > 0 && (
                <span className="text-xs text-slate-500 mt-0.5">
                  {formatCurrency(parsedAmount)}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-300">Loan Type</span>
              <select
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/40 transition-all appearance-none"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as LoanType)}
              >
                {LOAN_TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value} className="bg-slate-900">
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </motion.div>

          <motion.label variants={MOTION_ITEM} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-300">Due Date (optional)</span>
            <input
              type="date"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 transition-all"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </motion.label>

          <motion.div variants={MOTION_ITEM} className="flex items-center justify-end gap-3 mt-2">
            <Link
              href="/loans"
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              disabled={createLoan.isPending}
            >
              <PlusCircle className="w-4 h-4" />
              {createLoan.isPending ? 'Creating...' : 'Create Loan'}
            </button>
          </motion.div>
        </div>
      </motion.form>
    </motion.div>
  );
}
