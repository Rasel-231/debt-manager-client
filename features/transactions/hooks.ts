'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { Transaction, TransactionStats } from '@/types';
import type { TransactionQueryParams, CreateTransactionPayload } from './types';

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (params: TransactionQueryParams) => ['transactions', params] as const,
  stats: ['transactions', 'stats'] as const,
};

export function useTransactions(params: TransactionQueryParams) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () =>
      apiClient
        .get<Transaction[]>('/transactions', {
          params: {
            ...params,
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            sortBy: params.sortBy ?? 'paymentDate',
            sortOrder: params.sortOrder ?? 'desc',
          },
        })
        .then((res) => ({ data: res.data, meta: res.meta! })),
  });
}

export function useTransactionStats() {
  return useQuery({
    queryKey: transactionKeys.stats,
    queryFn: () =>
      apiClient.get<TransactionStats>('/transactions/stats').then((res) => res.data),
  });
}

export function useCreateTransaction() {
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      apiClient.post('/transactions', payload),
  });
}

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/transactions/${id}`),
  });
}
