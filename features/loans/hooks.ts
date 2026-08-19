'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { Loan, LoanSummary } from '@/types';
import type { LoanQueryParams, CreateLoanPayload, UpdateLoanPayload } from './types';

export const loanKeys = {
  all: ['loans'] as const,
  list: (params: LoanQueryParams) => ['loans', params] as const,
  detail: (id: string) => ['loans', 'detail', id] as const,
  summary: ['loans', 'summary'] as const,
};

export function useLoans(params: LoanQueryParams) {
  return useQuery({
    queryKey: loanKeys.list(params),
    queryFn: () =>
      apiClient
        .get<Loan[]>('/loans', {
          params: {
            ...params,
            page: params.page ?? 1,
            limit: params.limit ?? 9,
            sortBy: params.sortBy ?? 'createdAt',
            sortOrder: params.sortOrder ?? 'desc',
          },
        })
        .then((res) => ({ data: res.data, meta: res.meta! })),
  });
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: loanKeys.detail(id),
    queryFn: () => apiClient.get<Loan>(`/loans/${id}`).then((res) => res.data),
    enabled: Boolean(id),
  });
}

export function useLoanSummary() {
  return useQuery({
    queryKey: loanKeys.summary,
    queryFn: () =>
      apiClient.get<LoanSummary>('/loans/summary').then((res) => res.data),
  });
}

export function useCreateLoan() {
  return useMutation({
    mutationFn: (payload: CreateLoanPayload) =>
      apiClient.post<Loan>('/loans', payload),
  });
}

export function useUpdateLoan() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLoanPayload }) =>
      apiClient.patch<Loan>(`/loans/${id}`, payload),
  });
}

export function useDeleteLoan() {
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/loans/${id}`),
  });
}
