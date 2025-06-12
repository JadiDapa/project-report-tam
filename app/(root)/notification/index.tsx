import { FlatList, SafeAreaView, StatusBar, Text, View } from "react-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/tabs/home/SearchInput";
import StackScreenHeader from "@/components/StackScreenHeader";
import { getAllTickets } from "@/lib/network/ticket";
import TicketCard from "@/components/ticket/TicketCard";
import { getNotificationsByAccountId } from "@/lib/network/notification";
import { useAccount } from "@/contexts/AccountContexts";
import NotificationCard from "@/components/notification/NotificationCard";
import TypeSelect from "@/components/notification/TypeSelect";

export default function Notification() {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { account } = useAccount();

  const { data: notifications } = useQuery({
    queryFn: () => getNotificationsByAccountId(account!.id.toString()),
    queryKey: ["notifications", account!.id],
    enabled: !!account,
  });

  if (!notifications) return null;

  return (
    <SafeAreaView className="relative flex-1 bg-white">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Notifications" />
      <View>
        <TypeSelect
          status={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        <View className="flex-row justify-between px-6 mt-4">
          <Text className="text-sm font-cereal-medium text-primary-500">
            Mark all as Read
          </Text>
          <Text className="text-sm text-red-500 font-cereal-medium">Clear</Text>
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(report) => report.id.toString()}
        renderItem={({ item }) => <NotificationCard notification={item} />}
      />
    </SafeAreaView>
  );
}
