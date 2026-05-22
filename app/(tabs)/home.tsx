import { Order, OrderCard } from "@/components/ui/shipment";
import { useGetAllOrdersQuery } from "@/redux/api/createDelivery";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import backround1 from "../../assets/backround/backround_1.png";
import backround2 from "../../assets/backround/backround_2.png";
import backround from "../../assets/backround/Photoroom.png";
import redDeliveryIcon from "../../assets/Custom_icons/red-delivery.png";
import storeIcon from "../../assets/Custom_icons/store-icon.png";
import DeliveryCard from "../../components/ui/home/DeliveryCard";
import HeaderSection from "../../components/ui/home/HeaderSection";
import ServiceCard from "../../components/ui/home/ServiceCard";
import homeData from "../../constants/homeData.json";
import { APP_ROUTES } from "../../constants/routes";
import { getGreeting } from "../../utils/getGreeting";
import { formatOrderDate, normalizeOrderStatus, toTitleCase } from "./shipment";

const SERVICE_IMAGES = {
  "store-icon": storeIcon,
  "red-delivery": redDeliveryIcon,
} as const;

const BACKGROUND_IMAGES = {
  backround_1: backround1,
  backround_2: backround2,
} as const;

export default function HomeScreen() {
  const {
    data: ordersResponse,
    isLoading,
    isFetching,
  } = useGetAllOrdersQuery({
    page: 1,
    limit: 10,
    status: "PENDING",
  });

  const orderCardData: Order[] = useMemo(
    () =>
      (ordersResponse?.data ?? []).map((order: any, index: number) => ({
        id: String(order?.id ?? index),

        date: formatOrderDate(order?.deliveryDate || order?.createdAt || ""),

        status: normalizeOrderStatus(order?.status),

        price: Number(order?.totalPrice ?? 0),

        shippingType: order?.paymentMethod
          ? toTitleCase(order.paymentMethod)
          : "__",

        // ✅ keep raw values or fallback to undefined (NOT "N/A")
        origin: order?.pickupAddress ?? "",
        destination: order?.deliveryAddress ?? "",

        // optional (if you have street separately in API)
        pickup_street_address: order?.pickup_street_address ?? "",
        delivery_street_address: order?.delivery_street_address ?? "",

        pickupStatus: order.pickupStatus,

        deliveryStatus: order.deliveryStatus,
      })),
    [ordersResponse],
  ).slice(0, 5); // Limit to 5 items for home screen

  const router = useRouter();
  const orders = ordersResponse?.data.slice(0, 5) || [];
  const hasCurrentShipments = orders.length > 0;
  const hasNonPendingShipment = orders.some(
    (order: { status?: string }) =>
      String(order?.status || "").toUpperCase() !== "PENDING",
  );

  const shouldShowCurrentShipmentCard =
    hasCurrentShipments && hasNonPendingShipment;

  const handleServicePress = (serviceTitle: string) => {
    if (serviceTitle === "Business/Bulk") {
      router.push(APP_ROUTES.businessBulk);
      return;
    }

    if (serviceTitle === "Store Pickup") {
      router.push({
        pathname: "/(tabs)/create-delivery",
        params: { title: "Store Pickup" },
      });
      return;
    }

    console.log(`Pressed ${serviceTitle}`);
  };

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{
          minHeight: height - insets.bottom - insets.top,
        }}
        style={{
          ...styles.container,
          height,
        }}
        showsVerticalScrollIndicator={false}>
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

        {shouldShowCurrentShipmentCard ? (
          <View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                marginLeft: 20,
                marginTop: 20,
                marginBottom: 10,
                color: "#333",
              }}>
              Current Shipment
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 30,
          }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              marginLeft: 20,
              marginTop: 10,
              marginBottom: 10,
              color: "#333",
            }}>
            Current Shipment
          </Text>
          <Link
            href={"/shipment"}
            style={{
              color: "#3B82F6",
              fontSize: 16,
              fontWeight: "500",
              touchAction: "manipulation",
            }}>
            View all
          </Link>
        </View>

        {/* Shipment Items */}

        {orders.length === 0 && !isLoading && <EmptyShipmentState />}

        <View className="p-4">
          {isLoading || isFetching
            ? // Render a fixed number of skeletons while loading
              [1, 2, 3, 4].map((key) => <ShipmentSkeleton key={key} />)
            : orderCardData.map((shipment: any) => (
                <>
                  <OrderCard key={shipment.id} order={shipment} />
                </>
              ))}
        </View>
      </ScrollView>
      <Image
        source={backround}
        style={{
          height: height * 0.3,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: -10,
          position: "absolute",
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  skeletonHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },

  skeletonMiddle: {
    flex: 1,
    marginLeft: 12,
  },

  skeletonRight: {
    alignItems: "flex-end",
    maxWidth: "35%",
  },

  skeletonRoute: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  skeletonRouteIconCol: {
    alignItems: "center",
    marginRight: 10,
  },

  skeletonDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },

  skeletonLineVertical: {
    width: 1.5,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },

  skeletonLineShort: {
    width: "40%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },

  skeletonLineMedium: {
    width: "70%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },

  skeletonLineTiny: {
    width: "30%",
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },

  skeletonBadge: {
    width: 80,
    height: 18,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },

  skeletonChip: {
    width: 60,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  container: {
    flex: 1,
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

const ShipmentSkeleton = () => {
  return (
    <View style={styles.skeletonCard}>
      {/* HEADER */}
      <View style={styles.skeletonHeader}>
        {/* ICON */}
        <View style={styles.skeletonIcon} />

        {/* DETAILS */}
        <View style={styles.skeletonMiddle}>
          <View style={styles.skeletonLineShort} />
          <View style={[styles.skeletonLineTiny, { marginTop: 6 }]} />
          <View style={[styles.skeletonBadge, { marginTop: 10 }]} />
        </View>

        {/* PRICE */}
        <View style={styles.skeletonRight}>
          <View style={styles.skeletonLineMedium} />
          <View style={[styles.skeletonLineTiny, { marginTop: 6 }]} />
          <View style={[styles.skeletonChip, { marginTop: 10 }]} />
        </View>
      </View>

      {/* ROUTE */}
      <View style={styles.skeletonRoute}>
        {/* LEFT ICON COLUMN */}
        <View style={styles.skeletonRouteIconCol}>
          <View style={styles.skeletonDot} />
          <View style={styles.skeletonLineVertical} />
          <View style={styles.skeletonDot} />
        </View>

        {/* RIGHT CONTENT */}
        <View style={{ flex: 1 }}>
          <View style={styles.skeletonLineShort} />
          <View style={[styles.skeletonLineMedium, { marginTop: 8 }]} />

          <View style={{ marginTop: 16 }}>
            <View style={styles.skeletonLineShort} />
            <View style={[styles.skeletonLineMedium, { marginTop: 8 }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const EmptyShipmentState = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}>
      <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
        No Shipments Found
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#777",
          textAlign: "center",
          marginTop: 6,
        }}>
        You don’t have any active shipments right now.
      </Text>
    </View>
  );
};
