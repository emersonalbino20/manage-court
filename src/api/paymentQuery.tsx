import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");
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
export const useGetPaymentsQuery = (fromDate, toDate, status) => {
  const mytoken = localStorage.getItem("token");
  
  // Construir a URL com os parâmetros de consulta apenas se estiverem definidos
  let url = 'http://localhost:3000/payments/';
  const params = new URLSearchParams();
  
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  if (status && status !== 'all') params.append('status', status);
  
  const queryString = params.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return useQuery({
    queryKey: ['payments', mytoken, fromDate, toDate, status],
    queryFn: () => {
      return axios
        .get(fullUrl, {
          headers: { Authorization: `Bearer ${mytoken}` }
        })
        .then(response => response.data);
    },
    enabled: !!mytoken && (!!fromDate || !!toDate || (!!status && status !== 'all'))
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