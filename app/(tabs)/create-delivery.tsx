import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import {
  BankTransfer,
  BookingConfirmed,
  CashOnDelivery,
  ChooseRide,
  DeliveryDetails,
  DeliveryHeader,
  PackageDetails,
  PickupDetails,
  StepIndicator,
} from "../../components/ui/delivery";
import createDeliveryData from "../../constants/createDeliveryData.json";
import {
  useCreateDeliveryMutation,
  useGetEstimatedPriceMutation,
} from "../../redux/api/createDelivery";

type Step =
  | "pickup"
  | "delivery"
  | "ride"
  | "package"
  | "payment"
  | "confirmed";

interface PickupData {
  fullName: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
  streetNumber?: string;
  latitude?: number;
  longitude?: number;
}

interface DeliveryData {
  name: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
  streetNumber?: string;
  latitude?: number;
  longitude?: number;
}

interface PackageData {
  description: string;
  instructions: string;
  quantity: number;
  weight: number;
  paymentMethod: "cash" | "bank" | null;
}

interface RideFareOption {
  id: string;
  label: string;
  price: number;
}

interface RideOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  currency: string;
  priceLabel: string;
  icon: string;
  fareOptions?: RideFareOption[];
}

interface CreateOrderPayload {
  job_description: string;
  paymentMethod: "COD" | "BANK";
  isAgreedToTerms: boolean;
  pickup_name: string;
  pickup_phone: string;
  pickup_email: string;
  pickup_address: string;
  pickup_street_address?: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_datetime: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_email: string;
  delivery_address: string;
  delivery_street_address?: string;
  delivery_latitude: number;
  delivery_longitude: number;
  job_delivery_datetime: string;
  specialInstructions: string;
}

type FormLocationData = PickupData | DeliveryData;

type TrackingResponseData = {
  data?: {
    order_id?: string;
    id?: string;
  };
};

export default function CreateDeliveryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [step, setStep] = useState<Step>("pickup");
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [bankImageUri, setBankImageUri] = useState<string | null>(null);
  const [isAgreedToProhibited, setIsAgreedToProhibited] = useState(false);

  const [createDelivery, { isLoading: isCreatingDelivery }] =
    useCreateDeliveryMutation();
  const [getEstimatedPrice, { isLoading: isLoadingPrice }] =
    useGetEstimatedPriceMutation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [estimatedPriceData, setEstimatedPriceData] = useState<{
    distance_km: string;
    total_price: number;
    max_distance_km: number;
  } | null>(null);

  const [pickupData, setPickupData] = useState<PickupData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    fullAddress: "",
    streetNumber: "",
  });

  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    name: "",
    phoneNumber: "",
    email: "",
    fullAddress: "",
    streetNumber: "",
  });

  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [selectedRideFareOptionById, setSelectedRideFareOptionById] = useState<
    Record<string, string>
  >({});

  const [packageData, setPackageData] = useState<PackageData>({
    description: "",
    instructions: "",
    quantity: 1,
    weight: 0,
    paymentMethod: null,
  });

  useEffect(() => {
    if (packageData.paymentMethod !== "bank" && bankImageUri) {
      setBankImageUri(null);
    }
  }, [bankImageUri, packageData.paymentMethod]);

  const rideOptionsForDisplay = useMemo(() => {
    const baseOptions = (createDeliveryData.rideOptions as RideOption[]).filter(
      (option) => option.id === "same-day",
    );

    if (!estimatedPriceData || step !== "ride") {
      return [];
    }

    return baseOptions.map((option) => ({
      ...option,
      price: estimatedPriceData.total_price,
      subtitle: `${estimatedPriceData.distance_km} km`,
      distance_km: estimatedPriceData.distance_km,
      max_distance_km: estimatedPriceData.max_distance_km,
      fareOptions: undefined,
    }));
  }, [estimatedPriceData, step]);

  const handleSelectRide = (rideId: string) => {
    setSelectedRide(rideId);

    const selectedOption = rideOptionsForDisplay.find(
      (option) => option.id === rideId,
    );
    const firstFareOption = selectedOption?.fareOptions?.[0];

    if (firstFareOption) {
      setSelectedRideFareOptionById((prev) => ({
        ...prev,
        [rideId]: prev[rideId] ?? (firstFareOption as any).id,
      }));
    }
  };

  const handleSelectFareOption = (rideId: string, fareOptionId: string) => {
    setSelectedRideFareOptionById((prev) => ({
      ...prev,
      [rideId]: fareOptionId,
    }));
  };

  useEffect(() => {
    const fetchEstimatedPrice = async () => {
      const isPickupComplete =
        pickupData.fullAddress.trim() &&
        Number.isFinite(pickupData.latitude) &&
        Number.isFinite(pickupData.longitude);
      const isDeliveryComplete =
        deliveryData.fullAddress.trim() &&
        Number.isFinite(deliveryData.latitude) &&
        Number.isFinite(deliveryData.longitude);

      if (step === "ride" && isPickupComplete && isDeliveryComplete) {
        try {
          const response = await getEstimatedPrice({
            pickup_latitude: pickupData.latitude!,
            pickup_longitude: pickupData.longitude!,
            delivery_latitude: deliveryData.latitude!,
            delivery_longitude: deliveryData.longitude!,
          }).unwrap();

          if (response?.data) {
            setEstimatedPriceData(response.data);
            setSelectedRide((currentRide) => currentRide ?? "same-day");
          }
        } catch (error) {
          console.error("Failed to fetch estimated price:", error);
          toast.error("Failed to fetch price estimate. Please try again.");
        }
      }
    };

    fetchEstimatedPrice();
  }, [step, pickupData, deliveryData, getEstimatedPrice]);

  const getJobDeliveryDateTime = (pickup: Date): string => {
    const now = new Date();
    const safePickup =
      pickup.getTime() < now.getTime()
        ? new Date(now.getTime() + 15 * 60 * 1000)
        : pickup;

    let delivery = new Date(safePickup);

    if (selectedRide === "same-day") {
      delivery = new Date(safePickup.getTime() + 60 * 60 * 1000);
    } else if (selectedRide === "next-day") {
      delivery = new Date(safePickup);
      delivery.setDate(delivery.getDate() + 1);
    } else {
      delivery = new Date(safePickup.getTime() + 60 * 60 * 1000);
    }

    return delivery.toISOString();
  };

  const getHeaderTitle = (): string => {
    const flowTitle =
      typeof params.title === "string" && params.title.trim().length > 0
        ? params.title
        : "Create Delivery";

    switch (step) {
      case "pickup":
      case "delivery":
      case "package":
        return flowTitle;
      case "ride":
        return "Choose a ride";
      case "payment":
        return packageData.paymentMethod === "bank"
          ? "Bank transfer"
          : "Cash on delivery";
      default:
        return flowTitle;
    }
  };

  const handleBack = () => {
    switch (step) {
      case "pickup":
        router.back();
        break;
      case "delivery":
        setStep("pickup");
        setCurrentStep(1);
        break;
      case "ride":
        setStep("delivery");
        setCurrentStep(2);
        break;
      case "package":
        setStep("ride");
        setCurrentStep(3);
        break;
      case "payment":
        setStep("package");
        setCurrentStep(4);
        break;
    }
  };

  const handlePickupNext = () => {
    if (
      !pickupData.fullName.trim() ||
      !pickupData.phoneNumber.trim() ||
      !pickupData.fullAddress.trim() ||
      !pickupData.streetNumber?.trim()
    ) {
      showAlert(
        "Required",
        "Please complete pickup details (including street/house number) before next.",
      );
      return;
    }

    setStep("delivery");
    setCurrentStep(2);
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleDeliveryNext = () => {
    if (
      !deliveryData.name.trim() ||
      !deliveryData.phoneNumber.trim() ||
      !deliveryData.fullAddress.trim() ||
      !deliveryData.streetNumber?.trim()
    ) {
      showAlert(
        "Required",
        "Please complete delivery details (including street/house number) before next.",
      );
      return;
    }

    setStep("ride");
    setCurrentStep(3);
  };

  const handleRideNext = () => {
    if (!selectedRide) {
      showAlert("Required", "Please select a ride option.");
      return;
    }

    const selectedOption = rideOptionsForDisplay.find(
      (option) => option.id === selectedRide,
    );

    const hasFareOptions = Boolean(
      selectedOption?.fareOptions &&
      (selectedOption.fareOptions as any).length > 0,
    );

    if (hasFareOptions && !selectedRideFareOptionById[selectedRide]) {
      showAlert("Required", "Please select a ride distance option.");
      return;
    }

    setStep("package");
    setCurrentStep(4);
  };

  const handlePackageNext = () => {
    if (!packageData.description.trim()) {
      showAlert("Required", "Please enter package description.");
      return;
    }

    if (!packageData.paymentMethod) {
      showAlert("Required", "Please select a payment method.");
      return;
    }

    setStep("payment");
  };

  const isLocationComplete = (value: FormLocationData) => {
    return (
      Boolean(value.fullAddress.trim()) &&
      Number.isFinite(value.latitude) &&
      Number.isFinite(value.longitude)
    );
  };

  const formatAddress = (address?: Location.LocationGeocodedAddress) => {
    if (!address) {
      return "";
    }

    return [
      address.name,
      address.street,
      address.city,
      address.region,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const handleConfirmBooking = async () => {
    if (!packageData.paymentMethod) {
      Alert.alert("Required", "Please select a payment method.");
      return;
    }

    if (packageData.paymentMethod === "bank" && !bankImageUri) {
      Alert.alert("Required", "Please upload payment screenshot.");
      return;
    }

    const sourceData = pickupData;
    let bookingLocationData: FormLocationData = sourceData;

    if (!isLocationComplete(sourceData)) {
      bookingLocationData = {
        ...sourceData,
      };

      setPickupData((prev) => ({
        ...prev,
        fullAddress: bookingLocationData.fullAddress,
        latitude: bookingLocationData.latitude,
        longitude: bookingLocationData.longitude,
      }));
    }

    const now = new Date();
    const pickupDate =
      new Date(Date.now() + 15 * 60 * 1000) < now
        ? new Date(now.getTime() + 15 * 60 * 1000)
        : new Date(Date.now() + 15 * 60 * 1000);
    const deliveryDate = getJobDeliveryDateTime(pickupDate);

    const payload: CreateOrderPayload = {
      job_description: packageData.description,
      paymentMethod: packageData.paymentMethod === "bank" ? "BANK" : "COD",
      isAgreedToTerms: isAgreedToProhibited,
      pickup_name: pickupData.fullName,
      pickup_phone: pickupData.phoneNumber,
      pickup_email: pickupData.email,
      pickup_address: pickupData.fullAddress,
      pickup_street_address: pickupData.streetNumber ?? "",
      pickup_latitude: pickupData.latitude ?? 0,
      pickup_longitude: pickupData.longitude ?? 0,
      pickup_datetime: pickupDate.toISOString(),
      delivery_name: deliveryData.name,
      delivery_phone: deliveryData.phoneNumber,
      delivery_email: deliveryData.email,
      delivery_address: deliveryData.fullAddress,
      delivery_street_address: deliveryData.streetNumber ?? "",
      delivery_latitude: deliveryData.latitude ?? 0,
      delivery_longitude: deliveryData.longitude ?? 0,
      job_delivery_datetime: deliveryDate,
      specialInstructions: packageData.instructions,
    };

    try {
      const response = (await createDelivery({
        data: payload,
        image:
          packageData.paymentMethod === "bank" && bankImageUri
            ? {
                uri: bankImageUri,
                type: "image/jpeg",
                name: `payment-${Date.now()}.jpg`,
              }
            : undefined,
      }).unwrap()) as TrackingResponseData;

      const orderId = response?.data?.order_id ?? response?.data?.id ?? null;
      setCreatedOrderId(orderId);
      toast.success("Delivery created successfully");
      setShowConfirmed(true);
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to create delivery. Please try again.";
      Alert.alert("Request Failed", message);
    }
  };

  const handleTrackShipment = () => {
    if (!createdOrderId) {
      Alert.alert("Missing Order", "No created order id was found.");
      return;
    }

    setShowConfirmed(false);
    router.push({
      pathname: "/(tabs)/tracking",
      params: { ordersId: createdOrderId },
    });

    clearAllState();
  };

  const clearAllState = () => {
    setCurrentStep(1);
    setShowConfirmed(false);
    setPickupData({
      fullName: "",
      phoneNumber: "",
      email: "",
      fullAddress: "",
      streetNumber: "",
    });
    setDeliveryData({
      name: "",
      phoneNumber: "",
      email: "",
      fullAddress: "",
      streetNumber: "",
    });
    setSelectedRide(null);
    setSelectedRideFareOptionById({});
    setPackageData({
      description: "",
      instructions: "",
      quantity: 1,
      weight: 0,
      paymentMethod: null,
    });
    setBankImageUri(null);
    setIsAgreedToProhibited(false);
    setCreatedOrderId(null);
    setStep("pickup");
  };

  const handleBackToHome = () => {
    clearAllState();
    router.push("/(tabs)/home");
  };

  const getShipmentSummary = () => ({
    pickupFrom: {
      label: "PICKUP FROM",
      address:
        [pickupData.streetNumber, pickupData.fullAddress]
          .filter(Boolean)
          .join(", ") || "123 Main St, Paramaribo",
      details: pickupData.phoneNumber || "+597 xx-xxxx",
    },
    deliverTo: {
      label: "DELIVER TO",
      name: deliveryData.name || "Jane Doe",
      address:
        [deliveryData.streetNumber, deliveryData.fullAddress]
          .filter(Boolean)
          .join(", ") || "456 Delivery St, Nickerie",
      details: deliveryData.phoneNumber || "+597 xx-xxxx",
    },
    parcelDetails: {
      label: "PARCEL DETAILS",
      description: packageData.description || "Electronics & Documents",
      weight: `Weight: ${packageData.weight} kg`,
    },
  });

  const renderStepContent = () => {
    switch (step) {
      case "pickup":
        return (
          <PickupDetails
            title={createDeliveryData.pickupDetails.title}
            subtitle={createDeliveryData.pickupDetails.subtitle}
            data={pickupData}
            onDataChange={setPickupData}
            onNext={handlePickupNext}
          />
        );
      case "delivery":
        return (
          <DeliveryDetails
            title={createDeliveryData.deliveryDetails.title}
            subtitle={createDeliveryData.deliveryDetails.subtitle}
            data={deliveryData}
            onDataChange={setDeliveryData}
            onNext={handleDeliveryNext}
          />
        );
      case "ride":
        return (
          <ChooseRide
            isLoading={isCreatingDelivery || isLoadingPrice}
            rideOptions={rideOptionsForDisplay as any}
            selectedRide={selectedRide}
            selectedFareOptionId={
              selectedRide
                ? (selectedRideFareOptionById[selectedRide] ?? null)
                : null
            }
            onSelectRide={handleSelectRide}
            onSelectFareOption={handleSelectFareOption}
            onNext={handleRideNext}
          />
        );
      case "package":
        return (
          <PackageDetails
            title={createDeliveryData.packageDetails.title}
            subtitle={createDeliveryData.packageDetails.subtitle}
            data={packageData}
            onDataChange={setPackageData}
            onNext={handlePackageNext}
          />
        );
      case "payment":
        if (packageData.paymentMethod === "bank") {
          return (
            <BankTransfer
              bankDetails={createDeliveryData.bankTransfer.bankDetails}
              screenshotUri={bankImageUri}
              onScreenshotChange={setBankImageUri}
              isSubmitting={isCreatingDelivery}
              onConfirm={handleConfirmBooking}
              isAgreedToProhibited={isAgreedToProhibited}
              setIsAgreedToProhibited={setIsAgreedToProhibited}
              amount={estimatedPriceData?.total_price ?? 0}
              distance={estimatedPriceData?.distance_km ?? "0"}
            />
          );
        }

        return (
          <CashOnDelivery
            amount={estimatedPriceData?.total_price ?? 0}
            shipmentSummary={getShipmentSummary()}
            pricingDetails={createDeliveryData.pricingDetails}
            isSubmitting={isCreatingDelivery}
            onConfirm={handleConfirmBooking}
            isAgreedToProhibited={isAgreedToProhibited}
            setIsAgreedToProhibited={setIsAgreedToProhibited}
            distance={estimatedPriceData?.distance_km ?? "0"}
          />
        );
      default:
        return null;
    }
  };

  const showStepIndicator = step !== "payment";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
        <View style={styles.container}>
          <DeliveryHeader title={getHeaderTitle()} onBackPress={handleBack} />

          {showStepIndicator && (
            <StepIndicator
              steps={createDeliveryData.steps}
              currentStep={currentStep}
            />
          )}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {renderStepContent()}
          </ScrollView>
        </View>

        <Modal
          transparent
          visible={alertVisible}
          animationType="fade"
          onRequestClose={() => setAlertVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{alertTitle}</Text>

              <Text style={styles.modalMessage}>{alertMessage}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setAlertVisible(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <BookingConfirmed
          visible={showConfirmed}
          title={createDeliveryData.bookingConfirmed.title}
          subtitle={createDeliveryData.bookingConfirmed.subtitle}
          onTrackShipment={handleTrackShipment}
          onBackToHome={handleBackToHome}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },

  modalMessage: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
    lineHeight: 22,
  },

  modalButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
