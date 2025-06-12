import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { NotificationType } from "@/lib/types/notification";
import { format } from "date-fns";

const types = [
  {
    type: "sent",
    color: "#a9a9a9",
  },
  {
    type: "processed",
    color: "#ffaa00",
  },
  {
    type: "completed",
    color: "#00aa00",
  },
];

export default function NotificationCard({
  notification,
}: {
  notification: NotificationType;
}) {
  const router = useRouter();
  const currentStatus = types.find(
    (st) => st.type.toLowerCase() === notification.type?.toLowerCase()
  );

  return (
    <Pressable
      onPress={() => router.push(notification.link as any)}
      className="px-4 py-5 mx-4 mt-4 bg-white border-t border-slate-400 rounded-xl"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-1 rounded-full ">
          <Text className="text-primary-500 font-cereal font-cereal-medium">
            {notification.title}
          </Text>
        </View>

        {currentStatus && (
          <View
            className="w-auto py-0.5 px-2 overflow-hidden text-sm rounded-full"
            style={{ backgroundColor: currentStatus.color }}
          >
            <Text className="text-sm text-center text-white capitalize font-cereal-medium">
              {currentStatus.type}
            </Text>
          </View>
        )}
      </View>

      <Text className="mt-2 text-sm font-cereal-regular text-slate-700 line-clamp-3">
        {notification.description}
      </Text>

      <View className="flex-row mt-1">
        <Text className="text-xs font-cereal-medium text-primary-500">
          {format(notification.createdAt.toString(), "dd MMMM yyyy")}
        </Text>
      </View>
    </Pressable>
  );
}
