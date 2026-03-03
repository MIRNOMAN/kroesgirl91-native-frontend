import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  fullAddress: string;
  latitude?: number;
  longitude?: number;
}

interface DeliveryData {
  name: string;
  phoneNumber: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
}

interface PackageData {
  description: string;
  instructions: string;
  weight: number;
  paymentMethod: "cash" | "bank" | null;
}

export default function CreateDeliveryScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [step, setStep] = useState<Step>("pickup");
  const [showConfirmed, setShowConfirmed] = useState(false);

  // Form Data States
  const [pickupData, setPickupData] = useState<PickupData>({
    fullName: "",
    phoneNumber: "",
    fullAddress: "",
  });

  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    name: "",
    phoneNumber: "",
    fullAddress: "",
  });

  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  const [packageData, setPackageData] = useState<PackageData>({
    description: "",
    instructions: "",
    weight: 0,
    paymentMethod: null,
  });

  const getHeaderTitle = (): string => {
    switch (step) {
      case "pickup":
      case "delivery":
      case "package":
        return "Create Delivery";
      case "ride":
        return "Choose a ride";
      case "payment":
        return packageData.paymentMethod === "bank"
          ? "Bank transfer"
          : "Cash on delivery";
      default:
        return "Create Delivery";
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
    setStep("delivery");
    setCurrentStep(2);
  };

  const handleDeliveryNext = () => {
    setStep("ride");
    setCurrentStep(3);
  };

  const handleRideNext = () => {
    setStep("package");
    setCurrentStep(4);
  };

  const handlePackageNext = () => {
    setStep("payment");
  };

  const handleConfirmBooking = () => {
    setShowConfirmed(true);
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
            rideOptions={createDeliveryData.rideOptions}
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
              onConfirm={handleConfirmBooking}
            />
          );
        }
        return (
          <CashOnDelivery
            amount={50}
            shipmentSummary={getShipmentSummary()}
            pricingDetails={createDeliveryData.pricingDetails}
            onConfirm={handleConfirmBooking}
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
