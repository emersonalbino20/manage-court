import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//Auxilary Functions
/* Post */
export const auxPostClient = (data) => {
  return axios.post(`http://localhost:3000/auth/register`, data);
};

export const auxPostUsers = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.post(`http://localhost:3000/users/`, data, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

export const auxPutUser = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.put(`http://localhost:3000/users/${data?.id}`, {name: data?.name, phone: data?.phone, type: data?.type}, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

export const auxPutClient = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.put(`http://localhost:3000/me/`, {name: data?.name, phone: data?.phone, email: data?.email, password: data?.password}, {
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};


export const auxPostLogin = (data) => {
  return axios.post(`http://localhost:3000/auth/`, data);
};

export const auxPostForgotPassword = (data) => {
  return axios.post(`http://localhost:3000/auth/forgot-password`, data);
};

export const auxPatchUser = (data) => {
  const mytoken = localStorage.getItem("token");
  return axios.patch(`http://localhost:3000/users/${data?.id}`, {
  isDeleted: data?.isDeleted
},{
      headers: {
        Authorization: `Bearer ${mytoken}`, 
        "Content-Type": "application/json",
      },
    });
};

//main functions
export const usePostClient = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, variables} = useMutation({
    mutationFn: auxPostClient,
    onSuccess: () => {
//      queryClient.invalidateQueries({ queryKey: ['client'] });
      console.log('success');
    },
    onError: (error) => {
      console.log(variables)
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePatchUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, variables} = useMutation({
    mutationFn: auxPatchUser,
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
      console.log(response);
    },
    onError: (error) => {
      console.log(variables)
        console.log(error);
    }
  });
  return { mutate, isLoading };
};

export const usePostForgotPassword = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, variables} = useMutation({
    mutationFn: auxPostForgotPassword,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['forgot-password'] });
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
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
    return useQuery({
    queryKey: ['users'],
    queryFn: () => {
      const mytoken = localStorage.getItem("token");
      return axios
        .get('http://localhost:3000/users', {
          headers: { Authorization: `Bearer ${mytoken}` }
        })
        .then(response => response.data);
    }
  });
};

export const useGetClientsQuery = () => {
    return useQuery({
    queryKey: ['myprofile'],
    queryFn: () => {
      const mytoken = localStorage.getItem("token");
      return axios
        .get('http://localhost:3000/me/', {
          headers: { Authorization: `Bearer ${mytoken}` }
        })
        .then(response => response.data);
    }
  });
};

export const usePutClient = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myprofile'] });
    },
    onError: (error) => {
        console.log(error);
    }
  });
  return { mutate };
};