import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrentShipment from "../../components/ui/home/CurrentShipment";
import DeliveryCard from "../../components/ui/home/DeliveryCard";
import HeaderSection from "../../components/ui/home/HeaderSection";
import ServiceCard from "../../components/ui/home/ServiceCard";
import ShipmentItem from "../../components/ui/home/ShipmentItem";
import homeData from "../../constants/homeData.json";

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
              icon={service.icon}
              color={service.color}
              onPress={() => console.log(`Pressed ${service.title}`)}
            />
          ))}
        </View>

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

        {/* Shipment Items */}
        {homeData.shipments.map((shipment) => (
          <ShipmentItem
            key={shipment.id}
            id={shipment.id}
            date={shipment.date}
            destination={shipment.destination}
            onPress={() => router.push("/(tabs)/tracking")}
          />
        ))}

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
  },
  serviceCardsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
