import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");

//Auxilary Functions

export const auxPatchCancelPayments = (data) => {
  return axios.patch(`http://localhost:3000/payments/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

//Get
export const useGetUserPaymentsQuery = () => {
    return useQuery({
    queryKey: ['payments'],
    queryFn: () => {
      const token = localStorage.getItem('token');
      return axios
        .get('http://localhost:3000/payments/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => response.data);
    }
  });
};

//Patch
export const usePatchPaymentStatusQuery = () => {
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPatchCancelPayments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments']});
    },
    onError: (error) => {
      console.log(error, variables)
    }
  });
  return { mutate };
};