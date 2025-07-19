import { View, Text } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import FloatingInput from "../FloatingInput";
import z from "zod";
import { ticketMessageSchema } from "@/app/(root)/ticket/[id]";
import SelectSingleInput from "../SelectSingleInput";
import { ticketStatus } from "./TicketCard";
import { AccountType } from "@/lib/types/account";

interface TicketResponseProps {
  control: Control<z.infer<typeof ticketMessageSchema>>;
  errors: FieldErrors<z.infer<typeof ticketMessageSchema>>;
  account: AccountType;
}

export default function TicketResponse({
  control,
  errors,
  account,
}: TicketResponseProps) {
  const isManager = account.Role?.Features?.some(
    (feature) => feature.name === "Manage Ticket"
  );
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
            name="content"
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

          {errors.content && (
            <Text className="mt-1 text-red-400 font-cereal-regular">
              {errors.content.message}
            </Text>
          )}
        </View>

        {isManager && (
          <View className="relative px-6 mb-7">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SelectSingleInput
                  value={field.value}
                  options={ticketStatus.map((status) => ({
                    label: typeof status === "string" ? status : status.status,
                    value: typeof status === "string" ? status : status.status,
                  }))}
                  onChange={field.onChange}
                  placeholder="Select Task Type"
                />
              )}
            />
            {errors.status && (
              <Text className="mt-1 text-red-400 font-cereal-regular">
                {errors.status.message}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
