import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem("token");

//Auxilary Functions
/* Post */
export const auxPostClient = (data) => {
  return axios.post(`http://localhost:3000/auth/register`, data);
};

export const auxPostUsers = (data) => {
  return axios.post(`http://localhost:3000/users/`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
};


export const auxPostLogin = (data) => {
  return axios.post(`http://localhost:3000/auth/`, data);
};

/* Put */
export const auxPutUser = (data) => {
  return axios.put(`http://localhost:3000/users/${data.id}`, {
    inicio: data.inicio,
    termino: data.termino,
    matriculaAberta: data.matriculaAberta,
  },);
};

//main functions
export const usePostClient = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, variables} = useMutation({
    mutationFn: auxPostClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
      console.log('success');
    },
    onError: (error) => {
      console.log(variables)
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePostUsers = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, variables} = useMutation({
    mutationFn: auxPostUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      console.log('success');
    },
    onError: (error) => {
      console.log(variables)
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePostLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, variables} = useMutation({
    mutationFn: auxPostLogin,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['login'] });
      console.log(response);
    },
    onError: (error) => {
      console.log(variables)
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePutUser = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      console.log('success');
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};

//Get
export const useGetUsersQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axios.get("http://localhost:3000/users/", {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o JWT no cabeçalho
        },
      }).then(res => res.data),
  });

  return { data, isLoading, isError };
};