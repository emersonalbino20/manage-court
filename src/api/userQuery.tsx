import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


//Get

export const useGetUsersQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => axios.get('http://localhost:5000/users'),
  });

  return { data, isLoading, isError };
};