import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");
console.log(token)
//Auxilary Functions

export const auxPatchCancelPayments = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.patch(`http://localhost:3000/payments/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

//Get
export const useGetPaymentsQuery = () => {
    const mytoken = localStorage.getItem("token");
    return useQuery({
    queryKey: ['payments', mytoken],
    queryFn: () => {
      return axios
        .get('http://localhost:3000/payments/', {
          headers: { Authorization: `Bearer ${mytoken}` }
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