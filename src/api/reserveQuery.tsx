import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");

//Auxilary Functions
/* Post */
const auxPostReserve = (data) => {
  return axios.post(`http://localhost:3000/field-reservations/${data.fieldId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

/* Patch */
const auxPatchReserve = (data) => {
  return axios.patch(`http://localhost:3000/field-reservations/${data.id}`, data,  {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    })};

/* Patch */
export const auxPatchCancelReservation = (data) => {
  return axios.patch(`http://localhost:3000/field-reservations/${data.id}`,{
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

//main functions
export const usePostReserve = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostReserve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePatchFields = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPatchReserve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error) => {
      console.log(error)
    }
  });
  return { mutate };
};

export const useGetUserResevationsQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () =>
      axios.get("http://localhost:3000/me/field-reservations", {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o JWT no cabeçalho
        },
      }).then(res => res.data),
  });
  return { data, isLoading, isError };
};

//Patch
export const usePatchCancelReservation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPatchCancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cancel-reservation'] });
    },
    onError: (error) => {
      console.log(error)
    }
  });
  return { mutate };
};