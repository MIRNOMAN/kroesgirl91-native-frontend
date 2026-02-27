import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/colors";

type AuthTitleBlockProps = {
  title: string;
  subtitle: string;
};

export default function AuthTitleBlock({
  title,
  subtitle,
}: AuthTitleBlockProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 320,
  },
});
