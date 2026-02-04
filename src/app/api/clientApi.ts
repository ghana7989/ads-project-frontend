import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type {
  TokenResponse,
  LoginRequest,
  ClientConfig,
  Sequence,
} from '../../types';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const clientApi = createApi({
  reducerPath: 'clientApi',
  baseQuery,
  tagTypes: ['Config', 'Sequence'],
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getConfig: builder.query<ClientConfig, void>({
      query: () => '/client/config',
      providesTags: ['Config'],
    }),
    getSequence: builder.query<Sequence | null, void>({
      query: () => '/client/sequence',
      providesTags: ['Sequence'],
    }),
    heartbeat: builder.mutation<
      { received: boolean },
      { status?: string; currentVideoId?: string }
    >({
      query: (data) => ({
        url: '/client/heartbeat',
        method: 'POST',
        body: data,
      }),
    }),
    logActivity: builder.mutation<
      { logged: boolean },
      { action: string; details?: string }
    >({
      query: (data) => ({
        url: '/client/log',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetConfigQuery,
  useGetSequenceQuery,
  useHeartbeatMutation,
  useLogActivityMutation,
} = clientApi;
