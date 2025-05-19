import { View, Text } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import FloatingInput from "../FloatingInput";
import SelectSingleInput from "../SelectSingleInput";
import { getAllAccounts } from "@/lib/network/account";
import { useQuery } from "@tanstack/react-query";
import { TicketType } from "@/lib/types/ticket";
import z from "zod";
import { ticketSchema } from "@/app/(root)/ticket/[id]";

interface TicketResponseProps {
  control: Control<z.infer<typeof ticketSchema>>;
  errors: FieldErrors<z.infer<typeof ticketSchema>>;
}

export default function TicketResponse({
  control,
  errors,
}: TicketResponseProps) {
  const { data: accounts } = useQuery({
    queryFn: () => getAllAccounts(),
    queryKey: ["accounts"],
  });

  return (
    <View className="relative flex-1 py-12 mt-6 bg-white">
      <View className="relative flex flex-row items-center px-6 mb-6">
        <View className="flex-1 h-[1px] border-t border-dashed border-slate-500" />

        <Text className="px-6 text-center text-primary-500 font-cereal-medium">
          Ticket Response
        </Text>
        <View className="flex-1 h-[1px] border-t border-dashed border-slate-500" />
      </View>
      <View>
        {/* Ticket Full Name */}
        <View className="relative px-6 mb-7">
          <Controller
            control={control}
            name="response"
            render={({ field }) => (
              <FloatingInput
                label="Response"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={6}
              />
            )}
          />
          {errors.response && (
            <Text className="mt-1 text-red-400 font-cereal-regular">
              {errors.response.message}
            </Text>
          )}
        </View>

        {/* Account Role */}
        <View className="relative px-6">
          <Controller
            control={control}
            name="handler"
            render={({ field }) => (
              <SelectSingleInput
                value={field.value}
                onChange={field.onChange}
                options={
                  accounts?.map((account) => {
                    return { label: account.fullname, value: account.id };
                  }) || []
                }
                placeholder="Select Ticket Handler"
              />
            )}
          />
          {errors.handler && (
            <Text className="mt-1 text-red-400 font-cereal-regular">
              {errors.handler.message}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
