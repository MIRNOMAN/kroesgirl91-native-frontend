import { Platform } from "react-native";

type MetaWhatsAppEventPayload = {
  event: "business_bulk_whatsapp_click";
  phone: string;
  message: string;
  sourceScreen: string;
  platform: string;
  timestamp: string;
};

const META_WHATSAPP_FUNCTION_URL =
  process.env.EXPO_PUBLIC_META_WHATSAPP_FUNCTION_URL;
const META_WHATSAPP_FUNCTION_KEY =
  process.env.EXPO_PUBLIC_META_WHATSAPP_FUNCTION_KEY;

export const triggerMetaWhatsAppEvent = async (params: {
  phone: string;
  message: string;
  sourceScreen: string;
}) => {
  if (!META_WHATSAPP_FUNCTION_URL) {
    return false;
  }

  const payload: MetaWhatsAppEventPayload = {
    event: "business_bulk_whatsapp_click",
    phone: params.phone,
    message: params.message,
    sourceScreen: params.sourceScreen,
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(META_WHATSAPP_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(META_WHATSAPP_FUNCTION_KEY
          ? { Authorization: `Bearer ${META_WHATSAPP_FUNCTION_KEY}` }
          : {}),
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch {
    return false;
  }
};
