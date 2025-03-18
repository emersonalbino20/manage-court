import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//Auxilary Functions
/* Post */
export const auxPostCourt = (data) => {
  return axios.post(`http://localhost:5000/court`, data);
};

/* Put */
export const auxPutCourt = (data) => {
  return axios.put(`http://localhost:5000/court/${data.id}`, {
    nome: data.inicio
  });
};

//main functions
export const usePostCourt = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Court'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};

export const usePutCourt = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Court'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};

//Get
export const useGetCourtsQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['courts'],
    queryFn: () => axios.get('http://localhost:5000/Courts'),
  });
  return { data, isLoading, isError };
};
