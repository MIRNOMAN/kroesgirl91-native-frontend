import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const FilterTabs = ({
  tabs,
  activeTab,
  onTabChange,
}: FilterTabsProps) => {
  return (
    <View style={styles.filterContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Pressable
            key={tab}
            style={[styles.filterTab, isActive && styles.filterTabActive]}
            onPress={() => onTabChange(tab)}
          >
            <Text
              style={[styles.filterText, isActive && styles.filterTextActive]}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom:30,
    marginTop: 10,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: width > 400 ? 16 : 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  filterTabActive: {
    backgroundColor: "#1A3A4A",
  },
  filterText: {
    fontSize: width > 400 ? 14 : 13,
    fontWeight: "500",
    color: "#666",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
});
