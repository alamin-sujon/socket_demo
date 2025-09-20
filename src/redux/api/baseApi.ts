import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;
      console.log({ token });
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => "/profile",
    }),
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getAllDriver: builder.query({
      query: () => ({
        url: "/driver",
        params: { limit: 1000 },
        method: "GET",
      }),
    }),
    getAllCompany: builder.query({
      query: () => ({
        url: "/company",
        method: "GET",
      }),
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/message",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLoginMutation,
  useGetAllDriverQuery,
  useGetAllCompanyQuery,
  useSendMessageMutation,
} = apiSlice;
