import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
    >
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 10,
    gap: 8,
  },
  filterTab: {
    height: 38,
    paddingHorizontal: width > 400 ? 14 : 12,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  filterTabActive: {
    backgroundColor: "#1A3A4A",
  },
  filterText: {
    fontSize: width > 400 ? 13 : 12,
    fontWeight: "500",
    color: "#666",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
});
