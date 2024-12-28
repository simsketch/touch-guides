import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Property } from '@/types';
import * as api from '@/lib/api';

export function useProperties(userId: string | null) {
  const queryClient = useQueryClient();

  const propertiesQuery = useQuery<Property[]>({
    queryKey: ['properties', userId],
    queryFn: () => api.get('/api/properties'),
    enabled: !!userId,
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (data: Omit<Property, 'propertyId' | 'guidebooks'>) => {
      const response = await api.post<Property>('/api/properties', data);
      return response;
    },
    onSuccess: (newProperty) => {
      queryClient.setQueryData<Property[]>(['properties', userId], (old = []) => [...old, newProperty]);
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ propertyId, data }: { propertyId: string; data: Partial<Property> }) => {
      const response = await api.put<Property>(`/api/properties/${propertyId}`, data);
      return response;
    },
    onSuccess: (updatedProperty) => {
      queryClient.setQueryData<Property[]>(['properties', userId], (old = []) =>
        old.map((p) => (p.propertyId === updatedProperty.propertyId ? updatedProperty : p))
      );
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await api.del(`/api/properties/${propertyId}`);
      return propertyId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Property[]>(['properties', userId], (old = []) =>
        old.filter((p) => p.propertyId !== deletedId)
      );
    },
  });

  return {
    properties: propertiesQuery.data ?? [],
    isLoading: propertiesQuery.isLoading,
    error: propertiesQuery.error,
    addProperty: (data: Omit<Property, 'propertyId' | 'guidebooks'>) =>
      addPropertyMutation.mutateAsync(data),
    updateProperty: (propertyId: string, data: Partial<Property>) =>
      updatePropertyMutation.mutateAsync({ propertyId, data }),
    deleteProperty: (propertyId: string) => deletePropertyMutation.mutateAsync(propertyId),
  };
} 