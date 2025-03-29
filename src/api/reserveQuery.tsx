import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");

//Auxilary Functions
/* Post */
const auxPostReserve = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.post(`http://localhost:3000/field-reservations/${data.fieldId}`, {fieldAvailabilityId: data.fieldAvailabilityId, paymentMethodId: data.paymentMethodId}, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

/* Patch */
const auxPatchReserve = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.patch(`http://localhost:3000/field-reservations/${data.id}`, data,  {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    })};

/* Patch */
export const auxPatchCancelReservationClient = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.patch(`http://localhost:3000/me/field-reservations/${data.id}/cancel`, {status: data.status,
  cancellationReason: data.cancellationReason}, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

export const auxPatchCancelReservation = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.patch(`http://localhost:3000/field-reservations/${data.id}`, {status: data.status, cancellationReason: data.cancellationReason}, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

//main functions
export const usePostReserve = () => {
  const queryClient = useQueryClient();
  const mytoken = localStorage.getItem("token");
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostReserve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-reservations', mytoken] });
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
    const mytoken = localStorage.getItem("token");
    return useQuery({
    queryKey: ['client-reservations', mytoken],
    queryFn: () => {
      return axios
        .get('http://localhost:3000/me/field-reservations', {
          headers: { Authorization: `Bearer ${mytoken}` }
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
      const mytoken = localStorage.getItem("token");
      return axios
        .get('http://localhost:3000/field-reservations', {
          headers: { Authorization: `Bearer ${mytoken}` }
        })
        .then(response => response.data);
    }
  });
};

export const useGetIdAvailabilities = (fieldId) => {
  const { data, isFetched } = useQuery({
    queryKey: ['field-availability', fieldId],
    queryFn: () => axios.get(`http://localhost:3000/field-availabilities/${fieldId}`),
    enabled: !!fieldId,
  });

  return { data, isFetched };
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

