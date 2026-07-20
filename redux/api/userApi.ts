import { TQueryParam } from "@/types";
import { baseApi } from "./baseApi";

type LoginRequest = {
  email?: string;
  phone?: string;
  password: string;
  expoPushToken?: string;
};

type RegisterRequest = {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role?: "USER" | "MERCHANT";
  businessName?: string;
  businessAddressLine1?: string;
  businessLatitude1?: number;
  businessLongitude1?: number;
  businessAddressLine2?: string;
  businessLatitude2?: number;
  businessLongitude2?: number;
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
  role: "USER" | "MERCHANT";
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
    redirectToOtpVerifyPage?: boolean;
  };
};

export type RegisterResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    message?: string;
    user?: {
      id?: string;
      email?: string;
      fullName?: string;
      profileImage?: string | null;
      role?: "USER" | "MERCHANT";
      isAccountVerified?: boolean;
      createdAt?: string;
    };
    otpResponse?: {
      id?: string;
      expiresAt?: string;
      code?: string;
    };
  };
};

export type GetMeUserResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    profileImage?: string | null;
    isAccountVerified?: boolean;
    role?: "USER" | "MERCHANT";
    businessName?: string;
    businessAddressLine1?: string;
    businessLatitude1?: number;
    businessLongitude1?: number;
    businessAddressLine2?: string;
    businessLatitude2?: number;
    businessLongitude2?: number;
  };
};

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    //user register --done
    createUserRegister: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => {
        return {
          url: `/auth/signup`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    registerOtpVerification: build.mutation({
      query: (data) => {
        return {
          url: `/auth/verify-account`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    resendOtp: build.mutation({
      query: (data: { email?: string; phone?: string }) => {
        return {
          url: `/auth/resend-otp`,
          method: "POST",
          body: data,
        };
      },
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

    userRegisterPhoneVerification: build.mutation({
      query: (data) => {
        return {
          url: `/auth/verify-phone`,
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
    getMeUser: build.query<GetMeUserResponse, void>({
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
          formData.append("image", payload.profile);
        }

        return {
          url: `/users/update-profile`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    updateChangePassword: build.mutation({
      query: (data) => {
        return {
          url: `/auth/change-password`,
          method: "PATCH",
          body: data,
        };
      },
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
  useUserRegisterPhoneVerificationMutation,
  useGetMeUserQuery,
  useUpdateMeUserMutation,
  useUpdateUserStatusMutation,
  useGetAllUsersQuery,
  useForgotOtpSendMutation,
  useRegisterOtpVerificationMutation,
  useUpdateChangePasswordMutation,
  useResendOtpMutation,
} = authApi;
