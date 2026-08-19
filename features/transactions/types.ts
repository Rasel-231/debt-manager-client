export interface TransactionQueryParams {
  searchTerm?: string;
  loanId?: string;
  type?: 'DEPOSIT' | 'PAYMENT';
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTransactionPayload {
  loanId: string;
  amountPaid: number;
  type: 'DEPOSIT' | 'PAYMENT';
  paymentDate?: string | null;
  notes?: string | null;
}
