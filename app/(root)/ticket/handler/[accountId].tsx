import { FlatList, SafeAreaView, StatusBar } from "react-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/tabs/home/SearchInput";
import StackScreenHeader from "@/components/StackScreenHeader";
import { useLocalSearchParams } from "expo-router";
import { getTicketsByHandlerId } from "@/lib/network/ticket";
import HandlerTicketCard from "@/components/ticket/HandlerTicketCard";

export default function UserTickets() {
  const [reportQuery, setProjectQuery] = useState("");
  const { accountId } = useLocalSearchParams();

  const { data: tickets } = useQuery({
    queryFn: () => getTicketsByHandlerId(accountId.toString()),
    queryKey: ["tickets", accountId],
  });

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="Assigned Tickets" />

      <SearchInput query={reportQuery} setQuery={setProjectQuery} />

      <FlatList
        data={tickets}
        keyExtractor={(report) => report.id.toString()}
        renderItem={({ item }) => <HandlerTicketCard ticket={item} />}
      />
    </SafeAreaView>
  );
}
