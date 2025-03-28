import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");

//Auxilary Functions
/* Post */
export const auxPostPaymentMethods = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.post(`http://localhost:3000/payment-methods/`, data, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

/* Put */
export const auxPutPaymentMethods = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.put(`http://localhost:3000/payment-methods/${data.id}`, data,  {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

//main functions
export const usePostPaymentMethods = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostPaymentMethods,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePutPaymentMethods = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutPaymentMethods,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};

//Get
export const useGetPaymentMethodsQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => axios.get('http://localhost:3000/payment-methods/'),
  });
  return { data, isLoading, isError };
};
