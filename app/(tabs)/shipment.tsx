import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilterTabs, Order, OrderCard } from "../../components/ui/shipment";
import { COLORS } from "../../constants/colors";
import homeData from "../../constants/homeData.json";

const { width } = Dimensions.get("window");

type OrderStatus = "All" | "Delivered" | "Pending" | "Cancelled";

export default function ShipmentScreen() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus>("All");
  const { filterTabs, orders } = homeData;

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <FilterTabs
        tabs={filterTabs}
        activeTab={activeFilter}
        onTabChange={(tab) => setActiveFilter(tab as OrderStatus)}
      />

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item as Order} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="package" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
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
  },
});
