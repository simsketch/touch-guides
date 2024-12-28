import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Guidebook } from '@/types';
import * as api from '@/lib/api';

export function useGuidebooks(propertyId: string | null) {
  const queryClient = useQueryClient();

  const addGuidebookMutation = useMutation({
    mutationFn: async (data: Omit<Guidebook, 'guidebookId'>) => {
      const response = await api.post<Guidebook>(`/api/properties/${propertyId}/guidebooks`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  const updateGuidebookMutation = useMutation({
    mutationFn: async ({ guidebookId, data }: { guidebookId: string; data: Partial<Guidebook> }) => {
      const response = await api.put<Guidebook>(`/api/guidebooks/${guidebookId}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  return {
    addGuidebook: (data: Omit<Guidebook, 'guidebookId'>) => addGuidebookMutation.mutateAsync(data),
    updateGuidebook: (guidebookId: string, data: Partial<Guidebook>) =>
      updateGuidebookMutation.mutateAsync({ guidebookId, data }),
  };
} 