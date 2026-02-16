import { useMutation } from '@tanstack/react-query';
import { post } from '@/lib/api-client';
import type { PreviewChunksParams, PreviewChunksResponse } from '@/types/document';

export function usePreviewChunks(documentId: number) {
  return useMutation({
    mutationFn: (params: PreviewChunksParams) =>
      post<PreviewChunksResponse>(`/documents/${documentId}/preview-chunks`, params),
  });
}
