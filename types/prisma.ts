export type Role = 'USER' | 'ADMIN';
export type LoanType = 'CASH_WITH_PRODUCT' | 'CASH_ONLY';
export type LoanStatus = 'PENDING' | 'ACTIVE' | 'FINISHED' | 'DUE';
export type TransactionType = 'DEPOSIT' | 'PAYMENT';

export interface PrismaUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrismaLoan {
  id: string;
  userId: string;
  title: string;
  amount: number;
  remainingAmount: number;
  loanType: LoanType;
  status: LoanStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrismaTransaction {
  id: string;
  loanId: string;
  userId: string;
  amountPaid: number;
  paymentDate: string;
  type: TransactionType;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
