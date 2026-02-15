import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, del } from '@/lib/api-client';
import type { Document } from '@/types/document';

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => get<Document[]>('/documents'),
  });
}

export function useDocument(id: number) {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: () => get<Document>(`/documents/${id}`),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => del(`/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
