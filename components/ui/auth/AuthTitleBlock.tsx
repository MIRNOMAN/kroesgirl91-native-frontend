import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/colors";

type AuthTitleBlockProps = {
  title: string;
  subtitle: string;
  titleSize?: number;
  subtitleSize?: number;
  subtitleMaxWidth?: number;
};

export default function AuthTitleBlock({
  title,
  subtitle,
  titleSize = 36,
  subtitleSize = 16,
  subtitleMaxWidth = 320,
}: AuthTitleBlockProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
      <Text
        style={[
          styles.subtitle,
          {
            fontSize: subtitleSize,
            lineHeight: subtitleSize + 6,
            maxWidth: subtitleMaxWidth,
          },
        ]}
      >
        {subtitle}
      </Text>
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
    marginTop: 50,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 320,
    fontWeight: "500",
    lineHeight: 22,
    fontSize: 33,
  },
});
