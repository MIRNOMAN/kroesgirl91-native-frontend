import { baseApi } from "./baseApi";

type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  isForAllUsers: boolean;
  priority: string;
  type: string;
  metadata?: any;
};

type NotificationsResponse = {
  data: { data: Notification[] };
};
type MarkAllReadResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
};

const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getNotifications: build.query<
      NotificationsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/notifications`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["Notifications"],
    }),

    markAllNotificationsRead: build.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: `/notifications/mark-all-read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAllNotificationsReadMutation } =
  notificationApi;
