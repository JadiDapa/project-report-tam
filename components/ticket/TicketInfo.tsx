import { View, Text } from "react-native";
import { Ticket } from "lucide-react-native";
import { CreateTicketType, TicketType } from "@/lib/types/ticket";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "@/lib/network/ticket";
import { useCustomToast } from "@/lib/useToast";
import { getAllAccounts } from "@/lib/network/account";
import SelectTicketExecutor from "./SelectTicketExecutor";

interface TicketInfoProps {
  ticket: TicketType;
}

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

  const { control } = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    values: {
      handler: ticket.handler ? ticket.handler : 0, // Default to 0 if no handler is assigned
    },
  });

  const { mutate: OnCreateTicket, isPending } = useMutation({
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

  function updateHandler(handlerId: number) {
    OnCreateTicket({ handler: handlerId });
  }

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

      <View className="px-6 py-6 mt-4 bg-white">
        <Text className="text-lg font-cereal-medium">Request Detail</Text>
        <Text className={`font-cereal text-justify text-slate-600 mt-2`}>
          {ticket.description}
        </Text>
      </View>
    </View>
  );
}
