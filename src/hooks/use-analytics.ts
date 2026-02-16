import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api-client';
import type { AnalyticsResponse } from '@/types/analytics';

export function useAnalytics(days: number) {
  return useQuery({
    queryKey: ['analytics', days],
    queryFn: () => get<AnalyticsResponse>(`/analytics?days=${days}`),
  });
}
