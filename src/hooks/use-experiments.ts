import { useMutation } from '@tanstack/react-query';
import { post } from '@/lib/api-client';
import type { CompareRequest, CompareResult } from '@/types/query';

export function useCompareConfigs() {
  return useMutation({
    mutationFn: (dto: CompareRequest) =>
      post<CompareResult>('/experiments/compare', dto),
  });
}
