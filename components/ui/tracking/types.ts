export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type TrackingPointKind = "pickup" | "dropoff" | "driver" | "agent";

export type TrackingMapPoint = Coordinate & {
  id: string;
  kind: TrackingPointKind;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
};

export type TrackingStep = {
  key: string;
  label: string;
  completed: boolean;
};
