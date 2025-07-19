import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { TicketType } from "@/lib/types/ticket";
import { format } from "date-fns";
import { Ticket, User } from "lucide-react-native";

export const ticketStatus = [
  {
    status: "open",
    color: "#a9a9a9",
  },
  {
    status: "processed",
    color: "#ffaa00",
  },
  {
    status: "completed",
    color: "#00aa00",
  },
];

export default function TicketCard({ ticket }: { ticket: TicketType }) {
  const router = useRouter();

  const currentStatus = ticketStatus.find(
    (st) => st.status.toLowerCase() === ticket.status?.toLowerCase()
  );

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/ticket/[id]`,
          params: { id: ticket.id },
        })
      }
      className="p-4 py-5 mx-6 mt-4 bg-white shadow-md rounded-xl"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-1 rounded-full ">
          <Ticket color="#4268ff" size={16} />
          <Text className="text-primary-500 font-cereal">{ticket.code}</Text>
        </View>

        <View
          className="w-32 py-0.5 px-2 overflow-hidden text-sm rounded-full"
          style={{ backgroundColor: currentStatus?.color }}
        >
          <Text className="text-sm text-center text-white capitalize font-cereal-medium">
            {currentStatus?.status}
          </Text>
        </View>
      </View>

      <Text className="mt-2 font-cereal-bold text-slate-700 line-clamp-2">
        {ticket.title}
      </Text>

      <View className="flex-row items-center justify-between gap-1 mt-2">
        <View className="flex flex-row items-center gap-1 rounded-full ">
          <User color="#414141" size={16} />
          <Text className="text-slate-600 font-cereal-medium">
            {ticket.Requester.fullname}
          </Text>
        </View>
        <Text className="text-sm text-slate-600 font-cereal">
          {format(ticket.createdAt.toString(), "dd MMMM yyyy")}
        </Text>
      </View>
    </Pressable>
  );
}
