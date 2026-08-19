import type { LoanType, LoanStatus, PrismaUser, PrismaLoan, PrismaTransaction } from './prisma';

export type { Role, LoanType, LoanStatus, TransactionType } from './prisma';

export type User = Omit<PrismaUser, 'password'>;

export interface LoanUser {
  id: string;
  name: string;
  email: string;
}

export interface Loan extends PrismaLoan {
  user?: LoanUser;
  _count?: { transactions: number };
  transactions?: Transaction[];
}

export interface Transaction extends PrismaTransaction {
  loan?: { id: string; title: string; loanType: LoanType };
  user?: LoanUser;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface Paginated<T> {
  meta: Meta;
  data: T[];
}

export interface StatusBreakdownItem {
  status: LoanStatus;
  _count: { _all: number };
  _sum: { amount: number | null; remainingAmount: number | null };
}

export interface TypeBreakdownItem {
  loanType: LoanType;
  _count: { _all: number };
  _sum: { amount: number | null; remainingAmount: number | null };
}

export interface MonthlyTrendItem {
  month: string;
  added: number;
  paid: number;
}

export interface LoanSummary {
  totals: {
    totalLoans: number;
    totalAmount: number;
    totalRemaining: number;
    totalPaid: number;
    totalDeposited: number;
  };
  statusBreakdown: StatusBreakdownItem[];
  typeBreakdown: TypeBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
  criticalLoans: Loan[];
  finishedLoans: Loan[];
  newLoans: Loan[];
}

export interface TransactionStats {
  totalAmount: number;
  totalPaid: number;
  totalDeposited: number;
  totalCount: number;
  recent: Transaction[];
}
