import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api-client';
import type { Chunk } from '@/types/document';

export function useDocumentChunks(documentId: number) {
  return useQuery({
    queryKey: ['documents', documentId, 'chunks'],
    queryFn: () => get<Chunk[]>(`/documents/${documentId}/chunks`),
  });
}
