import { TQueryParam } from "@/types";
import { baseApi } from "./baseApi";

type LoginRequest = {
  email: string;
  password: string;
};

type ResetPasswordRequest = {
  newPassword: string;
  resetToken: string;
};

type LoginUser = {
  id: string;
  email: string;
  fullName: string;
  profileImage: string;
  role: "USER";
  isAccountVerified: boolean;
  createdAt: string;
  passwordHashed: string;
  isDeleted: boolean;
  fcmTokens: string[];
};

export type LoginResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: LoginUser;
    accessToken: string;
    message: string;
  };
};

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    //user register --done
    createUserRegister: build.mutation({
      query: (data) => {
        return {
          url: `/auth/signup`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    createUserLogin: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => {
        return {
          url: `/auth/login`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    forgotOtpSend: build.mutation({
      query: (data) => {
        return {
          url: `/auth/forgot-pwd/verify-otp`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    userForgotPassword: build.mutation({
      query: (data) => {
        return {
          url: `/auth/forgot-pwd`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    userRegisterEmailVerification: build.mutation({
      query: (data) => {
        return {
          url: `/auth/verify-email`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    userResetPassword: build.mutation({
      query: ({ newPassword, resetToken }: ResetPasswordRequest) => {
        const authorizationToken = resetToken.startsWith("Bearer ")
          ? resetToken
          : `Bearer ${resetToken}`;

        return {
          url: `/auth/forgot-pwd/reset-pwd`,
          method: "POST",
          headers: {
            Authorization: authorizationToken,
          },
          body: {
            newPassword,
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),

    updateUserStatus: build.mutation({
      query: ({ data, userId }) => {
        return {
          url: `/users/${userId}/status`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Users"],
    }),
    getMeUser: build.query({
      query: () => {
        return {
          url: `/users/me`,
          method: "GET",
        };
      },
      providesTags: ["Auth"],
    }),
    updateMeUser: build.mutation({
      query: (payload: { data: any; profile?: File }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(payload.data));
        if (payload.profile) {
          formData.append("profile", payload.profile);
        }

        return {
          url: `/users/profile`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    updateChangePassword: build.mutation<
      { message: string }, // response type
      { oldPassword: string; newPassword: string } // request type
    >({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    getAllUsers: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.length > 0) {
          args
            .filter((arg: TQueryParam) => arg.value)
            .forEach((arg: TQueryParam) =>
              params.append(arg.name, String(arg.value)),
            );
        }
        return {
          url: `/users`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUserLoginMutation,
  useUserForgotPasswordMutation,
  useUserResetPasswordMutation,
  useCreateUserRegisterMutation,
  useUserRegisterEmailVerificationMutation,
  useGetMeUserQuery,
  useUpdateMeUserMutation,
  useUpdateUserStatusMutation,
  useGetAllUsersQuery,
  useForgotOtpSendMutation,
} = authApi;
