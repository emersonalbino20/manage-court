// Create a new file: src/api/fieldImagesQuery.js

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchFieldImages = async (fieldId) => {
  const response = await axios.get(`http://localhost:3000/field-images/${fieldId}`);
  return response.data;
};

// Hook personalizado usando TanStack Query
export const useFieldImages = (fieldId) => {
  return useQuery({
    queryKey: ['fieldImages', fieldId],
    queryFn: () => fetchFieldImages(fieldId),
    enabled: !!fieldId, // Só executa a query se fieldId existir
  });
};


export const useGetFieldImagesQuery = (fieldId) => {
  const mytoken = localStorage.getItem("token");
  return useQuery({
    queryKey: ['fieldImages', fieldId],
    queryFn: async () => {
      if (!fieldId) return { data: { fieldImages: [] } };
      const response = await axios.get(`http://localhost:3000/field-images/${fieldId}`,{
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
      return response.data;
    },
    enabled: !!fieldId
  });
};

// Add new image
export const usePostFieldImage = () => {
  const queryClient = useQueryClient();
  const mytoken = localStorage.getItem("token");
  return useMutation({
    mutationFn: async ({ fieldId, url }) => {
      return await axios.post(`http://localhost:3000/field-images/${fieldId}`, { url }, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['fieldImages', variables.fieldId]);
    }
  });
};

// Delete image
export const useDeleteFieldImage = () => {
  const queryClient = useQueryClient();
  const mytoken = localStorage.getItem("token");
  return useMutation({
    mutationFn: async (imageId) => {
      return await axios.delete(`http://localhost:3000/field-images/${imageId}`,{
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
    },
    onSuccess: () => {
      // Since we don't have the fieldId in the response, we need to invalidate all fieldImages queries
      queryClient.invalidateQueries({ queryKey: ['fieldImages'] });
    }
  });
};