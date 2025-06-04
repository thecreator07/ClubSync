import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Main'],
  endpoints: (builder) => ({
    getMainData: builder.query({
      query: () => 'landing',
      providesTags: ['Main'],
    }),
  }),
});

export const { useGetMainDataQuery } = mainApi;
