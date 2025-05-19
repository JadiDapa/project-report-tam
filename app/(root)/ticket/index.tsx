import { FlatList, SafeAreaView, StatusBar } from "react-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "@/components/tabs/home/SearchInput";
import StackScreenHeader from "@/components/StackScreenHeader";
import { getAllTickets } from "@/lib/network/ticket";
import TicketCard from "@/components/ticket/TicketCard";

export default function Ticket() {
  const [reportQuery, setProjectQuery] = useState("");

  const { data: ticket } = useQuery({
    queryFn: () => getAllTickets(),
    queryKey: ["ticket"],
  });

  if (!ticket) return null;

  return (
    <SafeAreaView className="relative flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />

      <StackScreenHeader title="Ticket Center" />

      <SearchInput query={reportQuery} setQuery={setProjectQuery} />

      <FlatList
        data={ticket}
        keyExtractor={(report) => report.id.toString()}
        renderItem={({ item }) => <TicketCard ticket={item} />}
      />
    </SafeAreaView>
  );
}
