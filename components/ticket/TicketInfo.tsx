import { View, Text } from "react-native";
import { Ticket } from "lucide-react-native";
import { TicketType } from "@/lib/types/ticket";

interface TicketInfoProps {
  ticket: TicketType;
}

export default function TicketInfo({ ticket }: TicketInfoProps) {
  return (
    <View className="relative flex-1">
      <View className="px-6 py-6 bg-white">
        <View className="flex flex-row items-center justify-center gap-2 ">
          <Ticket color="#444" size={24} />
          <Text className="text-lg text-center font-cereal-medium text-slate-700">
            TICKET
          </Text>
          <Ticket color="#444" size={24} />
        </View>

        <Text className="text-xl text-center font-cereal-medium text-primary-500">
          {ticket.code}
        </Text>

        <Text className="mt-4 text-lg leading-tight text-center font-cereal-medium">
          {ticket.title}
        </Text>
      </View>

      <View className="flex flex-row justify-between px-6 py-6 mt-4 bg-white">
        <View>
          <Text className="text-sm font-cereal-medium text-primary-500">
            Requester
          </Text>
          <Text className=" font-cereal-medium">
            {ticket.Requester.fullname}
          </Text>
        </View>
        <View className="flex flex-col items-end text-sm">
          <Text className=" font-cereal-medium text-end text-primary-500">
            Handler
          </Text>
          <Text className=" font-cereal-medium text-end">
            {ticket.Handler?.fullname || "Not Assigned"}
          </Text>
        </View>
      </View>

      <View className="px-6 py-6 mt-4 bg-white">
        <Text className="text-lg font-cereal-medium">Request Detail</Text>
        <Text className={`font-cereal text-justify text-slate-600 mt-2`}>
          {ticket.description}
        </Text>
      </View>
    </View>
  );
}
