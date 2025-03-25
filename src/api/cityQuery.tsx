import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");

//Auxilary Functions
/* Post */
export const auxPostCity = (data) => {
  return axios.post(`http://localhost:3000/cities/`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

/* Put */
export const auxPutCity = (data) => {
  return axios.put(`http://localhost:3000/cities/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
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
    queryFn: () => axios.get('http://localhost:3000/cities/', {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o JWT no cabeçalho
        },
      }).then(res => res.data),
    });
  return { data, isLoading, isError };
};
