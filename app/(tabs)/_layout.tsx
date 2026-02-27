import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { COLORS } from "../../constants/colors";

const getTabIconName = (routeName: string): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case "home":
      return "home-outline";
    case "tracking":
      return "location-outline";
    case "shipment":
      return "cube-outline";
    case "profile":
      return "person-outline";
    default:
      return "ellipse-outline";
  }
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={getTabIconName(route.name)}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="tracking" options={{ title: "Tracking" }} />
      <Tabs.Screen name="shipment" options={{ title: "Shipment" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
