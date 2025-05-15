// src/store/api.ts
import { Club } from '@/db/schema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { Club } from '@/types'; // define this interface in your types folder

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Club'],
  endpoints: (builder) => ({
    // Fetch all clubs
    getClubs: builder.query<Club[], void>({
      query: () => 'clubs',
      transformResponse: (response: { success: boolean; data: Club[] }) => response.data,
      providesTags: (clubs) =>
        clubs
          ? [
              ...clubs.map((c) => ({ type: 'Club' as const, id: c.id })),
              { type: 'Club', id: 'LIST' },
            ]
          : [{ type: 'Club', id: 'LIST' }],
    }),
    // Fetch a single club by slug
    getClubBySlug: builder.query<Club, string>({
      query: (slug) => `clubs/${slug}`,
      transformResponse: (response: { success: boolean; data: any }) => response.data,
      providesTags: (_result, _error, slug) => [{ type: 'Club', id: slug }],
    }),
  }),
});

export const { useGetClubsQuery, useGetClubBySlugQuery } = api;
