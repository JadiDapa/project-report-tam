import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { TicketType } from "@/lib/types/ticket";
import { format } from "date-fns";
import { Ticket } from "lucide-react-native";

export default function YourTicketCard({ ticket }: { ticket: TicketType }) {
  const router = useRouter();
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
        <View className="flex flex-row items-center gap-2 p-1 px-3 rounded-full bg-primary-500">
          <Ticket color="#fff" size={16} />
          <Text className="text-white font-cereal-light">{ticket.code}</Text>
        </View>

        <View className="w-20 p-1 px-3 overflow-hidden text-sm rounded-full bg-slate-200 text-slate-600 ">
          <Text className="text-center capitalize text-slate-600 font-cereal-medium">
            {ticket.status}
          </Text>
        </View>
      </View>

      <Text className="mt-4 font-cereal-bold text-slate-700 line-clamp-2">
        {ticket.title}
      </Text>
      <Text className="mt-1 text-sm font-cereal-regular text-slate-500 line-clamp-2">
        {ticket.description}
      </Text>

      <View className="flex-row items-center justify-between gap-1 mt-4">
        <View className="flex flex-row items-center">
          <Text className="text-sm text-slate-500 font-cereal-medium">
            Handler:{" "}
          </Text>
          <Text className="text-sm text-primary-500 font-cereal-medium">
            {ticket.Handler?.fullname || "Not Assigned"}
          </Text>
        </View>
        <Text className="text-sm text-slate-600 font-cereal">
          {format(ticket.createdAt.toString(), "dd MMMM yyyy")}
        </Text>
      </View>
    </Pressable>
  );
}
