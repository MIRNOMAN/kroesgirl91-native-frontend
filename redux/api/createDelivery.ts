import { TAgentResponse } from "../../types";
import { baseApi } from "./baseApi";

interface RouteCoordinatesRequest {
  start: [number, number]; // [longitude, latitude]
  end: [number, number]; // [longitude, latitude]
}

interface RouteCoordinatesResponse {
  coordinates?: {
    longitude: number;
    latitude: number;
  }[];
}
type CreateDeliveryPayload = {
  job_description: string;
  paymentMethod: "COD" | "BANK";
  isAgreedToTerms: boolean;
  pickup_name: string;
  pickup_phone: string;
  pickup_email: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_datetime: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_email: string;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  job_delivery_datetime: string;
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
    order_id?: string;
    message?: string;
  };
};

interface PriceEstimateRequest {
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_latitude: number;
  delivery_longitude: number;
}

interface PriceEstimateResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    distance_km: string;
    total_price: number;
    max_distance_km: number;
    breakdown?: {
      base_fare?: number;
      distance_charge?: number;
      service_fee?: number;
    };
  };
}

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
    orderById: build.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Deliveries", id }],
    }),
    getAllOrders: build.query({
      query: (args) => {
        const params = new URLSearchParams();

        // Check if args exists and is an object
        if (args && typeof args === "object") {
          Object.entries(args).forEach(([key, value]) => {
            // Only append if value is truthy (or specifically not null/undefined)
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
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
    getEstimatedPrice: build.mutation<
      PriceEstimateResponse,
      PriceEstimateRequest
    >({
      query: (data) => ({
        url: `/orders/fare-estimate`,
        method: "POST",
        body: data,
      }),
    }),

    getRouteCoordinates: build.mutation<
      RouteCoordinatesResponse,
      RouteCoordinatesRequest
    >({
      query: (data) => ({
        url: `/orders/route-coordinates`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateDeliveryMutation,
  useGetAllOrdersQuery,
  useGetAllAgentsQuery,
  useOrderByIdQuery,
  useGetEstimatedPriceMutation,
  useGetRouteCoordinatesMutation,
} = createDeliveryApi;
