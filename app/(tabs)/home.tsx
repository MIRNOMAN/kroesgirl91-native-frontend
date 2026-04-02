import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrentShipment from "../../components/ui/home/CurrentShipment";
import DeliveryCard from "../../components/ui/home/DeliveryCard";
import HeaderSection from "../../components/ui/home/HeaderSection";
import ServiceCard from "../../components/ui/home/ServiceCard";
import type { ShipmentItemProps } from "../../components/ui/home/ShipmentItem";
import ShipmentItem from "../../components/ui/home/ShipmentItem";
import homeData from "../../constants/homeData.json";
import { APP_ROUTES } from "../../constants/routes";

import { useGetAllOrdersQuery } from "@/redux/api/createDelivery";
import backround1 from "../../assets/backround/backround_1.png";
import backround2 from "../../assets/backround/backround_2.png";
import backround from "../../assets/backround/Photoroom.png";
import redDeliveryIcon from "../../assets/Custom_icons/red-delivery.png";
import storeIcon from "../../assets/Custom_icons/store-icon.png";
import { getGreeting } from "../../utils/getGreeting";

// Status steps for dynamic mapping
const STATUS_STEPS = [
  { key: "ASSIGNED", label: "Accepted", image: "accepted" },
  { key: "STARTED", label: "Picked", image: "picked" },
    {
    key: "ARRIVED",
    label: "Out for Delivery",
    image: "outfordelivery",
  },
  { key: "SUCCESSFUL", label: "In Transit", image: "transit" },

  { key: "CANCELLED", label: "Delivered", image: "delivered" },
];



// Map API status to step index
const STATUS_INDEX_MAP: Record<string, number> = {
  PENDING: 0,
  ACCEPTED: 0,
  PICKED: 1,
  IN_TRANSIT: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
    ASSIGNED: 0,
  STARTED: 1,
  ARRIVED: 2,
  SUCCESSFUL: 3,
  CANCELLED: 4,
};

function getShipmentStatuses(status: string) {
  // Find the current step index
  const idx = STATUS_INDEX_MAP[status?.toUpperCase?.()] ?? 0;
  return STATUS_STEPS.map((step, i) => ({
    image: step.image,
    label: step.label,
    active: i <= idx,
  }));
}

const SERVICE_IMAGES = {
  "store-icon": storeIcon,
  "red-delivery": redDeliveryIcon,
} as const;

const BACKGROUND_IMAGES = {
  backround_1: backround1,
  backround_2: backround2,
} as const;

export default function HomeScreen() {
  const { data: ordersResponse } = useGetAllOrdersQuery({ page: 1, limit: 10 });
  const router = useRouter();
  const orders = ordersResponse?.data.slice(0, 3) || [];
  const hasCurrentShipments = orders.length > 0;

  const handleServicePress = (serviceTitle: string) => {
    if (serviceTitle === "Business/Bulk") {
      router.push(APP_ROUTES.businessBulk);
      return;
    }

    if (serviceTitle === "Store Pickup") {
      router.push("/(tabs)/create-delivery");
      return;
    }

    console.log(`Pressed ${serviceTitle}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <HeaderSection greeting={getGreeting()} />

        {/* New Delivery Card */}
        <DeliveryCard
          title={homeData.newDelivery.title}
          subtitle={homeData.newDelivery.subtitle}
          onPress={() => router.push("/(tabs)/create-delivery")}
        />

        {/* Service Cards */}
        <View style={styles.serviceCardsContainer}>
          {homeData.services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              subtitle={service.subtitle}
              image={
                SERVICE_IMAGES[service.image as keyof typeof SERVICE_IMAGES]
              }
              background={
                BACKGROUND_IMAGES[
                  service.background as keyof typeof BACKGROUND_IMAGES
                ]
              }
              onPress={() => handleServicePress(service.title)}
            />
          ))}
        </View>

        <View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              marginLeft: 20,
              marginTop: 20,
              marginBottom: 10,
              color: "#333",
            }}
          >
            Current Shipment
          </Text>
        </View>

        {/* Shipment Section With Background */}
        <ImageBackground
          source={backround}
          style={styles.shipmentSection}
          imageStyle={styles.shipmentBackgroundImage}
        >
          {/* Current Shipment - Conditional Rendering */}
          {hasCurrentShipments && (
            <CurrentShipment
              recipientName={orders[0].deliveryName}
              trackingId={orders[0].tookanJobId || orders[0].id}
              status={orders[0].status}
              statuses={getShipmentStatuses(orders[0].status)}
              startDate={orders[0].pickupDatetime || orders[0].createdAt}
              startLocation={orders[0].pickupAddress || "N/A"}
              endDate={orders[0].deliveryDate}
              endLocation={orders[0].deliveryAddress || "N/A"}
            />
          )}

          <View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                marginLeft: 20,
                marginTop: 10,
                marginBottom: 10,
                color: "#333",
              }}
            >
              Current Shipment
            </Text>
          </View>

          {/* Shipment Items */}
          {orders.map(
            (
              shipment: ShipmentItemProps & {
                deliveryName?: string;
                status?: string;
              },
            ) => (
              <ShipmentItem
                key={shipment.id}
                id={shipment.tookanJobId || shipment.id}
                name={shipment.deliveryName || shipment.name}
                status={shipment.status}
                onPress={() => router.push("/(tabs)/tracking")}
              />
            ),
          )}
        </ImageBackground>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    marginBottom: 0,
  },
  serviceCardsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bottomSpacing: {
    height: 50,
  },
  shipmentSection: {
    overflow: "hidden",
    paddingBottom: 40,
  },

  shipmentBackgroundImage: {
    borderRadius: 20,
    resizeMode: "cover",
  },
});
