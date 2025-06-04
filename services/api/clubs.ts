import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clubsApi = createApi({
  reducerPath: 'clubsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/clubs' }),
  tagTypes: ['Club'],
  endpoints: (builder) => ({
    getClubs: builder.query({
      query: () => '',
      providesTags: ['Club'],
    }),
    getClubBySlug: builder.query({
      query: (slug: string) => `/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Club', id: slug }],
    }),
    createClub: builder.mutation({
      query: (club: {
        name: string;
        slug: string;
        description: string;
        about: string;
        contactEmail?: string;
        contactPhone?: string;
      }) => ({
        url: '',
        method: 'POST',
        body: club,
      }),
      invalidatesTags: ['Club'],
    }),
    deleteClub: builder.mutation({
      query: (id: string) => ({
        url: '',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (_result, _error, id) => [
        'Club',
        { type: 'Club', id },
      ],
    }),
  }),
});

export const {
  useGetClubsQuery,
  useGetClubBySlugQuery,
  useCreateClubMutation,
  useDeleteClubMutation,
} = clubsApi;
