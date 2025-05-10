import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Club, Event } from '@/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api', credentials: 'include' }),
  tagTypes: ['Club','Event'],
  endpoints: (builder) => ({
    getClubs: builder.query<Club[], void>({
      query: () => 'clubs',
      providesTags: (res = []) => [
        ...res.map(c => ({ type: 'Club' as const, id: c.id })),
        { type: 'Club' as const, id: 'LIST' }
      ],
    }),
    addClub: builder.mutation<Club, Partial<Club>>({
      query: (body) => ({ url: 'clubs', method: 'POST', body }),
      invalidatesTags: [{ type: 'Club', id: 'LIST' }],
    }),
    getEvents: builder.query<Event[], void>({
      query: () => 'events',
      providesTags: (res=[]) => [
        ...res.map(e => ({ type: 'Event' as const, id: e.id })),
        { type: 'Event', id: 'LIST' }
      ],
    }),
    addEvent: builder.mutation<Event, Partial<Event>>({
      query: (body) => ({ url: 'events', method: 'POST', body }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
  }),
});-


export const {
  useGetClubsQuery,
  useAddClubMutation,
  useGetEventsQuery,
  useAddEventMutation,
} = api;
