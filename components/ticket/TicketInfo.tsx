import { View, Text } from "react-native";
import { Ticket } from "lucide-react-native";
import { CreateTicketType, TicketType } from "@/lib/types/ticket";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTicketMessage, updateTicket } from "@/lib/network/ticket";
import { useCustomToast } from "@/lib/useToast";
import { getAllAccounts } from "@/lib/network/account";
import SelectTicketExecutor from "./SelectTicketExecutor";
import { useAccount } from "@/contexts/AccountContexts";
import { CreateTicketMessageType } from "@/lib/types/ticket-message";
import { socket } from "@/app/(root)/ticket/[id]";

interface TicketInfoProps {
  ticket: TicketType;
}

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

export const ticketSchema = z.object({
  handler: z.number(),
});

export default function TicketInfo({ ticket }: TicketInfoProps) {
  const { data: accounts } = useQuery({
    queryFn: () => getAllAccounts(),
    queryKey: ["accounts"],
  });

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { account } = useAccount(); // <-- Get the current logged in account

  const { control } = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    values: {
      handler: ticket.handler ?? 0,
    },
  });

  const { mutate: onUpdateTicket } = useMutation({
    mutationFn: (values: Partial<CreateTicketType>) =>
      updateTicket(ticket!.id.toString(), values),

    onSuccess: () => {
      showToast("Success", "Ticket Executor Assigned Successfully");
      queryClient.invalidateQueries({ queryKey: ["tickets", ticket?.id] });
    },

    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Update The Ticket");
    },
  });

  const { mutate: onCreateTicketMessage } = useMutation({
    mutationFn: (values: CreateTicketMessageType) =>
      createTicketMessage(ticket!.id.toString(), values),
    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Create Message");
    },
  });

  function updateHandler(handlerId: number) {
    // Only proceed if the handler actually changed
    if (ticket.handler !== handlerId) {
      onUpdateTicket(
        { handler: handlerId },
        {
          onSuccess: () => {
            // Get handler name from accounts
            const handlerAccount = accounts?.find(
              (acc) => acc.id === handlerId
            );
            const handlerName = handlerAccount?.fullname || "Unknown";

            const messageContent = `${handlerName} Assigned As Handler`;

            const message: CreateTicketMessageType = {
              content: messageContent,
              image: "",
              ticketId: ticket.id,
              accountId: account?.id ?? 0,
              type: "assign-handler", // <-- Custom type
            };

            onCreateTicketMessage(message, {
              onSuccess: (savedMessage) => {
                socket.emit("send_message", savedMessage);
              },
            });
          },
        }
      );
    }
  }

  const currentStatus = ticketStatus.find(
    (st) => st.status.toLowerCase() === ticket.status?.toLowerCase()
  );

  return (
    <View className="relative flex-1 mt-2">
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
        {currentStatus && (
          <View
            className=" py-0.5 px-2 w-32 overflow-hidden mt-2 mx-auto text-sm rounded-full"
            style={{ backgroundColor: currentStatus.color }}
          >
            <Text className="text-sm text-center text-white capitalize font-cereal-medium">
              {currentStatus.status}
            </Text>
          </View>
        )}
      </View>

      <View className="flex flex-row justify-between px-6 py-6 mt-3 bg-white">
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

          {accounts && ticket && (
            <Controller
              control={control}
              name="handler"
              render={({ field }) => (
                <SelectTicketExecutor
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    updateHandler(Number(value));
                  }}
                  options={
                    accounts?.map((account) => ({
                      label: account.fullname,
                      value: account.id,
                    })) || []
                  }
                  placeholder="Select Executor"
                />
              )}
            />
          )}
        </View>
      </View>

      <View className="px-6 py-6 mt-3 bg-white">
        <Text className="text-lg font-cereal-medium">Request Detail</Text>
        <Text className={`font-cereal text-justify text-slate-600 mt-2`}>
          {ticket.description}
        </Text>
      </View>
    </View>
  );
}
