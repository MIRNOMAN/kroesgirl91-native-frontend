/* eslint-disable react-hooks/exhaustive-deps */
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FilterTabs,
  Order,
  OrderCard,
  ShipmentSkeleton,
} from "../../components/ui/shipment";
import { COLORS } from "../../constants/colors";
import { useGetAllOrdersQuery } from "../../redux/api/createDelivery";
import { TOrderStatus } from "../../types";

const { width } = Dimensions.get("window");

// Updated to match your Enum list
type ShipmentStatus =
  | "DRAFT"
  | "PENDING"
  | "ASSIGNED"
  | "STARTED"
  | "ARRIVED"
  | "SUCCESSFUL"
  | "FAILED"
  | "CANCELLED";

type StatusFilter = "ALL" | ShipmentStatus;

const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  "PENDING",
  "ASSIGNED",
  "STARTED",
  "ARRIVED",
  "SUCCESSFUL",
  "FAILED",
  "CANCELLED",
];

export const toTitleCase = (value?: string | null) => {
  if (!value || typeof value !== "string") {
    return "N/A";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatOrderDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const normalizeOrderStatus = (
  status?: TOrderStatus | null,
): ShipmentStatus => {
  const normalized = String(status || "").toUpperCase();

  switch (normalized) {
    case "SUCCESSFUL":
    case "DELIVERED":
    case "COMPLETED":
      return "SUCCESSFUL";
    case "PENDING":
    case "ACKNOWLEDGED":
      return "PENDING";
    case "DRAFT":
      return "DRAFT";
    case "ASSIGNED":
      return "ASSIGNED";
    case "STARTED":
      return "STARTED";
    case "ARRIVED":
      return "ARRIVED";
    case "FAILED":
      return "FAILED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "PENDING";
  }
};

export default function ShipmentScreen() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("ALL");

  // FIX: Reset to page 1 whenever the status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus]);

  // FIX: Include activeStatus in queryParams to filter on Server, not Local
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (activeStatus !== "ALL") {
      params.status = activeStatus;
    }

    return params;
  }, [currentPage, activeStatus]);

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllOrdersQuery(queryParams);

  type OrderApiResponse = {
    data: any[];
    meta?: {
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };

  const allOrders = (ordersResponse as OrderApiResponse)?.data ?? [];
  const meta = (ordersResponse as OrderApiResponse)?.meta;

  console.log(allOrders[0]);

  // FIX: Map directly from allOrders (server response) instead of local filtering
  const orderCardData: Order[] = useMemo(
    () =>
      allOrders.map((order, index) => ({
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

        pickupStatus: order?.pickupStatus ?? null,
        deliveryStatus: order?.deliveryStatus ?? null,
      })),
    [allOrders],
  );
  const emptyStateMessage = useMemo(() => {
    if (allOrders.length === 0) {
      return activeStatus === "ALL"
        ? "No shipment data found yet. Create a delivery to see it here."
        : `No ${toTitleCase(activeStatus)} shipments found.`;
    }
    return "No shipments available right now.";
  }, [activeStatus, allOrders.length]);

  const showInitialLoading =
    isLoading || (isFetching && allOrders.length === 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <View>
        <FilterTabs
          tabs={STATUS_FILTERS.map((status) =>
            status === "ALL" ? "All" : toTitleCase(status),
          )}
          activeTab={activeStatus === "ALL" ? "All" : toTitleCase(activeStatus)}
          onTabChange={(tab) => {
            const selected = STATUS_FILTERS.find(
              (status) =>
                (status === "ALL" ? "All" : toTitleCase(status)) === tab,
            );
            if (selected) {
              setActiveStatus(selected);
            }
          }}
        />
      </View>

      {meta && meta.totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <Pressable
            style={[
              styles.retryButton,
              { opacity: meta.hasPreviousPage ? 1 : 0.5 },
            ]}
            disabled={!meta.hasPreviousPage || isFetching}
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            <Text style={styles.retryButtonText}>Previous</Text>
          </Pressable>
          <Text style={styles.pageIndicator}>
            Page {meta.currentPage} of {meta.totalPages}
          </Text>
          <Pressable
            style={[
              styles.retryButton,
              { opacity: meta.hasNextPage ? 1 : 0.5 },
            ]}
            disabled={!meta.hasNextPage || isFetching}
            onPress={() =>
              setCurrentPage((p) => Math.min(meta.totalPages, p + 1))
            }>
            <Text style={styles.retryButtonText}>Next</Text>
          </Pressable>
        </View>
      )}

      {showInitialLoading ? (
        <View style={styles.listContent}>
          <ShipmentSkeleton />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Feather name="alert-circle" size={44} color="#EF4444" />
          <Text style={styles.emptyText}>Failed to load orders</Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={orderCardData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="package" size={48} color="#ccc" />
              <Text style={styles.emptyText}>{emptyStateMessage}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 0,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: width > 400 ? 22 : 25,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
    marginBottom: 12,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: "#1A3A4A",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    gap: 12,
  },
  pageIndicator: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
