import { LOAN_STATUS_LABELS, LOAN_TYPE_LABELS } from '@/lib/constants';
import type { LoanStatus, LoanType } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<LoanStatus, string> = {
  PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  ACTIVE: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  FINISHED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  DUE: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const TYPE_STYLES: Record<LoanType, string> = {
  CASH_WITH_PRODUCT: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  CASH_ONLY: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

export function StatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium border',
        STATUS_STYLES[status]
      )}
    >
      {LOAN_STATUS_LABELS[status]}
    </span>
  );
}

export function LoanTypeBadge({ loanType }: { loanType: LoanType }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium border',
        TYPE_STYLES[loanType]
      )}
    >
      {LOAN_TYPE_LABELS[loanType]}
    </span>
  );
}
