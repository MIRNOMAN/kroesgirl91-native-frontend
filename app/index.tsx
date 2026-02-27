import { Text, View } from "react-native";
import '../global.css';
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-blue-800">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Text className="text-red-800">
        This is a blank screen. You can add any content you like here.
      </Text>
    </View>
  );
}
