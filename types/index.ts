import { BaseQueryApi } from "@reduxjs/toolkit/query";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: "BUYER" | "GARAGE" | "DEALERSHIP" | "CAR_OWNER" | "SUPERADMIN";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  phoneNumber: string;
  profile: string; // file path or URL
  buyer: {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type TProduct = {
  _id: string;
  title: string;
  description: string;
  photos: { thumbnail: string; cover: string };
  category: string;
  quantity: number;
  price: number;
  stock: number;
  discount: number;
  isDeleted: boolean;
  ratings: number[];
  createdAt: Date;
  updatedAt: Date;
};

export type DocType = {
  name: string;
  url: string;
};

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};
export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;

export type TOrderType = "PICKUP" | "DELIVERY";

export type TOrderPaymentMethod = "CASH" | "COD" | "BANK";

export type TOrderStatus =
  | "PENDING"
  | "SUCCESSFUL"
  | "DELIVERED"
  | "CANCELLED"
  | "COMPLETED"
  | "STARTED"
  | "ARRIVED"
  | "ACKNOWLEDGED"
  | string;

export type TOrder = {
  id: string;
  orderType: TOrderType;
  deliveryDate: string;
  deliveryAddress: string;
  status: TOrderStatus;
  price: number;
  quantity: number;
  weight: number;
  paymentMethod: TOrderPaymentMethod;
  trackingUrl: string | null;
  tookanJobId: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

export type TGetOrdersQuery = {
  date: string;
  job_type: TOrderType;
};

export type TGetOrdersResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: TOrder[];
};
