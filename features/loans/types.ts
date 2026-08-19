export interface LoanQueryParams {
  searchTerm?: string;
  loanType?: string;
  status?: string;
  minAmount?: string;
  maxAmount?: string;
  fromDate?: string;
  toDate?: string;
  dueFrom?: string;
  dueTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateLoanPayload {
  title: string;
  amount: number;
  loanType: 'CASH_WITH_PRODUCT' | 'CASH_ONLY';
  dueDate?: string | null;
}

export interface UpdateLoanPayload {
  title?: string;
  amount?: number;
  remainingAmount?: number;
  loanType?: 'CASH_WITH_PRODUCT' | 'CASH_ONLY';
  status?: 'PENDING' | 'ACTIVE' | 'FINISHED' | 'DUE';
  dueDate?: string | null;
}
