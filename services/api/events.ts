import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/events' }),
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => '',
      providesTags: ['Event'],
    }),
    getEventById: builder.query({
      query: (id: string) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    getEventImages: builder.query({
      query: (id: string) => `/${id}/images`,
      // Optionally add providesTags if you want cache invalidation
    }),
  }),
});

export const { useGetEventsQuery, useGetEventByIdQuery, useGetEventImagesQuery } = eventsApi;
