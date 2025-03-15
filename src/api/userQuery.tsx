import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//Auxilary Functions
/* Post */
export const auxPostUser = (data) => {
  return axios.post(`http://localhost:5000/users`, data);
};

/* Put */
export const auxPutUser = (data) => {
  return axios.put(`http://localhost:5000/users/${data.id}`, {
    inicio: data.inicio,
    termino: data.termino,
    matriculaAberta: data.matriculaAberta,
  });
};

//main functions
export const usePostUser = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};

export const usePutUser = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};

//Get
export const useGetUsersQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => axios.get('http://localhost:5000/users'),
  });
  return { data, isLoading, isError };
};
