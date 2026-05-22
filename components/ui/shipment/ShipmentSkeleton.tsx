import { StyleSheet, View } from "react-native";

const skeletonRows = Array.from({ length: 5 });

export const ShipmentSkeleton = () => {
  return (
    <View style={styles.container}>
      {skeletonRows.map((_, index) => (
        <View key={index} style={styles.card}>
          {/* TOP ROW */}
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
              <View style={[styles.line, styles.chip]} />
            </View>
          </View>

          {/* ROUTE */}
          <View style={styles.bottomRow}>
            <View style={styles.routeRow}>
              {/* LEFT DOTS */}
              <View style={styles.routeIconCol}>
                <View style={styles.dot} />
                <View style={styles.lineVertical} />
                <View style={styles.dot} />
              </View>

              {/* RIGHT TEXT */}
              <View style={styles.routeTextBlock}>
                <View style={[styles.line, styles.routeLine]} />
                <View style={[styles.line, styles.routeLineMd]} />

                <View style={{ marginTop: 14 }}>
                  <View style={[styles.line, styles.routeLine]} />
                  <View style={[styles.line, styles.routeLineMd]} />
                </View>
              </View>
            </View>
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

  chip: {
    width: 55,
    height: 18,
    borderRadius: 20,
  },

  bottomRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  routeRow: {
    flexDirection: "row",
  },

  routeIconCol: {
    alignItems: "center",
    marginRight: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#ECECEC",
  },

  lineVertical: {
    width: 1.5,
    flex: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 4,
  },

  routeTextBlock: {
    flex: 1,
    gap: 8,
  },

  routeLine: {
    width: "40%",
    height: 12,
  },

  routeLineMd: {
    width: "70%",
    height: 12,
  },
});
