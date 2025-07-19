import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/tabs/home/SearchInput";
import StackScreenHeader from "@/components/StackScreenHeader";
import YourTicketCard from "@/components/ticket/YourTicketCard";
import { router, useLocalSearchParams } from "expo-router";
import { getTicketsByRequesterId } from "@/lib/network/ticket";

export default function UserTickets() {
  const [reportQuery, setProjectQuery] = useState("");
  const { accountId } = useLocalSearchParams();

  const { data: tickets } = useQuery({
    queryFn: () => getTicketsByRequesterId(accountId.toString()),
    queryKey: ["tickets", accountId],
  });

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="Your Tickets" />

      <SearchInput query={reportQuery} setQuery={setProjectQuery} />

      <FlatList
        data={tickets}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyExtractor={(report) => report.id.toString()}
        renderItem={({ item }) => <YourTicketCard ticket={item} />}
      />

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        <Pressable onPress={() => router.push("/ticket/create")}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            Create Ticket
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
