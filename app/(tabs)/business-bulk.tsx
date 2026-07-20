import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z } from "zod";

import MapPicker, { type MapPickerResult } from "../../components/ui/MapPicker";
import { COLORS } from "../../constants/colors";
import {
  useGetBulkFareEstimateMutation,
  useCreateBulkOrderMutation,
} from "../../redux/api/createDelivery";

const deliveryItemSchema = z.object({
  address: z.string().min(1, "Address is required"),
  latitude: z.number().refine((v) => v !== 0, "Location is required"),
  longitude: z.number().refine((v) => v !== 0, "Location is required"),
  phone: z.string().min(1, "Phone is required"),
  name: z.string().min(1, "Name is required"),
});

const bulkOrderSchema = z.object({
  pickupAddress: z.string().min(1, "Pickup location is required"),
  pickupLatitude: z.number().refine((v) => v !== 0, "Pickup location is required"),
  pickupLongitude: z.number().refine((v) => v !== 0, "Pickup location is required"),
  deliveries: z.array(deliveryItemSchema).min(1, "At least one delivery is required"),
  pickupTime: z.date(),
  deliveryTime: z.date(),
  isAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

type DeliveryItem = z.infer<typeof deliveryItemSchema>;

export default function BusinessBulkScreen() {
  const router = useRouter();

  const [pickup, setPickup] = useState<{
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([
    { address: "", latitude: 0, longitude: 0, phone: "", name: "" },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK">("COD");
  const [isAgreed, setIsAgreed] = useState(false);
  const getDefaultTime = (minutesFromNow: number) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + minutesFromNow);
    return d;
  };

  const getMinPickupTime = () => getDefaultTime(40);
  const getMinDeliveryTime = () => getDefaultTime(30);

  const [pickupTime, setPickupTime] = useState(getDefaultTime(40));
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);

  const [deliveryTime, setDeliveryTime] = useState(getDefaultTime(40));
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [fareEstimate, setFareEstimate] = useState<any>(null);

  const [mapPickerVisible, setMapPickerVisible] = useState(false);
  const [activeMapTarget, setActiveMapTarget] = useState<
    { type: "pickup" } | { type: "delivery"; index: number }
  >({ type: "pickup" });

  const [getBulkFareEstimate, { isLoading: isEstimating }] =
    useGetBulkFareEstimateMutation();
  const [createBulkOrder, { isLoading: isCreating }] =
    useCreateBulkOrderMutation();

  const canEstimate = useMemo(() => {
    if (!pickup) return false;
    return deliveries.some(
      (d) => d.latitude !== 0 && d.longitude !== 0,
    );
  }, [pickup, deliveries]);

  const canSubmit = useMemo(() => {
    const result = bulkOrderSchema.safeParse({
      pickupAddress: pickup?.address ?? "",
      pickupLatitude: pickup?.latitude ?? 0,
      pickupLongitude: pickup?.longitude ?? 0,
      deliveries: deliveries.filter(
        (d) => d.address && d.latitude !== 0 && d.longitude !== 0 && d.phone && d.name,
      ),
      pickupTime,
      deliveryTime,
      isAgreed,
    });
    return result.success;
  }, [pickup, deliveries, pickupTime, deliveryTime, isAgreed]);

  const openMapPicker = (target: { type: "pickup" } | { type: "delivery"; index: number }) => {
    setActiveMapTarget(target);
    setMapPickerVisible(true);
  };

  const getMapPickerInitial = () => {
    if (activeMapTarget.type === "pickup" && pickup) {
      return { lat: pickup.latitude, lng: pickup.longitude };
    }
    if (activeMapTarget.type === "delivery") {
      const d = deliveries[activeMapTarget.index];
      if (d.latitude && d.longitude) {
        return { lat: d.latitude, lng: d.longitude };
      }
    }
    return { lat: 5.852, lng: -55.203 };
  };

  const handleMapConfirm = (result: MapPickerResult) => {
    if (activeMapTarget.type === "pickup") {
      setPickup({
        address: result.address,
        latitude: result.latitude,
        longitude: result.longitude,
      });
    } else {
      const idx = activeMapTarget.index;
      const updated = [...deliveries];
      updated[idx] = {
        ...updated[idx],
        address: result.address,
        latitude: result.latitude,
        longitude: result.longitude,
      };
      setDeliveries(updated);
    }
  };

  const updateDelivery = (index: number, field: keyof DeliveryItem, value: string) => {
    const updated = [...deliveries];
    updated[index] = { ...updated[index], [field]: value };
    setDeliveries(updated);
  };

  const addDelivery = () => {
    setDeliveries([
      ...deliveries,
      { address: "", latitude: 0, longitude: 0, phone: "", name: "" },
    ]);
  };

  const removeDelivery = (index: number) => {
    if (deliveries.length <= 1) return;
    setDeliveries(deliveries.filter((_, i) => i !== index));
  };

  const handleEstimateFare = async () => {
    const validDeliveries = deliveries.filter(
      (d) => d.latitude !== 0 && d.longitude !== 0,
    );

    if (!pickup || validDeliveries.length === 0) {
      toast.warning("Please select pickup and at least one delivery location");
      return;
    }

    try {
      const response = await getBulkFareEstimate({
        pickup: { latitude: pickup.latitude, longitude: pickup.longitude },
        deliveries: validDeliveries.map((d) => ({
          latitude: d.latitude,
          longitude: d.longitude,
        })),
      }).unwrap();

      setFareEstimate(response?.data);
      toast.success("Fare estimate ready");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to estimate fare");
    }
  };

  const handleCreateOrder = async () => {
    const validDeliveries = deliveries.filter(
      (d) => d.address && d.latitude !== 0 && d.longitude !== 0 && d.phone && d.name,
    );

    const result = bulkOrderSchema.safeParse({
      pickupAddress: pickup?.address ?? "",
      pickupLatitude: pickup?.latitude ?? 0,
      pickupLongitude: pickup?.longitude ?? 0,
      deliveries: validDeliveries,
      pickupTime,
      deliveryTime,
      isAgreed,
    });

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      toast.warning(firstError || "Please fill in all required fields");
      return;
    }

    const minPickup = getMinPickupTime();
    if (pickupTime < minPickup) {
      toast.warning("Pickup time must be at least 40 minutes from now");
      return;
    }

    const minDelivery = getMinDeliveryTime();
    if (deliveryTime < minDelivery) {
      toast.warning("Delivery time must be at least 30 minutes from now");
      return;
    }

    try {
      const response = await createBulkOrder({
        paymentMethod,
        isAgreedToTerms: isAgreed,
        delivery_time: deliveryTime.toISOString(),
        pickup: {
          address: pickup!.address,
          latitude: pickup!.latitude,
          longitude: pickup!.longitude,
          time: pickupTime.toISOString(),
          phone: "",
          name: "",
        },
        deliveries: validDeliveries,
      }).unwrap();

      toast.success(response?.message || "Bulk order created successfully");
      router.back();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create bulk order");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Bulk Order</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Pickup */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Location</Text>
            <Pressable
              style={styles.locationButton}
              onPress={() => openMapPicker({ type: "pickup" })}>
              <Ionicons name="location-outline" size={20} color="#F5A623" />
              <Text style={[styles.locationText, !pickup && styles.placeholderText]}>
                {pickup?.address || "Select pickup location"}
              </Text>
            </Pressable>
          </View>

          {/* Pickup Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Time</Text>
            <Pressable
              style={styles.locationButton}
              onPress={() => setShowPickupTimePicker(true)}>
              <Ionicons name="time-outline" size={20} color="#F5A623" />
              <Text style={styles.locationText}>
                {pickupTime.toLocaleString()}
              </Text>
            </Pressable>
          </View>

          <Modal
            visible={showPickupTimePicker}
            transparent
            animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Pressable onPress={() => setShowPickupTimePicker(false)}>
                    <Text style={styles.modalCancel}>Cancel</Text>
                  </Pressable>
                  <Text style={styles.modalTitle}>Select Pickup Time</Text>
                  <Pressable onPress={() => setShowPickupTimePicker(false)}>
                    <Text style={styles.modalDone}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={pickupTime}
                  mode="datetime"
                  display="spinner"
                  onChange={(_, date) => {
                    if (date) setPickupTime(date);
                  }}
                  minimumDate={getMinPickupTime()}
                  style={styles.picker}
                />
              </View>
            </View>
          </Modal>

          {/* Deliveries */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Deliveries</Text>
              <Pressable onPress={addDelivery} style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={22} color="#003C52" />
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
            </View>

            {deliveries.map((delivery, index) => (
              <View key={index} style={styles.deliveryCard}>
                <View style={styles.deliveryCardHeader}>
                  <Text style={styles.deliveryCardTitle}>Delivery {index + 1}</Text>
                  {deliveries.length > 1 && (
                    <Pressable onPress={() => removeDelivery(index)}>
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </Pressable>
                  )}
                </View>

                <Pressable
                  style={styles.locationButton}
                  onPress={() => openMapPicker({ type: "delivery", index })}>
                  <Ionicons name="location-outline" size={20} color="#F5A623" />
                  <Text style={[styles.locationText, !delivery.address && styles.placeholderText]}>
                    {delivery.address || "Select delivery location"}
                  </Text>
                </Pressable>

                <View style={styles.deliveryFields}>
                  <View style={styles.fieldRow}>
                    <View style={styles.fieldHalf}>
                      <Text style={styles.fieldLabel}>Name</Text>
                      <View style={styles.fieldInput}>
                        <Ionicons name="person-outline" size={16} color="#999" />
                        <TextInput
                          style={styles.fieldInputText}
                          placeholder="Name"
                          placeholderTextColor="#AAA"
                          value={delivery.name}
                          onChangeText={(v) => updateDelivery(index, "name", v)}
                        />
                      </View>
                    </View>
                    <View style={styles.fieldHalf}>
                      <Text style={styles.fieldLabel}>Phone</Text>
                      <View style={styles.fieldInput}>
                        <Ionicons name="call-outline" size={16} color="#999" />
                        <TextInput
                          style={styles.fieldInputText}
                          placeholder="Phone"
                          placeholderTextColor="#AAA"
                          value={delivery.phone}
                          onChangeText={(v) => updateDelivery(index, "phone", v)}
                          keyboardType="phone-pad"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Fare Estimate */}
          {fareEstimate && (
            <View style={styles.fareCard}>
              <Text style={styles.fareTitle}>Fare Estimate</Text>
              {fareEstimate.total_distance_km && (
                <Text style={styles.fareText}>Total Distance: {fareEstimate.total_distance_km} km</Text>
              )}
              {fareEstimate.total_price !== undefined && (
                <Text style={styles.farePrice}>Total Price: SRD {fareEstimate.total_price}</Text>
              )}
              {fareEstimate.deliveries?.map((d: any, i: number) => (
                <Text key={i} style={styles.fareDetail}>
                  Delivery {i + 1}: {d.distance_km} km - SRD {d.price}
                </Text>
              ))}
            </View>
          )}

          {/* Delivery Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Time</Text>
            <Pressable
              style={styles.locationButton}
              onPress={() => setShowTimePicker(true)}>
              <Ionicons name="time-outline" size={20} color="#F5A623" />
              <Text style={styles.locationText}>
                {deliveryTime.toLocaleString()}
              </Text>
            </Pressable>
          </View>

          <Modal
            visible={showTimePicker}
            transparent
            animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Pressable onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.modalCancel}>Cancel</Text>
                  </Pressable>
                  <Text style={styles.modalTitle}>Select Delivery Time</Text>
                  <Pressable onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.modalDone}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={deliveryTime}
                  mode="datetime"
                  display="spinner"
                  onChange={(_, date) => {
                    if (date) setDeliveryTime(date);
                  }}
                  minimumDate={getMinDeliveryTime()}
                  style={styles.picker}
                />
              </View>
            </View>
          </Modal>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentOptions}>
              <Pressable
                style={[styles.paymentOption, paymentMethod === "COD" && styles.paymentOptionActive]}
                onPress={() => setPaymentMethod("COD")}>
                <Ionicons name="cash-outline" size={20} color={paymentMethod === "COD" ? "#FFF" : "#333"} />
                <Text style={[styles.paymentText, paymentMethod === "COD" && styles.paymentTextActive]}>
                  Cash on Delivery
                </Text>
              </Pressable>
              <Pressable
                style={[styles.paymentOption, paymentMethod === "BANK" && styles.paymentOptionActive]}
                onPress={() => setPaymentMethod("BANK")}>
                <Ionicons name="card-outline" size={20} color={paymentMethod === "BANK" ? "#FFF" : "#333"} />
                <Text style={[styles.paymentText, paymentMethod === "BANK" && styles.paymentTextActive]}>
                  Bank Transfer
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Terms */}
          <Pressable
            style={styles.termsRow}
            onPress={() => setIsAgreed(!isAgreed)}>
            <Ionicons
              name={isAgreed ? "checkbox" : "square-outline"}
              size={22}
              color={isAgreed ? "#003C52" : "#999"}
            />
            <Text style={styles.termsText}>I agree to the Terms & Conditions</Text>
          </Pressable>

        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.estimateButton, (!canEstimate || isEstimating) && styles.disabledButton]}
            onPress={handleEstimateFare}
            disabled={!canEstimate || isEstimating}>
            {isEstimating ? (
              <ActivityIndicator color="#003C52" />
            ) : (
              <Text style={styles.estimateButtonText}>Estimate Fare</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.submitButton, (!canSubmit || isCreating || isEstimating) && styles.disabledButton]}
            onPress={handleCreateOrder}
            disabled={!canSubmit || isCreating || isEstimating}>
            {isCreating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create Bulk Order</Text>
            )}
          </Pressable>
        </View>
      </View>

      <MapPicker
        visible={mapPickerVisible}
        onClose={() => setMapPickerVisible(false)}
        onConfirm={handleMapConfirm}
        initialLatitude={getMapPickerInitial().lat}
        initialLongitude={getMapPickerInitial().lng}
        title={
          activeMapTarget.type === "pickup"
            ? "Pick Pickup Location"
            : `Pick Delivery ${activeMapTarget.index + 1} Location`
        }
      />
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 19,
    paddingVertical: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerPlaceholder: {
    width: 36,
    height: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 19,
    paddingBottom: 20,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  placeholderText: {
    color: "#AAA",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003C52",
  },
  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 14,
    gap: 12,
  },
  deliveryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  deliveryFields: {
    gap: 10,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
    gap: 4,
  },
  fieldFull: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  fieldInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 10,
    gap: 6,
  },
  fieldInputText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 10,
  },
  fareCard: {
    backgroundColor: "#ECFEFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#06B6D4",
    padding: 14,
    gap: 4,
  },
  fareTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  fareText: {
    fontSize: 13,
    color: "#333",
  },
  farePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#003C52",
  },
  fareDetail: {
    fontSize: 12,
    color: "#666",
  },
  paymentOptions: {
    flexDirection: "row",
    gap: 10,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
  },
  paymentOptionActive: {
    backgroundColor: "#003C52",
    borderColor: "#003C52",
  },
  paymentText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  paymentTextActive: {
    color: "#FFFFFF",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  termsText: {
    fontSize: 14,
    color: "#333",
  },
  footer: {
    paddingHorizontal: 19,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: "#F8F9FA",
  },
  estimateButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#003C52",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  estimateButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#003C52",
  },
  submitButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#003C52",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  modalCancel: {
    fontSize: 15,
    color: "#999",
  },
  modalDone: {
    fontSize: 15,
    fontWeight: "700",
    color: "#003C52",
  },
  picker: {
    height: 200,
  },
});
