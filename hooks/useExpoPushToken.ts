import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

const EXPO_PROJECT_ID = "70b2058a-57ed-472f-9373-deef7800c66a";

export function useExpoPushToken() {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    const getPushToken = async () => {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          toast.info(
            "Notifications permission not granted. You can enable it later in settings.",
          );
          return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: EXPO_PROJECT_ID,
        });
        setExpoPushToken(tokenData.data);
      } catch (error) {
        console.log("Failed to get push token:", error);
        toast.info(
          "Could not set up notifications. You can enable it later in settings.",
        );
      }
    };

    getPushToken();
  }, []);

  return expoPushToken;
}
