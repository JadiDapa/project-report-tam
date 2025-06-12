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
import { createTicketMessage, getTicketById } from "@/lib/network/ticket";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { CreateTicketType } from "@/lib/types/ticket";
import { useCustomToast } from "@/lib/useToast";
import { useAccount } from "@/contexts/AccountContexts";
import TicketMessages from "@/components/ticket/TicketMessages";
import { CreateTicketMessageType } from "@/lib/types/ticket-message";
import { io } from "socket.io-client";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ticketMessageSchema = z.object({
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  ticketId: z.number().min(1, "Ticket ID is required"),
  accountId: z.number().min(1, "Account ID is required"),
});

export const socket = io(process.env.EXPO_PUBLIC_BASE_API_URL_SOCKET);

export default function TicketDetail() {
  const [isResponsing, setIsResponsing] = useState(false);

  const { id } = useLocalSearchParams();
  const { showToast } = useCustomToast();

  const scrollRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();

  const { account } = useAccount();

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
  } = useForm<z.infer<typeof ticketMessageSchema>>({
    resolver: zodResolver(ticketMessageSchema),
    defaultValues: {
      content: "",
      image: "",
      ticketId: Number(id),
      accountId: account?.id || 0,
    },
  });

  const { mutate: onCreateTicketMessage, isPending } = useMutation({
    mutationFn: (values: CreateTicketMessageType) =>
      createTicketMessage(ticket!.id.toString(), values),
    onSuccess: () => {
      showToast("Success", "Meesage Sent Successfully");
      queryClient.invalidateQueries({ queryKey: ["tickets", ticket?.id] });
    },

    onError: (err) => {
      console.log(err);
      showToast("Error", "Failed To Send The Message");
    },
  });

  function onSubmit(values: z.infer<typeof ticketMessageSchema>) {
    onCreateTicketMessage(values, {
      onSuccess: (saved) => {
        socket.emit("send_message", saved); // broadcast real-time to others
      },
    });
    toggleResponding(false);
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
        <TicketMessages messages={ticket?.TicketMessages} />
        {isResponsing && <TicketResponse control={control} errors={errors} />}
      </ScrollView>

      <View className="absolute bottom-0 w-full px-6 py-4 bg-white border-t shadow-md border-slate-200">
        {ticket.status === "open" && !isResponsing && (
          <Pressable onPress={() => toggleResponding(true)}>
            <Text className="px-6 py-4 text-lg text-center text-white rounded-md shadow-lg font bg-primary-500 font-cereal-medium shadow-primary-500/50">
              Handle Ticket
            </Text>
          </Pressable>
        )}

        {ticket.status === "open" && isResponsing && (
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
      </View>
    </View>
  );
}
