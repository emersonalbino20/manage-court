import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//Auxilary Functions
/* Post */
export const auxPostCity = (data) => {
  return axios.post(`http://localhost:3000/cities/`, data);
};

/* Put */
export const auxPutCity = (data) => {
  return axios.put(`http://localhost:3000/cities/${data.id}`, data);
};

//main functions
export const usePostCity = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePutCity = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};

//Get
export const useGetCitiesQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cities'],
    queryFn: () => axios.get('http://localhost:3000/cities/'),
  });
  return { data, isLoading, isError };
};
