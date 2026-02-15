import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upload } from '@/lib/api-client';
import type { UploadDocumentParams, UploadDocumentResponse } from '@/types/document';

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UploadDocumentParams) => {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('chunkStrategy', params.chunkStrategy);
      formData.append('chunkSize', params.chunkSize.toString());
      formData.append('chunkOverlap', params.chunkOverlap.toString());
      return upload<UploadDocumentResponse>('/documents/upload', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
