import { StyleSheet, View } from "react-native";

const skeletonRows = Array.from({ length: 5 });

export const ShipmentSkeleton = () => {
  return (
    <View style={styles.container}>
      {skeletonRows.map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.iconBlock} />
            <View style={styles.textBlock}>
              <View style={[styles.line, styles.lineLg]} />
              <View style={[styles.line, styles.lineMd]} />
              <View style={[styles.line, styles.badge]} />
            </View>
            <View style={styles.priceBlock}>
              <View style={[styles.line, styles.lineSm]} />
              <View style={[styles.line, styles.lineXs]} />
            </View>
          </View>
          <View style={styles.bottomRow}>
            <View style={[styles.line, styles.route]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconBlock: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ECECEC",
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
    gap: 8,
  },
  priceBlock: {
    alignItems: "flex-end",
    gap: 8,
    marginLeft: 10,
  },
  line: {
    borderRadius: 8,
    backgroundColor: "#ECECEC",
    height: 10,
  },
  lineLg: {
    width: 130,
    height: 12,
  },
  lineMd: {
    width: 90,
  },
  lineSm: {
    width: 70,
    height: 12,
  },
  lineXs: {
    width: 46,
  },
  badge: {
    width: 68,
    height: 22,
    borderRadius: 12,
  },
  bottomRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  route: {
    width: "75%",
  },
});
