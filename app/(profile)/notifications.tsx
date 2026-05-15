import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "@/redux/api/notificationApi";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // 1. Import Navigation
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* =========================
   TIME AGO HELPER
========================= */
const getTimeAgo = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 52) return `${weeks}w`;
  return `${years}y`;
};

const Notifications = () => {
  const navigation = useNavigation(); // 2. Initialize Navigation
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery({
    page,
    limit,
  });

  const [markAllRead, { isLoading: marking }] =
    useMarkAllNotificationsReadMutation();

  const notifications = data?.data?.data || [];

  const handleLoadMore = () => {
    if (!isFetching && notifications.length >= page * limit) {
      setPage((prev) => prev + 1);
    }
  };

  const handleRefresh = async () => {
    setPage(1);
    await refetch();
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
      refetch();
    } catch (err) {
      console.log("Mark all read error:", err);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-2">
      {/* HEADER WITH BACK BUTTON */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-3 p-1 -ml-1 active:opacity-50">
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </Pressable>
          <Text className="text-2xl font-bold text-gray-900">
            Notifications
          </Text>
        </View>

        <Pressable
          onPress={handleMarkAllRead}
          disabled={marking}
          className="px-4 py-2 bg-gray-900 rounded-full active:opacity-70">
          <Text className="text-white font-medium text-sm">
            {marking ? "Updating..." : "Mark all read"}
          </Text>
        </Pressable>
      </View>

      {/* EMPTY STATE */}
      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-base">No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isLoading}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            isFetching ? <ActivityIndicator className="my-4" /> : null
          }
          renderItem={({ item }) => (
            <View className="mb-3 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
              <Text
                className={`text-base font-semibold ${
                  item.isRead ? "text-gray-500" : "text-gray-900"
                }`}>
                {item.title}
              </Text>

              <Text className="text-gray-500 mt-1 leading-5">
                {item.message}
              </Text>

              <Text className="text-xs text-gray-400 mt-3">
                {getTimeAgo(item.createdAt)} ago
              </Text>

              {!item.isRead && (
                <View className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Notifications;
