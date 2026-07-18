import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { logout } from "../authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_SERVER_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      headers.set("Authorization", formattedToken);
    }

    return headers;
  },
});

const baseQueryWithToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const route = typeof args === "string" ? args : args.url;
  const body = typeof args === "object" && "body" in args ? args.body : undefined;

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.group(`🔴 [API ERROR] ${route}`);
    console.log("Method:", typeof args === "object" ? (args as any).method ?? "GET" : "GET");
    console.log("Body:", body ?? "N/A");
    console.log("Status:", result.error.status);
    console.log("Data:", JSON.stringify(result.error.data, null, 2));
    console.groupEnd();
  }

  if (result.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithToken,
  tagTypes: ["Auth", "Users", "Reviews", "Deliveries", "Notifications"],
  endpoints: () => ({}),
});
