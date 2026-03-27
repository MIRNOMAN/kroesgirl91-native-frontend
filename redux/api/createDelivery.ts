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

const createDeliveryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createDelivery: build.mutation<unknown, CreateDeliveryRequest>({
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
  }),
});

export const { useCreateDeliveryMutation } = createDeliveryApi;
