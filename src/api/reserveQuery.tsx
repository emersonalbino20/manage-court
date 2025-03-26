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
export const auxPatchCancelReservationClient = (data) => {
  return axios.patch(`http://localhost:3000/me/field-reservations/${data.id}/cancel`, {status: data.status,
  cancellationReason: data.cancellationReason}, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

export const auxPatchCancelReservation = (data) => {
  return axios.patch(`http://localhost:3000/me/field-reservations/${data.id}/cancel`, data, {
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
      queryClient.invalidateQueries({ queryKey: ['client-reservations'] });
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

export const useGetClientResevationsQuery = () => {
    return useQuery({
    queryKey: ['client-reservations'],
    queryFn: () => {
      const token = localStorage.getItem('token');
      return axios
        .get('http://localhost:3000/me/field-reservations', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => response.data);
    }
  });
};

//Get
export const useGetUserResevationsQuery = () => {
    return useQuery({
    queryKey: ['user-reservations'],
    queryFn: () => {
      const token = localStorage.getItem('token');
      return axios
        .get('http://localhost:3000/field-reservations', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => response.data);
    }
  });
};


//Patch
export const usePatchCancelReservationClient = () => {
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPatchCancelReservationClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-reservations'] });
    },
    onError: (error) => {
      console.log(error, variables)
    }
  });
  return { mutate };
};

export const usePatchCancelReservation = () => {
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPatchCancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reservations']});
    },
    onError: (error) => {
      console.log(error, variables)
    }
  });
  return { mutate };
};