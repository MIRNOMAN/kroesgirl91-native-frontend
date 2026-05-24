import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "@/redux/api/notificationApi";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
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
  const navigation = useNavigation();

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [allNotifications, setAllNotifications] = React.useState<any[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery({
    page,
    limit,
  });

  const [markAllRead, { isLoading: marking }] =
    useMarkAllNotificationsReadMutation();

  /* =========================
     MERGE PAGINATED DATA
  ========================= */
  React.useEffect(() => {
    const newData = data?.data?.data || [];

    if (page === 1) {
      setAllNotifications(newData);
    } else {
      setAllNotifications((prev) => [...prev, ...newData]);
    }

    // if returned data is less than limit → no more pages
    if (newData.length < limit) {
      setHasMore(false);
    }

    if (page === 1 && isRefreshing) {
      setIsRefreshing(false);
    }
  }, [data, isRefreshing, limit, page]);

  /* =========================
     LOAD MORE
  ========================= */
  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  /* =========================
     REFRESH
  ========================= */
  const handleRefresh = async () => {
    setHasMore(true);
    setIsRefreshing(true);
    setPage(1);
    setAllNotifications([]);
    await refetch();
  };

  /* =========================
     MARK ALL READ
  ========================= */
  const handleMarkAllRead = async () => {
    try {
      setAllNotifications([]);
      await markAllRead().unwrap();
      await handleRefresh();
    } catch (err) {
      console.log("Mark all read error:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-2">
      {/* HEADER */}
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
          disabled={marking || isRefreshing}
          className="px-4 py-2 bg-gray-900 rounded-full active:opacity-70">
          <Text className="text-white font-medium text-sm">
            {marking ? "Updating..." : "Mark all read"}
          </Text>
        </Pressable>
      </View>

      {/* CONTENT */}
      {isLoading || isRefreshing || marking ? (
        <View className="flex-1">
          <NotificationsSkeletonRows count={6} />
        </View>
      ) : allNotifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-base">No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={allNotifications}
          keyExtractor={(item, i) => item.id.toString() + i}
          refreshing={isLoading}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            isFetching && hasMore ? (
              <NotificationsSkeletonRows count={10} />
            ) : !hasMore ? (
              <View className="items-center py-6">
                <Text className="text-gray-400 text-sm">
                  You’re all caught up.
                </Text>
              </View>
            ) : null
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

const NotificationsSkeletonRows = ({ count }: { count: number }) => {
  return (
    <View className="gap-3 py-2">
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-4">
          <View className="flex-row items-start gap-3">
            <View className="h-3 w-3 rounded-full bg-gray-200 mt-1" />

            <View className="flex-1 gap-3">
              <View className="h-4 w-3/4 rounded-full bg-gray-200" />
              <View className="h-3 w-full rounded-full bg-gray-200" />
              <View className="h-3 w-2/3 rounded-full bg-gray-200" />
              <View className="h-3 w-24 rounded-full bg-gray-200" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
