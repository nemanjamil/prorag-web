import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '@/lib/api-client';
import type {
  PromptTemplate,
  CreatePromptTemplateDto,
  UpdatePromptTemplateDto,
} from '@/types/query';

export function usePromptTemplates() {
  return useQuery({
    queryKey: ['prompt-templates'],
    queryFn: () => get<PromptTemplate[]>('/prompt-templates'),
  });
}

export function useCreatePromptTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePromptTemplateDto) =>
      post<PromptTemplate>('/prompt-templates', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
    },
  });
}

export function useUpdatePromptTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdatePromptTemplateDto }) =>
      put<PromptTemplate>(`/prompt-templates/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
    },
  });
}

export function useDeletePromptTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => del(`/prompt-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
    },
  });
}
