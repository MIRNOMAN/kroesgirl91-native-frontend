import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DeliveryStatusCard,
  DriverArrivedCard,
  TrackingMapView,
  TripSuccessModal,
} from "../../components/ui/tracking";
import { APP_ROUTES } from "../../constants/routes";
import trackingData from "../../constants/trackingData.json";

const { height } = Dimensions.get("window");
const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 110 : 0;

type TrackingView = "map" | "pickup" | "driverArrived";

export default function TrackingScreen() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<TrackingView>("map");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Extract data from JSON
  const {
    mapConfig,
    markers,
    riders,
    deliveryStatus,
    driverArrived,
    tripSuccess,
    searchPlaceholder,
    buttonTexts,
  } = trackingData;

  // Handle back navigation
  const handleBackPress = useCallback(() => {
    if (currentView === "map") {
      router.back();
    } else if (currentView === "pickup") {
      setCurrentView("map");
    } else if (currentView === "driverArrived") {
      setCurrentView("pickup");
    }
  }, [currentView, router]);

  // Handle rider press on map - show delivery details
  const handleRiderPress = useCallback((rider: any) => {
    console.log("Rider selected:", rider.name);
    setCurrentView("pickup");
  }, []);

  // Handle Choose Premier button - show Driver Arrived
  const handleChoosePremier = useCallback(() => {
    setCurrentView("driverArrived");
  }, []);

  // Handle Call Driver
  const handleCallDriver = useCallback(() => {
    console.log("Calling driver:", deliveryStatus.driver.phone);
  }, [deliveryStatus.driver.phone]);

  // Handle Message Driver - show success modal
  const handleMessageDriver = useCallback(() => {
    setShowSuccessModal(true);
  }, []);

  // Handle Close button on Driver Arrived screen
  const handleClose = useCallback(() => {
    setCurrentView("map");
  }, []);

  // Handle Go to Home
  const handleGoHome = useCallback(() => {
    setShowSuccessModal(false);
    setCurrentView("map");
    router.push(APP_ROUTES.home);
  }, [router]);

  // Render current view
  const renderContent = () => {
    switch (currentView) {
      case "map":
        return (
          <View style={styles.container}>
            <TrackingMapView
              mapConfig={mapConfig}
              markers={markers}
              riders={riders}
              searchPlaceholder={searchPlaceholder}
              onBackPress={handleBackPress}
              onRiderPress={handleRiderPress}
              showSearchBar={true}
              showRoute={false}
              showRiders={true}
            />
          </View>
        );

      case "pickup":
        return (
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.mapContainer}>
              <TrackingMapView
                mapConfig={mapConfig}
                markers={markers}
                routeCoordinates={deliveryStatus.routeCoordinates}
                onBackPress={handleBackPress}
                showSearchBar={false}
                showRoute={true}
                showRiders={false}
              />
            </View>
            <DeliveryStatusCard
              driver={deliveryStatus.driver}
              progress={deliveryStatus.progress}
              orderDetails={deliveryStatus.orderDetails}
              paymentMethod={deliveryStatus.paymentMethod}
              onChoosePremier={handleChoosePremier}
              onCallDriver={handleCallDriver}
              buttonText={buttonTexts.choosePremier}
            />
          </ScrollView>
        );

      case "driverArrived":
        return (
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.mapContainerSmall}>
              <TrackingMapView
                mapConfig={mapConfig}
                markers={markers}
                routeCoordinates={deliveryStatus.routeCoordinates}
                onBackPress={handleBackPress}
                showSearchBar={false}
                showRoute={true}
                showRiders={false}
              />
            </View>
            <DriverArrivedCard
              title={driverArrived.title}
              subtitle={driverArrived.subtitle}
              dropoffLocation={driverArrived.dropoffLocation}
              driver={driverArrived.driver}
              vehicle={driverArrived.vehicle}
              onMessageDriver={handleMessageDriver}
              onClose={handleClose}
              messageButtonText={buttonTexts.messageDriver}
              closeButtonText={buttonTexts.close}
            />
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {renderContent()}
      <TripSuccessModal
        visible={showSuccessModal}
        title={tripSuccess.title}
        subtitle={tripSuccess.subtitle}
        buttonText={tripSuccess.buttonText}
        onGoHome={handleGoHome}
        onClose={() => setShowSuccessModal(false)}
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
    marginBottom: TAB_BAR_HEIGHT,
  },
  mapContainer: {
    height: height * 0.4,
  },
  mapContainerSmall: {
    height: height * 0.35,
  },
});
