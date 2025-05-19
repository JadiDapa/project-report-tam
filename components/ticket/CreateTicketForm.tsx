import { View, Text, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicket } from "@/lib/network/ticket";
import * as z from "zod";
import { useCustomToast } from "@/lib/useToast";
import { useRouter } from "expo-router";
import { CreateTicketType } from "@/lib/types/ticket";
import FloatingInput from "../FloatingInput";
import { useAccount } from "@/contexts/AccountContexts";

const ticketSchema = z.object({
  title: z.string().min(1, "Ticket Name is required"),
  description: z.string().min(1, "Description is required"),
  requester: z.number(),
});

export default function CreateTicketForm() {
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { account, loading } = useAccount();

  if (loading || !account) return <Text>Loading account...</Text>;

  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      requester: account?.id,
    },
  });

  const { mutate: OnCreateTicket, isPending } = useMutation({
    mutationFn: (values: CreateTicketType) => createTicket(values),

    onSuccess: () => {
      showToast("Success", "New Ticket Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      router.push({
        pathname: "/ticket",
      });
    },

    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Create Ticket");
    },
  });

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    OnCreateTicket(values);
  }

  return (
    <View className="flex-col justify-between flex-1 mt-14">
      <View>
        {/* Ticket Full Name */}
        <View className="relative px-6 mb-7">
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <FloatingInput
                label="Reason"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.title && (
            <Text className="mt-1 text-red-400 font-cereal-regular">
              {errors.title.message}
            </Text>
          )}
        </View>

        {/* Ticket Full Name */}
        <View className="relative px-6 mb-6 ">
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <FloatingInput
                label="Detail"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={6}
              />
            )}
          />
          {errors.description && (
            <Text className="mt-1 text-red-400 font-cereal-regular">
              {errors.description.message}
            </Text>
          )}
        </View>
      </View>

      <View className="w-full px-6 py-4 bg-white border-t shadow-md mt-7 border-slate-200">
        <Pressable onPress={handleSubmit(onSubmit)} disabled={isPending}>
          <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
            {isPending ? "Upload..." : "Upload Ticket"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
