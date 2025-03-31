import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//Get
export const useGetAdminStatsQuery = () => {
    return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => {
      const mytoken = localStorage.getItem("token");
      return axios
        .get('http://localhost:3000/stats/admin', {
          headers: { Authorization: `Bearer ${mytoken}` }
        })
        .then(response => response.data);
    }
  });
};

//Get
export const useGetOperatorStatsQuery = () => {
    return useQuery({
    queryKey: ['operator-stats'],
    queryFn: () => {
      const mytoken = localStorage.getItem("token");
      return axios
        .get('http://localhost:3000/stats/operator', {
          headers: { Authorization: `Bearer ${mytoken}` }
        })
        .then(response => response.data);
    }
  });
};