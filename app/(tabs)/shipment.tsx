/* eslint-disable react-hooks/exhaustive-deps */
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
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
import { TOrderStatus, TOrderType } from "../../types";

const { width } = Dimensions.get("window");

type ShipmentStatus =
  | "PENDING"
  | "STARTED"
  | "ARRIVED"
  | "SUCCESSFUL"
  | "CANCELLED";
type StatusFilter = "ALL" | ShipmentStatus;



const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  "PENDING",
  "STARTED",
  "ARRIVED",
  "SUCCESSFUL",
  "CANCELLED",
];

const toTitleCase = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatOrderDate = (date: string) => {
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



const normalizeOrderStatus = (status: TOrderStatus): ShipmentStatus => {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "SUCCESSFUL":
    case "DELIVERED":
    case "COMPLETED":
      return "SUCCESSFUL";
    case "PENDING":
    case "ACKNOWLEDGED":
      return "PENDING";
    case "STARTED":
      return "STARTED";
    case "ARRIVED":
      return "ARRIVED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "PENDING";
  }
};

export default function ShipmentScreen() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("ALL");

  // Query params for API (remove date and job_type)
const queryParams = useMemo(
  () => [
    { name: "page", value: currentPage },
    { name: "limit", value: itemsPerPage }
  ],
  [currentPage]
);

  // API call
  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllOrdersQuery(queryParams);

  // Type safety for API response
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

  // Filter by status
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) =>
      activeStatus === "ALL"
        ? true
        : normalizeOrderStatus(order.status as TOrderStatus) === activeStatus,
    );
  }, [allOrders, activeStatus]);

  // Map to OrderCard data
  const orderCardData: Order[] = useMemo(
    () =>
      filteredOrders.map((order) => ({
        id: order.id,
        date: formatOrderDate(order.deliveryDate),
        status: normalizeOrderStatus(order.status as TOrderStatus),
        price: Number(order.price || 0),
        shippingType: toTitleCase(order.orderType),
        origin: toTitleCase(order.orderType),
        destination: order.deliveryAddress || "N/A",
      })),
    [filteredOrders],
  );

  const showInitialLoading =
    isLoading || (isFetching && allOrders.length === 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

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

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 16,
                gap: 12,
              }}
            >
              <Pressable
                style={[
                  styles.retryButton,
                  { opacity: meta.hasPreviousPage ? 1 : 0.5 },
                ]}
                disabled={!meta.hasPreviousPage}
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <Text style={styles.retryButtonText}>Previous</Text>
              </Pressable>
              <Text style={{ fontWeight: "600", color: COLORS.textPrimary }}>
                Page {meta.currentPage} of {meta.totalPages}
              </Text>
              <Pressable
                style={[
                  styles.retryButton,
                  { opacity: meta.hasNextPage ? 1 : 0.5 },
                ]}
                disabled={!meta.hasNextPage}
                onPress={() =>
                  setCurrentPage((p) => Math.min(meta.totalPages, p + 1))
                }
              >
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
        <>
          <FlatList
            data={orderCardData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <OrderCard order={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="package" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No orders found</Text>
              </View>
            }
          />
      
        </>
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
  selectorBlock: {
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  selectorList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  datePickerButton: {
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  datePickerText: {
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "600",
  },
  selectorChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  selectorChipActive: {
    backgroundColor: "#1A3A4A",
  },
  selectorChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
  },
  selectorChipTextActive: {
    color: "#FFFFFF",
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
});
