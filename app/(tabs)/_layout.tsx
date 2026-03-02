import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const getTabIconName = (
  routeName: string,
  focused: boolean,
): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case "home":
      return focused ? "home" : "home-outline";
    case "tracking":
      return focused ? "location" : "location-outline";
    case "shipment":
      return focused ? "cube" : "cube-outline";
    case "profile":
      return focused ? "person" : "person-outline";
    default:
      return "ellipse-outline";
  }
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A3A52",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#8FACBD",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={getTabIconName(route.name, focused)}
            size={24}
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
