import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
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
import { useCreateDeliveryMutation } from "../../redux/api/createDelivery";

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
  latitude?: number;
  longitude?: number;
}

interface DeliveryData {
  name: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
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

interface CreateOrderPayload {
  job_description: string;
  price: number;
  quantity: number;
  weight: number;
  paymentMethod: "COD" | "BANK";
  isAgreedToTerms: boolean;
  pickup_name: string;
  pickup_phone: string;
  pickup_email: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_datetime: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_email: string;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  job_delivery_datetime: string;
  specialInstructions: string;
}

type FormLocationData = PickupData | DeliveryData;

export default function CreateDeliveryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [step, setStep] = useState<Step>("pickup");
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [bankImageUri, setBankImageUri] = useState<string | null>(null);
  // Prohibited items agreement state
  const [isAgreedToProhibited, setIsAgreedToProhibited] = useState(false);

  const [createDelivery, { isLoading: isCreatingDelivery }] =
    useCreateDeliveryMutation();

  // Form Data States
  const [pickupData, setPickupData] = useState<PickupData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    fullAddress: "",
  });

  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    name: "",
    phoneNumber: "",
    email: "",
    fullAddress: "",
  });

  const [selectedRide, setSelectedRide] = useState<string | null>(null);

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

  const selectedRideOption = useMemo(
    () =>
      createDeliveryData.rideOptions.find(
        (option) => option.id === selectedRide,
      ),
    [selectedRide],
  );

  const formatRideDate = (date: Date, includeTime: boolean = false): string => {
    const dateStr = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (includeTime) {
      const timeStr = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return `${dateStr} ${timeStr}`;
    }

    return dateStr;
  };

  const rideOptionsWithDynamicDates = (() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Add 10 minutes to same-day delivery
    const sameDayWithBuffer = new Date(today);
    sameDayWithBuffer.setMinutes(sameDayWithBuffer.getMinutes() + 10);

    return createDeliveryData.rideOptions.map((option) => {
      if (option.id === "same-day") {
        return {
          ...option,
          subtitle: `Date: ${formatRideDate(sameDayWithBuffer, true)}`,
        };
      }

      if (option.id === "next-day") {
        return {
          ...option,
          subtitle: `Date: ${formatRideDate(tomorrow)}`,
        };
      }

      return option;
    });
  })();

  const getJobDeliveryDateTime = (): string => {
    // Capture the exact current moment in time
    const now = new Date();

    if (selectedRide === "same-day") {
      // For same-day delivery, apply a 10-minute buffer from current time
      now.setMinutes(now.getMinutes() + 10);
    }

    if (selectedRide === "next-day") {
      // For next-day delivery, increment date but keep the current time
      now.setDate(now.getDate() + 1);
    }

    // Convert to ISO 8601 format (UTC timezone) - this is the accurate moment of booking
    return now.toISOString();
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
      !pickupData.email.trim() ||
      !pickupData.fullAddress.trim()
    ) {
      Alert.alert("Required", "Please complete pickup details before next.");
      return;
    }

    setStep("delivery");
    setCurrentStep(2);
  };

  const handleDeliveryNext = () => {
    if (
      !deliveryData.name.trim() ||
      !deliveryData.phoneNumber.trim() ||
      !deliveryData.email.trim() ||
      !deliveryData.fullAddress.trim()
    ) {
      Alert.alert("Required", "Please complete delivery details before next.");
      return;
    }

    setStep("ride");
    setCurrentStep(3);
  };

  const handleRideNext = () => {
    if (!selectedRide) {
      Alert.alert("Required", "Please select a ride option.");
      return;
    }

    setStep("package");
    setCurrentStep(4);
  };

  const handlePackageNext = () => {
    if (!packageData.description.trim()) {
      Alert.alert("Required", "Please enter package description.");
      return;
    }

    if (packageData.weight <= 0) {
      Alert.alert("Required", "Package weight should be greater than 0.");
      return;
    }

    if (packageData.quantity <= 0) {
      Alert.alert("Required", "Quantity should be greater than 0.");
      return;
    }

    if (!packageData.paymentMethod) {
      Alert.alert("Required", "Please select a payment method.");
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

  const askLocationPermissionConfirmation = async () => {
    return new Promise<boolean>((resolve) => {
      Alert.alert(
        "Location Required",
        "User location not found. Allow current location to auto-fill latitude, longitude, and address?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Allow Location",
            onPress: () => resolve(true),
          },
        ],
        {
          cancelable: true,
          onDismiss: () => resolve(false),
        },
      );
    });
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

  const resolveCurrentLocation = async (): Promise<
    Pick<FormLocationData, "fullAddress" | "latitude" | "longitude">
  > => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    let fullAddress = "";
    try {
      const reverse = await Location.reverseGeocodeAsync({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      fullAddress = formatAddress(reverse[0]);
    } catch {
      fullAddress = "";
    }

    return {
      fullAddress,
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
    };
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
      const shouldProceed = await askLocationPermissionConfirmation();
      if (!shouldProceed) {
        return;
      }

      try {
        const currentLocation = await resolveCurrentLocation();
        bookingLocationData = {
          ...sourceData,
          fullAddress:
            sourceData.fullAddress ||
            currentLocation.fullAddress ||
            `${currentLocation.latitude}, ${currentLocation.longitude}`,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        };

        setPickupData((prev) => ({
          ...prev,
          fullAddress: bookingLocationData.fullAddress,
          latitude: bookingLocationData.latitude,
          longitude: bookingLocationData.longitude,
        }));
      } catch (error) {
        const isPermissionDenied =
          (error as Error)?.message === "LOCATION_PERMISSION_DENIED";
        Alert.alert(
          "Location Missing",
          isPermissionDenied
            ? "Location permission is required to continue booking."
            : "Unable to fetch current location. Please try again.",
        );
        return;
      }
    }

    const payload: CreateOrderPayload = {
      job_description: packageData.description,
      price:
        selectedRideOption?.price ??
        createDeliveryData.pricingDetails.deliveryFee +
          createDeliveryData.pricingDetails.serviceFee,
      quantity: packageData.quantity,
      weight: packageData.weight,
      paymentMethod: packageData.paymentMethod === "bank" ? "BANK" : "COD",
      isAgreedToTerms: isAgreedToProhibited,
      pickup_name: pickupData.fullName,
      pickup_phone: pickupData.phoneNumber,
      pickup_email: pickupData.email,
      pickup_address: pickupData.fullAddress,
      pickup_latitude: pickupData.latitude ?? 0,
      pickup_longitude: pickupData.longitude ?? 0,
      pickup_datetime: new Date().toISOString(),
      delivery_name: deliveryData.name,
      delivery_phone: deliveryData.phoneNumber,
      delivery_email: deliveryData.email,
      delivery_address: deliveryData.fullAddress,
      delivery_latitude: deliveryData.latitude ?? 0,
      delivery_longitude: deliveryData.longitude ?? 0,
      job_delivery_datetime: getJobDeliveryDateTime(),
      specialInstructions: packageData.instructions,
    };

    console.log(payload);

    try {
      const response = await createDelivery({
        data: payload,
        image:
          packageData.paymentMethod === "bank" && bankImageUri
            ? {
                uri: bankImageUri,
                type: "image/jpeg",
                name: `payment-${Date.now()}.jpg`,
              }
            : undefined,
      }).unwrap();
      console.log(response);
      toast.success(response?.message || "Delivery created successfully");
      setShowConfirmed(true);
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to create delivery. Please try again.";
      Alert.alert("Request Failed", message);
    }
  };

  const handleTrackShipment = () => {
    setShowConfirmed(false);
    router.push("/(tabs)/tracking");
  };

  const handleBackToHome = () => {
    setShowConfirmed(false);
    router.push("/(tabs)/home");
  };

  const getShipmentSummary = () => ({
    pickupFrom: {
      label: "PICKUP FROM",
      address: pickupData.fullAddress || "123 Main St, Paramaribo",
      details: pickupData.phoneNumber || "+597 xx-xxxx",
    },
    deliverTo: {
      label: "DELIVER TO",
      name: deliveryData.name || "Jane Doe",
      address: deliveryData.fullAddress || "456 Delivery St, Nickerie",
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
            rideOptions={rideOptionsWithDynamicDates}
            selectedRide={selectedRide}
            onSelectRide={setSelectedRide}
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
            />
          );
        }
        return (
          <CashOnDelivery
            amount={
              selectedRideOption?.price ??
              createDeliveryData.pricingDetails.deliveryFee +
                createDeliveryData.pricingDetails.serviceFee
            }
            shipmentSummary={getShipmentSummary()}
            pricingDetails={createDeliveryData.pricingDetails}
            isSubmitting={isCreatingDelivery}
            onConfirm={handleConfirmBooking}
            isAgreedToProhibited={isAgreedToProhibited}
            setIsAgreedToProhibited={setIsAgreedToProhibited}
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.container}>
          {/* Header */}
          <DeliveryHeader title={getHeaderTitle()} onBackPress={handleBack} />

          {/* Step Indicator */}
          {showStepIndicator && (
            <StepIndicator
              steps={createDeliveryData.steps}
              currentStep={currentStep}
            />
          )}

          {/* Step Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderStepContent()}
          </ScrollView>
        </View>

        {/* Booking Confirmed Modal */}
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
});
