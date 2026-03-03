import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

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
          backgroundColor: "#1A3A4A",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 80 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 12,
          paddingTop: 8,

          paddingHorizontal: 10,
          marginHorizontal: 16,
          marginBottom: Platform.OS === "ios" ? 0 : 10,
          borderRadius: 30,
          position: "absolute",
          bottom: Platform.OS === "ios" ? 20 : 10,
          left: 0,
          right: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#7A9BAD",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={getTabIconName(route.name, focused)}
            size={24}
            color={color}
          />
        ),
        sceneStyle: {
          paddingBottom: Platform.OS === "ios" ? 110 : 90,
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="tracking" options={{ title: "Track" }} />
      <Tabs.Screen name="shipment" options={{ title: "Shipment" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
