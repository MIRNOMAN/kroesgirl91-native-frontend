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
import ShipmentItem from "../../components/ui/home/ShipmentItem";
import homeData from "../../constants/homeData.json";

import backround1 from "../../assets/backround/backround_1.png";
import backround2 from "../../assets/backround/backround_2.png";
import backround from "../../assets/backround/Photoroom.png";
import redDeliveryIcon from "../../assets/Custom_icons/red-delivery.png";
import storeIcon from "../../assets/Custom_icons/store-icon.png";

const SERVICE_IMAGES = {
  "store-icon": storeIcon,
  "red-delivery": redDeliveryIcon,
} as const;

const BACKGROUND_IMAGES = {
  backround_1: backround1,
  backround_2: backround2,
} as const;

export default function HomeScreen() {
  const router = useRouter();
  const hasCurrentShipments =
    homeData.currentShipments && homeData.currentShipments.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <HeaderSection
          greeting={homeData.user.greeting}
          name={homeData.user.name}
          avatar={homeData.user.avatar}
        />

        {/* New Delivery Card */}
        <DeliveryCard
          title={homeData.newDelivery.title}
          subtitle={homeData.newDelivery.subtitle}
          onPress={() => router.push("/(tabs)/shipment")}
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
              onPress={() => console.log(`Pressed ${service.title}`)}
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
              recipientName={homeData.currentShipments[0].recipientName}
              recipientAvatar={homeData.currentShipments[0].recipientAvatar}
              trackingId={homeData.currentShipments[0].trackingId}
              status={homeData.currentShipments[0].status}
              statuses={homeData.currentShipments[0].statuses}
              startDate={homeData.currentShipments[0].startDate}
              startLocation={homeData.currentShipments[0].startLocation}
              endDate={homeData.currentShipments[0].endDate}
              endLocation={homeData.currentShipments[0].endLocation}
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
          {homeData.shipments.map((shipment) => (
            <ShipmentItem
              key={shipment.id}
              id={shipment.id}
              name={shipment.name}
              avatar={shipment.avatar}
              status={shipment.status}
              onPress={() => router.push("/(tabs)/tracking")}
            />
          ))}
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
