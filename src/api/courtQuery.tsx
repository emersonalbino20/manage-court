import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendCoinBeck } from '@/utils/methods';
import axios from 'axios';
const token = localStorage.getItem("token");

//Auxilary Functions
/* Post */
export const auxPostCourtType = (data) => {
  return axios.post(`http://localhost:3000/field-types/`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

export const auxPostCourt = (data) => {
  return axios.post(`http://localhost:3000/fields/`, data,{
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

export const auxPostCourtAvailabilities = (data) => {
  return axios.post(`http://localhost:3000/field-availabilities/${data.fieldId}`, {
    day: data.day,
    startTime: data.startTime,
    endTime: data.endTime
  },{
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

/* Patch */
export const auxPatchFields = (data) => {
  return axios.patch(`http://localhost:3000/fields/${data.id}`, {
  isDeleted: data?.isDeleted
},{
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

/* Put */
export const auxPutCourt = (data) => {
  const value = sendCoinBeck(data?.hourlyRate);
  return axios.put(`http://localhost:3000/fields/${data.id}`,{ fieldTypeId: data?.fieldTypeId,
      name: data?.name,
      description: data?.description,
      hourlyRate: value,
      address: {
        street: data?.address?.street,
        cityId: data?.address?.cityId,
        provinceId: data?.address?.provinceId,
        latitude: data?.address?.latitude,
        longitude: data?.address?.longitude
      },
      thumbnailUrl: data?.thumbnailUrl
      }, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

export const auxPutCourtType = (data) => {
  return axios.put(`http://localhost:3000/field-types/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    })
};

export const auxPutCourtAvailabilities = (data) => {
  return axios.put(`http://localhost:3000/field-availabilities/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};

//main functions
export const usePostCourt = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePostCourtType = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: auxPostCourtType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-type'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePostCourtAvailabilities = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, variables } = useMutation({
    mutationFn: auxPostCourtAvailabilities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-availability', variables.fieldId] });
      console.log('success');
    },
    onError: (error) => {
        console.log(variables);
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePutCourt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auxPutCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      console.log('Quadra atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar quadra:', error);
    },
  });
};

export const usePutCourtAvailabilities = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, variables } = useMutation({
    mutationFn: auxPutCourtAvailabilities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-availability', variables.fieldId] });
      console.log('success');
    },
    onError: (error) => {
        console.log(variables);
        console.log(error);
    }
  });
  return { mutate };
};

//Patch
export const usePatchFields = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPatchFields,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
    onError: (error) => {
      console.log(error)
    }
  });
  return { mutate };
};


export const usePutCourtType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auxPutCourtType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-type'] });
      console.log('Quadra atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar quadra:', error);
    },
  });
};

//Get
export const useGetCourtsQuery = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['fields'],
    queryFn: () => axios.get('http://localhost:3000/fields/'),
    });
  return { data, isLoading, isError, refetch, isFetching };
};

export const useGetCourtsTypeQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['field-type'],
    queryFn: () => axios.get('http://localhost:3000/field-types/')
    });
  return { data, isLoading, isError };
};

export const useGetCourtId = (fieldId) => {
  const { data, isFetched } = useQuery({
    queryKey: ['fields', fieldId],
    queryFn: () => axios.get(`http://localhost:3000/fields/${fieldId}`),
    enabled: !!fieldId,
  });
  return { data, isFetched };
};

const currentDate = new Date().toISOString().split('T')[0]

export const useGetCourtIdAvailabilities = (fieldId, day) => {
  const { data, isFetched } = useQuery({
    queryKey: ['field-availability', fieldId, day],
    queryFn: () => axios.get(`http://localhost:3000/field-availabilities/${fieldId}?day=${day}`),
    enabled: !!day,
  });

  return { data, isFetched };
};