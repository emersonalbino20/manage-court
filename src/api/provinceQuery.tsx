import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//Auxilary Functions
/* Post */
export const auxPostProvince = (data) => {
  return axios.post(`http://localhost:3000/provinces/`, data);
};

/* Put */
export const auxPutProvince = (data) => {
  return axios.put(`http://localhost:3000/provinces/${data.id}`, data);
};

//main functions
export const usePostProvince = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostProvince,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Provinces'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePutProvince = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutProvince,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Provinces'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};

//Get
export const useGetProvincesQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['Provinces'],
    queryFn: () => axios.get('http://localhost:3000/provinces/'),
  });
  return { data, isLoading, isError };
};
