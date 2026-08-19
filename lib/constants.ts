import type { LoanStatus, LoanType, TransactionType } from '@/types';

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  CASH_WITH_PRODUCT: 'Cash with Product',
  CASH_ONLY: 'Cash Only',
};

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  FINISHED: 'Finished',
  DUE: 'Due',
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  DEPOSIT: 'Deposit',
  PAYMENT: 'Payment',
};

export const LOAN_STATUS_BADGE: Record<LoanStatus, string> = {
  PENDING: 'badge-info',
  ACTIVE: 'badge-primary',
  FINISHED: 'badge-success',
  DUE: 'badge-error',
};

export const LOAN_TYPE_BADGE: Record<LoanType, string> = {
  CASH_WITH_PRODUCT: 'badge-secondary',
  CASH_ONLY: 'badge-accent',
};

export const TRANSACTION_TYPE_BADGE: Record<TransactionType, string> = {
  DEPOSIT: 'badge-warning',
  PAYMENT: 'badge-success',
};

export const CRITICAL_DAYS = 30;

export const CURRENCY = '৳';

export const LOAN_STATUS_OPTIONS: { value: LoanStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DUE', label: 'Due' },
  { value: 'FINISHED', label: 'Finished' },
];

export const LOAN_TYPE_OPTIONS: { value: LoanType; label: string }[] = [
  { value: 'CASH_WITH_PRODUCT', label: 'Cash with Product' },
  { value: 'CASH_ONLY', label: 'Cash Only' },
];
