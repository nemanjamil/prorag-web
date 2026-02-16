import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post } from '@/lib/api-client';
import type { EvaluationDetail, PaginatedEvaluatedLogs } from '@/types/evaluation';

export function useEvaluatedLogs(page: number, limit: number) {
  return useQuery({
    queryKey: ['evaluated-logs', page, limit],
    queryFn: () => get<PaginatedEvaluatedLogs>(`/evaluation?page=${page}&limit=${limit}`),
  });
}

export function useEvaluationDetail(id: number | null) {
  return useQuery({
    queryKey: ['evaluation-detail', id],
    queryFn: () => get<EvaluationDetail>(`/evaluation/${id}`),
    enabled: id !== null,
  });
}

export function useRunEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => post<EvaluationDetail>(`/evaluation/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluated-logs'] });
      queryClient.invalidateQueries({ queryKey: ['evaluation-detail'] });
      queryClient.invalidateQueries({ queryKey: ['query-logs'] });
    },
  });
}
