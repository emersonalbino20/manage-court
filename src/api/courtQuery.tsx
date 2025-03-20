import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//Auxilary Functions
/* Post */
export const auxPostCourtType = (data) => {
  return axios.post(`http://localhost:3000/field-types/`, data);
};

export const auxPostCourt = (data) => {
  return axios.post(`http://localhost:3000/fields/`, data);
};

/* Put */
export const auxPutCourt = (data) => {
  return axios.put(`http://localhost:3000/fields/${data.id}`, 
    data
  );
};

export const auxPutCourtType = (data) => {
  return axios.put(`http://localhost:3000/field-types/${data.id}`, data);
};


//main functions
export const usePostCourt = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePostCourtType = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostCourtType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-type'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePutCourt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auxPutCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      console.log('Quadra atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar quadra:', error);
    },
  });
};

export const usePutCourtType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auxPutCourtType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-type'] });
      console.log('Quadra atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar quadra:', error);
    },
  });
};


//Get
export const useGetCourtsQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['fields'],
    queryFn: () => axios.get('http://localhost:3000/fields/'),
  });
  return { data, isLoading, isError };
};

export const useGetCourtsTypeQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['field-type'],
    queryFn: () => axios.get('http://localhost:3000/field-types/'),
  });
  return { data, isLoading, isError };
};
