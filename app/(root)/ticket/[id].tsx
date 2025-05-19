import {
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable,
  Text,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { X } from "lucide-react-native";

import LoadingScreen from "@/components/LoadingScreen";
import StackScreenHeader from "@/components/StackScreenHeader";
import TicketInfo from "@/components/ticket/TicketInfo";
import TicketResponse from "@/components/ticket/TicketResponse";
import { getTicketById, updateTicket } from "@/lib/network/ticket";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { CreateTicketType } from "@/lib/types/ticket";
import { useCustomToast } from "@/lib/useToast";
import { useAccount } from "@/contexts/AccountContexts";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ticketSchema = z.object({
  response: z.string(),
});

export default function TicketDetail() {
  const [isResponsing, setIsResponsing] = useState(false);

  const { id } = useLocalSearchParams();
  const { showToast } = useCustomToast();
  const { account } = useAccount();

  const scrollRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: ticket } = useQuery({
    queryFn: () => getTicketById(id as string),
    queryKey: ["ticket", id],
  });

  const toggleResponding = (value: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setIsResponsing(value);
  };

  useEffect(() => {
    if (isResponsing) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 10);
    }
  }, [isResponsing]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    values: {
      response: "",
    },
  });

  const { mutate: OnCreateTicket, isPending } = useMutation({
    mutationFn: (values: Partial<CreateTicketType>) =>
      updateTicket(ticket!.id.toString(), values),

    onSuccess: () => {
      showToast("Success", "Ticket Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      router.push({
        pathname: "/ticket",
      });
    },

    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Update The Ticket");
    },
  });

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    OnCreateTicket({ ...values, status: "processed", handler: account?.id });
  }

  async function onFinish(values: z.infer<typeof ticketSchema>) {
    OnCreateTicket({ ...values, status: "completed" });
  }

  if (!ticket) return <LoadingScreen />;

  return (
    <View className="flex-1 bg-primary-50">
      <StatusBar backgroundColor="#2d52d2" />
      <StackScreenHeader title="Ticket Detail" />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <TicketInfo ticket={ticket} />
        {isResponsing && <TicketResponse control={control} errors={errors} />}
      </ScrollView>

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        {ticket.status === "sent" && !isResponsing && (
          <Pressable onPress={() => toggleResponding(true)}>
            <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
              Handle Ticket
            </Text>
          </Pressable>
        )}

        {ticket.status === "sent" && isResponsing && (
          <View className="flex flex-row items-center gap-2">
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              className="flex-1"
            >
              <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
                Submit
              </Text>
            </Pressable>
            <Pressable onPress={() => toggleResponding(false)}>
              <View className="px-6 py-4 text-lg text-center rounded-md shadow-lg text-slate-700 font bg-slate-200 font-cereal-medium shadow-primary-500/50">
                <X size={24} color="#545454" />
              </View>
            </Pressable>
          </View>
        )}

        {ticket.status === "processed" && (
          <Pressable onPress={handleSubmit(onFinish)} disabled={isPending}>
            <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
              Check As Finished
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
