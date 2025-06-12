import { View, Text } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import FloatingInput from "../FloatingInput";
import z from "zod";
import { ticketMessageSchema } from "@/app/(root)/ticket/[id]";

interface TicketResponseProps {
  control: Control<z.infer<typeof ticketMessageSchema>>;
  errors: FieldErrors<z.infer<typeof ticketMessageSchema>>;
}

export default function TicketResponse({
  control,
  errors,
}: TicketResponseProps) {
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
      </View>
    </View>
  );
}
