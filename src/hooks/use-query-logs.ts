import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api-client';
import type { PaginatedQueryLogs, QueryLog } from '@/types/query';

export function useQueryLogs(page: number, limit: number) {
  return useQuery({
    queryKey: ['query-logs', page, limit],
    queryFn: () => get<PaginatedQueryLogs>(`/query/logs?page=${page}&limit=${limit}`),
  });
}

export function useQueryLog(id: number | null) {
  return useQuery({
    queryKey: ['query-logs', id],
    queryFn: () => get<QueryLog>(`/query/logs/${id}`),
    enabled: id !== null,
  });
}
