import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");

//Auxilary Functions
/* Post */
export const auxPostProvince = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.post(`http://localhost:3000/provinces/`, data,  {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

/* Put */
export const auxPutProvince = (data) => {
  return axios.put(`http://localhost:3000/provinces/${data.id}`, data,  {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
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

export const useGetProvinceCityId = (id) => {
  const { data, isFetched } = useQuery({
    queryKey: ['cities-province', id],
    queryFn: () => axios.get(`http://localhost:3000/provinces/${id}/cities`),
    enabled: !!id,
  });
  return { data, isFetched };
};
