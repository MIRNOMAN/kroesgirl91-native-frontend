import { TAgentResponse, TQueryParam } from "../../types";
import { baseApi } from "./baseApi";

type CreateDeliveryPayload = {
  type: "PICKUP" | "DELIVERY";
  job_description: string;
  job_delivery_datetime: string;
  price: number;
  quantity: number;
  weight: number;
  paymentMethod: "CASH" | "COD" | "BANK";
  fullName: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  specialInstructions: string;
};

type UploadImage = {
  uri: string;
  name: string;
  type: string;
};

type CreateDeliveryRequest = {
  data: CreateDeliveryPayload;
  image?: UploadImage;
};

type CreateDeliveryResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
};

const createDeliveryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createDelivery: build.mutation<
      CreateDeliveryResponse,
      CreateDeliveryRequest
    >({
      query: ({ data, image }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        if (image) {
          formData.append("image", image as any);
        }

        return {
          url: `/orders/create`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Deliveries"],
    }),
    getAllOrders: build.query({
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
          url: `/orders`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Deliveries"],
    }),
    getAllAgents: build.query<TAgentResponse, void>({
      query: () => {
        return {
          url: `/agents`,
          method: "GET",
        };
      },
      providesTags: ["Deliveries"],
    }),
  }),
});

export const {
  useCreateDeliveryMutation,
  useGetAllOrdersQuery,
  useGetAllAgentsQuery,
} = createDeliveryApi;
